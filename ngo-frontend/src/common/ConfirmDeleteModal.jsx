import { useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";

export default function ConfirmDeleteModal({
  show,
  onHide,
  onConfirm,
  loading,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?"
}) {
  const deleteBtnRef = useRef(null);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        deleteBtnRef.current?.focus();
      }, 200);
    }
  }, [show]);

  return (
    <>
        <Modal show={show} onHide={loading ? null : onHide} centered backdrop="static">
        <Modal.Header closeButton={!loading}>
            <Modal.Title>
            <i className="fa fa-trash me-2 text-danger"></i>
            {title}
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <p className="mb-0">{message}</p>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
            </Button>

            <Button
            ref={deleteBtnRef}
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
            >
            {loading ? "Deleting..." : "Yes, Delete"}
            </Button>
        </Modal.Footer>
        </Modal>
    </>
  );
}
