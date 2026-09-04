import math
import random
import statistics
from datetime import date, timedelta
from typing import List, Dict, Optional, Any, Tuple
from pydantic import BaseModel

class MonteCarloSimulationResult(BaseModel):
    remaining_tasks_count: int
    historical_samples_count: int
    simulations_run: int
    p50_days_needed: int
    p75_days_needed: int
    p85_days_needed: int
    p95_days_needed: int
    p50_completion_date: str
    p75_completion_date: str
    p85_completion_date: str
    p95_completion_date: str
    probability_of_meeting_deadline: float
    confidence_assessment: str

class MonteCarloForecasting:
    """
    Probabilistic Monte Carlo Sprint & Release Forecasting Simulator.
    Simulates thousands of delivery paths using historical daily throughput samples.
    """

    @classmethod
    def simulate_delivery(
        cls,
        remaining_backlog_items: int,
        historical_daily_throughput: List[int],
        target_deadline: Optional[date] = None,
        iterations: int = 1000,
        start_date: Optional[date] = None
    ) -> MonteCarloSimulationResult:
        if start_date is None:
            start_date = date.today()

        # Fallback if no history
        if not historical_daily_throughput or all(x == 0 for x in historical_daily_throughput):
            historical_daily_throughput = [1, 2, 0, 3, 1, 2, 1, 0, 2, 2]

        simulated_days: List[int] = []

        for _ in range(iterations):
            items_left = remaining_backlog_items
            days_count = 0
            while items_left > 0:
                throughput = random.choice(historical_daily_throughput)
                items_left -= throughput
                days_count += 1
                if days_count > 365:  # Safeguard upper bound
                    break
            simulated_days.append(days_count)

        simulated_days.sort()

        p50 = simulated_days[int(iterations * 0.50)]
        p75 = simulated_days[int(iterations * 0.75)]
        p85 = simulated_days[int(iterations * 0.85)]
        p95 = simulated_days[int(iterations * 0.95)]

        d_p50 = start_date + timedelta(days=p50)
        d_p75 = start_date + timedelta(days=p75)
        d_p85 = start_date + timedelta(days=p85)
        d_p95 = start_date + timedelta(days=p95)

        prob_deadline = 1.0
        if target_deadline:
            days_to_deadline = (target_deadline - start_date).days
            met_count = sum(1 for d in simulated_days if d <= days_to_deadline)
            prob_deadline = met_count / iterations

        confidence = "High" if prob_deadline >= 0.85 else ("Moderate" if prob_deadline >= 0.60 else "Low Risk")

        return MonteCarloSimulationResult(
            remaining_tasks_count=remaining_backlog_items,
            historical_samples_count=len(historical_daily_throughput),
            simulations_run=iterations,
            p50_days_needed=p50,
            p75_days_needed=p75,
            p85_days_needed=p85,
            p95_days_needed=p95,
            p50_completion_date=d_p50.isoformat(),
            p75_completion_date=d_p75.isoformat(),
            p85_completion_date=d_p85.isoformat(),
            p95_completion_date=d_p95.isoformat(),
            probability_of_meeting_deadline=round(prob_deadline, 3),
            confidence_assessment=confidence
        )
