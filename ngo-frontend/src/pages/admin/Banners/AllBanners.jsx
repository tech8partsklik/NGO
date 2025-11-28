import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";

import { getAllBanners, deleteBanner } from "../../../services/banner.service";
import { BASE_MEDIA_URL } from "../../../services/endpoints";

import { Modal, Button } from "react-bootstrap";


export default function AllBanners() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [banners, setBanners] = useState([]);

    // ======================
    // FETCH BANNERS
    // ======================
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllBanners();
            if (res?.status === 1) {
                setBanners(res.data || []);
            } else {
                toast.error("Failed to load banners");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const [showModal, setShowModal] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);


    const openDeleteModal = (banner) => {
        setSelectedBanner(banner);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!selectedBanner) return;

        setDeleteLoading(true);

        const toastId = toast.loading("Deleting banner...");

        try {
            await deleteBanner(selectedBanner.id);

            toast.success("Banner deleted successfully ✅", { id: toastId });

            setShowModal(false);
            setSelectedBanner(null);

            fetchData();  // refresh

        } catch (error) {
            console.error(error);

            const msg =
                error?.response?.data?.message ||
                "Failed to delete banner ❌";

            toast.error(msg, { id: toastId });

        } finally {
            setDeleteLoading(false);
        }
    };





    return (
        <>

            {/* ================= BREADCRUMB ================= */}





            {/* ================= HEADER ================= */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <nav>
                    <ol className="breadcrumb mb-2">
                        <li className="breadcrumb-item">
                            <Link to="/admin/dashboard">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active">Banners</li>
                    </ol>
                </nav>

                <button
                    className="btn btn-dark"
                    onClick={() => navigate("/admin/banners/add")}
                >
                    <i className="fa-solid fa-plus me-1"></i>
                    Add Banner
                </button>
            </div>

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

                        {/* LOADING */}
                        {loading ? (
                            [...Array(7)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(7)].map((_, j) => (
                                        <td key={j}>
                                            <Skeleton height={24} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : banners.length > 0 ? (

                            banners.map((banner, index) => (
                                <tr key={banner.id}>
                                    <td>{index + 1}</td>

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
                                                alt="banner"
                                            />
                                        )}
                                    </td>

                                    <td>{banner.title}</td>

                                    <td>{banner.position}</td>

                                    <td>
                                        <span className="badge bg-info">
                                            {banner.file_type}
                                        </span>
                                    </td>

                                    <td>
                                        {banner.is_active ? (
                                            <span className="badge bg-success">Active</span>
                                        ) : (
                                            <span className="badge bg-danger">Inactive</span>
                                        )}
                                    </td>

                                    <td className="text-nowrap">

                                        {/* EDIT */}
                                        <Link
                                            to={`/admin/banners/edit/${banner.id}`}
                                            className="btn btn-primary me-1"
                                        >
                                            <i className="fa fa-pen"></i>
                                        </Link>

                                        {/* DELETE */}
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => openDeleteModal(banner)}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>


                                    </td>
                                </tr>
                            ))

                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data-found py-4">
                                    No Banners Found
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>
            </div>





            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Banner</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Are you sure you want to delete this banner?

                    <div className="mt-2 p-2 bg-light rounded">
                        <strong>{selectedBanner?.title}</strong>
                        <br />
                        <small>Position : {selectedBanner?.position}</small>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>

                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? "Deleting..." : "Yes, Delete"}
                    </Button>

                </Modal.Footer>
            </Modal>

        </>
    );
}
