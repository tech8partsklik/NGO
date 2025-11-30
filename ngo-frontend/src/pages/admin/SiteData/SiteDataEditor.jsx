// SiteDataEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

import MediaUploader from "../../../components/admin/Helps/MediaUploader/MediaUploader";
import RichTextEditor from "../../../components/admin/Helps/RichTextEditor";
import UrlSelector from "../../../components/admin/Helps/UrlSelector";
import { BASE_MEDIA_URL } from "../../../services/endpoints";
import { getSiteData, updateSiteData } from "../../../services/siteCredential.service";

/**
 * Fixed meta fields list (Option A).
 * attribute -> "name" or "property" used in meta items returned by backend
 * key -> the meta name/property we want to manage
 */
const FIXED_META_FIELDS = [
    { key: "theme-color", label: "Theme Color", attribute: "name" },
    { key: "description", label: "Description", attribute: "name" },

    { key: "og:site_name", label: "OG: Site Name", attribute: "property" },
    { key: "og:url", label: "OG: URL", attribute: "property" },
    { key: "og:title", label: "OG: Title", attribute: "property" },
    { key: "og:type", label: "OG: Type", attribute: "property" },
    { key: "og:description", label: "OG: Description", attribute: "property" },
    { key: "og:image", label: "OG: Image", attribute: "property" },
    { key: "og:image:alt", label: "OG: Image Alt", attribute: "property" },

    { key: "twitter:site", label: "Twitter: Site", attribute: "name" },
    { key: "twitter:card", label: "Twitter: Card", attribute: "name" },
    { key: "twitter:title", label: "Twitter: Title", attribute: "name" },
    { key: "twitter:description", label: "Twitter: Description", attribute: "name" },
    { key: "twitter:image", label: "Twitter: Image", attribute: "name" },
    { key: "twitter:image:alt", label: "Twitter: Image Alt", attribute: "property" },
];

export default function SiteDataEditor() {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // loading/saving
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // file uploads
    const [headerBgFile, setHeaderBgFile] = useState(null);
    const [desktopLogoFile, setDesktopLogoFile] = useState(null);
    const [phoneLogoFile, setPhoneLogoFile] = useState(null);
    const [footerLogoFile, setFooterLogoFile] = useState(null);

    // previews (strings)
    const [headerBgPreview, setHeaderBgPreview] = useState(null);
    const [desktopLogoPreview, setDesktopLogoPreview] = useState(null);
    const [phoneLogoPreview, setPhoneLogoPreview] = useState(null);
    const [footerLogoPreview, setFooterLogoPreview] = useState(null);

    // main form
    const [form, setForm] = useState({
        page_header_title: "",
        page_header_subtitle: "",
        orgnization_name: "",
        phones: [{ country_code: "91", phone: "" }], // country_code without plus
        emails: [""],
        youtube_channel_link: "",
        instagram_link: "",
        twitter_link: "",
        linkedin_link: "",
        facebook_link: "",
        whatsapp_number: "",
        wikipedia_link: "",
        google_map: "",
        footer_description: "",
        address: "",
        meta_data: { meta: [] }, // will be normalized later
    });

    // meta fixed fields state (map key -> value)
    const [metaMap, setMetaMap] = useState(
        () =>
            FIXED_META_FIELDS.reduce((acc, f) => {
                acc[f.key] = "";
                return acc;
            }, {})
    );

    // raw extra meta entries returned by server that are NOT in FIXED_META_FIELDS
    const [extraMetaEntries, setExtraMetaEntries] = useState([]);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getSiteData();
            if (!res || res.status !== 1 || !res.data) {
                toast.error("Failed to load site data");
                setLoading(false);
                return;
            }

            const data = res.data;

            // normalize phones: ensure array and objects with country_code & phone (remove + if present)
            const phones =
                Array.isArray(data.phones) && data.phones.length
                    ? data.phones.map((p) => ({
                        country_code: String(p?.country_code || "").replace("+", "") || "91",
                        phone: String(p?.phone || ""),
                    }))
                    : [{ country_code: "91", phone: "" }];

            // normalize emails
            const emails = Array.isArray(data.emails) && data.emails.length ? data.emails : [""];

            // meta: ensure array
            const serverMetaArr = Array.isArray(data.meta_data?.meta) ? data.meta_data.meta : [];

            // build map for fixed fields and collect extras
            // const fixedMap = { ...metaMap }; // start with defaults
            const fixedMap = FIXED_META_FIELDS.reduce((acc, f) => {
                acc[f.key] = "";
                return acc;
            }, {});

            const extras = [];

            serverMetaArr.forEach((m) => {
                // m can be { name, content } or { property, content }
                const nameKey = m.name;
                const propertyKey = m.property;
                const content = m.content || "";

                // try to match against FIXED_META_FIELDS
                const matched = FIXED_META_FIELDS.find((f) => {
                    if (f.attribute === "name" && nameKey === f.key) return true;
                    if (f.attribute === "property" && propertyKey === f.key) return true;
                    return false;
                });

                if (matched) {
                    fixedMap[matched.key] = content;
                } else {
                    // preserve unknown meta entries
                    extras.push(m);
                }
            });

            // set previews only if available (server paths)
            if (data.page_header_bg_file) setHeaderBgPreview(`${BASE_MEDIA_URL}${data.page_header_bg_file}`);
            if (data.main_desktop_logo) setDesktopLogoPreview(`${BASE_MEDIA_URL}${data.main_desktop_logo}`);
            if (data.main_phone_logo) setPhoneLogoPreview(`${BASE_MEDIA_URL}${data.main_phone_logo}`);
            if (data.page_footer_logo) setFooterLogoPreview(`${BASE_MEDIA_URL}${data.page_footer_logo}`);

            setForm((f) => ({
                ...f,
                page_header_title: data.page_header_title || "",
                page_header_subtitle: data.page_header_subtitle || "",
                orgnization_name: data.orgnization_name || "",
                phones,
                emails,
                youtube_channel_link: data.youtube_channel_link || "",
                instagram_link: data.instagram_link || "",
                twitter_link: data.twitter_link || "",
                linkedin_link: data.linkedin_link || "",
                facebook_link: data.facebook_link || "",
                whatsapp_number: data.whatsapp_number || "",
                wikipedia_link: data.wikipedia_link || "",
                google_map: data.google_map || "",
                footer_description: data.footer_description || "",
                address: data.address || "",
                meta_data: { meta: serverMetaArr },
            }));

            setMetaMap(fixedMap);
            setExtraMetaEntries(extras);

            setTimeout(() => inputRef.current?.focus(), 200);
        } catch (err) {
            console.error("loadData error:", err);
            toast.error("Failed to load site data");
        } finally {
            setLoading(false);
        }
    };

    // ---------- Helpers for phones & emails ----------
    const updatePhone = (idx, obj) => {
        setForm((prev) => {
            const phones = [...(prev.phones || [])];
            phones[idx] = { ...phones[idx], ...obj };
            return { ...prev, phones };
        });
    };

    const addPhone = () =>
        setForm((prev) => ({ ...prev, phones: [...(prev.phones || []), { country_code: "91", phone: "" }] }));

    const removePhone = (idx) =>
        setForm((prev) => ({ ...prev, phones: prev.phones.filter((_, i) => i !== idx) }));

    const updateEmail = (idx, val) =>
        setForm((prev) => {
            const emails = [...(prev.emails || [])];
            emails[idx] = val;
            return { ...prev, emails };
        });

    const addEmail = () => setForm((prev) => ({ ...prev, emails: [...(prev.emails || []), ""] }));

    const removeEmail = (idx) => setForm((prev) => ({ ...prev, emails: prev.emails.filter((_, i) => i !== idx) }));

    // ---------- File handlers (with previews) ----------
    const onHeaderBgChange = (file) => {
        setHeaderBgFile(file || null);
        setHeaderBgPreview(file ? URL.createObjectURL(file) : null);
    };
    const onDesktopLogoChange = (file) => {
        setDesktopLogoFile(file || null);
        setDesktopLogoPreview(file ? URL.createObjectURL(file) : null);
    };
    const onPhoneLogoChange = (file) => {
        setPhoneLogoFile(file || null);
        setPhoneLogoPreview(file ? URL.createObjectURL(file) : null);
    };
    const onFooterLogoChange = (file) => {
        setFooterLogoFile(file || null);
        setFooterLogoPreview(file ? URL.createObjectURL(file) : null);
    };

    // ---------- Submit ----------
    const handleSubmit = async (e) => {
        e?.preventDefault();

        // Basic validation
        if (!form.orgnization_name?.trim()) return toast.error("Organization name is required");
        if (!form.page_header_title?.trim()) return toast.error("Header title is required");

        // ensure at least one phone/email present and valid-ish
        if (!Array.isArray(form.phones) || form.phones.length === 0) return toast.error("At least one phone is required");
        if (!Array.isArray(form.emails) || form.emails.length === 0) return toast.error("At least one email is required");

        setSaving(true);
        const toastId = toast.loading("Updating site data...");

        try {
            const fd = new FormData();

            // basic string fields
            fd.append("page_header_title", form.page_header_title || "");
            fd.append("page_header_subtitle", form.page_header_subtitle || "");
            fd.append("orgnization_name", form.orgnization_name || "");
            fd.append("youtube_channel_link", form.youtube_channel_link || "");
            fd.append("instagram_link", form.instagram_link || "");
            fd.append("twitter_link", form.twitter_link || "");
            fd.append("linkedin_link", form.linkedin_link || "");
            fd.append("facebook_link", form.facebook_link || "");
            fd.append("whatsapp_number", form.whatsapp_number || "");
            fd.append("wikipedia_link", form.wikipedia_link || "");
            fd.append("google_map", form.google_map || "");
            fd.append("footer_description", form.footer_description || "");
            fd.append("address", form.address || "");

            // phones & emails as JSON
            fd.append("phones", JSON.stringify(form.phones || []));
            fd.append("emails", JSON.stringify(form.emails || []));

            // build meta array from fixed metaMap + extraMetaEntries
            const metaArray = [];

            // fixed fields
            FIXED_META_FIELDS.forEach((f) => {
                const val = (metaMap[f.key] || "").toString().trim();
                if (!val) return; // skip empty
                if (f.attribute === "name") metaArray.push({ name: f.key, content: val });
                else metaArray.push({ property: f.key, content: val });
            });

            // include any extra meta entries received from server (preserve them)
            (extraMetaEntries || []).forEach((m) => {
                // keep only if has content
                if (m && (m.content || m.content === 0 || m.content === "")) {
                    metaArray.push(m);
                }
            });

            fd.append("meta_data", JSON.stringify({ meta: metaArray }));

            // files (append only if user provided new files)
            if (headerBgFile) fd.append("page_header_bg_file", headerBgFile);
            if (desktopLogoFile) fd.append("main_desktop_logo", desktopLogoFile);
            if (phoneLogoFile) fd.append("main_phone_logo", phoneLogoFile);
            if (footerLogoFile) fd.append("page_footer_logo", footerLogoFile);

            // call API
            await updateSiteData(fd);

            toast.success("Site data updated", { id: toastId });
            // reload to pick up server-stored paths
            await loadData();
        } catch (err) {
            console.error("updateSiteData error:", err);
            toast.error("Update failed", { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-width">
                <div className="card p-4 shadow-sm">Loading site data...</div>
            </div>
        );
    }

    return (
        <div className="max-width">
            <div className="sticky-header d-flex justify-content-between align-items-center mb-2">
                <div>
                    <ol className="breadcrumb mb-1">
                        <li className="breadcrumb-item">
                            <Link to="/admin/dashboard">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active">Site Settings</li>
                    </ol>
                    <h4 className="fw-semibold mb-0">Edit Site Data</h4>
                </div>

                <div>
                    <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>
                        Back
                    </button>
                    <button className="btn btn-dark" disabled={saving} onClick={handleSubmit}>
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </div>

            <div className="card p-4 shadow-sm">
                <h6 className="fw-bold text-uppercase mb-3">Header & Logos</h6>

                <div className="row g-3">
                    <div className="col-md-6">
                        <MediaUploader label="Header Background" accept="image" multiple={false} onChange={onHeaderBgChange} value={headerBgPreview || null} />
                    </div>

                    <div className="col-md-6">
                        <MediaUploader label="Desktop Logo" accept="image" multiple={false} onChange={onDesktopLogoChange} value={desktopLogoPreview || null} />
                    </div>

                    <div className="col-md-6">
                        <MediaUploader label="Phone Logo" accept="image" multiple={false} onChange={onPhoneLogoChange} value={phoneLogoPreview || null} />
                    </div>

                    <div className="col-md-6">
                        <MediaUploader label="Footer Logo" accept="image" multiple={false} onChange={onFooterLogoChange} value={footerLogoPreview || null} />
                    </div>
                </div>

                <hr className="my-4" />

                <h6 className="fw-bold text-uppercase mb-3">Main Details</h6>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Organization Name</label>
                        <input ref={inputRef} className="form-control" value={form.orgnization_name} onChange={(e) => setForm({ ...form, orgnization_name: e.target.value })} />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Header Title</label>
                        <input className="form-control" value={form.page_header_title} onChange={(e) => setForm({ ...form, page_header_title: e.target.value })} />
                    </div>

                    <div className="col-md-12">
                        <label className="form-label">Header Subtitle</label>
                        <input className="form-control" value={form.page_header_subtitle} onChange={(e) => setForm({ ...form, page_header_subtitle: e.target.value })} />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Footer Description (plain text preferred)</label>
                        <RichTextEditor label="Footer Description" height={140} value={form.footer_description || ""} onChange={(content) => setForm({ ...form, footer_description: content })} />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Address</label>
                        <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    </div>
                </div>

                <hr className="my-4" />

                <h6 className="fw-bold text-uppercase mb-3">Contact (Phones & Emails)</h6>

                <div className="mb-3">
                    <label className="form-label">Phones</label>
                    {form.phones.map((p, i) => (
                        <div className="d-flex align-items-start gap-2 mb-2" key={i}>
                            <div style={{ flex: 1 }}>
                                <PhoneInput
                                    country={p.country_code || "in"}
                                    value={`+${p.country_code}${p.phone}`}
                                    onChange={(value, country) => {
                                        // value includes dial code; strip dial code for phone storage
                                        const dial = country.dialCode || "";
                                        const withoutCode = typeof value === "string" ? value.replace(dial, "") : "";
                                        updatePhone(i, { country_code: dial, phone: withoutCode });
                                    }}
                                    inputProps={{
                                        name: `phone-${i}`,
                                        required: true,
                                    }}
                                    inputStyle={{ width: "100%", height: "38px" }}
                                />
                            </div>

                            <div className="d-flex align-items-center ms-2">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    disabled={form.phones.length === 1}
                                    onClick={() => removePhone(i)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <div>
                        <button type="button" className="btn btn-sm btn-dark" onClick={addPhone}>
                            Add Phone
                        </button>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Emails</label>
                    {form.emails.map((em, i) => (
                        <div className="input-group mb-2" key={i}>
                            <input className="form-control" value={em} onChange={(e) => updateEmail(i, e.target.value)} placeholder="email@example.com" />
                            <button type="button" className="btn btn-danger" disabled={form.emails.length === 1} onClick={() => removeEmail(i)}>
                                Remove
                            </button>
                        </div>
                    ))}

                    <button type="button" className="btn btn-sm btn-dark" onClick={addEmail}>
                        Add Email
                    </button>
                </div>

                <hr className="my-4" />

                <h6 className="fw-bold text-uppercase mb-3 mt-4">Social Links</h6>

                <div className="row g-3">

                    {/* YouTube */}
                    <div className="col-md-6">
                        <label className="form-label">YouTube</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <i className="fa-brands fa-youtube text-danger"></i>
                            </span>
                            <input
                                className="form-control rounded-start-0"
                                value={form.youtube_channel_link}
                                onChange={(e) =>
                                    setForm({ ...form, youtube_channel_link: e.target.value })
                                }
                                placeholder="YouTube Channel URL"
                            />
                        </div>
                    </div>

                    {/* Instagram */}
                    <div className="col-md-6">
                        <label className="form-label">Instagram</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <i className="fa-brands fa-instagram text-danger"></i>
                            </span>
                            <input
                                className="form-control rounded-start-0"
                                value={form.instagram_link}
                                onChange={(e) =>
                                    setForm({ ...form, instagram_link: e.target.value })
                                }
                                placeholder="Instagram Profile URL"
                            />
                        </div>
                    </div>

                    {/* Twitter / X */}
                    <div className="col-md-6">
                        <label className="form-label">Twitter / X</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <i className="fa-brands fa-x-twitter text-dark"></i>
                            </span>
                            <input
                                className="form-control rounded-start-0"
                                value={form.twitter_link}
                                onChange={(e) =>
                                    setForm({ ...form, twitter_link: e.target.value })
                                }
                                placeholder="Twitter/X URL"
                            />
                        </div>
                    </div>

                    {/* LinkedIn */}
                    <div className="col-md-6">
                        <label className="form-label">LinkedIn</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <i className="fa-brands fa-linkedin text-primary"></i>
                            </span>
                            <input
                                className="form-control rounded-start-0"
                                value={form.linkedin_link}
                                onChange={(e) =>
                                    setForm({ ...form, linkedin_link: e.target.value })
                                }
                                placeholder="LinkedIn URL"
                            />
                        </div>
                    </div>

                    {/* Facebook */}
                    <div className="col-md-6">
                        <label className="form-label">Facebook</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <i className="fa-brands fa-facebook text-primary"></i>
                            </span>
                            <input
                                className="form-control rounded-start-0"
                                value={form.facebook_link}
                                onChange={(e) =>
                                    setForm({ ...form, facebook_link: e.target.value })
                                }
                                placeholder="Facebook URL"
                            />
                        </div>
                    </div>

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
                                onChange={(e) =>
                                    setForm({ ...form, whatsapp_number: e.target.value })
                                }
                                placeholder="WhatsApp Number"
                            />
                        </div>
                    </div>

                    {/* Wikipedia */}
                    <div className="col-md-6">
                        <label className="form-label">Wikipedia</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <i className="fa-brands fa-wikipedia-w text-dark"></i>
                            </span>
                            <input
                                className="form-control rounded-start-0"
                                value={form.wikipedia_link}
                                onChange={(e) =>
                                    setForm({ ...form, wikipedia_link: e.target.value })
                                }
                                placeholder="Wikipedia URL"
                            />
                        </div>
                    </div>

                    {/* Google Map */}
                    <div className="col-md-12">
                        <label className="form-label">Google Map Embed / Link</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <i className="fa-solid fa-map-location-dot text-danger"></i>
                            </span>
                            <input
                                className="form-control rounded-start-0"
                                value={form.google_map}
                                onChange={(e) =>
                                    setForm({ ...form, google_map: e.target.value })
                                }
                                placeholder="Google Maps URL or Embed"
                            />
                        </div>
                    </div>

                </div>


                <hr className="my-4" />

                <h6 className="fw-bold text-uppercase mb-3">Meta Tags</h6>

                <div className="mb-3">

                    {/* ========== GENERAL META TAGS ========== */}
                    <h6 className="fw-bold mb-2">
                        <i className="fa-solid fa-globe me-2 text-primary"></i> General Meta
                    </h6>

                    <div className="row g-2 mb-3">
                        {/* theme-color */}
                        <div className="col-md-6">
                            <label className="form-label small">Theme Color</label>
                            <input
                                className="form-control "
                                value={metaMap["theme-color"] || ""}
                                onChange={(e) =>
                                    setMetaMap((m) => ({ ...m, ["theme-color"]: e.target.value }))
                                }
                                placeholder="e.g., #000000"
                            />
                        </div>

                        {/* description */}
                        <div className="col-md-12">
                            <label className="form-label small">Description</label>
                            <textarea
                                className="form-control "
                                rows={2}
                                value={metaMap["description"] || ""}
                                onChange={(e) =>
                                    setMetaMap((m) => ({ ...m, ["description"]: e.target.value }))
                                }
                                placeholder="Meta Description"
                            />
                        </div>
                    </div>

                    <hr />

                    {/* ========== OPEN GRAPH TAGS ========== */}
                    <h6 className="fw-bold mb-2">
                        <i className="fa-brands fa-facebook me-2 text-primary"></i> Open Graph (Facebook / Social Sharing)
                    </h6>

                    <div className="row g-2 mb-3">

                        {[
                            "og:site_name",
                            "og:url",
                            "og:title",
                            "og:type",
                            "og:description",
                        ].map((key) => (
                            <div className="col-md-6" key={key}>
                                <label className="form-label small text-capitalize">{key}</label>

                                {key === "og:description" ? (
                                    <textarea
                                        className="form-control "
                                        rows={2}
                                        value={metaMap[key] || ""}
                                        onChange={(e) =>
                                            setMetaMap((m) => ({ ...m, [key]: e.target.value }))
                                        }
                                        placeholder={key}
                                    />
                                ) : (
                                    <input
                                        className="form-control "
                                        value={metaMap[key] || ""}
                                        onChange={(e) =>
                                            setMetaMap((m) => ({ ...m, [key]: e.target.value }))
                                        }
                                        placeholder={key}
                                    />
                                )}
                            </div>
                        ))}

                        {/* OG Image */}
                        <div className="col-md-6">
                            <label className="form-label small">og:image</label>
                            <input
                                className="form-control "
                                value={metaMap["og:image"] || ""}
                                onChange={(e) =>
                                    setMetaMap((m) => ({ ...m, ["og:image"]: e.target.value }))
                                }
                                placeholder="/logo.png"
                            />
                        </div>

                        {/* OG Image alt */}
                        <div className="col-md-6">
                            <label className="form-label small">og:image:alt</label>
                            <input
                                className="form-control "
                                value={metaMap["og:image:alt"] || ""}
                                onChange={(e) =>
                                    setMetaMap((m) => ({ ...m, ["og:image:alt"]: e.target.value }))
                                }
                                placeholder="Image description"
                            />
                        </div>
                    </div>

                    <hr />

                    {/* ========== TWITTER META TAGS ========== */}
                    <h6 className="fw-bold mb-2">
                        <i className="fa-brands fa-twitter me-2 text-info"></i> Twitter Cards
                    </h6>

                    <div className="row g-2">

                        {[
                            "twitter:site",
                            "twitter:card",
                            "twitter:title",
                            "twitter:description",
                            "twitter:image",
                            "twitter:image:alt",
                        ].map((key) => (
                            <div className="col-md-6" key={key}>
                                <label className="form-label small text-capitalize">{key}</label>

                                {key === "twitter:description" ? (
                                    <textarea
                                        className="form-control "
                                        rows={2}
                                        value={metaMap[key] || ""}
                                        onChange={(e) =>
                                            setMetaMap((m) => ({ ...m, [key]: e.target.value }))
                                        }
                                        placeholder={key}
                                    />
                                ) : (
                                    <input
                                        className="form-control "
                                        value={metaMap[key] || ""}
                                        onChange={(e) =>
                                            setMetaMap((m) => ({ ...m, [key]: e.target.value }))
                                        }
                                        placeholder={key}
                                    />
                                )}
                            </div>
                        ))}

                    </div>
                </div>


                {extraMetaEntries.length > 0 && (
                    <>
                        <hr className="my-4" />
                        <h6 className="fw-bold text-uppercase mb-3">Other Meta (preserved)</h6>
                        <div>
                            {extraMetaEntries.map((m, i) => (
                                <div key={i} className="mb-2">
                                    <small className="text-muted">{m.name ? `name="${m.name}"` : `property="${m.property}"`}</small>
                                    <input className="form-control  mt-1" value={m.content || ""} readOnly />
                                </div>
                            ))}
                            <small className="text-muted">Unknown meta entries are preserved but not editable here.</small>
                        </div>
                    </>
                )}

                <hr className="my-4" />

                <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary me-2" onClick={loadData}>
                        Reset
                    </button>
                    <button className="btn btn-dark" disabled={saving} onClick={handleSubmit}>
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </div>
        </div>
    );
}
