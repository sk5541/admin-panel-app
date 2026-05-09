import React from "react"

export const colors = {
  bg: "#EADECF",
  baby: "#EADECF",
  cream: "#E0C39D",
  yellow: "#CEBA59",
  olive: "#626B2E",
  blue: "#839EA8",
  card: "rgba(255, 250, 241, 0.78)",
  border: "rgba(98, 107, 46, 0.22)",
  text: "#4E3A2E",
  muted: "#7A6B5E",
  danger: "#B45A5A",
}

export const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 15px",
  background: "rgba(255,255,255,0.72)",
  border: `1px solid ${colors.border}`,
  borderRadius: "16px",
  color: colors.text,
  fontSize: "14px",
  boxSizing: "border-box",
  marginBottom: "10px",
  outline: "none",
}

export const btnPrimary: React.CSSProperties = {
  padding: "11px 22px",
  borderRadius: "999px",
  fontSize: "13px",
  cursor: "pointer",
  fontWeight: "700",
  border: "none",
  background: colors.olive,
  color: "#fff",
  boxShadow: "0 8px 20px rgba(98,107,46,0.25)",
}

export const btnSecondary: React.CSSProperties = {
  padding: "11px 22px",
  borderRadius: "999px",
  fontSize: "13px",
  cursor: "pointer",
  fontWeight: "700",
  background: colors.baby,
  border: `1px solid ${colors.border}`,
  color: colors.text,
}

export const btnDanger: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "12px",
  cursor: "pointer",
  fontWeight: "700",
  background: "#FFF1F0",
  border: "1px solid #F1B8B5",
  color: colors.danger,
}

export const btnEdit: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "12px",
  cursor: "pointer",
  fontWeight: "700",
  background: colors.blue,
  border: "none",
  color: "#fff",
}

export const cardStyle: React.CSSProperties = {
  background: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: "24px",
  padding: "20px",
  marginBottom: "14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "14px",
  boxShadow: "0 16px 40px rgba(92, 64, 51, 0.10)",
  backdropFilter: "blur(16px)",
}

export const formBox: React.CSSProperties = {
  background: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: "28px",
  padding: "26px",
  marginBottom: "34px",
  maxWidth: "580px",
  boxShadow: "0 18px 50px rgba(92, 64, 51, 0.12)",
  backdropFilter: "blur(16px)",
}

export const pageTitle: React.CSSProperties = {
  color: colors.text,
  fontSize: "34px",
  marginBottom: "22px",
  fontWeight: "800",
  fontFamily: "Georgia, serif",
}

export const label: React.CSSProperties = {
  color: colors.muted,
  fontSize: "11px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: "6px",
  fontWeight: "700",
}

export const valueText: React.CSSProperties = {
  color: colors.text,
  fontSize: "14px",
}

export const dimText: React.CSSProperties = {
  color: colors.muted,
  fontSize: "12px",
}