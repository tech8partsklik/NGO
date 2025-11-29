import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { addGallery } from "../../../services/gallery.service";
import MediaUploader from "../../../components/admin/Helps/MediaUploader/MediaUploader";
import RichTextEditor from "../../../components/admin/Helps/RichTextEditor";
import UrlSelector from "../../../components/admin/Helps/UrlSelector";

export default function AddGallery() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    button_text: "",
    button_url: "",
    file_type: "Image",
    is_active: 1
  });

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 250);
  }, []);

  const handleMediaChange = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);

    setForm((prev) => ({
      ...prev,
      file_type: selectedFile.type.startsWith("video") ? "Video" : "Image"
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return toast.error("Title is required");
    if (!file) return toast.error("File is required");

    setLoading(true);
    const toastId = toast.loading("Saving...");

    try {
      const fd = new FormData();

      Object.keys(form).forEach((key) => fd.append(key, form[key]));
      fd.append("file", file);

      await addGallery(fd);

      toast.success("Gallery item added successfully", { id: toastId });
      navigate("/admin/gallery");
    } catch (err) {
      toast.error("Failed to add item", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-width">

      {/* HEADER */}
      <div className="sticky-header d-flex justify-content-between align-items-center">
        <div>
          <ol className="breadcrumb mb-1">
            <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item"><Link to="/admin/gallery">Gallery</Link></li>
            <li className="breadcrumb-item active">Add Gallery Item</li>
          </ol>
          <h4 className="fw-semibold mb-0">Add New Item</h4>
        </div>

        <button className="btn btn-dark px-4" disabled={loading} onClick={handleSubmit}>
          {loading ? "Saving..." : "Save Item"}
        </button>
      </div>

      {/* CARD */}
      <div className="card p-4 shadow-sm">

        {/* UPLOAD SECTION */}
        <h6 className="fw-bold text-uppercase mb-3">Upload File</h6>

        <MediaUploader
          label="Media"
          accept="both"
          multiple={false}
          onChange={handleMediaChange}
        />

        <hr className="my-4" />

        {/* DETAILS */}
        <h6 className="fw-bold text-uppercase mb-3">Details</h6>

        <div className="row g-4">

          <div className="col-md-12">
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

          {/* ⭐ Button URL with UrlSelector */}
          <div className="col-md-6">
            <label className="form-label">Button URL</label>
            <UrlSelector
              value={form.button_url}
              onChange={(val) => setForm((prev) => ({ ...prev, button_url: val }))}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="col-12">
            <RichTextEditor
              label="Description"
              height={300}
              value={form.description}
              onChange={(content) =>
                setForm({ ...form, description: content })
              }
            />
          </div>

        </div>

        <hr className="my-4" />

        {/* VISIBILITY */}
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
