"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export default function TrainingCard({ training, onOpen }) {
  // Random card background color
  const bgColor = useMemo(() => {
    const r = Math.floor(Math.random() * 200) + 30;
    const g = Math.floor(Math.random() * 200) + 30;
    const b = Math.floor(Math.random() * 200) + 30;
    return `rgb(${r},${g},${b})`;
  }, []);

  const smallBlockStyle = (color) => ({
    backgroundColor: color,
    borderRadius: "8px",
    padding: "10px",
    color: "#fff",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
    fontSize: "14px",
  });

  const valueStyle = {
    display: "inline-block",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "5px",
    padding: "2px 6px",
    fontWeight: "bold",
    marginLeft: "6px",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      style={{
        width: "280px",
        minHeight: "220px",
        borderRadius: "20px",
        backgroundColor: bgColor,
        boxShadow: "0 6px 25px rgba(0,0,0,0.3)",
        padding: "16px",
        color: "#fff",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "auto auto auto",
        gap: "12px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Row 1: Type & Date */}
      <div
        style={{
          gridColumn: "span 2",
          backgroundColor: "rgba(0,0,0,0.25)",
          borderRadius: "12px",
          padding: "12px",
          fontWeight: "bold",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {training.trainingType} - {training.trainingDate}
      </div>

      {/* Row 2: Duration & Rating */}
      <div style={smallBlockStyle("#77DD77")}>
        ⏱️ Duration: {training.trainingDuration}
      </div>
      <div style={smallBlockStyle("#FFD700")}>
        ⭐ Rating: {training.trainingRating}
      </div>

      {/* Row 3: Season */}
      <div
        style={{
          gridColumn: "span 2",
          backgroundColor: "#FF6F61",
          borderRadius: "12px",
          padding: "12px",
          fontWeight: "bold",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        Season: {training.season}
      </div>

      {/* Row 4: Summary */}
      <div
        style={{
          gridColumn: "span 2",
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: "12px",
          padding: "12px",
          fontSize: "14px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        {training.trainingSummary || "No summary provided."}
      </div>

      {/* Open button */}
      <button
        onClick={() => onOpen(training)}
        style={{
          gridColumn: "span 2",
          marginTop: "8px",
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
        }}
      >
        Open
      </button>
    </motion.div>
  );
}
