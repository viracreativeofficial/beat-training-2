"use client";

import { useEffect, useState } from "react";
import { useMetronome } from "./MetronomeContext";

export default function TimeTracker() {
  const { sessionStartTime, isPlaying } = useMetronome();
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    if (!sessionStartTime || !isPlaying) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000); // 每秒更新一次

    return () => clearInterval(interval);
  }, [sessionStartTime, isPlaying]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  if (!sessionStartTime || !isPlaying) {
    return null;
  }

  return (
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 bg-gray-900 bg-opacity-80 rounded-lg px-4 py-2 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-white text-lg font-mono font-semibold">
          {formatTime(elapsedTime)}
        </span>
      </div>
    </div>
  );
}
