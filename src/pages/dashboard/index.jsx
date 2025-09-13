"use client";
import Navbar from "@/components/Utils/Navbar";
import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardBox from "@/components/dashboardComponents/dashboardBox";

// Positions
const positions = {
  Goalkeeper: ["Goalkeeper"],
  Defender: ["Left Back", "Right Back", "Center Back", "Left Wing Back", "Right Wing Back"],
  Midfielder: ["Defensive Midfielder", "Attacking Midfielder", "Right Winger", "Left Winger", "Center Attacking Midfielder"],
  Forward: ["Striker", "Center Forward"],
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [performances, setPerformances] = useState([]);
  const [lastPerformance, setLastPerformance] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [trainingTypes, setTrainingTypes] = useState(["1-1", "Gym", "Team Training"])

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "match" | "training"
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    match: "",
    date: "",
    mainPosition: "Goalkeeper",
    subPosition: "Goalkeeper",
    minutes: "",
    rating: "",
    matchOverview: "",
    didWell: ["", "", ""],
    couldImprove: ["", "", ""],
    trainingDate: "",
    trainingRating: "",
    trainingDuration: "",
    trainingSummary: "",
    trainingType: "Gym",
  });

  

  // Redirect if not logged in
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch trainings
  useEffect(() => {
    if (!session) return;
    const fetchTrainings = async () => {
      try {
        const res = await fetch(`/api/trainings/trainings?userId=${encodeURIComponent(session.user.email)}`);
        if (!res.ok) throw new Error("Failed to fetch trainings");
        const data = await res.json();
        setTrainings(data);
      } catch (err) {
        console.error("Error fetching trainings:", err);
      }
    };
    fetchTrainings();
  }, [session]);

  // Sort trainings
  const sortedTrainings = useMemo(() => {
    if (!trainings || trainings.length === 0) return [];
    return [...trainings].sort((a, b) => new Date(b.trainingDate) - new Date(a.trainingDate));
  }, [trainings]);

  // Last 3 trainings
  const recentTrainings = useMemo(() => sortedTrainings.slice(0, 3), [sortedTrainings]);

  // Current rating (avg of last 3)
  const currentRating = useMemo(() => {
    if (recentTrainings.length === 0) return "N/A";
    const sum = recentTrainings.reduce((acc, t) => acc + (Number(t.trainingRating) || 0), 0);
    return Math.round(sum / recentTrainings.length);
  }, [recentTrainings]);

  const getCircleColor = (rating) => {
    if (rating > 7) return "#006400"; // dark green
    if (rating > 6) return "#90EE90"; // light green
    return "#FF4C4C"; // red
  };

  // Fetch performances
  useEffect(() => {
    if (!session) return;
    const fetchPerformances = async () => {
      try {
        const res = await fetch(`/api/performances/performances?userId=${encodeURIComponent(session.user.email)}`);
        if (!res.ok) throw new Error("Failed to fetch performances");
        const data = await res.json();
        setPerformances(data);
      } catch (err) {
        console.error("Error fetching performances:", err);
      }
    };
    fetchPerformances();
  }, [session]);

  // Fetch last performance
  useEffect(() => {
    if (!session) return;
    const fetchLastPerformance = async () => {
      try {
        const res = await fetch(`/api/performances/performances?userId=${encodeURIComponent(session.user.email)}&recent=true`);
        if (!res.ok) throw new Error("Failed to fetch last performance");
        const data = await res.json();
        setLastPerformance(data[0]);
      } catch (err) {
        console.error("Error fetching last performance:", err);
      }
    };
    fetchLastPerformance();
  }, [session]);

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Early return AFTER hooks
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Redirecting...</div>;
  const totalMinutes = performances.reduce((sum, p) => sum + (p.minutes || 0), 0);
  const averageRating = performances.length ? (performances.reduce((sum, p) => sum + (p.rating || 0), 0) / performances.length).toFixed(2) : 0;
  const totalGoals = performances.reduce((sum, p) => sum + (p.goals || 0), 0);
  const totalAssists = performances.reduce((sum, p) => sum + (p.assists || 0), 0);
    const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 500px)",
    gridTemplateRows: isMobile ? "auto" : "auto auto",
    gap: "34px",
    justifyItems: "center",
    margin: "0 auto",
    width: isMobile ? "90%" : "max-content",
    position:"relative",

  };


  // Handle changes for both regular fields and array fields
const handleChange = (e, index = null, field = null) => {
  const { name, value, type } = e.target;

  if (field && index !== null) {
    // For array fields like didWell or couldImprove
    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  } else {
    // For regular fields
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }
};
const glassInputStyle = {
  width: "85%",
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.25)",
  background: "rgba(255, 255, 255, 0.05)",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Safari support
  transition: "all 0.2s ease",
};

const handleSaveTraining = async () => {
  if (!formData.trainingDate || !formData.trainingRating || !formData.trainingDuration) {
    alert("Please fill in all required fields!");
    return;
  }

  try {
    const res = await fetch("/api/trainings/trainings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed to save training");

    const savedTraining = await res.json();

    // Update local state
    setTrainings((prev) => [savedTraining, ...prev]);

    // Reset modal
    setShowModal(false);
    setStep(0);
    setModalType(null);

    // Reset formData fields related to training
    setFormData((prev) => ({
      ...prev,
      trainingDate: "",
      trainingRating: "",
      trainingDuration: "",
      trainingSummary: "",
      trainingType: "Gym",
    }));
  } catch (err) {
    console.error(err);
    alert("Error saving training session");
  }
};


return (

  
    <div style={{ minHeight: "100vh",  fontFamily: "Arial, sans-serif", padding: 16 }}>
      <Navbar />


<div style={gridStyle}>
  {/* Row 1, Column 1: Last Performance */}
  <div style={{ width: "100%", textAlign: "center" }}>
    <h2 style={{ color: "#fff", marginBottom: 8 }}>Last Performance</h2>
    <DashboardBox color="lightblue">
      <div
        style={{
          width: "90%",
          height: "85%",
          borderRadius: "20px",
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "auto auto auto",
          gap: "16px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Row 1: Minutes & Rating */}
        <div
          style={{
            background: "#AEC6CF",
            borderRadius: "12px",
            padding: "16px",
            fontWeight: "bold",
            fontSize: 32,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#FFF",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          ⏱️
          <span style={{ fontSize: 20, marginTop: 4 }}>{lastPerformance?.minutes ?? "-"} min</span>
          <span style={{ fontSize: 12, marginTop: 2 }}>Played</span>
        </div>

        <div
          style={{
            background: "#77DD77",
            borderRadius: "12px",
            padding: "16px",
            fontWeight: "bold",
            fontSize: 32,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#FFF",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          ⭐
          <span style={{ fontSize: 20, marginTop: 4 }}>{lastPerformance?.rating ?? "-"}</span>
          <span style={{ fontSize: 12, marginTop: 2 }}>Rating</span>
        </div>

        {/* Row 2: Position */}
        <div
          style={{
            gridColumn: "span 2",
            background: "#FFD1DC",
            borderRadius: "12px",
            padding: "16px",
            fontWeight: "bold",
            fontSize: 18,
            display: "flex",
            flexDirection: "column",
             color:"#FFF",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          }}
        >
          🧍 {lastPerformance?.position ?? "-"}
          <span style={{ fontSize: 12, marginTop: 2, color:"#FFF"}}>Position</span>
        </div>

        {/* Row 3: Did Well */}
        <div
          style={{
            gridColumn: "span 2",
            background: "#FFB347",
            borderRadius: "12px",
            padding: "16px",
            fontWeight: "bold",
            fontSize: 14,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color:"#FFF",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>✅ Did Well</span>
          {lastPerformance?.didWell?.length ? (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                alignItems: "center",
                fontSize: 14,
              }}
            >
              {lastPerformance.didWell.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          ) : (
            <span>-</span>
          )}
        </div>
      </div>
    </DashboardBox>
  </div>

  {/* Row 1, Column 2 */}
  <div style={{ width: "100%", textAlign: "center" }}>
    <h3 style={{ color: "#fff", marginBottom: 8 }}>Training Form</h3>
    <DashboardBox color="lightgreen">
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
      {/* Main big circle */}
      <div
        style={{
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          border: `20px solid ${getCircleColor(currentRating)}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "48px",
          fontWeight: "bold",
          color: "#FFF",
          backgroundColor: "#1a1a1a",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {currentRating}
      </div>

      {/* Previous sessions */}
      <div style={{ display: "flex", gap: "16px" }}>
        {recentTrainings.length > 0
          ? recentTrainings.map((training, idx) => (
              <div
                key={training._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {/* Circle with rating */}
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: `10px solid ${getCircleColor(training.trainingRating)}`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#FFF",
                    backgroundColor: "#1a1a1a",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                  }}
                >
                  {training.trainingRating}
                </div>

                {/* Date */}
                <span style={{ fontSize: "14px", color: "#FFF", width:"75%"}}>
                  {new Date(training.trainingDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>
            ))
          : ["N/A"].map((v, idx) => (
              <div
                key={idx}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  border: `10px solid #888`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#FFF",
                  backgroundColor: "#1a1a1a",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                }}
              >
                N/A
              </div>
            ))}
      </div>
    </div>
    </DashboardBox>
  </div>

  {/* Row 1, Column 3 */}
 {/* Column layout for last 3 performances with opponent */}
<div style={{ width: "100%", textAlign: "center" }}>
  <h3 style={{ color: "#fff", marginBottom: 8 }}>Last 3 Performances</h3>
  <DashboardBox color="lightcoral">
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        padding: "16px",
      }}
    >
      {performances.slice(-3).map((p, idx) => {
        const getTileColor = (rating) => {
          if (rating > 7) return "#006400"; // dark green
          if (rating > 6) return "#90EE90"; // light green
          return "#FF4C4C"; // red
        };
        

        // Save training session



        return (
<div
  key={idx}
  style={{
    width: "90%", // fit nicely inside parent
    minHeight: "80px",
    backgroundColor: "rgba(255, 255, 255, 0.1)", // semi-transparent for glass effect
    borderRadius: "16px",
    padding: "12px 16px",
    color: "#fff",
    display: "flex",
    flexDirection: "row", // row layout
    justifyContent: "space-between", // space out items evenly
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255, 255, 255, 0.3)", // light border
    backdropFilter: "blur(6px)", // glassy blur effect
    WebkitBackdropFilter: "blur(6px)", // Safari support
  }}
>
  <span style={{ fontSize: "15px", fontWeight: "bold" }}>{p.match ?? "Opponent"}</span>
  <span style={{ fontSize: "16px", fontWeight: "bold" }}>⭐ {p.rating}</span>
  <span style={{ fontSize: "16px" }}>⏱️ {p.minutes + "'" ?? 0} </span>
  <span style={{ fontSize: "14px" }}>🧍 {p.position ?? "-"}</span>
</div>


        );
      })}
      {performances.length === 0 && <span style={{ color: "#fff" }}>No data</span>}
    </div>
  </DashboardBox>
</div>


  {/* Row 2, Column 1 */}
  <div style={{ width: "100%", textAlign: "center" }}>
    <h3 style={{ color: "#fff", marginBottom: 8 }}>Season 2025/26</h3>
    <DashboardBox color="lightpink">
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "auto auto",
        gap: "16px",
        width: "90%",
        height: "85%",
      }}
    >
      {/* Total Minutes */}
      <div
        style={{
          background: "#AEC6CF",
          borderRadius: "12px",
          padding: "16px",
          fontWeight: "bold",
          fontSize: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFF",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        ⏱️
        <span style={{ fontSize: 18, marginTop: 4 }}>{totalMinutes} min</span>
        <span style={{ fontSize: 12, marginTop: 2 }}>Played</span>
      </div>

      {/* Average Rating */}
      <div
        style={{
          background: "#77DD77",
          borderRadius: "12px",
          padding: "16px",
          fontWeight: "bold",
          fontSize: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFF",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        ⭐
        <span style={{ fontSize: 18, marginTop: 4 }}>{averageRating}</span>
        <span style={{ fontSize: 12, marginTop: 2 }}>Avg Rating</span>
      </div>

      {/* Total Goals */}
      <div
        style={{
          background: "#FFD1DC",
          borderRadius: "12px",
          padding: "16px",
          fontWeight: "bold",
          fontSize: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFF",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        ⚽
        <span style={{ fontSize: 18, marginTop: 4 }}>{totalGoals}</span>
        <span style={{ fontSize: 12, marginTop: 2 }}>Goals</span>
      </div>

      {/* Total Assists */}
      <div
        style={{
          background: "#FFB347",
          borderRadius: "12px",
          padding: "16px",
          fontWeight: "bold",
          fontSize: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFF",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        🅰️
        <span style={{ fontSize: 18, marginTop: 4 }}>{totalAssists}</span>
        <span style={{ fontSize: 12, marginTop: 2 }}>Assists</span>
      </div>
    </div>
  </DashboardBox>
  </div>

{/* Row 2, Column 2 */}
<div style={{ width: "100%", textAlign: "center" }}>
  <h3 style={{ color: "#fff", marginBottom: 8 }}>Add Performance</h3>
  <DashboardBox color="lightsalmon">
    <div
      style={{
        width: "90%",
        height: "85%",
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        textAlign: "center",
      }}
    >
      {/* Icon with strong border */}
      <div
        style={{
          fontSize: "48px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          border: "4px solid #fff", // ✅ strong white border
          transition: "all 0.2s ease",
        }}
      >
        ➕
      </div>

      {/* Text */}
      <p style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
        Add a new match performance
      </p>

      {/* Button */}
      <button
        onClick={() => setModalType('match')}
        style={{
          padding: "12px 24px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "#2563EB",
          color: "#fff",
          fontWeight: "bold",
          fontSize: 14,
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
      >
        Add Performance
      </button>
    </div>
  </DashboardBox>
</div>

{/* Row 2, Column 3 */}
<div style={{ width: "100%", textAlign: "center" }}>
  <h3 style={{ color: "#fff", marginBottom: 8 }}>Add Training</h3>
  <DashboardBox color="lightseagreen">
    <div
      style={{
        width: "90%",
        height: "85%",
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        textAlign: "center",
      }}
    >
      {/* Icon with strong border */}
      <div
        style={{
          fontSize: "48px",
          background: "rgba(255,255,255,0.2)",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          border: "4px solid #fff", // Strong border
          transition: "all 0.2s ease",
        }}
      >
        🏋️
      </div>

      {/* Text */}
      <p style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
        Add a new training session
      </p>

      {/* Button */}
      <button
        onClick={() => setModalType('training')}
        style={{
          padding: "12px 24px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "#10B981",
          color: "#fff",
          fontWeight: "bold",
          fontSize: 14,
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10B981")}
      >
        Add Training
      </button>
    </div>
  </DashboardBox>
</div>

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
{modalType === "match" && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: 16
        }}>
          <div style={{
            background: "linear-gradient(145deg, #514949ff, #2d2d2d)",
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
    padding: 16, 
    borderRadius: 12, 
    backgroundColor:"#2d2d2d",
    color: "#fff"  // ✅ make all text inside white
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
    <textarea placeholder="Brief match overview: key events, performance highlights" name="matchOverview" value={formData.matchOverview} onChange={handleChange} style={{ ...glassInputStyle, resize: "none", minHeight: 80, width:"75%"}} />
  </div>
)}

{/* Step 2: Did Well */}
{step === 1 && (
  <div style={{ 
    display: "flex", 
    flexDirection: "column", 
    gap: 12, 

    padding: 16, 
    borderRadius: 12, 
    color: "#fff"
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
    padding: 16, 
    borderRadius: 12, 
    color: "#fff"
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

<button onClick={() => { setShowModal(false); setStep(0); setModalType(null); }}
  style={{ alignSelf: "center", marginTop: 6, padding: "8px 16px", borderRadius: 10,
           border: "none", backgroundColor: "#F87171", color: "#fff",
           fontWeight: "bold", fontSize: 12 }}>
  Cancel
</button>
     
    </div>
        </div>
      )}

      
{modalType === "training" && (
<div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: 16,
  }}
>
  <div
    style={{
      background: "linear-gradient(145deg, #514949ff, #2d2d2d)",
      padding: 20,
      borderRadius: 16,
      maxWidth: 600,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 20,
      color: "#1e3a8a",
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      fontSize: 13,
    }}
  >
    {/* Step 1: Training Info */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#2d2d2d",
        color: "#fff",
      }}
    >
      <h2 style={{ fontWeight: "bold", fontSize: 18 }}>Training Details</h2>
      <input
        type="date"
        name="trainingDate"
        value={formData.trainingDate}
        onChange={handleChange}
        style={glassInputStyle}
      />
      <input
        type="time"
        name="trainingDuration"
        value={formData.trainingDuration}
        onChange={handleChange}
        style={glassInputStyle}
      />
      <input
        type="number"
        name="trainingRating"
        placeholder="Rating ?/10"
        value={formData.trainingRating}
        onChange={handleChange}
        style={glassInputStyle}
        min="1"
        max="10"
      />
      <select
        name="trainingType"
        value={formData.trainingType}
        onChange={handleChange}
        style={glassInputStyle}
      >
        {trainingTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Training summary: drills, exercises, focus areas"
        name="trainingSummary"
        value={formData.trainingSummary}
        onChange={handleChange}
        style={{ ...glassInputStyle, resize: "none", minHeight: 80 }}
      />
    </div>

    {/* Buttons */}
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
      <button
        onClick={handleSaveTraining}
        style={{
          padding: "8px 16px",
          borderRadius: 10,
          border: "none",
          backgroundColor: "#16A34A",
          color: "#fff",
          fontWeight: "bold",
          fontSize: 12,
        }}
      >
        Save
      </button>
    </div>

    {/* Cancel button */}
    <button
      onClick={() => {
        setShowModal(false);
        setStep(0);
        setModalType(null);
      }}
      style={{
        alignSelf: "center",
        marginTop: 6,
        padding: "8px 16px",
        borderRadius: 10,
        border: "none",
        backgroundColor: "#F87171",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
      }}
    >
      Cancel
    </button>
  </div>
</div>

)}




    </div>
  );
}
