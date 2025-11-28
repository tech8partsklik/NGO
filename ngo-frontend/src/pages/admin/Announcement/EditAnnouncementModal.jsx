import { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { updateAnnouncement } from "../../../services/announcement.service";

export default function EditAnnouncementModal({ show, onHide, announcement, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const [form, setForm] = useState({
    pk: "",
    text: "",
    is_active: true,
    expiring_at: ""
  });

  useEffect(() => {
    if (announcement) {
      setForm({
        pk: announcement.id,
        text: announcement.text || "",
        is_active: announcement.is_active,
        expiring_at: announcement.expiring_at || ""
      });

      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [announcement]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const toastId = toast.loading("Updating...");

    try {
      await updateAnnouncement(form);

      toast.success("Updated ✅", { id: toastId });
      onSuccess && onSuccess();
      onHide();

    } catch (error) {
      console.error(error);
      toast.error("Update failed ❌", { id: toastId });

    } finally {
      setLoading(false);
    }
  };

  if (!announcement) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Announcement</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <label className="form-label">Text</label>
          <textarea
            ref={inputRef}
            className="form-control mb-3"
            rows="3"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
          />

          <label className="form-label">Expire Date</label>
          <input
            type="date"
            className="form-control mb-3"
            value={form.expiring_at}
            onChange={(e) => setForm({ ...form, expiring_at: e.target.value })}
          />

          <label className="form-label d-block">Status</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  is_active: e.target.checked
                }))
              }
            />
            <span className="slider round"></span>
          </label>
          <span className="ms-2">
            {form.is_active ? "Active" : "Inactive"}
          </span>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>

      </form>
    </Modal>
  );
}
