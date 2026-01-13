import { TrainingSession, SessionLog, Zone } from "@/types/session";

// Zone权重：Edge区域权重最高（5倍）
const ZONE_WEIGHTS: Record<Zone, number> = {
  Steady: 1,
  Flow: 2,
  Edge: 5,
  STOP: 0, // STOP不计入ETL
};

export function calculateETL(logs: SessionLog[]): number {
  let etl = 0;

  for (let i = 0; i < logs.length - 1; i++) {
    const current = logs[i];
    const next = logs[i + 1];
    const duration = next.time - current.time;
    const weight = ZONE_WEIGHTS[current.zone] || 1;
    etl += current.bpm * duration * weight;
  }

  return Math.round(etl * 10) / 10; // 保留一位小数
}

export function calculateEdgeTime(logs: SessionLog[]): number {
  let edgeTime = 0;

  for (let i = 0; i < logs.length - 1; i++) {
    if (logs[i].zone === "Edge") {
      edgeTime += logs[i + 1].time - logs[i].time;
    }
  }

  return Math.round(edgeTime);
}

export function calculateMaxBPM(logs: SessionLog[]): number {
  if (logs.length === 0) return 0;
  return Math.max(...logs.map((log) => log.bpm));
}

export function calculateRecoveryRate(logs: SessionLog[]): number | null {
  let lastStopTime: number | null = null;
  let recoveryTime: number | null = null;

  for (let i = 0; i < logs.length; i++) {
    if (logs[i].zone === "STOP") {
      lastStopTime = logs[i].time;
    } else if (lastStopTime !== null && logs[i].zone === "Steady") {
      recoveryTime = logs[i].time - lastStopTime;
      break;
    }
  }

  return recoveryTime;
}

export function calculateZoneTimes(logs: SessionLog[]): {
  steadyTime: number;
  flowTime: number;
  edgeTime: number;
} {
  let steadyTime = 0;
  let flowTime = 0;
  let edgeTime = 0;

  for (let i = 0; i < logs.length - 1; i++) {
    const duration = logs[i + 1].time - logs[i].time;
    switch (logs[i].zone) {
      case "Steady":
        steadyTime += duration;
        break;
      case "Flow":
        flowTime += duration;
        break;
      case "Edge":
        edgeTime += duration;
        break;
    }
  }

  return {
    steadyTime: Math.round(steadyTime),
    flowTime: Math.round(flowTime),
    edgeTime: Math.round(edgeTime),
  }
}

export function calculateArousalSlope(logs: SessionLog[]): number {
  if (logs.length < 2) return 0;

  // 将Zone转换为数值：Steady=1, Flow=2, Edge=3, STOP=4
  const zoneToValue: Record<Zone, number> = {
    Steady: 1,
    Flow: 2,
    Edge: 3,
    STOP: 4,
  };

  let totalSlope = 0;
  let count = 0;

  for (let i = 0; i < logs.length - 1; i++) {
    const currentValue = zoneToValue[logs[i].zone];
    const nextValue = zoneToValue[logs[i + 1].zone];
    const timeDiff = logs[i + 1].time - logs[i].time;

    if (timeDiff > 0) {
      const slope = (nextValue - currentValue) / timeDiff;
      totalSlope += slope;
      count++;
    }
  }

  return count > 0 ? Math.round((totalSlope / count) * 100) / 100 : 0;
}

export function calculateSessionSummary(
  logs: SessionLog[]
): TrainingSession["summary"] {
  if (logs.length === 0) {
    return {
      totalDuration: 0,
      edgeTime: 0,
      maxBPM: 0,
      recoveryRate: null,
      etlScore: 0,
      steadyTime: 0,
      flowTime: 0,
      stopCount: 0,
    };
  }

  const totalDuration = logs[logs.length - 1].time - logs[0].time;
  const zoneTimes = calculateZoneTimes(logs);
  const stopCount = logs.filter((log) => log.zone === "STOP").length;

  return {
    totalDuration: Math.round(totalDuration),
    edgeTime: zoneTimes.edgeTime,
    maxBPM: calculateMaxBPM(logs),
    recoveryRate: calculateRecoveryRate(logs),
    etlScore: calculateETL(logs),
    steadyTime: zoneTimes.steadyTime,
    flowTime: zoneTimes.flowTime,
    stopCount,
  };
}

export function getMaxSustainableBPM(sessions: TrainingSession[]): number {
  if (sessions.length === 0) return 0;

  // 找到每个会话中在Edge状态下维持最久的BPM
  const sustainableBPMs: number[] = [];

  for (const session of sessions) {
    let maxEdgeBPM = 0;
    let currentEdgeStart: SessionLog | null = null;
    let longestEdgeDuration = 0;

    for (let i = 0; i < session.logs.length; i++) {
      if (session.logs[i].zone === "Edge") {
        if (!currentEdgeStart) {
          currentEdgeStart = session.logs[i];
        }
      } else {
        if (currentEdgeStart) {
          const duration = session.logs[i].time - currentEdgeStart.time;
          if (duration > longestEdgeDuration) {
            longestEdgeDuration = duration;
            maxEdgeBPM = currentEdgeStart.bpm;
          }
          currentEdgeStart = null;
        }
      }
    }

    if (maxEdgeBPM > 0) {
      sustainableBPMs.push(maxEdgeBPM);
    }
  }

  return sustainableBPMs.length > 0
    ? Math.round(
        sustainableBPMs.reduce((a, b) => a + b, 0) / sustainableBPMs.length
      )
    : 0;
}
