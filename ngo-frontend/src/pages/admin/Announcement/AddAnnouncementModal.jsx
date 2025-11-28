import { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { addAnnouncement } from "../../../services/announcement.service";

export default function AddAnnouncementModal({ show, onHide, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const [form, setForm] = useState({
        text: "",
        is_active: true,
        expiring_at: ""
    });

    useEffect(() => {
        if (show) {
            // ✅ Clear form on open
            setForm({
                text: "",
                is_active: true,
                expiring_at: ""
            });

            setLoading(false);

            // ✅ Autofocus
            setTimeout(() => {
                inputRef.current?.focus();
            }, 200);
        }
    }, [show]);


    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]:
                e.target.type === "checkbox" ? e.target.checked : e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.text.trim()) return toast.error("Text is required");

        setLoading(true);
        const toastId = toast.loading("Adding...");

        try {
            await addAnnouncement(form);

            toast.success("Announcement added ✅", { id: toastId });
            onSuccess && onSuccess();
            onHide();

        } catch (error) {
            console.error(error);
            toast.error("Failed ❌", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Announcement</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <label className="form-label">Announcement Text</label>
                    <textarea
                        ref={inputRef}
                        className="form-control mb-3"
                        rows="3"
                        name="text"
                        value={form.text}
                        onChange={handleChange}
                    />

                    <label className="form-label">Expire Date</label>
                    <input
                        type="date"
                        name="expiring_at"
                        className="form-control mb-3"
                        value={form.expiring_at}
                        onChange={handleChange}
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
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button type="submit" variant="dark" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
