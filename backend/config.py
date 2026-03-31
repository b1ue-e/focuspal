import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # LLM Provider settings
    DEFAULT_LLM_PROVIDER = os.getenv("DEFAULT_LLM_PROVIDER", "anthropic")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
    MINIMAX_API_KEY = os.getenv("MINIMAX_API_KEY", "")
    MINIMAX_BASE_URL = os.getenv("MINIMAX_BASE_URL", "https://api.minimax.chat/v1")

    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./focuspal.db")

    # Server
    HOST = os.getenv("HOST", "127.0.0.1")
    PORT = int(os.getenv("PORT", "8000"))

    # Anthropic model
    ANTHROPIC_MODEL = "claude-sonnet-4-20250514"

    # OpenAI compatible model (MiniMax)
    OPENAI_MODEL = "MiniMax-Text-01"

config = Config()
