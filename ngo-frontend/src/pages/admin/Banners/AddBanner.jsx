import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { addBanner } from "../../../services/banner.service";

export default function AddBanner() {
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
    is_desktop: 1,
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // FILE CHANGE
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setPreview({
      type: selectedFile.type.startsWith("video") ? "video" : "image",
      url,
    });

    setForm((prev) => ({
      ...prev,
      file_type: selectedFile.type.startsWith("video") ? "Video" : "Image",
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return toast.error("Please select image or video");

    setLoading(true);
    const toastId = toast.loading("Uploading banner...");

    try {
      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        fd.append(key, form[key]);
      });

      fd.append("file", file);

      await addBanner(fd);

      toast.success("Banner added successfully ✅", { id: toastId });
      navigate("/admin/banners");
    } catch (error) {
      console.error(error);

      const msg =
        error?.response?.data?.message || "Failed to add banner ❌";

      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

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
          <li className="breadcrumb-item active">Add Banner</li>
        </ol>

        <button
          className="btn btn-dark"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Saving..." : "Save Banner"}
        </button>
      </nav>

      <div className="card border-0 p-2">

        {/* <h5 className="mb-4">
          <i className="fa-solid fa-image me-2"></i>
          Add New Banner
        </h5> */}

        <form onSubmit={handleSubmit}>

          {/* ================= TOGGLES FIRST ✅ ================= */}
          <div className="row gy-3 mb-4 align-items-end">

            {/* STATUS */}
            <div className="col-md-4">
              <label className="form-label d-block">Status</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={form.is_active == 1}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_active: e.target.checked ? 1 : 0,
                    }))
                  }
                />
                <span className="slider round"></span>
              </label>
              <span className="ms-2 fw-semibold">
                {form.is_active == 1 ? "Active" : "Inactive"}
              </span>
            </div>

            {/* MOBILE */}
            <div className="col-md-4">
              <label className="form-label d-block">Mobile</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={form.is_phone == 1}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_phone: e.target.checked ? 1 : 0,
                    }))
                  }
                />
                <span className="slider round"></span>
              </label>
              <span className="ms-2 fw-semibold">
                {form.is_phone == 1 ? "Enabled" : "Disabled"}
              </span>
            </div>

            {/* DESKTOP */}
            <div className="col-md-4">
              <label className="form-label d-block">Desktop</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={form.is_desktop == 1}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_desktop: e.target.checked ? 1 : 0,
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

            {/* TITLE */}
            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* SUB TITLE */}
            <div className="col-md-6">
              <label className="form-label">Subtitle</label>
              <input
                className="form-control"
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
              />
            </div>

            {/* POSITION */}
            <div className="col-md-4">
              <label className="form-label">Position</label>
              <input
                type="number"
                className="form-control"
                name="position"
                value={form.position}
                onChange={handleChange}
                required
              />
            </div>

            {/* BUTTON TEXT */}
            <div className="col-md-4">
              <label className="form-label">Button Text</label>
              <input
                className="form-control"
                name="button_text"
                value={form.button_text}
                onChange={handleChange}
              />
            </div>

            {/* BUTTON URL */}
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

          {/* ================= FILE UPLOAD LAST ✅ ================= */}
          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Select Banner (Image / Video)
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*,video/*"
                onChange={handleFile}
              />
            </div>

            {preview && (
              <div className="col-md-6 text-center mt-3">
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
