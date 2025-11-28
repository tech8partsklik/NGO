import { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";

import { addRole } from "../../../services/role.service";

export default function AddRoleModal({ show, onHide, onSuccess }) {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  // ✅ Auto focus when modal opens
  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role.trim()) return toast.error("Role is required");

    setLoading(true);
    const toastId = toast.loading("Adding role...");

    try {
      await addRole({ role });

      toast.success("Role added ✅", { id: toastId });

      setRole("");
      onSuccess && onSuccess();

    } catch (err) {
      console.error(err);
      toast.error("Failed to add ❌", { id: toastId });

    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <form onSubmit={handleSubmit}>

        <Modal.Header closeButton>
          <Modal.Title>Add Role</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <label className="form-label">Role Name</label>
          <input
            ref={inputRef}
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Enter role name"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>

          <Button variant="dark" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Role"}
          </Button>
        </Modal.Footer>

      </form>
    </Modal>
  );
}
