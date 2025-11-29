import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getAllBanners, updateBanner } from "../../../services/banner.service";
import { BASE_MEDIA_URL } from "../../../services/endpoints";

import MediaUploader from "../../../components/admin/Helps/MediaUploader/MediaUploader";
import RichTextEditor from "../../../components/admin/Helps/RichTextEditor";
import UrlSelector from "../../../components/admin/Helps/UrlSelector";

export default function UpdateBanner() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [existingBanner, setExistingBanner] = useState(null);
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

  // ===================== LOAD BANNER =====================
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
          description: banner.description || "",
          position: banner.position || "",
          file_type: banner.file_type || "Image",
          button_text: banner.button_text || "",
          button_url: banner.button_url || "",
          is_active: banner.is_active ? 1 : 0,
          is_phone: banner.is_phone ? 1 : 0,
          is_desktop: banner.is_desktop ? 1 : 0,
        });
      }
    } catch (err) {
      toast.error("Failed to load banner");
    }
  };

  useEffect(() => {
    loadBanner();
  }, []);

  // ===================== CHANGES =====================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // NEW FILE SELECT
  const handleFile = (file) => {
    setFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview({
        type: file.type.startsWith("video") ? "video" : "image",
        url,
      });

      setForm((prev) => ({
        ...prev,
        file_type: file.type.startsWith("video") ? "Video" : "Image",
      }));
    }
  };

  // ===================== SUBMIT =====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!existingBanner) return;

    setLoading(true);
    const toastId = toast.loading("Updating banner...");

    try {
      const fd = new FormData();

      fd.append("banner_pk", existingBanner.id);

      Object.keys(form).forEach((key) => {
        fd.append(key, form[key]);
      });

      if (file) {
        fd.append("file", file);
      }

      await updateBanner(fd);

      toast.success("Banner updated successfully", { id: toastId });
      navigate("/admin/banners");
    } catch (error) {
      toast.error("Failed to update banner", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!existingBanner) return null;

  return (
    <>

      <div className="max-width">

        {/* STICKY HEADER */}
        <div className="sticky-header d-flex justify-content-between align-items-center">
          <div>
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <a href="/admin/dashboard">Dashboard</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/admin/banners">Banners</a>
              </li>
              <li className="breadcrumb-item active">Edit Banner</li>
            </ol>
            <h4 className="fw-semibold mb-0">Edit Banner</h4>
          </div>

          <button
            className="btn btn-dark px-4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Banner"}
          </button>
        </div>

        {/* MAIN CARD */}
        <div className="card p-4 border-0 shadow-sm">

          {/* FILE UPLOAD */}
          <h6 className="fw-bold text-uppercase mb-3">Update Banner File</h6>

          <MediaUploader
            label="Media"
            accept="both"
            multiple={false}
            value={
              !file && existingBanner?.file
                ? BASE_MEDIA_URL + existingBanner.file
                : null
            }
            onChange={(file) => handleFile(file)}
          />

          <hr />

          {/* DETAILS */}
          <h6 className="fw-bold text-uppercase mb-3">Banner Details</h6>

          <div className="row g-4">

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

            <div className="col-12">
              <RichTextEditor
                label="Description"
                value={form.description}
                height={600}
                onChange={(content) =>
                  setForm((prev) => ({ ...prev, description: content }))
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
              <UrlSelector
                value={form.button_url}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, button_url: val }))
                }
              />
            </div>

          </div>

          <hr className="mt-4" />

          {/* VISIBILITY */}
          <h6 className="fw-bold text-uppercase mb-3">Visibility Settings</h6>

          <div className="row gy-4 mb-4">

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
