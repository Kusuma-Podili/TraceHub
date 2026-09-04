from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    task_code = Column(String(30), unique=True, index=True, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    requirement_id = Column(Integer, ForeignKey("requirements.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    phase_name = Column(String(50), default="Development")
    priority = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    status = Column(String(30), default="To Do")     # To Do, In Progress, Ready for Testing, Testing, Passed, Completed, Testing Failed
    testing_status = Column(String(30), default="Not Started")  # Not Started, Testing, Passed, Failed
    progress_percent = Column(Float, default=0.0)
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="tasks")
    requirement = relationship("Requirement", back_populates="tasks")
    assigned_to = relationship("User", back_populates="assigned_tasks", foreign_keys=[assigned_to_id])
    bugs = relationship("Bug", back_populates="task", cascade="all, delete-orphan")

    def to_dict(self):
        open_bugs_count = sum(1 for b in self.bugs if b.status in ["Open", "Assigned", "In Progress", "Reopened"]) if self.bugs else 0
        return {
            "id": self.id,
            "task_code": self.task_code,
            "project_id": self.project_id,
            "project_name": self.project.name if self.project else "",
            "requirement_id": self.requirement_id,
            "requirement_code": self.requirement.req_code if self.requirement else None,
            "requirement_title": self.requirement.title if self.requirement else None,
            "title": self.title,
            "description": self.description or "",
            "assigned_to_id": self.assigned_to_id,
            "assigned_to_name": self.assigned_to.full_name if self.assigned_to else "Unassigned",
            "assigned_to_role": self.assigned_to.role if self.assigned_to else None,
            "phase_name": self.phase_name,
            "priority": self.priority,
            "status": self.status,
            "testing_status": self.testing_status or "Not Started",
            "progress_percent": round(self.progress_percent, 1),
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "bugs_count": len(self.bugs) if self.bugs else 0,
            "open_bugs_count": open_bugs_count,
            "related_bugs": [b.to_dict_summary() for b in self.bugs] if self.bugs else []
        }
