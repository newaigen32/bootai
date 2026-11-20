"""
Chat endpoint – the address the frontend calls to send a message.

POST /api/chat   body: {"message": "hi"}   →   {"reply": "Hello! ..."}

This file only receives the request and returns the response.
The reply itself is made in service.py.
"""

from fastapi import APIRouter, HTTPException

from app.chat.schemas import ChatRequest, ChatResponse
from app.chat.service import make_reply
from app.llm.ollama import OllamaError

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        reply = await make_reply(request.message)
    except OllamaError as error:
        # 503 = "service unavailable": the AI model couldn't answer
        raise HTTPException(status_code=503, detail=str(error)) from error

    return ChatResponse(reply=reply)
