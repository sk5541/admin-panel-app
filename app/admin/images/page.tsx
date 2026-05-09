"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

const BUCKET = "images"
const PAGE_SIZE = 24

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  background: "#0d0d0d",
  border: "1px solid #2a2a2a",
  borderRadius: "6px",
  color: "#e0e0e0",
  fontSize: "13px",
  boxSizing: "border-box" as const,
  outline: "none",
}

const btn = (variant: "primary" | "danger" | "ghost") => ({
  padding: "8px 18px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.05em",
  cursor: "pointer",
  border: "none",
  ...(variant === "primary" && { background: "#e0e0e0", color: "#000" }),
  ...(variant === "danger"  && { background: "#2a0a0a", color: "#f87171", border: "1px solid #450a0a" }),
  ...(variant === "ghost"   && { background: "transparent", color: "#555", border: "1px solid #2a2a2a" }),
})

export default function ImagesPage() {
  const [images,       setImages]       = useState<any[]>([])
  const [total,        setTotal]        = useState(0)
  const [page,         setPage]         = useState(0)
  const [url,          setUrl]          = useState("")
  const [file,         setFile]         = useState<File | null>(null)
  const [previewUrl,   setPreviewUrl]   = useState<string | null>(null)
  const [lastUploaded, setLastUploaded] = useState<{ url: string; name: string } | null>(null)
  const [editingId,    setEditingId]    = useState<string | null>(null)
  const [uploading,    setUploading]    = useState(false)
  const [message,      setMessage]      = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => { fetchImages(page) }, [page])

  async function fetchImages(p: number) {
    const { data, error, count } = await supabase
      .from("images")
      .select("*", { count: "exact" })
      .order("id", { ascending: false })
      .range(p * PAGE_SIZE, p * PAGE_SIZE + PAGE_SIZE - 1)
    if (!error) { setImages(data || []); setTotal(count ?? 0) }
  }

  function gotoPage(p: number) { setPage(p); window.scrollTo(0, 0) }
  const totalPages = Math.ceil(total / PAGE_SIZE)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    setFile(f); setPreviewUrl(f ? URL.createObjectURL(f) : null)
    if (f) setUrl(""); setLastUploaded(null)
  }

  async function uploadToStorage(): Promise<string | null> {
    if (!file) return null
    const ext = file.name.split(".").pop()
    const fileName = `${Date.now()}.${ext}`
    const arrayBuffer = await file.arrayBuffer()
    const { data, error } = await supabase.storage
      .from(BUCKET).upload(fileName, arrayBuffer, { contentType: file.type, upsert: false })
    if (error) { setMessage({ text: `Storage upload failed: ${error.message}`, ok: false }); return null }
    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
    return publicData.publicUrl
  }

  async function createImage() {
    if (!file && !url.trim()) { setMessage({ text: "Please select a file or enter a URL.", ok: false }); return }
    setUploading(true); setMessage(null); setLastUploaded(null)
    let imageUrl = url.trim()
    if (file) {
      const uploaded = await uploadToStorage()
      if (!uploaded) { setUploading(false); return }
      imageUrl = uploaded
    }
    const { error } = await supabase.from("images").insert([{ url: imageUrl }])
    if (error) {
      setMessage({ text: `DB insert failed: ${error.message}`, ok: false })
    } else {
      setLastUploaded({ url: imageUrl, name: file?.name ?? "URL image" })
      setMessage({ text: "Image uploaded and saved successfully!", ok: true })
      setUrl(""); setFile(null); setPreviewUrl(null); setEditingId(null)
      setPage(0); fetchImages(0)
    }
    setUploading(false)
  }

  async function updateImage(id: string) {
    if (!url.trim()) { setMessage({ text: "Enter a URL to update.", ok: false }); return }
    setUploading(true)
    const { error } = await supabase.from("images").update({ url }).eq("id", id)
    if (error) { setMessage({ text: `Update failed: ${error.message}`, ok: false })
    } else { setMessage({ text: "Updated!", ok: true }); setUrl(""); setFile(null); setPreviewUrl(null); setEditingId(null); fetchImages(page) }
    setUploading(false)
  }

  async function deleteImage(id: string) {
    if (!confirm("Delete this image?")) return
    await supabase.from("images").delete().eq("id", id)
    fetchImages(page)
  }

  function clearForm() {
    setUrl(""); setFile(null); setPreviewUrl(null); setEditingId(null); setMessage(null); setLastUploaded(null)
  }

  return (
    <div style={{ fontFamily: "'DM Mono', monospace", color: "#ccc", padding: "32px 28px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "0.08em", color: "#fff", marginBottom: "28px" }}>
        IMAGES
      </h1>

      {/* Form */}
      <div style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: "8px", padding: "24px", maxWidth: "480px", marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#555", marginBottom: "18px" }}>
          {editingId ? "EDIT IMAGE URL" : "ADD IMAGE"}
        </p>

        {!editingId && (
          <>
            <label style={{ fontSize: "11px", color: "#444", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>UPLOAD FILE</label>
            <input type="file" accept="image/*" onChange={handleFileChange}
              style={{ ...inputStyle, padding: "8px", marginBottom: "12px", color: "#666" }} />
            {previewUrl && (
              <img src={previewUrl} alt="preview"
                style={{ width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "6px", marginBottom: "14px", border: "1px solid #222" }} />
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: "#222" }} />
              <span style={{ fontSize: "10px", color: "#444", letterSpacing: "0.08em" }}>OR URL</span>
              <div style={{ flex: 1, height: "1px", background: "#222" }} />
            </div>
          </>
        )}

        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..."
          style={{ ...inputStyle, marginBottom: "14px" }} />

        {message && (
          <p style={{ fontSize: "12px", color: message.ok ? "#4ade80" : "#f87171", marginBottom: "12px" }}>
            {message.ok ? "✓" : "✗"} {message.text}
          </p>
        )}

        {/* Upload success confirmation with image preview */}
        {lastUploaded && (
          <div style={{ background: "#0a1a0a", border: "1px solid #1a4a1a", borderRadius: "6px", padding: "12px", marginBottom: "14px" }}>
            <p style={{ fontSize: "10px", color: "#4ade80", letterSpacing: "0.06em", marginBottom: "8px" }}>
              ✓ UPLOADED: {lastUploaded.name}
            </p>
            <img src={lastUploaded.url} alt="uploaded"
              style={{ width: "100%", maxHeight: "140px", objectFit: "cover", borderRadius: "4px", display: "block" }} />
            <p style={{ fontSize: "9px", color: "#2d6a2d", marginTop: "6px", wordBreak: "break-all" }}>
              {lastUploaded.url}
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: "8px" }}>
          {editingId ? (
            <button onClick={() => updateImage(editingId)} disabled={uploading} style={btn("primary")}>
              {uploading ? "Saving…" : "Save Changes"}
            </button>
          ) : (
            <button onClick={createImage} disabled={uploading} style={btn("primary")}>
              {uploading ? "Uploading…" : "Add Image"}
            </button>
          )}
          <button onClick={clearForm} style={btn("ghost")}>Cancel</button>
        </div>
      </div>

      {/* Gallery */}
      {images.length === 0 ? (
        <div style={{ border: "1px dashed #222", borderRadius: "8px", padding: "60px 20px", textAlign: "center", color: "#444", fontSize: "13px" }}>
          No images yet. Upload one above.
        </div>
      ) : (
        <>
          <p style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#444", marginBottom: "16px" }}>
            {total.toLocaleString()} IMAGE{total !== 1 ? "S" : ""} &nbsp;·&nbsp; page {page + 1} of {totalPages}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
            {images.map((img) => (
              <div key={img.id} style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ height: "130px", background: "#111" }}>
                  <img src={img.url} alt={`Image ${img.id}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => {
                      const t = e.target as HTMLImageElement
                      t.style.display = "none"
                      t.parentElement!.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#333;font-size:11px;">Failed to load</div>`
                    }}
                  />
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ fontSize: "9px", color: "#444", marginBottom: "10px", wordBreak: "break-all" }}>
                    {String(img.id).length > 20 ? String(img.id).slice(0, 8) + "…" : `#${img.id}`}
                  </p>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => { setEditingId(img.id); setUrl(img.url); window.scrollTo(0, 0) }}
                      style={{ ...btn("ghost"), flex: 1, padding: "6px" }}>Edit</button>
                    <button onClick={() => deleteImage(img.id)}
                      style={{ ...btn("danger"), flex: 1, padding: "6px" }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <span style={{ fontSize: "11px", color: "#444" }}>
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total.toLocaleString()}
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[["«", 0], ["Prev", page - 1]].map(([label, target]) => (
                  <button key={label} onClick={() => gotoPage(target as number)} disabled={page === 0} style={{
                    padding: "6px 12px", borderRadius: "6px", fontSize: "11px",
                    background: "#0d0d0d", border: "1px solid #2a2a2a",
                    color: page === 0 ? "#2a2a2a" : "#888", cursor: page === 0 ? "default" : "pointer",
                  }}>{label}</button>
                ))}

                {Array.from({ length: totalPages }, (_, i) => i)
                  .filter(i => Math.abs(i - page) <= 3 || i === 0 || i === totalPages - 1)
                  .reduce<(number | "…")[]>((acc, i, idx, arr) => {
                    if (idx > 0 && (i as number) - (arr[idx - 1] as number) > 1) acc.push("…")
                    acc.push(i); return acc
                  }, [])
                  .map((v, idx) => v === "…"
                    ? <span key={`e${idx}`} style={{ padding: "6px 4px", color: "#333", fontSize: "11px" }}>…</span>
                    : <button key={v} onClick={() => gotoPage(v as number)} style={{
                        padding: "6px 12px", borderRadius: "6px", fontSize: "11px",
                        background: v === page ? "#4a5e2a" : "#0d0d0d",
                        border: `1px solid ${v === page ? "#4a5e2a" : "#2a2a2a"}`,
                        color: v === page ? "#fff" : "#666",
                        cursor: "pointer", fontWeight: v === page ? 700 : 400,
                      }}>{(v as number) + 1}</button>
                  )}

                {[["Next", page + 1], ["»", totalPages - 1]].map(([label, target]) => (
                  <button key={label} onClick={() => gotoPage(target as number)} disabled={page >= totalPages - 1} style={{
                    padding: "6px 12px", borderRadius: "6px", fontSize: "11px",
                    background: "#0d0d0d", border: "1px solid #2a2a2a",
                    color: page >= totalPages - 1 ? "#2a2a2a" : "#888",
                    cursor: page >= totalPages - 1 ? "default" : "pointer",
                  }}>{label}</button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}