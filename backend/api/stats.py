from fastapi import APIRouter, Query
from services.stats import stats_service

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("/daily")
async def get_daily_stats(date: str = Query(None, description="YYYY-MM-DD format")):
    return stats_service.get_daily_stats(date)

@router.get("/weekly")
async def get_weekly_stats(days: int = Query(14, description="Number of days")):
    return stats_service.get_weekly_stats(days)

@router.get("/total")
async def get_total_stats():
    return stats_service.get_total_stats()
