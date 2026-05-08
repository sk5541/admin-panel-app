"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import { fieldStyle, btnPrimary, btnSecondary, btnEdit, btnDanger, formBox, cardStyle, pageTitle, label, valueText, dimText } from "@/lib/adminStyles"

export default function LlmModelsPage() {
  const [items, setItems] = useState<any[]>([])
  const [name, setName] = useState("")
  const [llmProviderId, setLlmProviderId] = useState("")
  const [providerModelId, setProviderModelId] = useState("")
  const [isTemperatureSupported, setIsTemperatureSupported] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => { getItems() }, [])

  async function getItems() {
    const { data, error } = await supabase.from("llm_models").select("*").order("id", { ascending: true })
    if (error) { console.error(error); return }
    setItems(data || [])
  }

  async function createItem() {
    if (!name.trim()) { setMessage("Name is required."); return }
    const { error } = await supabase.from("llm_models").insert([{
      name, llm_provider_id: Number(llmProviderId), provider_model_id: providerModelId, is_temperature_supported: isTemperatureSupported,
    }])
    if (error) { setMessage("Error: " + error.message); return }
    setMessage("Created!")
    clearForm(); getItems()
  }

  async function updateItem(id: number) {
    const { error } = await supabase.from("llm_models").update({
      name, llm_provider_id: Number(llmProviderId), provider_model_id: providerModelId, is_temperature_supported: isTemperatureSupported,
    }).eq("id", id)
    if (error) { setMessage("Error: " + error.message); return }
    setMessage("Updated!")
    clearForm(); getItems()
  }

  async function deleteItem(id: number) {
    if (!confirm("Delete this model?")) return
    await supabase.from("llm_models").delete().eq("id", id)
    getItems()
  }

  function clearForm() {
    setName(""); setLlmProviderId(""); setProviderModelId(""); setIsTemperatureSupported(false)
    setEditingId(null); setMessage("")
  }

  return (
    <div>
      <h1 style={pageTitle}>LLM Models</h1>

      <div style={formBox}>
        <h2 style={{ color: "#ccc", fontSize: "14px", marginBottom: "16px" }}>
          {editingId ? `Editing #${editingId}` : "Add New LLM Model"}
        </h2>

        <span style={label}>Model Name *</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. claude-sonnet-4-20250514" style={fieldStyle} />

        <span style={label}>LLM Provider ID</span>
        <input type="number" value={llmProviderId} onChange={(e) => setLlmProviderId(e.target.value)} placeholder="Provider ID number" style={{ ...fieldStyle, width: "160px" }} />

        <span style={label}>Provider Model ID</span>
        <input value={providerModelId} onChange={(e) => setProviderModelId(e.target.value)} placeholder="e.g. claude-sonnet-4-20250514" style={fieldStyle} />

        <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ccc", fontSize: "13px", marginBottom: "16px", cursor: "pointer" }}>
          <input type="checkbox" checked={isTemperatureSupported} onChange={(e) => setIsTemperatureSupported(e.target.checked)} />
          Temperature supported
        </label>

        {message && <p style={{ color: message.startsWith("Error") ? "#f55" : "#5f5", fontSize: "12px", marginBottom: "8px" }}>{message}</p>}

        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={editingId ? () => updateItem(editingId) : createItem} style={btnPrimary}>
            {editingId ? "Save Changes" : "Add Model"}
          </button>
          <button onClick={clearForm} style={btnSecondary}>Cancel</button>
        </div>
      </div>

      <p style={dimText}>{items.length} model{items.length !== 1 ? "s" : ""}</p>

      {items.map((item) => (
        <div key={item.id} style={cardStyle}>
          <div style={{ flex: 1 }}>
            <span style={dimText}>#{item.id}</span>
            <p style={{ ...valueText, marginTop: "4px", fontWeight: "600" }}>{item.name}</p>
            <p style={dimText}>Provider ID: {item.llm_provider_id} · Model ID: {item.provider_model_id}</p>
            <p style={dimText}>Temperature: {item.is_temperature_supported ? "✓ Supported" : "✗ Not supported"}</p>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button style={btnEdit} onClick={() => {
              setEditingId(item.id); setName(item.name || "")
              setLlmProviderId(item.llm_provider_id ?? ""); setProviderModelId(item.provider_model_id || "")
              setIsTemperatureSupported(!!item.is_temperature_supported); window.scrollTo(0, 0)
            }}>Edit</button>
            <button style={btnDanger} onClick={() => deleteItem(item.id)}>Delete</button>
          </div>
        </div>
      ))}

      {items.length === 0 && <p style={dimText}>No models found.</p>}
    </div>
  )
}