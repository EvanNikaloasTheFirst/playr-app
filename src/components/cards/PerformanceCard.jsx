import React, { useState } from "react";

export default function PerformanceCard({ performance, isEditable = false, onChange, onDelete, onClick}) {
  const { minutes, rating, position, didWell, couldImprove, match, date } = performance;
  const [hover, setHover] = useState(false);

  const handleInputChange = (field, value, index = null) => {
    if (!onChange) return;
    if (field === "didWell" || field === "couldImprove") {
      const updated = [...performance[field]];
      updated[index] = value;
      onChange({ ...performance, [field]: updated });
    } else {
      onChange({ ...performance, [field]: value });
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 16,
        width: 300,
        padding: 16,
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        flexShrink: 0,
        border: "1px solid rgba(255,255,255,0.5)",
        position: "relative",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Delete Icon */}
     {hover && onDelete && (
  <div
    onClick={() => onDelete(performance.id)}
    style={{
      position: "absolute",
      top: 8,
      right: 8,
      cursor: "pointer",
      width: 28,
      height: 28,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      backgroundColor: "rgba(255, 0, 0, 0.1)",
      color: "red",
      fontWeight: "bold",
      fontSize: 16,
      transition: "all 0.2s ease",
    }}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255, 0, 0, 0.25)"}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255, 0, 0, 0.1)"}
    title="Delete"
  >
    ❌
  </div>
)}


      {/* Header: Match + Date */}
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 14, color: "#374151" }}>
        {isEditable ? (
          <>
            <input
              value={match}
              onChange={(e) => handleInputChange("match", e.target.value)}
              style={{ width: "60%", fontWeight: "bold", fontSize: 14, border: "1px solid #ccc", borderRadius: 6, padding: 4 }}
            />
            <input
              value={date}
              type="date"
              onChange={(e) => handleInputChange("date", e.target.value)}
              style={{ width: "35%", fontWeight: "bold", fontSize: 14, border: "1px solid #ccc", borderRadius: 6, padding: 4 }}
            />
          </>
        ) : (
          <>
            <div>{match}</div>
            <div>{date}</div>
          </>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, backgroundColor: "#e0f2fe", borderRadius: 12, padding: 12, textAlign: "center" }}>
          ⏱️
          {isEditable ? (
            <input
              type="number"
              value={minutes}
              onChange={(e) => handleInputChange("minutes", e.target.value)}
              style={{ fontWeight: "bold", fontSize: 18, width: "60%", textAlign: "center", border: "1px solid #ccc", borderRadius: 6 }}
            />
          ) : (
            <div style={{ fontWeight: "bold", fontSize: 18 }}>{minutes}'</div>
          )}
          <div style={{ fontSize: 12, color: "#374151" }}>Minutes</div>
        </div>
        <div style={{ flex: 1, backgroundColor: "#fff7ed", borderRadius: 12, padding: 12, textAlign: "center" }}>
          🏆
          {isEditable ? (
            <input
              type="number"
              step="0.1"
              value={rating}
              onChange={(e) => handleInputChange("rating", e.target.value)}
              style={{ fontWeight: "bold", fontSize: 18, width: "60%", textAlign: "center", border: "1px solid #ccc", borderRadius: 6 }}
            />
          ) : (
            <div style={{ fontWeight: "bold", fontSize: 18 }}>{rating}</div>
          )}
          <div style={{ fontSize: 12, color: "#374151" }}>Rating</div>
        </div>
      </div>

      {/* Position */}
      <div style={{ backgroundColor: "#f3f4f6", borderRadius: 12, padding: 12, textAlign: "center" }}>
        ⚽
        {isEditable ? (
          <input
            value={position}
            onChange={(e) => handleInputChange("position", e.target.value)}
            style={{ fontWeight: "bold", marginTop: 4, width: "80%", textAlign: "center", border: "1px solid #ccc", borderRadius: 6, padding: 4 }}
          />
        ) : (
          <div style={{ fontWeight: "bold", marginTop: 4 }}>{position}</div>
        )}
        <div style={{ fontSize: 12, color: "#6b7280" }}>Position</div>
      </div>

      {/* Did Well / Could Improve Sections */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, backgroundColor: "#d1fae5", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4, textAlign: "left" }}>✅ Did Well</div>
          <ul style={{ paddingLeft: 16, margin: 0, fontSize: 10, textAlign: "left" }}>
            {didWell.map((item, idx) => (
              <li key={idx}>
                {isEditable ? (
                  <input
                    value={item}
                    onChange={(e) => handleInputChange("didWell", e.target.value, idx)}
                    style={{ width: "90%", fontSize: 10, border: "1px solid #ccc", borderRadius: 4, padding: 2 }}
                  />
                ) : `→ ${item}`}
              </li>
              
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, backgroundColor: "#fee2e2", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4, textAlign: "left" }}>⚠️ Could Improve</div>
          <ul style={{ paddingLeft: 16, margin: 0, fontSize: 10, textAlign: "left" }}>
            {couldImprove.map((item, idx) => (
              <li key={idx}>
                {isEditable ? (
                  <input
                    value={item}
                    onChange={(e) => handleInputChange("couldImprove", e.target.value, idx)}
                    style={{ width: "90%", fontSize: 10, border: "1px solid #ccc", borderRadius: 4, padding: 2 }}
                  />
                ) : `→ ${item}`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
