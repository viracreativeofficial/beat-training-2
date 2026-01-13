"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMetronome } from "./MetronomeContext";
import { TrainingSession, SessionConfig } from "@/types/session";
import { saveSession } from "@/lib/storage";
import { calculateSessionSummary } from "@/lib/analytics";

export default function SessionTracker() {
  const { logs, sessionStartTime, currentBPM, mode, modeConfig } = useMetronome();
  const hasSavedRef = useRef(false);
  const previousSessionStartTimeRef = useRef<number | null>(null);

  const saveCurrentSession = useCallback(() => {
    if (logs.length === 0) return;

    const config: SessionConfig = {
      ...modeConfig,
      baseBPM: modeConfig.baseBPM || currentBPM,
      mode: mode,
    };

    const summary = calculateSessionSummary(logs);

    const session: TrainingSession = {
      sessionId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      config,
      logs: [...logs], // 创建副本
      summary,
    };

    saveSession(session);
    console.log("会话已保存:", session);
  }, [logs, currentBPM, mode, modeConfig]);

  // 当会话结束时自动保存
  useEffect(() => {
    // 检测会话从有到无的转换（会话结束）
    if (
      previousSessionStartTimeRef.current !== null &&
      sessionStartTime === null &&
      logs.length > 0 &&
      !hasSavedRef.current
    ) {
      saveCurrentSession();
      hasSavedRef.current = true;
    } else if (sessionStartTime !== null) {
      hasSavedRef.current = false;
    }
    previousSessionStartTimeRef.current = sessionStartTime;
  }, [sessionStartTime, logs, saveCurrentSession]);

  // 这个组件主要负责追踪和保存，不渲染UI
  return null;
}
