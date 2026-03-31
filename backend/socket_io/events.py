import socketio
from services.pomodoro import pomodoro_service

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def pomodoro_status(sid, data=None):
    """Get current pomodoro status"""
    await sio.emit('pomodoro_status', pomodoro_service.get_status(), to=sid)

# Register pomodoro callbacks to emit events
async def pomodoro_callback(event: str, data: dict):
    """Callback for pomodoro events - emits to all connected clients"""
    await sio.emit(event, data)

pomodoro_service.add_callback(pomodoro_callback)
