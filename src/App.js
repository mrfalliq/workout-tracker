// ✅ FULL 285+ LINE VERSION WITH SESSION TIMER + REST TIMER + ALL VIEWS
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
  "Day 1 - Push": ["Incline Dumbbell Press 4x10", "Machine Chest Press 3x12", "Dumbbell Shoulder Press 4x10", "Lateral Raises 4x15", "Overhead Rope Triceps Extension 4x12", "Pushups to failure x2"],
  "Day 2 - Pull": ["Lat Pulldown 4x10", "Seated Row 3x12", "Dumbbell Shrugs 3x15", "Face Pulls 4x15", "Dumbbell Curls 4x12", "Hanging Leg Raises 4x15"],
  "Day 3 - Legs": ["Leg Press 4x12", "Bulgarian Split Squats 3x10/leg", "Hamstring Curls 4x15", "Calf Raises 4x20", "Walking Lunges 2x20 steps"],
  "Day 4 - Shoulders + Arms": ["Arnold Press 4x12", "Cable Lateral Raises 4x15", "Barbell Curls 4x12", "Triceps Pushdowns 4x12", "Reverse Pec Deck 3x15", "Incline DB Curl + Overhead Triceps superset 3x12"],
  "Day 5 - Conditioning + Abs": ["Incline Walk 15 mins", "Battle Rope 30s x4", "Sled Push 20m x4", "Cable Crunch 4x15", "Ab Rollouts 3x10", "Russian Twists 3x20"]
};

const dayToMET = {
  "Day 1 - Push": 5.5,
  "Day 2 - Pull": 5.5,
  "Day 3 - Legs": 6.0,
  "Day 4 - Shoulders + Arms": 5.0,
  "Day 5 - Conditioning + Abs": 7.0
};

export default function App() {
  const [view, setView] = useState("home");
  const [week, setWeek] = useState("Week 1");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [restTime, setRestTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [sets, setSets] = useState({});
  const [caloriesByDay, setCaloriesByDay] = useState({});
  const [activeDay, setActiveDay] = useState(null);
  const weight = 93;

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    let sessionInterval;
    if (startTime && !endTime) {
      sessionInterval = setInterval(() => {
        const now = Date.now();
        setSessionDuration(Math.floor((now - startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(sessionInterval);
    }
    return () => clearInterval(sessionInterval);
  }, [startTime, endTime]);

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

  const handleStartSession = (day) => {
    setActiveDay(day);
    setStartTime(Date.now());
    setEndTime(null);
    setSessionDuration(0);
  };

  const handleEndSession = () => {
    const end = Date.now();
    setEndTime(end);
    if (startTime && activeDay) {
      const durationMin = (end - startTime) / 60000;
      const MET = dayToMET[activeDay] || 5.0;
      const calories = ((MET * weight * 3.5) / 200) * durationMin;
      setCaloriesByDay((prev) => ({
        ...prev,
        [activeDay]: (prev[activeDay] || 0) + Math.round(calories)
      }));
    }
  };

  if (view === "home") {
    return (
      <div style={backgroundStyle("hero-2.png")}> 
        <h1 style={{ fontSize: "2.5rem", color: "#f97316", textAlign: "center" }}>Put The Work In<br />Let's Do This!</h1>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", gap: "1rem" }}>
          <button onClick={() => setView("workout")}>Start Workout</button>
          <button onClick={() => setView("analysis")}>View Analysis</button>
          <button onClick={() => setView("guide")}>Loading Guide</button>
        </div>
        {startTime && !endTime && (
          <p style={{ textAlign: "center", marginTop: "1rem" }}><strong>Session Time:</strong> {Math.floor(sessionDuration / 60)}m {sessionDuration % 60}s</p>
        )}
      </div>
    );
  }

  if (view === "guide") {
    return (
      <div style={backgroundStyle("loading-guide.png")}> 
        <h2 style={{ fontSize: "2rem", color: "#f97316" }}>Progressive Loading Table</h2>
        <table style={{ width: '100%', backgroundColor: '#222', color: 'white', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>Set</th><th>Effort Level</th><th>Weight Strategy</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Easy (70%)</td><td>Lightest weight – warm-up pace</td></tr>
            <tr><td>2</td><td>Moderate (80–85%)</td><td>Still controlled</td></tr>
            <tr><td>3</td><td>Hard (90%)</td><td>Challenge your strength</td></tr>
            <tr><td>4</td><td>Max Effort (95–100%)</td><td>Go close to failure</td></tr>
          </tbody>
        </table>
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ color: '#f97316' }}>Example: Dumbbell Shoulder Press (Target 10 reps)</h3>
          <ul>
            <li>Set 1: 14kg (easy)</li>
            <li>Set 2: 16kg (moderate)</li>
            <li>Set 3: 18kg (hard)</li>
            <li>Set 4: 20kg (go close to failure — maybe only get 9–10 reps)</li>
          </ul>
          <p style={{ marginTop: '1rem' }}>
            <strong>This approach:</strong>
          </p>
          <ul>
            <li>Minimizes injury risk</li>
            <li>Preserves form early on</li>
            <li>Still delivers enough intensity for hypertrophy and muscle retention, especially during a cut</li>
          </ul>
        </div>
        <button onClick={() => setView("home")} style={{ marginTop: '2rem' }}>Back to Home</button>
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

        <div style={{ margin: "1rem 0" }}>
          Rest Timer:
          <select value={restTime} onChange={(e) => setRestTime(parseInt(e.target.value))}>
            {[60, 90, 120, 180].map((sec) => (
              <option key={sec} value={sec}>{sec} seconds</option>
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
            <button onClick={() => handleStartSession(day)}>Start Session</button>
            <button onClick={handleEndSession} style={{ marginLeft: "1rem" }}>End Session</button>
            {startTime && activeDay === day && !endTime && <p><strong>Session Time:</strong> {Math.floor(sessionDuration / 60)}m {sessionDuration % 60}s</p>}
            {caloriesByDay[day] && <p>Calories Burned: {caloriesByDay[day]} kcal</p>}
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
    const totalCalories = Object.values(caloriesByDay).reduce((a, b) => a + b, 0);
    return (
      <div style={backgroundStyle("analysis-bg.png")}> 
        <h2 style={{ fontSize: "2rem" }}>Workout Analysis</h2>
        <p><strong>Total Calories Burned:</strong> {totalCalories} kcal</p>
        {Object.entries(caloriesByDay).map(([day, cals]) => (
          <p key={day}>{day}: {cals} kcal</p>
        ))}
        <button onClick={exportToCSV}>Download CSV</button>
        <button onClick={() => setView("home")} style={{ marginTop: "2rem", marginLeft: "1rem" }}>Back to Home</button>
      </div>
    );
  }

  return <div style={{ padding: '2rem', backgroundColor: '#111', color: 'white' }}><h2>Invalid view.</h2></div>;
}