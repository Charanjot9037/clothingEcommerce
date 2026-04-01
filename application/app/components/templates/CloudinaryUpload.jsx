// components/CloudinaryImageUpload.jsx
"use client";
import { useState, useRef, useCallback } from "react";

export default function CloudinaryImageUpload({ index, value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver,  setDragOver]  = useState(false);
  const [error,     setError]     = useState("");
  const inputRef = useRef(null);

  const uploadFile = useCallback(async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      // Hits YOUR backend route — API key never exposed to browser
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      onChange(data.url); // ← saves Cloudinary URL into form.images[index]
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const onDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = ()  => setDragOver(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFile(e.dataTransfer.files?.[0]);
  };
  const onFileChange = (e) => uploadFile(e.target.files?.[0]);

  const clear = (e) => {
    e.stopPropagation();
    onChange("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="md:col-span-2 flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-black/50">
        {label}
      </label>

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={[
          "relative border-2 border-dashed transition-all cursor-pointer overflow-hidden",
          dragOver  ? "border-black bg-black/5"            : "border-black/20 bg-black/[0.02]",
          uploading ? "pointer-events-none opacity-60"     : "hover:border-black/50 hover:bg-black/[0.04]",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        {/* Preview */}
        {value && !uploading ? (
          <div className="relative group">
            <img src={value} alt={`Gallery ${index + 1}`} className="w-full h-44 object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <span className="text-white text-xs font-bold uppercase tracking-wider bg-black/60 px-3 py-1.5">
                Replace
              </span>
              <button
                onClick={clear}
                className="text-white text-xs font-bold uppercase tracking-wider bg-red-600/80 px-3 py-1.5 hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ) : uploading ? (
          <div className="h-44 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-black/50 uppercase tracking-widest font-medium">Uploading…</p>
          </div>
        ) : (
          <div className="h-44 flex flex-col items-center justify-center gap-3 select-none">
            <svg className="w-8 h-8 text-black/25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-semibold text-black/60">
                {dragOver ? "Drop it!" : "Drag & drop or click to browse"}
              </p>
              <p className="text-xs text-black/30 mt-0.5">PNG, JPG, WEBP — max 5 MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Manual URL fallback */}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Or paste a Cloudinary URL manually…"
        className="w-full px-3 py-2 text-xs border border-black/15 focus:border-black outline-none text-black/50 placeholder:text-black/25 transition-colors"
      />

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}