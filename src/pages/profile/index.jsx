"use client";
import Navbar from "@/components/Utils/Navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [goals, setGoals] = useState([]); // array of goals
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [performances, setPerformances] = useState([]);
  const [trainings, setTrainings] = useState([]);

  // Random colors for stats
  const colors = [
    "linear-gradient(135deg, #ff7eb3, #ff758c)",
    "linear-gradient(135deg, #6a11cb, #2575fc)",
    "linear-gradient(135deg, #f7971e, #ffd200)",
    "linear-gradient(135deg, #11998e, #38ef7d)",
    "linear-gradient(135deg, #fc5c7d, #6a82fb)",
    "linear-gradient(135deg, #00c6ff, #0072ff)",
  ];
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  // Redirect if session is invalid
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch profile info
  useEffect(() => {
    if (!session) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profiles/profiles");
        if (res.ok) {
          const data = await res.json();
          setBio(data?.bio || "");
          setGoals(Array.isArray(data?.goals) ? data.goals : data?.goals ? [data.goals] : []);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [session]);

  // Fetch performances + trainings
  useEffect(() => {
    if (!session) return;
    const fetchData = async () => {
      try {
        const [perfRes, trainRes] = await Promise.all([
          fetch(`/api/performances/performances?userId=${encodeURIComponent(session.user.email)}`),
          fetch(`/api/trainings/trainings?userId=${encodeURIComponent(session.user.email)}`),
        ]);
        if (perfRes.ok) setPerformances(await perfRes.json());
        if (trainRes.ok) setTrainings(await trainRes.json());
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchData();
  }, [session]);

  // Save profile
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profiles/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, goals }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      alert("✅ Profile updated!");
      setEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("❌ Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  // Stats
  const totalMatches = performances.length;
  const totalMinutes = performances.reduce((sum, p) => sum + (p.minutes || 0), 0);
  const avgMatchRating = useMemo(() => {
    if (!performances.length) return "N/A";
    const sum = performances.reduce((acc, p) => acc + (Number(p.rating) || 0), 0);
    return (sum / performances.length).toFixed(2);
  }, [performances]);

  const totalTrainings = trainings.length;
  const avgTrainingRating = useMemo(() => {
    if (!trainings.length) return "N/A";
    const sum = trainings.reduce((acc, t) => acc + (Number(t.trainingRating) || 0), 0);
    return (sum / trainings.length).toFixed(2);
  }, [trainings]);

  // Manage goals editing
  const addGoal = () => setGoals([...goals, ""]);
  const updateGoal = (i, value) => {
    const updated = [...goals];
    updated[i] = value;
    setGoals(updated);
  };
  const removeGoal = (i) => setGoals(goals.filter((_, idx) => idx !== i));

  if (status === "loading" || loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", color: "#fff", fontFamily: "sans-serif" }}>
      <Navbar />

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.05)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
        }}
      >
        {/* User Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src={session.user.image || "/default-avatar.png"}
            alt="Profile"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              border: "3px solid #fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          />
          <div>
            <h2 style={{ fontSize: "1.8rem" }}>{session.user.name || "Anonymous Player"}</h2>
            <p style={{ opacity: 0.8 }}>{session.user.email}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ marginTop: "40px" }}>
          <h3 style={{ fontSize: "1.4rem" }}>Career Stats</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {[
              { label: "Total Matches", value: totalMatches },
              { label: "Total Minutes", value: totalMinutes },
              { label: "Avg Match Rating", value: avgMatchRating },
              { label: "Total Trainings", value: totalTrainings },
              { label: "Avg Training Rating", value: avgTrainingRating },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: "20px",
                  borderRadius: "14px",
                  background: getRandomColor(),
                  textAlign: "center",
                  color: "#fff",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.3)";
                }}
              >
                <h4 style={{ marginBottom: "10px", fontWeight: "600" }}>{stat.label}</h4>
                <p style={{ fontSize: "1.6rem", fontWeight: "bold" }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bio / Goals */}
        <div style={{ marginTop: "40px" }}>
          <h3 style={{ fontSize: "1.4rem" }}>About Me</h3>
          {editing ? (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write something about yourself..."
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(0,0,0,0.4)",
                  color: "#fff",
                  marginBottom: "20px",
                }}
              />
              <h3 style={{ fontSize: "1.4rem" }}>My Goals</h3>
              {goals.map((g, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <input
                    value={g}
                    onChange={(e) => updateGoal(i, e.target.value)}
                    placeholder={`Goal ${i + 1}`}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(0,0,0,0.3)",
                      color: "#fff",
                    }}
                  />
                  <button
                    onClick={() => removeGoal(i)}
                    style={{
                      background: "#e63946",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      padding: "0 12px",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={addGoal}
                style={{
                  padding: "8px 16px",
                  marginBottom: "20px",
                  background: "#28a745",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                ➕ Add Goal
              </button>
              <br />
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "12px 24px",
                  background: saving ? "gray" : "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: saving ? "not-allowed" : "pointer",
                  marginRight: "12px",
                }}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: "12px 24px",
                  background: "#444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p style={{ marginBottom: "20px", opacity: 0.9, whiteSpace: "pre-line" }}>
                {bio || "No bio yet…"}
              </p>
              <h3 style={{ fontSize: "1.4rem" }}>My Goals</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
                {goals.length ? (
                  goals.map((g, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(6px)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      }}
                    >
                      {g}
                    </div>
                  ))
                ) : (
                  <p style={{ opacity: 0.7 }}>No goals set yet…</p>
                )}
              </div>
              <button
                onClick={() => setEditing(true)}
                style={{
                  padding: "12px 24px",
                  background: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
