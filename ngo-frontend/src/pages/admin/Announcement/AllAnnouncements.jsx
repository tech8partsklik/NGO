import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import Skeleton from "react-loading-skeleton";

import {
    getAllAnnouncements,
    deleteAnnouncement
} from "../../../services/announcement.service";

import AddAnnouncementModal from "./AddAnnouncementModal";
import EditAnnouncementModal from "./EditAnnouncementModal";
import ConfirmDeleteModal from "../../../common/ConfirmDeleteModal";

export default function AllAnnouncements() {
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const isExpired = (date) => {
        if (!date) return false;
        return new Date(date) < new Date();
    };

    //   const filtered = announcements.filter(
    //     (a) => a.is_active && !isExpired(a.expiring_at)
    //   );

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllAnnouncements();
            if (res?.status === 1) {
                setAnnouncements(res.data || []);
            } else {
                toast.error("Failed to load announcements");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error loading");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);




    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openDeleteModal = (id) => {
        setSelectedId(id);
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => {
        if (deleteLoading) return; // prevent closing while deleting

        setShowDeleteModal(false);
        setSelectedId(null);
    };


    const handleDelete = async () => {
        if (!selectedId) return;

        setDeleteLoading(true);
        const toastId = toast.loading("Deleting announcement...");

        try {
            await deleteAnnouncement({ pk: selectedId });

            toast.success("Deleted", { id: toastId });

            setShowDeleteModal(false);
            setSelectedId(null);

            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Delete failed ❌", { id: toastId });
        } finally {
            setDeleteLoading(false);
        }
    };


    return (
        <>
            <div className="d-flex justify-content-between mb-3">
                <h5>Announcements</h5>
                <button className="btn btn-dark" onClick={() => setShowAdd(true)}>
                    + Add Announcement
                </button>
            </div>

            <div className="main-table">
                <table className="table table-bordered mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Text</th>
                            <th>Status</th>
                            <th>Expires</th>
                            <th style={{ width: 120 }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(5)].map((_, j) => (
                                        <td key={j}><Skeleton height={24} /></td>
                                    ))}
                                </tr>
                            ))
                        ) : announcements.length ? (
                            announcements.map((a, i) => (
                                <tr key={a.id}>
                                    <td>{i + 1}</td>
                                    <td>{a.text}</td>

                                    <td>
                                        <span className={`badge ${a.is_active ? "bg-success" : "bg-danger"}`}>
                                            {a.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td>{a.expiring_at || "N/A"}</td>

                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm me-1"
                                            onClick={() => setEditItem(a)}
                                        >
                                            <i className="fa fa-pen"></i>
                                        </button>

                                        <button className="btn btn-danger" onClick={() => openDeleteModal(a.id)}>
                                            <i className="fa fa-trash"></i>
                                        </button>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-4 text-center">
                                    No Active Announcements
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODALS */}
            {showAdd && (
                <AddAnnouncementModal
                    show={showAdd}
                    onHide={() => setShowAdd(false)}
                    onSuccess={fetchData}
                />
            )}

            {editItem && (
                <EditAnnouncementModal
                    show={!!editItem}
                    onHide={() => setEditItem(null)}
                    announcement={editItem}
                    onSuccess={fetchData}
                />
            )}


            {showDeleteModal && (
                <ConfirmDeleteModal
                    show={showDeleteModal}
                    onHide={handleCloseDeleteModal} 
                    onConfirm={handleDelete}
                    loading={deleteLoading}
                    title="Delete Announcement"
                    message="Are you sure you want to delete this announcement?"
                />
            )}

        </>
    );
}
