import time
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.database import get_db

router = APIRouter(prefix="/api/health", tags=["health"])

START_TIME = time.time()

@router.get("")
def get_health_status(db: Session = Depends(get_db)):
    """System health check and database connectivity diagnostic."""
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "service": "TraceHub SDLC Management API",
        "version": "1.0.0",
        "uptime_seconds": int(time.time() - START_TIME),
        "database": db_status
    }
