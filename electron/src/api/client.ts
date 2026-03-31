import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000'

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface ChatRequest {
  message: string
  conversation_id?: string
}

export interface ChatResponse {
  response: string
  conversation_id: string
}

export interface Conversation {
  id: string
  title: string
  created_at: number
  updated_at?: number
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: number
}

export interface PomodoroStatus {
  state: 'focus' | 'short_break' | 'long_break' | 'idle'
  time_remaining: number
  is_paused: boolean
  completed_focus_sessions: number
}

export interface DailyStats {
  date: string
  total_duration: number
  hourly: { hour: number; duration: number }[]
  sessions_count: number
}

export interface WeeklyStats {
  days: number
  total_duration: number
  avg_duration: number
  daily: { date: string; duration: number }[]
}

export interface TotalStats {
  total_duration: number
  total_sessions: number
}

// Chat API
export const sendMessage = (data: ChatRequest) =>
  client.post<ChatResponse>('/api/chat/send', data)

export const clearChatHistory = (conversationId: string) =>
  client.delete(`/api/chat/clear/${conversationId}`)

// Conversations API
export const getConversations = () =>
  client.get<Conversation[]>('/api/conversations')

export const createConversation = (title: string = 'New Chat') =>
  client.post<Conversation>('/api/conversations', { title })

export const deleteConversation = (id: string) =>
  client.delete(`/api/conversations/${id}`)

export const getConversationHistory = (id: string) =>
  client.get<Message[]>(`/api/conversations/${id}/history`)

// Pomodoro API
export const startPomodoro = (type: 'focus' | 'short_break' | 'long_break' = 'focus') =>
  client.post<PomodoroStatus>('/api/pomodoro/start', { type })

export const pausePomodoro = () =>
  client.post<PomodoroStatus>('/api/pomodoro/pause')

export const resumePomodoro = () =>
  client.post<PomodoroStatus>('/api/pomodoro/resume')

export const resetPomodoro = () =>
  client.post<PomodoroStatus>('/api/pomodoro/reset')

export const skipPomodoro = () =>
  client.post<PomodoroStatus>('/api/pomodoro/skip')

export const getPomodoroStatus = () =>
  client.get<PomodoroStatus>('/api/pomodoro/status')

// Stats API
export const getDailyStats = (date?: string) =>
  client.get<DailyStats>('/api/stats/daily', { params: { date } })

export const getWeeklyStats = (days: number = 14) =>
  client.get<WeeklyStats>('/api/stats/weekly', { params: { days } })

export const getTotalStats = () =>
  client.get<TotalStats>('/api/stats/total')

// Settings API
export const getSettings = () =>
  client.get<Record<string, string>>('/api/settings')

export const updateSetting = (key: string, value: string) =>
  client.put('/api/settings', { key, value })

export default client
