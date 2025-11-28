import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getAllBanners, updateBanner } from "../../../services/banner.service";
import { BASE_MEDIA_URL } from "../../../services/endpoints";

export default function UpdateBanner() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    position: "",
    file_type: "Image",
    button_text: "",
    button_url: "",
    is_active: 1,
    is_phone: 1,
    is_desktop: 1
  });

  const [existingBanner, setExistingBanner] = useState(null);
  const [file, setFile] = useState(null);

  // ===================== LOAD BANNER DATA =====================
  const loadBanner = async () => {
    try {
      const res = await getAllBanners();

      if (res?.status === 1) {
        const banner = res.data.find((b) => b.id == id);

        if (!banner) {
          toast.error("Banner not found");
          navigate("/admin/banners");
          return;
        }

        setExistingBanner(banner);

        setForm({
          title: banner.title || "",
          subtitle: banner.subtitle || "",
          position: banner.position || "",
          file_type: banner.file_type || "Image",
          button_text: banner.button_text || "",
          button_url: banner.button_url || "",
          is_active: banner.is_active ? 1 : 0,
          is_phone: banner.is_phone ? 1 : 0,
          is_desktop: banner.is_desktop ? 1 : 0
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load banner");
    }
  };

  useEffect(() => {
    loadBanner();
  }, []);

  // ===================== INPUT CHANGES =====================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ===================== FILE CHANGE =====================
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setPreview({
      type: selectedFile.type.startsWith("video") ? "video" : "image",
      url
    });

    setForm((prev) => ({
      ...prev,
      file_type: selectedFile.type.startsWith("video") ? "Video" : "Image"
    }));
  };

  // ===================== SUBMIT =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!existingBanner) return;

    setLoading(true);
    const toastId = toast.loading("Updating banner...");

    try {
      const fd = new FormData();

      // REQUIRED
      fd.append("banner_pk", existingBanner.id);

      Object.keys(form).forEach((key) => {
        fd.append(key, form[key]);
      });

      // ✅ only if NEW FILE uploaded
      if (file) {
        fd.append("file", file);
      }

      await updateBanner(fd);

      toast.success("Banner updated successfully ✅", { id: toastId });
      navigate("/admin/banners");

    } catch (error) {
      console.error(error);

      const msg =
        error?.response?.data?.message ||
        "Failed to update banner ❌";

      toast.error(msg, { id: toastId });

    } finally {
      setLoading(false);
    }
  };

  if (!existingBanner) return null;

  return (
    <>
      {/* ================= BREADCRUMB + SAVE ================= */}
      <nav className="d-flex justify-content-between align-items-center mb-3">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <a href="/admin/dashboard">Dashboard</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/admin/banners">Banners</a>
          </li>
          <li className="breadcrumb-item active">Edit Banner</li>
        </ol>

        <button
          className="btn btn-dark"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Updating..." : "Update Banner"}
        </button>
      </nav>

      <div className="card border-0 p-2">

        <form onSubmit={handleSubmit}>

          {/* ================= TOGGLES ================= */}
          <div className="row gy-3 mb-4 align-items-end">

            <div className="col-md-4">
              <label className="form-label d-block">Status</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={form.is_active == 1}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_active: e.target.checked ? 1 : 0
                    }))
                  }
                />
                <span className="slider round"></span>
              </label>
              <span className="ms-2 fw-semibold">
                {form.is_active == 1 ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="col-md-4">
              <label className="form-label d-block">Mobile</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={form.is_phone == 1}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_phone: e.target.checked ? 1 : 0
                    }))
                  }
                />
                <span className="slider round"></span>
              </label>
              <span className="ms-2 fw-semibold">
                {form.is_phone == 1 ? "Enabled" : "Disabled"}
              </span>
            </div>

            <div className="col-md-4">
              <label className="form-label d-block">Desktop</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={form.is_desktop == 1}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_desktop: e.target.checked ? 1 : 0
                    }))
                  }
                />
                <span className="slider round"></span>
              </label>
              <span className="ms-2 fw-semibold">
                {form.is_desktop == 1 ? "Enabled" : "Disabled"}
              </span>
            </div>

          </div>

          <hr className="my-4" />

          {/* ================= FORM FIELDS ================= */}
          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Subtitle</label>
              <input
                className="form-control"
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Position</label>
              <input
                type="number"
                className="form-control"
                name="position"
                value={form.position}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Button Text</label>
              <input
                className="form-control"
                name="button_text"
                value={form.button_text}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Button URL</label>
              <input
                className="form-control"
                name="button_url"
                value={form.button_url}
                onChange={handleChange}
              />
            </div>

          </div>

          <hr className="my-4" />

          {/* ================= CURRENT + NEW IMAGE ================= */}
          <div className="row">

            {/* CURRENT BANNER ✅ */}
            {existingBanner && !file && (
              <div className="col-md-6 text-center mb-3">
                <label className="form-label fw-bold d-block mb-2">
                  Current Banner
                </label>

                {existingBanner.file_type === "Video" ? (
                  <video
                    src={`${BASE_MEDIA_URL}${existingBanner.file}`}
                    autoPlay
                    muted
                    loop
                    controls
                    style={{ maxHeight: "280px" }}
                    className="rounded shadow"
                  />
                ) : (
                  <img
                    src={`${BASE_MEDIA_URL}${existingBanner.file}`}
                    style={{ maxHeight: "280px" }}
                    className="rounded shadow"
                    alt="current-banner"
                  />
                )}
              </div>
            )}

            {/* FILE INPUT */}
            <div className="col-md-6">
              <label className="form-label">
                Change Banner (Optional)
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*,video/*"
                onChange={handleFile}
              />
            </div>

            {/* NEW PREVIEW ✅ */}
            {file && preview && (
              <div className="col-md-6 text-center mt-3">

                <label className="form-label fw-bold d-block mb-2">
                  New Banner Preview
                </label>

                {preview.type === "image" ? (
                  <img
                    src={preview.url}
                    style={{ maxHeight: "280px" }}
                    className="rounded shadow"
                  />
                ) : (
                  <video
                    src={preview.url}
                    autoPlay
                    muted
                    loop
                    controls
                    style={{ maxHeight: "280px" }}
                    className="rounded shadow"
                  />
                )}
              </div>
            )}

          </div>

        </form>

      </div>
    </>
  );
}
