import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

import {
  getAllTestimonials,
  updateTestimonial
} from "../../../services/testimonial.service";
import { BASE_MEDIA_URL } from "../../../services/endpoints";

export default function UpdateTestimonial() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editor = useRef(null);
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

  // ================= LOAD TESTIMONIAL =================
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

        // show old image
        setPreview({
          type: "image",
          url: `${BASE_MEDIA_URL}${data.image}`
        });

        setTimeout(() => {
          inputRef.current?.focus();
        }, 300);
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

  // ================= FILE CHANGE =================
  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);

    setPreview({
      type: "image",
      url: URL.createObjectURL(selected)
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.person_name.trim())
      return toast.error("Name is required");

    if (!form.message.trim())
      return toast.error("Message is required");

    setLoading(true);
    const toastId = toast.loading("Updating testimonial...");

    try {
      const fd = new FormData();

      fd.append("testimonial_pk", id);

      Object.keys(form).forEach((key) => {
        fd.append(key, form[key]);
      });

      // ✅ only send if new image chosen
      if (file) {
        fd.append("image", file);
      }

      await updateTestimonial(fd);

      toast.success("Testimonial updated successfully ✅", { id: toastId });

      navigate("/admin/testimonials");
    } catch (error) {
      console.error(error);

      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to update testimonial ❌";

      toast.error(msg, { id: toastId });

    } finally {
      setLoading(false);
    }
  };

  if (!testimonial) return null;

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <nav className="d-flex justify-content-between align-items-center mb-3">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <a href="/admin/dashboard">Dashboard</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/admin/testimonials">Testimonials</a>
          </li>
          <li className="breadcrumb-item active">Edit Testimonial</li>
        </ol>

        <button
          className="btn btn-dark"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Updating..." : "Update Testimonial"}
        </button>
      </nav>

      <div className="card border-0 p-3">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">

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

            {/* MESSAGE - JODIT */}
            <div className="col-12">
              <label className="form-label">Message</label>
              <JoditEditor
                ref={editor}
                value={form.message}
                onChange={(content) =>
                  setForm({ ...form, message: content })
                }
              />
            </div>

            {/* IMAGE */}
            <div className="col-md-6">
              <label className="form-label">
                Change Image (Optional)
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFile}
              />
            </div>

            {/* IMAGE PREVIEW */}
            {preview && (
              <div className="col-md-6 d-flex align-items-end">
                <img
                  src={preview.url}
                  alt="preview"
                  className="rounded shadow"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}

            {/* STATUS */}
            <div className="col-md-6 d-flex align-items-end mt-3">
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
        </form>
      </div>
    </>
  );
}
