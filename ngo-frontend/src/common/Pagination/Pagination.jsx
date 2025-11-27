import React from "react";
import "./Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  totalRows,
  onPageChange,
  pageSize,
  setPageSize,
  setCurrentPage,
  disabled = false,
}) => {

  // Build pages array (1, current, last)
  const pages = [];
  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage);
    }
    pages.push(totalPages);
  }

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="pagination-wrapper">

      {/* PAGE BUTTONS */}
      <div className="custom-pagination">

        {/* PREV */}
        <button
          className="btn btn-secondary py-1"  
          disabled={disabled || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </button>

        {/* PAGE LIST */}
        <ul className="page-list">
          {pages.map((page) => (
            <li key={page} className={page === currentPage ? "active" : ""}>
              <button
                className="page-btn"
                onClick={() => onPageChange(page)}
                disabled={disabled || page === currentPage}
              >
                {page}
              </button>
            </li>
          ))}
        </ul>

        {/* NEXT */}
        <button
          className="btn btn-secondary py-1"
          disabled={disabled || currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* PAGE SIZE + TOTAL ROWS */}
      <div className="page-size-box">
        <span className="rows-count">({totalRows})</span>

        <select
          className="page-size-selector"
          value={pageSize}
          onChange={handlePageSizeChange}
          disabled={disabled}
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

    </div>
  );
};

export default Pagination;
