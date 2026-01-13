"use client";

import Link from "next/link";
import { MetronomeProvider } from "@/components/MetronomeContext";
import ZoneButton from "@/components/ZoneButton";
import MetronomeEngine from "@/components/MetronomeEngine";
import BeatVisualizer from "@/components/BeatVisualizer";
import SessionTracker from "@/components/SessionTracker";
import ModeSelector from "@/components/ModeSelector";
import TimeTracker from "@/components/TimeTracker";
import StopTrainingButton from "@/components/StopTrainingButton";
import ModeConfigPanel from "@/components/ModeConfigPanel";
import TestModeEngine from "@/components/TestModeEngine";
import TestResults from "@/components/TestResults";

export default function Home() {
  return (
    <MetronomeProvider>
      <MetronomeEngine />
      <TestModeEngine />
      <SessionTracker />
      <BeatVisualizer />
      <TestResults />
      <main className="h-screen flex flex-col relative">
        <ModeSelector />
        <ModeConfigPanel />
        <TimeTracker />
        <StopTrainingButton />
        <Link
          href="/dashboard"
          className="absolute top-4 right-4 z-20 px-4 py-2 bg-gray-800 bg-opacity-70 text-white rounded-lg hover:bg-opacity-90 transition text-sm"
        >
          数据分析
        </Link>
        <ZoneButton
          zone="Steady"
          label="Steady"
          colorClass="bg-steady"
          description="舒适 - 兴奋度 1-4"
        />
        <ZoneButton
          zone="Flow"
          label="Flow"
          colorClass="bg-flow"
          description="有感 - 兴奋度 5-6"
        />
        <ZoneButton
          zone="Edge"
          label="Edge"
          colorClass="bg-edge"
          description="临界 - 兴奋度 7-8 (黄金训练区)"
        />
        <ZoneButton
          zone="STOP"
          label="STOP"
          colorClass="bg-stop"
          description="急停 - 兴奋度 9"
        />
      </main>
    </MetronomeProvider>
  );
}
