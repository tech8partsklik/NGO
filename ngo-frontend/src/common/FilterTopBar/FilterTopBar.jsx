import React, { useState, useCallback } from "react";
import { debounce } from "../../utils/debounce";
import "./FilterTopBar.css";

const FilterTopBar = ({
  onSearch,
  searchPlaceholder,
  defaultSearch = "",
  onApply,
  onClear,
  isFilterApplied = false,
  menus = []
}) => {

  const [searchText, setSearchText] = useState(defaultSearch);

  //  Debounced Search (restored)
  const debouncedSearch = useCallback(
    debounce((query) => {
      onSearch && onSearch(query);
    }, 500),
    []
  );

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchText(val);
    debouncedSearch(val);
  };

  // ----------------------------------------------------
  // Render Buttons (simple button, link button, dropdown)
  // ----------------------------------------------------
  const renderButton = (m, idx) => {
    // ------------------------------
    // DROPDOWN BUTTON
    // ------------------------------
    if (m.type === "dropdown") {
      return (
        <div key={idx} className="dropdown premium-dropdown">
          <button className="btn dropdown-toggle" data-bs-toggle="dropdown">
            {m.icon || <i className="fa-solid fa-layer-group"></i>}
            <span>{m.label || "Extra tools"}</span>
            <i className="fa-solid fa-chevron-down ms-1"></i>
          </button>

          <ul className="dropdown-menu ">
            {m.items?.map((child, cIdx) => (
              <li key={cIdx}>
                {child.url ? (
                  <a className="dropdown-item" href={child.url}>
                    {child.icon && <span className="me-0">{child.icon}</span>}
                    {child.name}
                  </a>
                ) : (
                  <button className="dropdown-item" onClick={child.onClick}>
                    {child.icon && <span className="me-0">{child.icon}</span>}
                    {child.name}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    // ------------------------------
    // NORMAL BUTTON
    // ------------------------------
    if (m.url) {
      return (
        <a key={idx} href={m.url} className={`btn ${m.className}`}>
          {m.icon} {m.name}
        </a>
      );
    }

    return (
      <button
        key={idx}
        className={`btn ${m.className}`}
        onClick={m.onClick}
      >
        {m.icon} {m.name}
      </button>
    );
  };

  return (
    <div className="filter-topbar mb-1">

      {/* SEARCH BAR */}
      <div className="search-box">
        {/* <i className="fa-solid fa-magnifying-glass search-icon"></i> */}
        <input
          type="search"
          // className="search-input"
          className="search-control mb-0"

          placeholder={searchPlaceholder || "Search..."}
          value={searchText}
          onChange={handleSearch}
        />
      </div>

      {/* DESKTOP BUTTONS */}
      <div className="filter-buttons desktop-only">

        {isFilterApplied && (
          <button className="btn btn-danger" onClick={onClear}>
            Clear <i className="fa-solid fa-xmark"></i>
          </button>
        )}
        {onApply && (
          <button className="btn btn-success" onClick={onApply}>
            Filter <i className="fa-solid fa-filter"></i>
          </button>
        )}

        {menus.map((m, idx) => renderButton(m, idx))}
      </div>

      {/* MOBILE BUTTONS – ICONS ONLY */}
      <div className="mobile-actions mobile-only">
        {/* icon-btn  */}
        {isFilterApplied && (
          <button className="btn btn-danger " onClick={onClear}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
        {onApply && (
          <button className="btn btn-success " onClick={onApply}>
            <i className="fa-solid fa-filter"></i>
          </button>
        )}

        {/* 3-DOT SHOPIFY MENU */}
        {menus && menus.length > 0 && (
          <div className="dropdown">
            <button className="icon-btn" data-bs-toggle="dropdown">
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>

            <ul className="dropdown-menu">
              {menus.map((m, idx) => {
                // Handle dropdown items (SUB MENU)
                if (m.type === "dropdown") {
                  return (
                    <React.Fragment key={idx}>

                      {/* Submenu label */}
                      <li className="px-2 pt-2 pb-0">
                        <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: "10px" }}>
                          {m.label || "Options"}
                        </small>
                      </li>

                      <li><hr className="dropdown-divider mt-0" /></li>

                      {m.items.map((child, cIdx) => (
                        <li key={cIdx}>
                          {child.url ? (
                            <a className="dropdown-item" href={child.url}>
                              {child.icon} {child.name}
                            </a>
                          ) : (
                            <button className="dropdown-item" onClick={child.onClick}>
                              {child.icon} {child.name}
                            </button>
                          )}
                        </li>
                      ))}

                      {/* <li><hr className="dropdown-divider" /></li> */}

                    </React.Fragment>
                  );
                }

                // Handle normal buttons with URL
                if (m.url) {
                  return (
                    <li key={idx}>
                      <a className="dropdown-item" href={m.url}>
                        {m.icon} {m.name}
                      </a>
                    </li>
                  );
                }

                return (
                  <li key={idx}>
                    <button className="dropdown-item" onClick={m.onClick}>
                      {m.icon} {m.name}
                    </button>
                  </li>
                );
              })}
            </ul>


            {/* <ul className="dropdown-menu">
              {menus.map((m, idx) => {
                // Handle dropdown items
                if (m.type === "dropdown") {
                  return (
                    <React.Fragment key={idx}>
                      {m.items.map((child, cIdx) => (
                        <li key={cIdx}>
                          {child.url ? (
                            <a className="dropdown-item" href={child.url}>
                              {child.icon} {child.name}
                            </a>
                          ) : (
                            <button className="dropdown-item" onClick={child.onClick}>
                              {child.icon} {child.name}
                            </button>
                          )}
                        </li>
                      ))}
                    </React.Fragment>
                  );
                }

                // Handle normal buttons with URL
                if (m.url) {
                  return (
                    <li key={idx}>
                      <a className="dropdown-item" href={m.url}>
                        {m.icon} {m.name}
                      </a>
                    </li>
                  );
                }

                // Handle normal buttons without URL
                return (
                  <li key={idx}>
                    <button className="dropdown-item" onClick={m.onClick}>
                      {m.icon} {m.name}
                    </button>
                  </li>
                );
              })}
            </ul> */}
          </div>
        )}


      </div>
    </div>

  );
};

export default FilterTopBar;
