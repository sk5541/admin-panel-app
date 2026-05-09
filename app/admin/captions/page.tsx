"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

export default function CaptionsPage() {
  const [captions, setCaptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCaptions()
  }, [])

  async function getCaptions() {
    setLoading(true)
    setError(null)

    // Fetch captions joined with images to get the image URL
    const { data, error } = await supabase
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
        images (
          id,
          url
        )
      `)
      .order("created_datetime_utc", { ascending: false })

    console.log("Captions DATA:", data)
    console.log("Captions ERROR:", error)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setCaptions(data || [])
    setLoading(false)
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1 style={{ marginBottom: "1.25rem", fontSize: "1.75rem", fontWeight: 700 }}>Captions</h1>

      {loading && <p style={{ color: "#666" }}>Loading captions...</p>}

      {!loading && error && (
        <div style={{
          backgroundColor: "#fee2e2",
          border: "1px solid #fca5a5",
          borderRadius: "8px",
          padding: "1rem",
          color: "#b91c1c",
          marginBottom: "1rem"
        }}>
          <strong>Error:</strong> {error}
          <br />
          <small>Likely an RLS policy issue. Go to Supabase → captions table → RLS Policies → add SELECT policy or disable RLS.</small>
        </div>
      )}

      {!loading && !error && captions.length === 0 && (
        <div style={{
          backgroundColor: "#fef9c3",
          border: "1px solid #fde047",
          borderRadius: "8px",
          padding: "1rem",
          color: "#854d0e"
        }}>
          <strong>No captions found.</strong>
          <br />
          <small>RLS may be silently blocking reads. Check Supabase → captions → RLS Policies.</small>
        </div>
      )}

      {!loading && !error && captions.length > 0 && (
        <>
          <p style={{ color: "#666", marginBottom: "1rem", fontSize: "0.875rem" }}>
            {captions.length} caption{captions.length !== 1 ? "s" : ""}
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={{
              borderCollapse: "collapse",
              width: "100%",
              fontSize: "0.875rem",
              backgroundColor: "#fff",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", textAlign: "left" }}>
                  {["Image", "Caption", "Likes", "Public", "Featured", "Created"].map(col => (
                    <th key={col} style={{
                      padding: "10px 14px",
                      fontWeight: 600,
                      color: "#334155",
                      borderBottom: "1px solid #e2e8f0",
                      whiteSpace: "nowrap"
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {captions.map((caption, i) => {
                  // images may be an object or array depending on your schema
                  const image = Array.isArray(caption.images)
                    ? caption.images[0]
                    : caption.images

                  const imageUrl = image?.url ?? null

                  const createdAt = caption.created_datetime_utc
                    ? new Date(caption.created_datetime_utc).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric"
                      })
                    : "—"

                  return (
                    <tr
                      key={caption.id}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#fff" : "#f8fafc",
                        verticalAlign: "top"
                      }}
                    >
                      {/* Image */}
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0" }}>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="caption image"
                            style={{
                              width: "90px",
                              height: "90px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              display: "block"
                            }}
                          />
                        ) : (
                          <div style={{
                            width: "90px",
                            height: "90px",
                            backgroundColor: "#e2e8f0",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#94a3b8",
                            fontSize: "0.75rem",
                            textAlign: "center"
                          }}>
                            No image
                          </div>
                        )}
                      </td>

                      {/* Caption content */}
                      <td style={{
                        padding: "10px 14px",
                        borderBottom: "1px solid #e2e8f0",
                        maxWidth: "350px",
                        lineHeight: "1.5"
                      }}>
                        <span style={{ fontWeight: 500 }}>{caption.content || "—"}</span>
                      </td>

                      {/* Likes */}
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>
                        ❤️ {caption.like_count ?? 0}
                      </td>

                      {/* Public */}
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0" }}>
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backgroundColor: caption.is_public ? "#dcfce7" : "#fee2e2",
                          color: caption.is_public ? "#15803d" : "#b91c1c"
                        }}>
                          {caption.is_public ? "Yes" : "No"}
                        </span>
                      </td>

                      {/* Featured */}
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0" }}>
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backgroundColor: caption.is_featured ? "#fef9c3" : "#f1f5f9",
                          color: caption.is_featured ? "#854d0e" : "#64748b"
                        }}>
                          {caption.is_featured ? "⭐ Yes" : "No"}
                        </span>
                      </td>

                      {/* Created date */}
                      <td style={{
                        padding: "10px 14px",
                        borderBottom: "1px solid #e2e8f0",
                        color: "#64748b",
                        whiteSpace: "nowrap"
                      }}>
                        {createdAt}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}