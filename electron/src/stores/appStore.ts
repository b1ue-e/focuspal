import { create } from 'zustand'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: number
}

interface Conversation {
  id: string
  title: string
  created_at: number
  updated_at?: number
}

interface PomodoroStatus {
  state: 'focus' | 'short_break' | 'long_break' | 'idle'
  time_remaining: number
  is_paused: boolean
  completed_focus_sessions: number
}

interface AppState {
  // UI State
  isMainPanelVisible: boolean
  isChatSidebarOpen: boolean
  isStatsModalOpen: boolean
  isCameraWindowOpen: boolean

  // Chat
  conversations: Conversation[]
  currentConversationId: string | null
  messages: Message[]
  isLoading: boolean

  // Pomodoro
  pomodoroStatus: PomodoroStatus

  // Camera position
  cameraPosition: { x: number; y: number }

  // Actions
  setMainPanelVisible: (visible: boolean) => void
  setChatSidebarOpen: (open: boolean) => void
  setStatsModalOpen: (open: boolean) => void
  setCameraWindowOpen: (open: boolean) => void
  setConversations: (convs: Conversation[]) => void
  setCurrentConversation: (id: string | null) => void
  setMessages: (msgs: Message[]) => void
  addMessage: (msg: Message) => void
  setLoading: (loading: boolean) => void
  setPomodoroStatus: (status: PomodoroStatus) => void
  setCameraPosition: (pos: { x: number; y: number }) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Initial UI State
  isMainPanelVisible: true,
  isChatSidebarOpen: false,
  isStatsModalOpen: false,
  isCameraWindowOpen: false,

  // Chat
  conversations: [],
  currentConversationId: null,
  messages: [],
  isLoading: false,

  // Pomodoro
  pomodoroStatus: {
    state: 'idle',
    time_remaining: 0,
    is_paused: false,
    completed_focus_sessions: 0
  },

  // Camera
  cameraPosition: { x: -1, y: -1 },

  // Actions
  setMainPanelVisible: (visible) => set({ isMainPanelVisible: visible }),
  setChatSidebarOpen: (open) => set({ isChatSidebarOpen: open }),
  setStatsModalOpen: (open) => set({ isStatsModalOpen: open }),
  setCameraWindowOpen: (open) => set({ isCameraWindowOpen: open }),
  setConversations: (convs) => set({ conversations: convs }),
  setCurrentConversation: (id) => set({ currentConversationId: id }),
  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setLoading: (loading) => set({ isLoading: loading }),
  setPomodoroStatus: (status) => set({ pomodoroStatus: status }),
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
}))
