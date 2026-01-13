"use client";

export class MetronomeAudio {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private bpm: number = 60;
  private intervalId: number | null = null;
  private beatCallback: (() => void) | null = null;

  constructor() {
    // AudioContext将在用户交互时初始化
  }

  private initAudioContext(): void {
    if (!this.audioContext) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }
  }

  setBPM(bpm: number): void {
    this.bpm = Math.max(20, Math.min(120, bpm)); // 限制在20-120范围内
    // 如果正在播放，需要重新启动以应用新的BPM
    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  setBeatCallback(callback: () => void): void {
    this.beatCallback = callback;
  }

  start(): void {
    if (this.isPlaying) return;

    this.initAudioContext();
    if (!this.audioContext) return;

    // 恢复音频上下文（iOS Safari需要）
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    this.isPlaying = true;
    const intervalMs = (60 / this.bpm) * 1000;

    this.intervalId = window.setInterval(() => {
      this.playBeat();
      if (this.beatCallback) {
        this.beatCallback();
      }
    }, intervalMs);

    // 立即播放第一个节拍
    this.playBeat();
    if (this.beatCallback) {
      this.beatCallback();
    }
  }

  private playBeat(): void {
    if (!this.audioContext) return;

    try {
      // 创建短暂的"滴"声
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 800; // 频率
      oscillator.type = "sine";

      // 快速衰减，产生短促的"滴"声
      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      oscillator.start(now);
      oscillator.stop(now + 0.1);
    } catch (error) {
      console.error("播放节拍失败:", error);
    }
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isPlaying = false;
  }

  isAudioAvailable(): boolean {
    return this.audioContext !== null && this.audioContext.state !== "suspended";
  }

  destroy(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }
  }
}
