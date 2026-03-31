import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../stores/appStore'
import { useAI } from '../hooks/useAI'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
  Plus,
  Trash2,
  Send,
  Bot,
  User,
  X,
  ChevronDown
} from 'lucide-react'

export function ChatSidebar() {
  const {
    isChatSidebarOpen,
    setChatSidebarOpen,
    conversations,
    currentConversationId,
    messages,
    isLoading
  } = useAppStore()

  const {
    sendMessage,
    loadHistory,
    createConversation,
    deleteConversation,
    loadConversations
  } = useAI()

  const [input, setInput] = useState('')
  const [showConvDropdown, setShowConvDropdown] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isChatSidebarOpen) {
      loadConversations()
    }
  }, [isChatSidebarOpen, loadConversations])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isChatSidebarOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isChatSidebarOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input
    setInput('')
    await sendMessage(message)
  }

  const handleSelectConversation = async (convId: string) => {
    await loadHistory(convId)
    setShowConvDropdown(false)
  }

  const handleNewChat = async () => {
    await createConversation()
    setShowConvDropdown(false)
  }

  const currentConv = conversations.find(c => c.id === currentConversationId)

  if (!isChatSidebarOpen) return null

  return (
    <div className="mt-2 w-[680px] bg-surface/95 backdrop-blur border border-border rounded-panel shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        {/* Conversation Selector */}
        <div className="relative">
          <Button
            variant="ghost"
            className="gap-2 min-w-[200px] justify-between"
            onClick={() => setShowConvDropdown(!showConvDropdown)}
          >
            <span className="truncate">
              {currentConv?.title || 'New Chat'}
            </span>
            <ChevronDown className="w-4 h-4" />
          </Button>

          {showConvDropdown && (
            <div className="absolute top-full left-0 mt-1 w-[280px] bg-surface border border-border rounded-btn shadow-lg z-50">
              <div className="max-h-[300px] overflow-y-auto">
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    className={`flex items-center justify-between px-3 py-2 hover:bg-border cursor-pointer ${
                      conv.id === currentConversationId ? 'bg-border' : ''
                    }`}
                    onClick={() => handleSelectConversation(conv.id)}
                  >
                    <span className="truncate text-sm">{conv.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteConversation(conv.id)
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={handleNewChat}
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setChatSidebarOpen(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="h-[360px] overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary">
            <Bot className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">Start a conversation with FocusPal</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-primary' : 'bg-border'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className={`flex-1 px-3 py-2 rounded-btn ${
                  msg.role === 'user' ? 'bg-primary/20' : 'bg-border/50'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-border flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 px-3 py-2 rounded-btn bg-border/50">
                  <p className="text-sm text-text-secondary">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
