import { useEffect } from 'react'
import { useAppStore } from '../stores/appStore'
import { usePomodoro } from '../hooks/usePomodoro'
import { Timer, Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import { Button } from './ui/button'

export function PomodoroTimer() {
  const { pomodoroStatus } = useAppStore()
  const { status, start, pause, resume, reset, skip, formatTime } = usePomodoro()

  const stateLabels = {
    focus: 'Focus',
    short_break: 'Short Break',
    long_break: 'Long Break',
    idle: 'Ready'
  }

  const stateColors = {
    focus: 'text-primary',
    short_break: 'text-success',
    long_break: 'text-warning',
    idle: 'text-text-secondary'
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 text-sm font-medium ${stateColors[status.state]}`}>
        <Timer className="w-4 h-4" />
        <span>{stateLabels[status.state]}</span>
        {status.state !== 'idle' && (
          <span className="font-mono ml-1">{formatTime(status.time_remaining)}</span>
        )}
      </div>

      {status.state === 'idle' ? (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => start('focus')}
          title="Start Focus"
        >
          <Play className="w-4 h-4" />
        </Button>
      ) : (
        <>
          {status.is_paused ? (
            <Button
              size="icon"
              variant="ghost"
              onClick={resume}
              title="Resume"
            >
              <Play className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={pause}
              title="Pause"
            >
              <Pause className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={reset}
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={skip}
            title="Skip"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  )
}
