# FocusPal

> 🖥️ A desktop AI assistant with floating search bar, AI chat, Pomodoro timer, camera monitoring, and focus statistics.

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Windows-blue?style=flat-square)
![Electron](https://img.shields.io/badge/Electron-33.x-47848F?style=flat-square&logo=electron)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![LangChain](https://img.shields.io/badge/LangChain-0.3.x-1C3C3C?style=flat-square)

**[English](#english) / [简体中文](#简体中文)**

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
│   LangChain Agent · Pomodoro Service · Stats Service      │
│   SQLite (SQLAlchemy) · Socket.IO · APScheduler          │
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

---

***

# 简体中文

<div align="center">

**[English](#english) / 简体中文**

</div>

---

## ✨ 功能特性

| 功能 | 描述 |
|------|------|
| 🤖 **AI 对话** | 通过 LangChain 统一接口支持 Claude / MiniMax — 切换模型无需改代码 |
| 🍅 **番茄钟** | 25分钟专注 → 5分钟短休息 → 15分钟长休息 |
| 📷 **摄像头监控** | 悬浮圆形摄像头窗口，可拖拽，始终置顶 |
| 📊 **专注统计** | 当日柱状图、近14天趋势折线图、累计session计数 |
| 🖥️ **系统托盘** | 后台静默运行，点击恢复主窗口 |
| ⌨️ **全局快捷键** | `Ctrl+Space` 显示/隐藏窗口 · `Ctrl+Shift+C` 摄像头 · `Ctrl+Shift+P` 番茄钟 |

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                   Electron 桌面应用                       │
│      MainPanel · ChatSidebar · CameraWindow · StatsModal │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP / WebSocket
┌─────────────────────────▼───────────────────────────────┐
│                  Python FastAPI 后端                      │
│    LangChain Agent · Pomodoro Service · Stats Service    │
│    SQLite (SQLAlchemy) · Socket.IO · APScheduler         │
└─────────────────────────────────────────────────────────┘
```

**前端**: Electron 33 + React 18 + TypeScript + Tailwind CSS + shadcn/ui + Recharts

**后端**: FastAPI + LangChain 0.3 + SQLAlchemy + Socket.IO

---

## 📁 项目结构

```
focuspal/
├── backend/                  # Python FastAPI 后端
│   ├── main.py              # 入口文件
│   ├── config.py            # 配置（LLM、数据库、服务器）
│   ├── agents/chat_agent.py # LangChain 对话 Agent
│   ├── api/                 # REST API 路由
│   ├── db/                  # SQLAlchemy ORM 模型
│   ├── llm/factory.py       # 多提供商 LLM 工厂
│   ├── services/            # 番茄钟、统计、对话服务
│   └── requirements.txt
│
├── electron/                 # Electron + React 前端
│   ├── electron/            # 主进程（窗口、托盘、快捷键）
│   ├── src/                 # React 组件、hooks、状态管理
│   ├── release/             # 构建产物
│   └── package.json
│
├── SPEC.md                   # 详细项目规格说明
└── README.md
```

---

## 🚀 快速开始

### 1. 后端

```bash
cd backend
cp .env.example .env          # 创建环境变量文件
# 编辑 .env — 填入你的 API Keys
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. 前端（开发模式）

```bash
cd electron
npm install
npm run dev
```

### 3. 构建桌面应用

```bash
cd electron
npm run build
# 输出：electron/release/win-unpacked/FocusPal.exe
```

---

## ⚙️ 环境变量

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `ANTHROPIC_API_KEY` | Anthropic Claude API 密钥 | *(必填)* |
| `MINIMAX_API_KEY` | MiniMax API 密钥（可选） | - |
| `DEFAULT_LLM_PROVIDER` | `anthropic` 或 `openai` | `anthropic` |
| `DATABASE_URL` | SQLite 连接字符串 | `sqlite:///./focuspal.db` |
| `HOST` | 服务器绑定地址 | `127.0.0.1` |
| `PORT` | 服务器端口 | `8000` |

---

## 🔐 隐私说明

API 密钥仅存储在本地 `.env` 文件中，**绝不**提交到仓库。除你配置的 AI 提供商外，不向任何第三方发送数据。

---

## 📄 开源协议

MIT
