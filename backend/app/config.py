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
