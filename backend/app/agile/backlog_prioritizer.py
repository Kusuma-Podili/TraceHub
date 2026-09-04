import math
import logging
from typing import List, Dict, Optional, Any, Tuple
from enum import Enum
from pydantic import BaseModel, Field

logger = logging.getLogger("tracehub.agile.prioritizer")

class PrioritizationFramework(str, Enum):
    WSJF = "Weighted Shortest Job First"
    RICE = "RICE (Reach, Impact, Confidence, Effort)"
    KANO = "Kano Model Classification"
    MOSCOW = "MoSCoW (Must, Should, Could, Won't)"

class BacklogItem(BaseModel):
    item_id: int
    item_type: str  # "Requirement" or "Task"
    code: str
    title: str
    # WSJF Parameters
    user_business_value: float = Field(default=5.0, ge=1.0, le=20.0)
    time_criticality: float = Field(default=5.0, ge=1.0, le=20.0)
    risk_reduction_or_opportunity: float = Field(default=5.0, ge=1.0, le=20.0)
    job_size_or_duration: float = Field(default=5.0, ge=0.5, le=40.0)
    # RICE Parameters
    reach: float = Field(default=100.0, ge=1.0)
    impact: float = Field(default=2.0, ge=0.25, le=5.0)  # 3=massive, 2=high, 1=med, 0.5=low
    confidence: float = Field(default=0.8, ge=0.1, le=1.0)  # percentage
    effort_person_weeks: float = Field(default=2.0, ge=0.5)
    # MoSCoW
    moscow_category: str = "Should"
    # Kano
    kano_category: str = "Performance"  # Must-Be, Performance, Attractive, Indifferent

class ScoredBacklogItem(BaseModel):
    item_id: int
    code: str
    title: str
    wsjf_score: float = 0.0
    cost_of_delay: float = 0.0
    rice_score: float = 0.0
    moscow_rank: int = 2
    priority_tier: str = "Medium"
    recommended_sprint_sequence: int = 1

class BacklogPrioritizer:
    """
    Mathematical Product Backlog Prioritization Engine.
    Executes WSJF (SAFe), RICE, MoSCoW, and Kano multi-attribute utility analyses.
    """

    MOSCOW_WEIGHTS = {"Must": 1, "Should": 2, "Could": 3, "Won't": 4}

    @staticmethod
    def calculate_wsjf(item: BacklogItem) -> Tuple[float, float]:
        """
        WSJF = Cost of Delay (CoD) / Job Size
        Cost of Delay = User Value + Time Criticality + Risk Reduction
        """
        cod = item.user_business_value + item.time_criticality + item.risk_reduction_or_opportunity
        size = max(0.5, item.job_size_or_duration)
        wsjf = cod / size
        return round(wsjf, 3), round(cod, 3)

    @staticmethod
    def calculate_rice(item: BacklogItem) -> float:
        """
        RICE Score = (Reach * Impact * Confidence) / Effort
        """
        effort = max(0.25, item.effort_person_weeks)
        score = (item.reach * item.impact * item.confidence) / effort
        return round(score, 2)

    def rank_backlog(self, items: List[BacklogItem], framework: PrioritizationFramework = PrioritizationFramework.WSJF) -> List[ScoredBacklogItem]:
        scored_list: List[ScoredBacklogItem] = []

        for item in items:
            wsjf, cod = self.calculate_wsjf(item)
            rice = self.calculate_rice(item)
            m_rank = self.MOSCOW_WEIGHTS.get(item.moscow_category, 2)

            scored = ScoredBacklogItem(
                item_id=item.item_id,
                code=item.code,
                title=item.title,
                wsjf_score=wsjf,
                cost_of_delay=cod,
                rice_score=rice,
                moscow_rank=m_rank
            )
            scored_list.append(scored)

        # Sort based on selected framework
        if framework == PrioritizationFramework.WSJF:
            scored_list.sort(key=lambda x: x.wsjf_score, reverse=True)
        elif framework == PrioritizationFramework.RICE:
            scored_list.sort(key=lambda x: x.rice_score, reverse=True)
        elif framework == PrioritizationFramework.MOSCOW:
            scored_list.sort(key=lambda x: (x.moscow_rank, -x.wsjf_score))

        # Assign sequence and priority tiers
        total = len(scored_list)
        for i, it in enumerate(scored_list, 1):
            it.recommended_sprint_sequence = math.ceil(i / 5.0)  # 5 items per sprint batch
            pct = i / total if total > 0 else 0
            if pct <= 0.2:
                it.priority_tier = "Critical"
            elif pct <= 0.5:
                it.priority_tier = "High"
            elif pct <= 0.8:
                it.priority_tier = "Medium"
            else:
                it.priority_tier = "Low"

        return scored_list
