import { useState } from "react";
import { URL_OPTIONS } from "../../../constants/urlOptions";

export default function UrlSelector({ value, onChange }) {
  const [useManual, setUseManual] = useState(false);
  const [manualValue, setManualValue] = useState("");

  return (
    <div className="input-group">

      {/* Select OR Manual */}
      {useManual ? (
        <input
          className="form-control rounded-end-0"
          placeholder="Enter custom URL..."
          value={manualValue}
          onChange={(e) => {
            setManualValue(e.target.value);
            onChange(e.target.value);
          }}
        />
      ) : (
        <select
          className="form-select rounded-end-0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select URL</option>
          {URL_OPTIONS.map((item, i) => (
            <option key={i} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => setUseManual(!useManual)}
      >
        <i
          className={`fa-solid ${useManual ? "fa-list" : "fa-keyboard"}`}
        ></i>
      </button>
    </div>
  );
}
