from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from pydantic import BaseModel

class SLAPolicy(BaseModel):
    severity: str
    max_resolution_hours: float
    warning_threshold_percent: float = 80.0

DEFAULT_SLA_POLICIES = {
    "Critical": SLAPolicy(severity="Critical", max_resolution_hours=4.0),
    "High": SLAPolicy(severity="High", max_resolution_hours=24.0),
    "Medium": SLAPolicy(severity="Medium", max_resolution_hours=72.0),
    "Low": SLAPolicy(severity="Low", max_resolution_hours=168.0)
}

class SLABreachMonitor:
    """
    Real-time Defect & Task SLA Breach Countdown Monitor.
    Calculates remaining hours, detects breached tickets, and issues escalation alerts.
    """

    @classmethod
    def evaluate_defect_sla(
        cls,
        defects: List[Dict[str, Any]],
        now: Optional[datetime] = None
    ) -> Dict[str, Any]:
        if now is None:
            now = datetime.utcnow()

        breached: List[Dict[str, Any]] = []
        approaching: List[Dict[str, Any]] = []
        on_track: List[Dict[str, Any]] = []

        for d in defects:
            status = d.get("status", "Open")
            if status in ["Closed", "Verified"]:
                continue

            sev = d.get("severity", "Medium")
            policy = DEFAULT_SLA_POLICIES.get(sev, DEFAULT_SLA_POLICIES["Medium"])

            created_raw = d.get("created_at")
            if isinstance(created_raw, str):
                try:
                    c_dt = datetime.fromisoformat(created_raw.replace("Z", "+00:00")).replace(tzinfo=None)
                except Exception:
                    c_dt = now
            elif isinstance(created_raw, datetime):
                c_dt = created_raw
            else:
                c_dt = now

            elapsed_hrs = max(0.0, (now - c_dt).total_seconds() / 3600.0)
            max_hrs = policy.max_resolution_hours
            rem_hrs = max_hrs - elapsed_hrs

            item_info = {
                "bug_id": d.get("id"),
                "code": d.get("code", f"BUG-{d.get('id')}"),
                "title": d.get("title"),
                "severity": sev,
                "elapsed_hours": round(elapsed_hrs, 1),
                "remaining_hours": round(rem_hrs, 1),
                "sla_target_hours": max_hrs,
                "status": status
            }

            if rem_hrs <= 0:
                item_info["sla_status"] = "Breached"
                breached.append(item_info)
            elif (elapsed_hrs / max_hrs * 100.0) >= policy.warning_threshold_percent:
                item_info["sla_status"] = "Approaching Breach"
                approaching.append(item_info)
            else:
                item_info["sla_status"] = "Healthy"
                on_track.append(item_info)

        return {
            "total_active_defects_evaluated": len(breached) + len(approaching) + len(on_track),
            "breached_count": len(breached),
            "approaching_breach_count": len(approaching),
            "healthy_count": len(on_track),
            "breached_tickets": breached,
            "approaching_tickets": approaching
        }
