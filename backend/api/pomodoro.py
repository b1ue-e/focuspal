from fastapi import APIRouter
from pydantic import BaseModel
from services.pomodoro import pomodoro_service

router = APIRouter(prefix="/api/pomodoro", tags=["pomodoro"])

class StartRequest(BaseModel):
    type: str = "focus"  # focus, short_break, long_break

@router.post("/start")
async def start_pomodoro(req: StartRequest = None):
    if req and req.type == "short_break":
        pomodoro_service.start_short_break()
    elif req and req.type == "long_break":
        pomodoro_service.start_long_break()
    else:
        pomodoro_service.start_focus()
    return pomodoro_service.get_status()

@router.post("/pause")
async def pause_pomodoro():
    pomodoro_service.pause()
    return pomodoro_service.get_status()

@router.post("/resume")
async def resume_pomodoro():
    pomodoro_service.resume()
    return pomodoro_service.get_status()

@router.post("/reset")
async def reset_pomodoro():
    pomodoro_service.reset()
    return pomodoro_service.get_status()

@router.post("/skip")
async def skip_pomodoro():
    pomodoro_service.skip()
    return pomodoro_service.get_status()

@router.get("/status")
async def get_status():
    return pomodoro_service.get_status()
