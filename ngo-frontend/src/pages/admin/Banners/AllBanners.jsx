import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";

import { getAllBanners, deleteBanner } from "../../../services/banner.service";
import { BASE_MEDIA_URL } from "../../../services/endpoints";

import { debounce } from "../../../utils/debounce";
import FilterTopBar from "../../../common/FilterTopBar/FilterTopBar";
import Pagination from "../../../common/Pagination/Pagination";
import ConfirmDeleteModal from "../../../common/ConfirmDeleteModal";


export default function AllBanners() {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [banners, setBanners] = useState([]);

    // ---------------- Pagination State ----------------
    const [currentPage, setCurrentPage] =
        useState(Number(new URLSearchParams(location.search).get("current_page")) || 1);

    const [pageSize, setPageSize] =
        useState(Number(new URLSearchParams(location.search).get("page_size")) || 10);

    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);

    // ---------------- Search / Filters ----------------
    const [searchQuery, setSearchQuery] = useState(
        new URLSearchParams(location.search).get("search") || ""
    );

    const [type, setType] = useState(
        new URLSearchParams(location.search).get("type") || ""
    ); // Image / Video


    // ---------------- DELETE MODAL ----------------
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBannerId, setSelectedBannerId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);


    const openDeleteModal = (id) => {
        setSelectedBannerId(id);
        setShowDeleteModal(true);
    };


    const handleDelete = async () => {
        if (!selectedBannerId) return;

        setDeleteLoading(true);
        const toastId = toast.loading("Deleting banner...");

        try {
            await deleteBanner(selectedBannerId);

            toast.success("Banner deleted successfully", { id: toastId });
            setShowDeleteModal(false);

            fetchData(currentPage);

        } catch (err) {
            console.error(err);
            toast.error("Delete failed", { id: toastId });
        } finally {
            setDeleteLoading(false);
        }
    };


    // ---------------- Fetch Banners ----------------
    const fetchData = async () => {
        setLoading(true);

        try {
            const res = await getAllBanners();

            if (res?.status === 1) {
                setBanners(res.data || []);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load banners");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);


    // ---------------- Frontend Search + Filters + Pagination ----------------
    const filteredData = banners.filter((b) => {
        const matchesSearch =
            b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.position?.toString().includes(searchQuery);

        const matchesType = type ? b.file_type === type : true;

        return matchesSearch && matchesType;
    });

    const totalFiltered = filteredData.length;

    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    useEffect(() => {
        setTotalRows(totalFiltered);
        setTotalPages(Math.ceil(totalFiltered / pageSize));
    }, [totalFiltered, pageSize]);


    // ---------------- Debounced Search ----------------
    const debouncedSearch = useCallback(
        debounce((q) => {
            setSearchQuery(q);
            setCurrentPage(1);
        }, 300),
        []
    );


    // ---------------- Update URL Params ----------------
    useEffect(() => {
        const params = new URLSearchParams();

        if (searchQuery) params.set("search", searchQuery);
        if (type) params.set("type", type);

        params.set("current_page", currentPage);
        params.set("page_size", pageSize);

        navigate(`?${params.toString()}`, { replace: true });
    }, [searchQuery, type, currentPage, pageSize]);


    // ---------------- Menu Buttons for FilterTopBar ----------------
    const menus = [
        {
            name: "Add Banner",
            icon: <i className="fa fa-plus me-1"></i>,
            className: "btn-dark",
            onClick: () => navigate("/admin/banners/add")
        },
        {
            type: "dropdown",
            label: "Type Filter",
            items: [
                { name: "Image", onClick: () => setType("Image") },
                { name: "Video", onClick: () => setType("Video") },
                ...(type ? [{ name: "Clear Type Filter", onClick: () => setType("") }] : [])]
        }
    ];


    const handleClearAllFilter = () => {
        setSearchQuery("");
        setType("");
        setCurrentPage(1);
    };


    const isFilterApplied = () => searchQuery !== "" || type !== "";


    return (
        <>
            {/* ================= BREADCRUMB ================= */}
            <nav>
                <ol className="breadcrumb mb-2">
                    <li className="breadcrumb-item">
                        <Link to="/admin/dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Banners</li>
                </ol>
            </nav>

            {/* ================= FILTER BAR ================= */}
            <FilterTopBar
                defaultSearch={searchQuery}
                onSearch={(q) => debouncedSearch(q)}
                onClear={handleClearAllFilter}
                isFilterApplied={isFilterApplied()}
                menus={menus}
            />


            {/* ================= MAIN TABLE ================= */}
            <div className="main-table">
                <table className="table table-bordered mb-0">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Preview</th>
                            <th>Title</th>
                            <th>Position</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th style={{ width: 120 }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {loading ? (
                            [...Array(7)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(7)].map((_, j) => (
                                        <td key={j}><Skeleton height={26} /></td>
                                    ))}
                                </tr>
                            ))

                        ) : paginatedData.length > 0 ? (

                            paginatedData.map((banner, index) => (
                                <tr key={banner.id}>
                                    <td>{(currentPage - 1) * pageSize + index + 1}</td>

                                    {/* PREVIEW */}
                                    <td>
                                        {banner.file_type === "Video" ? (
                                            <video
                                                src={`${BASE_MEDIA_URL}${banner.file}`}
                                                width="70"
                                                height="45"
                                                muted
                                                loop
                                            />
                                        ) : (
                                            <img
                                                src={`${BASE_MEDIA_URL}${banner.file}`}
                                                width="70"
                                                height="45"
                                                className="object-fit-cover rounded"
                                            />
                                        )}
                                    </td>

                                    <td>{banner.title}</td>
                                    <td>{banner.position}</td>

                                    <td>
                                        <span className="badge bg-info">{banner.file_type}</span>
                                    </td>

                                    <td>
                                        {banner.is_active ? (
                                            <span className="badge bg-success">Active</span>
                                        ) : (
                                            <span className="badge bg-danger">Inactive</span>
                                        )}
                                    </td>

                                    <td className="text-nowrap">
                                        <Link
                                            to={`/admin/banners/edit/${banner.id}`}
                                            className="btn btn-primary btn-sm me-1"
                                        >
                                            <i className="fa fa-pen"></i>
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => openDeleteModal(banner.id)}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))

                        ) : (
                            <tr>
                                <td colSpan="7" className="py-4 text-center">
                                    No banners found
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>


            {/* ================= PAGINATION ================= */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalRows}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setCurrentPage={setCurrentPage}
                disabled={loading}
            />


            {/* ================= DELETE MODAL ================= */}
            {showDeleteModal && (
                <ConfirmDeleteModal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    loading={deleteLoading}
                    title="Delete Banner"
                    message="Are you sure you want to delete this banner?"
                />
            )}

        </>
    );
}
