"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export default function PerformanceCard({ perf, onOpen }) {
  // Generate a random solid background color
  const bgColor = useMemo(() => {
    const r = Math.floor(Math.random() * 200) + 30; // 30-230
    const g = Math.floor(Math.random() * 200) + 30;
    const b = Math.floor(Math.random() * 200) + 30;
    return `rgb(${r},${g},${b})`;
  }, []);

  const cardStyle = {
    width: "260px",
    minHeight: "180px",
    borderRadius: "20px",
    backgroundColor: bgColor,
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    padding: "20px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "all 0.3s ease",
  };

  const headingStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  const textStyle = {
    fontSize: "14px",
    margin: "2px 0",
  };

  const valueStyle = {
    display: "inline-block",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "5px",
    padding: "2px 6px",
    fontWeight: "bold",
    marginLeft: "6px",
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
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      style={cardStyle}
    >
      <div>
        <h2 style={headingStyle}>{perf.match}</h2>
        <p style={textStyle}>
          Season: <span style={{ fontWeight: "bold" }}>{perf.season}</span>
        </p>
        <p style={textStyle}>Position: {perf.position}</p>
        <p style={textStyle}>
          Minutes: <span style={valueStyle}>{perf.minutes}</span>
        </p>
        <p style={textStyle}>
          Rating: <span style={valueStyle}>{perf.rating}</span>
        </p>
      </div>

      <button
        onClick={() => onOpen(perf)}
        style={buttonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.3)")
        }
      >
        Open
      </button>
    </motion.div>
  );
}
