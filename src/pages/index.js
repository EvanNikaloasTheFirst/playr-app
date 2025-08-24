"use client";

import React from "react";

// Add your Google Font in a <link> tag
const GoogleFont = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
    rel="stylesheet"
  />
);

export default function LoginPage() {
 

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


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
                  marginBottom: "16px",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)")
                }
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <svg
                  style={{ width: "20px", height: "20px", marginRight: "8px" }}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                

                <a h href={`${backendUrl}/oauth2/authorization/google`}>Continue with Google</a>
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
