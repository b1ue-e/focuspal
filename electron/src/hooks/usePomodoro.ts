import { useCallback, useEffect, useRef } from 'react'
import { useAppStore } from '../stores/appStore'
import * as api from '../api/client'

export function usePomodoro() {
  const { pomodoroStatus, setPomodoroStatus } = useAppStore()
  const intervalRef = useRef<number | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      const res = await api.getPomodoroStatus()
      setPomodoroStatus(res.data)
    } catch (err) {
      console.error('Failed to fetch pomodoro status:', err)
    }
  }, [setPomodoroStatus])

  const start = useCallback(async (type: 'focus' | 'short_break' | 'long_break' = 'focus') => {
    try {
      const res = await api.startPomodoro(type)
      setPomodoroStatus(res.data)
    } catch (err) {
      console.error('Failed to start pomodoro:', err)
    }
  }, [setPomodoroStatus])

  const pause = useCallback(async () => {
    try {
      const res = await api.pausePomodoro()
      setPomodoroStatus(res.data)
    } catch (err) {
      console.error('Failed to pause pomodoro:', err)
    }
  }, [setPomodoroStatus])

  const resume = useCallback(async () => {
    try {
      const res = await api.resumePomodoro()
      setPomodoroStatus(res.data)
    } catch (err) {
      console.error('Failed to resume pomodoro:', err)
    }
  }, [setPomodoroStatus])

  const reset = useCallback(async () => {
    try {
      const res = await api.resetPomodoro()
      setPomodoroStatus(res.data)
    } catch (err) {
      console.error('Failed to reset pomodoro:', err)
    }
  }, [setPomodoroStatus])

  const skip = useCallback(async () => {
    try {
      const res = await api.skipPomodoro()
      setPomodoroStatus(res.data)
    } catch (err) {
      console.error('Failed to skip pomodoro:', err)
    }
  }, [setPomodoroStatus])

  // Poll for status updates when active
  useEffect(() => {
    fetchStatus()

    intervalRef.current = window.setInterval(() => {
      fetchStatus()
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchStatus])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  return {
    status: pomodoroStatus,
    start,
    pause,
    resume,
    reset,
    skip,
    formatTime
  }
}
