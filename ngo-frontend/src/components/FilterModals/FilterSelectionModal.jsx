import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function FilterSelectionModal({
    title,
    options,
    selectedOptions = [],
    onSelect,
    searchable = true,
    selectableAll = true,
    multiSelection = true,
    zIndex = 10
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [tempSelectedOptions, setTempSelectedOptions] = useState([...selectedOptions]);

    const buttonRef = useRef(null);
    const modalRef = useRef(null);

    // Reset temp when parent changes
    useEffect(() => {
        setTempSelectedOptions([...selectedOptions]);
    }, [selectedOptions]);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Select / Unselect All
    const handleSelectAll = () => {
        if (tempSelectedOptions.length === options.length) {
            setTempSelectedOptions([]);
        } else {
            setTempSelectedOptions(options.map((opt) => opt.value));
        }
    };

    // Toggle individual option (value)
    const handleOptionChange = (value) => {
        if (multiSelection) {
            if (tempSelectedOptions.includes(value)) {
                setTempSelectedOptions(tempSelectedOptions.filter((v) => v !== value));
            } else {
                setTempSelectedOptions([...tempSelectedOptions, value]);
            }
        } else {
            setTempSelectedOptions([value]);
        }
    };

    const handleClear = () => {
        setTempSelectedOptions([]);
        onSelect([]);
        setIsOpen(false);
    };

    const handleApply = () => {
        onSelect(tempSelectedOptions);
        setIsOpen(false);
    };

    // Filtering
    const filteredOptions = options.filter((opt) =>
        (opt.label || opt.value)
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Modal position
    const getModalPosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const modalWidth = 220; // Adjust width
            const viewportWidth = window.innerWidth;

            let left = rect.left + window.scrollX;
            if (left + modalWidth > viewportWidth) {
                left = rect.right - modalWidth + window.scrollX;
            }

            return {
                top: rect.bottom + window.scrollY,
                left,
            };
        }
        return {};
    };

    // Modal markup
    const modalContent = (
        <div
            className="filter-modal p-2  shadow rounded"
            ref={modalRef}
            style={{
                position: "absolute",
                width: 220,
                ...getModalPosition(),
                zIndex,
            }}
        >
            {searchable && (
                <input
                    className="form-control form-control-sm mb-2"
                    type="text"
                    placeholder={`Search ${title}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            )}

            {selectableAll && multiSelection && (
                <div className="mb-2">
                    <label>
                        <input
                            type="checkbox"
                            className="me-1"
                            checked={tempSelectedOptions.length === options.length}
                            onChange={handleSelectAll}
                        />
                        Select All
                    </label>
                </div>
            )}

            <div className="bg" style={{ maxHeight: 260, overflowY: "auto" }}>
                <ul className="ps-0 mb-0">
                    {filteredOptions.map((opt) => (
                        <li key={opt.value} style={{ listStyle: "none" }}>
                            <label className="d-flex align-items-center" style={{ cursor: "pointer" }}>
                                <input
                                    type={multiSelection ? "checkbox" : "radio"}
                                    name={`filter-${title}`}
                                    className="me-2"
                                    checked={tempSelectedOptions.includes(opt.value)}
                                    onChange={() => handleOptionChange(opt.value)}
                                />
                                {opt.label}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-sm btn-outline-danger" onClick={handleClear}>
                    Clear
                </button>
                <button className="btn btn-sm btn-success ms-2" onClick={handleApply}>
                    Apply
                </button>
            </div>
        </div>
    );

    return (
        <div ref={buttonRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: "pointer" }}
                className="d-flex align-items-center justify-content-between"
            >
                {title} <i className="fa-solid fa-angle-down ms-1"></i>
            </div>

            {isOpen && ReactDOM.createPortal(modalContent, document.body)}
        </div>
    );
}

export default FilterSelectionModal;
