from typing import List, Dict, Optional, Any
from pydantic import BaseModel

class EngineerAllocation(BaseModel):
    user_id: int
    user_name: str
    role: str
    assigned_tasks_count: int
    total_assigned_points: float
    capacity_points_limit: float
    utilization_rate_percent: float
    burnout_risk_level: str  # "Low", "Moderate", "High", "Critical Overload"

class ResourceCapacityPlanner:
    """
    Workload Balancing and Developer Cognitive Load Telemetry.
    Computes capacity utilization, detects sprint over-allocation, and alerts on burnout risks.
    """

    @staticmethod
    def analyze_team_allocation(
        members: List[Dict[str, Any]],
        assigned_tasks: List[Dict[str, Any]],
        default_capacity_points: float = 10.0
    ) -> List[EngineerAllocation]:
        allocations: List[EngineerAllocation] = []

        for m in members:
            uid = m["id"]
            name = m["name"]
            role = m.get("role", "Developer")
            cap_limit = float(m.get("capacity_limit", default_capacity_points))

            user_tasks = [t for t in assigned_tasks if t.get("assigned_to") == uid]
            assigned_pts = sum(float(t.get("story_points", 1.0)) for t in user_tasks)

            utilization = (assigned_pts / cap_limit * 100.0) if cap_limit > 0 else 0.0

            if utilization > 130.0:
                risk = "Critical Overload"
            elif utilization > 105.0:
                risk = "High"
            elif utilization > 80.0:
                risk = "Moderate"
            else:
                risk = "Low"

            allocations.append(EngineerAllocation(
                user_id=uid,
                user_name=name,
                role=role,
                assigned_tasks_count=len(user_tasks),
                total_assigned_points=round(assigned_pts, 2),
                capacity_points_limit=round(cap_limit, 2),
                utilization_rate_percent=round(utilization, 1),
                burnout_risk_level=risk
            ))

        return allocations
