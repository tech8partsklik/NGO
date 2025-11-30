import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MediaUploader from "../../../components/admin/Helps/MediaUploader/MediaUploader";
import RichTextEditor from "../../../components/admin/Helps/RichTextEditor";
import { BASE_MEDIA_URL } from "../../../services/endpoints";

import {
    getObjectiveData,
    updateObjectiveData
} from "../../../services/siteCredential.service";

export default function ObjectiveEditor() {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // File + Preview
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    // Form
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
    });

    // ------------------ LOAD DATA ------------------
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await getObjectiveData();
            if (!res || res.status !== 1 || !res.data) {
                toast.error("Failed to load Objective data");
                setLoading(false);
                return;
            }

            const d = res.data;

            setForm({
                title: d.title || "",
                subtitle: d.subtitle || "",
                html_body: d.html_body || "",
                youtube_link: d.youtube_link || "",
                instagram_link: d.instagram_link || "",
                twitter_link: d.twitter_link || "",
                linkedin_link: d.linkedin_link || "",
                facebook_link: d.facebook_link || "",
                whatsapp_number: d.whatsapp_number || "",
                wikipedia_link: d.wikipedia_link || "",
            });

            if (d.file) setFilePreview(`${BASE_MEDIA_URL}${d.file}`);

            setTimeout(() => inputRef.current?.focus(), 200);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load Objective data");
        } finally {
            setLoading(false);
        }
    };

    // File handler
    const onFileChange = (f) => {
        setFile(f || null);
        setFilePreview(f ? URL.createObjectURL(f) : null);
    };

    // ------------------ SUBMIT ------------------
    const handleSubmit = async () => {
        if (!form.title.trim()) return toast.error("Title is required");

        setSaving(true);
        const toastId = toast.loading("Updating...");

        try {
            const fd = new FormData();

            Object.entries(form).forEach(([key, val]) => fd.append(key, val));
            if (file) fd.append("file", file);

            await updateObjectiveData(fd);

            toast.success("Objective Updated!", { id: toastId });
            await loadData();
        } catch (err) {
            console.error(err);
            toast.error("Update failed", { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className="max-width">
                <div className="card p-4 shadow-sm">Loading...</div>
            </div>
        );

    return (
        <div className="max-width">

            {/* HEADER */}
            <div className="sticky-header d-flex justify-content-between align-items-center mb-3">
                <div>
                    <ol className="breadcrumb mb-1">
                        <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Objective</li>
                    </ol>
                    <h4 className="fw-semibold mb-0">Edit Objective</h4>
                </div>

                <div>
                    <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>Back</button>
                    <button className="btn btn-dark" disabled={saving} onClick={handleSubmit}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* CARD */}
            <div className="card p-4 shadow-sm">

                {/* IMAGE */}
                <h6 className="fw-bold text-uppercase mb-3">Objective Image</h6>

                <MediaUploader
                    label="Image"
                    accept="image"
                    multiple={false}
                    onChange={onFileChange}
                    value={filePreview || null}
                />

                <hr className="my-4" />

                {/* TEXT FIELDS */}
                <h6 className="fw-bold text-uppercase mb-3">Objective Details</h6>

                <div className="row g-3">

                    <div className="col-md-6">
                        <label className="form-label">Title</label>
                        <input ref={inputRef} className="form-control"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Subtitle</label>
                        <input
                            className="form-control"
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Description (HTML)</label>
                        <RichTextEditor
                            height={200}
                            value={form.html_body}
                            onChange={(content) => setForm({ ...form, html_body: content })}
                        />
                    </div>
                </div>

                <hr className="my-4" />

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

                <hr className="my-4" />

                <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary me-2" onClick={loadData}>Reset</button>
                    <button className="btn btn-dark" disabled={saving} onClick={handleSubmit}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

            </div>
        </div>
    );
}
