# FocusPal

> 🖥️ A desktop AI assistant with floating search bar, AI chat, Pomodoro timer, camera monitoring, and focus statistics.

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Windows-blue?style=flat-square)
![Electron](https://img.shields.io/badge/Electron-33.x-47848F?style=flat-square&logo=electron)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![LangChain](https://img.shields.io/badge/LangChain-0.3.x-1C3C3C?style=flat-square)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chat** | Claude / MiniMax via LangChain unified API — switch models without changing code |
| 🍅 **Pomodoro Timer** | 25min focus → 5min short break → 15min long break cycle |
| 📷 **Camera Monitor** | Floating circular camera window, draggable, always-on-top |
| 📊 **Focus Statistics** | Daily bar chart, 14-day trend line, total sessions counter |
| 🖥️ **System Tray** | Runs silently in background, click to restore |
| ⌨️ **Global Shortcuts** | `Ctrl+Space` toggle window · `Ctrl+Shift+C` camera · `Ctrl+Shift+P` Pomodoro |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Electron Desktop App                     │
│   MainPanel · ChatSidebar · CameraWindow · StatsModal   │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP / WebSocket
┌─────────────────────────▼───────────────────────────────┐
│              Python FastAPI Backend                       │
│   LangChain Agent · Pomodoro Service · Stats Service    │
│   SQLite (SQLAlchemy) · Socket.IO · APScheduler         │
└─────────────────────────────────────────────────────────┘
```

**Frontend**: Electron 33 + React 18 + TypeScript + Tailwind CSS + shadcn/ui + Recharts

**Backend**: FastAPI + LangChain 0.3 + SQLAlchemy + Socket.IO

---

## 📁 Project Structure

```
focuspal/
├── backend/                  # Python FastAPI backend
│   ├── main.py              # Entry point
│   ├── config.py            # Configuration (LLM, DB, Server)
│   ├── agents/chat_agent.py # LangChain conversation agent
│   ├── api/                 # REST API routes
│   ├── db/                  # SQLAlchemy ORM models
│   ├── llm/factory.py       # Multi-provider LLM factory
│   ├── services/            # Pomodoro, Stats, Conversation
│   └── requirements.txt
│
├── electron/                 # Electron + React frontend
│   ├── electron/            # Main process (window, tray, shortcuts)
│   ├── src/                 # React components, hooks, stores
│   ├── release/             # Built executable
│   └── package.json
│
├── SPEC.md                   # Detailed project specification
└── README.md
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env          # Create env file
# Edit .env — add your API keys
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
# Output: electron/release/win-unpacked/FocusPal.exe
```

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | *(required)* |
| `MINIMAX_API_KEY` | MiniMax API key (optional) | - |
| `DEFAULT_LLM_PROVIDER` | `anthropic` or `openai` | `anthropic` |
| `DATABASE_URL` | SQLite connection string | `sqlite:///./focuspal.db` |
| `HOST` | Server bind address | `127.0.0.1` |
| `PORT` | Server port | `8000` |

---

## 🔐 Privacy

API keys are stored **locally** in `.env` and **never** committed to the repository. No telemetry, no third-party data sharing except to the AI providers you configure.

---

## 📄 License

MIT
