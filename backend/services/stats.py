from db.database import get_db_context
from db.models import FocusSession
from sqlalchemy import func
import time
from typing import List

class StatsService:
    def get_daily_stats(self, date: str = None) -> dict:
        """Get focus time for a specific date (YYYY-MM-DD format)"""
        with get_db_context() as db:
            if date:
                # Parse date and get start/end timestamps
                from datetime import datetime
                dt = datetime.strptime(date, "%Y-%m-%d")
                start = int(dt.timestamp())
                end = start + 86400
            else:
                # Today
                today = int(time.time()) // 86400 * 86400
                start = today
                end = today + 86400

            sessions = db.query(FocusSession).filter(
                FocusSession.started_at >= start,
                FocusSession.started_at < end
            ).all()

            total_duration = sum(s.duration for s in sessions)

            # Group by hour
            hourly = {}
            for s in sessions:
                hour = (s.started_at - start) // 3600
                hourly[int(hour)] = hourly.get(int(hour), 0) + s.duration

            # Fill in missing hours
            hourly_data = [{"hour": h, "duration": hourly.get(h, 0)} for h in range(24)]

            return {
                "date": date or "today",
                "total_duration": total_duration,
                "hourly": hourly_data,
                "sessions_count": len(sessions)
            }

    def get_weekly_stats(self, days: int = 14) -> dict:
        """Get focus time for the last N days"""
        with get_db_context() as db:
            today = int(time.time()) // 86400 * 86400
            start = today - (days - 1) * 86400

            sessions = db.query(FocusSession).filter(
                FocusSession.started_at >= start
            ).all()

            # Group by date
            daily = {}
            for s in sessions:
                day = (s.started_at - start) // 86400
                daily[int(day)] = daily.get(int(day), 0) + s.duration

            # Fill in missing days
            daily_data = []
            for d in range(days):
                date_ts = start + d * 86400
                from datetime import datetime
                date_str = datetime.fromtimestamp(date_ts).strftime("%Y-%m-%d")
                daily_data.append({
                    "date": date_str,
                    "duration": daily.get(d, 0)
                })

            total_duration = sum(daily.values())
            avg_duration = total_duration / days if days > 0 else 0

            return {
                "days": days,
                "total_duration": total_duration,
                "avg_duration": avg_duration,
                "daily": daily_data
            }

    def get_total_stats(self) -> dict:
        """Get total accumulated focus time"""
        with get_db_context() as db:
            total = db.query(func.sum(FocusSession.duration)).scalar() or 0
            count = db.query(func.count(FocusSession.id)).scalar() or 0

            return {
                "total_duration": total,
                "total_sessions": count
            }

    def add_focus_session(self, duration: int, started_at: int = None, ended_at: int = None):
        """Record a completed focus session"""
        import uuid
        with get_db_context() as db:
            session = FocusSession(
                id=str(uuid.uuid4()),
                started_at=started_at or int(time.time()) - duration,
                ended_at=ended_at or int(time.time()),
                duration=duration
            )
            db.add(session)
            db.commit()

stats_service = StatsService()
