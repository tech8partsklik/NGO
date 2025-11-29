import JoditEditor from "jodit-react";

export default function RichTextEditor({
  label = "",
  value,
  onChange,
  height = 300,
}) {

  return (
    <div>
      {label && <label className="form-label">{label}</label>}

      <div style={{ maxHeight: "600px", overflowY: "auto" }}>
      {/* <div style={{ height: height, overflowY: "auto" }}> */}
        <JoditEditor
          value={value}
          onBlur={onChange}     // smooth & stable
          onChange={onChange}   // smooth & stable
        />
      </div>
    </div>
  );
}
