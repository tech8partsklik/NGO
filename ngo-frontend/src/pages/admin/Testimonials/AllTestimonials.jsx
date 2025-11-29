import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";

import { getAllTestimonials, deleteTestimonial } from "../../../services/testimonial.service";
import { debounce } from "../../../utils/debounce";

import FilterTopBar from "../../../common/FilterTopBar/FilterTopBar";
import Pagination from "../../../common/Pagination/Pagination";
import ConfirmDeleteModal from "../../../common/ConfirmDeleteModal";
import { BASE_MEDIA_URL } from "../../../services/endpoints";

export default function AllTestimonials() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);

  const [currentPage, setCurrentPage] = useState(
    Number(new URLSearchParams(location.search).get("current_page")) || 1
  );

  const [pageSize, setPageSize] = useState(
    Number(new URLSearchParams(location.search).get("page_size")) || 10
  );

  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);

  const [searchQuery, setSearchQuery] = useState(
    new URLSearchParams(location.search).get("search") || ""
  );

  const [status, setStatus] = useState(
    new URLSearchParams(location.search).get("status") || ""
  );

  // ---------------- DELETE MODAL ----------------
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    setDeleteLoading(true);
    const toastId = toast.loading("Deleting testimonial...");

    try {
      await deleteTestimonial({ pk: selectedId });

      toast.success("Deleted ✅", { id: toastId });
      setShowDeleteModal(false);
      setSelectedId(null);

      fetchData(currentPage, searchQuery);
    } catch (err) {
      console.error(err);
      toast.error("Delete failed ❌", { id: toastId });
    } finally {
      setDeleteLoading(false);
    }
  };

  // ---------------- DEBOUNCE SEARCH ----------------
  const debouncedFetch = useCallback(
    debounce((query) => {
      fetchData(1, query);
    }, 500),
    []
  );

  // ---------------- FETCH DATA ----------------
  const fetchData = async (page = currentPage, query = searchQuery) => {
    setLoading(true);

    const payload = {
      ids: [],
      search: query,
      page_number: page,
      page_size: pageSize,
      status
    };

    try {
      const res = await getAllTestimonials(payload);

      setTestimonials(res.data || []);
      setTotalPages(res.total_pages || 0);
      setTotalRows(res.total_rows || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH ON CHANGE ----------------
  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, status]);

  // ---------------- UPDATE URL PARAMS ----------------
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (status) params.set("status", status);

    params.set("current_page", currentPage);
    params.set("page_size", pageSize);

    navigate(`?${params.toString()}`, { replace: true });
  }, [searchQuery, currentPage, pageSize, status]);

  // ---------------- HANDLERS ----------------
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
      name: "Add Testimonial",
      icon: <i className="fa fa-plus me-1"></i>,
      className: "btn-dark",
      onClick: () => navigate("/admin/testimonials/add")
    },
    {
      type: "dropdown",
      label: "Quick Filter",
      items: [
        { name: "Active", onClick: () => setStatus("active") },
        { name: "Draft", onClick: () => setStatus("draft") }
      ]
    }
  ];

  return (
    <>
      {/* ================= BREADCRUMB ================= */}
      <nav>
        <ol className="breadcrumb mb-2">
          <li className="breadcrumb-item">
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Testimonials</li>
        </ol>
      </nav>

      {/* ================= FILTER BAR ================= */}
      <FilterTopBar
        defaultSearch={searchQuery}
        onSearch={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
          debouncedFetch(q);
        }}
        onClear={handleClearAllFilter}
        isFilterApplied={isFilterApplied()}
        menus={menus}
      />

      {/* ================= MAIN TABLE ================= */}
      <div className="main-table">
        <table className="table table-bordered mb-0">

          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name / Company</th>
              <th>Title</th>
              <th>Message</th>
              <th>Status</th>
              <th style={{ width: 120 }}>Action</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              [...Array(7)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j}>
                      <Skeleton height={26} />
                    </td>
                  ))}
                </tr>
              ))

            ) : testimonials.length > 0 ? (

              testimonials.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>

                  <td>
                    <img
                      src={`${BASE_MEDIA_URL}/${item.image}`}
                      width="45"
                      height="45"
                      className="rounded-circle object-fit-cover"
                    />
                  </td>

                  <td>
                    <strong>{item.person_name}</strong>
                    <br />
                    <small>{item.company} • {item.designation}</small>
                  </td>

                  <td>{item.title}</td>

                  <td>
                    <div
                      style={{ maxWidth: 300 }}
                      dangerouslySetInnerHTML={{ __html: item.message }}
                    />
                  </td>

                  <td>
                    {item.is_active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Draft</span>
                    )}
                  </td>

                  <td className="text-nowrap">
                    {/* EDIT - PAGE */}
                    <Link
                      to={`/admin/testimonials/${item.id}`}
                      className="btn btn-primary btn-sm me-1"
                    >
                      <i className="fa fa-pen"></i>
                    </Link>

                    {/* DELETE */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => openDeleteModal(item.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))

            ) : (
              <tr>
                <td colSpan="7" className="no-data-found py-4">
                  No Testimonials Found
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
        setPageSize={setPageSize}
        setCurrentPage={setCurrentPage}
        disabled={loading}
      />

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={deleteLoading}
          title="Delete Testimonial"
          message="Are you sure you want to delete this testimonial?"
        />
      )}

    </>
  );
}
