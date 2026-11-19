"""
Health endpoint – a quick way to check that the server is running.

GET /api/health  →  {"status": "ok"}
"""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
