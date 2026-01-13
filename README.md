# README.md

# TempoLab: Quantitative Stamina Training System

**TempoLab** 是一款基於神經科學理論與行為療法的男性性耐力訓練工具。它透過定量的「節拍器」調節與「四大興奮區」數據追蹤，協助使用者重塑射精反射，打破早洩 (PE) 的錯誤條件反射。

---

## 1. 科學背景 (Scientific Foundation)

本專案基於以下研究原理：
*   **神經夾帶理論 (Neural Entrainment)**：性高潮是大腦神經元節律性同步的結果。透過節拍器控制物理刺激頻率（BPM），可防止大腦過早進入共振鎖定狀態。
*   **定量動停法 (Quantitative Stop-Start)**：將傳統模糊的行為療法轉化為可量化的速度梯度訓練。
*   **盆底肌協調 (Pelvic Floor Coordination)**：透過聽覺節奏引導使用者在刺激中主動放鬆盆底肌肉（逆向凱格爾）。

---

## 2. 核心功能規格 (Core Features)

### A. 高精度節拍器引擎
*   **技術**：使用 `Web Audio API` 以確保在行動裝置後台運行時保持精確。
*   **範圍**：20 BPM - 120 BPM。
*   **模式**：
    *   **Steady (穩定)**：固定 BPM。
    *   **Step Up (階梯)**：每 X 分鐘自動增加 Y BPM。
    *   **Interval (間歇)**：高低頻率交替衝刺。

### B. 簡化版 4-Zone UI (使用者輸入)
介面由四個全螢幕寬度的大按鈕組成，方便盲操：
1.  **Steady (舒適 - 綠色)**：對應興奮度 1-4。刺激穩定，無壓力。
2.  **Flow (有感 - 黃色)**：對應興奮度 5-6。進入狀態，快感明顯。
3.  **Edge (臨界 - 橙色)**：對應興奮度 7-8。**黃金訓練區**，需高度專注控制。
4.  **STOP (急停 - 紅色)**：對應興奮度 9。接近不可逆點，必須降速或停止。

### C. 數據分析模型 (Advanced Analytics)
*   **有效訓練負荷 (ETL)**：`ETL = BPM * Time * Arousal_Weight`。
*   **平台期持久值 (Plateau Duration)**：統計單次訓練中處於 "Edge" 狀態的累計時間。
*   **興奮斜率 (Arousal Slope)**：計算興奮度上升的速度，識別過敏弱項。
*   **恢復率 (Recovery Rate)**：從按下 STOP 到恢復 Steady 所需的時間。

---

## 3. 技術棧 (Tech Stack)

*   **Framework**: Next.js (React) + Tailwind CSS
*   **State Management**: React Context or Zustand
*   **Charts**: Recharts (用於趨勢可視化)
*   **Storage**: LocalStorage (完全本地化存儲，保障極致隱私)
*   **Deployment**: PWA (Progressive Web App) 部署於 Vercel

---

## 4. 數據結構 (Data Schema)

```json
{
  "sessionId": "uuid",
  "timestamp": "iso-date",
  "config": { "baseBPM": 40, "mode": "step-up" },
  "logs": [
    { "time": 0, "bpm": 40, "zone": "Steady" },
    { "time": 120, "bpm": 40, "zone": "Flow" },
    { "time": 300, "bpm": 45, "zone": "Edge" }
  ],
  "summary": {
    "totalDuration": 600,
    "edgeTime": 150,
    "maxBPM": 55,
    "recoveryRate": "25s",
    "etlScore": 450.5
  }
}
```

---

## 5. 給 Cursor 的開發指令 (AI Prompts)

### 第一步：基礎 PWA 結構
> "Create a mobile-first Next.js app with PWA support. Implement a high-precision metronome using Web Audio API. The UI should feature 4 large vertical buttons: Steady (Green), Flow (Yellow), Edge (Orange), Stop (Red). Use Tailwind for styling."

### 第二步：分析邏輯實作
> "Implement the analytics engine. Track the time duration spent in each 'Zone'. Calculate the 'Effective Training Load' (ETL) where Edge zone time has a 5x multiplier. Store the session history in LocalStorage."

### 第三步：圖表與進度追蹤
> "Create a dashboard using Recharts. Show a line chart of 'Max Sustainable BPM' over the last 30 days. Add a 'Heatmap' showing which BPM/Zone combination the user spends most time in."

---

## 6. 訓練突破分析法 (User Guide for Analytics)

1.  **弱項診斷**：
    *   若 **Early Edge (前 3 分鐘進入 Edge)**：代表需要進行「低頻脫敏」，強化 20-30 BPM 的超低速練習。
    *   若 **Speed Wall (BPM 60 以上迅速崩潰)**：代表需要進行「間歇衝刺練習」，強迫神經適應高頻摩擦。
2.  **升級機制 (Level Up)**：
    *   當 **Edge Time > 5 分鐘** 且 **BPM 穩定度 > 80%** 時，系統自動建議下週提升 5 BPM。

---

## 7. 隱私與部署 (Privacy & Deployment)

*   **部署方式**：部署至 Vercel 後，在手機瀏覽器點擊「加入主畫面」即可像原生 App 一樣使用。
*   **隱私承諾**：所有數據僅保留於使用者手機 LocalStorage，不進行任何雲端同步，確保絕對隱私。

---

### 如何使用此文件？
1. 在 Cursor 中開啟專案。
2. 將此 `README.md` 內容貼入根目錄。
3. 選取此文件，向 Cursor 下令：**"Based on the specs in README.md, let's start building the Metronome Engine first."**