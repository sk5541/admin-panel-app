"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import supabase from "@/lib/supabaseClient"
import { colors } from "@/lib/adminStyles"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Images", href: "/admin/images" },
  { label: "Captions", href: "/admin/captions" },
  { label: "Caption Requests", href: "/admin/caption-requests" },
  { label: "Caption Examples", href: "/admin/caption-examples" },
  { label: "Terms", href: "/admin/terms" },
  { label: "Humor Flavors", href: "/admin/humor-flavors" },
  { label: "Humor Flavor Steps", href: "/admin/humor-flavor-steps" },
  { label: "Humor Flavor Mix", href: "/admin/humor-flavor-mix" },
  { label: "LLM Models", href: "/admin/llm-models" },
  { label: "LLM Providers", href: "/admin/llm-providers" },
  { label: "LLM Prompt Chains", href: "/admin/llm-prompt-chains" },
  { label: "LLM Responses", href: "/admin/llm-responses" },
  { label: "Allowed Signup Domains", href: "/admin/allowed-signup-domains" },
  { label: "Whitelist Emails", href: "/admin/whitelist-email-addresses" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, Helvetica, sans-serif",
        background: colors.bg,
      }}
    >
      <aside
        style={{
          width: "250px",
          background: colors.card,
          borderRight: `1px solid ${colors.border}`,
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          flexShrink: 0,
          boxShadow: "8px 0 30px rgba(92, 64, 51, 0.05)",
        }}
      >
        <div style={{ padding: "0 22px 24px", borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ color: colors.brown, fontWeight: "800", fontSize: "20px", letterSpacing: "-0.03em" }}>
            Admin
          </div>
          <div style={{ color: colors.muted, fontSize: "12px", marginTop: "4px" }}>
            Control Panel
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "14px 12px" }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "block",
                  padding: "10px 14px",
                  marginBottom: "4px",
                  fontSize: "14px",
                  fontWeight: active ? "700" : "500",
                  color: active ? colors.brown : colors.muted,
                  background: active ? colors.cream : "transparent",
                  borderRadius: "12px",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: `1px solid ${colors.border}` }}>
          <button
            onClick={handleSignOut}
            style={{
              width: "100%",
              padding: "11px",
              background: colors.brown,
              border: "none",
              borderRadius: "999px",
              color: "#fff",
              fontSize: "12px",
              cursor: "pointer",
              letterSpacing: "0.05em",
              fontWeight: "700",
            }}
          >
            SIGN OUT
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "42px", overflowY: "auto", color: colors.text }}>
        {children}
      </main>
    </div>
  )
}