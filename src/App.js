// Final Full Version - with Countdown Timer & Fixed Backgrounds
import React, { useState, useEffect } from "react";

const workoutPlan = {
  "Day 1 - Push": [
    "Incline Dumbbell Press (4 sets of 10 reps)",
    "Machine Chest Press (4 sets of 10 reps)",
    "Dumbbell Shoulder Press (4 sets of 10 reps)",
    "Lateral Raises (4 sets of 10 reps)",
    "Overhead Rope Triceps Extension (4 sets of 10 reps)",
    "Pushups (to failure)"
  ],
  "Day 2 - Pull": [
    "Lat Pulldown (4 sets of 10 reps)",
    "Seated Row (4 sets of 10 reps)",
    "Dumbbell Shrugs (4 sets of 10 reps)",
    "Face Pulls (4 sets of 10 reps)",
    "Dumbbell Curls (4 sets of 10 reps)",
    "Hanging Leg Raises (4 sets of 10 reps)"
  ],
  "Day 3 - Legs": [
    "Leg Press (4 sets of 10 reps)",
    "Bulgarian Split Squat (4 sets of 10 reps)",
    "Hamstring Curls (4 sets of 10 reps)",
    "Calf Raises (4 sets of 10 reps)",
    "Walking Lunges (4 sets of 10 reps)"
  ],
  "Day 4 - Shoulders + Arms": [
    "Arnold Press (4 sets of 10 reps)",
    "Cable Lateral Raises (4 sets of 10 reps)",
    "Barbell Curls (4 sets of 10 reps)",
    "Triceps Pushdowns (4 sets of 10 reps)",
    "Reverse Pec Deck (4 sets of 10 reps)",
    "Incline DB Curl + Overhead Triceps (superset) (4 sets of 10 reps)"
  ],
  "Day 5 - Conditioning + Abs": [
    "Incline Walk (15 mins)",
    "Battle Rope (4 rounds)",
    "Sled Push (4 rounds)",
    "Cable Crunch (4 sets of 15 reps)",
    "Ab Rollouts (4 sets of 10 reps)",
    "Russian Twists (4 sets of 20 reps)"
  ],
  "Day 6 - Rest": [],
  "Day 7 - Rest": []
};

const weeks = Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);

const backgroundStyle = (img) => ({
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  minHeight: "100vh",
  padding: "2rem",
  color: "white",
  fontFamily: "Arial, sans-serif"
});

const backgroundHome = process.env.PUBLIC_URL + "/hero.png";
const backgroundWorkout = process.env.PUBLIC_URL + "/workout-bg.png";
const backgroundAnalysis = process.env.PUBLIC_URL + "/analysis-bg.png";
const backgroundGuide = process.env.PUBLIC_URL + "/loading-guide.png";

export default function App() {
  const [view, setView] = useState("home");
  const [week, setWeek] = useState("Week 1");
  const [data, setData] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState(0);
  const [expandedDays, setExpandedDays] = useState([]);

  // Countdown timer state
  const [countdown, setCountdown] = useState(0);
  const [selectedCountdown, setSelectedCountdown] = useState(60);

  useEffect(() => {
    let interval;
    if (startTime) {
      interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) new Audio("/beep.mp3").play();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const toggleDay = (day) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleInputChange = (day, exercise, setIndex, field, value) => {
    setData((prev) => {
      const weekData = { ...prev[week] } || {};
      const dayData = { ...weekData[day] } || {};
      const exerciseData = [...(dayData[exercise] || [])];
      exerciseData[setIndex] = { ...exerciseData[setIndex], [field]: value };
      return {
        ...prev,
        [week]: {
          ...weekData,
          [day]: {
            ...dayData,
            [exercise]: exerciseData
          }
        }
      };
    });
  };

  const exportToCSV = () => {
    const lines = ["Week,Day,Exercise,Set,Weight,Reps"];
    Object.entries(data).forEach(([w, weekData]) => {
      Object.entries(weekData).forEach(([day, dayData]) => {
        Object.entries(dayData).forEach(([exercise, sets]) => {
          sets.forEach((set, idx) => {
            lines.push([
              w,
              day,
              exercise,
              idx + 1,
              set.weight,
              set.reps
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

  if (view === "guide") {
    return (
      <div style={backgroundStyle(backgroundGuide)}>
        <h2 style={{ color: "#f97316" }}>Progressive Loading Table (RIR-style)</h2>
        <ul>
          <li>Set 1: Easy (70%) – Lightest weight – warm-up pace</li>
          <li>Set 2: Moderate (80–85%) – Slightly heavier – still controlled</li>
          <li>Set 3: Hard (90%) – Heavier again – challenge your strength</li>
          <li>Set 4: Max Effort (95–100%) – Heaviest you can go for 10 reps or close to failure</li>
        </ul>
        <p>Example: Dumbbell Shoulder Press – Set 1: 14kg, Set 2: 16kg, Set 3: 18kg, Set 4: 20kg</p>
        <p>This method minimizes injury risk and builds strength efficiently.</p>
        <button onClick={() => setView("home")}>Back to Home</button>
      </div>
    );
  }

  if (view === "analysis") {
    return (
      <div style={backgroundStyle(backgroundAnalysis)}>
        <h2 style={{ color: '#f97316' }}>Workout Analysis - {week}</h2>
        <p>Session Duration: {duration}s</p>
        <button onClick={exportToCSV}>Export CSV</button>
        <button onClick={() => setView("home")}>Back to Home</button>
      </div>
    );
  }

  if (view === "workout") {
    return (
      <div style={backgroundStyle(backgroundWorkout)}>
        <h2 style={{ color: '#f97316' }}>{week}</h2>
        <select value={week} onChange={(e) => setWeek(e.target.value)}>
          {weeks.map((w) => <option key={w}>{w}</option>)}
        </select>

        <div style={{ marginTop: '1rem' }}>
          <label>Rest Timer:</label>
          <select value={selectedCountdown} onChange={(e) => setSelectedCountdown(Number(e.target.value))}>
            <option value={60}>60 seconds</option>
            <option value={90}>90 seconds</option>
            <option value={120}>120 seconds</option>
            <option value={180}>180 seconds</option>
          </select>
          <button onClick={() => setCountdown(selectedCountdown)}>Start Timer</button>
          {countdown > 0 && <p>Countdown: {countdown}s</p>}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => setStartTime(Date.now())}>Start Session</button>
          <button onClick={() => {
            setDuration(timer);
            setStartTime(null);
          }}>End Session</button>
          <p>Live Timer: {timer}s</p>
        </div>

        {Object.entries(workoutPlan).map(([day, exercises]) => (
          <div key={day}>
            <h3
              style={{ color: '#f97316', cursor: 'pointer' }}
              onClick={() => toggleDay(day)}>{day}</h3>

            {expandedDays.includes(day) && exercises.map((exercise, i) => (
              <div key={i}>
                <strong>{exercise}</strong>
                {[0, 1, 2, 3].map((setIndex) => (
                  <div key={setIndex}>
                    <input
                      placeholder="Weight (kg)"
                      type="number"
                      value={data[week]?.[day]?.[exercise]?.[setIndex]?.weight || ''}
                      onChange={(e) => handleInputChange(day, exercise, setIndex, 'weight', e.target.value)}
                    />
                    <input
                      placeholder="Reps"
                      type="number"
                      value={data[week]?.[day]?.[exercise]?.[setIndex]?.reps || ''}
                      onChange={(e) => handleInputChange(day, exercise, setIndex, 'reps', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        <button onClick={exportToCSV}>Export to CSV</button>
        <button onClick={() => setView("home")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={backgroundStyle(backgroundHome)}>
      <h1 style={{ fontSize: "2.5rem", color: "#f97316", textAlign: "center" }}>
        Put The Work In <br /> Let's Do This!
      </h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={() => setView("workout")}>Start Workout</button>
        <button onClick={() => setView("analysis")}>View Analysis</button>
        <button onClick={() => setView("guide")}>Loading Guide</button>
      </div>
    </div>
  );
}