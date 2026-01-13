export type Zone = "Steady" | "Flow" | "Edge" | "STOP";

export type MetronomeMode = "steady" | "step-up" | "interval" | "test";

export interface SessionLog {
  time: number; // 时间戳（秒）
  bpm: number;
  zone: Zone;
}

export interface SessionConfig {
  baseBPM: number;
  mode: MetronomeMode;
  stepUpInterval?: number; // 分钟
  stepUpAmount?: number; // BPM增量
  intervalHighBPM?: number;
  intervalLowBPM?: number;
  intervalDuration?: number; // 秒
  testStartBPM?: number; // 测试起始BPM
  testStepBPM?: number; // 测试步进BPM
  testStepDuration?: number; // 每个BPM测试时长（秒）
}

export interface TestResult {
  sessionId: string;
  timestamp: string;
  baselineBPM: number; // 基线BPM（能稳定保持的BPM）
  maxComfortableBPM: number; // 最大舒适BPM
  maxEdgeBPM: number; // 最大临界BPM
  firstEdgeTime: number; // 首次进入Edge的时间（秒）
  recoveryTime: number | null; // 恢复时间
  zones: {
    steady: number; // 各区域停留时间
    flow: number;
    edge: number;
    stop: number;
  };
}

export interface SessionSummary {
  totalDuration: number; // 总时长（秒）
  edgeTime: number; // Edge状态累计时间（秒）
  maxBPM: number;
  recoveryRate: number | null; // 恢复时间（秒），null表示未触发
  etlScore: number; // 有效训练负荷
  steadyTime: number;
  flowTime: number;
  stopCount: number;
}

export interface TrainingSession {
  sessionId: string;
  timestamp: string; // ISO日期字符串
  config: SessionConfig;
  logs: SessionLog[];
  summary: SessionSummary;
}
