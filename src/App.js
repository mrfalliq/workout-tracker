
import React, { useState, useEffect } from "react";

const workoutPlan = {
  "Day 1 - Push": [
    { name: "Incline Dumbbell Press", sets: 4, reps: 10, link: "https://youtu.be/8iPEnn-ltC8" },
    { name: "Machine Chest Press", sets: 3, reps: 12, link: "https://youtu.be/1QL7kfQFZ_g" },
    { name: "Dumbbell Shoulder Press", sets: 4, reps: 10, link: "https://youtu.be/B-aVuyhvLHU" },
    { name: "Lateral Raises", sets: 4, reps: 15, link: "https://youtu.be/3VcKaXpzqRo" },
    { name: "Overhead Rope Triceps Extension", sets: 4, reps: 12, link: "https://youtu.be/vB5OHsJ3EME" },
    { name: "Pushups to failure", sets: 2, reps: "failure", link: "https://youtu.be/IODxDxX7oi4" }
  ],
  "Day 2 - Pull": [
    { name: "Lat Pulldown", sets: 4, reps: 10, link: "https://youtu.be/CAwf7n6Luuc" },
    { name: "Seated Row", sets: 3, reps: 12, link: "https://youtu.be/GZbfZ033f74" },
    { name: "Dumbbell Shrugs", sets: 3, reps: 15, link: "https://youtu.be/9efgcAjQe7E" },
    { name: "Face Pulls", sets: 4, reps: 15, link: "https://youtu.be/d_N3h6zCb9k" },
    { name: "Dumbbell Curls", sets: 4, reps: 12, link: "https://youtu.be/sAq_ocpRh_I" },
    { name: "Hanging Leg Raises", sets: 4, reps: 15, link: "https://youtu.be/I8Wc3f0UxzM" }
  ],
  "Day 3 - Legs": [
    { name: "Leg Press", sets: 4, reps: 12, link: "https://youtu.be/IZxyjW7MPJQ" },
    { name: "Bulgarian Split Squats", sets: 3, reps: 10, link: "https://youtu.be/2C-uNgKwPLE" },
    { name: "Hamstring Curls", sets: 4, reps: 15, link: "https://youtu.be/1Tq3QdYUuHs" },
    { name: "Calf Raises", sets: 4, reps: 20, link: "https://youtu.be/-M4-G8p8fmc" },
    { name: "Walking Lunges", sets: 2, reps: 20, link: "https://youtu.be/wrwwXE_x-pQ" }
  ],
  "Day 4 - Shoulders + Arms": [
    { name: "Arnold Press", sets: 4, reps: 12, link: "https://youtu.be/vj2w851ZHRM" },
    { name: "Cable Lateral Raises", sets: 4, reps: 15, link: "https://youtu.be/wZnsQOYk7-A" },
    { name: "Barbell Curls", sets: 4, reps: 12, link: "https://youtu.be/kwG2ipFRgfo" },
    { name: "Triceps Pushdowns", sets: 4, reps: 12, link: "https://youtu.be/2-LAMcpzODU" },
    { name: "Reverse Pec Deck", sets: 3, reps: 15, link: "https://youtu.be/8n2qU3b2kqI" },
    { name: "Incline DB Curl + Overhead Triceps", sets: 3, reps: 12, link: "https://youtu.be/w__GZ4BUb0k" }
  ],
  "Day 5 - Conditioning + Abs": [
    { name: "Incline Walk", sets: 1, reps: 15, link: "https://youtu.be/aiMZ5Mc-KJ8" },
    { name: "Battle Rope", sets: 4, reps: 30, link: "https://youtu.be/Ma5w5OC_8p8" },
    { name: "Sled Push", sets: 4, reps: 20, link: "https://youtu.be/b1gbtQJvXp8" },
    { name: "Cable Crunch", sets: 4, reps: 15, link: "https://youtu.be/CBgGqaDZ3ms" },
    { name: "Ab Rollouts", sets: 3, reps: 10, link: "https://youtu.be/5nEj8Zr2KfA" },
    { name: "Russian Twists", sets: 3, reps: 20, link: "https://youtu.be/wkD8rjkodUI" }
  ],
  "Day 6 - Rest": [],
  "Day 7 - Rest": []
};

const App = () => {
  const [view, setView] = useState("home");
  const [week, setWeek] = useState("Week 1");
  const [activeDay, setActiveDay] = useState(null);
  const [rest, setRest] = useState(60);
  const [restCountdown, setRestCountdown] = useState(null);
  const [sessionStart, setSessionStart] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [exerciseSets, setExerciseSets] = useState({});

  useEffect(() => {
    let timer;
    if (sessionStart) {
      timer = setInterval(() => {
        setSessionTime(Math.floor((Date.now() - sessionStart) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionStart]);

  useEffect(() => {
    if (restCountdown > 0) {
      const interval = setInterval(() => setRestCountdown(r => r - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [restCountdown]);

  const startSession = () => setSessionStart(Date.now());
  const stopRestTimer = () => setRestCountdown(0);
  const endSession = () => {
    const caloriesBurned = (sessionTime * 0.12).toFixed(2);
    alert(`Session duration: ${sessionTime}s\nCalories burned: ${caloriesBurned} kcal`);
    setSessionStart(null);
    setSessionTime(0);
  };

  const handleInputChange = (day, exName, index, field, value) => {
    const key = `${day}_${exName}`;
    const updated = [...(exerciseSets[key] || [])];
    updated[index] = { ...updated[index], [field]: value };

    const w = parseFloat(updated[index]?.weight);
    const r = parseFloat(updated[index]?.reps);
    if (!isNaN(w) && !isNaN(r)) {
      updated[index].estimated1RM = (w * (1 + r / 30)).toFixed(1);
      updated[index].nextWeight = (w + 2.5).toFixed(1);
    }

    setExerciseSets(prev => ({ ...prev, [key]: updated }));
  };

  const addSet = (day, exName) => {
    const key = `${day}_${exName}`;
    const current = [...(exerciseSets[key] || [])];
    setExerciseSets(prev => ({ ...prev, [key]: [...current, { weight: "", reps: "" }] }));
  };

  const removeSet = (day, exName) => {
    const key = `${day}_${exName}`;
    const current = [...(exerciseSets[key] || [])];
    current.pop();
    setExerciseSets(prev => ({ ...prev, [key]: current }));
  };

  const backgroundStyle = (img) => ({
    backgroundImage: `url(${process.env.PUBLIC_URL}/${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    padding: "2rem",
    color: "white"
  });

  const renderHome = () => (
    <div style={backgroundStyle("hero-2.png")}>
      <h1 style={{ fontSize: "2.5rem", color: "#f97316", textAlign: "center" }}>Put The Work In<br />Let's Do This!</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
        <button onClick={() => setView("workout")}>Start Workout</button>
        <button onClick={() => setView("analysis")}>View Analysis</button>
        <button onClick={() => setView("guide")}>Loading Guide</button>
      </div>
    </div>
  );

  const renderWorkout = () => (
    <div style={backgroundStyle("workout-bg.png")}>
      <h2>{week}</h2>
      <select value={week} onChange={(e) => setWeek(e.target.value)}>
        {[...Array(12)].map((_, i) => <option key={i}>Week {i + 1}</option>)}
      </select>
      <div style={{ margin: "1rem 0" }}>
        <label>Rest Timer:</label>
        <select onChange={e => setRest(+e.target.value)}>
          {[60, 90, 120, 180].map(sec => <option key={sec} value={sec}>{sec}s</option>)}
        </select>
        <button onClick={() => setRestCountdown(rest)}>Start Timer</button>
        <button onClick={stopRestTimer}>Stop Timer</button>
        <p>Rest Countdown: {restCountdown > 0 ? `${restCountdown}s` : "-"}</p>
      </div>
      <button onClick={startSession}>Start Session</button>
      <button onClick={endSession}>End Session</button>
      <p>Session Time: {sessionTime}s</p>

      {Object.entries(workoutPlan).map(([day, exercises]) => (
        <div key={day}>
          <h3 style={{ color: "#f97316", cursor: "pointer" }} onClick={() => setActiveDay(activeDay === day ? null : day)}>{day}</h3>
          {activeDay === day && (
            <div style={{ border: "1px solid #f97316", padding: "1rem" }}>
              {exercises.map((ex, i) => {
                const key = `${day}_${ex.name}`;
                const sets = exerciseSets[key] || [{ weight: "", reps: "" }];
                return (
                  <div key={i} style={{ marginBottom: "1rem", background: "#222", padding: "1rem", borderRadius: "0.5rem" }}>
                    <strong>{ex.name} ({ex.sets}x{ex.reps})</strong> <a href={ex.link} target="_blank" rel="noreferrer">🎥</a>
                    {sets.map((set, s) => (
                      <div key={s} style={{ marginTop: "0.5rem" }}>
                        <input
                          placeholder="Weight (kg)"
                          value={set.weight}
                          onChange={(e) => handleInputChange(day, ex.name, s, "weight", e.target.value)}
                          style={{ marginRight: "0.5rem" }}
                        />
                        <input
                          placeholder="Reps"
                          value={set.reps}
                          onChange={(e) => handleInputChange(day, ex.name, s, "reps", e.target.value)}
                        />
                        {set.estimated1RM && (
                          <span style={{ marginLeft: "1rem", fontSize: "0.9rem" }}>
                            1RM: {set.estimated1RM}kg | Next: {set.nextWeight}kg
                          </span>
                        )}
                      </div>
                    ))}
                    <div style={{ marginTop: "0.5rem" }}>
                      <button onClick={() => addSet(day, ex.name)}>➕ Add Set</button>
                      <button onClick={() => removeSet(day, ex.name)} style={{ marginLeft: "0.5rem" }}>➖ Remove Set</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
      <button onClick={() => setView("home")} style={{ marginTop: "2rem" }}>Back to Home</button>
    </div>
  );

  const renderAnalysis = () => (
    <div style={backgroundStyle("analysis-bg.png")}>
      <h2>Workout Analysis - {week}</h2>
      <p>Total Volume: --</p>
      <p>Top 1RM: --</p>
      <p>Best Lift: --</p>
      <button>Export to CSV</button>
      <button onClick={() => setView("home")} style={{ marginLeft: "1rem" }}>Back to Home</button>
    </div>
  );

  const renderGuide = () => (
    <div style={backgroundStyle("loading-guide.png")}>
      <h2>Progressive Loading Table (RIR-style)</h2>
      <table style={{ backgroundColor: "#000", color: "white", width: "100%" }}>
        <thead>
          <tr><th>Set</th><th>Effort Level</th><th>Weight Strategy</th></tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Easy (70%)</td><td>Warm-up pace</td></tr>
          <tr><td>2</td><td>Moderate (80–85%)</td><td>Controlled heavier</td></tr>
          <tr><td>3</td><td>Hard (90%)</td><td>Challenging strength</td></tr>
          <tr><td>4</td><td>Max Effort (95–100%)</td><td>Go close to failure</td></tr>
        </tbody>
      </table>
      <p><strong>Example:</strong> DB Shoulder Press (10 reps)</p>
      <ul>
        <li>Set 1: 14kg (easy)</li>
        <li>Set 2: 16kg (moderate)</li>
        <li>Set 3: 18kg (hard)</li>
        <li>Set 4: 20kg (max)</li>
      </ul>
      <p>This approach prevents injury, preserves form, and builds muscle effectively.</p>
      <button onClick={() => setView("home")}>Back to Home</button>
    </div>
  );

  return view === "home"
    ? renderHome()
    : view === "workout"
    ? renderWorkout()
    : view === "analysis"
    ? renderAnalysis()
    : view === "guide"
    ? renderGuide()
    : <p style={{ color: "white" }}>Not Found</p>;
};

export default App;