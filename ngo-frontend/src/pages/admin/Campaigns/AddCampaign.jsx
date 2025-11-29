import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { addCampaign } from "../../../services/campaign.service";
import MediaUploader from "../../../components/admin/Helps/MediaUploader/MediaUploader";
import RichTextEditor from "../../../components/admin/Helps/RichTextEditor";
import UrlSelector from "../../../components/admin/Helps/UrlSelector";

export default function AddCampaign() {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        html_body: "",
        goal_amount: "",
        collected_amount: 0,
        button_text: "",
        button_url: "",
        youtube_video_id: "",
        instagram_link: "",
        twitter_link: "",
        wikipedia_link: "",
        website_link: "",
        is_active: 1,
        other_field_json: {} // as object
    });

    // other_field_json dynamic pairs
    const [pairs, setPairs] = useState([
        // { key: "", value: "" }
    ]);

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 250);
    }, []);

    const handleMediaChange = (selectedFile) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setPreview({ url: URL.createObjectURL(selectedFile) });
    };

    const addPair = () => setPairs((p) => [...p, { key: "", value: "" }]);
    const removePair = (i) => setPairs((p) => p.filter((_, idx) => idx !== i));
    const updatePair = (i, field, val) => {
        setPairs((p) => p.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error("Title is required");
        if (!file) return toast.error("Media is required");

        // build JSON
        const obj = {};
        pairs.forEach((r) => {
            if (r.key.trim()) obj[r.key] = r.value;
        });

        setLoading(true);
        const toastId = toast.loading("Saving campaign...");

        try {
            const fd = new FormData();

            // append form fields
            Object.keys(form).forEach((k) => {
                if (k !== "other_field_json") fd.append(k, form[k]);
            });

            fd.append("other_field_json", JSON.stringify(obj));
            fd.append("thumbnail", file); // media field (thumbnail or video/file)

            await addCampaign(fd);

            toast.success("Campaign added ", { id: toastId });
            navigate("/admin/campaigns");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add campaign", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-width">
            <div className="sticky-header d-flex justify-content-between align-items-center">
                <div>
                    <ol className="breadcrumb mb-1">
                        <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin/campaigns">Campaigns</Link></li>
                        <li className="breadcrumb-item active">Add Campaign</li>
                    </ol>
                    <h4 className="fw-semibold mb-0">Add New Campaign</h4>
                </div>

                <button className="btn btn-dark px-4" disabled={loading} onClick={handleSubmit}>
                    {loading ? "Saving..." : "Save Campaign"}
                </button>
            </div>

            <div className="card p-4 shadow-sm">

                <h6 className="fw-bold text-uppercase mb-3">Upload Media </h6>
                <MediaUploader label="Media" accept="both" multiple={false} onChange={handleMediaChange} />

                <hr className="my-4" />

                <h6 className="fw-bold text-uppercase mb-3">Details</h6>

                <div className="row g-4">

                    {/* TITLE */}
                    <div className="col-md-6">
                        <label className="form-label">Title</label>
                        <input
                            ref={inputRef}
                            className="form-control"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    {/* SUBTITLE */}
                    <div className="col-md-6">
                        <label className="form-label">Subtitle</label>
                        <input
                            className="form-control"
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                        />
                    </div>

                    {/* HTML BODY */}
                    <div className="col-12">
                        <RichTextEditor
                            label="HTML Body"
                            value={form.html_body}
                            height={300}
                            onChange={(content) => setForm({ ...form, html_body: content })}
                        />
                    </div>

                    {/* ===================== AMOUNTS ===================== */}
                    <div className="col-md-6">
                        <label className="form-label">Goal Amount</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-solid fa-indian-rupee-sign"></i>
                            </span>
                            <input
                                type="number"
                                className="form-control rounded-start-0"
                                value={form.goal_amount}
                                onChange={(e) => setForm({ ...form, goal_amount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Collected Amount</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-solid fa-indian-rupee-sign"></i>
                            </span>
                            <input
                                type="number"
                                className="form-control rounded-start-0"
                                value={form.collected_amount}
                                onChange={(e) => setForm({ ...form, collected_amount: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* ===================== BUTTON FIELDS ===================== */}
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
                        <UrlSelector
                            value={form.button_url}
                            onChange={(val) => setForm({ ...form, button_url: val })}
                        />
                    </div>

                    {/* ===================== SOCIAL LINKS ===================== */}

                    <div className="col-md-6">
                        <label className="form-label">YouTube Video ID</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-brands fa-youtube text-danger"></i>
                            </span>
                            <input
                                className="form-control rounded-start-0"
                                value={form.youtube_video_id}
                                onChange={(e) => setForm({ ...form, youtube_video_id: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Instagram</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-brands fa-instagram text-danger"></i>
                            </span>
                            <input
                                className="form-control rounded-start-0"
                                value={form.instagram_link}
                                onChange={(e) => setForm({ ...form, instagram_link: e.target.value })}
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Twitter</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-brands fa-twitter text-primary"></i>
                            </span>
                            <input
                                className="form-control rounded-start-0"
                                value={form.twitter_link}
                                onChange={(e) => setForm({ ...form, twitter_link: e.target.value })}
                                placeholder="https://x.com/..."
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Wikipedia</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-brands fa-wikipedia-w"></i>
                            </span>
                            <input
                                className="form-control rounded-start-0"
                                value={form.wikipedia_link}
                                onChange={(e) => setForm({ ...form, wikipedia_link: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Website</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa-solid fa-globe"></i>
                            </span>
                            <input
                                className="form-control rounded-start-0"
                                value={form.website_link}
                                onChange={(e) => setForm({ ...form, website_link: e.target.value })}
                            />
                        </div>
                    </div>

                </div>


                <hr className="my-4" />

                <h6 className="fw-bold text-uppercase mb-3">Other Fields (key → value)</h6>
                <div className="mb-3">
                    {pairs.map((p, i) => (
                        <div className="row g-2 align-items-center mb-2" key={i}>
                            <div className="col">
                                <input className="form-control" placeholder="Key" value={p.key} onChange={(e) => updatePair(i, "key", e.target.value)} />
                            </div>
                            <div className="col">
                                <input className="form-control" placeholder="Value" value={p.value} onChange={(e) => updatePair(i, "value", e.target.value)} />
                            </div>
                            <div className="col-auto">
                                <button type="button" className="btn btn-sm btn-danger" onClick={() => removePair(i)}>Remove</button>
                            </div>
                        </div>
                    ))}

                    <div className="text-start">
                        <button type="button" className="btn py-1 btn-dark" onClick={addPair}>Add field</button>
                    </div>
                </div>

                <hr className="my-4" />

                <h6 className="fw-bold text-uppercase mb-3">Visibility</h6>
                <div className="col-md-4 d-flex align-items-center">
                    <label className="switch">
                        <input type="checkbox" checked={form.is_active === 1} onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} />
                        <span className="slider round"></span>
                    </label>
                    <span className="ms-2 fw-semibold">{form.is_active === 1 ? "Active" : "Inactive"}</span>
                </div>

            </div>
        </div>
    );
}
