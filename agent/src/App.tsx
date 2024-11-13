import "./App.css";

// @ts-expect-error - TS7016: Could not find a declaration file for module 'ping.js'.
import Ping from "ping.js";
import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { getDeviceName, isMobileTablet } from "./utils";

type Data = {
  deviceId?: string;
  ping: `${number}`;
  cpuUsagePercentage: `${number}`;
  timestamp: string;
  deviceType: "desktop" | "mobile";
  isOnline: boolean;
};

function App() {
  const [ip, setIp] = useState(localStorage.getItem("hubIp"));
  const [id, setId] = useState(localStorage.getItem("deviceId"));

  const p = new Ping();

  useEffect(() => {
    const report = setInterval(async () => {
      const ping = await p.ping("https://github.com");

      await fetch(`http://${ip}:3000/api/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: id ?? getDeviceName(),
          deviceType: isMobileTablet() ? "mobile" : "desktop",
          ping: `${ping}`,
          cpuUsagePercentage: `${Math.floor(Math.random() * 100)}`,
          timestamp: new Date().toISOString(),
          isOnline: true,
        } satisfies Data),
      });
    }, 1000);

    return () => {
      clearInterval(report);
    };
  }, []);

  return (
    <main className="container">
      <h1>Network Stability Watchdog Agent</h1>

      <div className="row">
        <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>

      <p>Please filll the form below:</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem("hubIp", ip ?? "");
        }}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "white",
            marginRight: "10px",
          }}
        >
          Hub IP:
        </span>
        <input
          onChange={(e) => setIp(e.currentTarget.value)}
          defaultValue={ip ?? ""}
          placeholder="Hub IP..."
        />
        <button type="submit">Save</button>
      </form>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem("deviceId", id ?? getDeviceName());
        }}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "white",
            marginRight: "10px",
          }}
        >
          Device ID:
        </span>
        <input
          onChange={(e) => setId(e.currentTarget.value)}
          defaultValue={id ?? getDeviceName()}
          placeholder="Device ID..."
        />
        <button type="submit">Save</button>
      </form>
    </main>
  );
}

export default App;
