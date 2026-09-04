from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(Integer, primary_key=True, index=True)
    req_code = Column(String(30), unique=True, index=True, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    priority = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    status = Column(String(30), default="Proposed")  # Proposed, Approved, In Progress, Completed, Rejected
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="requirements")
    assigned_to = relationship("User", back_populates="assigned_requirements", foreign_keys=[assigned_to_id])
    created_by = relationship("User", foreign_keys=[created_by_id])
    tasks = relationship("Task", back_populates="requirement")
    test_cases = relationship("TestCase", back_populates="requirement")
    bugs = relationship("Bug", back_populates="requirement")

    def to_dict(self):
        return {
            "id": self.id,
            "req_code": self.req_code,
            "project_id": self.project_id,
            "project_name": self.project.name if self.project else "",
            "title": self.title,
            "description": self.description,
            "priority": self.priority,
            "status": self.status,
            "assigned_to_id": self.assigned_to_id,
            "assigned_to_name": self.assigned_to.full_name if self.assigned_to else "Unassigned",
            "created_by_id": self.created_by_id,
            "created_by_name": self.created_by.full_name if self.created_by else "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "tasks_count": len(self.tasks) if self.tasks else 0,
            "test_cases_count": len(self.test_cases) if self.test_cases else 0
        }
