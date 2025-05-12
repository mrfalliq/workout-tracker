import React, { useState } from "react";

const trainingProgram = {
  Push: [
    { exercise: "Incline Dumbbell Press", sets: 4, reps: 10 },
    { exercise: "Machine Chest Press", sets: 3, reps: 12 },
    { exercise: "Dumbbell Shoulder Press", sets: 4, reps: 10 },
    { exercise: "Lateral Raises", sets: 4, reps: 15 },
    { exercise: "Overhead Rope Triceps Extension", sets: 4, reps: 12 },
    { exercise: "Pushups to failure", sets: 2, reps: "failure" }
  ],
  Pull: [
    { exercise: "Lat Pulldown", sets: 4, reps: 10 },
    { exercise: "Seated Row", sets: 3, reps: 12 },
    { exercise: "Dumbbell Shrugs", sets: 3, reps: 15 },
    { exercise: "Face Pulls", sets: 4, reps: 15 },
    { exercise: "Dumbbell Curls", sets: 4, reps: 12 },
    { exercise: "Hanging Leg Raises", sets: 4, reps: 15 }
  ],
  Legs: [
    { exercise: "Leg Press", sets: 4, reps: 12 },
    { exercise: "Bulgarian Split Squats", sets: 3, reps: "10/leg" },
    { exercise: "Hamstring Curls", sets: 4, reps: 15 },
    { exercise: "Calf Raises", sets: 4, reps: 20 },
    { exercise: "Walking Lunges", sets: 2, reps: "20 steps" }
  ],
  Shoulders: [
    { exercise: "Arnold Press", sets: 4, reps: 12 },
    { exercise: "Cable Lateral Raises", sets: 4, reps: 15 },
    { exercise: "Barbell Curls", sets: 4, reps: 12 },
    { exercise: "Triceps Pushdowns", sets: 4, reps: 12 },
    { exercise: "Reverse Pec Deck", sets: 3, reps: 15 },
    { exercise: "Incline DB Curl + Overhead Triceps Superset", sets: 3, reps: 12 }
  ],
  Conditioning: [
    { exercise: "Incline Walk", sets: 1, reps: "15 mins" },
    { exercise: "Battle Rope", sets: 4, reps: "30s" },
    { exercise: "Sled Push", sets: 4, reps: "20m" },
    { exercise: "Cable Crunch", sets: 4, reps: 15 },
    { exercise: "Ab Rollouts", sets: 3, reps: 10 },
    { exercise: "Russian Twists", sets: 3, reps: 20 }
  ]
};
const exportToCSV = (data) => {
  const headers = ["Exercise", "Weight", "Reps", "Sets", "Volume", "Next Weight", "1RM"];
  const rows = data.map(entry =>
    [entry.exercise, entry.weight, entry.reps, entry.sets, entry.volume, entry.suggestedNext, entry.oneRM]
  );

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "workout_log.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const buttonStyle = {
  background: "transparent",
  color: "#f97316",
  border: "2px solid #f97316",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
  margin: "0.25rem",
  transition: "all 0.3s ease",
  fontFamily: "'Oswald', sans-serif"
};

const activeButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#f97316",
  color: "white"
};

const inputStyle = {
  padding: "0.4rem 0.6rem",
  borderRadius: "6px",
  border: "1px solid #f97316",
  fontFamily: "'Oswald', sans-serif",
  outline: "none"
};
const thStyle = {
  padding: "0.75rem",
  borderBottom: "1px solid #f97316",
  fontSize: "1rem"
};

const tdStyle = {
  padding: "0.6rem",
  fontSize: "0.95rem",
  color: "white"
};
const backgroundStyle = (img) => ({
  backgroundImage: `linear-gradient(rgba(0,0,0,0.0), rgba(0,0,0,0.0)), url(/${img})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  padding: "2rem",
  color: "white",
  fontFamily: "'Oswald', sans-serif"
});

const NavBar = ({ view, setView }) => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#000",
    padding: "1rem",
    gap: "1rem",
    borderBottom: "1px solid #f97316"
  }}>
{["home", "workout", "analysis", "guide", "program"].map(v => (
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

function App() {
  const [view, setView] = useState("home");
  const [selectedDay, setSelectedDay] = useState("Push");
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [log, setLog] = useState(() => {
  const saved = localStorage.getItem("workoutLog");
  return saved ? JSON.parse(saved) : [];
});
    const [completedExercises, setCompletedExercises] = useState(() => {
    const saved = localStorage.getItem("completedExercises");
    return saved ? JSON.parse(saved) : {};
});
  const [setProgress, setSetProgress] = useState(() => {
    const saved = localStorage.getItem("setProgress");
    return saved ? JSON.parse(saved) : {};
  });
  const renderHome = () => (
    <div style={backgroundStyle("hero-5.png")}>
      <h1 style={{ fontSize: "2.5rem", color: "#f97316", textAlign: "center" }}>
        Put The Work In<br />Let's Do This!
      </h1>
    </div>
  );

  const renderWorkout = () => {
    const handleAdd = () => {
      if (!exercise || !weight || !reps || !sets) return;
      const sets = 1;
    const volume = parseInt(weight) * parseInt(reps) * sets;
      // Find last entry with same exercise
    const lastEntry = log.slice().reverse().find(entry => entry.exercise === exercise);
    const lastWeight = lastEntry ? parseFloat(lastEntry.weight) : parseFloat(weight);
    const suggestedNext = (lastWeight + 2.5).toFixed(1);    
    const oneRM = (parseFloat(weight) * (1 + parseFloat(reps) / 30)).toFixed(1);
    const newEntry = { exercise, weight, reps, sets, volume, suggestedNext, oneRM };
      const updatedLog = [...log, newEntry];    
    setLog(updatedLog);
    localStorage.setItem("workoutLog", JSON.stringify(updatedLog));
      setExercise("");
      setWeight("");
      setReps("");
    };
const handleDelete = (index) => {
  const updated = [...log];
  updated.splice(index, 1);
  setLog(updated);
  localStorage.setItem("workoutLog", JSON.stringify(updated));
};
const countLoggedSets = (exerciseName) => {
  return log
    .filter(entry => entry.exercise === exerciseName)
    .reduce((total, entry) => total + (parseInt(entry.sets) || 1), 0);
};
const handleLogSet = (exerciseName, totalSets) => {
  const today = new Date().toISOString().split("T")[0];
  const key = `${today}_${selectedDay}_${exerciseName}`;

  const current = setProgress[key] || 0;
  const updated = Math.min(current + 1, totalSets);

  const updatedProgress = { ...setProgress, [key]: updated };
  setSetProgress(updatedProgress);
  localStorage.setItem("setProgress", JSON.stringify(updatedProgress));
};

    return (
      <div style={backgroundStyle("workout-bg.png")}>
        <h2 style={{ color: "#f97316" }}>Workout Page</h2>
        <p style={{ color: "white", marginBottom: "1rem" }}>Log your sets and calculate volume</p>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <input value={exercise} onChange={e => setExercise(e.target.value)} placeholder="Exercise" style={inputStyle} />
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Weight (kg)" style={inputStyle} />
          <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="Reps" style={inputStyle} />
          <button onClick={handleAdd} style={buttonStyle}>Add</button><button
          
  onClick={() => {
    setLog([]);
    localStorage.removeItem("workoutLog");
  }}
  style={{ ...buttonStyle, borderColor: "red", color: "red" }}
>
  Clear Log
</button>

<button
  onClick={() => exportToCSV(log)}
  style={{ ...buttonStyle, borderColor: "#0af", color: "#0af" }}
>
  Export CSV
</button>
        </div>

        <table style={{ width: "100%", color: "white", fontFamily: "'Oswald', sans-serif" }}>
          <thead>
            <tr style={{ color: "#f97316", borderBottom: "1px solid #f97316" }}>
              <th>Exercise</th><th>Weight</th><th>Reps</th><th>Set</th><th>Volume</th><th>Next Weight</th><th>1RM</th><th style={thStyle}>Log</th> 
            </tr>
          </thead>
          <tbody>
            {log.map((entry, idx) => (
              <tr key={idx} style={{ textAlign: "center" }}>
                <td>{entry.exercise}</td>
                <td>{entry.weight}</td>
                <td>{entry.reps}</td>
                <td>{entry.sets}</td>
                <td>{entry.volume}</td>
                <td>{entry.suggestedNext}</td>
                <td>{entry.oneRM}</td>
                <td>
  <button
    onClick={() => handleDelete(idx)}
    style={{ ...buttonStyle, borderColor: "red", color: "red", padding: "0.2rem 0.5rem" }}
  >
    ✕
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAnalysis = () => (
    <div style={backgroundStyle("analysis-bg.png")}>
      <h2 style={{ color: "#f97316" }}>Analysis Page</h2>
      <p style={{ color: "white" }}>Track your volume, best lift and calories here.</p>
    </div>
  );

  const renderGuide = () => (
    <div style={backgroundStyle("loading-guide.png")}>
      <h2 style={{ color: "#f97316" }}>Progressive Loading Table</h2>
      <p style={{ color: "white" }}>Loading guide content coming soon.</p>
    </div>
  );

const renderProgram = () => (
  <div style={backgroundStyle("workout-bg.png")}>
    <h2 style={{ color: "#f97316", textAlign: "center", marginBottom: "1rem" }}>My Training Program</h2>

    {/* Day Selector Buttons */}
    <div style={{
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "0.5rem",
      marginBottom: "2rem"
    }}>
      {Object.keys(trainingProgram).map(day => (
        <button
          key={day}
          onClick={() => setSelectedDay(day)}
          style={selectedDay === day ? activeButtonStyle : buttonStyle}
        >
          {day}
        </button>
      ))}
    </div>

    {/* Program Table */}
    <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "rgba(0,0,0,0.4)", padding: "1rem", borderRadius: "12px" }}>
      <h3 style={{ color: "#f97316", marginBottom: "1rem", textAlign: "center" }}>{selectedDay} Plan</h3>

      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Oswald', sans-serif" }}>
        <thead>
          <tr style={{ backgroundColor: "#111", color: "#f97316" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Exercise</th>
            <th style={thStyle}>Sets</th>
            <th style={thStyle}>Log Sets</th>
            <th style={thStyle}>Completed</th>
          </tr>
        </thead>
        <tbody>
  {trainingProgram[selectedDay].map((item, idx) => (
    <tr key={idx}>
      <td style={tdStyle}>{idx + 1}</td>
      <td style={tdStyle}>{item.exercise}</td>
      <td style={tdStyle}>{item.sets}</td>   {/* ✅ Correct */}
      <td style={tdStyle}>
  {countLoggedSets(item.exercise) >= item.sets ? (
    "✅"
  ) : (
    <button
      onClick={() => handleLogSet(item.exercise, item.reps)}
      style={{ ...buttonStyle, padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
    >
      Log Set
    </button>
  )}
</td>
</tr>
    
  ))}
</tbody>
      </table>
    </div>
  </div>
);
const handleLogFromProgram = (exerciseName, setsPlanned = 1, repsPlanned = 10) => {
  const weight = prompt(`Enter weight used for ${exerciseName}`);
  if (!weight) return;

  const volume = parseInt(weight) * parseInt(repsPlanned) * 1;
  const oneRM = (parseFloat(weight) * (1 + parseFloat(repsPlanned) / 30)).toFixed(1);
  const today = new Date().toISOString().split("T")[0];

  const lastEntry = log.slice().reverse().find(e => e.exercise === exerciseName);
  const lastWeight = lastEntry ? parseFloat(lastEntry.weight) : parseFloat(weight);
  const suggestedNext = (lastWeight + 2.5).toFixed(1);

  const newEntry = {
    exercise: exerciseName,
    weight,
    reps: repsPlanned,
    sets: 1,
    volume,
    oneRM,
    suggestedNext,
    date: today
  };

  const updatedLog = [...log, newEntry];
  setLog(updatedLog);
  localStorage.setItem("workoutLog", JSON.stringify(updatedLog));
};
const handleLogSet = (exerciseName, repsPlanned = 10) => {
  const weight = prompt(`Enter weight used for ${exerciseName}`);
  if (!weight) return;

  const volume = parseInt(weight) * parseInt(repsPlanned) * 1;
  const oneRM = (parseFloat(weight) * (1 + parseFloat(repsPlanned) / 30)).toFixed(1);
  const suggestedNext = (parseFloat(weight) + 2.5).toFixed(1);
  const today = new Date().toISOString().split("T")[0];

  const newEntry = {
    exercise: exerciseName,
    weight,
    reps: repsPlanned,
    sets: 1,
    volume,
    oneRM,
    suggestedNext,
    date: today
  };

  const updatedLog = [...log, newEntry];
  setLog(updatedLog);
  localStorage.setItem("workoutLog", JSON.stringify(updatedLog));
};
const countLoggedSets = (exerciseName) => {
  return log
    .filter(entry => entry.exercise === exerciseName)
    .reduce((total, entry) => total + (parseInt(entry.sets) || 1), 0);
};
  return (
    <div>
      <NavBar view={view} setView={setView} />
      {view === "home" && renderHome()}
      {view === "workout" && renderWorkout()}
      {view === "analysis" && renderAnalysis()}
      {view === "guide" && renderGuide()}
      {view === "program" && renderProgram()}
    </div>
  );
}

export default App;