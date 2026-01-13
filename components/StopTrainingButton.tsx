"use client";

import { useState } from "react";
import { useMetronome } from "./MetronomeContext";

export default function StopTrainingButton() {
  const { isPlaying, stopSession, sessionStartTime } = useMetronome();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isPlaying && !sessionStartTime) {
    return null; // 没有活动会话时不显示
  }

  const handleStop = () => {
    if (isPlaying) {
      setShowConfirm(true);
    } else {
      // 如果已经停止但还有会话数据，直接结束
      stopSession();
    }
  };

  const handleConfirm = (reason: "completed" | "cum" | "other") => {
    stopSession();
    setShowConfirm(false);
    
    // 可以在这里添加额外的日志记录
    console.log(`训练结束原因: ${reason}`);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={handleStop}
        className="absolute bottom-4 right-4 z-20 px-4 py-2 bg-red-600 bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition text-sm font-medium shadow-lg"
      >
        {isPlaying ? "停止训练" : "结束会话"}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-white text-lg font-bold mb-4">结束训练</h3>
            <p className="text-gray-300 text-sm mb-4">请选择结束原因：</p>
            
            <div className="space-y-2 mb-4">
              <button
                onClick={() => handleConfirm("completed")}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                完成训练
              </button>
              
              <button
                onClick={() => handleConfirm("cum")}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                已射精
              </button>
              
              <button
                onClick={() => handleConfirm("other")}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
              >
                其他原因
              </button>
            </div>
            
            <button
              onClick={handleCancel}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </>
  );
}
