# FocusPal

> 🖥️ 桌面 AI 助手 — 浮动搜索栏 + AI 对话 + 番茄钟 + 摄像头监控 + 专注统计

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Windows-blue?style=flat-square)
![Electron](https://img.shields.io/badge/Electron-33.x-47848F?style=flat-square&logo=electron)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![LangChain](https://img.shields.io/badge/LangChain-0.3.x-1C3C3C?style=flat-square)

**[English](README.md) / [简体中文](README_zh.md)**

</div>

---

## ✨ 功能特性

| 功能 | 描述 |
|------|------|
| 🤖 **AI 对话** | 通过 LangChain 统一接口支持 Claude / MiniMax — 切换模型无需改代码 |
| 🍅 **番茄钟** | 25分钟专注 → 5分钟短休息 → 15分钟长休息 |
| 📷 **摄像头监控** | 悬浮圆形摄像头窗口，可拖拽，始终置顶 |
| 📊 **专注统计** | 当日柱状图、近14天趋势折线图、累计 session 计数 |
| 🖥️ **系统托盘** | 后台静默运行，点击恢复主窗口 |
| ⌨️ **全局快捷键** | `Ctrl+Space` 显示/隐藏窗口 · `Ctrl+Shift+C` 摄像头 · `Ctrl+Shift+P` 番茄钟 |

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                   Electron 桌面应用                       │
│     MainPanel · ChatSidebar · CameraWindow · StatsModal   │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP / WebSocket
┌─────────────────────────▼───────────────────────────────┐
│                  Python FastAPI 后端                      │
│   LangChain Agent · Pomodoro Service · Stats Service      │
│   SQLite (SQLAlchemy) · Socket.IO · APScheduler          │
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
├── README.md                 # English version
└── README_zh.md              # 简体中文版
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
