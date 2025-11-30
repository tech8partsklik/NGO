import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";

import { getAllDonations } from "../../../services/donation.service";
import { debounce } from "../../../utils/debounce";

import FilterTopBar from "../../../common/FilterTopBar/FilterTopBar";
import Pagination from "../../../common/Pagination/Pagination";
import { formatDate, formatDateTime, formatRupees, formatTime } from "../../../utils/formatters";
import FilterSelectionModal from "../../../components/FilterModals/FilterSelectionModal";
import FilterDateRangeModal from "../../../components/FilterModals/FilterDateRangeModal";

export default function Donations() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);

  const [summary, setSummary] = useState({
    total_amount: 0,
    total_rows: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(
    Number(new URLSearchParams(location.search).get("current_page")) || 1
  );

  const [pageSize, setPageSize] = useState(
    Number(new URLSearchParams(location.search).get("page_size")) || 10
  );

  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);

  // Search
  const [searchQuery, setSearchQuery] = useState(
    new URLSearchParams(location.search).get("search") || ""
  );

  // ---------------- DEBOUNCE SEARCH ----------------
  const debouncedFetch = useCallback(
    debounce((query) => {
      fetchData(1, query);
    }, 400),
    []
  );


  const [selectedStatus, setSelectedStatus] = useState(
    new URLSearchParams(location.search).get("status")?.split(",") || []
  );
  // date Filter
  const [startDate, setStartDate] = useState(
    new URLSearchParams(location.search).get("start_date") || null
  );
  const [endDate, setEndDate] = useState(
    new URLSearchParams(location.search).get("end_date") || null
  );

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };


  const statusOptions = [
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "initiated", label: "Initiated" },
    { value: "created", label: "Created" },
  ];



  // ---------------- FETCH DATA ----------------
  const fetchData = async (page = currentPage, query = searchQuery) => {
    setLoading(true);

    try {
      const res = await getAllDonations({
        search: query,
        page_number: page,
        page_size: pageSize,
        status: selectedStatus[0] || [],
        start_date: startDate || "", // 2024-11-01
        end_date: endDate || "",
      });

      if (res?.status !== 1) {
        toast.error("Failed to load donation history");
        return;
      }

      setDonations(res.data || []);
      setSummary({
        total_amount: res.total_amount,
        total_rows: res.total_rows,
      });

      setTotalRows(res.total_rows || 0);
      setTotalPages(res.total_pages || 0);

    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, selectedStatus, startDate, endDate]);

  // ---------------- UPDATE URL PARAMS ----------------
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);

    params.set("current_page", currentPage);
    params.set("page_size", pageSize);

    if (selectedStatus.length) params.set("status", selectedStatus.join(","));
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);

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
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
    fetchData(1, "");
  };


  const isFilterApplied = () => {
    return (
      searchQuery !== "" ||
      selectedStatus.length > 0 ||
      endDate ||
      startDate
    );
  };


  return (
    <>
      {/* ================= BREADCRUMB ================= */}
      <nav>
        <ol className="breadcrumb mb-2">
          <li className="breadcrumb-item">
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Donations</li>
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
        menus={[]}
      />

      {/* ================= SUMMARY CARDS ================= */}
      <div className="row g-2 mb-3">

        {/* Total Donations */}
        <div className="col-md-3 col-6">
          <div className="card shadow-sm border-0 text-center py-2 px-1">
            <small className="text-muted d-block">TOTAL DONATIONS</small>
            <span className="fw-bold h6 mb-0">{summary.total_rows}</span>
          </div>
        </div>

        {/* Total Amount */}
        <div className="col-md-3 col-6">
          <div className="card shadow-sm border-0 text-center py-2 px-1">
            <small className="text-muted d-block">TOTAL AMOUNT</small>
            <span className="fw-bold h6 mb-0">{formatRupees(summary.total_amount)}</span>
          </div>
        </div>

      </div>



      {/* ================= TABLE ================= */}
      <div className="main-table">
        <table className="table table-bordered mb-0">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>
                <FilterDateRangeModal
                  title="Date"
                  startDate={startDate}
                  endDate={endDate}
                  onDateChange={handleDateChange}
                />
              </th>
              <th>Amount</th>
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
              <th>Verified</th>
              <th>Payment ID</th>
              <th>Order ID</th>
            </tr>
          </thead>

          <tbody>

            {/* LOADING SKELETON */}
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
            ) : donations.length > 0 ? (

              donations.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>
                    {formatDate(d.created_at)} <br />
                    <small className="text-muted">{formatTime(d.created_at)}</small>
                  </td>
                  <td>{formatRupees(d.amount)}</td>


                  <td>
                    <span className={`badge ${d.status === "paid" ? "bg-success" : "bg-warning"}`}>
                      {d.status}
                    </span>
                  </td>

                  <td>
                    {d.verified ? (
                      <span className="badge bg-success">Verified</span>
                    ) : (
                      <span className="badge bg-danger">Unverified</span>
                    )}
                  </td>

                  <td>{d.razorpay_payment_id || "-"}</td>
                  <td>{d.razorpay_order_id}</td>
                </tr>
              ))

            ) : (
              <tr>
                <td colSpan="7" className="no-data-found py-4">
                  No Donations Found
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
    </>
  );
}
