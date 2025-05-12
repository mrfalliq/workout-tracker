import React, { useState, useEffect } from "react";

const backgroundStyle = (imageFile) => ({
  backgroundImage: `url(${process.env.PUBLIC_URL}/${imageFile})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  color: "white",
  padding: "2rem"
});

const workoutPlan = {
  "Day 1 - Push": [
    "Incline Dumbbell Press 4x10",
    "Machine Chest Press 3x12",
    "Dumbbell Shoulder Press 4x10",
    "Lateral Raises 4x15",
    "Overhead Rope Triceps Extension 4x12",
    "Pushups to failure x2"
  ],
  "Day 2 - Pull": [
    "Lat Pulldown 4x10",
    "Seated Row 3x12",
    "Dumbbell Shrugs 3x15",
    "Face Pulls 4x15",
    "Dumbbell Curls 4x12",
    "Hanging Leg Raises 4x15"
  ],
  "Day 3 - Legs": [
    "Leg Press 4x12",
    "Bulgarian Split Squats 3x10/leg",
    "Hamstring Curls 4x15",
    "Calf Raises 4x20",
    "Walking Lunges 2x20 steps"
  ],
  "Day 4 - Shoulders + Arms": [
    "Arnold Press 4x12",
    "Cable Lateral Raises 4x15",
    "Barbell Curls 4x12",
    "Triceps Pushdowns 4x12",
    "Reverse Pec Deck 3x15",
    "Incline DB Curl + Overhead Triceps superset 3x12"
  ],
  "Day 5 - Conditioning + Abs": [
    "Incline Walk 15 mins",
    "Battle Rope 30s x4",
    "Sled Push 20m x4",
    "Cable Crunch 4x15",
    "Ab Rollouts 3x10",
    "Russian Twists 3x20"
  ]
};

export default function App() {
  const [view, setView] = useState("home");
  const [week, setWeek] = useState("Week 1");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [restTime, setRestTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [sets, setSets] = useState({});

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleAddSet = (exercise) => {
    setSets((prev) => {
      const updated = { ...prev };
      if (!updated[exercise]) updated[exercise] = [];
      updated[exercise] = [...updated[exercise], { weight: "", reps: "" }];
      return updated;
    });
  };

  const handleRemoveSet = (exercise) => {
    setSets((prev) => {
      const updated = { ...prev };
      if (updated[exercise] && updated[exercise].length > 0) {
        updated[exercise] = updated[exercise].slice(0, -1);
      }
      return updated;
    });
  };

  const calculate1RM = (weight, reps) => {
    const w = parseFloat(weight);
    const r = parseFloat(reps);
    if (!isNaN(w) && !isNaN(r) && r > 0) {
      const est = Math.round(w * (1 + r / 30));
      return {
        estimated1RM: est,
        nextWeight: Math.round(w + 2.5)
      };
    }
    return { estimated1RM: "-", nextWeight: "-" };
  };

  const exportToCSV = () => {
    const lines = ["Exercise,Set,Weight,Reps,Estimated 1RM,Next Weight"];
    Object.entries(sets).forEach(([exercise, data]) => {
      data.forEach((set, index) => {
        const { estimated1RM, nextWeight } = calculate1RM(set.weight, set.reps);
        lines.push(`${exercise},${index + 1},${set.weight},${set.reps},${estimated1RM},${nextWeight}`);
      });
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workout_analysis.csv";
    a.click();
  };

  if (view === "home") {
    return (
      <div style={backgroundStyle("hero.png")}> 
        <h1 style={{ fontSize: "2.5rem", color: "#f97316", textAlign: "center" }}>
          Put The Work In <br /> Let's Do This!
        </h1>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", gap: "1rem" }}>
          <button onClick={() => setView("workout")}>Start Workout</button>
          <button onClick={() => setView("analysis")}>View Analysis</button>
          <button onClick={() => setView("guide")}>Loading Guide</button>
        </div>
      </div>
    );
  }

  if (view === "workout") {
    return (
      <div style={backgroundStyle("workout-bg.png")}> 
        <h2 style={{ color: "#f97316" }}>Workout Plan</h2>
        <label htmlFor="weekSelect">Select Week:</label>
        <select id="weekSelect" value={week} onChange={(e) => setWeek(e.target.value)}>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={`Week ${i + 1}`}>{`Week ${i + 1}`}</option>
          ))}
        </select>

        <div style={{ marginBottom: "1rem" }}>
          <button onClick={() => setStartTime(Date.now())}>Start Session</button>
          <button onClick={() => setEndTime(Date.now())}>End Session</button>
          {startTime && endTime && (
            <p>Session Duration: {Math.round((endTime - startTime) / 60000)} minutes</p>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          Rest Timer:
          <select value={restTime} onChange={(e) => setRestTime(parseInt(e.target.value))}>
            {[60, 90, 120, 180].map((time) => (
              <option key={time} value={time}>{time} seconds</option>
            ))}
          </select>
          <button onClick={() => {
            setTimeLeft(restTime);
            setTimerActive(true);
          }}>Start Rest</button>
          {timeLeft > 0 && <span style={{ marginLeft: "1rem" }}>Rest Time Left: {timeLeft}s</span>}
        </div>

        {Object.entries(workoutPlan).map(([day, exercises]) => (
          <details key={day}>
            <summary style={{ color: "#f97316", fontSize: "1.5rem" }}>{day}</summary>
            {exercises.map((ex, i) => (
              <div key={i} style={{ backgroundColor: "#222", padding: "1rem", margin: "1rem 0", borderRadius: "0.5rem" }}>
                <strong>{ex}</strong>
                <div style={{ margin: "0.5rem 0" }}>
                  <button onClick={() => handleAddSet(ex)}>+ Add Set</button>
                  <button onClick={() => handleRemoveSet(ex)} style={{ marginLeft: "1rem" }}>- Remove Set</button>
                </div>
                {(sets[ex] || []).map((set, index) => {
                  const { estimated1RM, nextWeight } = calculate1RM(set.weight, set.reps);
                  return (
                    <div key={index} style={{ marginBottom: "0.5rem" }}>
                      <input placeholder="Weight (kg)" value={set.weight} onChange={(e) => {
                        const updated = [...sets[ex]];
                        updated[index].weight = e.target.value;
                        setSets((prev) => ({ ...prev, [ex]: updated }));
                      }} />
                      <input placeholder="Reps" value={set.reps} onChange={(e) => {
                        const updated = [...sets[ex]];
                        updated[index].reps = e.target.value;
                        setSets((prev) => ({ ...prev, [ex]: updated }));
                      }} />
                      <span style={{ marginLeft: "1rem" }}>1RM: {estimated1RM} | Next: {nextWeight}kg</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </details>
        ))}

        <button onClick={() => setView("home")} style={{ marginTop: "2rem" }}>Back to Home</button>
      </div>
    );
  }

  if (view === "analysis") {
    return (
      <div style={backgroundStyle("analysis-bg.png")}>
        <h2 style={{ fontSize: "2rem" }}>Workout Analysis</h2>
        <p>Total Volume: 0.00 kg</p>
        <p>Top Estimated 1RM: 0.00 kg</p>
        <p>Best Lift: -</p>
        <button onClick={exportToCSV}>Download CSV</button>
        <button onClick={() => setView("home")} style={{ marginTop: "2rem", marginLeft: "1rem" }}>
          Back to Home
        </button>
      </div>
    );
  }

  if (view === "guide") {
    return (
      <div style={backgroundStyle("loading-guide.png")}>
        <h2>Progressive Loading Table (RIR-style)</h2>
        <table style={{ width: '100%', marginTop: '1rem', backgroundColor: '#222', color: 'white', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Set</th><th>Effort Level</th><th>Weight Strategy</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Easy (70%)</td><td>Lightest weight – warm-up pace, prep muscles</td></tr>
            <tr><td>2</td><td>Moderate (80–85%)</td><td>Slightly heavier – still controlled</td></tr>
            <tr><td>3</td><td>Hard (90%)</td><td>Heavier again – challenge your strength</td></tr>
            <tr><td>4</td><td>Max Effort (95–100%)</td><td>Heaviest you can go for 10 reps or close to failure</td></tr>
          </tbody>
        </table>
        <div style={{ marginTop: '2rem' }}>
          <p><strong>Example:</strong> Dumbbell Shoulder Press (Target 10 reps)</p>
          <ul>
            <li>Set 1: 14kg (easy)</li>
            <li>Set 2: 16kg (moderate)</li>
            <li>Set 3: 18kg (hard)</li>
            <li>Set 4: 20kg (go close to failure)</li>
          </ul>
        </div>
        <button onClick={() => setView("home")} style={{ marginTop: "2rem" }}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#111', color: 'white' }}>
      <h2>View "{view}" not recognized.</h2>
      <button onClick={() => setView("home")}>Back to Home</button>
    </div>
  );
}