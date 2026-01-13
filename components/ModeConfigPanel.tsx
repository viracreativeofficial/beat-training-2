"use client";

import { useState } from "react";
import { useMetronome } from "./MetronomeContext";
import { MetronomeMode } from "@/types/session";

export default function ModeConfigPanel() {
  const { mode, modeConfig, updateModeConfig, isPlaying } = useMetronome();
  const [isOpen, setIsOpen] = useState(false);

  if (isPlaying) {
    return null; // 播放时不允许修改配置
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-32 z-20 px-3 py-1.5 bg-gray-800 bg-opacity-70 text-white rounded-lg hover:bg-opacity-90 transition text-xs"
        title="配置模式参数"
      >
        配置
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-bold">模式配置</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            {/* 稳定模式配置 */}
            {mode === "steady" && (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">基础 BPM</label>
                  <input
                    type="number"
                    min="20"
                    max="120"
                    value={modeConfig.baseBPM || 40}
                    onChange={(e) =>
                      updateModeConfig({ baseBPM: parseInt(e.target.value) || 40 })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* 阶梯模式配置 */}
            {mode === "step-up" && (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">起始 BPM</label>
                  <input
                    type="number"
                    min="20"
                    max="120"
                    value={modeConfig.baseBPM || 40}
                    onChange={(e) =>
                      updateModeConfig({ baseBPM: parseInt(e.target.value) || 40 })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">
                    递增间隔（分钟）
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={modeConfig.stepUpInterval || 5}
                    onChange={(e) =>
                      updateModeConfig({ stepUpInterval: parseInt(e.target.value) || 5 })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">每次递增 BPM</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={modeConfig.stepUpAmount || 5}
                    onChange={(e) =>
                      updateModeConfig({ stepUpAmount: parseInt(e.target.value) || 5 })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* 间歇模式配置 */}
            {mode === "interval" && (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">高频率 BPM</label>
                  <input
                    type="number"
                    min="20"
                    max="120"
                    value={modeConfig.intervalHighBPM || 60}
                    onChange={(e) =>
                      updateModeConfig({ intervalHighBPM: parseInt(e.target.value) || 60 })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">低频率 BPM</label>
                  <input
                    type="number"
                    min="20"
                    max="120"
                    value={modeConfig.intervalLowBPM || 40}
                    onChange={(e) =>
                      updateModeConfig({ intervalLowBPM: parseInt(e.target.value) || 40 })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">
                    切换间隔（秒）
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={modeConfig.intervalDuration || 30}
                    onChange={(e) =>
                      updateModeConfig({ intervalDuration: parseInt(e.target.value) || 30 })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* 测试模式配置 */}
            {mode === "test" && (
              <div className="space-y-4">
                <div className="bg-blue-900 bg-opacity-30 p-3 rounded-lg mb-4">
                  <p className="text-blue-300 text-sm">
                    测试模式将自动逐步增加BPM，评估你的能力基线
                  </p>
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">起始 BPM</label>
                  <input
                    type="number"
                    min="20"
                    max="60"
                    value={modeConfig.testStartBPM || 30}
                    onChange={(e) =>
                      updateModeConfig({ testStartBPM: parseInt(e.target.value) || 30 })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">每次增加 BPM</label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={modeConfig.testStepBPM || 5}
                    onChange={(e) =>
                      updateModeConfig({ testStepBPM: parseInt(e.target.value) || 5 })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">
                    每个BPM测试时长（秒）
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="180"
                    value={modeConfig.testStepDuration || 60}
                    onChange={(e) =>
                      updateModeConfig({ testStepDuration: parseInt(e.target.value) || 60 })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              完成
            </button>
          </div>
        </div>
      )}
    </>
  );
}
