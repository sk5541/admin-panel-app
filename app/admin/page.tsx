"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import supabase from "@/lib/supabaseClient"
import { colors } from "@/lib/adminStyles"

interface Stat {
  label: string
  value: number | string
  href: string
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const tables = [
      { table: "profiles", label: "Total Users", href: "/admin/users" },
      { table: "images", label: "Images", href: "/admin/images" },
      { table: "captions", label: "Captions", href: "/admin/captions" },
      { table: "caption_requests", label: "Caption Requests", href: "/admin/caption-requests" },
      { table: "caption_examples", label: "Caption Examples", href: "/admin/caption-examples" },
      { table: "terms", label: "Terms", href: "/admin/terms" },
      { table: "llm_models", label: "LLM Models", href: "/admin/llm-models" },
      { table: "llm_providers", label: "LLM Providers", href: "/admin/llm-providers" },
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

  return (
    <div>
      <div style={{ marginBottom: "34px" }}>
        <p
          style={{
            color: colors.olive,
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          Overview
        </p>

        <h1
          style={{
            color: colors.text,
            fontSize: "38px",
            fontWeight: "800",
            marginBottom: "8px",
            letterSpacing: "-0.04em",
          }}
        >
          Dashboard
        </h1>

        <p style={{ color: colors.muted, margin: 0, fontSize: "15px" }}>
          A clean overview of your database activity.
        </p>
      </div>

      {loading ? (
        <p style={{ color: colors.muted }}>Loading statistics...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: "18px",
          }}
        >
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "22px",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  boxShadow: "0 12px 35px rgba(92, 64, 51, 0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)"
                  e.currentTarget.style.borderColor = colors.blue
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.borderColor = colors.border
                }}
              >
                <div
                  style={{
                    color: colors.brown,
                    fontSize: "36px",
                    fontWeight: "800",
                    marginBottom: "8px",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {stat.value}
                </div>

                <div
                  style={{
                    color: colors.muted,
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: "700",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}