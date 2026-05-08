"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

const fieldStyle = {
  width: "100%",
  padding: "8px 12px",
  background: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: "3px",
  color: "#ccc",
  fontSize: "13px",
  boxSizing: "border-box" as const,
  marginBottom: "8px",
}

const btnStyle = {
  padding: "8px 20px",
  borderRadius: "3px",
  fontSize: "13px",
  cursor: "pointer",
  fontWeight: "600",
  border: "none",
}

export default function ImagesPage() {
  const [images, setImages] = useState<any[]>([])
  const [url, setUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => { getImages() }, [])

  async function getImages() {
    const { data } = await supabase.from("images").select("*").order("id", { ascending: false })
    setImages(data || [])
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null
    setFile(f)
    if (f) {
      setPreviewUrl(URL.createObjectURL(f))
      setUrl("") // clear manual URL if file chosen
    } else {
      setPreviewUrl(null)
    }
  }

  async function uploadFile(): Promise<string | null> {
    if (!file) return null
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { data, error } = await supabase.storage.from("images").upload(fileName, file)
    if (error) {
      console.error("Upload error:", error)
      setMessage("Upload failed: " + error.message)
      return null
    }
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(data.path)
    return urlData.publicUrl
  }

  async function createImage() {
    if (!file && !url.trim()) {
      setMessage("Please select a file or enter a URL.")
      return
    }
    setUploading(true)
    setMessage("")
    let imageUrl = url.trim()
    if (file) {
      const uploaded = await uploadFile()
      if (!uploaded) { setUploading(false); return }
      imageUrl = uploaded
    }
    const { error } = await supabase.from("images").insert([{ url: imageUrl }])
    if (error) { setMessage("Error saving image: " + error.message); setUploading(false); return }
    setMessage("Image added successfully!")
    clearForm()
    getImages()
    setUploading(false)
  }

  async function updateImage(id: number) {
    if (!url.trim()) { setMessage("Please enter a URL to update."); return }
    setUploading(true)
    const { error } = await supabase.from("images").update({ url }).eq("id", id)
    if (error) { setMessage("Error updating: " + error.message); setUploading(false); return }
    setMessage("Updated!")
    clearForm()
    getImages()
    setUploading(false)
  }

  async function deleteImage(id: number) {
    if (!confirm("Delete this image?")) return
    await supabase.from("images").delete().eq("id", id)
    getImages()
  }

  function clearForm() {
    setUrl("")
    setFile(null)
    setPreviewUrl(null)
    setEditingId(null)
    setMessage("")
  }

  return (
    <div>
      <h1 style={{ color: "#fff", fontSize: "24px", marginBottom: "24px" }}>Images</h1>

      {/* Form */}
      <div style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: "4px",
        padding: "24px",
        marginBottom: "32px",
        maxWidth: "520px",
      }}>
        <h2 style={{ color: "#ccc", fontSize: "15px", marginBottom: "16px" }}>
          {editingId ? "Edit Image URL" : "Add New Image"}
        </h2>

        {!editingId && (
          <>
            <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>
              Upload from computer
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ ...fieldStyle, padding: "6px" }}
            />

            {previewUrl && (
              <img src={previewUrl} alt="preview" style={{
                width: "100%", maxHeight: "200px", objectFit: "cover",
                borderRadius: "3px", marginBottom: "8px",
              }} />
            )}

            <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px", marginTop: "8px" }}>
              — or paste a URL —
            </label>
          </>
        )}

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          style={fieldStyle}
        />

        {message && (
          <p style={{ color: message.includes("Error") || message.includes("failed") ? "#f55" : "#5f5", fontSize: "12px", marginBottom: "8px" }}>
            {message}
          </p>
        )}

        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          {editingId ? (
            <button
              onClick={() => updateImage(editingId)}
              disabled={uploading}
              style={{ ...btnStyle, background: "#fff", color: "#000" }}
            >
              {uploading ? "Saving..." : "Save Changes"}
            </button>
          ) : (
            <button
              onClick={createImage}
              disabled={uploading}
              style={{ ...btnStyle, background: "#fff", color: "#000" }}
            >
              {uploading ? "Uploading..." : "Upload / Add Image"}
            </button>
          )}
          <button onClick={clearForm} style={{ ...btnStyle, background: "transparent", border: "1px solid #333", color: "#888" }}>
            Cancel
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
        {images.map((image) => (
          <div key={image.id} style={{
            background: "#111",
            border: "1px solid #222",
            borderRadius: "4px",
            overflow: "hidden",
          }}>
            <img
              src={image.url}
              alt=""
              style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
            />
            <div style={{ padding: "10px" }}>
              <p style={{ color: "#555", fontSize: "11px", marginBottom: "8px", wordBreak: "break-all" }}>
                ID: {image.id}
              </p>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => { setEditingId(image.id); setUrl(image.url); window.scrollTo(0, 0) }}
                  style={{ ...btnStyle, flex: 1, background: "#1a1a1a", color: "#ccc", border: "1px solid #333", padding: "6px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteImage(image.id)}
                  style={{ ...btnStyle, flex: 1, background: "#1a0000", color: "#f77", border: "1px solid #400", padding: "6px" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && <p style={{ color: "#555" }}>No images yet.</p>}
    </div>
  )
}