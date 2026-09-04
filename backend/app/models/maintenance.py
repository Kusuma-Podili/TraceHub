from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    type = Column(String(50), default="Issue")       # Request, Issue, Enhancement
    priority = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    status = Column(String(30), default="Open")      # Open, In Analysis, In Progress, Resolved, Closed
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolution_details = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="maintenance_records")
    assigned_to = relationship("User", foreign_keys=[assigned_to_id])

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "project_name": self.project.name if self.project else "",
            "title": self.title,
            "type": self.type,
            "priority": self.priority,
            "status": self.status,
            "assigned_to_id": self.assigned_to_id,
            "assigned_to_name": self.assigned_to.full_name if self.assigned_to else "Unassigned",
            "resolution_details": self.resolution_details or "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
