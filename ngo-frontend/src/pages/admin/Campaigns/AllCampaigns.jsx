import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";

import { getAllCampaigns, deleteCampaign } from "../../../services/campaign.service";
import { debounce } from "../../../utils/debounce";

import FilterTopBar from "../../../common/FilterTopBar/FilterTopBar";
import Pagination from "../../../common/Pagination/Pagination";
import ConfirmDeleteModal from "../../../common/ConfirmDeleteModal";
import { BASE_MEDIA_URL } from "../../../services/endpoints";

export default function AllCampaigns() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);

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

  // Delete modal state
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
      await deleteCampaign({ pk: selectedId });
      toast.success("Deleted ✅", { id: toastId });
      setShowDeleteModal(false);
      fetchData(currentPage, searchQuery);
    } catch (err) {
      console.error(err);
      toast.error("Delete failed ❌", { id: toastId });
    } finally {
      setDeleteLoading(false);
    }
  };

  // debounced search
  const debouncedFetch = useCallback(debounce((q) => fetchData(1, q), 500), []);

  const fetchData = async (page = currentPage, query = searchQuery) => {
    setLoading(true);
    const payload = {
      ids: [],
      search: query,
      page_number: page,
      page_size: pageSize,
      status: "" // optional
    };

    try {
      const res = await getAllCampaigns(payload);
      setCampaigns(res.data || []);
      setTotalPages(res.total_pages || 0);
      setTotalRows(res.total_rows || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load campaigns");
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

  const handleClearAllFilter = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchData(1, "");
  };

  const menus = [
    {
      name: "Add Campaign",
      className: "btn-dark",
      icon: <i className="fa fa-plus me-1" />,
      onClick: () => navigate("/admin/campaigns/add")
    }
  ];

  return (
    <>
      <nav>
        <ol className="breadcrumb mb-2">
          <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item active">Campaigns</li>
        </ol>
      </nav>

      <FilterTopBar
        defaultSearch={searchQuery}
        onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); debouncedFetch(q); }}
        onClear={handleClearAllFilter}
        isFilterApplied={!!searchQuery}
        menus={menus}
      />

      <div className="main-table">
        <table className="table table-bordered mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Thumb / Media</th>
              <th>Title</th>
              <th>Goal</th>
              <th>Collected</th>
              <th>Status</th>
              <th style={{ width: 120 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(7)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => <td key={j}><Skeleton height={26} /></td>)}
                </tr>
              ))
            ) : campaigns.length > 0 ? (
              campaigns.map((c, idx) => (
                <tr key={c.id}>
                  <td>{c.id}</td>

                  <td>
                    {c.file_type === "Video" ? (
                      <video src={`${BASE_MEDIA_URL}${c.video_or_file || c.thumbnail}`} width="90" height="60" muted loop />
                    ) : (
                      <img src={`${BASE_MEDIA_URL}${c.thumbnail || c.video_or_file}`} width="90" height="60" className="object-fit-cover rounded" />
                    )}
                  </td>

                  <td>{c.title}</td>
                  <td>{c.goal_amount || 0}</td>
                  <td>{c.collected_amount || 0}</td>
                  <td>
                    {c.is_active ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Inactive</span>}
                  </td>

                  <td className="text-nowrap">
                    <Link to={`/admin/campaigns/${c.id}`} className="btn btn-primary btn-sm me-1"><i className="fa fa-pen" /></Link>
                    <button className="btn btn-danger btn-sm" onClick={() => openDeleteModal(c.id)}><i className="fa fa-trash" /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="text-center py-4">No Campaigns Found</td></tr>
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

      {showDeleteModal && (
        <ConfirmDeleteModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={deleteLoading}
          title="Delete Campaign"
          message="Are you sure you want to delete this campaign?"
        />
      )}
    </>
  );
}
