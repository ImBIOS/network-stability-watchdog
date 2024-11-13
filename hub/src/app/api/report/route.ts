import { type Data, database } from "~/data/shared";

export const POST = async (req: Request) => {
  const data = (await req.json()) as Data;
  const { deviceId, ...rest } = data;
  const device = database.get(deviceId);
  if (!device) {
    database.set(deviceId ?? database.size - 1, {
      deviceType: data.deviceType,
      latestPing: data.ping,
      latestCpuUsagePercentage: data.cpuUsagePercentage,
      data: new Map([[data.timestamp, rest]]),
      isOnline: true,
    });

    return Response.json({ success: true, msg: "Device added" });
  }
  device?.data.set(data.timestamp, rest);
  database.set(deviceId, {
    ...device,
    latestPing: data.ping,
    latestCpuUsagePercentage: data.cpuUsagePercentage,
  });

  return Response.json({ success: true, msg: "Data added" });
};

export const GET = async () => {
  const agents = Array.from(database.keys()).map((id) => ({
    id,
    ...database.get(id),
  }));

  return Response.json(agents);
};
