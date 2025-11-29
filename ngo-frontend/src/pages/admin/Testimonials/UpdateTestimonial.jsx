import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getAllTestimonials,
  updateTestimonial
} from "../../../services/testimonial.service";

import MediaUploader from "../../../components/admin/Helps/MediaUploader/MediaUploader";
import RichTextEditor from "../../../components/admin/Helps/RichTextEditor";

import { BASE_MEDIA_URL } from "../../../services/endpoints";

export default function UpdateTestimonial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [testimonial, setTestimonial] = useState(null);

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

  // ================= LOAD DATA =================
  const loadTestimonial = async () => {
    try {
      const res = await getAllTestimonials({
        ids: [id],
        search: "",
        page_number: 1,
        page_size: 1,
        status: ""
      });

      if (res?.status === 1 && res.data.length) {
        const data = res.data[0];

        setTestimonial(data);

        setForm({
          person_name: data.person_name || "",
          title: data.title || "",
          message: data.message || "",
          company: data.company || "",
          designation: data.designation || "",
          is_active: data.is_active ? 1 : 0
        });

        setPreview({
          type: "image",
          url: `${BASE_MEDIA_URL}${data.image}`
        });

        setTimeout(() => inputRef.current?.focus(), 300);

      } else {
        toast.error("Testimonial not found");
        navigate("/admin/testimonials");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load testimonial");
    }
  };

  useEffect(() => {
    loadTestimonial();
  }, [id]);

  // ================= MEDIA UPLOADER =================
  const handleMediaChange = (file) => {
    if (!file) return;

    setFile(file);
    setPreview({
      type: "image",
      url: URL.createObjectURL(file)
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.person_name.trim()) return toast.error("Name is required");
    if (!form.message.trim()) return toast.error("Message is required");

    setLoading(true);
    const toastId = toast.loading("Updating testimonial...");

    try {
      const fd = new FormData();

      fd.append("pk", id);

      Object.keys(form).forEach((key) => fd.append(key, form[key]));

      if (file) fd.append("image", file);

      await updateTestimonial(fd);

      toast.success("Testimonial updated successfully ✅", { id: toastId });
      navigate("/admin/testimonials");

    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to update testimonial ❌",
        { id: toastId }
      );

    } finally {
      setLoading(false);
    }
  };

  if (!testimonial) return null;

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
            <li className="breadcrumb-item active">Edit Testimonial</li>
          </ol>

          <h4 className="fw-semibold mb-0">Update Testimonial</h4>
        </div>

        <button
          className="btn btn-dark px-4"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Updating..." : "Update Testimonial"}
        </button>
      </div>

      {/* ================= CARD ================= */}
      <div className="card p-4 border-0 shadow-sm">

        {/* IMAGE UPLOAD SECTION */}
        <h6 className="fw-bold text-uppercase mb-3">Update Image</h6>

        <MediaUploader
          label="Image"
          accept="image"
          multiple={false}
          onChange={handleMediaChange}
          value={preview?.url}
        />


        <hr className="my-4" />

        {/* DETAILS SECTION */}
        <h6 className="fw-bold text-uppercase mb-3">Testimonial Details</h6>

        <div className="row g-4">

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

        {/* STATUS SECTION */}
        <h6 className="fw-bold text-uppercase mb-3">Visibility</h6>

        <div className="col-md-4 d-flex align-items-center">
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
    </div>
  );
}
