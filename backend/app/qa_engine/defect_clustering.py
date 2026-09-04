from typing import List, Dict, Optional, Any
from pydantic import BaseModel

class DefectCluster(BaseModel):
    cluster_category: str
    defects_count: int
    percentage: float
    representative_issues: List[str]
    recommended_mitigation: str

class DefectClustering:
    """
    Root Cause Analysis (RCA) and Defect Taxonomy Classifier.
    Categorizes reported bugs by failure mode: Specification, Logic, UI, Performance, Security.
    """

    CATEGORIES = {
        "UI_UX": ["button", "css", "layout", "modal", "display", "responsive", "color", "alignment"],
        "LOGIC_ALGORITHM": ["calculation", "state", "status", "transition", "wrong value", "validation", "gate"],
        "DATABASE_PERSISTENCE": ["sqlite", "foreign key", "integrity", "save", "table", "schema", "column"],
        "SECURITY_AUTH": ["token", "login", "unauthorized", "rbac", "password", "jwt", "permission"],
        "PERFORMANCE_LOAD": ["slow", "timeout", "latency", "memory", "leak", "freeze"]
    }

    @classmethod
    def classify_defect(cls, title: str, description: str) -> str:
        text = f"{title} {description}".lower()
        for cat, keywords in cls.CATEGORIES.items():
            if any(k in text for k in keywords):
                return cat
        return "GENERAL_DEFECT"

    @classmethod
    def cluster_defects(cls, defects: List[Dict[str, Any]]) -> List[DefectCluster]:
        buckets: Dict[str, List[str]] = {}
        for d in defects:
            title = d.get("title", "")
            desc = d.get("description", "")
            cat = cls.classify_defect(title, desc)
            if cat not in buckets:
                buckets[cat] = []
            buckets[cat].append(f"{d.get('code', 'BUG')}: {title}")

        total = len(defects)
        clusters: List[DefectCluster] = []

        mitigations = {
            "UI_UX": "Strengthen CSS design system tokens and cross-browser automated visual regression.",
            "LOGIC_ALGORITHM": "Increase unit test coverage for state machine transitions and gate rules.",
            "DATABASE_PERSISTENCE": "Add strict schema migration scripts and database integrity checks.",
            "SECURITY_AUTH": "Review token lifecycle, expiration guards, and RBAC endpoint middleware.",
            "PERFORMANCE_LOAD": "Implement caching, connection pooling, and payload compression.",
            "GENERAL_DEFECT": "Review acceptance criteria with Product Manager prior to sprint planning."
        }

        for cat, issues in buckets.items():
            pct = (len(issues) / total * 100.0) if total > 0 else 0.0
            clusters.append(DefectCluster(
                cluster_category=cat,
                defects_count=len(issues),
                percentage=round(pct, 1),
                representative_issues=issues[:3],
                recommended_mitigation=mitigations.get(cat, "Perform developer peer review.")
            ))

        clusters.sort(key=lambda x: x.defects_count, reverse=True)
        return clusters
