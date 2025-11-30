import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";

import { getAllGallery, deleteGallery } from "../../../services/gallery.service";
import { debounce } from "../../../utils/debounce";
import FilterTopBar from "../../../common/FilterTopBar/FilterTopBar";
import Pagination from "../../../common/Pagination/Pagination";
import ConfirmDeleteModal from "../../../common/ConfirmDeleteModal";
import { BASE_MEDIA_URL } from "../../../services/endpoints";

export default function AllGallery() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

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

  // Delete modal
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
    const toastId = toast.loading("Deleting...");

    try {
      await deleteGallery({ pk: selectedId });

      toast.success("Deleted successfully", { id: toastId });
      setShowDeleteModal(false);
      fetchData(currentPage, searchQuery);
    } catch (err) {
      toast.error("Delete failed", { id: toastId });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Debounced search
  const debouncedFetch = useCallback(
    debounce((query) => fetchData(1, query), 400),
    []
  );

  const fetchData = async (page = currentPage, query = searchQuery) => {
    setLoading(true);

    const payload = {
      ids: [],
      search: query,
      page_number: page,
      page_size: pageSize
      // ❌ removed file_type filter
    };

    try {
      const res = await getAllGallery(payload);

      setItems(res.data || []);
      setTotalPages(res.total_pages || 0);
      setTotalRows(res.total_rows || 0);
    } catch (err) {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]); // ❌ removed type

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);

    params.set("current_page", currentPage);
    params.set("page_size", pageSize);

    navigate(`?${params.toString()}`, { replace: true });
  }, [searchQuery, currentPage, pageSize]);

  const menus = [
    {
      name: "Add Gallery Item",
      className: "btn-dark",
      icon: <i className="fa fa-plus me-1" />,
      onClick: () => navigate("/admin/gallery/add")
    }
    // ❌ removed filter dropdown entirely
  ];

  return (
    <>
      <nav>
        <ol className="breadcrumb mb-2">
          <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item active">Gallery</li>
        </ol>
      </nav>

      <FilterTopBar
        defaultSearch={searchQuery}
        onSearch={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
          debouncedFetch(q);
        }}
        isFilterApplied={searchQuery}
        onClear={() => {
          setSearchQuery("");
          setCurrentPage(1);
          fetchData(1, "");
        }}
        menus={menus}
      />

      <div className="main-table">
        <table className="table table-bordered mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Preview</th>
              <th>Title</th>
              <th>Type</th>
              <th>Active</th>
              <th style={{ width: 120 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(7)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j}><Skeleton height={26} /></td>
                  ))}
                </tr>
              ))
            ) : items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td>
                    {item.file_type === "Video" ? (
                      <video
                        src={`${BASE_MEDIA_URL}${item.file}`}
                        width={70}
                        height={45}
                        muted
                        loop
                      />
                    ) : (
                      <img
                        src={`${BASE_MEDIA_URL}${item.file}`}
                        width={70}
                        height={45}
                        className="object-fit-cover rounded"
                      />
                    )}
                  </td>

                  <td>{item.title}</td>
                  <td>{item.file_type}</td>

                  <td>
                    {item.is_active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>

                  <td className="text-nowrap">
                    <Link 
                      to={`/admin/gallery/${item.id}`} 
                      className="btn btn-primary btn-sm me-1"
                    >
                      <i className="fa fa-pen" />
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => openDeleteModal(item.id)}
                    >
                      <i className="fa fa-trash" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No Gallery Items Found</td>
              </tr>
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
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Gallery Item"
        message="Are you sure you want to delete this?"
      />
    </>
  );
}
