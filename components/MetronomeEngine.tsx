"use client";

import { useEffect, useRef } from "react";
import { useMetronome } from "./MetronomeContext";

export default function MetronomeEngine() {
  const { mode, isPlaying, setBPM, modeConfig } = useMetronome();
  const stepUpIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const intervalStateRef = useRef<"high" | "low">("high");

  // 稳定模式：使用配置的baseBPM
  useEffect(() => {
    if (mode === "steady" && isPlaying) {
      setBPM(modeConfig.baseBPM || 40);
    }
  }, [mode, isPlaying, modeConfig.baseBPM, setBPM]);

  // Step Up模式：每X分钟增加Y BPM
  useEffect(() => {
    if (mode === "step-up" && isPlaying) {
      const intervalMinutes = modeConfig.stepUpInterval || 5;
      const stepAmount = modeConfig.stepUpAmount || 5;
      const baseBPM = modeConfig.baseBPM || 40;

      // 设置初始BPM
      setBPM(baseBPM);

      stepUpIntervalRef.current = setInterval(() => {
        setBPM((prev) => Math.min(220, prev + stepAmount));
      }, intervalMinutes * 60 * 1000);

      return () => {
        if (stepUpIntervalRef.current) {
          clearInterval(stepUpIntervalRef.current);
        }
      };
    } else {
      if (stepUpIntervalRef.current) {
        clearInterval(stepUpIntervalRef.current);
        stepUpIntervalRef.current = null;
      }
    }
  }, [mode, isPlaying, modeConfig.stepUpInterval, modeConfig.stepUpAmount, modeConfig.baseBPM, setBPM]);

  // Interval模式：高低频率交替
  useEffect(() => {
    if (mode === "interval" && isPlaying) {
      const highBPM = modeConfig.intervalHighBPM || 60;
      const lowBPM = modeConfig.intervalLowBPM || 40;
      const intervalDuration = (modeConfig.intervalDuration || 30) * 1000;

      // 设置初始BPM为低频率
      setBPM(lowBPM);
      intervalStateRef.current = "high";

      const intervalId = setInterval(() => {
        if (intervalStateRef.current === "high") {
          setBPM(highBPM);
          intervalStateRef.current = "low";
        } else {
          setBPM(lowBPM);
          intervalStateRef.current = "high";
        }
      }, intervalDuration);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [mode, isPlaying, modeConfig.intervalHighBPM, modeConfig.intervalLowBPM, modeConfig.intervalDuration, setBPM]);

  // 这个组件主要负责模式逻辑，不渲染UI
  return null;
}
