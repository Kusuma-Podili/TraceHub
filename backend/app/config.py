import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DB_DIR = BASE_DIR / "data"
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DB_DIR / "sdlc.db"

DATABASE_URL = f"sqlite:///{DB_PATH.as_posix()}"
SECRET_KEY = os.environ.get("SDLC_SECRET_KEY", "sdlc-enterprise-production-super-secure-key-2026-v1")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

ROLES = ["Project Manager", "Developer", "Tester"]

SDLC_PHASES_ORDER = [
    "Requirement Analysis",
    "Planning",
    "Design",
    "Development",
    "Testing",
    "Deployment",
    "Maintenance"
]
