from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.conversation import conversation_service

router = APIRouter(prefix="/api/conversations", tags=["conversations"])

class CreateConversationRequest(BaseModel):
    title: str = "New Chat"

@router.get("")
async def get_conversations():
    return conversation_service.get_conversations()

@router.post("")
async def create_conversation(req: CreateConversationRequest):
    return conversation_service.create_conversation(req.title)

@router.get("/{conv_id}")
async def get_conversation(conv_id: str):
    conv = conversation_service.get_conversation(conv_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv

@router.delete("/{conv_id}")
async def delete_conversation(conv_id: str):
    success = conversation_service.delete_conversation(conv_id)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"status": "ok"}

@router.get("/{conv_id}/history")
async def get_history(conv_id: str):
    return conversation_service.get_history(conv_id)

@router.put("/{conv_id}/title")
async def update_title(conv_id: str, title: str):
    success = conversation_service.update_conversation_title(conv_id, title)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"status": "ok"}
