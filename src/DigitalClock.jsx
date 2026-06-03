import { useState, useEffect } from "react";

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div style={{ textAlign: "center", marginBottom: "40px" }}>
      <h2>Digital Clock</h2>
      <p style={{ fontSize: "3rem", fontFamily: "monospace" }}>
        {time.toLocaleTimeString()}
      </p>
    </div>
  );
}
