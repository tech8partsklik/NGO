import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { addTestimonial } from "../../../services/testimonial.service";
import MediaUploader from "../../../components/admin/Helps/MediaUploader/MediaUploader";
import RichTextEditor from "../../../components/admin/Helps/RichTextEditor";

export default function AddTestimonial() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    person_name: "",
    title: "",
    message: "",
    company: "",
    designation: "",
    is_active: 1,
  });

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 250);
  }, []);

  // ================= FILE HANDLER =================
  const handleMediaChange = (file) => {
    if (!file) return;

    setFile(file);
    setPreview({
      url: URL.createObjectURL(file),
      type: "image",
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.person_name.trim()) return toast.error("Name is required");
    if (!form.message.trim()) return toast.error("Message is required");
    if (!file) return toast.error("Image is required");

    setLoading(true);
    const toastId = toast.loading("Adding testimonial...");

    try {
      const fd = new FormData();

      Object.keys(form).forEach((key) => fd.append(key, form[key]));
      fd.append("image", file);

      await addTestimonial(fd);

      toast.success("Testimonial added successfully ✅", { id: toastId });
      navigate("/admin/testimonials");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to add testimonial ❌",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-width">

      {/* ================= HEADER (Sticky) ================= */}
      <div className="sticky-header d-flex justify-content-between align-items-center">
        <div>
          <ol className="breadcrumb mb-1">
             <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/testimonials">Testimonials</Link>
            </li>
            <li className="breadcrumb-item active">Add Testimonial</li>
          </ol>
          <h4 className="fw-semibold mb-0">Add New Testimonial</h4>
        </div>

        <button
          className="btn btn-dark px-4"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Saving..." : "Save Testimonial"}
        </button>
      </div>

      {/* ================= CARD WRAPPER ================= */}
      <div className="card p-4 border-0 shadow-sm">

        {/* 📌 IMAGE UPLOAD (TOP SAME AS AddBanner) */}
        <h6 className="fw-bold text-uppercase mb-3">Upload Image</h6>

        <MediaUploader
          label="Image"
          accept="image"
          multiple={false}
          onChange={handleMediaChange}
        />

        {/* PREVIEW */}
        {/* {preview && (
          <div className="mt-3">
            <img
              src={preview.url}
              alt="preview"
              className="rounded shadow"
              style={{ maxHeight: "200px" }}
            />
          </div>
        )} */}

        <hr className="my-4" />

        {/* 📌 DETAILS SECTION */}
        <h6 className="fw-bold text-uppercase mb-3">Testimonial Details</h6>

        <div className="row g-4">

          {/* NAME */}
          <div className="col-md-6">
            <label className="form-label">Person Name</label>
            <input
              ref={inputRef}
              className="form-control"
              value={form.person_name}
              onChange={(e) => setForm({ ...form, person_name: e.target.value })}
            />
          </div>

          {/* TITLE */}
          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* COMPANY */}
          <div className="col-md-6">
            <label className="form-label">Company</label>
            <input
              className="form-control"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>

          {/* DESIGNATION */}
          <div className="col-md-6">
            <label className="form-label">Designation</label>
            <input
              className="form-control"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
            />
          </div>

          {/* MESSAGE */}
          <div className="col-12">
            <RichTextEditor
              label="Message"
              value={form.message}
              height={300}
              onChange={(content) =>
                setForm({ ...form, message: content })
              }
            />
          </div>

        </div>

        <hr className="my-4" />

        {/* 📌 STATUS SECTION */}
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
            {form.is_active === 1 ? "Active" : "Draft"}
          </span>
        </div>

      </div>
    </div>
  );
}
