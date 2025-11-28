import { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";

import { updateRole } from "../../../services/role.service";

export default function EditRoleModal({ show, onHide, role, onSuccess }) {

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  // ✅ Set value + focus
  useEffect(() => {
    if (role) {
      setName(role.name);
    }
  }, [role]);

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Role name is required");

    setLoading(true);
    const toastId = toast.loading("Updating role...");

    try {
      await updateRole({
        role_pk: role.id,
        role: name
      });

      toast.success("Role updated ✅", { id: toastId });
      onSuccess && onSuccess();

    } catch (err) {
      console.error(err);
      toast.error("Update failed ❌", { id: toastId });

    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <form onSubmit={handleSubmit}>

        <Modal.Header closeButton>
          <Modal.Title>Edit Role</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <label className="form-label">Role Name</label>
          <input
            ref={inputRef}
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Role"}
          </Button>
        </Modal.Footer>

      </form>
    </Modal>
  );
}
