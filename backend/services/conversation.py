from db.database import get_db_context
from db.models import Conversation, Message
import time
import uuid
from typing import List, Optional

class ConversationService:
    def create_conversation(self, title: str = "New Chat") -> Conversation:
        with get_db_context() as db:
            conv = Conversation(
                id=str(uuid.uuid4()),
                title=title,
                created_at=int(time.time()),
                updated_at=int(time.time())
            )
            db.add(conv)
            db.commit()
            db.refresh(conv)
            return {"id": conv.id, "title": conv.title, "created_at": conv.created_at}

    def get_conversations(self) -> List[dict]:
        with get_db_context() as db:
            convs = db.query(Conversation).order_by(Conversation.updated_at.desc()).all()
            return [{"id": c.id, "title": c.title, "created_at": c.created_at, "updated_at": c.updated_at} for c in convs]

    def get_conversation(self, conv_id: str) -> Optional[dict]:
        with get_db_context() as db:
            conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
            if not conv:
                return None
            return {
                "id": conv.id,
                "title": conv.title,
                "created_at": conv.created_at,
                "updated_at": conv.updated_at
            }

    def delete_conversation(self, conv_id: str) -> bool:
        with get_db_context() as db:
            conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
            if conv:
                db.delete(conv)
                db.commit()
                return True
            return False

    def update_conversation_title(self, conv_id: str, title: str) -> bool:
        with get_db_context() as db:
            conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
            if conv:
                conv.title = title
                conv.updated_at = int(time.time())
                db.commit()
                return True
            return False

    def get_history(self, conv_id: str) -> List[dict]:
        with get_db_context() as db:
            messages = db.query(Message).filter(
                Message.conversation_id == conv_id
            ).order_by(Message.created_at.asc()).all()
            return [{"id": m.id, "role": m.role, "content": m.content, "created_at": m.created_at} for m in messages]

    def add_message(self, conv_id: str, role: str, content: str) -> dict:
        with get_db_context() as db:
            msg = Message(
                id=str(uuid.uuid4()),
                conversation_id=conv_id,
                role=role,
                content=content,
                created_at=int(time.time())
            )
            db.add(msg)

            # Update conversation timestamp
            conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
            if conv:
                conv.updated_at = int(time.time())
                # Auto-generate title from first user message if still "New Chat"
                if conv.title == "New Chat" and role == "user":
                    conv.title = content[:50] + ("..." if len(content) > 50 else "")

            db.commit()
            db.refresh(msg)
            return {"id": msg.id, "role": msg.role, "content": msg.content, "created_at": msg.created_at}

conversation_service = ConversationService()
