from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import BaseMessage
from llm.factory import LLMFactory
from typing import List, Optional

class ChatAgent:
    def __init__(self, provider: str = None):
        self.llm = LLMFactory.create_llm(provider)
        self.memory = ConversationBufferMemory(
            memory_key="history",
            return_messages=True,
            output_key="text",
            max_token_limit=8000
        )
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful AI assistant named FocusPal. You are concise and friendly."),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ])
        self.chain = LLMChain(llm=self.llm, prompt=self.prompt, memory=self.memory)

    def chat(self, message: str) -> str:
        response = self.chain.invoke({"input": message})
        return response["text"]

    def get_history(self) -> List[BaseMessage]:
        return self.memory.chat_memory.messages

    def clear_history(self):
        self.memory.clear()

    def load_history(self, messages: List[dict]):
        """Load history from database format [{role, content}, ...]"""
        self.memory.clear()
        for msg in messages:
            if msg["role"] == "user":
                self.memory.chat_memory.add_user_message(msg["content"])
            else:
                self.memory.chat_memory.add_ai_message(msg["content"])
