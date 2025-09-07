"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        padding: "16px 14px",
        display: "flex",
        borderRadius:"10px",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.2)",
        backdropFilter: "blur(6px)",

        top: 0,
        left: 0,

        zIndex: 10,
      }}
    >
      {/* Logo */}
      <h1 style={{ fontSize:"20px",color: "#fff", fontFamily: "Roboto, sans-serif", fontWeight: "bold" }}>
        Playr
      </h1>

      {/* Menu */}
      <ul style={{ display: "flex", gap: "24px", listStyle: "none", margin: 0, padding: 0 }}>
  <li>
    <a
      href="/Performances"
      style={{ color: "#fff", textDecoration: "none", cursor: "pointer" }}
    >
      Performances
    </a>
  </li>
  <li>
    <a
      href="/Profile"
      style={{ color: "#fff", textDecoration: "none", cursor: "pointer" }}
    >
      Profile
    </a>
  </li>
  <li>
    <a
      href="/Training"
      style={{ color: "#fff", textDecoration: "none", cursor: "pointer" }}
    >
      Training
    </a>
  </li>
</ul>

      {/* Conditional info for home page */}
      {pathname === "/" && (
        <div
          style={{
            position: "relative",
            top: "64px",
            left: "24px",
            color: "#fff",
            maxWidth: "300px",
            fontSize: "0.9rem",
          }}
        >
          <h2 style={{ fontWeight: "bold", marginBottom: "4px" }}>What is Playr?</h2>
          <p>
            Playr is a football performance tracking app that helps you monitor matches,
            ratings, and training sessions in one place.
          </p>
        </div>
      )}
    </nav>
  );
}
