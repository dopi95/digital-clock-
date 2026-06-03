import { useState, useEffect, useRef } from "react";

const load = (key, fallback) => {
  const saved = localStorage.getItem(key);
  return saved !== null ? JSON.parse(saved) : fallback;
};

const format = (cs) => {
  const mins = String(Math.floor(cs / 6000)).padStart(2, "0");
  const secs = String(Math.floor((cs % 6000) / 100)).padStart(2, "0");
  const cent = String(cs % 100).padStart(2, "0");
  return { mins, secs, cent };
};

export default function CountdownTimer() {
  const [cs, setCs] = useState(() => load("timer_cs", 0));
  const [paused, setPaused] = useState(() => load("timer_paused", false));
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState(() => load("timer_laps", []));
  const intervalRef = useRef(null);

  // persist cs
  useEffect(() => { localStorage.setItem("timer_cs", JSON.stringify(cs)); }, [cs]);
  // persist paused
  useEffect(() => { localStorage.setItem("timer_paused", JSON.stringify(paused)); }, [paused]);
  // persist laps
  useEffect(() => { localStorage.setItem("timer_laps", JSON.stringify(laps)); }, [laps]);

  // interval
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setCs(c => c + 1), 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const start = () => { setRunning(true); setPaused(false); };
  const pause = () => { setRunning(false); setPaused(true); };
  const reset = () => {
    setRunning(false);
    setPaused(false);
    setCs(0);
    setLaps([]);
    localStorage.removeItem("timer_cs");
    localStorage.removeItem("timer_paused");
    localStorage.removeItem("timer_laps");
  };
  const lap = () => {
    const { mins, secs, cent } = format(cs);
    setLaps(prev => [...prev, `${mins}:${secs}.${cent}`]);
  };

  const { mins, secs, cent } = format(cs);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Timer</h2>
      <p style={{ fontSize: "3rem", fontFamily: "monospace" }}>
        {mins}:{secs}.<span style={{ fontSize: "2rem" }}>{cent}</span>
      </p>

      <button onClick={start} disabled={running}>
        {paused ? "Continue" : "Start"}
      </button>
      <button onClick={pause} disabled={!running}>Pause</button>
      <button onClick={lap} disabled={!running}>Lap</button>
      <button onClick={reset}>Reset</button>

      {laps.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h3>Laps</h3>
          <ol style={{ display: "inline-block", textAlign: "left", fontFamily: "monospace", fontSize: "1.2rem" }}>
            {laps.map((l, i) => <li key={i}>Lap {i + 1} — {l}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}
