"use client";
import React, { useState } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function PerformanceHistory({ performances }) {
  const [hoveredPerf, setHoveredPerf] = useState(null);

  const getColor = (rating) => {
    if (rating >= 8) return "#006400"; // Dark Green
    if (rating >= 7) return "#32CD32"; // Light Green
    if (rating >= 6.5) return "#FFD700"; // Yellow
    return "#DC2626"; // Red
  };

  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  // Map performances by date for faster lookup
  const perfMap = Object.fromEntries(
    performances.map(p => [new Date(p.date).toDateString(), p])
  );

  // Build weeks
  const weeks = [];
  let currentWeek = [];
  for (let i = 0; i < 365; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);

    const perf = perfMap[day.toDateString()] || null;
    currentWeek.push(perf);

    if (day.getDay() === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length) weeks.push(currentWeek);

  return (
    <div style={{ marginTop: 32, textAlign: "center", position: "relative" }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        Performance History
      </h2>

      {/* Month labels */}
      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 8 }}>
        {months.map(m => (
          <span key={m} style={{ color: "#fff", fontSize: 12 }}>{m}</span>
        ))}
      </div>

      {/* Grid container */}
      <div style={{ display: "inline-block" }}>
        <div style={{ display: "flex", gap: 2 }}>
          {weeks.map((week, wIdx) => (
            <div key={wIdx} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {week.map((perf, dIdx) =>
                perf && (
                  <div
                    key={dIdx}
                    onMouseEnter={() => setHoveredPerf(perf)}
                    onMouseLeave={() => setHoveredPerf(null)}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      backgroundColor: getColor(perf.rating),
                      cursor: "pointer",
                    }}
                    title={`${perf.match} | Rating: ${perf.rating}`}
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredPerf && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "#1e3a8a",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 12,
            maxWidth: 220,
            zIndex: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        >
          <strong>{hoveredPerf.match}</strong>
          <div>Date: {new Date(hoveredPerf.date).toLocaleDateString()}</div>
          <div>Position: {hoveredPerf.position}</div>
          <div>Minutes: {hoveredPerf.minutes}</div>
          <div>Rating: {hoveredPerf.rating}</div>
          <div>✅ Did Well: {hoveredPerf.didWell.join(", ")}</div>
          <div>⚠️ Could Improve: {hoveredPerf.couldImprove.join(", ")}</div>
        </div>
      )}
    </div>
  );
}
