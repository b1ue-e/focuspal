from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langchain_core.language_models import BaseChatModel
from config import config

class LLMFactory:
    @staticmethod
    def create_llm(provider: str = None, **kwargs) -> BaseChatModel:
        provider = provider or config.DEFAULT_LLM_PROVIDER

        if provider == "anthropic":
            return ChatAnthropic(
                model=config.ANTHROPIC_MODEL,
                anthropic_api_key=config.ANTHROPIC_API_KEY,
                **kwargs
            )
        elif provider == "openai":
            return ChatOpenAI(
                model=config.OPENAI_MODEL,
                api_key=config.MINIMAX_API_KEY,
                base_url=config.MINIMAX_BASE_URL,
                **kwargs
            )
        else:
            raise ValueError(f"Unknown provider: {provider}")

    @staticmethod
    def get_provider_config(provider: str = None) -> dict:
        provider = provider or config.DEFAULT_LLM_PROVIDER
        if provider == "anthropic":
            return {
                "provider": "anthropic",
                "model": config.ANTHROPIC_MODEL,
                "supports_system_prompt": True
            }
        elif provider == "openai":
            return {
                "provider": "openai",
                "model": config.OPENAI_MODEL,
                "supports_system_prompt": True
            }
        return {}
