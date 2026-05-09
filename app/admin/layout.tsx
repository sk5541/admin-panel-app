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
        background: "transparent",
      }}
    >
      <aside
        style={{
          width: "260px",
          background: "rgba(255, 250, 241, 0.72)",
          borderRight: `1px solid ${colors.border}`,
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          flexShrink: 0,
          boxShadow: "12px 0 40px rgba(78, 58, 46, 0.12)",
          backdropFilter: "blur(18px)",
        }}
      >
        <div style={{ padding: "0 22px 24px", borderBottom: `1px solid ${colors.border}` }}>
          <div
            style={{
              color: colors.text,
              fontWeight: "800",
              fontSize: "22px",
              letterSpacing: "-0.03em",
              fontFamily: "Georgia, serif",
            }}
          >
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
                  padding: "11px 15px",
                  marginBottom: "5px",
                  fontSize: "14px",
                  fontWeight: active ? "800" : "500",
                  color: active ? "#fffaf1" : colors.text,
                  background: active ? colors.olive : "transparent",
                  borderRadius: "999px",
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
              background: colors.olive,
              border: "none",
              borderRadius: "999px",
              color: "#fffaf1",
              fontSize: "12px",
              cursor: "pointer",
              letterSpacing: "0.05em",
              fontWeight: "800",
              boxShadow: "0 10px 22px rgba(98, 107, 46, 0.25)",
            }}
          >
            SIGN OUT
          </button>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "42px",
          overflowY: "auto",
          color: colors.text,
        }}
      >
        {children}
      </main>
    </div>
  )
}