from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Bug(Base):
    __tablename__ = "bugs"

    id = Column(Integer, primary_key=True, index=True)
    bug_code = Column(String(30), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    requirement_id = Column(Integer, ForeignKey("requirements.id", ondelete="SET NULL"), nullable=True)
    test_case_id = Column(Integer, ForeignKey("test_cases.id", ondelete="SET NULL"), nullable=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True)
    severity = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    priority = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    status = Column(String(30), default="Open")      # Open, Assigned, In Progress, Fixed, Ready for Retesting, Closed, Reopened
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reported_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resolution_notes = Column(Text, default="")
    created_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="bugs")
    requirement = relationship("Requirement", back_populates="bugs")
    test_case = relationship("TestCase", back_populates="bugs")
    task = relationship("Task", back_populates="bugs")
    assigned_to = relationship("User", back_populates="assigned_bugs", foreign_keys=[assigned_to_id])
    reported_by = relationship("User", back_populates="reported_bugs", foreign_keys=[reported_by_id])

    def to_dict_summary(self):
        return {
            "id": self.id,
            "bug_code": self.bug_code,
            "title": self.title,
            "severity": self.severity,
            "priority": self.priority,
            "status": self.status,
            "assigned_to_name": self.assigned_to.full_name if self.assigned_to else "Unassigned"
        }

    def to_dict(self):
        return {
            "id": self.id,
            "bug_code": self.bug_code,
            "title": self.title,
            "description": self.description,
            "project_id": self.project_id,
            "project_name": self.project.name if self.project else "",
            "requirement_id": self.requirement_id,
            "requirement_title": self.requirement.title if self.requirement else None,
            "test_case_id": self.test_case_id,
            "test_case_name": self.test_case.name if self.test_case else None,
            "task_id": self.task_id,
            "task_code": self.task.task_code if self.task else None,
            "task_title": self.task.title if self.task else None,
            "severity": self.severity,
            "priority": self.priority,
            "status": self.status,
            "assigned_to_id": self.assigned_to_id,
            "assigned_to_name": self.assigned_to.full_name if self.assigned_to else "Unassigned",
            "reported_by_id": self.reported_by_id,
            "reported_by_name": self.reported_by.full_name if self.reported_by else "",
            "resolution_notes": self.resolution_notes or "",
            "created_date": self.created_date.isoformat() if self.created_date else None,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
