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
  initTime: number | null;
  limit: number;
  warning: number;
  danger: number;
  fontZoom: number;
}) {
  const now = useNow();
  const duration =
    props.initTime !== null ? now.getTime() - props.initTime : null;
  const remain =
    duration !== null
      ? props.limit - duration > 0
        ? props.limit - duration
        : 0
      : null;

  return (
    <div
      className="clock"
      style={{
        backgroundColor:
          remain === null
            ? "white"
            : remain >= props.warning
            ? "lightblue"
            : remain >= props.danger
            ? "pink"
            : "red",
      }}
    >
      {remain === null || remain === 0 ? (
        <div style={{ fontSize: 128 }}>计时停止/Clock stoped</div>
      ) : (
        <div style={{ fontSize: 128 + 16 * props.fontZoom }}>
          {format(remain, "mm:ss")}
        </div>
      )}

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
        limit={limit * 1000}
        warning={warning * 1000}
        danger={danger * 1000}
        initTime={initTime}
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
