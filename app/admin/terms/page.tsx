"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

export default function TeamsPage() {
  const [terms, setTerms] = useState<any[]>([])
  const [term, setTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    getTerms()
  }, [])

  async function getTerms() {
    const { data, error } = await supabase
      .from("terms")
      .select("*")
    if (error) {
      console.error("Error fetching terms:", error)
      return
    }
    setTerms(data || [])
  }

  async function createTerm() {
    if (!term.trim()) return
    const { error } = await supabase
      .from("terms")
      .insert([{ term }])
    if (error) {
      console.error("Error creating term:", error)
      return
    }
    setTerm("")
    getTerms()
  }

  async function updateTerm(id: number) {
    if (!term.trim()) return
    const { error } = await supabase
      .from("terms")
      .update({ term })
      .eq("id", id)
    if (error) {
      console.error("Error updating term:", error)
      return
    }
    setEditingId(null)
    setTerm("")
    getTerms()
  }

  async function deleteTerm(id: number) {
    if (!confirm("Delete this term?")) return
    const { error } = await supabase
      .from("terms")
      .delete()
      .eq("id", id)
    if (error) {
      console.error("Error deleting term:", error)
      return
    }
    getTerms()
  }

  return (
    <div>
      <h1>Terms</h1>

      <div style={{ marginBottom: "16px" }}>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Enter term"
          style={{ marginRight: "8px", padding: "6px" }}
        />
        {editingId ? (
          <>
            <button onClick={() => updateTerm(editingId)} style={{ marginRight: "4px" }}>Update</button>
            <button onClick={() => { setEditingId(null); setTerm("") }}>Cancel</button>
          </>
        ) : (
          <button onClick={createTerm}>Add</button>
        )}
      </div>

      {terms.length === 0 && <p>No terms found.</p>}

      {terms.map((item) => (
        <div key={item.id} style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
          <p><strong>ID:</strong> {item.id}</p>
          <p><strong>Term:</strong> {item.term}</p>
          <button
            onClick={() => {
              setEditingId(item.id)
              setTerm(item.term)
            }}
            style={{ marginRight: "4px" }}
          >
            Edit
          </button>
          <button onClick={() => deleteTerm(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}