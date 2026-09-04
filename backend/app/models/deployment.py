from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Deployment(Base):
    __tablename__ = "deployments"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    version = Column(String(50), nullable=False)
    environment = Column(String(50), nullable=False)  # Development, Testing, Staging, Production
    deployment_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(30), default="Planned")   # Planned, In Progress, Successful, Failed, Rolled Back
    deployed_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    release_notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="deployments")
    deployed_by = relationship("User", foreign_keys=[deployed_by_id])

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "project_name": self.project.name if self.project else "",
            "version": self.version,
            "environment": self.environment,
            "deployment_date": self.deployment_date.isoformat() if self.deployment_date else None,
            "status": self.status,
            "deployed_by_id": self.deployed_by_id,
            "deployed_by_name": self.deployed_by.full_name if self.deployed_by else "",
            "release_notes": self.release_notes or "",
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
