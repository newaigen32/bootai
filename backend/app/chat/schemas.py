"""
Data shapes for the chat API – what comes in and what goes out.

Like the Message and Conversation types in the frontend's useConversations.ts.
"""

from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    """What the frontend sends: the user's message."""

    model_config = ConfigDict(str_strip_whitespace=True)  # remove spaces at start/end

    message: str = Field(min_length=1, max_length=4000)


class ChatResponse(BaseModel):
    """What the backend sends back: the bot's reply."""

    reply: str
