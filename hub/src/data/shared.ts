export type Data = {
  deviceId: string;
  ping: `${number}`;
  cpuUsagePercentage: `${number}`;
  timestamp: string;
  deviceType: "desktop" | "mobile";
};

export const database = new Map<
  string,
  {
    deviceType: "desktop" | "mobile";
    latestPing: string;
    latestCpuUsagePercentage: string;
    data: Map<string, Omit<Data, "deviceId" | "timestamp">>;
    isOnline: boolean;
  }
>();
