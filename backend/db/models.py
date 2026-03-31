from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship
import time

Base = declarative_base()

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(String, primary_key=True)
    title = Column(String, default="New Chat")
    created_at = Column(Integer, default=lambda: int(time.time()))
    updated_at = Column(Integer, default=lambda: int(time.time()))
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"
    id = Column(String, primary_key=True)
    conversation_id = Column(String, ForeignKey("conversations.id"))
    role = Column(String)  # 'user' | 'assistant'
    content = Column(String)
    created_at = Column(Integer, default=lambda: int(time.time()))
    conversation = relationship("Conversation", back_populates="messages")

class FocusSession(Base):
    __tablename__ = "focus_sessions"
    id = Column(String, primary_key=True)
    started_at = Column(Integer)
    ended_at = Column(Integer, nullable=True)
    duration = Column(Integer, default=0)  # seconds

class Setting(Base):
    __tablename__ = "settings"
    key = Column(String, primary_key=True)
    value = Column(String)
