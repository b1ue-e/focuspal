import { useCallback, useState } from 'react'
import * as api from '../api/client'

export function useStats() {
  const [dailyStats, setDailyStats] = useState<api.DailyStats | null>(null)
  const [weeklyStats, setWeeklyStats] = useState<api.WeeklyStats | null>(null)
  const [totalStats, setTotalStats] = useState<api.TotalStats | null>(null)
  const [loading, setLoading] = useState(false)

  const loadDailyStats = useCallback(async (date?: string) => {
    try {
      const res = await api.getDailyStats(date)
      setDailyStats(res.data)
    } catch (err) {
      console.error('Failed to load daily stats:', err)
    }
  }, [])

  const loadWeeklyStats = useCallback(async (days: number = 14) => {
    try {
      const res = await api.getWeeklyStats(days)
      setWeeklyStats(res.data)
    } catch (err) {
      console.error('Failed to load weekly stats:', err)
    }
  }, [])

  const loadTotalStats = useCallback(async () => {
    try {
      const res = await api.getTotalStats()
      setTotalStats(res.data)
    } catch (err) {
      console.error('Failed to load total stats:', err)
    }
  }, [])

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadDailyStats(),
        loadWeeklyStats(),
        loadTotalStats()
      ])
    } finally {
      setLoading(false)
    }
  }, [loadDailyStats, loadWeeklyStats, loadTotalStats])

  const formatDuration = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }, [])

  return {
    dailyStats,
    weeklyStats,
    totalStats,
    loading,
    loadDailyStats,
    loadWeeklyStats,
    loadTotalStats,
    loadAll,
    formatDuration
  }
}
