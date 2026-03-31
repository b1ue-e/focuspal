from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime, timedelta
from enum import Enum
from typing import Optional
import asyncio
import time

class PomodoroState(str, Enum):
    FOCUS = "focus"
    SHORT_BREAK = "short_break"
    LONG_BREAK = "long_break"
    IDLE = "idle"

class PomodoroService:
    DURATIONS = {
        PomodoroState.FOCUS: 25 * 60,  # 25 minutes
        PomodoroState.SHORT_BREAK: 5 * 60,  # 5 minutes
        PomodoroState.LONG_BREAK: 15 * 60,  # 15 minutes
    }

    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.state = PomodoroState.IDLE
        self.time_remaining = 0
        self.completed_focus_sessions = 0
        self.current_job = None
        self.is_paused = False
        self.pause_remaining = 0
        self._callbacks = []

    def add_callback(self, callback):
        self._callbacks.append(callback)

    async def _notify(self, event: str, data: dict = None):
        for callback in self._callbacks:
            await callback(event, data or {})

    def start_focus(self):
        self.state = PomodoroState.FOCUS
        self.time_remaining = self.DURATIONS[PomodoroState.FOCUS]
        self.is_paused = False
        self._schedule_completion()

    def start_short_break(self):
        self.state = PomodoroState.SHORT_BREAK
        self.time_remaining = self.DURATIONS[PomodoroState.SHORT_BREAK]
        self.is_paused = False
        self._schedule_completion()

    def start_long_break(self):
        self.state = PomodoroState.LONG_BREAK
        self.time_remaining = self.DURATIONS[PomodoroState.LONG_BREAK]
        self.is_paused = False
        self._schedule_completion()

    def _schedule_completion(self):
        if self.current_job:
            self.current_job.remove()

        async def on_complete():
            await self._notify("pomodoro_complete", {"state": self.state})
            if self.state == PomodoroState.FOCUS:
                self.completed_focus_sessions += 1
                if self.completed_focus_sessions % 4 == 0:
                    self.start_long_break()
                else:
                    self.start_short_break()
            else:
                self.state = PomodoroState.IDLE
                self.time_remaining = 0

        run_date = datetime.now() + timedelta(seconds=self.time_remaining)
        self.current_job = self.scheduler.add_job(
            on_complete, 'date', run_date=run_date
        )

    def pause(self):
        if self.state != PomodoroState.IDLE and not self.is_paused:
            if self.current_job:
                self.current_job.remove()
                self.current_job = None
            self.is_paused = True
            self.pause_remaining = self.time_remaining

    def resume(self):
        if self.is_paused:
            self.is_paused = False
            self.time_remaining = self.pause_remaining
            self._schedule_completion()

    def reset(self):
        if self.current_job:
            self.current_job.remove()
            self.current_job = None
        self.state = PomodoroState.IDLE
        self.time_remaining = 0
        self.is_paused = False

    def skip(self):
        if self.current_job:
            self.current_job.remove()
            self.current_job = None
        if self.state == PomodoroState.FOCUS:
            self.completed_focus_sessions += 1
            if self.completed_focus_sessions % 4 == 0:
                self.start_long_break()
            else:
                self.start_short_break()
        else:
            self.state = PomodoroState.IDLE
            self.time_remaining = 0

    def get_status(self) -> dict:
        return {
            "state": self.state.value if isinstance(self.state, Enum) else self.state,
            "time_remaining": self.time_remaining,
            "is_paused": self.is_paused,
            "completed_focus_sessions": self.completed_focus_sessions
        }

    def tick(self):
        """Called every second to update time_remaining"""
        if self.state != PomodoroState.IDLE and not self.is_paused and self.time_remaining > 0:
            self.time_remaining -= 1

pomodoro_service = PomodoroService()
