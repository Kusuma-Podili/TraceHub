import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from backend.app.database import engine, Base, SessionLocal
import backend.app.models  # Ensure all models are registered
from backend.app.routers import (
    auth_router,
    projects_router,
    phases_router,
    requirements_router,
    tasks_router,
    testing_router,
    bugs_router,
    deployments_router,
    maintenance_router,
    reports_router,
    notifications_router
)
from backend.app.services.seed_data import seed_database

# Create tables & ensure schema migrations for SQLite
Base.metadata.create_all(bind=engine)

def ensure_schema_migrations(eng):
    try:
        with eng.connect() as conn:
            res = conn.exec_driver_sql("PRAGMA table_info(tasks)").fetchall()
            cols = [r[1] for r in res]
            if "testing_status" not in cols:
                conn.exec_driver_sql("ALTER TABLE tasks ADD COLUMN testing_status VARCHAR(50) DEFAULT 'Not Started'")
                conn.exec_driver_sql("UPDATE tasks SET testing_status = 'Passed' WHERE status = 'Completed'")
                conn.commit()

            res = conn.exec_driver_sql("PRAGMA table_info(bugs)").fetchall()
            cols = [r[1] for r in res]
            if "task_id" not in cols:
                conn.exec_driver_sql("ALTER TABLE bugs ADD COLUMN task_id INTEGER REFERENCES tasks(id)")
                conn.commit()
    except Exception as e:
        print(f"Schema migration warning: {e}")

ensure_schema_migrations(engine)

# Seed database on boot
with SessionLocal() as db:
    seed_database(db)

app = FastAPI(
    title="SDLC Enterprise Project Management Platform",
    description="Enterprise Software Development Life Cycle system managing Requirements, Planning, Design, Development, Testing, Deployment, and Maintenance.",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(phases_router)
app.include_router(requirements_router)
app.include_router(tasks_router)
app.include_router(testing_router)
app.include_router(bugs_router)
app.include_router(deployments_router)
app.include_router(maintenance_router)
app.include_router(reports_router)
app.include_router(notifications_router)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "sdlc-enterprise-backend", "version": "1.0.0"}

# Static files & SPA Frontend
BASE_DIR = Path(__file__).resolve().parent.parent.parent
STATIC_DIR = BASE_DIR / "frontend" / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)

if (STATIC_DIR / "index.html").exists() or True:
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

@app.get("/")
async def serve_root():
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return JSONResponse({"status": "Frontend initialized", "message": "SDLC Enterprise Platform API active"})

@app.get("/{full_path:path}")
async def serve_spa(request: Request, full_path: str):
    # If request starts with api, don't serve HTML
    if full_path.startswith("api/"):
        return JSONResponse(status_code=404, content={"detail": "Not found"})

    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return JSONResponse({"status": "Frontend initialized", "message": "SDLC Enterprise Platform API active"})
