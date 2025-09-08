"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Determine link for Playr logo
  const homeLink = session ? "/dashboard" : "/";

  // Menu links array
  const menuLinks = [
    { name: "Performances", href: "/Performances" },
    { name: "Profile", href: "/Profile" },
    { name: "Training", href: "/Training" },
  ];

  return (
    <nav
      style={{
        padding: "12px 24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.2)",
        backdropFilter: "blur(6px)",
        borderRadius: "10px",
        maxWidth: "1200px",
        margin: "0 auto 20px",
        color: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Logo */}
        <a
          href={homeLink}
          style={{
            fontSize: "20px",
            fontFamily: "Roboto, sans-serif",
            fontWeight: "bold",
            margin: 0,
            color: "#fff",
            textDecoration: "none",
          }}
        >
          Playr
        </a>

        {/* Middle: Menu (only show if NOT home page) */}
        {pathname !== "/" && (
          <ul
            style={{
              display: "flex",
              gap: "24px",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {menuLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Right: Conditional info for home page */}
        {pathname === "/" && (
          <div
            style={{
              textAlign: "right",
              maxWidth: "280px",
              fontSize: "0.9rem",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "4px" }}>
              What is Playr?
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}
