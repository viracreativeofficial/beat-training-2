"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { Zone, MetronomeMode, SessionLog, SessionConfig } from "@/types/session";
import { MetronomeAudio } from "@/lib/audio";

interface MetronomeContextType {
  // 状态
  currentZone: Zone;
  currentBPM: number;
  mode: MetronomeMode;
  isPlaying: boolean;
  sessionStartTime: number | null;
  logs: SessionLog[];
  modeConfig: SessionConfig;
  
  // 方法
  setZone: (zone: Zone) => void;
  setBPM: (bpm: number | ((prev: number) => number)) => void;
  setMode: (mode: MetronomeMode) => void;
  updateModeConfig: (config: Partial<SessionConfig>) => void;
  startSession: () => void;
  stopSession: () => void;
  togglePlay: () => void;
}

const MetronomeContext = createContext<MetronomeContextType | undefined>(undefined);

export function MetronomeProvider({ children }: { children: React.ReactNode }) {
  const [currentZone, setCurrentZone] = useState<Zone>("Steady");
  const [currentBPM, setCurrentBPM] = useState<number>(40);
  const [mode, setMode] = useState<MetronomeMode>("steady");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [modeConfig, setModeConfig] = useState<SessionConfig>({
    baseBPM: 40,
    mode: "steady",
    stepUpInterval: 5,
    stepUpAmount: 5,
    intervalHighBPM: 60,
    intervalLowBPM: 40,
    intervalDuration: 30,
    testStartBPM: 30,
    testStepBPM: 5,
    testStepDuration: 60,
  });
  
  const audioRef = useRef<MetronomeAudio | null>(null);
  const lastLogTimeRef = useRef<number>(0);

  // 初始化音频引擎
  useEffect(() => {
    audioRef.current = new MetronomeAudio();
    return () => {
      audioRef.current?.destroy();
    };
  }, []);

  // 更新BPM时同步到音频引擎
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.setBPM(currentBPM);
    }
  }, [currentBPM]);

  // 记录日志
  const logZoneChange = useCallback((zone: Zone, bpm: number) => {
    if (!sessionStartTime) return; // 如果会话未开始，不记录
    
    const now = Date.now();
    const elapsed = (now - sessionStartTime) / 1000;
    
    setLogs((prev) => {
      // 避免重复记录相同状态
      if (prev.length > 0) {
        const lastLog = prev[prev.length - 1];
        if (lastLog.zone === zone && Math.abs(elapsed - lastLogTimeRef.current) < 1) {
          return prev;
        }
      }

      const newLog: SessionLog = {
        time: Math.round(elapsed),
        bpm,
        zone,
      };

      lastLogTimeRef.current = elapsed;
      return [...prev, newLog];
    });
  }, [sessionStartTime]);

  const setZone = useCallback((zone: Zone) => {
    setCurrentZone(zone);
    logZoneChange(zone, currentBPM);
  }, [currentBPM, logZoneChange]);

  const setBPM = useCallback((bpm: number | ((prev: number) => number)) => {
    setCurrentBPM((prev) => {
      const newBPM = typeof bpm === "function" ? bpm(prev) : bpm;
      const clampedBPM = Math.max(20, Math.min(220, newBPM));
      logZoneChange(currentZone, clampedBPM);
      return clampedBPM;
    });
  }, [currentZone, logZoneChange]);

  const updateMode = useCallback((newMode: MetronomeMode) => {
    setMode(newMode);
    setModeConfig((prev) => ({ ...prev, mode: newMode }));
  }, []);

  const updateModeConfig = useCallback((config: Partial<SessionConfig>) => {
    setModeConfig((prev) => ({ ...prev, ...config }));
  }, []);

  const startSession = useCallback(() => {
    setSessionStartTime(Date.now());
    setLogs([]);
    lastLogTimeRef.current = 0;
    // 记录初始状态
    logZoneChange(currentZone, currentBPM);
  }, [currentZone, currentBPM, logZoneChange]);

  const stopSession = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.stop();
    }
    setIsPlaying(false);
    
    // 在停止前记录最后的状态
    if (sessionStartTime) {
      const now = Date.now();
      const elapsed = (now - sessionStartTime) / 1000;
      const finalLog: SessionLog = {
        time: Math.round(elapsed),
        bpm: currentBPM,
        zone: currentZone,
      };
      
      setLogs((prev) => {
        // 避免重复记录相同时间点的日志
        if (prev.length > 0) {
          const lastLog = prev[prev.length - 1];
          if (lastLog.time === finalLog.time && lastLog.zone === finalLog.zone) {
            return prev;
          }
        }
        return [...prev, finalLog];
      });
    }
    
    // 延迟重置sessionStartTime，让SessionTracker有时间保存
    setTimeout(() => {
      setSessionStartTime(null);
    }, 100);
  }, [sessionStartTime, currentBPM, currentZone]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.stop();
      setIsPlaying(false);
    } else {
      // 如果还没有开始会话，先开始
      if (sessionStartTime === null) {
        startSession();
      }
      audioRef.current.start();
      setIsPlaying(true);
    }
  }, [isPlaying, sessionStartTime, startSession]);

  // 设置节拍回调（用于可视化）
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.setBeatCallback(() => {
        // 节拍回调可以在这里触发可视化更新
      });
    }
  }, [isPlaying]);

  const value: MetronomeContextType = {
    currentZone,
    currentBPM,
    mode,
    isPlaying,
    sessionStartTime,
    logs,
    modeConfig,
    setZone,
    setBPM,
    setMode: updateMode,
    updateModeConfig,
    startSession,
    stopSession,
    togglePlay,
  };

  return (
    <MetronomeContext.Provider value={value}>
      {children}
    </MetronomeContext.Provider>
  );
}

export function useMetronome() {
  const context = useContext(MetronomeContext);
  if (context === undefined) {
    throw new Error("useMetronome must be used within a MetronomeProvider");
  }
  return context;
}
