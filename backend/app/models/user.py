from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(30), nullable=False)  # "Project Manager", "Developer", "Tester"
    hashed_password = Column(String(255), nullable=False)
    avatar_color = Column(String(20), default="#1C2826")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    managed_projects = relationship("Project", back_populates="manager", foreign_keys="Project.manager_id")
    project_memberships = relationship("ProjectMember", back_populates="user", cascade="all, delete-orphan")
    assigned_requirements = relationship("Requirement", back_populates="assigned_to", foreign_keys="Requirement.assigned_to_id")
    assigned_tasks = relationship("Task", back_populates="assigned_to", foreign_keys="Task.assigned_to_id")
    assigned_bugs = relationship("Bug", back_populates="assigned_to", foreign_keys="Bug.assigned_to_id")
    reported_bugs = relationship("Bug", back_populates="reported_by", foreign_keys="Bug.reported_by_id")
    test_executions = relationship("TestExecution", back_populates="executed_by")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role,
            "avatar_color": self.avatar_color,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
