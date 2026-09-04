from backend.app.routers.auth import router as auth_router
from backend.app.routers.projects import router as projects_router
from backend.app.routers.phases import router as phases_router
from backend.app.routers.requirements import router as requirements_router
from backend.app.routers.tasks import router as tasks_router
from backend.app.routers.testing import router as testing_router
from backend.app.routers.bugs import router as bugs_router
from backend.app.routers.deployments import router as deployments_router
from backend.app.routers.maintenance import router as maintenance_router
from backend.app.routers.reports import router as reports_router
from backend.app.routers.notifications import router as notifications_router

__all__ = [
    "auth_router",
    "projects_router",
    "phases_router",
    "requirements_router",
    "tasks_router",
    "testing_router",
    "bugs_router",
    "deployments_router",
    "maintenance_router",
    "reports_router",
    "notifications_router",
]
