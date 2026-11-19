"""
Boot AI backend – starting point (like src/main.tsx in the frontend).

Creates the FastAPI app, allows the frontend to call it (CORS),
and plugs in the routes from each feature folder.

Run from the backend folder:
    uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.chat.routes import router as chat_router
from app.config import FRONTEND_URLS
from app.health.routes import router as health_router

app = FastAPI(title="Boot AI Backend", version="0.1.0")

# CORS: lets the browser page on port 5173 call this server on port 8000
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_URLS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# Plug in each feature's endpoints under /api
app.include_router(health_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
