"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import supabase from "@/lib/supabaseClient"

export default function AdminPage() {
  const [stats, setStats] = useState<any[]>([])
  const [voteStats, setVoteStats] = useState({
    totalVotes: 0,
    upvotes: 0,
    downvotes: 0,
    topCaptions: [] as any[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
    loadVoteStats()
  }, [])

  async function loadStats() {
    const tables = [
      { table: "images", label: "Images", href: "/admin/images" },
      { table: "captions", label: "Captions", href: "/admin/captions" },
      { table: "caption_requests", label: "Caption Requests", href: "/admin/caption-requests" },
      { table: "caption_examples", label: "Caption Examples", href: "/admin/caption-examples" },
      { table: "terms", label: "Terms", href: "/admin/terms" },
      { table: "llm_models", label: "LLM Models", href: "/admin/llm-models" },
      { table: "llm_providers", label: "LLM Providers", href: "/admin/llm-providers" },
      { table: "caption_votes", label: "Total Votes", href: "/admin/captions" },
    ]
    // Add this inside loadStats, after setStats(results):
    const { count: userCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
    setStats(prev => prev.map(s => 
        s.label === "Total Users" ? { ...s, value: userCount ?? 0 } : s
    ))

    const results = await Promise.all(
      tables.map(async ({ table, label, href }) => {
        const { count } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true })
        return { label, value: count ?? 0, href }
      })
    )

    setStats(results)
    setLoading(false)
  }

  async function loadVoteStats() {
    // Get all votes
    const { data: votes } = await supabase
      .from("caption_votes")
      .select("*")

    if (!votes) return

    const upvotes = votes.filter((v) => v.vote_value === true || v.vote_value === 1).length
    const downvotes = votes.length - upvotes

    // Get top voted captions by counting votes per caption
    const voteCounts: Record<string, number> = {}
    votes.forEach((v) => {
      const id = v.caption_id
      if (!id) return
      voteCounts[id] = (voteCounts[id] || 0) + 1
    })

    const topIds = Object.entries(voteCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // Fetch the actual captions
    const topCaptions = await Promise.all(
      topIds.map(async ([id, count]) => {
        const { data } = await supabase
          .from("captions")
          .select("*")
          .eq("id", id)
          .single()
        return { ...data, voteCount: count }
      })
    )

    setVoteStats({
      totalVotes: votes.length,
      upvotes,
      downvotes,
      topCaptions: topCaptions.filter(Boolean),
    })
  }

  return (
    <div>
      <h1 style={{ color: "#826b57", fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>
        Dashboard
      </h1>
      <p style={{ color: "#555", marginBottom: "40px", fontSize: "14px" }}>
        Overview of your database
      </p>

      {loading ? (
        <p style={{ color: "#555" }}>Loading statistics...</p>
      ) : (
        <>
          {/* General stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "16px",
            marginBottom: "48px",
          }}>
            {stats.map((stat) => (
              <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: "hsl(190, 38%, 84%)",
                    border: "1px solid #826b57",
                    borderRadius: "4px",
                    padding: "20px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#444")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#222")}
                >
                  <div style={{ color: "#fff", fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>
                    {stat.value.toLocaleString()}
                  </div>
                  <div style={{ color: "#666", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {stat.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Caption voting stats */}
          <h2 style={{ color: "#826b57", fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
            Caption Voting Statistics
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "32px",
          }}>
            {[
              { label: "Total Votes", value: voteStats.totalVotes, color: "#fff" },
              { label: "Upvotes", value: voteStats.upvotes, color: "rgb(110, 135, 110)" },
              { label: "Downvotes", value: voteStats.downvotes, color: "rgb(178, 100, 100)" },
            ].map((s) => (
              <div key={s.label} style={{
                background: "hsl(190, 38%, 84%)",
                border: "1px solid #826b57",
                borderRadius: "4px",
                padding: "20px",
              }}>
                <div style={{ color: s.color, fontSize: "32px", fontWeight: "700", marginBottom: "4px" }}>
                  {s.value.toLocaleString()}
                </div>
                <div style={{ color: "#666", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Top voted captions */}
          <h2 style={{ color: "#826b57", fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
            Most Voted Captions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {voteStats.topCaptions.length === 0 && (
              <p style={{ color: "#555" }}>No vote data found.</p>
            )}
            {voteStats.topCaptions.map((caption, i) => (
              <div key={caption?.id || i} style={{
                background: "hsl(190, 38%, 84%)",
                border: "1px solid #826b57",
                borderRadius: "4px",
                padding: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <span style={{ color: "#555", fontSize: "12px", marginRight: "8px" }}>#{i + 1}</span>
                  <span style={{ color: "#624848", fontSize: "14px" }}>{caption?.content || "—"}</span>
                </div>
                <div style={{
                  background: "#ffffff",
                  border: "1px solid #333",
                  borderRadius: "3px",
                  padding: "4px 10px",
                  color: "#563d3d",
                  fontSize: "13px",
                  fontWeight: "600",
                  flexShrink: 0,
                }}>
                  {caption.voteCount} votes
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}