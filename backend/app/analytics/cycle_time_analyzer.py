import math
import statistics
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any, Tuple
from pydantic import BaseModel, Field

class CycleTimeEvent(BaseModel):
    item_id: int
    item_code: str
    item_type: str  # "Task" or "Bug"
    created_at: datetime
    started_at: Optional[datetime] = None
    ready_for_test_at: Optional[datetime] = None
    tested_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class CycleTimeMetrics(BaseModel):
    total_items_analyzed: int
    lead_time_days_mean: float
    lead_time_days_p50: float
    lead_time_days_p85: float
    lead_time_days_p95: float
    cycle_time_days_mean: float
    cycle_time_days_p50: float
    cycle_time_days_p85: float
    cycle_time_days_p95: float
    development_time_days_mean: float
    testing_time_days_mean: float
    flow_efficiency_percent: float

class CycleTimeAnalyzer:
    """
    Lead Time, Cycle Time, and Process Flow Efficiency Analyzer.
    Evaluates stage dwell time and percentile distributions (p50, p85, p95).
    """

    @staticmethod
    def _percentile(data: List[float], percentile: float) -> float:
        if not data:
            return 0.0
        data_sorted = sorted(data)
        k = (len(data_sorted) - 1) * (percentile / 100.0)
        f = math.floor(k)
        c = math.ceil(k)
        if f == c:
            return data_sorted[int(k)]
        d0 = data_sorted[int(f)] * (c - k)
        d1 = data_sorted[int(c)] * (k - f)
        return d0 + d1

    @classmethod
    def analyze_items(cls, events: List[CycleTimeEvent]) -> CycleTimeMetrics:
        lead_times: List[float] = []
        cycle_times: List[float] = []
        dev_times: List[float] = []
        test_times: List[float] = []
        active_work_hours: List[float] = []

        for e in events:
            if not e.completed_at:
                continue

            # Lead time = completed_at - created_at
            lt = (e.completed_at - e.created_at).total_seconds() / 86400.0
            lead_times.append(max(0.01, lt))

            # Cycle time = completed_at - started_at
            if e.started_at:
                ct = (e.completed_at - e.started_at).total_seconds() / 86400.0
                cycle_times.append(max(0.01, ct))

                # Dev time = ready_for_test_at - started_at
                if e.ready_for_test_at:
                    dt = (e.ready_for_test_at - e.started_at).total_seconds() / 86400.0
                    dev_times.append(max(0.01, dt))
                    active_work_hours.append(dt * 8.0)

            # Test time = completed_at - ready_for_test_at
            if e.ready_for_test_at:
                tt = (e.completed_at - e.ready_for_test_at).total_seconds() / 86400.0
                test_times.append(max(0.01, tt))
                active_work_hours.append(tt * 8.0)

        n = len(lead_times)
        if n == 0:
            return CycleTimeMetrics(
                total_items_analyzed=0,
                lead_time_days_mean=0.0,
                lead_time_days_p50=0.0,
                lead_time_days_p85=0.0,
                lead_time_days_p95=0.0,
                cycle_time_days_mean=0.0,
                cycle_time_days_p50=0.0,
                cycle_time_days_p85=0.0,
                cycle_time_days_p95=0.0,
                development_time_days_mean=0.0,
                testing_time_days_mean=0.0,
                flow_efficiency_percent=0.0
            )

        lt_mean = statistics.mean(lead_times)
        ct_mean = statistics.mean(cycle_times) if cycle_times else 0.0
        dt_mean = statistics.mean(dev_times) if dev_times else 0.0
        tt_mean = statistics.mean(test_times) if test_times else 0.0

        # Flow efficiency: active work time / total lead time
        active_days = dt_mean + tt_mean
        flow_eff = (active_days / lt_mean * 100.0) if lt_mean > 0 else 0.0
        flow_eff = min(100.0, max(0.0, flow_eff))

        return CycleTimeMetrics(
            total_items_analyzed=n,
            lead_time_days_mean=round(lt_mean, 2),
            lead_time_days_p50=round(cls._percentile(lead_times, 50), 2),
            lead_time_days_p85=round(cls._percentile(lead_times, 85), 2),
            lead_time_days_p95=round(cls._percentile(lead_times, 95), 2),
            cycle_time_days_mean=round(ct_mean, 2),
            cycle_time_days_p50=round(cls._percentile(cycle_times, 50), 2),
            cycle_time_days_p85=round(cls._percentile(cycle_times, 85), 2),
            cycle_time_days_p95=round(cls._percentile(cycle_times, 95), 2),
            development_time_days_mean=round(dt_mean, 2),
            testing_time_days_mean=round(tt_mean, 2),
            flow_efficiency_percent=round(flow_eff, 2)
        )
