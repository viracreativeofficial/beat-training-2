"use client";

import { useEffect, useState } from "react";
import { useMetronome } from "./MetronomeContext";
import { TestResult, TrainingSession } from "@/types/session";
import { getAllSessions } from "@/lib/storage";

export default function TestResults() {
  const { logs, sessionStartTime, mode } = useMetronome();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // 当测试模式会话结束时，计算测试结果
    if (mode === "test" && !sessionStartTime && logs.length > 0) {
      calculateTestResults();
    }
  }, [sessionStartTime, logs, mode]);

  const calculateTestResults = () => {
    if (logs.length === 0) return;

    // 找到各区域的时间
    const zones = {
      steady: 0,
      flow: 0,
      edge: 0,
      stop: 0,
    };

    let maxComfortableBPM = 0;
    let maxEdgeBPM = 0;
    let firstEdgeTime = -1;
    let lastStopTime = -1;
    let recoveryTime: number | null = null;

    for (let i = 0; i < logs.length - 1; i++) {
      const current = logs[i];
      const next = logs[i + 1];
      const duration = next.time - current.time;

      // 累计各区域时间
      zones[current.zone as keyof typeof zones] += duration;

      // 找到最大舒适BPM（Steady或Flow状态下的最大BPM）
      if ((current.zone === "Steady" || current.zone === "Flow") && current.bpm > maxComfortableBPM) {
        maxComfortableBPM = current.bpm;
      }

      // 找到最大Edge BPM
      if (current.zone === "Edge" && current.bpm > maxEdgeBPM) {
        maxEdgeBPM = current.bpm;
      }

      // 找到首次进入Edge的时间
      if (current.zone === "Edge" && firstEdgeTime === -1) {
        firstEdgeTime = current.time;
      }

      // 找到最后进入STOP的时间
      if (current.zone === "STOP") {
        lastStopTime = current.time;
      }
    }

    // 计算恢复时间（从STOP回到Steady的时间）
    if (lastStopTime !== -1) {
      const afterStopLogs = logs.filter((log) => log.time > lastStopTime);
      const firstSteadyAfterStop = afterStopLogs.find((log) => log.zone === "Steady");
      if (firstSteadyAfterStop) {
        recoveryTime = firstSteadyAfterStop.time - lastStopTime;
      }
    }

    // 基线BPM：能稳定保持的最大Steady BPM
    const steadyLogs = logs.filter((log) => log.zone === "Steady");
    const baselineBPM = steadyLogs.length > 0 
      ? Math.max(...steadyLogs.map((log) => log.bpm))
      : maxComfortableBPM;

    const result: TestResult = {
      sessionId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      baselineBPM: Math.round(baselineBPM),
      maxComfortableBPM: Math.round(maxComfortableBPM),
      maxEdgeBPM: Math.round(maxEdgeBPM),
      firstEdgeTime: firstEdgeTime !== -1 ? firstEdgeTime : 0,
      recoveryTime,
      zones,
    };

    setTestResult(result);
    setShowResults(true);

    // 保存到localStorage
    const existingResults = JSON.parse(
      localStorage.getItem("testResults") || "[]"
    ) as TestResult[];
    existingResults.push(result);
    localStorage.setItem("testResults", JSON.stringify(existingResults));
  };

  if (!showResults || !testResult) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">能力测试结果</h2>
          <button
            onClick={() => setShowResults(false)}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
            <h3 className="text-blue-300 text-sm font-semibold mb-2">核心指标</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-gray-400 text-xs">基线 BPM</div>
                <div className="text-white text-lg font-bold">{testResult.baselineBPM}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">最大舒适 BPM</div>
                <div className="text-white text-lg font-bold">{testResult.maxComfortableBPM}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">最大临界 BPM</div>
                <div className="text-white text-lg font-bold">{testResult.maxEdgeBPM}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">首次临界时间</div>
                <div className="text-white text-lg font-bold">
                  {testResult.firstEdgeTime > 0
                    ? `${Math.floor(testResult.firstEdgeTime / 60)}:${(testResult.firstEdgeTime % 60).toString().padStart(2, "0")}`
                    : "未达到"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
            <h3 className="text-gray-300 text-sm font-semibold mb-2">区域分布</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Steady (舒适)</span>
                <span className="text-white font-medium">
                  {Math.floor(testResult.zones.steady / 60)}:
                  {(testResult.zones.steady % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Flow (有感)</span>
                <span className="text-white font-medium">
                  {Math.floor(testResult.zones.flow / 60)}:
                  {(testResult.zones.flow % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Edge (临界)</span>
                <span className="text-white font-medium">
                  {Math.floor(testResult.zones.edge / 60)}:
                  {(testResult.zones.edge % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">STOP (急停)</span>
                <span className="text-white font-medium">
                  {Math.floor(testResult.zones.stop / 60)}:
                  {(testResult.zones.stop % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {testResult.recoveryTime !== null && (
            <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg">
              <div className="text-green-300 text-sm">
                <span className="font-semibold">恢复时间：</span>
                {Math.floor(testResult.recoveryTime / 60)}:
                {(testResult.recoveryTime % 60).toString().padStart(2, "0")}
              </div>
            </div>
          )}

          <div className="bg-yellow-900 bg-opacity-30 p-4 rounded-lg">
            <p className="text-yellow-300 text-sm">
              <strong>建议：</strong>
              基于你的基线BPM ({testResult.baselineBPM})，建议从{" "}
              {Math.max(20, testResult.baselineBPM - 5)} BPM 开始训练，逐步提升。
            </p>
          </div>

          <button
            onClick={() => setShowResults(false)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
