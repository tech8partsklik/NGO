import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import MediaUploader from "../../../components/admin/Helps/MediaUploader/MediaUploader";
import RichTextEditor from "../../../components/admin/Helps/RichTextEditor";
import UrlSelector from "../../../components/admin/Helps/UrlSelector";
import { BASE_MEDIA_URL } from "../../../services/endpoints";
import { getAllEvents, updateEvent } from "../../../services/event.service";

export default function UpdateEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [newsItem, setNewsItem] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [mediaFile, setMediaFile] = useState(null);

    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        html_body: "",
        button_text: "",
        button_url: "",
        youtube_video_id: "",
        instagram_link: "",
        twitter_link: "",
        wikipedia_link: "",
        website_link: "",
        other_field_json: "{}",
        is_active: 1,
    });

    // LOAD NEWS
    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const res = await getAllEvents({
                ids: [id],
                search: "",
                page_number: 1,
                page_size: 1
            });

            if (res?.status !== 1 || !res.data.length) {
                toast.error("Event not found");
                return navigate("/admin/events");
            }

            const data = res.data[0];
            setNewsItem(data);

            setForm({
                title: data.title || "",
                subtitle: data.subtitle || "",
                html_body: data.html_body || "",
                button_text: data.button_text || "",
                button_url: data.button_url || "",
                youtube_video_id: data.youtube_video_id || "",
                instagram_link: data.instagram_link || "",
                twitter_link: data.twitter_link || "",
                wikipedia_link: data.wikipedia_link || "",
                website_link: data.website_link || "",
                other_field_json: data.other_field_json || "{}",
                is_active: data.is_active ? 1 : 0,
            });

            setTimeout(() => inputRef.current?.focus(), 300);

        } catch (err) {
            toast.error("Failed to load event");
            navigate("/admin/events");
        }
    };

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error("Title is required");

        // ===== BUTTON FIELD VALIDATION =====
        if (form.button_text.trim() && !form.button_url.trim()) {
            return toast.error("Button URL is required when button text is provided");
        }

        // ===== SOCIAL LINK VALIDATION =====
        const linkFields = [
            { field: "instagram_link", label: "Instagram" },
            { field: "twitter_link", label: "Twitter" },
            { field: "wikipedia_link", label: "Wikipedia" },
            { field: "website_link", label: "Website" },
            { field: "youtube_video_id", label: "Youtube" }
        ];

        for (const lf of linkFields) {
            const val = form[lf.field];
            if (val.trim() && !val.startsWith("http://") && !val.startsWith("https://")) {
                return toast.error(`${lf.label} link must start with http:// or https://`);
            }
        }


        setLoading(true);
        const toastId = toast.loading("Updating event...");

        try {
            const fd = new FormData();
            fd.append("pk", id);

            Object.keys(form).forEach((key) => fd.append(key, form[key]));

            if (thumbnail) fd.append("thumbnail", thumbnail);
            if (mediaFile) fd.append("video_or_file", mediaFile);

            await updateEvent(fd);

            toast.success("Event Updated", { id: toastId });
            navigate("/admin/events");
        } catch (err) {
            toast.error("Update failed", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (!newsItem) return null;

    return (
        <>
            <div className="max-width">

                {/* HEADER */}
                <div className="sticky-header d-flex justify-content-between align-items-center">
                    <div>
                        <ol className="breadcrumb mb-1">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item"><Link to="/admin/events">Events</Link></li>
                            <li className="breadcrumb-item active">Edit Event</li>
                        </ol>
                        <h4 className="fw-semibold mb-0">Edit Event</h4>
                    </div>

                    <button
                        className="btn btn-dark px-4"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? "Updating..." : "Update Event"}
                    </button>
                </div>

                {/* CARD */}
                <div className="card p-4 shadow-sm border-0">


                    <div className="row g-2">
                        <div className="col-md-6 mb-1">
                            {/* THUMBNAIL */}
                            <h6 className="fw-bold text-uppercase mb-3">Thumbnail</h6>
                            <MediaUploader
                                label="Thumbnail"
                                accept="image"
                                multiple={false}
                                value={newsItem.thumbnail ? BASE_MEDIA_URL + newsItem.thumbnail : null}
                                onChange={(file) => setThumbnail(file)}
                            />

                        </div>
                        <div className="col-md-6 mb-1">
                            {/* MAIN MEDIA */}
                            <h6 className="fw-bold text-uppercase mb-3">Main Media</h6>

                            <MediaUploader
                                label="Media File (Image or Video)"
                                accept="both"
                                multiple={false}
                                value={newsItem.video_or_file ? BASE_MEDIA_URL + newsItem.video_or_file : null}
                                onChange={(file) => setMediaFile(file)}
                            />

                        </div>
                    </div>



                    <hr />

                    {/* DETAILS */}
                    <h6 className="fw-bold text-uppercase mb-3">Details</h6>

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
                            <label className="form-label">Subtitle</label>
                            <input
                                className="form-control"
                                value={form.subtitle}
                                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                            />
                        </div>

                        <div className="col-12">
                            <RichTextEditor
                                label="Description"
                                height={350}
                                value={form.html_body}
                                onChange={(content) => setForm({ ...form, html_body: content })}
                            />
                        </div>

                        {/* BUTTON AREA */}
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

                        {/* SOCIAL MEDIA */}
                        <h6 className="fw-bold mt-4">Social Media</h6>

                        <div className="col-md-6">
                            <label className="form-label">YouTube</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="fa-brands fa-youtube text-danger" />
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
                                <span className="input-group-text bg-light">
                                    <i className="fa-brands fa-instagram text-danger" />
                                </span>
                                <input
                                    className="form-control rounded-start-0"
                                    value={form.instagram_link}
                                    onChange={(e) => setForm({ ...form, instagram_link: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Twitter</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="fa-brands fa-twitter text-primary" />
                                </span>
                                <input
                                    className="form-control rounded-start-0"
                                    value={form.twitter_link}
                                    onChange={(e) => setForm({ ...form, twitter_link: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Wikipedia</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <i className="fa-brands fa-wikipedia-w text-dark" />
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
                                <span className="input-group-text bg-light">
                                    <i className="fa fa-globe text-success" />
                                </span>
                                <input
                                    className="form-control rounded-start-0"
                                    value={form.website_link}
                                    onChange={(e) => setForm({ ...form, website_link: e.target.value })}
                                />
                            </div>
                        </div>

                    </div>


                    {/* ACTIVE SWITCH */}
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
        </>
    );
}
