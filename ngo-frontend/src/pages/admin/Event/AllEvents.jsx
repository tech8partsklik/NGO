import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

import FilterTopBar from "../../../common/FilterTopBar/FilterTopBar";
import ConfirmDeleteModal from "../../../common/ConfirmDeleteModal";
import Pagination from "../../../common/Pagination/Pagination";
import { debounce } from "../../../utils/debounce";
import { BASE_MEDIA_URL } from "../../../services/endpoints";
import { deleteEvent, getAllEvents } from "../../../services/event.service";

export default function AllEvents() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

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

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedFetch = useCallback(
    debounce((q) => fetchData(1, q), 400),
    []
  );

  const fetchData = async (page = currentPage, query = searchQuery) => {
    setLoading(true);

    try {
      const payload = {
        ids: [],
        search: query,
        page_number: page,
        page_size: pageSize,
      };

      const res = await getAllEvents(payload);

      setRows(res.data || []);
      setTotalPages(res.total_pages || 0);
      setTotalRows(res.total_rows || 0);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);

    params.set("current_page", currentPage);
    params.set("page_size", pageSize);

    navigate(`?${params.toString()}`, { replace: true });
  }, [searchQuery, currentPage, pageSize]);

  const menus = [
    {
      name: "Add Event",
      className: "btn-dark",
      icon: <i className="fa fa-plus me-1" />,
      onClick: () => navigate("/admin/events/add"),
    }
  ];

  const handleDelete = async () => {
    if (!selectedId) return;

    setDeleteLoading(true);
    const toastId = toast.loading("Deleting...");

    try {
      await deleteEvent({ pk: selectedId });
      toast.success("Deleted successfully", { id: toastId });
      setDeleteModal(false);
      fetchData(currentPage, searchQuery);
    } catch (err) {
      toast.error("Delete failed", { id: toastId });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <nav>
        <ol className="breadcrumb mb-2">
          <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item active">Events</li>
        </ol>
      </nav>

      <FilterTopBar
        defaultSearch={searchQuery}
        onSearch={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
          debouncedFetch(q);
        }}
        menus={menus}
        isFilterApplied={searchQuery}
        onClear={() => {
          setSearchQuery("");
          setCurrentPage(1);
          fetchData(1, "");
        }}
      />

      <div className="main-table">
        <table className="table table-bordered mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Active</th>
              <th style={{ width: 120 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(7)].map((_, i) => (
                <tr key={i}>
                  {[...Array(5)].map((_, j) => (
                    <td key={j}><Skeleton height={26} /></td>
                  ))}
                </tr>
              ))
            ) : rows.length ? (
              rows.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {item?.thumbnail ? (
                      <img
                      src={`${BASE_MEDIA_URL}${item?.thumbnail}`}
                      width={70}
                      height={45}
                      className="object-fit-cover rounded"
                      />
                    ) : (
                      <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 70, height: 45 }}>
                        N/A
                      </div>
                    )}
                  </td>
                  <td>{item?.title}</td>
                  <td>
                    {item.is_active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>

                  <td className="text-nowrap">
                    <Link to={`/admin/events/${item.id}`} className="btn btn-primary btn-sm me-1">
                      <i className="fa fa-pen" />
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setSelectedId(item.id);
                        setDeleteModal(true);
                      }}
                    >
                      <i className="fa fa-trash" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center py-4">No News Found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRows={totalRows}
        onPageChange={(p) => setCurrentPage(p)}
        pageSize={pageSize}
        setPageSize={setPageSize}
        disabled={loading}
      />

      <ConfirmDeleteModal
        show={deleteModal}
        onHide={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Event"
        message="Are you sure you want to delete this event item?"
      />
    </>
  );
}
