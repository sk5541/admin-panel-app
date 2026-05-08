"use client"
import supabase from "@/lib/supabaseClient"

export default function UnauthorizedPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0a",
      fontFamily: "'Georgia', serif",
      textAlign: "center",
    }}>
      <div>
        <h1 style={{ color: "#f55", fontSize: "32px", marginBottom: "12px" }}>Access Denied</h1>
        <p style={{ color: "#666", marginBottom: "32px" }}>
          Your account does not have superadmin privileges.
        </p>
        <button
          onClick={() => supabase.auth.signOut().then(() => window.location.href = "/login")}
          style={{
            padding: "10px 24px",
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}