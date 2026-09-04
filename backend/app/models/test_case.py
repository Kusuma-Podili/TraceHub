from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_code = Column(String(30), unique=True, index=True, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    requirement_id = Column(Integer, ForeignKey("requirements.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, default="")
    preconditions = Column(Text, default="")
    test_steps = Column(Text, default="")
    expected_result = Column(Text, default="")
    actual_result = Column(Text, default="")
    priority = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    status = Column(String(30), default="Not Executed")  # Not Executed, Passed, Failed, Blocked
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="test_cases")
    requirement = relationship("Requirement", back_populates="test_cases")
    created_by = relationship("User", foreign_keys=[created_by_id])
    executions = relationship("TestExecution", back_populates="test_case", cascade="all, delete-orphan", order_by="desc(TestExecution.executed_at)")
    bugs = relationship("Bug", back_populates="test_case")

    def to_dict(self):
        return {
            "id": self.id,
            "case_code": self.case_code,
            "project_id": self.project_id,
            "project_name": self.project.name if self.project else "",
            "requirement_id": self.requirement_id,
            "requirement_title": self.requirement.title if self.requirement else None,
            "name": self.name,
            "description": self.description,
            "preconditions": self.preconditions,
            "test_steps": self.test_steps,
            "expected_result": self.expected_result,
            "actual_result": self.actual_result,
            "priority": self.priority,
            "status": self.status,
            "created_by_id": self.created_by_id,
            "created_by_name": self.created_by.full_name if self.created_by else "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "executions_count": len(self.executions) if self.executions else 0
        }

class TestExecution(Base):
    __tablename__ = "test_executions"

    id = Column(Integer, primary_key=True, index=True)
    test_case_id = Column(Integer, ForeignKey("test_cases.id", ondelete="CASCADE"), nullable=False)
    executed_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(30), nullable=False)  # Passed, Failed, Blocked
    notes = Column(Text, default="")
    actual_result = Column(Text, default="")
    execution_time_ms = Column(Integer, default=0)
    executed_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    test_case = relationship("TestCase", back_populates="executions")
    executed_by = relationship("User", back_populates="test_executions")

    def to_dict(self):
        return {
            "id": self.id,
            "test_case_id": self.test_case_id,
            "test_case_name": self.test_case.name if self.test_case else "",
            "executed_by_id": self.executed_by_id,
            "executed_by_name": self.executed_by.full_name if self.executed_by else "",
            "status": self.status,
            "notes": self.notes,
            "actual_result": self.actual_result,
            "execution_time_ms": self.execution_time_ms,
            "executed_at": self.executed_at.isoformat() if self.executed_at else None
        }
