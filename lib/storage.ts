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
