"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

const PAGE_SIZE = 25

type Caption = {
  id: number
  content: string
  is_public: boolean
  is_featured: boolean
  like_count: number
  created_datetime_utc: string
  profile_id: string
  image_id: number
  images: { id: number; url: string } | null
  "profiles!captions_profile_id_fkey": { first_name: string | null; last_name: string | null; email: string | null } | null
}

/* ── tiny helpers ── */
function Badge({ on, label, offLabel }: { on: boolean; label: string; offLabel?: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.04em",
      background: on ? "#dcfce7" : "#f3f4f6",
      color: on ? "#15803d" : "#6b7280",
      border: `1px solid ${on ? "#bbf7d0" : "#e5e7eb"}`,
    }}>
      {on ? label : (offLabel ?? "No")}
    </span>
  )
}

function Pill({ n }: { n: number }) {
  const color = n >= 100 ? "#fbbf24" : n >= 10 ? "#a78bfa" : "#555"
  return (
    <span style={{ color, fontWeight: 700, fontSize: "13px" }}>
      {n >= 100 ? "🔥 " : n >= 10 ? "❤️ " : "♡ "}{n}
    </span>
  )
}

export default function CaptionsPage() {
  const [captions,  setCaptions]  = useState<Caption[]>([])
  const [total,     setTotal]     = useState(0)
  const [page,      setPage]      = useState(0)          // 0-indexed
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  // Filter state
  const [filterPublic,   setFilterPublic]   = useState<"all" | "yes" | "no">("all")
  const [filterFeatured, setFilterFeatured] = useState<"all" | "yes" | "no">("all")
  const [search,         setSearch]         = useState("")

  useEffect(() => { fetchPage(0) }, [filterPublic, filterFeatured, search])
  useEffect(() => { fetchPage(page) }, [page])

  async function fetchPage(p: number) {
    setLoading(true)
    setError(null)

    let query = supabase
      .from("captions")
      .select(`
        id,
        content,
        is_public,
        is_featured,
        like_count,
        created_datetime_utc,
        profile_id,
        image_id,
        images ( id, url ),
        profiles!profile_id ( first_name, last_name, email )
      `, { count: "exact" })
      .order("created_datetime_utc", { ascending: false })
      .range(p * PAGE_SIZE, p * PAGE_SIZE + PAGE_SIZE - 1)

    if (filterPublic   === "yes") query = query.eq("is_public",   true)
    if (filterPublic   === "no")  query = query.eq("is_public",   false)
    if (filterFeatured === "yes") query = query.eq("is_featured",  true)
    if (filterFeatured === "no")  query = query.eq("is_featured",  false)
    if (search.trim())            query = query.ilike("content", `%${search.trim()}%`)

    const { data, error, count } = await query

    if (error) { setError(error.message); setLoading(false); return }
    setCaptions((data as any[]) || [])
    setTotal(count ?? 0)
    setLoading(false)
  }

  function gotoPage(p: number) {
    setPage(p)
    window.scrollTo(0, 0)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  /* ── render ── */
  return (
    <div style={{ fontFamily: "'DM Mono', monospace", color: "#ccc", padding: "32px 28px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "8px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "0.08em", color: "#fff", margin: 0 }}>
          CAPTIONS
        </h1>
        {!loading && !error && (
          <span style={{ fontSize: "12px", color: "#6b7280", letterSpacing: "0.06em" }}>
            {total.toLocaleString()} total
          </span>
        )}
      </div>

      {/* Filters */}
      <div style={{
        display: "flex", gap: "10px", flexWrap: "wrap",
        marginBottom: "24px", alignItems: "center"
      }}>
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          placeholder="Search captions…"
          style={{
            background: "#fff", border: "1px solid #d1d5db", borderRadius: "6px",
            color: "#111", fontSize: "12px", padding: "7px 12px", outline: "none",
            width: "200px",
          }}
        />

        {(["all","yes","no"] as const).map(v => (
          <button
            key={`pub-${v}`}
            onClick={() => { setFilterPublic(v); setPage(0) }}
            style={{
              padding: "6px 14px", borderRadius: "6px", fontSize: "11px",
              fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer",
              background: filterPublic === v ? "#4a5e2a" : "#fff",
              color: filterPublic === v ? "#fff" : "#6b7280",
              border: `1px solid ${filterPublic === v ? "#4a5e2a" : "#d1d5db"}`,
            }}
          >
            {v === "all" ? "All" : v === "yes" ? "Public" : "Private"}
          </button>
        ))}

        <div style={{ width: "1px", height: "20px", background: "#d1d5db" }} />

        {(["all","yes","no"] as const).map(v => (
          <button
            key={`feat-${v}`}
            onClick={() => { setFilterFeatured(v); setPage(0) }}
            style={{
              padding: "6px 14px", borderRadius: "6px", fontSize: "11px",
              fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer",
              background: filterFeatured === v ? "#4a5e2a" : "#fff",
              color: filterFeatured === v ? "#fff" : "#6b7280",
              border: `1px solid ${filterFeatured === v ? "#4a5e2a" : "#d1d5db"}`,
            }}
          >
            {v === "all" ? "All" : v === "yes" ? "⭐ Featured" : "Not Featured"}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <div style={{ color: "#444", fontSize: "13px", padding: "40px 0", textAlign: "center" }}>
          Loading…
        </div>
      )}

      {!loading && error && (
        <div style={{
          background: "#1a0000", border: "1px solid #450a0a", borderRadius: "8px",
          padding: "16px 20px", color: "#f87171", fontSize: "13px", marginBottom: "20px"
        }}>
          <strong>Error:</strong> {error}
          <br />
          <span style={{ fontSize: "11px", color: "#7f1d1d", marginTop: "6px", display: "block" }}>
            Check Supabase → captions table → RLS Policies → add SELECT policy or disable RLS.
          </span>
        </div>
      )}

      {!loading && !error && captions.length === 0 && (
        <div style={{
          border: "1px dashed #222", borderRadius: "8px", padding: "60px 20px",
          textAlign: "center", color: "#444", fontSize: "13px"
        }}>
          No captions match your filters.
        </div>
      )}

      {/* Table */}
      {!loading && !error && captions.length > 0 && (
        <>
          <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid #d1d5db" }}>
            <table style={{
              borderCollapse: "collapse", width: "100%",
              fontSize: "12px", background: "#f9fafb",
            }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #d1d5db" }}>
                  {["Image", "Caption", "Likes", "Public", "Featured", "Created"].map(col => (
                    <th key={col} style={{
                      padding: "12px 16px", textAlign: "left",
                      color: "#6b7280", fontWeight: 700, letterSpacing: "0.08em",
                      fontSize: "10px", whiteSpace: "nowrap", background: "#f3f4f6",
                    }}>
                      {col.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {captions.map((caption, i) => {
                  const image = Array.isArray(caption.images) ? caption.images[0] : caption.images
                  const imageUrl = image?.url ?? null
                  const created = caption.created_datetime_utc
                    ? new Date(caption.created_datetime_utc).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })
                    : "—"

                  return (
                    <tr
                      key={caption.id}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                        background: i % 2 === 0 ? "#f9fafb" : "#ffffff",
                        verticalAlign: "middle",
                      }}
                    >
                      {/* Image */}
                      <td style={{ padding: "10px 16px" }}>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt=""
                            style={{
                              width: "72px", height: "72px", objectFit: "cover",
                              borderRadius: "6px", display: "block", border: "1px solid #1e1e1e",
                            }}
                            onError={(e) => {
                              const t = e.target as HTMLImageElement
                              t.style.display = "none"
                              t.insertAdjacentHTML("afterend",
                                `<div style="width:72px;height:72px;background:#111;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#333;font-size:10px;">No img</div>`
                              )
                            }}
                          />
                        ) : (
                          <div style={{
                            width: "72px", height: "72px", background: "#111",
                            borderRadius: "6px", display: "flex", alignItems: "center",
                            justifyContent: "center", color: "#333", fontSize: "10px",
                            border: "1px solid #1e1e1e",
                          }}>
                            No img
                          </div>
                        )}
                      </td>

                      {/* Caption text */}
                      <td style={{
                        padding: "10px 16px", maxWidth: "320px",
                        lineHeight: "1.6", color: "#111827",
                      }}>
                        <span style={{ fontSize: "13px" }}>
                          {caption.content || <em style={{ color: "#9ca3af" }}>—</em>}
                        </span>
                        {caption.profile_id && (() => {
                          const raw = (caption as any)["profiles!profile_id"]
                          const p = Array.isArray(raw) ? raw[0] : raw
                          const name = [p?.first_name, p?.last_name].filter(Boolean).join(" ") || p?.email || null
                          return name ? (
                            <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#9ca3af", letterSpacing: "0.04em" }}>
                              by {name}
                            </p>
                          ) : null
                        })()}
                      </td>

                      {/* Likes */}
                      <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                        <Pill n={caption.like_count ?? 0} />
                      </td>

                      {/* Public */}
                      <td style={{ padding: "10px 16px" }}>
                        <Badge on={caption.is_public} label="Public" offLabel="Private" />
                      </td>

                      {/* Featured */}
                      <td style={{ padding: "10px 16px" }}>
                        <Badge on={caption.is_featured} label="⭐ Yes" offLabel="No" />
                      </td>

                      {/* Created */}
                      <td style={{ padding: "10px 16px", color: "#6b7280", whiteSpace: "nowrap", fontSize: "11px" }}>
                        {created}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginTop: "20px", flexWrap: "wrap", gap: "12px",
            }}>
              <span style={{ fontSize: "11px", color: "#6b7280", letterSpacing: "0.06em" }}>
                Page {page + 1} of {totalPages} &nbsp;·&nbsp; showing {captions.length} of {total.toLocaleString()}
              </span>

              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <button
                  onClick={() => gotoPage(0)}
                  disabled={page === 0}
                  style={{
                    padding: "6px 12px", borderRadius: "6px", fontSize: "11px",
                    background: "#fff", border: "1px solid #d1d5db",
                    color: page === 0 ? "#d1d5db" : "#6b7280", cursor: page === 0 ? "default" : "pointer",
                  }}
                >
                  «
                </button>
                <button
                  onClick={() => gotoPage(page - 1)}
                  disabled={page === 0}
                  style={{
                    padding: "6px 14px", borderRadius: "6px", fontSize: "11px",
                    background: "#fff", border: "1px solid #d1d5db",
                    color: page === 0 ? "#d1d5db" : "#6b7280", cursor: page === 0 ? "default" : "pointer",
                  }}
                >
                  Prev
                </button>

                {/* Page number pills — show up to 7 around current */}
                {Array.from({ length: totalPages }, (_, i) => i)
                  .filter(i => Math.abs(i - page) <= 3 || i === 0 || i === totalPages - 1)
                  .reduce<(number | "…")[]>((acc, i, idx, arr) => {
                    if (idx > 0 && (i as number) - (arr[idx - 1] as number) > 1) acc.push("…")
                    acc.push(i)
                    return acc
                  }, [])
                  .map((v, idx) =>
                    v === "…" ? (
                      <span key={`e${idx}`} style={{ padding: "6px 4px", color: "#9ca3af", fontSize: "11px" }}>…</span>
                    ) : (
                      <button
                        key={v}
                        onClick={() => gotoPage(v as number)}
                        style={{
                          padding: "6px 12px", borderRadius: "6px", fontSize: "11px",
                          background: v === page ? "#4a5e2a" : "#fff",
                          border: `1px solid ${v === page ? "#4a5e2a" : "#d1d5db"}`,
                          color: v === page ? "#fff" : "#6b7280",
                          cursor: "pointer", fontWeight: v === page ? 700 : 400,
                        }}
                      >
                        {(v as number) + 1}
                      </button>
                    )
                  )}

                <button
                  onClick={() => gotoPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  style={{
                    padding: "6px 14px", borderRadius: "6px", fontSize: "11px",
                    background: "#fff", border: "1px solid #d1d5db",
                    color: page >= totalPages - 1 ? "#d1d5db" : "#6b7280",
                    cursor: page >= totalPages - 1 ? "default" : "pointer",
                  }}
                >
                  Next
                </button>
                <button
                  onClick={() => gotoPage(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                  style={{
                    padding: "6px 12px", borderRadius: "6px", fontSize: "11px",
                    background: "#fff", border: "1px solid #d1d5db",
                    color: page >= totalPages - 1 ? "#d1d5db" : "#6b7280",
                    cursor: page >= totalPages - 1 ? "default" : "pointer",
                  }}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}