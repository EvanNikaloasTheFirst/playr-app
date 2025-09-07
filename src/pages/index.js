"use client";

import React from "react";
import { signIn } from "next-auth/react";
// Add your Google Font in a <link> tag
const GoogleFont = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
    rel="stylesheet"
  />
);

export default function LoginPage() {

  return (
    <>
      <GoogleFont />
      {/* Navbar */}
      <nav
        style={{
          width: "100%",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(6px)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10,
        }}
      >
        <h1 style={{ color: "#fff", fontFamily: "Roboto, sans-serif", fontWeight: "bold" }}>
          Playr
        </h1>
        <div>
          <a
            href="#"
            style={{
              marginRight: "16px",
              color: "#fff",
              fontFamily: "Roboto, sans-serif",
              textDecoration: "none",
            }}
          >
            Home
          </a>
          <a
            href="#"
            style={{
              color: "#fff",
              fontFamily: "Roboto, sans-serif",
              textDecoration: "none",
            }}
          >
            About
          </a>
        </div>
      </nav>

      {/* Main content */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          background: "linear-gradient(to bottom right, #1e3a8a, #0d9488)",
          fontFamily: "Roboto, sans-serif",
          paddingTop: "80px", // leave space for navbar
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#fff",
                marginBottom: "8px",
              }}
            >
              Playr
            </h1>
            <p style={{ color: "#bfdbfe" }}>Track your football performance</p>
          </div>

          {/* Card */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {/* Card Header */}
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #e5e7eb",
                textAlign: "center",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Sign In</h2>
              <p style={{ color: "#6b7280" }}>
                Access your performance dashboard with Google
              </p>
            </div>

            {/* Card Content */}
            <div style={{ padding: "16px" }}>
<button
  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
  style={{
    width: "100%",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  Continue with Google
</button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", margin: "16px 0" }}>
                <hr style={{ flex: 1, borderColor: "#d1d5db" }} />
                <span style={{ margin: "0 8px", fontSize: "10px", color: "#6b7280" }}>
                  Secure login
                </span>
                <hr style={{ flex: 1, borderColor: "#d1d5db" }} />
              </div>

              <p style={{ fontSize: "10px", color: "#6b7280", textAlign: "center" }}>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
