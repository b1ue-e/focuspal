from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agents.chat_agent import ChatAgent
from services.conversation import conversation_service
import uuid

router = APIRouter(prefix="/api/chat", tags=["chat"])

# In-memory agent instances per conversation
agents = {}

class ChatRequest(BaseModel):
    message: str
    conversation_id: str = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str

@router.post("/send", response_model=ChatResponse)
async def send_message(req: ChatRequest):
    # Get or create conversation
    conv_id = req.conversation_id
    if not conv_id:
        conv = conversation_service.create_conversation()
        conv_id = conv["id"]

    # Get or create agent for this conversation
    if conv_id not in agents:
        agents[conv_id] = ChatAgent()

    # Load existing history
    history = conversation_service.get_history(conv_id)
    if history:
        agents[conv_id].load_history(history)

    # Add user message to DB
    conversation_service.add_message(conv_id, "user", req.message)

    # Get AI response
    response = agents[conv_id].chat(req.message)

    # Save AI response to DB
    conversation_service.add_message(conv_id, "assistant", response)

    return ChatResponse(response=response, conversation_id=conv_id)

@router.delete("/clear/{conversation_id}")
async def clear_history(conversation_id: str):
    if conversation_id in agents:
        agents[conversation_id].clear_history()
    return {"status": "ok"}
