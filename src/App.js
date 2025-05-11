// Full working App.js with Week 1–12 dropdown, timer, session tracking, and all views
import React, { useState, useEffect } from "react";

const workoutPlan = {
  "Day 1 - Push": ["Incline Dumbbell Press", "Machine Chest Press", "Dumbbell Shoulder Press", "Lateral Raises", "Overhead Rope Triceps Extension", "Pushups (to failure)"],
  "Day 2 - Pull": ["Lat Pulldown", "Seated Row", "Dumbbell Shrugs", "Face Pulls", "Dumbbell Curls", "Hanging Leg Raises"],
  "Day 3 - Legs": ["Leg Press", "Bulgarian Split Squat", "Hamstring Curls", "Calf Raises", "Walking Lunges"],
  "Day 4 - Shoulders + Arms": ["Arnold Press", "Cable Lateral Raises", "Barbell Curls", "Triceps Pushdowns", "Reverse Pec Deck", "Incline DB Curl + Overhead Triceps (superset)"],
  "Day 5 - Conditioning + Abs": ["Incline Walk (15 mins)", "Battle Rope", "Sled Push", "Cable Crunch", "Ab Rollouts", "Russian Twists"],
  "Day 6 - Rest": [],
  "Day 7 - Rest": []
};

export default function App() {
  const [view, setView] = useState("home");
  const [week, setWeek] = useState("Week 1");
  const [data, setData] = useState({});
  const [expandedDay, setExpandedDay] = useState(null);
  const [timerDuration, setTimerDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionStartTimes, setSessionStartTimes] = useState({});
  const [liveDurations, setLiveDurations] = useState({});

  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      new Audio("https://www.soundjay.com/button/beep-07.wav").play();
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDurations((prev) => {
        const updates = { ...prev };
        Object.entries(sessionStartTimes).forEach(([day, start]) => {
          if (start) {
            const now = Date.now();
            const durationMs = now - start;
            const minutes = Math.floor(durationMs / 60000);
            const seconds = Math.floor((durationMs % 60000) / 1000);
            updates[day] = `${minutes}m ${seconds}s`;
          }
        });
        return updates;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTimes]);

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const handleChange = (day, exercise, idx, field, value) => {
    const updated = { ...data };
    if (!updated[week]) updated[week] = {};
    if (!updated[week][day]) updated[week][day] = {};
    if (!updated[week][day][exercise]) updated[week][day][exercise] = [];
    const sets = [...updated[week][day][exercise]];
    sets[idx] = { ...sets[idx], [field]: value };
    const reps = parseInt(sets[idx]?.reps);
    const weight = parseFloat(sets[idx]?.weight);
    if (!isNaN(reps) && !isNaN(weight)) {
      sets[idx].estimated1RM = (weight * (1 + reps / 30)).toFixed(2);
      sets[idx].nextWeight = (sets[idx].estimated1RM * 0.75).toFixed(2);
    }
    updated[week][day][exercise] = sets;
    setData(updated);
  };

  const addSet = (day, exercise) => {
    const updated = { ...data };
    if (!updated[week]) updated[week] = {};
    if (!updated[week][day]) updated[week][day] = {};
    if (!updated[week][day][exercise]) updated[week][day][exercise] = [];
    updated[week][day][exercise].push({ weight: "", reps: "", estimated1RM: "", nextWeight: "" });
    setData(updated);
  };

  const removeSet = (day, exercise, idx) => {
    const updated = { ...data };
    updated[week][day][exercise].splice(idx, 1);
    setData(updated);
  };

  const startSession = (day) => {
    setSessionStartTimes({ ...sessionStartTimes, [day]: Date.now() });
  };

  const endSession = (day) => {
    const start = sessionStartTimes[day];
    if (!start) return;
    const end = Date.now();
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    const updated = { ...data };
    if (!updated[week]) updated[week] = {};
    if (!updated[week][day]) updated[week][day] = {};
    updated[week][day]._sessionDuration = `${minutes}m ${seconds}s`;
    setData(updated);
    setSessionStartTimes({ ...sessionStartTimes, [day]: null });
    const newLive = { ...liveDurations };
    delete newLive[day];
    setLiveDurations(newLive);
  };

  const weekOptions = Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);

  if (view === "home") {
    return (
      <div style={{ backgroundImage: "url('/hero.png')", backgroundSize: "cover", backgroundPosition: "center", minHeight: "100vh", color: "#fff", fontFamily: "Lilita One, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{
  fontSize: "2.5rem",
  color: "#f97316",
  textAlign: "center",
  fontWeight: "800",
  lineHeight: "1.2"
}}>
  Put The Work In <br />
  Let's Do This!
</h1>
        <div style={{ marginTop: "2rem" }}>
          <button onClick={() => setView("workout")} style={{ padding: "1rem 2rem", marginRight: "1rem", fontWeight: "600" }}>Start Workout</button>
          <button onClick={() => setView("analysis")} style={{ padding: "1rem 2rem" }}>View Analysis</button>
        </div>
      </div>
    );
  }

  if (view === "workout") {
    return (
      <div style={{ backgroundImage: "url('/workout-bg.png')", backgroundSize: "cover", backgroundPosition: "center", minHeight: "100vh", color: "#fff", padding: "2rem", fontFamily: "Lilita One, sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ marginRight: '1rem' }}>Weekly Workout Plan</h2>
          <select value={week} onChange={(e) => setWeek(e.target.value)}>
            {weekOptions.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label>Select Rest Timer: </label>
          <select value={timerDuration} onChange={e => setTimerDuration(Number(e.target.value))}>
            <option value={60}>60 seconds</option>
            <option value={90}>90 seconds</option>
            <option value={120}>120 seconds</option>
            <option value={180}>180 seconds</option>
          </select>
          <button onClick={() => { setTimeLeft(timerDuration); setTimerRunning(true); }} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>Start Timer</button>
          <button onClick={() => { setTimerRunning(false); setTimeLeft(0); }} style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>Stop Timer</button>
          <button onClick={() => setView("home")} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>Home</button>
          {timerRunning && <p style={{ marginTop: '0.5rem' }}>⏱ Time Left: {timeLeft}s</p>}
        </div>

        {Object.entries(workoutPlan).map(([day, exercises]) => (
          <div key={day} style={{ marginBottom: "2rem", borderBottom: "1px solid #444", paddingBottom: "1rem" }}>
            <h3 onClick={() => toggleDay(day)} style={{ color: "#f97316", cursor: "pointer" }}>{expandedDay === day ? '▼' : '▶'} {day}</h3>
            {expandedDay === day && (
              <div>
                {data[week]?.[day]?._sessionDuration && <p><strong>Previous Session:</strong> {data[week][day]._sessionDuration}</p>}
                {liveDurations[day] && <p><strong>⏱ Session Timer:</strong> {liveDurations[day]}</p>}
                {!sessionStartTimes[day] && <button onClick={() => startSession(day)}>Start Session</button>}
                {sessionStartTimes[day] && <button onClick={() => endSession(day)}>End Session</button>}
                {exercises.length === 0 ? <p>Rest Day</p> : exercises.map((exercise) => (
                  <div key={exercise} style={{ marginBottom: '1rem' }}>
                    <h4>{exercise}</h4>
                    {(data[week]?.[day]?.[exercise] || []).map((set, idx) => (
                      <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input placeholder="Weight (kg)" value={set.weight} onChange={e => handleChange(day, exercise, idx, 'weight', e.target.value)} />
                        <input placeholder="Reps" value={set.reps} onChange={e => handleChange(day, exercise, idx, 'reps', e.target.value)} />
                        <input placeholder="1RM" value={set.estimated1RM || ""} readOnly />
                        <input placeholder="Next Wt" value={set.nextWeight || ""} readOnly />
                        <button onClick={() => removeSet(day, exercise, idx)}>Remove</button>
                      </div>
                    ))}
                    <button onClick={() => addSet(day, exercise)}>+ Add Set</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (view === "analysis") {
    return (
      <div style={{ backgroundImage: "url('/analysis-bg.png')", backgroundSize: "cover", backgroundPosition: "center", minHeight: "100vh", color: "#fff", padding: "2rem", fontFamily: "Lilita One, sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ marginRight: '1rem' }}>Workout Analysis</h2>
          <select value={week} onChange={(e) => setWeek(e.target.value)}>
            {weekOptions.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
        <p>Total Volume: 0 kg</p>
        <p>Top Estimated 1RM: 0 kg</p>
        <p>Best Lift: -</p>
        <button style={{ marginTop: '2rem', padding: '0.5rem 1rem' }}>Export to CSV</button>
        <button onClick={() => setView("home")} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>Home</button>
      </div>
    );
  }

  return null;
}
