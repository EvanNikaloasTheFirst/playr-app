"use client";

import React from "react";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Utils/Navbar";

const GoogleFont = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
    rel="stylesheet"
  />
);

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #1e3a8a, #0d9488)", fontFamily: "Arial, sans-serif", padding: 16 }}>
     <Navbar/>

      {/* Main Content */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #1e3a8a, #0d9488)",
          fontFamily: "Roboto, sans-serif",

        }}
      >

        <div style={{ maxWidth: "400px", padding: "0 16px" }}>
          {/* Header */}

          <div style={{ textAlign: "center", marginBottom: "24px" }}>

            <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              Playr
            </h1>
            <p style={{ color: "#bfdbfe", fontSize: "0.95rem" }}>Track your football performance</p>
          </div>

          {/* Card */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.2)",
              overflow: "hidden",
            }}
          >
            {/* Card Header */}
            <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb", textAlign: "center" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Sign In</h2>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
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
                  fontSize: "0.95rem",
                }}
              >
                Continue with Google
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", margin: "16px 0" }}>
                <hr style={{ flex: 1, borderColor: "#d1d5db" }} />
                <span style={{ margin: "0 8px", fontSize: "0.75rem", color: "#6b7280" }}>
                  Secure login
                </span>
                <hr style={{ flex: 1, borderColor: "#d1d5db" }} />
              </div>

              <p style={{ fontSize: "0.75rem", color: "#6b7280", textAlign: "center" }}>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
