# FocusPal - Desktop AI Assistant

A desktop AI assistant with floating search bar, AI chat, Pomodoro timer, camera monitoring, and focus statistics.

## Project Structure

```
focuspal/
├── backend/              # Python FastAPI backend
│   ├── main.py          # FastAPI entry point
│   ├── config.py        # Configuration
│   ├── .env             # Environment variables (create from .env.example)
│   ├── .env.example     # Environment template
│   ├── agents/          # LangChain chat agent
│   ├── api/             # API routes
│   ├── db/              # Database models
│   ├── llm/             # LLM factory (multi-provider)
│   ├── services/        # Business logic
│   ├── socket_io/       # Socket.IO events
│   └── requirements.txt
│
├── electron/             # Electron + React frontend
│   ├── electron/        # Electron main process
│   ├── src/             # React components
│   ├── package.json
│   └── release/          # Built application
│
├── SPEC.md              # Project specification
└── README.md
```

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your API keys
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend (Development)

```bash
cd electron
npm install
npm run dev
```

### 3. Build Desktop App

```bash
cd electron
npm run build
# Output: release/win-unpacked/FocusPal.exe
```

## Features

- **AI Chat**: Claude / MiniMax via LangChain unified API
- **Pomodoro Timer**: 25min focus / 5min short break / 15min long break
- **Camera Monitor**: Floating circular camera window
- **Focus Statistics**: Daily/weekly/total charts
- **System Tray**: Background running
- **Global Shortcuts**: Ctrl+Space toggle, Ctrl+Shift+C camera, etc.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| ANTHROPIC_API_KEY | Anthropic Claude API key | - |
| MINIMAX_API_KEY | MiniMax API key | - |
| DEFAULT_LLM_PROVIDER | "anthropic" or "openai" | anthropic |
| DATABASE_URL | SQLite connection | sqlite:///./focuspal.db |
| HOST | Server host | 127.0.0.1 |
| PORT | Server port | 8000 |

## Privacy

API keys are stored locally in `.env` and only used for API calls. No data is sent to third parties except the configured AI providers.
