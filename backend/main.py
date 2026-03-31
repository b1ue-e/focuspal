import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from db.models import Base
from db.database import engine
from api import chat, pomodoro, stats, conversations, settings
from socket_io.events import sio
from config import config

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    from services.pomodoro import pomodoro_service
    pomodoro_service.scheduler.start()
    yield
    # Shutdown
    pomodoro_service.scheduler.shutdown()

app = FastAPI(title="FocusPal API", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router)
app.include_router(pomodoro.router)
app.include_router(stats.router)
app.include_router(conversations.router)
app.include_router(settings.router)

# Socket.IO mount
socket_app = socketio.ASGIApp(sio, app)

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "FocusPal"}

@app.get("/")
async def root():
    return {"message": "FocusPal API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=config.HOST, port=config.PORT)
