import math
from datetime import datetime, date, timedelta
from typing import List, Dict, Optional, Any, Tuple
from pydantic import BaseModel, Field

class BurndownPoint(BaseModel):
    date_str: str
    day_number: int
    ideal_remaining_points: float
    actual_remaining_points: float
    completed_points_today: float
    added_scope_points_today: float
    blocked_points_today: float

class BurnupPoint(BaseModel):
    date_str: str
    day_number: int
    total_scope_points: float
    completed_points_cum: float
    ideal_linear_points: float

class BurndownCalculator:
    """
    Enterprise Sprint Burndown, Burnup, and Scope Churn Telemetry Engine.
    Computes ideal daily burn gradients, actual variance curves, and projected finish dates.
    """

    @staticmethod
    def calculate_sprint_burndown(
        start_date: date,
        end_date: date,
        initial_committed_points: float,
        daily_completed_deltas: Dict[str, float],
        daily_added_scope_deltas: Optional[Dict[str, float]] = None,
        daily_blocked_deltas: Optional[Dict[str, float]] = None,
        eval_date: Optional[date] = None
    ) -> List[BurndownPoint]:
        if daily_added_scope_deltas is None:
            daily_added_scope_deltas = {}
        if daily_blocked_deltas is None:
            daily_blocked_deltas = {}
        if eval_date is None:
            eval_date = date.today()

        total_days = max(1, (end_date - start_date).days + 1)
        # Business days calculation
        working_days = 0
        cur = start_date
        while cur <= end_date:
            if cur.weekday() < 5:
                working_days += 1
            cur += timedelta(days=1)
        working_days = max(1, working_days)

        points: List[BurndownPoint] = []
        actual_remaining = initial_committed_points
        ideal_decrement_per_work_day = initial_committed_points / working_days

        cur_date = start_date
        day_idx = 0
        work_day_idx = 0

        while cur_date <= end_date:
            ds = cur_date.isoformat()
            is_work = (cur_date.weekday() < 5)
            if is_work:
                work_day_idx += 1

            ideal_val = max(0.0, initial_committed_points - (ideal_decrement_per_work_day * work_day_idx))

            completed_today = daily_completed_deltas.get(ds, 0.0)
            added_today = daily_added_scope_deltas.get(ds, 0.0)
            blocked_today = daily_blocked_deltas.get(ds, 0.0)

            if cur_date <= eval_date:
                actual_remaining = max(0.0, actual_remaining - completed_today + added_today)
                act_val = round(actual_remaining, 2)
            else:
                act_val = None  # Future day

            points.append(BurndownPoint(
                date_str=ds,
                day_number=day_idx + 1,
                ideal_remaining_points=round(ideal_val, 2),
                actual_remaining_points=act_val if act_val is not None else 0.0,
                completed_points_today=round(completed_today, 2),
                added_scope_points_today=round(added_today, 2),
                blocked_points_today=round(blocked_today, 2)
            ))

            cur_date += timedelta(days=1)
            day_idx += 1

        return points

    @staticmethod
    def calculate_sprint_burnup(
        start_date: date,
        end_date: date,
        initial_points: float,
        daily_completed_deltas: Dict[str, float],
        daily_scope_changes: Dict[str, float]
    ) -> List[BurnupPoint]:
        points: List[BurnupPoint] = []
        total_scope = initial_points
        cum_completed = 0.0

        cur = start_date
        idx = 1
        total_days = max(1, (end_date - start_date).days + 1)

        while cur <= end_date:
            ds = cur.isoformat()
            scope_change = daily_scope_changes.get(ds, 0.0)
            total_scope += scope_change
            completed_today = daily_completed_deltas.get(ds, 0.0)
            cum_completed += completed_today

            ideal = (initial_points / total_days) * idx

            points.append(BurnupPoint(
                date_str=ds,
                day_number=idx,
                total_scope_points=round(total_scope, 2),
                completed_points_cum=round(cum_completed, 2),
                ideal_linear_points=round(ideal, 2)
            ))
            cur += timedelta(days=1)
            idx += 1

        return points
