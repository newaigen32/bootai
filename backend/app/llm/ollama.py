"""
Talks to Ollama, the app that runs the AI model on your computer.

Like src/api/chatApi.ts in the frontend: this file only knows HOW to call Ollama.
It sends a list of messages to Ollama's chat API and returns the model's answer.

Ollama API used:  POST {OLLAMA_URL}/api/chat
"""

import httpx

from app.config import OLLAMA_MODEL, OLLAMA_TIMEOUT_SECONDS, OLLAMA_URL


class OllamaError(Exception):
    """Raised when Ollama can't be reached or returns an error."""


async def ask_ollama(messages: list[dict[str, str]]) -> str:
    """
    Send messages to the model and return its reply.

    messages looks like:
        [
            {"role": "system", "content": "You are Boot AI..."},
            {"role": "user", "content": "hi"},
        ]
    """
    payload = {
        "model": OLLAMA_MODEL,
        "messages": messages,
        "stream": False,  # wait for the full answer (word-by-word streaming comes later)
    }

    try:
        async with httpx.AsyncClient(timeout=OLLAMA_TIMEOUT_SECONDS) as client:
            response = await client.post(f"{OLLAMA_URL}/api/chat", json=payload)
            response.raise_for_status()
    except httpx.ConnectError as error:
        raise OllamaError(f"Can't connect to Ollama at {OLLAMA_URL}. Is Ollama running?") from error
    except httpx.TimeoutException as error:
        raise OllamaError("Ollama took too long to answer.") from error
    except httpx.HTTPStatusError as error:
        # e.g. 404 when the model isn't downloaded yet
        raise OllamaError(f"Ollama returned an error: {error.response.text}") from error

    data = response.json()
    return data["message"]["content"]
