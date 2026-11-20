"""
Chat logic – decides what the bot replies.

It adds Boot AI's instructions (the "system prompt") to the user's message
and asks the AI model for an answer.
"""

from app.llm.ollama import ask_ollama

# Instructions the model reads before every message. Change these to change Boot AI's behaviour.
SYSTEM_PROMPT = (
    "You are Boot AI, a friendly and helpful assistant. "
    "Give clear, simple answers. If you are not sure about something, say so."
)


async def make_reply(message: str) -> str:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": message},
    ]
    return await ask_ollama(messages)
