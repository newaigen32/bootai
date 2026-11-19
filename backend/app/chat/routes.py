"""
Chat endpoint – the address the frontend calls to send a message.

POST /api/chat   body: {"message": "hi"}   →   {"reply": "Hello! ..."}

This file only receives the request and returns the response.
The reply itself is made in service.py.
"""

from fastapi import APIRouter

from app.chat.schemas import ChatRequest, ChatResponse
from app.chat.service import make_reply

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    return ChatResponse(reply=make_reply(request.message))
