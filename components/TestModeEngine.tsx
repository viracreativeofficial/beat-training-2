"use client";

import { useEffect, useRef, useState } from "react";
import { useMetronome } from "./MetronomeContext";

export default function TestModeEngine() {
  const { mode, isPlaying, modeConfig, setBPM, currentBPM, currentZone, logs } =
    useMetronome();
  const [testPhase, setTestPhase] = useState<"idle" | "testing" | "completed">("idle");
  const [currentTestBPM, setCurrentTestBPM] = useState<number>(0);
  const testTimerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (mode === "test" && isPlaying && testPhase === "idle") {
      // 开始测试
      const startBPM = modeConfig.testStartBPM || 30;
      setCurrentTestBPM(startBPM);
      setBPM(startBPM);
      setTestPhase("testing");
      phaseStartTimeRef.current = Date.now();
    }

    if (mode === "test" && isPlaying && testPhase === "testing") {
      const stepDuration = (modeConfig.testStepDuration || 60) * 1000;
      const stepBPM = modeConfig.testStepBPM || 5;

      // 清理之前的定时器
      if (testTimerRef.current) {
        clearInterval(testTimerRef.current);
      }

      testTimerRef.current = setInterval(() => {
        // 检查当前阶段是否应该进入Edge或STOP
        if (currentZone === "STOP") {
          // 如果进入STOP，停止测试
          setTestPhase("completed");
          if (testTimerRef.current) {
            clearInterval(testTimerRef.current);
            testTimerRef.current = null;
          }
          return;
        }

        // 如果当前BPM下已经测试足够时间，增加BPM
        const elapsed = Date.now() - phaseStartTimeRef.current;
        if (elapsed >= stepDuration) {
          const nextBPM = Math.min(220, currentTestBPM + stepBPM);
          setCurrentTestBPM(nextBPM);
          setBPM(nextBPM);
          phaseStartTimeRef.current = Date.now();
        }
      }, 1000);

      return () => {
        if (testTimerRef.current) {
          clearInterval(testTimerRef.current);
          testTimerRef.current = null;
        }
      };
    }

    if (!isPlaying || mode !== "test") {
      if (testTimerRef.current) {
        clearInterval(testTimerRef.current);
        testTimerRef.current = null;
      }
      if (!isPlaying) {
        setTestPhase("idle");
        setCurrentTestBPM(0);
      }
    }
  }, [mode, isPlaying, testPhase, modeConfig, setBPM, currentTestBPM, currentZone]);

  return null; // 这个组件不渲染UI
}
