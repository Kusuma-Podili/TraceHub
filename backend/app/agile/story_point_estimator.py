import math
import statistics
import logging
from typing import List, Dict, Optional, Any, Tuple
from enum import Enum
from pydantic import BaseModel, Field

logger = logging.getLogger("tracehub.agile.estimator")

class EstimationTechnique(str, Enum):
    PLANNING_POKER = "Planning Poker (Fibonacci)"
    T_SHIRT_SIZING = "T-Shirt Sizing (XS-XXL)"
    MODIFIED_FIBONACCI = "Modified Fibonacci"
    PERT_THREE_POINT = "PERT Three-Point Estimation"
    LINEAR_POINTS = "Linear Points (1-10)"

FIBONACCI_SCALE = [0.5, 1.0, 2.0, 3.0, 5.0, 8.0, 13.0, 21.0, 34.0]
T_SHIRT_MAPPING = {
    "XS": 1.0,
    "S": 2.0,
    "M": 5.0,
    "L": 8.0,
    "XL": 13.0,
    "XXL": 21.0
}

class EstimatorVote(BaseModel):
    user_id: int
    user_name: str
    role: str
    voted_points: float
    confidence_level: float = Field(default=0.8, ge=0.1, le=1.0)
    notes: Optional[str] = None

class EstimationSessionResult(BaseModel):
    task_id: int
    technique: EstimationTechnique
    total_votes: int
    raw_mean: float
    raw_median: float
    standard_deviation: float
    consensus_points: float
    recommended_hours: float
    uncertainty_multiplier: float
    vote_agreement_ratio: float
    requires_deliberation: bool

class StoryPointEstimator:
    """
    Precision Story Point & Work Effort Estimation System.
    Applies statistical consensus algorithms (mean, trimmed mean, median, PERT distribution)
    and risk-adjusted uncertainty multipliers to derive realistic task sprint estimates.
    """

    def __init__(self, hours_per_story_point: float = 4.0):
        self.hours_per_story_point = max(1.0, hours_per_story_point)
        self.historical_actuals: List[Dict[str, float]] = []

    def calibrate_ratio(self, historical_completed_tasks: List[Dict[str, float]]) -> float:
        """Calibrate point-to-hours conversion ratio based on historical completed sprint velocity."""
        valid_pairs = [
            (t["story_points"], t["actual_hours"])
            for t in historical_completed_tasks
            if t.get("story_points", 0) > 0 and t.get("actual_hours", 0) > 0
        ]
        if not valid_pairs:
            return self.hours_per_story_point

        ratios = [hours / pts for pts, hours in valid_pairs]
        median_ratio = statistics.median(ratios)
        self.hours_per_story_point = round(median_ratio, 2)
        logger.info(f"Calibrated hours/point ratio to {self.hours_per_story_point}")
        return self.hours_per_story_point

    def calculate_fibonacci_consensus(self, votes: List[EstimatorVote], task_id: int = 0) -> EstimationSessionResult:
        if not votes:
            return EstimationSessionResult(
                task_id=task_id,
                technique=EstimationTechnique.PLANNING_POKER,
                total_votes=0,
                raw_mean=1.0,
                raw_median=1.0,
                standard_deviation=0.0,
                consensus_points=1.0,
                recommended_hours=self.hours_per_story_point,
                uncertainty_multiplier=1.0,
                vote_agreement_ratio=1.0,
                requires_deliberation=False
            )

        numeric_votes = [v.voted_points for v in votes]
        weights = [v.confidence_level for v in votes]

        # Weighted Mean
        total_w = sum(weights)
        weighted_mean = sum(v * w for v, w in zip(numeric_votes, weights)) / total_w if total_w > 0 else statistics.mean(numeric_votes)
        med = statistics.median(numeric_votes)
        std_dev = statistics.stdev(numeric_votes) if len(numeric_votes) > 1 else 0.0

        # Snap to nearest Fibonacci number
        closest_fib = min(FIBONACCI_SCALE, key=lambda x: abs(x - weighted_mean))

        # Agreement ratio
        max_dist = max(numeric_votes) - min(numeric_votes)
        requires_deliberation = (max_dist >= 5.0) or (std_dev > 3.0)
        agreement = max(0.0, 1.0 - (std_dev / (weighted_mean + 1e-5)))

        uncertainty = 1.0 + (std_dev * 0.1)
        recommended_hrs = round(closest_fib * self.hours_per_story_point * uncertainty, 1)

        return EstimationSessionResult(
            task_id=task_id,
            technique=EstimationTechnique.PLANNING_POKER,
            total_votes=len(votes),
            raw_mean=round(weighted_mean, 2),
            raw_median=round(med, 2),
            standard_deviation=round(std_dev, 2),
            consensus_points=closest_fib,
            recommended_hours=recommended_hrs,
            uncertainty_multiplier=round(uncertainty, 2),
            vote_agreement_ratio=round(agreement, 2),
            requires_deliberation=requires_deliberation
        )

    def calculate_pert_three_point(self, optimistic_hours: float, most_likely_hours: float, pessimistic_hours: float) -> Dict[str, float]:
        """
        PERT Beta Distribution Formula:
        Expected Time E = (O + 4M + P) / 6
        Standard Deviation SD = (P - O) / 6
        Variance V = SD^2
        """
        o = max(0.1, optimistic_hours)
        m = max(o, most_likely_hours)
        p = max(m, pessimistic_hours)

        expected = (o + 4.0 * m + p) / 6.0
        std_dev = (p - o) / 6.0
        variance = std_dev ** 2

        # 95% Confidence interval upper bound (E + 2*SD)
        p95_upper = expected + 2.0 * std_dev
        points = expected / self.hours_per_story_point

        closest_fib = min(FIBONACCI_SCALE, key=lambda x: abs(x - points))

        return {
            "optimistic_hours": round(o, 2),
            "most_likely_hours": round(m, 2),
            "pessimistic_hours": round(p, 2),
            "expected_hours": round(expected, 2),
            "standard_deviation": round(std_dev, 2),
            "variance": round(variance, 2),
            "p95_risk_hours": round(p95_upper, 2),
            "estimated_story_points": closest_fib
        }
