"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Utils/Navbar";
import { useSession, signIn } from "next-auth/react";
import PerformanceCard from "@/components/cards/PerformanceCard";
import { useRouter } from "next/navigation";

export default function Performances() {
  const { data: session, status } = useSession();
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState("25/26");
  const [columns, setColumns] = useState(4);

      const router = useRouter();
useEffect(() => {
      // If session is loading, do nothing
      if (status === "loading") return;
  
      // If no session, redirect
      if (!session) {
        router.push("/"); // Redirect to home or login page
      }
    }, [session, status, router]);

  // Modal state
  const [selectedPerf, setSelectedPerf] = useState(null);

  // Adjust columns based on window width
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 1024) setColumns(2);
      else setColumns(4);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Fetch performances
  useEffect(() => {
    if (!session) return;

    const fetchPerformances = async () => {
      try {
        const res = await fetch(`/api/performances/performances?season=${season}`);
        if (!res.ok) throw new Error("Failed to fetch performances");
        const data = await res.json();
        setPerformances(data);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformances();
  }, [session, season]);


   // Redirect if not logged in
    useEffect(() => {
      if (status === "loading") return;
      if (!session) {
        router.push("/");
      }
    }, [session, status, router]);
  

  const handleOpen = (perf) => setSelectedPerf(perf);
  const handleClose = () => setSelectedPerf(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#fff",
        paddingBottom: "40px",
      }}
    >
      <Navbar />

      <div
    style={{
      width: "75%",
      maxWidth:"900px",
      padding: "20px",
      position:"relative",
      margin:"0 auto", 
      borderRadius: "16px",
      background: "rgba(255,255,255,0.05)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
    }}
  >
        <h1
          style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}
        >
          Performances ({season})
        </h1>

        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.3)",
            backgroundColor: "rgba(0,0,0,0.4)",
            color: "#fff",
            marginBottom: "24px",
            cursor: "pointer",
          }}
        >
          <option value="24/25">24/25</option>
          <option value="25/26">25/26</option>
          <option value="26/27">26/27</option>
        </select>

        {session ? (
          <p>Loading performances...</p>
        ) : performances.length === 0 ? (
          <p>No performances found for {season}</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
              justifyItems: "center",
              gridAutoRows: "auto",
            }}
          >
            {performances.map((perf) => (
              <PerformanceCard
                key={perf._id}
                perf={perf}
                onOpen={() => handleOpen(perf)}
              />
            ))}
          </div>
        )}

       {selectedPerf && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "95%",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.85)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "20px",
      overflowY: "auto",
    }}
  >
    <div
      style={{
        width: "90%",
        maxWidth: "700px",
        borderRadius: "20px",
        padding: "24px",
        color: "#fff",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "auto auto auto auto auto",
        gap: "16px",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >
        &times;
      </button>

      {/* Minutes */}
      <div
        style={{
          background: "#AEC6CF",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        ⏱️
        <div
          style={{
            marginTop: 4,
            padding: "6px 12px",
            borderRadius: "5px",
            backgroundColor: "#87CEFA",
            fontWeight: "bold",
            fontSize: 20,
           
          }}
        >
          {selectedPerf.minutes ?? "-"} min
        </div>
        <span style={{ fontSize: 12, marginTop: 2 }}>Played</span>
      </div>

      {/* Rating */}
      <div
        style={{
          background: "#77DD77",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        ⭐
        <div
          style={{
            marginTop: 4,
            padding: "6px 12px",
            borderRadius: "5px",
            backgroundColor: "#32CD32",
            fontWeight: "bold",
            fontSize: 20,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          {selectedPerf.rating ?? "-"}
        </div>
        <span style={{ fontSize: 12, marginTop: 2 }}>Rating</span>
      </div>

      {/* Position */}
      <div
        style={{
          gridColumn: "span 2",
          background: "#FFD1DC",
          borderRadius: "12px",
          padding: "16px",
          fontSize: 18,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        }}
      >
        🧍 {selectedPerf.position ?? "-"}
        <span style={{ fontSize: 12, marginTop: 2 }}>Position</span>
      </div>

      {/* Did Well */}
      <div
        style={{
          gridColumn: "span 2",
          background: "#FFB347",
          borderRadius: "12px",
          padding: "16px",

          fontSize: 14,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        }}
      >
        <span style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          ✅ Did Well
        </span>
        {selectedPerf.didWell?.length ? (
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
            {selectedPerf.didWell.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        ) : (
          <span>-</span>
        )}
      </div>

      {/* Could Improve */}
      <div
        style={{
          gridColumn: "span 2",
          background: "#FF6961",
          borderRadius: "12px",
          padding: "16px",
          fontSize: 14,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        }}
      >
        <span style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          ⚠️ Could Improve
        </span>
        {selectedPerf.couldImprove?.length ? (
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
            {selectedPerf.couldImprove.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        ) : (
          <span>-</span>
        )}
      </div>

      {/* Video Placeholder */}
      <div
        style={{
          gridColumn: "span 2",
          background: "#888",
          borderRadius: "12px",
          padding: "16px",
          height: "120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          cursor: "pointer",
        }}
        onClick={() => alert("Video feature coming soon")}
      >
        <span style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>+</span>
        Add Video (Coming soon)
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
