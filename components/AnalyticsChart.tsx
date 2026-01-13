"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrainingSession } from "@/types/session";
import { getMaxSustainableBPM } from "@/lib/analytics";

interface AnalyticsChartProps {
  sessions: TrainingSession[];
}

export default function AnalyticsChart({ sessions }: AnalyticsChartProps) {
  // 准备30天趋势数据
  const trendData = useMemo(() => {
    const days = 30;
    const data: Array<{ date: string; bpm: number }> = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // 获取该日期之前的会话
      const sessionsUpToDate = sessions.filter(
        (s) => new Date(s.timestamp) <= date
      );

      if (sessionsUpToDate.length > 0) {
        const maxBPM = getMaxSustainableBPM(sessionsUpToDate);
        data.push({
          date: dateStr,
          bpm: maxBPM,
        });
      } else {
        data.push({
          date: dateStr,
          bpm: 0,
        });
      }
    }

    return data;
  }, [sessions]);

  // 准备热力图数据（BPM/Zone组合）
  const heatmapData = useMemo(() => {
    const zoneMap: Record<string, number> = {};

    sessions.forEach((session) => {
      session.logs.forEach((log) => {
        const key = `${log.bpm}-${log.zone}`;
        zoneMap[key] = (zoneMap[key] || 0) + 1;
      });
    });

    // 转换为数组格式
    const data: Array<{ bpm: number; zone: string; count: number }> = [];
    Object.entries(zoneMap).forEach(([key, count]) => {
      const [bpm, zone] = key.split("-");
      data.push({
        bpm: parseInt(bpm),
        zone,
        count,
      });
    });

    return data.sort((a, b) => a.bpm - b.bpm);
  }, [sessions]);

  const zoneColors: Record<string, string> = {
    Steady: "#10b981",
    Flow: "#eab308",
    Edge: "#f97316",
    STOP: "#ef4444",
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        暂无训练数据，开始第一次训练吧！
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      {/* 最大可持续BPM趋势图 */}
      <div>
        <h3 className="text-xl font-bold mb-4">最大可持续BPM趋势 (30天)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis domain={[0, "dataMax + 10"]} />
            <Tooltip
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("zh-CN");
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="bpm"
              stroke="#3b82f6"
              strokeWidth={2}
              name="最大可持续BPM"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BPM/Zone热力图 */}
      <div>
        <h3 className="text-xl font-bold mb-4">BPM/Zone 训练分布</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={heatmapData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bpm" />
                <YAxis dataKey="zone" />
                <Tooltip />
                <Legend />
                {Object.keys(zoneColors).map((zone) => (
                  <Line
                    key={zone}
                    type="monotone"
                    dataKey="count"
                    data={heatmapData.filter((d) => d.zone === zone)}
                    stroke={zoneColors[zone]}
                    strokeWidth={2}
                    name={zone}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
