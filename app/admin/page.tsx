"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import supabase from "@/lib/supabaseClient"
import { colors } from "@/lib/adminStyles"

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
      { table: "profiles", label: "Users", href: "/admin/users" },
      { table: "images", label: "Images", href: "/admin/images" },
      { table: "captions", label: "Captions", href: "/admin/captions" },
      { table: "caption_requests", label: "Caption Requests", href: "/admin/caption-requests" },
      { table: "caption_examples", label: "Caption Examples", href: "/admin/caption-examples" },
      { table: "terms", label: "Terms", href: "/admin/terms" },
      { table: "llm_models", label: "LLM Models", href: "/admin/llm-models" },
      { table: "llm_providers", label: "LLM Providers", href: "/admin/llm-providers" },
      { table: "caption_votes", label: "Total Votes", href: "/admin/captions" },
    ]

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
    const { count: totalVotes } = await supabase
      .from("caption_votes")
      .select("*", { count: "exact", head: true })

    const { count: upvotes } = await supabase
      .from("caption_votes")
      .select("*", { count: "exact", head: true })
      .eq("vote_value", 1)

    const total = totalVotes ?? 0
    const up = upvotes ?? 0
    const down = total - up

    let allVotes: any[] = []
    let from = 0
    const pageSize = 1000

    while (true) {
      const { data: page } = await supabase
        .from("caption_votes")
        .select("caption_id")
        .range(from, from + pageSize - 1)

      if (!page || page.length === 0) break

      allVotes = allVotes.concat(page)

      if (page.length < pageSize) break
      from += pageSize
    }

    const voteCounts: Record<string, number> = {}

    allVotes.forEach((v) => {
      const id = v.caption_id
      if (!id) return
      voteCounts[id] = (voteCounts[id] || 0) + 1
    })

    const topIds = Object.entries(voteCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const topCaptions = await Promise.all(
      topIds.map(async ([id, count]) => {
        const { data } = await supabase
          .from("captions")
          .select("id, content")
          .eq("id", id)
          .single()

        return data ? { ...data, voteCount: count } : null
      })
    )

    setVoteStats({
      totalVotes: total,
      upvotes: up,
      downvotes: down,
      topCaptions: topCaptions.filter(Boolean),
    })
  }

  const statCard = {
    background: "rgba(131, 158, 168, 0.42)",
    border: "1px solid rgba(98, 107, 46, 0.25)",
    borderRadius: "24px",
    padding: "24px",
    cursor: "pointer",
    boxShadow: "0 18px 45px rgba(78, 58, 46, 0.10)",
    backdropFilter: "blur(16px)",
    transition: "all 0.2s ease",
  }

  return (
    <div>
      <div style={{ marginBottom: "38px" }}>
        <p
          style={{
            color: colors.olive,
            fontSize: "12px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: "800",
            marginBottom: "8px",
          }}
        >
          Admin Control Panel
        </p>

        <h1
          style={{
            color: colors.text,
            fontSize: "42px",
            fontWeight: "800",
            margin: 0,
            fontFamily: "Georgia, serif",
          }}
        >
          Dashboard
        </h1>

        <p style={{ color: colors.muted, marginTop: "10px", fontSize: "15px" }}>
          A soft overview of your database, captions, votes, and activity.
        </p>
      </div>

      {loading ? (
        <p style={{ color: colors.muted }}>Loading statistics...</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: "18px",
              marginBottom: "52px",
            }}
          >
            {stats.map((stat) => (
              <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
                <div
                  style={statCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.background = "rgba(131, 158, 168, 0.56)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.background = "rgba(131, 158, 168, 0.42)"
                  }}
                >
                  <div
                    style={{
                      color: "#fffaf1",
                      fontSize: "34px",
                      fontWeight: "800",
                      marginBottom: "6px",
                      textShadow: "0 2px 10px rgba(78, 58, 46, 0.18)",
                    }}
                  >
                    {stat.value.toLocaleString()}
                  </div>

                  <div
                    style={{
                      color: colors.text,
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: "800",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h2
            style={{
              color: colors.text,
              fontSize: "24px",
              fontWeight: "800",
              marginBottom: "18px",
              fontFamily: "Georgia, serif",
            }}
          >
            Caption Voting Statistics
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "18px",
              marginBottom: "38px",
            }}
          >
            {[
              { label: "Total Votes", value: voteStats.totalVotes, color: "#fffaf1" },
              { label: "Upvotes", value: voteStats.upvotes, color: colors.olive },
              { label: "Downvotes", value: voteStats.downvotes, color: colors.danger },
            ].map((s) => (
              <div key={s.label} style={statCard}>
                <div
                  style={{
                    color: s.color,
                    fontSize: "36px",
                    fontWeight: "800",
                    marginBottom: "6px",
                  }}
                >
                  {s.value.toLocaleString()}
                </div>

                <div
                  style={{
                    color: colors.text,
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: "800",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <h2
            style={{
              color: colors.text,
              fontSize: "24px",
              fontWeight: "800",
              marginBottom: "18px",
              fontFamily: "Georgia, serif",
            }}
          >
            Most Voted Captions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {voteStats.topCaptions.length === 0 && (
              <p style={{ color: colors.muted }}>No vote data found.</p>
            )}

            {voteStats.topCaptions.map((caption, i) => (
              <div
                key={caption?.id || i}
                style={{
                  background: "rgba(255, 250, 241, 0.76)",
                  border: "1px solid rgba(98, 107, 46, 0.22)",
                  borderRadius: "22px",
                  padding: "18px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  boxShadow: "0 14px 35px rgba(78, 58, 46, 0.08)",
                  backdropFilter: "blur(14px)",
                }}
              >
                <div>
                  <span
                    style={{
                      color: colors.olive,
                      fontSize: "13px",
                      marginRight: "10px",
                      fontWeight: "800",
                    }}
                  >
                    #{i + 1}
                  </span>

                  <span style={{ color: colors.text, fontSize: "15px" }}>
                    {caption?.content || "—"}
                  </span>
                </div>

                <div
                  style={{
                    background: colors.cream,
                    border: "1px solid rgba(98, 107, 46, 0.25)",
                    borderRadius: "999px",
                    padding: "7px 14px",
                    color: colors.text,
                    fontSize: "13px",
                    fontWeight: "800",
                    flexShrink: 0,
                  }}
                >
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