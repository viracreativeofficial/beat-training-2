"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrainingSession } from "@/types/session";
import { getAllSessions, getRecentSessions, clearAllSessions } from "@/lib/storage";
import AnalyticsChart from "@/components/AnalyticsChart";

export default function Dashboard() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [recentSessions, setRecentSessions] = useState<TrainingSession[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const all = getAllSessions();
    const recent = getRecentSessions(30);
    setSessions(all);
    setRecentSessions(recent);
  };

  const handleClearAll = () => {
    if (confirm("确定要清除所有训练数据吗？此操作不可恢复。")) {
      clearAllSessions();
      loadSessions();
    }
  };

  // 计算总体统计
  const totalSessions = sessions.length;
  const totalTrainingTime = sessions.reduce(
    (sum, s) => sum + s.summary.totalDuration,
    0
  );
  const totalEdgeTime = sessions.reduce(
    (sum, s) => sum + s.summary.edgeTime,
    0
  );
  const avgETL = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + s.summary.etlScore, 0) / sessions.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">训练数据分析</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            返回训练
          </Link>
        </div>

        {/* 总体统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">总训练次数</div>
            <div className="text-2xl font-bold">{totalSessions}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">总训练时长</div>
            <div className="text-2xl font-bold">
              {Math.round(totalTrainingTime / 60)} 分钟
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">总Edge时间</div>
            <div className="text-2xl font-bold">
              {Math.round(totalEdgeTime / 60)} 分钟
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">平均ETL</div>
            <div className="text-2xl font-bold">
              {Math.round(avgETL)}
            </div>
          </div>
        </div>

        {/* 图表 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <AnalyticsChart sessions={recentSessions} />
        </div>

        {/* 最近会话列表 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">最近训练记录</h2>
            {sessions.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1 text-sm bg-red-600 rounded hover:bg-red-700 transition"
              >
                清除所有数据
              </button>
            )}
          </div>
          {sessions.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              暂无训练记录
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 10).map((session) => (
                <div
                  key={session.sessionId}
                  className="bg-gray-700 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">
                        {new Date(session.timestamp).toLocaleString("zh-CN")}
                      </div>
                      <div className="text-sm text-gray-400">
                        模式: {session.config.mode} | 基础BPM: {session.config.baseBPM}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">时长: </span>
                      {Math.round(session.summary.totalDuration / 60)} 分钟
                    </div>
                    <div>
                      <span className="text-gray-400">Edge时间: </span>
                      {Math.round(session.summary.edgeTime / 60)} 分钟
                    </div>
                    <div>
                      <span className="text-gray-400">最大BPM: </span>
                      {session.summary.maxBPM}
                    </div>
                    <div>
                      <span className="text-gray-400">ETL: </span>
                      {Math.round(session.summary.etlScore)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
