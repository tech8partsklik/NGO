import { useEffect, useRef, useState } from "react";
import "./MediaUploader.css"

export default function MediaUploader({
    label = "Upload File",
    value = null,           // existing file (edit mode)
    onChange,
    multiple = false,
    accept = "both",       // image | video | both
    maxSizeMB = 10,
}) {
    const fileInputRef = useRef(null);
    const dropRef = useRef(null);

    const [previews, setPreviews] = useState([]);

    const allowedTypes =
        accept === "image"
            ? ["image/"]
            : accept === "video"
                ? ["video/"]
                : ["image/", "video/"];

    // When component initializes (for update)
    useEffect(() => {
        if (value) {
            const arr = Array.isArray(value) ? value : [value];
            setPreviews(
                arr.map((url) => ({
                    url,
                    type: url?.match(/\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i)
                        ? "video"
                        : "image",
                    fromServer: true,
                }))
            );
        }
    }, [value]);


    const handleFiles = (files) => {
        const selected = Array.from(files);

        // RESET INPUT so same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = null;

        const validFiles = selected.filter((f) => {
            const typeOK = allowedTypes.some((t) => f.type.startsWith(t));
            const sizeOK = f.size / 1024 / 1024 <= maxSizeMB;

            return typeOK && sizeOK;
        });

        const newPreview = validFiles.map((file) => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith("video") ? "video" : "image",
            file,
            fromServer: false,
        }));



        setPreviews((prev) => (multiple ? [...prev, ...newPreview] : newPreview));

        onChange(multiple ? validFiles : validFiles[0]);
    };


    // Drag & Drop Events
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dtFiles = e.dataTransfer.files;
        if (dtFiles.length) handleFiles(dtFiles);

        dropRef.current.classList.remove("drag-active");
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        dropRef.current.classList.add("drag-active");
    };

    const handleDragLeave = () => {
        dropRef.current.classList.remove("drag-active");
    };

    // Paste event ONLY when hovering in uploader
    useEffect(() => {
        const uploadBox = dropRef.current;
        if (!uploadBox) return;

        const handlePaste = (e) => {
            if (!uploadBox.matches(":hover")) return; // Only if user is on uploader
            if (e.clipboardData.files.length) {
                handleFiles(e.clipboardData.files);
            }
        };

        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, []);


    return (
        <div>
            <label className="form-label d-block">{label}</label>

            <div
                ref={dropRef}
                className="media-uploader border rounded p-4 text-center position-relative"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    cursor: "pointer",
                    minHeight: "160px",
                    borderStyle: "dashed",
                    background: "#fafafa",
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={
                        accept === "image"
                            ? "image/*"
                            : accept === "video"
                                ? "video/*"
                                : "image/*,video/*"
                    }
                    multiple={multiple}
                    className="d-none"
                    onChange={(e) => {
                        handleFiles(e.target.files);
                        e.target.value = ""; // reset input value here
                    }}

                />

                <div className="upload-text">
                    <i className="fa-solid fa-upload fa-2xl mb-3 text-muted"></i>
                    <p className="mb-1 fw-semibold">Drag & Drop or Click to Upload</p>
                    <small className="text-muted">
                        Paste (Ctrl + V) also supported • Max {maxSizeMB} MB each
                    </small>
                </div>
            </div>

            {/* PREVIEW LIST */}
            {previews.length > 0 && (
                <div className="row mt-1 g-3">
                    {previews.map((item, idx) => (
                        <div className="col-md-3 col-6" key={idx}>
                            <div className="position-relative border rounded shadow-sm">
                                {/* DELETE BUTTON */}
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const filtered = previews.filter((_, i) => i !== idx);
                                        setPreviews(filtered);

                                        if (!multiple) onChange(null);
                                    }}
                                >
                                    ×
                                </button>

                                {item.type === "image" ? (
                                    <img
                                        src={item.url}
                                        className="w-100 rounded"
                                        style={{ height: "150px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <video
                                        src={item.url}
                                        className="w-100 rounded"
                                        loop
                                        muted
                                        controls
                                        style={{
                                            height: "150px",
                                            objectFit: "cover",
                                            pointerEvents: "none"   // <-- FIX
                                        }} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
