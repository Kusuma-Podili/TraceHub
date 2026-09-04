from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text, default="")
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    priority = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    status = Column(String(30), default="Active")  # Planning, Active, On Hold, Completed, Archived
    current_phase = Column(String(50), default="Requirement Analysis")
    start_date = Column(DateTime, default=datetime.utcnow)
    target_date = Column(DateTime, nullable=True)
    progress_percent = Column(Float, default=0.0)

    # Design Phase Documentation
    architecture_notes = Column(Text, default="")
    ui_ux_notes = Column(Text, default="")
    db_design_notes = Column(Text, default="")
    tech_design_notes = Column(Text, default="")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    manager = relationship("User", back_populates="managed_projects", foreign_keys=[manager_id])
    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan")
    phases = relationship("SDLCPhase", back_populates="project", cascade="all, delete-orphan", order_by="SDLCPhase.order_index")
    requirements = relationship("Requirement", back_populates="project", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    test_cases = relationship("TestCase", back_populates="project", cascade="all, delete-orphan")
    bugs = relationship("Bug", back_populates="project", cascade="all, delete-orphan")
    deployments = relationship("Deployment", back_populates="project", cascade="all, delete-orphan")
    maintenance_records = relationship("MaintenanceRecord", back_populates="project", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="project", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "name": self.name,
            "description": self.description,
            "manager_id": self.manager_id,
            "manager_name": self.manager.full_name if self.manager else "Unassigned",
            "priority": self.priority,
            "status": self.status,
            "current_phase": self.current_phase,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "target_date": self.target_date.isoformat() if self.target_date else None,
            "progress_percent": round(self.progress_percent, 1),
            "architecture_notes": self.architecture_notes or "",
            "ui_ux_notes": self.ui_ux_notes or "",
            "db_design_notes": self.db_design_notes or "",
            "tech_design_notes": self.tech_design_notes or "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "members_count": len(self.members) if self.members else 0,
            "tasks_count": len(self.tasks) if self.tasks else 0,
            "bugs_count": len(self.bugs) if self.bugs else 0
        }

class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role_in_project = Column(String(50), default="Developer")
    joined_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="members")
    user = relationship("User", back_populates="project_memberships")

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "user_id": self.user_id,
            "user_name": self.user.full_name if self.user else "Unknown",
            "user_email": self.user.email if self.user else "",
            "user_role": self.user.role if self.user else "",
            "role_in_project": self.role_in_project,
            "joined_at": self.joined_at.isoformat() if self.joined_at else None
        }

class SDLCPhase(Base):
    __tablename__ = "sdlc_phases"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    phase_name = Column(String(50), nullable=False)
    order_index = Column(Integer, nullable=False)
    description = Column(Text, default="")
    status = Column(String(30), default="Not Started")  # Not Started, In Progress, Completed, Blocked
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    completion_percent = Column(Float, default=0.0)

    project = relationship("Project", back_populates="phases")

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "phase_name": self.phase_name,
            "order_index": self.order_index,
            "description": self.description,
            "status": self.status,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "completion_percent": round(self.completion_percent, 1)
        }
