"""
Settings for the backend, read from the .env file.

Keeping all settings here means you change them in one place
(for example, when moving from your laptop to the AWS instance).
"""

import os

from dotenv import load_dotenv

# Read the .env file (if it exists) into environment variables
load_dotenv()

# Frontend addresses allowed to call this backend (comma-separated in .env)
FRONTEND_URLS: list[str] = [
    url.strip()
    for url in os.getenv("FRONTEND_URLS", "http://localhost:5173").split(",")
    if url.strip()
]

# ---------- AI model (Ollama) ----------

# Where Ollama is running
OLLAMA_URL: str = os.getenv("OLLAMA_URL", "http://localhost:11434")

# Which model to use. Change this in .env to try another model (e.g. qwen2.5-coder:7b)
OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2")

# How long to wait for an answer, in seconds (the first answer is slower while the model loads)
OLLAMA_TIMEOUT_SECONDS: float = float(os.getenv("OLLAMA_TIMEOUT_SECONDS", "120"))
