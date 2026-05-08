"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import { fieldStyle, btnPrimary, btnSecondary, btnEdit, btnDanger, formBox, cardStyle, pageTitle, label, valueText, dimText } from "@/lib/adminStyles"

export default function CaptionExamplesPage() {
  const [items, setItems] = useState<any[]>([])
  const [imageDescription, setImageDescription] = useState("")
  const [caption, setCaption] = useState("")
  const [explanation, setExplanation] = useState("")
  const [priority, setPriority] = useState("0")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => { getItems() }, [])

  async function getItems() {
    const { data, error } = await supabase
      .from("caption_examples")
      .select("*")
      .order("id", { ascending: true })
    if (error) { console.error(error); return }
    setItems(data || [])
  }

  async function createItem() {
    if (!imageDescription.trim() || !caption.trim()) {
      setMessage("Image description and caption are required.")
      return
    }
    const { error } = await supabase.from("caption_examples").insert([{
      image_description: imageDescription,
      caption,
      explanation,
      priority: Number(priority),
    }])
    if (error) { setMessage("Error: " + error.message); return }
    setMessage("Created!")
    clearForm()
    getItems()
  }

  async function updateItem(id: number) {
    const { error } = await supabase.from("caption_examples").update({
      image_description: imageDescription,
      caption,
      explanation,
      priority: Number(priority),
    }).eq("id", id)
    if (error) { setMessage("Error: " + error.message); return }
    setMessage("Updated!")
    clearForm()
    getItems()
  }

  async function deleteItem(id: number) {
    if (!confirm("Delete this caption example?")) return
    await supabase.from("caption_examples").delete().eq("id", id)
    getItems()
  }

  function clearForm() {
    setImageDescription(""); setCaption(""); setExplanation(""); setPriority("0")
    setEditingId(null); setMessage("")
  }

  return (
    <div>
      <h1 style={pageTitle}>Caption Examples</h1>

      <div style={formBox}>
        <h2 style={{ color: "#ccc", fontSize: "14px", marginBottom: "16px" }}>
          {editingId ? `Editing #${editingId}` : "Add New Caption Example"}
        </h2>

        <span style={label}>Image Description *</span>
        <textarea
          value={imageDescription}
          onChange={(e) => setImageDescription(e.target.value)}
          placeholder="Describe the image..."
          rows={3}
          style={{ ...fieldStyle, resize: "vertical" }}
        />

        <span style={label}>Caption *</span>
        <input value={caption} onChange={(e) => setCaption(e.target.value)}
          placeholder="The caption text" style={fieldStyle} />

        <span style={label}>Explanation</span>
        <input value={explanation} onChange={(e) => setExplanation(e.target.value)}
          placeholder="Why this caption works..." style={fieldStyle} />

        <span style={label}>Priority</span>
        <input type="number" value={priority} onChange={(e) => setPriority(e.target.value)}
          style={{ ...fieldStyle, width: "100px" }} />

        {message && (
          <p style={{ color: message.startsWith("Error") ? "#f55" : "#5f5", fontSize: "12px", marginBottom: "8px" }}>
            {message}
          </p>
        )}

        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <button onClick={editingId ? () => updateItem(editingId) : createItem} style={btnPrimary}>
            {editingId ? "Save Changes" : "Add Example"}
          </button>
          <button onClick={clearForm} style={btnSecondary}>Cancel</button>
        </div>
      </div>

      <p style={dimText}>{items.length} record{items.length !== 1 ? "s" : ""}</p>

      {items.map((item) => (
        <div key={item.id} style={cardStyle}>
          <div style={{ flex: 1 }}>
            <span style={dimText}>#{item.id} · Priority: {item.priority}</span>
            <p style={{ ...valueText, marginTop: "4px" }}><strong style={{ color: "#888" }}>Image: </strong>{item.image_description}</p>
            <p style={valueText}><strong style={{ color: "#888" }}>Caption: </strong>{item.caption}</p>
            {item.explanation && <p style={dimText}><em>{item.explanation}</em></p>}
          </div>
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            <button style={btnEdit} onClick={() => {
              setEditingId(item.id)
              setImageDescription(item.image_description || "")
              setCaption(item.caption || "")
              setExplanation(item.explanation || "")
              setPriority(String(item.priority ?? 0))
              window.scrollTo(0, 0)
            }}>Edit</button>
            <button style={btnDanger} onClick={() => deleteItem(item.id)}>Delete</button>
          </div>
        </div>
      ))}

      {items.length === 0 && <p style={dimText}>No records found.</p>}
    </div>
  )
}