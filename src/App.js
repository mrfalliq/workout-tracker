// Full version with home screen, workout logging, timers, session tracking, and analysis
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
  const [week] = useState("Week 1");
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
      const updates = { ...liveDurations };
      Object.entries(sessionStartTimes).forEach(([day, start]) => {
        if (start) {
          const now = Date.now();
          const durationMs = now - start;
          const minutes = Math.floor(durationMs / 60000);
          const seconds = Math.floor((durationMs % 60000) / 1000);
          updates[day] = `${minutes}m ${seconds}s`;
        }
      });
      setLiveDurations(updates);
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

  const calculateSummary = (weekData) => {
    let totalVolume = 0;
    let top1RM = 0;
    let bestLift = "-";
    Object.entries(weekData || {}).forEach(([day, exercises]) => {
      Object.entries(exercises || {}).forEach(([exercise, sets]) => {
        (sets || []).forEach(set => {
          const w = parseFloat(set.weight);
          const r = parseFloat(set.reps);
          const rm = parseFloat(set.estimated1RM);
          if (!isNaN(w) && !isNaN(r)) totalVolume += w * r;
          if (!isNaN(rm) && rm > top1RM) {
            top1RM = rm;
            bestLift = exercise;
          }
        });
      });
    });
    return { totalVolume, top1RM, bestLift };
  };

  const exportToCSV = () => {
    const lines = ["Week,Day,Exercise,Set,Weight,Reps,Estimated 1RM,Next Weight,Session Duration"];
    Object.entries(data).forEach(([weekName, weekData]) => {
      Object.entries(weekData).forEach(([day, dayData]) => {
        Object.entries(dayData).forEach(([exercise, sets]) => {
          if (exercise.startsWith("_")) return;
          sets.forEach((set, idx) => {
            lines.push([
              weekName,
              day,
              exercise,
              idx + 1,
              set.weight,
              set.reps,
              set.estimated1RM,
              set.nextWeight,
              dayData._sessionDuration || ""
            ].join(","));
          });
        });
      });
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workout_data.csv";
    a.click();
  };

  if (view === "analysis") {
    const summary = calculateSummary(data[week]);
    return (
      <div style={{
  padding: '2rem',
  backgroundColor: '#111',
  color: 'white',
  fontFamily: 'Lilita One, sans-serif',
  minHeight: '100vh'
}}>
        <h2 style={{ fontSize: '2rem' }}>Workout Analysis - {week}</h2>
        <p>Total Volume: {summary.totalVolume.toFixed(2)} kg</p>
        <p>Top Estimated 1RM: {summary.top1RM.toFixed(2)} kg</p>
        <p>Best Lift: {summary.bestLift}</p>
        <button onClick={exportToCSV} style={{ marginTop: '2rem', padding: '0.5rem 1rem' }}>Export to CSV</button>
        <button onClick={() => setView("home")} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>Back to Home</button>
      </div>
    );
  }

  if (view === "workout") {
    return (
      <div style={{ backgroundColor: "#111", color: "#fff", minHeight: "100vh", fontFamily: "Lilita One, sans-serif", padding: "2rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Weekly Workout Plan ({week})</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <label>Select Rest Timer: </label>
          <select value={timerDuration} onChange={e => setTimerDuration(Number(e.target.value))}>
            <option value={60}>60 seconds</option>
            <option value={90}>90 seconds</option>
            <option value={120}>120 seconds</option>
            <option value={180}>180 seconds</option>
          </select>
          <button onClick={() => { setTimeLeft(timerDuration); setTimerRunning(true); }} style={{ marginLeft: '1rem' }}>Start Timer</button>
          {timerRunning && <p>⏱ Time Left: {timeLeft}s</p>}
        </div>
        {Object.entries(workoutPlan).map(([day, exercises]) => (
          <div key={day} style={{ marginBottom: "2rem", borderBottom: "1px solid #444", paddingBottom: "1rem" }}>
            <h3 onClick={() => toggleDay(day)} style={{ color: "#f97316", cursor: "pointer" }}>{expandedDay === day ? '▼' : '▶'} {day}</h3>
            {expandedDay === day && (
              <div>
                {data[week]?.[day]?._sessionDuration && <p><strong>Session Duration:</strong> {data[week][day]._sessionDuration}</p>}
                {liveDurations[day] && <p><strong>⏱ Session Timer:</strong> {liveDurations[day]}</p>}
                {!sessionStartTimes[day] && <button onClick={() => startSession(day)}>Start Session</button>}
                {sessionStartTimes[day] && <button onClick={() => endSession(day)}>End Session</button>}
                {exercises.length === 0 ? <p>Rest Day</p> : exercises.map(exercise => (
                  <div key={exercise} style={{ marginBottom: '1.5rem' }}>
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
        <button onClick={() => setView("home")} style={{ marginTop: "2rem", padding: "0.5rem 1rem" }}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{
      backgroundImage: "url('/hero.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      color: "#fff",
      minHeight: "100vh",
      fontFamily: "Lilita One, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <h1 style={{ fontSize: "2.5rem", color: "#f97316" }}>Welcome Falliq! LET’S DO THIS!!!</h1>
      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => setView("workout")} style={{ padding: "1rem 2rem", marginRight: "1rem", fontWeight: "600" }}>Start Workout</button>
        <button onClick={() => setView("analysis")} style={{ padding: "1rem 2rem" }}>View Analysis</button>
      </div>
    </div>
  );
}
