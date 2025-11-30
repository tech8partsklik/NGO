import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MediaUploader from "../../../components/admin/Helps/MediaUploader/MediaUploader";
import RichTextEditor from "../../../components/admin/Helps/RichTextEditor";

import { addCertificate } from "../../../services/certificate.service";

export default function CertificateAdd() {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [saving, setSaving] = useState(false);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        html_body: "",
        youtube_link: "",
        instagram_link: "",
        twitter_link: "",
        linkedin_link: "",
        facebook_link: "",
        whatsapp_number: "",
        wikipedia_link: "",
        is_active: 1,
    });

    const onFileChange = (f) => {
        setFile(f || null);
        setFilePreview(f ? URL.createObjectURL(f) : null);
    };

    const handleSubmit = async () => {

        if (!file) return toast.error("Please select image");

        // if (!form.title.trim()) return toast.error("Title is required");

        setSaving(true);
        const toastId = toast.loading("Adding certificate...");

        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            if (file) fd.append("file", file);

            await addCertificate(fd);

            toast.success("Certificate Added!", { id: toastId });
            navigate("/admin/certificates");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add certificate", { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-width">

            {/* HEADER */}
            <div className="sticky-header d-flex justify-content-between align-items-center mb-3">
                <div>
                    <ol className="breadcrumb mb-1">
                        <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/certificate">Certificates</Link></li>
                        <li className="breadcrumb-item active">Add Certificate</li>
                    </ol>
                    <h4 className="fw-semibold mb-0">Add Certificate</h4>
                </div>

                <button className="btn btn-dark" disabled={saving} onClick={handleSubmit}>
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>

            <div className="card p-4 shadow-sm">

                {/* IMAGE */}
                <h6 className="fw-bold text-uppercase mb-3">Certificate Image</h6>
                <MediaUploader label="Image" accept="image" multiple={false} onChange={onFileChange} value={filePreview} />

                <hr />

                {/* TEXT FIELDS */}
                <h6 className="fw-bold text-uppercase mb-3">Details</h6>
                <div className="row g-3">

                    <div className="col-md-6">
                        <label className="form-label">Title</label>
                        <input className="form-control" ref={inputRef}
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Subtitle</label>
                        <input className="form-control"
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Description (HTML)</label>
                        <RichTextEditor
                            height={200}
                            value={form.html_body}
                            onChange={(html) => setForm({ ...form, html_body: html })}
                        />
                    </div>

                </div>

                <hr />

                {/* SOCIAL LINKS */}
                <h6 className="fw-bold text-uppercase mb-3">Social Links</h6>
                <div className="row g-3">
                    {[
                        { key: "youtube_link", icon: "youtube text-danger", label: "YouTube" },
                        { key: "instagram_link", icon: "instagram text-danger", label: "Instagram" },
                        { key: "twitter_link", icon: "x-twitter text-dark", label: "Twitter / X" },
                        { key: "linkedin_link", icon: "linkedin text-primary", label: "LinkedIn" },
                        { key: "facebook_link", icon: "facebook text-primary", label: "Facebook" },
                        { key: "wikipedia_link", icon: "wikipedia-w text-dark", label: "Wikipedia" },
                    ].map((item) => (
                        <div className="col-md-6" key={item.key}>
                            <label className="form-label">{item.label}</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className={`fa-brands fa-${item.icon}`}></i>
                                </span>
                                <input
                                    className="form-control rounded-start-0"
                                    value={form[item.key]}
                                    onChange={(e) => setForm({ ...form, [item.key]: e.target.value })}
                                />
                            </div>
                        </div>
                    ))}

                    {/* WhatsApp */}
                    <div className="col-md-6">
                        <label className="form-label">WhatsApp Number</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <i className="fa-brands fa-whatsapp text-success"></i>
                            </span>
                            <input
                                className="form-control rounded-start-0"
                                value={form.whatsapp_number}
                                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                            />
                        </div>
                    </div>

                </div>

                <hr />

                {/* ACTIVE TOGGLE */}
                <h6 className="fw-bold text-uppercase mb-3">Visibility Settings</h6>
                <div className="col-md-4">
                    <label className="form-label mb-1">Status</label>
                    <div className="d-flex align-items-center">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={form.is_active == 1}
                                onChange={(e) =>
                                    setForm({ ...form, is_active: e.target.checked ? 1 : 0 })
                                }
                            />
                            <span className="slider round"></span>
                        </label>
                        <span className="ms-2 fw-semibold">
                            {form.is_active ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}

