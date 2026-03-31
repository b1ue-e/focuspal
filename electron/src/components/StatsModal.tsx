import { useEffect } from 'react'
import { useAppStore } from '../stores/appStore'
import { useStats } from '../hooks/useStats'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip
} from 'recharts'

export function StatsModal() {
  const { isStatsModalOpen, setStatsModalOpen } = useAppStore()
  const { dailyStats, weeklyStats, totalStats, loadAll, formatDuration } = useStats()

  useEffect(() => {
    if (isStatsModalOpen) {
      loadAll()
    }
  }, [isStatsModalOpen, loadAll])

  if (!isStatsModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setStatsModalOpen(false)}
      />

      {/* Modal */}
      <Card className="relative w-[560px] max-h-[400px] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Focus Statistics</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setStatsModalOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {/* Total Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {formatDuration(totalStats?.total_duration || 0)}
              </p>
              <p className="text-xs text-text-secondary">Total Focus</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {totalStats?.total_sessions || 0}
              </p>
              <p className="text-xs text-text-secondary">Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">
                {formatDuration(weeklyStats?.avg_duration || 0)}
              </p>
              <p className="text-xs text-text-secondary">Daily Avg</p>
            </div>
          </div>

          {/* Today's Chart */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Today</h3>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyStats?.hourly || []}>
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(h) => `${h}:00`}
                    tick={{ fontSize: 10, fill: '#a1a1a1' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value: number) => [formatDuration(value), 'Duration']}
                    labelFormatter={(label) => `${label}:00`}
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar
                    dataKey="duration"
                    fill="#3b82f6"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Trend */}
          <div>
            <h3 className="text-sm font-medium mb-2">Last 14 Days</h3>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyStats?.daily || []}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => d.slice(5)}
                    tick={{ fontSize: 10, fill: '#a1a1a1' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value: number) => [formatDuration(value), 'Duration']}
                    labelFormatter={(label) => label}
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
