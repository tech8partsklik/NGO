import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Modal, Button } from "react-bootstrap";

import { getAllMembers, approveMember, blockMember } from "../../../services/member.service";
import { debounce } from "../../../utils/debounce";

import FilterTopBar from "../../../common/FilterTopBar/FilterTopBar";
import Pagination from "../../../common/Pagination/Pagination";
import { BASE_MEDIA_URL } from "../../../services/endpoints";

import AddMemberModal from "./AddMemberModal";
import UpdateMemberModal from "./UpdateMemberModal";
import FilterSelectionModal from "../../../components/FilterModals/FilterSelectionModal";

export default function AllMembers() {
    const location = useLocation();
    const navigate = useNavigate();

    // ---------------- STATES ----------------
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [editMember, setEditMember] = useState(null);

    const openUpdateModal = (member) => {
        setEditMember(member);
        setShowUpdateModal(true);
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(
        Number(new URLSearchParams(location.search).get("current_page")) || 1
    );

    const [pageSize, setPageSize] = useState(
        Number(new URLSearchParams(location.search).get("page_size")) || 25
    );

    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);

    const [searchQuery, setSearchQuery] = useState(
        new URLSearchParams(location.search).get("search") || ""
    );

    const [selectedStatus, setSelectedStatus] = useState(
        new URLSearchParams(location.search).get("account_status")?.split(",") || []
    );

    // ----------------- STATUS OPTIONS -----------------
    const statusOptions = [
        { value: "active", label: "Active" },
        { value: "pending", label: "Pending" }
    ];

    // ---------------- DEBOUNCE SEARCH ----------------
    const debouncedFetchMembers = useCallback(
        debounce((query) => {
            fetchData(1, query);
        }, 500),
        []
    );

    // ---------------- FETCH MEMBERS ----------------
    const fetchData = async (page = currentPage, query = searchQuery) => {
        setLoading(true);

        const payload = {
            search: query,
            page_number: page,
            page_size: pageSize,
            account_status: selectedStatus[0] || ""
        };

        try {
            const res = await getAllMembers(payload);

            setMembers(res.data || []);
            setTotalPages(res.total_pages || 0);
            setTotalRows(res.total_rows || 0);

        } catch (err) {
            console.error(err);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, selectedStatus]);

    // ---------------- UPDATE URL PARAMS ----------------
    useEffect(() => {
        const params = new URLSearchParams();

        if (searchQuery) params.set("search", searchQuery);
        if (selectedStatus.length) params.set("account_status", selectedStatus.join(","));

        params.set("current_page", currentPage);
        params.set("page_size", pageSize);

        navigate(`?${params.toString()}`, { replace: true });

    }, [searchQuery, currentPage, pageSize, selectedStatus]);

    // ---------------- HANDLERS ----------------
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchData(page, searchQuery);
    };

    const handleClearAllFilter = () => {
        setSearchQuery("");
        setSelectedStatus([]);
        setCurrentPage(1);
        fetchData(1, "");
    };

    const isFilterApplied = () => {
        return searchQuery !== "" || selectedStatus.length > 0;
    };

    // ---------------- CONFIRM MODAL ----------------
    const [showModal, setShowModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [actionType, setActionType] = useState("");

    const openConfirmModal = (member, type) => {
        setSelectedMember(member);
        setActionType(type);
        setShowModal(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedMember) return;

        try {
            if (actionType === "approve") await approveMember(selectedMember.id);
            if (actionType === "block") await blockMember(selectedMember.id);

            fetchData(currentPage, searchQuery);

        } catch (err) {
            console.error(err);
        } finally {
            setShowModal(false);
            setSelectedMember(null);
            setActionType("");
        }
    };

    // ---------------- MENUS ----------------
    const menus = [
        {
            name: "Add Member",
            icon: <i className="fa-solid fa-user-plus me-1"></i>,
            className: "btn-dark",
            onClick: () => setShowAddModal(true)
        },
        {
            type: "dropdown",
            label: "Quick Actions",
            items: [
                { name: "Approved Members", onClick: () => setSelectedStatus(["active"]) },
                { name: "Pending Members", onClick: () => setSelectedStatus(["pending"]) }
            ]
        }
    ];

    return (
        <>
            {/* ADD MODAL */}
            {showAddModal && (
                <AddMemberModal
                    show={showAddModal}
                    onHide={() => setShowAddModal(false)}
                    onSuccess={() => fetchData(currentPage, searchQuery)}
                />
            )}

            {/* UPDATE MODAL */}
            {showUpdateModal && (
                <UpdateMemberModal
                    show={showUpdateModal}
                    onHide={() => setShowUpdateModal(false)}
                    member={editMember}
                    onSuccess={() => fetchData(currentPage, searchQuery)}
                />
            )}

            {/* BREADCRUMB */}
            <nav>
                <ol className="breadcrumb mb-2">
                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Members</li>
                </ol>
            </nav>

            {/* FILTER BAR */}
            <FilterTopBar
                defaultSearch={searchQuery}
                onSearch={(q) => {
                    setSearchQuery(q);
                    setCurrentPage(1);
                    debouncedFetchMembers(q);
                }}
                onClear={handleClearAllFilter}
                isFilterApplied={isFilterApplied()}
                menus={menus}
            />

            {/* TABLE */}
            <div className="main-table">
                <table className="table table-bordered mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>

                            {/* FILTER IN TH */}
                            <th>
                                <FilterSelectionModal
                                    title="Status"
                                    options={statusOptions}
                                    selectedOptions={selectedStatus}
                                    onSelect={setSelectedStatus}
                                    searchable={false}
                                    selectableAll={false}
                                    multiSelection={false}
                                />
                            </th>

                            <th>City</th>
                            <th style={{ width: 140 }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            [...Array(7)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(8)].map((_, j) => (
                                        <td key={j}><Skeleton height={24} /></td>
                                    ))}
                                </tr>
                            ))
                        ) : members.length > 0 ? (
                            members.map((m) => (
                                <tr key={m.id}>
                                    <td>{m.id}</td>

                                    <td>
                                        <img
                                            src={
                                                m.profile_photo
                                                    ? `${BASE_MEDIA_URL}${m.profile_photo}`
                                                    : "https://via.placeholder.com/40"
                                            }
                                            width="40"
                                            height="40"
                                            className="rounded-circle object-fit-cover"
                                        />
                                    </td>

                                    <td>{m.full_name}</td>
                                    <td>{m.email}</td>
                                    <td>{m.phone || "-"}</td>

                                    <td>
                                        {m.is_active ? (
                                            <span className="badge bg-success">Active</span>
                                        ) : (
                                            <span className="badge bg-warning text-dark">Pending</span>
                                        )}
                                    </td>

                                    <td>{m.city}</td>

                                    <td className="text-nowrap">
                                        <button
                                            className="btn btn-primary btn-sm me-1"
                                            onClick={() => openUpdateModal(m)}
                                        >
                                            <i className="fa fa-pen"></i>
                                        </button>

                                        {!m.is_active ? (
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => openConfirmModal(m, "approve")}
                                            >
                                                <i className="fa-solid fa-check me-1"></i> Approve
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => openConfirmModal(m, "block")}
                                            >
                                                <i className="fa-solid fa-ban me-1"></i> Disapprove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="no-data-found py-4">
                                    No Members Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalRows}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
                disabled={loading}
            />

            {/* CONFIRM MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {actionType === "approve" ? "Approve Member" : "Disapprove Member"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Are you sure you want to <strong>{actionType === "approve" ? "Approve Member" : "Disapprove Member"}</strong>?
                    <div className="mt-2 p-2 bg-light rounded">
                        <strong>{selectedMember?.full_name}</strong>
                        <br />
                        <small>{selectedMember?.email}</small>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>

                    <Button
                        variant={actionType === "approve" ? "success" : "danger"}
                        onClick={handleConfirmAction}
                    >
                        Yes, {actionType === "approve" ? "Approve" : "Disapprove"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
