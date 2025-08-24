"use client";
import PerformanceCard from "@/components/cards/PerformanceCard";
import Navbar from "@/components/Utils/Navbar";
import React, { useState, useEffect } from "react";

// Positions
const positions = {
  Goalkeeper: ["Goalkeeper"],
  Defender: ["Left Back", "Right Back", "Center Back", "Left Wing Back", "Right Wing Back"],
  Midfielder: ["Defensive Midfielder", "Attacking Midfielder", "Right Winger", "Left Winger", "Center Attacking Midfielder"],
  Forward: ["Striker", "Center Forward"],
};

export default function Dashboard() {
  const [performances, setPerformances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expandedPerformance, setExpandedPerformance] = useState(null);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    match: "", date: "", mainPosition: "Goalkeeper", subPosition: "Goalkeeper",
    minutes: "", rating: "", matchOverview: "", didWell: ["", "", ""], couldImprove: ["", "", ""]
  });

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/performances`, { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch performances");
        const data = await response.json();
        setPerformances(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPerformances();
  }, []);

  const handleChange = (e, index, type) => {
    const { name, value } = e.target;
    if (type === "didWell" || type === "couldImprove") {
      const arr = [...formData[type]];
      arr[index] = value;
      setFormData(prev => ({ ...prev, [type]: arr }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === "mainPosition") setFormData(prev => ({ ...prev, subPosition: positions[value][0] }));
    }
  };

  const handleSave = async () => {
    const newPerf = {
      match: formData.match,
      date: formData.date,
      position: `${formData.mainPosition} - ${formData.subPosition}`,
      minutes: Number(formData.minutes),
      rating: Number(formData.rating),
      matchOverview: formData.matchOverview,
      didWell: formData.didWell,
      couldImprove: formData.couldImprove
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/performances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPerf),
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to save performance");
      const savedPerf = await response.json();
      setPerformances(prev => [...prev, savedPerf]);
      setFormData({ match: "", date: "", mainPosition: "Goalkeeper", subPosition: "Goalkeeper", minutes: "", rating: "", matchOverview: "", didWell: ["", "", ""], couldImprove: ["", "", ""] });
      setShowModal(false);
      setStep(0);
    } catch (error) {
      console.error("Error saving performance:", error);
      alert("Failed to save performance. Please try again.");
    }
  };

  const glassInputStyle = {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    color: "#1e3a8a",
    outline: "none",
    width: "100%"
  };

  const totalMinutes = performances.reduce((sum, p) => sum + (p.minutes || 0), 0);
  const averageRating = performances.length ? (performances.reduce((sum, p) => sum + (p.rating || 0), 0) / performances.length).toFixed(2) : 0;
  const totalGoals = performances.reduce((sum, p) => sum + (p.goals || 0), 0);
  const totalAssists = performances.reduce((sum, p) => sum + (p.assists || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #1e3a8a, #0d9488)", fontFamily: "Arial, sans-serif", padding: 16 }}>
      <Navbar />
      <h1 style={{ color: "#fff", fontSize: 28, textAlign: 'center', margin: '20px 0' }}>Performance Dashboard</h1>

      {/* Stats */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "stretch",
        backgroundColor: "rgba(255,255,255,0.25)", backdropFilter: "blur(12px)",
        borderRadius: 20, padding: "20px 32px", margin: "16px auto", maxWidth: 600,
        gap: 24, color: "#fff", fontWeight: "bold", border: "1px solid rgba(255,255,255,0.3)"
      }}>
        {[
          { icon: "⏱️", label: "Total Minutes", value: totalMinutes },
          { icon: "🏆", label: "Average Rating", value: averageRating },
          { icon: "⚽", label: "Goals", value: totalGoals },
          { icon: "🎯", label: "Assists", value: totalAssists },
        ].map((stat, idx) => (
          <div key={idx} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: 16, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(12px)", boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            border: "1px solid rgba(255,255,255,0.3)", textAlign: "center", height: "120px"
          }}>
            <span style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</span>
            <span style={{ fontSize: 14, marginBottom: 4 }}>{stat.label}</span>
            <span style={{ fontSize: 20 }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Performance Cards */}
      <div style={{ maxWidth: 960, margin: "24px auto", textAlign: "center" }}>
        <div style={{
          display: "flex", gap: 16, overflowX: "auto", padding: "16px 8px",
          WebkitOverflowScrolling: "touch", width: "100%", flex: 1,
          backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)"
        }}>
          {performances.map((perf) => (
            <PerformanceCard
              key={perf.id}
              performance={perf}
              onClick={() => setExpandedPerformance(perf)}
              onDelete={async (id) => {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/performances/${id}`, { method: "DELETE", credentials: "include" });
                setPerformances(prev => prev.filter(p => p.id !== id));
              }}
            />
          ))}
        </div>

        <button onClick={() => setShowModal(true)} style={{
          marginTop: 16, backgroundColor: "rgba(255, 255, 255,0.7)", backdropFilter: "blur(12px)",
          borderRadius: 16, width: 300, padding: 16, boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          fontWeight: "bold", color: "#1e3a8a"
        }}>+ Add Performance</button>
      </div>

      {/* Multi-step Form Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: 16
        }}>
          <div style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,245,245,0.85))",
            padding: 24, borderRadius: 20, maxWidth: 600, width: "100%",
            display: "flex", flexDirection: "column", gap: 24, color: "#1e3a8a",
            boxShadow: "0 12px 40px rgba(0,0,0,0.3)"
          }}>

            {/* Step 1: Match Info */}
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <h2 style={{ fontWeight: "bold", fontSize: 22 }}>Match Details</h2>
                <input placeholder="Enter the match name, e.g., Liverpool vs Chelsea" name="match" value={formData.match} onChange={handleChange} style={glassInputStyle} />
                <input type="date" name="date" value={formData.date} onChange={handleChange} style={glassInputStyle} />
                <select name="mainPosition" value={formData.mainPosition} onChange={handleChange} style={glassInputStyle}>
                  {Object.keys(positions).map(pos => <option key={pos} value={pos}>{pos}</option>)}
                </select>
                <select name="subPosition" value={formData.subPosition} onChange={handleChange} style={glassInputStyle}>
                  {positions[formData.mainPosition].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
                <div style={{ display: "flex", gap: 12 }}>
                  <input type="number" name="minutes" placeholder="Minutes played, e.g., 90" value={formData.minutes} onChange={handleChange} style={{ ...glassInputStyle, flex: 1 }} />
                  <input type="number" name="rating" placeholder="Performance rating, e.g., 7.5" value={formData.rating} onChange={handleChange} style={{ ...glassInputStyle, flex: 1 }} />
                </div>
                <textarea placeholder="Brief match overview: key events, performance highlights" name="matchOverview" value={formData.matchOverview} onChange={handleChange} style={{ ...glassInputStyle, resize: "vertical", minHeight: 80 }} />
              </div>
            )}

            {/* Step 2: Did Well */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <h2 style={{ fontWeight: "bold", fontSize: 22 }}>What went well?</h2>
                {formData.didWell.map((_, idx) => (
                  <input key={idx} type="text" placeholder={`Positive action #${idx + 1}, e.g., Good passing accuracy`} value={formData.didWell[idx]} onChange={(e) => handleChange(e, idx, "didWell")} style={glassInputStyle} />
                ))}
              </div>
            )}

            {/* Step 3: Could Improve */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <h2 style={{ fontWeight: "bold", fontSize: 22 }}>Areas to improve</h2>
                {formData.couldImprove.map((_, idx) => (
                  <input key={idx} type="text" placeholder={`Improvement point #${idx + 1}, e.g., Defensive positioning`} value={formData.couldImprove[idx]} onChange={(e) => handleChange(e, idx, "couldImprove")} style={glassInputStyle} />
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              {step > 0 && <button onClick={() => setStep(prev => prev - 1)} style={{ padding: "10px 20px", borderRadius: 12, border: "none", backgroundColor: "#ccc", color: "#1e3a8a", fontWeight: "bold" }}>Back</button>}
              {step < 2 && <button onClick={() => setStep(prev => prev + 1)} style={{ padding: "10px 20px", borderRadius: 12, border: "none", backgroundColor: "#2563EB", color: "#fff", fontWeight: "bold" }}>Next</button>}
              {step === 2 && <button onClick={handleSave} style={{ padding: "10px 20px", borderRadius: 12, border: "none", backgroundColor: "#16A34A", color: "#fff", fontWeight: "bold" }}>Save</button>}
            </div>

            <button onClick={() => { setShowModal(false); setStep(0); }} style={{ alignSelf: "center", marginTop: 8, padding: "10px 20px", borderRadius: 12, border: "none", backgroundColor: "#F87171", color: "#fff", fontWeight: "bold" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Expanded Performance Modal */}
      {expandedPerformance && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: 16
        }}>
          <div style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,245,245,0.85))",
            padding: 24, borderRadius: 20, maxWidth: 600, width: "100%",
            display: "flex", flexDirection: "column", gap: 24, color: "#1e3a8a",
            boxShadow: "0 12px 40px rgba(0,0,0,0.3)"
          }}>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontWeight: "bold", fontSize: 24, marginBottom: 4 }}>{expandedPerformance.match}</h2>
              <p style={{ fontSize: 14, color: "#555" }}>{expandedPerformance.date} | {expandedPerformance.position}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ backgroundColor: "#3a82f622", borderRadius: 16, padding: 16, flex: 1, minWidth: 120, textAlign: "center" }}>
                <span style={{ fontSize: 20, fontWeight: "bold" }}>⏱️</span>
                <div style={{ fontSize: 12, marginTop: 4 }}>Minutes Played</div>
                <div style={{ fontSize: 16, fontWeight: "bold" }}>{expandedPerformance.minutes}</div>
              </div>
              <div style={{ backgroundColor: "#f59e0b22", borderRadius: 16, padding: 16, flex: 1, minWidth: 120, textAlign: "center" }}>
                <span style={{ fontSize: 20, fontWeight: "bold" }}>🏆</span>
                <div style={{ fontSize: 12, marginTop: 4 }}>Rating</div>
                <div style={{ fontSize: 16, fontWeight: "bold" }}>{expandedPerformance.rating}</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ backgroundColor: "#3a82f6", color: "#fff", borderRadius: 16, padding: 20 }}>
                <strong>✅ Did Well</strong>
                <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.8 }}>
                  {expandedPerformance.didWell.map((item, idx) => <li key={idx}>→ {item}</li>)}
                </ul>
              </div>
              <div style={{ backgroundColor: "#f59e0b", color: "#fff", borderRadius: 16, padding: 20 }}>
                <strong>⚠️ Could Improve</strong>
                <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.8 }}>
                  {expandedPerformance.couldImprove.map((item, idx) => <li key={idx}>→ {item}</li>)}
                </ul>
              </div>
              <div style={{ backgroundColor: "#e5e7eb", borderRadius: 16, padding: 16 }}>
                <strong>📝 Match Overview</strong>
                <p style={{ marginTop: 8 }}>{expandedPerformance.matchOverview}</p>
              </div>
            </div>

            <button onClick={() => setExpandedPerformance(null)} style={{
              alignSelf: "center", marginTop: 8, padding: "12px 24px", borderRadius: 12,
              border: "none", backgroundColor: "#2563EB", color: "#fff", fontWeight: "bold"
            }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
