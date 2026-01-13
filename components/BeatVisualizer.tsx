"use client";

import { useEffect, useState } from "react";
import { useMetronome } from "./MetronomeContext";

export default function BeatVisualizer() {
  const { currentBPM, isPlaying, currentZone } = useMetronome();
  const [pulseScale, setPulseScale] = useState(1);
  const [pulseOpacity, setPulseOpacity] = useState(0.3);

  useEffect(() => {
    if (!isPlaying) {
      setPulseScale(1);
      setPulseOpacity(0.3);
      return;
    }

    const intervalMs = (60 / currentBPM) * 1000;
    let animationFrameId: number;

    const animate = () => {
      const startTime = Date.now();
      const animateStep = () => {
        const elapsed = (Date.now() - startTime) % intervalMs;
        const progress = elapsed / intervalMs;

        // 创建脉冲效果：在节拍时放大并变亮
        if (progress < 0.2) {
          // 前20%的时间：快速放大
          const scale = 1 + (progress / 0.2) * 0.3; // 放大到1.3倍
          const opacity = 0.3 + (progress / 0.2) * 0.7; // 不透明度从0.3到1.0
          setPulseScale(scale);
          setPulseOpacity(opacity);
        } else {
          // 剩余时间：缓慢恢复
          const fadeProgress = (progress - 0.2) / 0.8;
          const scale = 1.3 - fadeProgress * 0.3;
          const opacity = 1.0 - fadeProgress * 0.7;
          setPulseScale(Math.max(1, scale));
          setPulseOpacity(Math.max(0.3, opacity));
        }

        animationFrameId = requestAnimationFrame(animateStep);
      };
      animateStep();
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentBPM, isPlaying]);

  // 根据当前Zone选择颜色
  const getZoneColor = () => {
    switch (currentZone) {
      case "Steady":
        return "bg-steady";
      case "Flow":
        return "bg-flow";
      case "Edge":
        return "bg-edge";
      case "STOP":
        return "bg-stop";
      default:
        return "bg-gray-500";
    }
  };

  if (!isPlaying) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-10">
      <div
        className={`${getZoneColor()} rounded-full transition-all duration-75 ease-out`}
        style={{
          width: `${80 * pulseScale}px`,
          height: `${80 * pulseScale}px`,
          opacity: pulseOpacity,
          boxShadow: `0 0 ${40 * pulseScale}px ${40 * pulseScale}px rgba(255, 255, 255, ${pulseOpacity * 0.3})`,
        }}
      />
    </div>
  );
}
