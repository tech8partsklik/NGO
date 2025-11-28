import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

import { addTestimonial } from "../../../services/testimonial.service";

export default function AddTestimonial() {
    const navigate = useNavigate();
    const editor = useRef(null);
    const inputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        person_name: "",
        title: "",
        message: "",
        company: "",
        designation: "",
        is_active: 1
    });

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 250);
    }, []);

    // ================= FILE CHANGE =================
    const handleFile = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        setFile(selected);

        setPreview({
            type: "image",
            url: URL.createObjectURL(selected)
        });
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.person_name.trim())
            return toast.error("Name is required");

        if (!form.message.trim())
            return toast.error("Message is required");

        if (!file)
            return toast.error("Image is required");

        setLoading(true);
        const toastId = toast.loading("Adding testimonial...");

        try {
            const fd = new FormData();

            Object.keys(form).forEach((key) => {
                fd.append(key, form[key]);
            });

            fd.append("image", file); // ✅ send as file

            await addTestimonial(fd);

            toast.success("Testimonial added successfully ✅", { id: toastId });

            navigate("/admin/testimonials");

        } catch (error) {
            console.error(error);

            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.detail ||
                "Failed to add testimonial ❌";

            toast.error(msg, { id: toastId });

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ================= TOP BAR ================= */}
            <nav className="d-flex justify-content-between align-items-center mb-3">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                        <a href="/admin/dashboard">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item">
                        <a href="/admin/testimonials">Testimonials</a>
                    </li>
                    <li className="breadcrumb-item active">Add Testimonial</li>
                </ol>

                <button
                    className="btn btn-dark"
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {loading ? "Saving..." : "Save Testimonial"}
                </button>
            </nav>

            <div className="card border-0 p-3">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">

                        {/* NAME */}
                        <div className="col-md-6">
                            <label className="form-label">Person Name</label>
                            <input
                                ref={inputRef}
                                className="form-control"
                                value={form.person_name}
                                onChange={(e) =>
                                    setForm({ ...form, person_name: e.target.value })
                                }
                            />
                        </div>

                        {/* TITLE */}
                        <div className="col-md-6">
                            <label className="form-label">Title</label>
                            <input
                                className="form-control"
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                            />
                        </div>

                        {/* COMPANY */}
                        <div className="col-md-6">
                            <label className="form-label">Company</label>
                            <input
                                className="form-control"
                                value={form.company}
                                onChange={(e) =>
                                    setForm({ ...form, company: e.target.value })
                                }
                            />
                        </div>

                        {/* DESIGNATION */}
                        <div className="col-md-6">
                            <label className="form-label">Designation</label>
                            <input
                                className="form-control"
                                value={form.designation}
                                onChange={(e) =>
                                    setForm({ ...form, designation: e.target.value })
                                }
                            />
                        </div>

                        {/* MESSAGE - JODIT */}
                        <div className="col-12">
                            <label className="form-label">Message</label>
                            <JoditEditor
                                ref={editor}
                                value={form.message}
                                onChange={(content) =>
                                    setForm({ ...form, message: content })
                                }
                            />
                        </div>

                        {/* IMAGE */}
                        <div className="col-md-6">
                            <label className="form-label">Image</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleFile}
                            />

                            {/* IMAGE PREVIEW */}
                            {preview && (
                                <div className="mt-2 d-flex align-items-end">
                                    <img
                                        src={preview.url}
                                        alt="preview"
                                        className="rounded shadow"
                                        style={{ maxHeight: "200px" }}
                                    />
                                </div>
                            )}

                        </div>


                        {/* STATUS */}
                        <div className="col-md-6 d-flex align-items-end mt-3">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={form.is_active === 1}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            is_active: e.target.checked ? 1 : 0
                                        })
                                    }
                                />
                                <span className="slider round"></span>
                            </label>
                            <span className="ms-2 fw-semibold">
                                {form.is_active === 1 ? "Active" : "Draft"}
                            </span>
                        </div>

                    </div>
                </form>
            </div>
        </>
    );
}
