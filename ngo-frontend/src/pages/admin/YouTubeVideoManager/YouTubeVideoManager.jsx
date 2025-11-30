// YouTubeVideoManager.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";

import {
    addYouTubeVideo,
    getYouTubeVideos,
    deleteYouTubeVideo,
    updateYouTubeVideo,
} from "../../../services/youtubeVideo.service";

import FilterTopBar from "../../../common/FilterTopBar/FilterTopBar";
import ConfirmDeleteModal from "../../../common/ConfirmDeleteModal";
import { debounce } from "../../../utils/debounce";

import { Modal, Button } from "react-bootstrap";

export default function YouTubeVideoManager() {
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);

    

    // Search Only
    const [searchQuery, setSearchQuery] = useState("");

    // Modals
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        youtube_video_id: "",
        is_active: true,
    });

    // Load data
    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getYouTubeVideos();
            if (res.status === 1) setVideos(res.data || []);
        } catch (err) {
            toast.error("Failed to load videos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Debounced Search
    const debouncedSearch = useCallback(
        debounce((q) => {
            setSearchQuery(q);
        }, 300),
        []
    );

    // Filter videos
    const filteredVideos = videos.filter((v) => {
        return (
            v.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.youtube_video_id?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Add Modal
    const openAddModal = () => {
        setEditingId(null);
        setForm({
            title: "",
            subtitle: "",
            youtube_video_id: "",
            is_active: true,
        });
        setShowModal(true);
    };

    // Edit Modal
    const openEditModal = (v) => {
        setEditingId(v.id);
        setForm({
            title: v.title,
            subtitle: v.subtitle,
            youtube_video_id: v.youtube_video_id,
            is_active: v.is_active,
        });
        setShowModal(true);
    };

    // Save Video
    const handleSave = async () => {
        if (!form.youtube_video_id.trim())
            return toast.error("YouTube Video ID is required");

        if (!form.title.trim()) return toast.error("Title is required");

        setSaving(true);
        const toastId = toast.loading(editingId ? "Updating..." : "Adding...");

        try {
            if (editingId) {
                // 🔥 UPDATE
                await updateYouTubeVideo({
                    id: editingId,
                    ...form,
                });
            } else {
                // 🔥 ADD
                await addYouTubeVideo(form);
            }

            toast.success(editingId ? "Video Updated" : "Video Added", { id: toastId });

            setShowModal(false);
            loadData();
        } catch (err) {
            toast.error("Failed", { id: toastId });
        } finally {
            setSaving(false);
        }
    };


    // Delete
    const handleDelete = async () => {
        const toastId = toast.loading("Deleting...");

        try {
            await deleteYouTubeVideo(deleteId);

            toast.success("Deleted", { id: toastId });
            setShowDelete(false);
            loadData();
        } catch (err) {
            toast.error("Delete failed", { id: toastId });
        }
    };

    // Clear filters
    const handleClearFilters = () => setSearchQuery("");

    const isFilterApplied = () => searchQuery !== "";

    return (
        <>
            {/* Breadcrumb */}
            <nav>
                <ol className="breadcrumb mb-2">
                    <li className="breadcrumb-item">
                        <Link to="/admin/dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">YouTube Videos</li>
                </ol>
            </nav>

            {/* Search Bar Only */}
            <FilterTopBar
                defaultSearch={searchQuery}
                onSearch={(q) => debouncedSearch(q)}
                onClear={handleClearFilters}
                isFilterApplied={isFilterApplied()}
                menus={[
                    {
                        name: "Add Video",
                        icon: <i className="fa fa-plus me-1"></i>,
                        className: "btn-dark",
                        onClick: openAddModal,
                    },
                ]}
            />

            {/* Table */}
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
                        ) : filteredVideos.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-4 text-center">
                                    No videos found
                                </td>
                            </tr>
                        ) : (
                            filteredVideos.map((v) => (
                                <tr key={v.id}>
                                    <td>{v.id}</td>

                                    <td>
                                        <iframe
                                            width="90"
                                            height="55"
                                            src={`https://www.youtube.com/embed/${v.youtube_video_id}`}
                                            className="rounded"
                                        ></iframe>
                                    </td>

                                    <td>{v.title}</td>
                                    <td>{v.subtitle}</td>

                                    <td>
                                        {v.is_active ? (
                                            <span className="badge bg-success">Active</span>
                                        ) : (
                                            <span className="badge bg-danger">Inactive</span>
                                        )}
                                    </td>

                                    <td className="text-nowrap">
                                        <button
                                            className="btn btn-primary btn-sm me-1"
                                            onClick={() => openEditModal(v)}
                                        >
                                            <i className="fa fa-pen"></i>
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => {
                                                setDeleteId(v.id);
                                                setShowDelete(true);
                                            }}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ADD / EDIT MODAL (React-Bootstrap) */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? "Edit Video" : "Add Video"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">YouTube Video ID</label>
                        <input
                            className="form-control"
                            placeholder="ysz5S6PUM-U"
                            value={form.youtube_video_id}
                            onChange={(e) =>
                                setForm({ ...form, youtube_video_id: e.target.value })
                            }
                        />
                    </div>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Title</label>
                            <input
                                className="form-control"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Subtitle</label>
                            <input
                                className="form-control"
                                value={form.subtitle}
                                onChange={(e) =>
                                    setForm({ ...form, subtitle: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-3">
                        <label className="form-label mb-1">Status</label>
                        <div className="d-flex align-items-center">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) =>
                                        setForm({ ...form, is_active: e.target.checked })
                                    }
                                />
                                <span className="slider round"></span>
                            </label>
                            <span className="ms-2 fw-semibold">
                                {form.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="dark" disabled={saving} onClick={handleSave}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* DELETE MODAL */}
            {showDelete && (
                <ConfirmDeleteModal
                    show={showDelete}
                    onHide={() => setShowDelete(false)}
                    onConfirm={handleDelete}
                    message="Are you sure you want to delete this video?"
                />
            )}
        </>
    );
}
