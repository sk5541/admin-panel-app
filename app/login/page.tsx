"use client"

import { useState } from "react"
import supabase from "@/lib/supabaseClient"
import { colors } from "@/lib/adminStyles"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function signInWithGoogle() {
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "rgba(255, 250, 241, 0.78)",
          border: `1px solid ${colors.border}`,
          borderRadius: "32px",
          padding: "44px",
          width: "100%",
          maxWidth: "430px",
          textAlign: "center",
          boxShadow: "0 28px 80px rgba(78, 58, 46, 0.18)",
          backdropFilter: "blur(18px)",
        }}
      >
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "20px",
            background: colors.blue,
            margin: "0 auto 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.text,
            fontSize: "24px",
            fontWeight: "800",
          }}
        >
          A
        </div>

        <p
          style={{
            color: colors.olive,
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          Admin Access
        </p>

        <h1
          style={{
            color: colors.text,
            fontSize: "34px",
            marginBottom: "10px",
            letterSpacing: "-0.04em",
            fontWeight: "800",
            fontFamily: "Georgia, serif",
          }}
        >
          Welcome back
        </h1>

        <p
          style={{
            color: colors.muted,
            fontSize: "14px",
            marginBottom: "34px",
            lineHeight: "1.6",
          }}
        >
          Sign in with your approved Google account to manage the admin panel.
        </p>

        {error && (
          <p
            style={{
              color: colors.danger,
              background: "#FFF1F0",
              border: "1px solid #F5C2C0",
              borderRadius: "12px",
              padding: "10px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px 16px",
            background: loading ? colors.cream : colors.olive,
            color: loading ? colors.muted : "#fffaf1",
            border: "none",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: "800",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            letterSpacing: "0.01em",
            boxShadow: loading ? "none" : "0 12px 28px rgba(98, 107, 46, 0.25)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" />
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" />
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" />
          </svg>

          {loading ? "Redirecting..." : "Continue with Google"}
        </button>
      </div>
    </div>
  )
}