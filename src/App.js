import React, { useState } from "react";

const exercises = [
  "Incline Dumbbell Press", "Machine Chest Press", "Dumbbell Shoulder Press",
  "Lateral Raises", "Overhead Rope Triceps Extension", "Pushups (to failure)",
  "Lat Pulldown", "Seated Row", "Dumbbell Shrugs", "Face Pulls", "Dumbbell Curls", "Hanging Leg Raises",
  "Leg Press", "Bulgarian Split Squat", "Hamstring Curls", "Calf Raises", "Walking Lunges",
  "Arnold Press", "Cable Lateral Raises", "Barbell Curls", "Triceps Pushdowns", "Reverse Pec Deck", "Incline DB Curl + Overhead Triceps (superset)",
  "Incline Walk (15 mins)", "Battle Rope", "Sled Push", "Cable Crunch", "Ab Rollouts", "Russian Twists"
];

function App() {
  const [data, setData] = useState(
    exercises.map(ex => ({ exercise: ex, weight: "", reps: "", estimated1RM: "", nextWeight: "" }))
  );

  const calculate1RM = (weight, reps) => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    return !isNaN(w) && !isNaN(r) ? (w * (1 + r / 30)).toFixed(2) : "";
  };

  const calculateNext = (rm, targetPercent = 0.75) => {
    const value = parseFloat(rm);
    return !isNaN(value) ? (value * targetPercent).toFixed(2) : "";
  };

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    if (field === "weight" || field === "reps") {
      const rm = calculate1RM(newData[index].weight, newData[index].reps);
      newData[index].estimated1RM = rm;
      newData[index].nextWeight = calculateNext(rm);
    }
    setData(newData);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {data.map((entry, idx) => (
        <div key={idx} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
          <h4>{entry.exercise}</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="number"
              placeholder="Weight (kg)"
              value={entry.weight}
              onChange={e => handleChange(idx, "weight", e.target.value)}
            />
            <input
              type="number"
              placeholder="Reps"
              value={entry.reps}
              onChange={e => handleChange(idx, "reps", e.target.value)}
            />
            <input
              type="text"
              placeholder="1RM"
              value={entry.estimated1RM}
              readOnly
            />
            <input
              type="text"
              placeholder="Next Weight"
              value={entry.nextWeight}
              readOnly
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;