"use client";

import { useMetronome } from "./MetronomeContext";
import { MetronomeMode } from "@/types/session";

const modeOptions: { value: MetronomeMode; label: string; description: string }[] = [
  { value: "steady", label: "稳定", description: "固定 BPM" },
  { value: "step-up", label: "阶梯", description: "自动递增" },
  { value: "interval", label: "间歇", description: "高低交替" },
  { value: "test", label: "测试", description: "能力评估" },
];

export default function ModeSelector() {
  const { mode, setMode, isPlaying } = useMetronome();

  return (
    <div className="absolute top-4 left-4 z-20 bg-gray-800 bg-opacity-70 rounded-lg p-2 backdrop-blur-sm">
      <div className="flex gap-2">
        {modeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => !isPlaying && setMode(option.value)}
            disabled={isPlaying}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition-all
              ${
                mode === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }
              ${isPlaying ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            title={option.description}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
