import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../stores/appStore'
import { useAI } from '../hooks/useAI'
import { usePomodoro } from '../hooks/usePomodoro'
import { PomodoroTimer } from './PomodoroTimer'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
  Bot,
  Video,
  BarChart3,
  Settings,
  Send,
  X,
  ChevronDown
} from 'lucide-react'

export function MainPanel() {
  const {
    isChatSidebarOpen,
    setChatSidebarOpen,
    setStatsModalOpen,
    isCameraWindowOpen,
    setCameraWindowOpen,
    isLoading
  } = useAppStore()

  const { sendMessage, loadConversations, messages, loadHistory, currentConversationId } = useAI()
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input
    setInput('')
    setChatSidebarOpen(true)

    // Wait for sidebar to be open before sending
    setTimeout(() => {
      sendMessage(message)
    }, 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setChatSidebarOpen(false)
    }
  }

  const toggleCamera = async () => {
    const result = await window.electronAPI.toggleCamera()
    setCameraWindowOpen(result)
  }

  return (
    <div
      className="flex items-center gap-3 px-4 h-14 bg-surface/95 backdrop-blur border border-border rounded-panel shadow-lg"
      onKeyDown={handleKeyDown}
    >
      {/* App Logo */}
      <div className="flex items-center gap-2 text-primary">
        <Bot className="w-6 h-6" />
        <span className="font-semibold text-sm">FocusPal</span>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="relative">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="问 AI ..."
            className="pr-20 bg-background"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            disabled={isLoading || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-1">
        {/* Camera Toggle */}
        <Button
          variant={isCameraWindowOpen ? 'secondary' : 'ghost'}
          size="icon"
          onClick={toggleCamera}
          title="Toggle Camera (Ctrl+Shift+C)"
        >
          <Video className={`w-4 h-4 ${isCameraWindowOpen ? 'text-primary' : ''}`} />
        </Button>

        {/* Pomodoro Timer */}
        <div className="px-2 border-l border-border">
          <PomodoroTimer />
        </div>

        {/* Stats Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setStatsModalOpen(true)}
          title="Statistics"
        >
          <BarChart3 className="w-4 h-4" />
        </Button>

        {/* Settings Button */}
        <Button variant="ghost" size="icon" title="Settings">
          <Settings className="w-4 h-4" />
        </Button>

        {/* Toggle Sidebar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setChatSidebarOpen(!isChatSidebarOpen)}
          title="Toggle Chat"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isChatSidebarOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>
    </div>
  )
}
