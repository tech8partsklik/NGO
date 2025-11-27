import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Modal, Button } from "react-bootstrap";
import { approveMember, blockMember } from "../../../services/member.service";


import { getAllMembers } from "../../../services/member.service";
import { debounce } from "../../../utils/debounce";

import FilterTopBar from "../../../common/FilterTopBar/FilterTopBar";
import Pagination from "../../../common/Pagination/Pagination";
import { BASE_MEDIA_URL } from "../../../services/endpoints";

export default function AllMembers() {
    const location = useLocation();
    const navigate = useNavigate();

    // -----------------------------
    // STATES
    // -----------------------------
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);

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

    const [status, setStatus] = useState(
        new URLSearchParams(location.search).get("account_status") || ""
    );

    // -----------------------------
    // DEBOUNCE SEARCH
    // -----------------------------
    const debouncedFetchMembers = useCallback(
        debounce((query) => {
            fetchData(1, query);
        }, 500),
        []
    );

    // -----------------------------
    // FETCH
    // -----------------------------
    const fetchData = async (page = currentPage, query = searchQuery) => {
        setLoading(true);

        const payload = {
            search: query,
            page_number: page,
            page_size: pageSize,
            account_status: status
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

    // -----------------------------
    // FETCH ON INIT / PAGE CHANGE
    // -----------------------------
    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, status]);

    // -----------------------------
    // UPDATE URL
    // -----------------------------
    useEffect(() => {
        const params = new URLSearchParams();

        if (searchQuery) params.set("search", searchQuery);
        if (status) params.set("account_status", status);

        params.set("current_page", currentPage);
        params.set("page_size", pageSize);

        navigate(`?${params.toString()}`, { replace: true });
    }, [searchQuery, currentPage, pageSize, status]);

    // -----------------------------
    // HANDLERS
    // -----------------------------
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchData(page, searchQuery);
    };

    const handleClearAllFilter = () => {
        setSearchQuery("");
        setStatus("");
        setCurrentPage(1);
        fetchData(1, "");
    };

    const isFilterApplied = () => {
        return searchQuery !== "" || status !== "";
    };

    const menus = [
        {
            url: "/admin/members/add",
            name: "Add Member",
            icon: <i className="fa-solid fa-user-plus me-1"></i>,
            className: "btn-dark"
        },
        {
            type: "dropdown",
            label: "Quick Actions",
            items: [
                { name: "Approved Members", onClick: () => setStatus("active") },
                { name: "Pending Members", onClick: () => setStatus("pending") },
            ]
        }
    ];



    const [showModal, setShowModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [actionType, setActionType] = useState(""); // approve | block
    const openConfirmModal = (member, type) => {
        setSelectedMember(member);
        setActionType(type);
        setShowModal(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedMember) return;

        try {
            if (actionType === "approve") {
                await approveMember(selectedMember.id);
            }

            if (actionType === "block") {
                await blockMember(selectedMember.id);
            }

            fetchData(currentPage, searchQuery); // refresh table
        } catch (err) {
            console.error(err);
        } finally {
            setShowModal(false);
            setSelectedMember(null);
            setActionType("");
        }
    };



    return (
        <>

            {/* ================= BREADCRUMB ================= */}
            <nav>
                <ol className="breadcrumb mb-2">
                    <li className="breadcrumb-item">
                        <Link to="/admin/dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Members</li>
                </ol>
            </nav>

            {/* ================= FILTER BAR ================= */}
            <FilterTopBar
                defaultSearch={searchQuery}
                onSearch={(q) => {
                    setSearchQuery(q);
                    setCurrentPage(1);
                    debouncedFetchMembers(q);
                }}
                onClear={handleClearAllFilter}
                // onApply={() => fetchData(1, searchQuery)}
                isFilterApplied={isFilterApplied()}
                menus={menus}
            />

            {/* ================= MAIN TABLE ================= */}
            <div className="main-table">

                <table className="table table-bordered mb-0">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>City</th>
                            <th style={{ width: 120 }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {loading ? (
                            [...Array(7)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(8)].map((_, j) => (
                                        <td key={j}>
                                            <Skeleton height={24} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : members.length > 0 ? (
                            members.map((m, index) => (
                                <tr key={m.id}>
                                    <td>{index + 1}</td>

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

                                    <td className="actions">
                                        {!m.is_active ? (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => openConfirmModal(m, "approve")}
                                            >
                                                <i className="fa-solid fa-check me-1"></i> Approve
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => openConfirmModal(m, "block")}
                                            >
                                                <i className="fa-solid fa-ban me-1"></i> Block
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

            {/* ================= PAGINATION ================= */}
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















            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {actionType === "approve" ? "Approve Member" : "Block Member"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Are you sure you want to{" "}
                    <strong>{actionType}</strong> this member?

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
                        Yes, {actionType}
                    </Button>
                </Modal.Footer>
            </Modal>





        </>
    );
}
