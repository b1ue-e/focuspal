import { useCallback } from 'react'
import { useAppStore } from '../stores/appStore'
import * as api from '../api/client'

export function useAI() {
  const {
    currentConversationId,
    setCurrentConversation,
    setConversations,
    addMessage,
    messages,
    setMessages,
    setLoading
  } = useAppStore()

  const loadConversations = useCallback(async () => {
    try {
      const res = await api.getConversations()
      setConversations(res.data)
    } catch (err) {
      console.error('Failed to load conversations:', err)
    }
  }, [setConversations])

  const loadHistory = useCallback(async (convId: string) => {
    try {
      const res = await api.getConversationHistory(convId)
      setMessages(res.data)
      setCurrentConversation(convId)
    } catch (err) {
      console.error('Failed to load history:', err)
    }
  }, [setMessages, setCurrentConversation])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    setLoading(true)
    try {
      const res = await api.sendMessage({
        message: content,
        conversation_id: currentConversationId ?? undefined
      })

      // Reload conversations to get updated list
      loadConversations()

      // If this was a new conversation, update current
      if (!currentConversationId) {
        setCurrentConversation(res.data.conversation_id)
      }

      // Add messages to store
      addMessage({
        id: Date.now().toString(),
        role: 'user',
        content,
        created_at: Date.now()
      })

      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data.response,
        created_at: Date.now()
      })

    } catch (err) {
      console.error('Failed to send message:', err)
      addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check if the backend is running.',
        created_at: Date.now()
      })
    } finally {
      setLoading(false)
    }
  }, [currentConversationId, addMessage, setLoading, loadConversations, setCurrentConversation])

  const createConversation = useCallback(async () => {
    try {
      const res = await api.createConversation()
      await loadConversations()
      setCurrentConversation(res.data.id)
      setMessages([])
      return res.data.id
    } catch (err) {
      console.error('Failed to create conversation:', err)
    }
  }, [loadConversations, setCurrentConversation, setMessages])

  const deleteConversation = useCallback(async (id: string) => {
    try {
      await api.deleteConversation(id)
      await loadConversations()
      if (currentConversationId === id) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err)
    }
  }, [currentConversationId, loadConversations, setCurrentConversation, setMessages])

  return {
    messages,
    sendMessage,
    loadConversations,
    loadHistory,
    createConversation,
    deleteConversation,
    currentConversationId
  }
}
