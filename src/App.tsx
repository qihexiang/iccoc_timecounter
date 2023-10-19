import { format } from "date-fns";
import { useEffect, useState } from "react";
import "./App.css";

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(interval);
  });
  return now;
}

function Clock(props: {
  endTime: Date | null;
  warning: number;
  danger: number;
  fontZoom: number;
}) {
  const now = useNow();
  const wallClock = (
    <div
      style={{
        fontSize: 32,
        padding: 4,
        borderRadius: 8,
        backgroundColor: "white",
      }}
    >
      {format(now, "HH:mm")}
    </div>
  );
  if (props.endTime === null) {
    return (
      <div className="clock">
        <div style={{ fontSize: 128 }}>计时停止/Clock stopped</div>
        {wallClock}
      </div>
    );
  }
  const _secsRemain = Math.floor(
    (props.endTime.getTime() - now.getTime()) / 1000
  );
  const secsRemainCalculated = _secsRemain >= 0 ? _secsRemain : 0
  const [hours, afterHours] = [
    Math.floor(secsRemainCalculated / 3600),
    secsRemainCalculated % 3600,
  ];
  const [minutes, seconds] = [Math.floor(afterHours / 60), afterHours % 60];

  return (
    <div
      className="clock"
      style={{
        backgroundColor:
          secsRemainCalculated >= props.warning
            ? "lightblue"
            : secsRemainCalculated >= props.danger
            ? "pink"
            : "red",
      }}
    >
      <div style={{ fontSize: 128 + 16 * props.fontZoom }}>
        {hours === 0 ? null : `${hours.toString().padStart(2, "0")}:`}
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </div>
      {wallClock}
    </div>
  );
}

function App() {
  const [limit, setLimit] = useState(25 * 60);
  const [warning, setWarning] = useState(180);
  const [danger, setDanger] = useState(60);
  const [fontZoom, setZoom] = useState(0);
  const [initTime, setInitTime] = useState<number | null>(null);
  return (
    <div className="container">
      <Clock
        endTime={initTime === null ? null : new Date(initTime + limit * 1000)}
        warning={warning}
        danger={danger}
        fontZoom={fontZoom}
      ></Clock>
      <div className="settings">
        <input
          disabled={initTime !== null}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        ></input>
        <input
          disabled={initTime !== null}
          value={warning}
          onChange={(e) => setWarning(Number(e.target.value))}
        ></input>
        <input
          disabled={initTime !== null}
          value={danger}
          onChange={(e) => setDanger(Number(e.target.value))}
        ></input>
        <button
          disabled={initTime !== null}
          onClick={() => setInitTime(new Date().getTime())}
        >
          确认
        </button>
        <button disabled={initTime === null} onClick={() => setInitTime(null)}>
          停止
        </button>
        <button onClick={() => setZoom((zoom) => zoom + 1)}>+</button>
        <button onClick={() => setZoom((zoom) => zoom - 1)}>-</button>
      </div>
    </div>
  );
}

export default App;
