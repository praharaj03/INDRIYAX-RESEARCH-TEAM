"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { news } from "@/lib/data/index";
import {
  RiArrowLeftLine, RiSaveLine, RiCheckLine, RiDeleteBinLine,
  RiLinkM, RiUploadCloud2Line, RiImageLine, RiCloseLine,
} from "react-icons/ri";

const inputClass = "w-full bg-dark-4 border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-700";
const labelClass = "text-xs text-gray-500 font-medium mb-1.5 block";

export default function EditNewsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [thumbMode, setThumbMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", link: "", image: "" });

  useEffect(() => {
    // TODO (Backend Dev): Replace with GET /api/admin/news/:id
    const item = news.find((n) => n.id === id);
    if (item) setForm({ title: item.title, description: item.description, link: item.link, image: item.image });
  }, [id]);

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      set("image", data.url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO (Backend Dev): PATCH /api/admin/news/:id with form payload
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push("/admin/news"), 1500);
  }

  async function handleDelete() {
    // TODO (Backend Dev): DELETE /api/admin/news/:id
    router.push("/admin/news");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-white transition-colors">
          <RiArrowLeftLine size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">Edit Article</h2>
          <p className="text-gray-500 text-sm">ID: {id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-3 border border-border rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <label className={labelClass}>Title *</label>
          <input required className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Description *</label>
          <textarea required rows={3} className={inputClass} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Article URL *</label>
          <input required type="url" className={inputClass} value={form.link} onChange={(e) => set("link", e.target.value)} />
        </div>

        {/* Image picker */}
        <div>
          <label className={labelClass}>Cover Image *</label>
          <div className="flex gap-1 p-1 bg-dark-4 border border-border rounded-xl mb-3 w-fit">
            <button type="button" onClick={() => setThumbMode("url")}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${thumbMode === "url" ? "bg-dark-3 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>
              <RiLinkM size={13} /> URL
            </button>
            <button type="button" onClick={() => { setThumbMode("upload"); }}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${thumbMode === "upload" ? "bg-dark-3 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>
              <RiUploadCloud2Line size={13} /> Upload
            </button>
          </div>

          {thumbMode === "url" ? (
            <input type="url" className={inputClass} value={form.image} onChange={(e) => set("image", e.target.value)} />
          ) : (
            <div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileChange} />
              {!form.image && (
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="w-full border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-8 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-all disabled:opacity-60">
                  {uploading
                    ? <><RiUploadCloud2Line size={24} className="animate-pulse text-primary" /><span className="text-sm">Uploading...</span></>
                    : <><RiImageLine size={24} /><span className="text-sm font-medium">Click to choose image</span><span className="text-xs text-gray-600">JPG, PNG, WebP — max 5MB</span></>}
                </button>
              )}
              {uploadError && <p className="text-red-400 text-xs mt-1.5">{uploadError}</p>}
            </div>
          )}

          {form.image && (
            <div className="mt-3 relative rounded-xl overflow-hidden border border-border">
              <div className="relative h-40 w-full">
                <Image src={form.image} alt="Preview" fill className="object-cover" onError={() => set("image", "")} />
              </div>
              <button type="button" onClick={() => set("image", "")}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-dark/80 border border-border text-gray-400 hover:text-white flex items-center justify-center transition-colors">
                <RiCloseLine size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading || success}
            className="flex items-center gap-2 bg-primary text-dark font-semibold px-6 py-3 rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 disabled:opacity-60">
            {success ? <><RiCheckLine size={16} /> Saved!</> : loading ? "Saving..." : <><RiSaveLine size={16} /> Save Changes</>}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-border text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
            Cancel
          </button>
          <button type="button" onClick={() => setDeleteConfirm(true)}
            className="ml-auto flex items-center gap-1.5 px-4 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
            <RiDeleteBinLine size={14} /> Delete
          </button>
        </div>
      </form>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-3 border border-border rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-white font-bold text-base mb-2">Delete Article?</h3>
            <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 font-semibold text-sm py-2.5 rounded-xl hover:bg-red-500/20 transition-colors">Delete</button>
              <button onClick={() => setDeleteConfirm(false)} className="flex-1 bg-dark-4 text-gray-400 border border-border font-semibold text-sm py-2.5 rounded-xl hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
