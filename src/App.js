import React, { useState, useEffect } from "react";

// --- GLOBAL STYLES ---
const buttonStyle = {
  background: "transparent",
  color: "#f97316",
  border: "2px solid #f97316",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
  margin: "0.25rem",
  transition: "all 0.2s ease",
};

const activeButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#f97316",
  color: "white",
};

const tableHeaderStyle = {
  padding: "1rem",
  border: "1px solid #f97316",
  backgroundColor: "#111",
  color: "#f97316",
  textAlign: "left",
};

const tableCellStyle = {
  padding: "1rem",
  border: "1px solid #f97316",
};

const backgroundStyle = (img) => ({
  backgroundImage: `url(/${img})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  padding: "2rem",
  color: "white",
});

const NavBar = ({ view, setView }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#000",
      padding: "1rem",
      gap: "1rem",
      borderBottom: "1px solid #f97316",
    }}
  >
    {["home", "workout", "analysis", "guide"].map((v) => (
      <button
        key={v}
        onClick={() => setView(v)}
        style={view === v ? activeButtonStyle : buttonStyle}
      >
        {v.charAt(0).toUpperCase() + v.slice(1)}
      </button>
    ))}
  </div>
);
const App = () => {
  const [view, setView] = useState("home");
  const [week, setWeek] = useState("Week 1");
  const [data, setData] = useState({});
  const [sessionStart, setSessionStart] = useState(null);
  const [restTime, setRestTime] = useState(60);
  const [restCountdown, setRestCountdown] = useState(null);
  const [liveDurations, setLiveDurations] = useState({});
  const [activeDay, setActiveDay] = useState(null);
  const [expandedExercises, setExpandedExercises] = useState({});

  const toggleDay = (day) => {
    setActiveDay(activeDay === day ? null : day);
  };

  const toggleExercise = (day, exName) => {
    setExpandedExercises((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [exName]: !prev[day]?.[exName],
      },
    }));
  };

  const workoutPlan = {
    "Week 1": {
      "Day 1 - Push": [
        { name: "Incline Dumbbell Press", sets: 4, reps: 10, link: "https://youtu.be/8iPEnn-ltC8" },
        { name: "Machine Chest Press", sets: 3, reps: 12, link: "https://youtu.be/1QL7kfQFZ_g" },
        { name: "Dumbbell Shoulder Press", sets: 4, reps: 10, link: "https://youtu.be/qEwKCR5JCog" },
        { name: "Lateral Raises", sets: 4, reps: 15, link: "https://youtu.be/kDqklk1ZESo" },
        { name: "Overhead Rope Triceps Extension", sets: 4, reps: 12, link: "https://youtu.be/YbX7Wd8jQ-Q" },
        { name: "Pushups", sets: 2, reps: "to failure", link: "https://youtu.be/IODxDxX7oi4" },
      ],
      "Day 2 - Pull": [
        { name: "Lat Pulldown", sets: 4, reps: 10, link: "https://youtu.be/CAwf7n6Luuc" },
        { name: "Seated Row", sets: 3, reps: 12, link: "https://youtu.be/GZbfZ033f74" },
        { name: "Dumbbell Shrugs", sets: 3, reps: 15, link: "https://youtu.be/yn5f3kkVljc" },
        { name: "Face Pulls", sets: 4, reps: 15, link: "https://youtu.be/eIq5CB9JfKE" },
        { name: "Dumbbell Curls", sets: 4, reps: 12, link: "https://youtu.be/sAq_ocpRh_I" },
        { name: "Hanging Leg Raises", sets: 4, reps: 15, link: "https://youtu.be/VlVVlf3y-Es" },
      ],
      "Day 3 - Legs": [
        { name: "Leg Press", sets: 4, reps: 12, link: "https://youtu.be/IZxyjW7MPJQ" },
        { name: "Bulgarian Split Squats", sets: 3, reps: 10, link: "https://youtu.be/2C-uNgKwPLE" },
        { name: "Hamstring Curls", sets: 4, reps: 15, link: "https://youtu.be/1Tq3QdYUuHs" },
        { name: "Calf Raises", sets: 4, reps: 20, link: "https://youtu.be/-M4-G8p8fmc" },
        { name: "Walking Lunges", sets: 2, reps: 20, link: "https://youtu.be/4bb_5MZVn2c" },
      ],
      "Day 4 - Shoulders + Arms": [
        { name: "Arnold Press", sets: 4, reps: 12, link: "https://youtu.be/vj2w851ZHRM" },
        { name: "Cable Lateral Raises", sets: 4, reps: 15, link: "https://youtu.be/Z57CtFmRMx8" },
        { name: "Barbell Curls", sets: 4, reps: 12, link: "https://youtu.be/in7PaeYlhrM" },
        { name: "Triceps Pushdowns", sets: 4, reps: 12, link: "https://youtu.be/2-LAMcpzODU" },
        { name: "Reverse Pec Deck", sets: 3, reps: 15, link: "https://youtu.be/rTyxB89fLtY" },
        { name: "Incline DB Curl + Overhead Triceps Superset", sets: 3, reps: 12, link: "https://youtu.be/N3FahcG7xlQ" },
      ],
      "Day 5 - Conditioning + Abs": [
        { name: "Incline Walk", sets: 1, reps: 15, link: "" },
        { name: "Battle Rope", sets: 4, reps: 30, link: "https://youtu.be/nmQSC1J4FfQ" },
        { name: "Sled Push", sets: 4, reps: 20, link: "https://youtu.be/lk8giMxoGpU" },
        { name: "Cable Crunch", sets: 4, reps: 15, link: "https://youtu.be/efMHLkyb7ho" },
        { name: "Ab Rollouts", sets: 3, reps: 10, link: "https://youtu.be/t8t4bzq3b3o" },
        { name: "Russian Twists", sets: 3, reps: 20, link: "https://youtu.be/wkD8rjkodUI" },
      ],
      "Day 6 - Rest": [],
      "Day 7 - Rest": [],
    },
  };

  useEffect(() => {
    let timer;
    if (restCountdown !== null && restCountdown > 0) {
      timer = setTimeout(() => setRestCountdown(restCountdown - 1), 1000);
    } else if (restCountdown === 0) {
      setRestCountdown(null);
      alert("Rest over!");
    }
    return () => clearTimeout(timer);
  }, [restCountdown]);
    const handleInputChange = (day, exName, idx, field, value) => {
    const newData = { ...data };
    if (!newData[week]) newData[week] = {};
    if (!newData[week][day]) newData[week][day] = {};
    if (!newData[week][day][exName]) newData[week][day][exName] = [];

    newData[week][day][exName][idx] = {
      ...(newData[week][day][exName][idx] || {}),
      [field]: value,
    };

    const w = parseFloat(newData[week][day][exName][idx]?.weight || 0);
    const r = parseFloat(newData[week][day][exName][idx]?.reps || 0);
    newData[week][day][exName][idx].estimated1RM = w * (1 + r / 30);
    newData[week][day][exName][idx].calories = w && r ? (w * r * 0.1).toFixed(1) : 0;
    newData[week][day][exName][idx].nextWeight = (w + 2.5).toFixed(1);

    setData(newData);
  };

  const addSet = (day, exName) => {
    const current = data[week]?.[day]?.[exName] || [];
    handleInputChange(day, exName, current.length, "weight", "");
  };

  const removeSet = (day, exName) => {
    const newData = { ...data };
    const sets = newData[week]?.[day]?.[exName];
    if (sets && sets.length > 0) {
      sets.pop();
      setData(newData);
    }
  };

  const renderInputs = (day, ex) => {
    const sets = data?.[week]?.[day]?.[ex.name] || [];
    return (
      <div style={{ marginTop: "0.5rem" }}>
        {sets.map((set, idx) => (
          <div key={idx} style={{ display: "flex", gap: "1rem", marginBottom: "0.25rem" }}>
            <input
              type="number"
              placeholder="Weight (kg)"
              value={set.weight || ""}
              onChange={(e) => handleInputChange(day, ex.name, idx, "weight", e.target.value)}
              style={{ padding: "0.25rem", width: "100px" }}
            />
            <input
              type="number"
              placeholder="Reps"
              value={set.reps || ""}
              onChange={(e) => handleInputChange(day, ex.name, idx, "reps", e.target.value)}
              style={{ padding: "0.25rem", width: "60px" }}
            />
            <span style={{ fontSize: "0.8rem", color: "#f97316" }}>
              1RM: {set.estimated1RM?.toFixed(1) || "-"} | Next: {set.nextWeight || "-"}kg
            </span>
          </div>
        ))}
        <button style={buttonStyle} onClick={() => addSet(day, ex.name)}>➕ Add Set</button>
        <button style={{ ...buttonStyle, marginLeft: "0.5rem" }} onClick={() => removeSet(day, ex.name)}>➖ Remove Set</button>
      </div>
    );
  };

  const renderSessionControls = () => {
    const duration = sessionStart ? Math.floor((Date.now() - sessionStart) / 1000) : 0;
    return (
      <div style={{ margin: "1rem 0" }}>
        <button style={buttonStyle} onClick={() => setSessionStart(Date.now())}>Start Session</button>
        <button style={{ ...buttonStyle, marginLeft: "1rem" }} onClick={() => setSessionStart(null)}>End Session</button>
        {sessionStart && (
          <p style={{ marginTop: "0.5rem", color: "#f97316" }}>
            Session Time: {duration}s
          </p>
        )}
      </div>
    );
  };

  const renderRestTimer = () => (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ color: "#f97316", fontWeight: "bold" }}>Rest Timer: </label>
      <select
        value={restTime}
        onChange={(e) => setRestTime(Number(e.target.value))}
        style={{ padding: "0.25rem", marginLeft: "0.5rem" }}
      >
        {[60, 90, 120, 180].map((s) => (
          <option key={s} value={s}>{s} sec</option>
        ))}
      </select>
      <button style={{ ...buttonStyle, marginLeft: "1rem" }} onClick={() => setRestCountdown(restTime)}>
        Start Rest
      </button>
      <button style={{ ...buttonStyle, marginLeft: "0.5rem" }} onClick={() => setRestCountdown(null)}>
        End Rest
      </button>
      {restCountdown !== null && (
        <p style={{ color: "#f97316" }}>Time left: {restCountdown}s</p>
      )}
    </div>
  );

  const renderWorkout = () => (
    <div style={backgroundStyle("workout-bg.png")}>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#f97316", fontWeight: "bold" }}>Select Week:</label>{" "}
        <select value={week} onChange={(e) => setWeek(e.target.value)} style={{ padding: "0.5rem" }}>
          {Object.keys(workoutPlan).map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>
      <h2 style={{ color: "#f97316" }}>{week}</h2>
      {Object.entries(workoutPlan[week]).map(([day, exercises]) => (
        <div key={day} style={{ marginBottom: "1rem", border: "1px solid #f97316", borderRadius: "8px", padding: "1rem" }}>
          <h3 style={{ cursor: "pointer", color: "#f97316" }} onClick={() => toggleDay(day)}>{day}</h3>
          {activeDay === day && (
            <div>
              {exercises.length === 0 ? (
                <p style={{ fontStyle: "italic" }}>Rest Day</p>
              ) : exercises.map((ex) => (
                <div key={ex.name} style={{ marginBottom: "1rem" }}>
                  <div
                    onClick={() => toggleExercise(day, ex.name)}
                    style={{ cursor: "pointer", fontWeight: "bold", color: "#f97316" }}
                  >
                    {ex.name} ({ex.sets} sets of {ex.reps} reps)
                  </div>
                  {expandedExercises?.[day]?.[ex.name] && (
                    <div style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
                      <a href={ex.link} target="_blank" rel="noreferrer" style={{ fontSize: "0.9rem", color: "#60a5fa" }}>▶️ Watch</a>
                      {renderInputs(day, ex)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
    const renderAnalysis = () => {
    const weekData = data[week] || {};
    let totalVolume = 0;
    let top1RM = 0;
    let bestLift = "-";
    let totalCalories = 0;

    Object.entries(weekData).forEach(([day, exercises]) => {
      Object.entries(exercises || {}).forEach(([exercise, sets]) => {
        (sets || []).forEach((set) => {
          const w = parseFloat(set.weight);
          const r = parseFloat(set.reps);
          const rm = parseFloat(set.estimated1RM);
          const cal = parseFloat(set.calories);
          if (!isNaN(w) && !isNaN(r)) totalVolume += w * r;
          if (!isNaN(rm) && rm > top1RM) {
            top1RM = rm;
            bestLift = exercise;
          }
          if (!isNaN(cal)) totalCalories += cal;
        });
      });
    });

    const exportToCSV = () => {
      const lines = ["Week,Day,Exercise,Set,Weight,Reps,1RM,Calories"];
      Object.entries(data).forEach(([weekName, weekData]) => {
        Object.entries(weekData).forEach(([day, dayData]) => {
          Object.entries(dayData).forEach(([exercise, sets]) => {
            sets.forEach((set, idx) => {
              lines.push([
                weekName,
                day,
                exercise,
                idx + 1,
                set.weight,
                set.reps,
                set.estimated1RM,
                set.calories,
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

    return (
      <div style={backgroundStyle("analysis-bg.png")}>
        <h2 style={{ color: "#f97316" }}>Workout Analysis - {week}</h2>
        <p>Total Volume: {totalVolume.toFixed(2)} kg</p>
        <p>Top Estimated 1RM: {top1RM.toFixed(2)} kg</p>
        <p>Best Lift: {bestLift}</p>
        <p>Total Calories Burned: {totalCalories.toFixed(1)} kcal</p>
        <button style={buttonStyle} onClick={exportToCSV}>Export to CSV</button>
      </div>
    );
  };

  const renderGuide = () => (
    <div style={backgroundStyle("loading-guide.png")}>
      <h2 style={{ color: "#f97316", textAlign: "center" }}>Progressive Loading Table (RIR-style)</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "2rem" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Set</th>
            <th style={tableHeaderStyle}>Effort Level</th>
            <th style={tableHeaderStyle}>Weight Strategy</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={tableCellStyle}>1</td><td style={tableCellStyle}>Easy (70%)</td><td style={tableCellStyle}>Warm-up pace</td></tr>
          <tr><td style={tableCellStyle}>2</td><td style={tableCellStyle}>Moderate (80–85%)</td><td style={tableCellStyle}>Controlled heavier</td></tr>
          <tr><td style={tableCellStyle}>3</td><td style={tableCellStyle}>Hard (90%)</td><td style={tableCellStyle}>Challenging strength</td></tr>
          <tr><td style={tableCellStyle}>4</td><td style={tableCellStyle}>Max Effort (95–100%)</td><td style={tableCellStyle}>Go close to failure</td></tr>
        </tbody>
      </table>
      <div style={{ marginTop: "2rem" }}>
        <p><strong style={{ color: "#f97316" }}>Example:</strong> Dumbbell Shoulder Press (10 reps)</p>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>Set 1: 14kg (easy)</li>
          <li>Set 2: 16kg (moderate)</li>
          <li>Set 3: 18kg (hard)</li>
          <li>Set 4: 20kg (max)</li>
        </ul>
        <p>This approach minimizes injury risk, preserves form, and builds muscle effectively.</p>
      </div>
    </div>
  );

  return (
    <>
      <NavBar view={view} setView={setView} />
      {view === "home" && (
        <div style={backgroundStyle("hero-5.png")}>
          <h1 style={{ fontSize: "2.5rem", color: "#f97316", textAlign: "center" }}>
            Put The Work In<br />Let's Do This!
          </h1>
        </div>
      )}
      {view === "workout" && (
        <>
          {renderRestTimer()}
          {renderSessionControls()}
          {renderWorkout()}
        </>
      )}
      {view === "analysis" && renderAnalysis()}
      {view === "guide" && renderGuide()}
    </>
  );
};

export default App;