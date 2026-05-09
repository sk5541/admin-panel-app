"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getUsers()
  }, [])

  async function getUsers() {
    setLoading(true)
    setError(null)

    const { data: { session } } = await supabase.auth.getSession()
    console.log("Session:", session) // check if you're logged in

    const { data, error } = await supabase
      .from("profiles")
      .select("id, created_datetime_utc, first_name, last_name, email, is_superadmin, is_in_study, is_matrix_admin")
      .order("created_datetime_utc", { ascending: false })

    console.log("Users DATA:", data)
    console.log("Users ERROR:", error)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setUsers(data || [])
    setLoading(false)
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1 style={{ marginBottom: "1.25rem", fontSize: "1.75rem", fontWeight: 700 }}>Users</h1>

      {loading && <p style={{ color: "#666" }}>Loading users...</p>}

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
          <small>Go to Supabase → profiles table → RLS Policies → add a SELECT policy or disable RLS.</small>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div style={{
          backgroundColor: "#fef9c3",
          border: "1px solid #fde047",
          borderRadius: "8px",
          padding: "1rem",
          color: "#854d0e"
        }}>
          <strong>No users found.</strong>
          <br />
          <small>RLS may be silently blocking reads. Check Supabase → profiles table → RLS Policies.</small>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <>
          <p style={{ color: "#666", marginBottom: "1rem", fontSize: "0.875rem" }}>
            {users.length} user{users.length !== 1 ? "s" : ""}
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
                  {["Avatar", "Name", "Email", "Super Admin", "In Study", "Matrix Admin", "Joined"].map(col => (
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
                {users.map((user, i) => {
                  const joined = user.created_datetime_utc
                    ? new Date(user.created_datetime_utc).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric"
                      })
                    : "—"

                  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "—"
                  const initial = user.first_name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "?"

                  function Badge({ value, trueColor = "#dcfce7", trueText = "#15803d", falseColor = "#f1f5f9", falseText = "#64748b" }: any) {
                    return (
                      <span style={{
                        padding: "2px 10px",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor: value ? trueColor : falseColor,
                        color: value ? trueText : falseText
                      }}>
                        {value ? "Yes" : "No"}
                      </span>
                    )
                  }

                  return (
                    <tr
                      key={user.id}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#fff" : "#f8fafc",
                        verticalAlign: "middle"
                      }}
                    >
                      {/* Avatar initial */}
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0" }}>
                        <div style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "#e0e7ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          color: "#4338ca",
                          fontSize: "1rem"
                        }}>
                          {initial}
                        </div>
                      </td>

                      {/* Name */}
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0", fontWeight: 500 }}>
                        {fullName}
                      </td>

                      {/* Email */}
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                        {user.email ?? "—"}
                      </td>

                      {/* Super Admin */}
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0" }}>
                        <Badge value={user.is_superadmin} trueColor="#ede9fe" trueText="#6d28d9" />
                      </td>

                      {/* In Study */}
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0" }}>
                        <Badge value={user.is_in_study} />
                      </td>

                      {/* Matrix Admin */}
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0" }}>
                        <Badge value={user.is_matrix_admin} trueColor="#fef9c3" trueText="#854d0e" />
                      </td>

                      {/* Joined */}
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0", color: "#64748b", whiteSpace: "nowrap" }}>
                        {joined}
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