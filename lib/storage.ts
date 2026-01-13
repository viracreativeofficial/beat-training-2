import { TrainingSession } from "@/types/session";

const STORAGE_KEY = "tempo-lab-sessions";
const MAX_SESSIONS = 100; // 最多保存100个会话

export function saveSession(session: TrainingSession): void {
  try {
    const sessions = getAllSessions();
    sessions.unshift(session); // 新会话添加到开头
    
    // 只保留最近的MAX_SESSIONS个会话
    const trimmedSessions = sessions.slice(0, MAX_SESSIONS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedSessions));
  } catch (error) {
    console.error("保存会话失败:", error);
  }
}

export function getAllSessions(): TrainingSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as TrainingSession[];
  } catch (error) {
    console.error("读取会话失败:", error);
    return [];
  }
}

export function getSessionsByDateRange(startDate: Date, endDate: Date): TrainingSession[] {
  const sessions = getAllSessions();
  return sessions.filter((session) => {
    const sessionDate = new Date(session.timestamp);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
}

export function getRecentSessions(days: number = 30): TrainingSession[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return getSessionsByDateRange(startDate, endDate);
}

export function clearAllSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("清除会话失败:", error);
  }
}

export function exportSessionsAsJSON(): string {
  try {
    const sessions = getAllSessions();
    const exportData = {
      exportDate: new Date().toISOString(),
      totalSessions: sessions.length,
      sessions: sessions,
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error("导出会话失败:", error);
    return JSON.stringify({ error: "导出失败" }, null, 2);
  }
}

export function downloadSessionsAsJSON(): void {
  try {
    const jsonData = exportSessionsAsJSON();
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tempo-lab-sessions-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("下载会话失败:", error);
    alert("下载失败，请重试");
  }
}
