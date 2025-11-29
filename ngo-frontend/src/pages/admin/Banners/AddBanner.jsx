import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addBanner } from "../../../services/banner.service";
import UrlSelector from "../../../components/admin/Helps/UrlSelector";
import MediaUploader from "../../../components/admin/Helps/MediaUploader/MediaUploader";
import RichTextEditor from "../../../components/admin/Helps/RichTextEditor";

export default function AddBanner() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select image or video");

    // --------------------------
    // Detect file type on submit
    // --------------------------
    const ext = file.name.split(".").pop().toLowerCase();
    const isVideo = ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm"].includes(ext);
    const fileType = isVideo ? "Video" : "Image";

    // Inject file_type before upload
    const updatedForm = {
      ...form,
      file_type: fileType,
    };

    setLoading(true);
    const toastId = toast.loading("Uploading banner...");

    try {
      const fd = new FormData();

      // Append updated form
      Object.keys(updatedForm).forEach((key) => fd.append(key, updatedForm[key]));

      // Append file
      fd.append("file", file);

      await addBanner(fd);

      toast.success("Banner added successfully ", { id: toastId });
      navigate("/admin/banners");

    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to add banner",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <>


      <div className="max-width">
        {/* HEADER */}
        <div className="sticky-header d-flex justify-content-between align-items-center">
          <div>
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <a href="/admin/dashboard">Dashboard</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/admin/banners">Banners</a>
              </li>
              <li className="breadcrumb-item active">Add Banner</li>
            </ol>
            <h4 className="fw-semibold mb-0">Add New Banner</h4>
          </div>

          <button
            className="btn btn-dark px-4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Banner"}
          </button>
        </div>

        <div className="card p-4 border-0 shadow-sm">

          {/* FILE UPLOAD */}
          <h6 className="fw-bold text-uppercase mb-3">Upload Banner File</h6>

          <MediaUploader
            label="Media"
            accept="both"
            multiple={false}
            onChange={(file) => setFile(file)}
          />



          <hr />

          {/* BANNER DETAILS */}
          <h6 className="fw-bold text-uppercase mb-3">Banner Details</h6>

          <div className="row g-4">

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

            <div className="col-md-6">
              <label className="form-label">Subtitle</label>
              <input
                className="form-control"
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
              />
            </div>

            {/* DESCRIPTION (JODIT) */}
            <div className="col-12">
              <RichTextEditor
                label="Description"
                value={form.description}
                height={600}
                onChange={(content) =>
                  setForm(prev => ({ ...prev, description: content }))
                }
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

            {/* BUTTON URL SELECT / MANUAL */}
            <div className="col-md-4">
              <label className="form-label">Button URL</label>

              <UrlSelector
                value={form.button_url}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, button_url: val }))
                }
              />
            </div>


          </div>

          <hr className="mt-4" />





          {/* VISIBILITY SETTINGS */}
          <h6 className="fw-bold text-uppercase mb-3">Visibility Settings</h6>

          <div className="row gy-4 mb-4">
            {/* STATUS */}
            <div className="col-md-4">
              <label className="form-label mb-1">Status</label>
              <div className="d-flex align-items-center">
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
                  {form.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* MOBILE */}
            <div className="col-md-4">
              <label className="form-label mb-1">Mobile</label>
              <div className="d-flex align-items-center">
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
                  {form.is_phone ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            {/* DESKTOP */}
            <div className="col-md-4">
              <label className="form-label mb-1">Desktop</label>
              <div className="d-flex align-items-center">
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
                  {form.is_desktop ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
