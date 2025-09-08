"use client";
import React, { useState, useEffect } from "react";

export default function DashboardBox({ children, color }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // set initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const boxStyle = {
    background: color || "lightgray",
    height: isMobile ? "500px" : "400px",
    width: isMobile ? "100%" : "450px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    transition: "all 0.3s ease", // smooth resizing
  };

  return <div style={boxStyle}>{children}</div>;
}
