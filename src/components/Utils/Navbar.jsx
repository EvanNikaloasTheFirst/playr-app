"use client";
import React from "react";

export default function Navbar({ title = "Playr", children }) {
  return (
    <nav
      style={{
        width: "100%",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.15)", // glassy white
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)", // Safari support
        color: "#1e3a8a",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        borderRadius: 12,
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: 20 }}>{title}</div>
      {children && <div>{children}</div>}
    </nav>
  );
}
