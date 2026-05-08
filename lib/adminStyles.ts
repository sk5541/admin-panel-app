import React from "react"

export const colors = {
  bg: "#F7F3EC",
  card: "#FFFFFF",
  cream: "#E6DDCF",
  olive: "#7A6E47",
  brown: "#5C4033",
  blue: "#A3B4BE",
  border: "#DED4C5",
  text: "#2B211C",
  muted: "#7C746B",
  danger: "#B42318",
}

export const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  background: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: "12px",
  color: colors.text,
  fontSize: "14px",
  boxSizing: "border-box",
  marginBottom: "10px",
  outline: "none",
}

export const btnPrimary: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: "999px",
  fontSize: "13px",
  cursor: "pointer",
  fontWeight: "700",
  border: "none",
  background: colors.brown,
  color: "#fff",
}

export const btnSecondary: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: "999px",
  fontSize: "13px",
  cursor: "pointer",
  fontWeight: "700",
  background: colors.cream,
  border: `1px solid ${colors.border}`,
  color: colors.brown,
}

export const btnDanger: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "12px",
  cursor: "pointer",
  fontWeight: "700",
  background: "#FFF1F0",
  border: "1px solid #F5C2C0",
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
  color: "#22313A",
}

export const cardStyle: React.CSSProperties = {
  background: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: "18px",
  padding: "18px",
  marginBottom: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "14px",
  boxShadow: "0 10px 30px rgba(92, 64, 51, 0.06)",
}

export const formBox: React.CSSProperties = {
  background: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: "22px",
  padding: "24px",
  marginBottom: "32px",
  maxWidth: "560px",
  boxShadow: "0 12px 35px rgba(92, 64, 51, 0.07)",
}

export const pageTitle: React.CSSProperties = {
  color: colors.text,
  fontSize: "30px",
  marginBottom: "22px",
  fontWeight: "800",
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