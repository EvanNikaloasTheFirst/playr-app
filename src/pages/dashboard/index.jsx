"use client";
import PerformanceCard from "@/components/cards/PerformanceCard";
import Navbar from "@/components/Utils/Navbar";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
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

 const { data: session } = useSession();


useEffect(() => {
  if (!session) return;

  const fetchPerformances = async () => {
    try {
      // ✅ log session email first
      console.log("Current user email:", session?.user?.email);

      const response = await fetch("/api/performances/performances?recent=true");

      // log status
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to fetch performances: ${errText}`);
      }

      const data = await response.json();
      console.log("Fetched performances:", data);
      setPerformances(data);
    } catch (err) {
      console.error("Error fetching performances:", err);
    }
  };

  fetchPerformances();
}, [session]);



 const handleChange = (e, idx, field) => {
  const { name, value } = e.target;

  if (name === "minutes") {
    const minutes = Number(value);
    if (minutes < 1 || minutes > 130) return;
  }

  if (name === "rating") {
    const rating = Number(value);
    if (rating < 1 || rating > 10) return;
  }

  if (idx !== undefined && field) {
    setFormData(prev => {
      const updated = [...prev[field]];
      updated[idx] = value;
      return { ...prev, [field]: updated };
    });
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
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
    couldImprove: formData.couldImprove,
  };

  try {
    const response = await fetch("/api/performances/performances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPerf),
    });

    if (!response.ok) throw new Error("Failed to save performance");

    const savedPerf = await response.json();

    // ✅ append new one to state
    setPerformances((prev) => [...prev, savedPerf]);

    // ✅ reset form
    setFormData({
      match: "",
      date: "",
      mainPosition: "Goalkeeper",
      subPosition: "Goalkeeper",
      minutes: "",
      rating: "",
      matchOverview: "",
      didWell: ["", "", ""],
      couldImprove: ["", "", ""],
    });

    setShowModal(false);
    setStep(0);
  } catch (error) {
    console.error("Error saving performance:", error);
    alert("Failed to save performance. Please try again.");
  }
};


  const glassInputStyle = {
    padding: 10,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    color: "#1e3a8a",
    outline: "none",
    width: "90%",
    fontSize: 13,
  };

  const totalMinutes = performances.reduce((sum, p) => sum + (p.minutes || 0), 0);
  const averageRating = performances.length ? (performances.reduce((sum, p) => sum + (p.rating || 0), 0) / performances.length).toFixed(2) : 0;
  const totalGoals = performances.reduce((sum, p) => sum + (p.goals || 0), 0);
  const totalAssists = performances.reduce((sum, p) => sum + (p.assists || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #1e3a8a, #0d9488)", fontFamily: "Arial, sans-serif", padding: 16 }}>
      <Navbar />

      {/* Performance Cards */}
      <div style={{ margin: "0 auto", textAlign: "center", padding: "20px" }}>
         <h2 style={
          {color:"white"}
         }>Recent Performances</h2>

         
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: 12,
      flexWrap: "wrap",
      padding: "12px",
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: 12,
      boxShadow: "inset 0 0 8px rgba(0,0,0,0.1)",
      maxWidth: "1200px",
      margin: "0 auto",
    }}
  >

   
    {performances.map((perf) => (
      <PerformanceCard
        key={perf._id} // use _id from Mongo
        performance={perf}
        onClick={() => setExpandedPerformance(perf)}
        onDelete={async () => {
  try {
    const id = perf._id.toString(); // ensure string
    const res = await fetch(`/api/performances/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete performance");

    setPerformances(prev => prev.filter(p => p._id !== perf._id));
  } catch (err) {
    console.error("Error deleting performance:", err);
  }
}}

      />
    ))}
  </div>


        <button onClick={() => setShowModal(true)} style={{
          marginTop: 12, backgroundColor: "rgba(255, 255, 255,0.7)", backdropFilter: "blur(12px)",
          borderRadius: 12, width: 260, padding: 12, boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
          fontWeight: "bold", color: "#1e3a8a", fontSize: 14
        }}>+ Add Performance</button>
      </div>

      {/* Smaller placeholders globally */}
      <style>
      {`
        input::placeholder,
        textarea::placeholder {
          font-size: 11px;
          opacity: 0.7;
        }
      `}
      </style>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: 16
        }}>
          <div style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,245,245,0.85))",
            padding: 20, borderRadius: 16, maxWidth: 600, width: "100%",
            display: "flex", flexDirection: "column", gap: 20, color: "#1e3a8a",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)", fontSize: 13
          }}>

{/* Step 1: Match Info */}
{step === 0 && (
  <div style={{ 
    display: "flex", 
    flexDirection: "column", 
    gap: 12, 
    background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,245,245,0.85))", 
    padding: 16, 
    borderRadius: 12, 
    color: "#1E293C"  // ✅ make all text inside white
  }}>
    <h2 style={{ fontWeight: "bold", fontSize: 18 }}>Match Details</h2>
    <input placeholder="Enter the match name, e.g., Liverpool vs Chelsea" name="match" value={formData.match} onChange={handleChange} style={glassInputStyle} />
    <input type="date" name="date" value={formData.date} onChange={handleChange} style={glassInputStyle} />
    <select name="mainPosition" value={formData.mainPosition} onChange={handleChange} style={glassInputStyle}>
      {Object.keys(positions).map(pos => <option key={pos} value={pos}>{pos}</option>)}
    </select>
    <select name="subPosition" value={formData.subPosition} onChange={handleChange} style={glassInputStyle}>
      {positions[formData.mainPosition].map(sub => <option key={sub} value={sub}>{sub}</option>)}
    </select>
    <div style={{ display: "flex", gap: 12 }}>
      <input 
        type="number" 
        name="minutes" 
        placeholder="Minutes played, e.g., 90" 
        value={formData.minutes} 
        onChange={handleChange} 
        style={{ ...glassInputStyle, flex: 1 }} 
        min="1" max="130"
      />
      <input 
        type="number" 
        name="rating" 
        placeholder="Performance rating, e.g., 7.5" 
        value={formData.rating} 
        onChange={handleChange} 
        style={{ ...glassInputStyle, flex: 1 }} 
        min="1" max="10"
      />
    </div>
    <textarea placeholder="Brief match overview: key events, performance highlights" name="matchOverview" value={formData.matchOverview} onChange={handleChange} style={{ ...glassInputStyle, resize: "none", minHeight: 80 }} />
  </div>
)}

{/* Step 2: Did Well */}
{step === 1 && (
  <div style={{ 
    display: "flex", 
    flexDirection: "column", 
    gap: 12, 
    background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,245,245,0.85))", 
    padding: 16, 
    borderRadius: 12, 
    color: "#1E293C"
  }}>
    <h2 style={{ fontWeight: "bold", fontSize: 18 }}>What went well?</h2>
    {formData.didWell.map((_, idx) => (
      <input key={idx} type="text" placeholder={`Positive action #${idx + 1}, e.g., Good passing accuracy`} value={formData.didWell[idx]} onChange={(e) => handleChange(e, idx, "didWell")} style={glassInputStyle} />
    ))}
  </div>
)}

{/* Step 3: Could Improve */}
{step === 2 && (
  <div style={{ 
    display: "flex", 
    flexDirection: "column", 
    gap: 12, 
    background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,245,245,0.85))", 
    padding: 16, 
    borderRadius: 12, 
    color: "#1E293C"
  }}>
    <h2 style={{ fontWeight: "bold", fontSize: 18 }}>Areas to improve</h2>
    {formData.couldImprove.map((_, idx) => (
      <input key={idx} type="text" placeholder={`Improvement point #${idx + 1}, e.g., Defensive positioning`} value={formData.couldImprove[idx]} onChange={(e) => handleChange(e, idx, "couldImprove")} style={glassInputStyle} />
    ))}
  </div>
)}

            

            {/* Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              {step > 0 && <button onClick={() => setStep(prev => prev - 1)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", backgroundColor: "#ccc", color: "#1e3a8a", fontWeight: "bold", fontSize: 12 }}>Back</button>}
              {step < 2 && <button onClick={() => setStep(prev => prev + 1)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", backgroundColor: "#2563EB", color: "#fff", fontWeight: "bold", fontSize: 12 }}>Next</button>}
              {step === 2 && <button onClick={handleSave} style={{ padding: "8px 16px", borderRadius: 10, border: "none", backgroundColor: "#16A34A", color: "#fff", fontWeight: "bold", fontSize: 12 }}>Save</button>}
            </div>

            <button onClick={() => { setShowModal(false); setStep(0); }} style={{ alignSelf: "center", marginTop: 6, padding: "8px 16px", borderRadius: 10, border: "none", backgroundColor: "#F87171", color: "#fff", fontWeight: "bold", fontSize: 12 }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
