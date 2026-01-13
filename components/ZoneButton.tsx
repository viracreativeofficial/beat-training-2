"use client";

import { useState, useRef } from "react";
import { Zone } from "@/types/session";
import { useMetronome } from "./MetronomeContext";

interface ZoneButtonProps {
  zone: Zone;
  label: string;
  colorClass: string;
  description: string;
}

export default function ZoneButton({
  zone,
  label,
  colorClass,
  description,
}: ZoneButtonProps) {
  const { currentZone, setZone, togglePlay, isPlaying, currentBPM, stopSession } = useMetronome();
  const isActive = currentZone === zone;
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const handleClick = () => {
    // 如果是STOP按钮且正在长按，不执行点击
    if (zone === "STOP" && isLongPressing) {
      return;
    }
    
    setZone(zone);
    // 如果还没有开始，自动开始
    if (!isPlaying) {
      togglePlay();
    }
  };

  const handleLongPressStart = () => {
    if (zone === "STOP" && isPlaying) {
      setIsLongPressing(false);
      longPressTimerRef.current = setTimeout(() => {
        setIsLongPressing(true);
        stopSession();
      }, 1000); // 1秒长按
    }
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleLongPressStart}
      onMouseUp={handleLongPressEnd}
      onMouseLeave={handleLongPressEnd}
      onTouchStart={handleLongPressStart}
      onTouchEnd={handleLongPressEnd}
      className={`
        w-full h-full
        ${colorClass}
        ${isActive ? "opacity-100" : "opacity-70"}
        transition-all duration-200
        active:opacity-90
        active:scale-[0.98]
        touch-action: manipulation
        flex flex-col items-center justify-center
        text-white font-bold
        shadow-lg
        relative
      `}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div className="text-4xl md:text-6xl mb-2">{label}</div>
      <div className="text-sm md:text-base opacity-90 px-4 text-center">
        {description}
      </div>
      {zone === "STOP" && isPlaying && (
        <div className="mt-2 text-xs opacity-75 px-2 text-center">
          长按1秒停止训练
        </div>
      )}
      {isActive && (
        <div className="mt-2 text-xs opacity-75">
          {currentBPM} BPM
        </div>
      )}
    </button>
  );
}
