import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import { Modal, Button } from "react-bootstrap";

import { getAllRoles, deleteRole } from "../../../services/role.service";
import AddRoleModal from "./AddRoleModal";
import EditRoleModal from "./EditRoleModal";

export default function AllRoles() {
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const [selectedRole, setSelectedRole] = useState(null);
    const [showDelete, setShowDelete] = useState(false);

    // ================= FETCH =================
    const fetchRoles = async () => {
        setLoading(true);
        try {
            const res = await getAllRoles();

            if (res?.status === 1) {
                setRoles(res.data || []);
            } else {
                toast.error("Failed to fetch roles");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // ================= DELETE =================
    const handleDelete = async () => {
        if (!selectedRole) return;

        const toastId = toast.loading("Deleting role...");

        try {
            await deleteRole({ role_pk: selectedRole.id });

            toast.success("Role deleted ", { id: toastId });
            setShowDelete(false);
            setSelectedRole(null);
            fetchRoles();
        } catch (err) {
            console.error(err);
            // Extract backend error message safely
            const backendMsg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Delete failed";

            toast.error(`Delete failed: ${backendMsg}`, { id: toastId });
        }
    };

    return (
        <>
            {/* HEAD */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                    <i className="fa-solid fa-user-shield me-2"></i>
                    Roles
                </h5>

                <button className="btn btn-dark" onClick={() => setShowAdd(true)}>
                    <i className="fa fa-plus me-1"></i> Add Role
                </button>
            </div>

            {/* TABLE */}
            <div className="main-table">
                <table className="table table-bordered mb-0">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Role Name</th>
                            <th style={{ width: 130 }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(3)].map((_, j) => (
                                        <td key={j}><Skeleton height={22} /></td>
                                    ))}
                                </tr>
                            ))
                        ) : roles.length > 0 ? (
                            roles.map((role, index) => (
                                <tr key={role.id}>
                                    <td>{index + 1}</td>
                                    <td>{role.name}</td>

                                    <td className="text-nowrap">
                                        <button
                                            className="btn btn-primary me-1"
                                            onClick={() => {
                                                setSelectedRole(role);
                                                setShowEdit(true);
                                            }}
                                        >
                                            <i className="fa fa-pen"></i>
                                        </button>

                                        <button
                                            className="btn btn-danger"
                                            onClick={() => {
                                                setSelectedRole(role);
                                                setShowDelete(true);
                                            }}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4">
                                    No Roles Found
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {/* ADD MODAL */}
            {showAdd && (
                <AddRoleModal
                    show={showAdd}
                    onHide={() => setShowAdd(false)}
                    onSuccess={() => {
                        setShowAdd(false);
                        fetchRoles();
                    }}
                />
            )}

            {/* EDIT MODAL */}
            {showEdit && selectedRole && (
                <EditRoleModal
                    show={showEdit}
                    onHide={() => setShowEdit(false)}
                    role={selectedRole}
                    onSuccess={() => {
                        setShowEdit(false);
                        setSelectedRole(null);
                        fetchRoles();
                    }}
                />
            )}

            {/* DELETE CONFIRM */}
            <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Role</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Are you sure you want to delete this role?

                    <div className="mt-2 p-2 bg-light rounded">
                        <strong>{selectedRole?.name}</strong>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDelete(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Yes, Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
