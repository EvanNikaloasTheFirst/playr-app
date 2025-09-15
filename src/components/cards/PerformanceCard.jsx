"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export default function PerformanceCard({ perf, onOpen, onDelete }) {
  // Random bg color
  const bgColor = useMemo(() => {
    const r = Math.floor(Math.random() * 200) + 30;
    const g = Math.floor(Math.random() * 200) + 30;
    const b = Math.floor(Math.random() * 200) + 30;
    return `rgb(${r},${g},${b})`;
  }, []);

  const cardStyle = {
    width: "260px",
    minHeight: "200px",
    borderRadius: "20px",
    backgroundColor: bgColor,
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    padding: "20px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative", // 🔑 so delete button can sit top-right
    transition: "all 0.3s ease",
  };

  const deleteBtnStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "rgba(255, 77, 79, 0.9)",
    border: "none",
    color: "#fff",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    transition: "all 0.2s ease",
  };

  const buttonStyle = {
    marginTop: "14px",
    width: "100%",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "rgba(0,0,0,0.3)",
    color: "#fff",
    fontWeight: "600",
    padding: "10px",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    transition: "all 0.2s ease",
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={cardStyle}>
      {/* Delete button */}
      <button
        onClick={() => {
          if (confirm("Delete this performance?")) {
            onDelete(perf._id);
          }
        }}
        style={deleteBtnStyle}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#ff1a1a")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 77, 79, 0.9)")}
      >
        ✕
      </button>

      {/* Info */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>{perf.match}</h2>
        <p style={{ fontSize: "14px", margin: "2px 0" }}>
          Season: <span style={{ fontWeight: "bold" }}>{perf.season}</span>
        </p>
        <p style={{ fontSize: "14px", margin: "2px 0" }}>Position: {perf.subPosition}</p>
        <p style={{ fontSize: "14px", margin: "2px 0" }}>
          Minutes:{" "}
          <span style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: "5px" }}>
            {perf.minutes}
          </span>
        </p>
        <p style={{ fontSize: "14px", margin: "2px 0" }}>
          Rating:{" "}
          <span style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: "5px" }}>
            {perf.rating}
          </span>
        </p>
      </div>

      {/* Open button */}
      <button
        onClick={() => onOpen(perf)}
        style={buttonStyle}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.3)")}
      >
        Open
      </button>
    </motion.div>
  );
}
