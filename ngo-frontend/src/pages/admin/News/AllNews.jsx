import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

import { getAllNews, deleteNews } from "../../../services/news.service";
import FilterTopBar from "../../../common/FilterTopBar/FilterTopBar";
import ConfirmDeleteModal from "../../../common/ConfirmDeleteModal";
import Pagination from "../../../common/Pagination/Pagination";
import { debounce } from "../../../utils/debounce";

export default function AllNews() {
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

      const res = await getAllNews(payload);

      setRows(res.data || []);
      setTotalPages(res.total_pages || 0);
      setTotalRows(res.total_rows || 0);
    } catch (err) {
      toast.error("Failed to load news");
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
      name: "Add News",
      className: "btn-dark",
      icon: <i className="fa fa-plus me-1" />,
      onClick: () => navigate("/admin/news/add"),
    }
  ];

  const handleDelete = async () => {
    if (!selectedId) return;

    setDeleteLoading(true);
    const toastId = toast.loading("Deleting...");

    try {
      await deleteNews({ pk: selectedId });
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
          <li className="breadcrumb-item active">News</li>
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
              <th>Title</th>
              <th>Active</th>
              <th style={{ width: 120 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(7)].map((_, i) => (
                <tr key={i}>
                  {[...Array(4)].map((_, j) => (
                    <td key={j}><Skeleton height={26} /></td>
                  ))}
                </tr>
              ))
            ) : rows.length ? (
              rows.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>

                  <td>
                    {item.is_active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>

                  <td className="text-nowrap">
                    <Link to={`/admin/news/${item.id}`} className="btn btn-primary btn-sm me-1">
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
              <tr><td colSpan="4" className="text-center py-4">No News Found</td></tr>
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
        title="Delete News"
        message="Are you sure you want to delete this news item?"
      />
    </>
  );
}
