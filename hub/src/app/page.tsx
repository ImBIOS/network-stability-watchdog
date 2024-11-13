"use client";

import { useEffect, useState } from "react";
import { type Data, database } from "~/data/shared";

export default function HomePage() {
  const [agents, setAgents] = useState(
    Array.from(database.keys()).map((id) => ({
      id,
      ...database.get(id),
    })),
  );
  const pingColor = (ping: number) => {
    if (ping < 300) return "text-green-500";
    if (ping < 500) return "text-yellow-500";
    return "text-red-500";
  };
  const onlineStatusColor = (isOnline: boolean) =>
    isOnline ? "text-white" : "text-red-500";

  useEffect(() => {
    const interval = setInterval(() => {
      void fetch("/api/report", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setAgents(
            data as {
              deviceType?: "desktop" | "mobile" | undefined;
              latestPing?: string | undefined;
              latestCpuUsagePercentage?: string | undefined;
              data?:
                | Map<string, Omit<Data, "deviceId" | "timestamp">>
                | undefined;
              id: string;
            }[],
          );
        });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Watchdog <span className="text-[hsl(280,100%,70%)]">Hub</span> App
        </h1>
        {agents.length === 0 && (
          <div className="text-center text-2xl font-bold">
            No agents connected
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20 ${onlineStatusColor(agent.isOnline)}`}
            >
              <h3 className="text-2xl font-bold">
                {agent.id} {agent.deviceType === "desktop" ? "🖥" : "📱"}
              </h3>
              {/* Ping */}
              <div className={`text-lg ${pingColor(Number(agent.latestPing))}`}>
                <span className="font-bold">🛜 Ping:</span> {agent.latestPing}
              </div>
              {/* CPU Usage Percentage */}
              <div className="text-lg">
                <span className="font-bold">
                  {agent.deviceType === "desktop" ? "🖥" : "📱"} CPU Usage:
                </span>{" "}
                {agent.latestCpuUsagePercentage}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
