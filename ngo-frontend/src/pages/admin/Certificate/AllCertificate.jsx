import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";

import { listCertificates, deleteCertificate } from "../../../services/certificate.service";
import { BASE_MEDIA_URL } from "../../../services/endpoints";

import { debounce } from "../../../utils/debounce";
import FilterTopBar from "../../../common/FilterTopBar/FilterTopBar";
import Pagination from "../../../common/Pagination/Pagination";
import ConfirmDeleteModal from "../../../common/ConfirmDeleteModal";
import { detectFileType } from "../../../utils/detectFileType";

export default function AllCertificates() {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState([]);

    // ---------------- Pagination State ----------------
    const [currentPage, setCurrentPage] =
        useState(Number(new URLSearchParams(location.search).get("current_page")) || 1);

    const [pageSize, setPageSize] =
        useState(Number(new URLSearchParams(location.search).get("page_size")) || 10);

    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);

    // ---------------- Search ----------------
    const [searchQuery, setSearchQuery] = useState(
        new URLSearchParams(location.search).get("search") || ""
    );

    // ---------------- DELETE MODAL ----------------
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        const toastId = toast.loading("Deleting Certificate...");
        setDeleteLoading(true);

        try {
            await deleteCertificate(deleteId);

            toast.success("Certificate deleted successfully", { id: toastId });
            setShowDeleteModal(false);

            fetchData();

        } catch (err) {
            console.error(err);
            toast.error("Delete failed", { id: toastId });
        } finally {
            setDeleteLoading(false);
        }
    };

    // ---------------- Fetch Certificates ----------------
    const fetchData = async () => {
        setLoading(true);

        try {
            const res = await listCertificates();

            if (res?.status === 1) {
                setCertificates(res.data || []);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load certificates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ---------------- Frontend Search + Pagination ----------------
    const filteredData = certificates.filter((item) => {
        const searchLower = searchQuery.toLowerCase();

        return (
            item.title?.toLowerCase().includes(searchLower) ||
            item.subtitle?.toLowerCase().includes(searchLower)
        );
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

        params.set("current_page", currentPage);
        params.set("page_size", pageSize);

        navigate(`?${params.toString()}`, { replace: true });
    }, [searchQuery, currentPage, pageSize]);

    const menus = [
        {
            name: "Add Certificate",
            icon: <i className="fa fa-plus me-1"></i>,
            className: "btn-dark",
            onClick: () => navigate("/admin/certificates/add"),
        },
    ];

    const handleClearAllFilter = () => {
        setSearchQuery("");
        setCurrentPage(1);
    };

    const isFilterApplied = () => searchQuery !== "";

    return (
        <>
            {/* ================= BREADCRUMB ================= */}
            <nav>
                <ol className="breadcrumb mb-2">
                    <li className="breadcrumb-item">
                        <Link to="/admin/dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Certificates</li>
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
                            <th>Subtitle</th>
                            <th>Status</th>
                            <th style={{ width: 120 }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            [...Array(7)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(6)].map((_, j) => (
                                        <td key={j}>
                                            <Skeleton height={26} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : paginatedData.length > 0 ? (
                            paginatedData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>
                                        {item.file ? (
                                            detectFileType(item.file) === "Video" ? (
                                                // VIDEO PREVIEW
                                                <video
                                                    src={`${BASE_MEDIA_URL}${item.file}`}
                                                    width="70"
                                                    height="50"
                                                    className="rounded"
                                                    muted
                                                    loop
                                                />
                                            ) : detectFileType(item.file) === "Image" ? (
                                                // IMAGE PREVIEW
                                                <img
                                                    src={`${BASE_MEDIA_URL}${item.file}`}
                                                    width="70"
                                                    height="50"
                                                    className="object-fit-cover rounded"
                                                    alt="certificate"
                                                />
                                            ) : (
                                                // UNKNOWN TYPE → N/A
                                                <div
                                                    className="bg-secondary text-white d-flex align-items-center justify-content-center"
                                                    style={{ width: 70, height: 45 }}
                                                >
                                                    N/A
                                                </div>
                                            )
                                        ) : (
                                            // NO FILE → N/A
                                            <div
                                                className="bg-secondary text-white d-flex align-items-center justify-content-center"
                                                style={{ width: 70, height: 45 }}
                                            >
                                                N/A
                                            </div>
                                        )}
                                    </td>

                                    <td>{item.title}</td>
                                    <td>{item.subtitle || "-"}</td>

                                    <td>
                                        {item.is_active ? (
                                            <span className="badge bg-success">Active</span>
                                        ) : (
                                            <span className="badge bg-warning text-dark">Inactive</span>
                                        )}
                                    </td>

                                    <td className="text-nowrap">
                                        <Link
                                            to={`/admin/certificates/${item.id}`}
                                            className="btn btn-primary btn-sm me-1"
                                        >
                                            <i className="fa fa-pen"></i>
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => openDeleteModal(item.id)}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-4 text-center">
                                    No certificates found
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
                    title="Delete Certificate"
                    message="Are you sure you want to delete this certificate?"
                />
            )}
        </>
    );
}
