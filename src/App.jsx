import DigitalClock from "./DigitalClock";
import CountdownTimer from "./CountdownTimer";

export default function App() {
  return (
    <div style={{ marginTop: "60px" }}>
      <DigitalClock />
      <hr />
      <CountdownTimer />
    </div>
  );
}
