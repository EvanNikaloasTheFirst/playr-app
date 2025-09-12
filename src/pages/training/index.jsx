"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Utils/Navbar";
import { useSession, signIn } from "next-auth/react";
import TrainingCard from "@/components/cards/TrainingCard";

export default function Training() {
  const { data: session, status } = useSession();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState("25/26");
  const [columns, setColumns] = useState(4);
  const [selectedTraining, setSelectedTraining] = useState(null);

  // Responsive columns
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

  // Fetch trainings
  useEffect(() => {
    if (!session) return;

    const fetchTrainings = async () => {
      console.log(season)
      try {
        const res = await fetch(`/api/trainings/trainings?season=${season}`);
        if (!res.ok) throw new Error("Failed to fetch trainings");
        const data = await res.json();
        setTrainings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainings();
  }, [session, season]);

  if (status === "loading") return <div>Loading session...</div>;
  if (!session)
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Navbar />
        <p>You must be signed in to view trainings.</p>
        <button
          style={{
            backgroundColor: "#3b82f6",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            marginTop: "12px",
          }}
          onClick={() => signIn()}
        >
          Sign In
        </button>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", color: "#fff", paddingBottom: "40px" }}>
      <Navbar />
      <div style={{ padding: "24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
          Trainings ({season})
        </h1>

        {/* Season filter */}
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

        {loading ? (
          <p>Loading trainings...</p>
        ) : trainings.length === 0 ? (
          <p>No trainings found for {season}</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(260px, 1fr))`,
              gap: "20px",
              justifyItems: "center",
              gridAutoRows: "auto",
            }}
          >
            {trainings.map((t) => (
              <TrainingCard key={t._id} training={t} onOpen={setSelectedTraining} />
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedTraining && (
          <div
            onClick={() => setSelectedTraining(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "90%",
                maxWidth: "700px",
                backgroundColor: "#222",
                borderRadius: "20px",
                padding: "20px",
                color: "#fff",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "auto auto auto",
                gap: "16px",
              }}
            >
              {/* Duration */}
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
                <span style={{ fontSize: 20, marginTop: 4 }}>
                  {selectedTraining.trainingDuration}
                </span>
                <span style={{ fontSize: 12, marginTop: 2 }}>Duration</span>
              </div>

              {/* Rating */}
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
                <span style={{ fontSize: 20, marginTop: 4 }}>
                  {selectedTraining.trainingRating}
                </span>
                <span style={{ fontSize: 12, marginTop: 2 }}>Rating</span>
              </div>

              {/* Training Type */}
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
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              >
                🏋️ {selectedTraining.trainingType}
              </div>

              {/* Summary */}
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
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              >
                <span style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
                  📝 Summary
                </span>
                <p>{selectedTraining.trainingSummary || "-"}</p>
              </div>

              {/* Video Placeholder */}
              <div
                style={{
                  gridColumn: "span 2",
                  background: "#6A5ACD",
                  borderRadius: "12px",
                  padding: "16px",
                  fontWeight: "bold",
                  fontSize: 24,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
                onClick={() => alert("Coming soon")}
              >
                + Add Video
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
