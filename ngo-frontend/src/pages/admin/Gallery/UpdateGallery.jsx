import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getAllGallery,
    updateGallery
} from "../../../services/gallery.service";

import MediaUploader from "../../../components/admin/Helps/MediaUploader/MediaUploader";
import RichTextEditor from "../../../components/admin/Helps/RichTextEditor";
import { BASE_MEDIA_URL } from "../../../services/endpoints";
import { detectFileType } from "../../../utils/detectFileType";

export default function UpdateGallery() {
    const { id } = useParams();
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [galleryItem, setGalleryItem] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        button_text: "",
        button_url: "",
        file_type: "Image",
        is_active: 1
    });

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const res = await getAllGallery({
                ids: [id],
                search: "",
                page_number: 1,
                page_size: 1
            });

            if (res?.status === 1 && res.data.length) {
                const data = res.data[0];

                setGalleryItem(data);

                setForm({
                    title: data.title || "",
                    description: data.description || "",
                    button_text: data.button_text || "",
                    button_url: data.button_url || "",
                    file_type: data.file_type || "Image",
                    is_active: data.is_active ? 1 : 0
                });

                setPreview({ url: `${BASE_MEDIA_URL}${data.file}` });

                setTimeout(() => inputRef.current?.focus(), 300);

            } else {
                toast.error("Gallery Item not found");
                navigate("/admin/gallery");
            }
        } catch (err) {
            toast.error("Failed to load item");
        }
    };

    const handleMediaChange = (selectedFile) => {
        if (!selectedFile) return;

        setFile(selectedFile);

        const fileType = detectFileType(selectedFile.name);

        setForm((prev) => ({
            ...prev,
            file_type: fileType
        }));

        setPreview({
            url: URL.createObjectURL(selectedFile),
            type: detectFileType(selectedFile.name).toLowerCase()
        });

    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim()) return toast.error("Title is required");

        setLoading(true);
        const toastId = toast.loading("Updating...");

        try {
            const fd = new FormData();

            fd.append("pk", id);

            // Detect final file_type safely
            let finalFileType = form.file_type;

            if (file) {
                finalFileType = detectFileType(file.name);
                fd.append("file_type", finalFileType);
                fd.append("file", file);
            }

            // Append other fields
            Object.keys(form).forEach((key) => {
                if (key !== "file_type") {
                    fd.append(key, form[key]);
                }
            });

            await updateGallery(fd);

            toast.success("Updated successfully", { id: toastId });
            navigate("/admin/gallery");

        } catch (err) {
            toast.error("Update failed", { id: toastId });
        } finally {
            setLoading(false);
        }
    };


    if (!galleryItem) return null;

    return (
        <div className="max-width">

            <div className="sticky-header d-flex justify-content-between align-items-center">
                <div>
                    <ol className="breadcrumb mb-1">
                        <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/gallery">Gallery</Link></li>
                        <li className="breadcrumb-item active">Edit Gallery Item</li>
                    </ol>
                    <h4 className="fw-semibold mb-0">Update Gallery Item</h4>
                </div>

                <button
                    className="btn btn-dark px-4"
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {loading ? "Updating..." : "Update Item"}
                </button>
            </div>

            <div className="card p-4 shadow-sm">

                <h6 className="fw-bold text-uppercase mb-3">Update Media</h6>

                <MediaUploader
                    label="Media"
                    accept="both"
                    multiple={false}
                    onChange={handleMediaChange}
                    value={preview?.url}
                />

                <hr className="my-4" />

                <h6 className="fw-bold text-uppercase mb-3">Item Details</h6>

                <div className="row g-4">

                    <div className="col-md-6">
                        <label className="form-label">Title</label>
                        <input
                            ref={inputRef}
                            className="form-control"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Button Text</label>
                        <input
                            className="form-control"
                            value={form.button_text}
                            onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Button URL</label>
                        <input
                            className="form-control"
                            value={form.button_url}
                            onChange={(e) => setForm({ ...form, button_url: e.target.value })}
                        />
                    </div>

                    <div className="col-12">
                        <RichTextEditor
                            label="Description"
                            height={300}
                            value={form.description}
                            onChange={(content) => setForm({ ...form, description: content })}
                        />
                    </div>

                </div>

                <hr className="my-4" />

                <h6 className="fw-bold text-uppercase mb-3">Visibility</h6>

                <div className="col-md-4 d-flex align-items-center">
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={form.is_active === 1}
                            onChange={(e) =>
                                setForm({ ...form, is_active: e.target.checked ? 1 : 0 })
                            }
                        />
                        <span className="slider round"></span>
                    </label>
                    <span className="ms-2 fw-semibold">
                        {form.is_active === 1 ? "Active" : "Inactive"}
                    </span>
                </div>

            </div>
        </div>
    );
}
