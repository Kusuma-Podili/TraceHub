"""
TraceHub Advanced Statistical Analytics & Queuing Simulation Engine.
Implements Little's Law, multi-server M/M/c queueing theory models,
and stochastic Monte Carlo distribution simulations for sprint delivery forecasting.
"""

import math
import random
import statistics
from datetime import datetime, date, timedelta
from typing import List, Dict, Optional, Any, Tuple, Callable
from enum import Enum
from pydantic import BaseModel, Field

class DistributionType(str, Enum):
    NORMAL = "Normal"
    LOG_NORMAL = "Log-Normal"
    TRIANGULAR = "Triangular"
    BETA_PERT = "Beta-PERT"
    WEIBULL = "Weibull"
    POISSON = "Poisson"
    EMPIRICAL_BOOTSTRAP = "Empirical Bootstrap"

class QueuingModelType(str, Enum):
    M_M_1 = "M/M/1 (Single Server Queue)"
    M_M_C = "M/M/c (Multi-Server Queue)"
    M_G_1 = "M/G/1 (General Service Time Queue)"

class QueuingPerformanceMetrics(BaseModel):
    arrival_rate_lambda: float  # Items per day arriving into backlog
    service_rate_mu: float      # Items per day completed per engineer
    servers_count_c: int        # Number of active engineers/testers
    utilization_factor_rho: float
    is_system_stable: bool
    average_wip_items_l: float
    average_queue_length_lq: float
    average_lead_time_days_w: float
    average_wait_time_days_wq: float
    p0_idle_probability: float

class ConfidenceBands(BaseModel):
    p10_optimistic: float
    p25_lower_quartile: float
    p50_median: float
    p75_upper_quartile: float
    p85_standard_commitment: float
    p90_conservative: float
    p95_high_certainty: float
    p99_near_absolute: float

class LittlesLawResult(BaseModel):
    wip_items: float
    throughput_items_per_day: float
    cycle_time_days: float
    target_metric: str
    derivation_formula: str

class StochasticDistributionSampler:
    """
    Precision Stochastic Sampling Engine for Empirical & Parametric Probability Distributions.
    """

    @staticmethod
    def sample_triangular(low: float, mode: float, high: float) -> float:
        """Sample from triangular distribution with minimum, mode, and maximum."""
        return random.triangular(low, high, mode)

    @staticmethod
    def sample_beta_pert(low: float, mode: float, high: float, shape_gamma: float = 4.0) -> float:
        """
        Sample from Beta-PERT distribution commonly used in project management estimation.
        Mean = (low + 4*mode + high) / 6
        Alpha = 1 + shape * (mean - low) / (high - low)
        Beta = 1 + shape * (high - mean) / (high - low)
        """
        if high <= low:
            return low
        mean = (low + shape_gamma * mode + high) / (shape_gamma + 2.0)
        range_val = high - low
        alpha = 1.0 + shape_gamma * (mean - low) / range_val
        beta_param = 1.0 + shape_gamma * (high - mean) / range_val

        # Sample from standard beta and scale
        sample_beta = random.betavariate(max(0.1, alpha), max(0.1, beta_param))
        return low + sample_beta * range_val

    @staticmethod
    def sample_lognormal(mean_days: float, std_dev_days: float) -> float:
        """
        Sample from Log-Normal distribution reflecting software task completion skewness.
        """
        if mean_days <= 0:
            return 0.1
        variance = std_dev_days ** 2
        mu = math.log((mean_days ** 2) / math.sqrt(variance + mean_days ** 2))
        sigma = math.sqrt(math.log(1.0 + (variance / (mean_days ** 2))))
        return random.lognormvariate(mu, sigma)

    @staticmethod
    def sample_weibull(scale_lambda: float, shape_k: float) -> float:
        """Weibull distribution sampler for software reliability and bug arrival modelling."""
        u = random.random()
        return scale_lambda * ((-math.log(1.0 - u)) ** (1.0 / shape_k))

    @staticmethod
    def sample_poisson(lambda_rate: float) -> int:
        """Poisson distribution sampler for discrete defect or request arrivals."""
        l_val = math.exp(-lambda_rate)
        k = 0
        p = 1.0
        while p > l_val:
            k += 1
            p *= random.random()
        return k - 1

    @staticmethod
    def bootstrap_resample(historical_data: List[float], sample_size: int) -> List[float]:
        """Bootstrap resampling with replacement from empirical historical telemetry."""
        if not historical_data:
            return [1.0] * sample_size
        return [random.choice(historical_data) for _ in range(sample_size)]


class LittlesLawCalculator:
    """
    Formal Implementation of Little's Law for Software Kanban & Sprint Workflows:
    L = λ * W (WIP = Throughput * Cycle Time)
    """

    @staticmethod
    def solve_for_cycle_time(wip_items: float, throughput_items_per_day: float) -> LittlesLawResult:
        th = max(0.001, throughput_items_per_day)
        cycle_time = wip_items / th
        return LittlesLawResult(
            wip_items=round(wip_items, 2),
            throughput_items_per_day=round(th, 3),
            cycle_time_days=round(cycle_time, 2),
            target_metric="Cycle Time (W)",
            derivation_formula="W = L / λ"
        )

    @staticmethod
    def solve_for_wip(throughput_items_per_day: float, cycle_time_days: float) -> LittlesLawResult:
        wip = throughput_items_per_day * cycle_time_days
        return LittlesLawResult(
            wip_items=round(wip, 2),
            throughput_items_per_day=round(throughput_items_per_day, 3),
            cycle_time_days=round(cycle_time_days, 2),
            target_metric="Work In Progress (L)",
            derivation_formula="L = λ * W"
        )

    @staticmethod
    def solve_for_throughput(wip_items: float, cycle_time_days: float) -> LittlesLawResult:
        ct = max(0.01, cycle_time_days)
        throughput = wip_items / ct
        return LittlesLawResult(
            wip_items=round(wip_items, 2),
            throughput_items_per_day=round(throughput, 3),
            cycle_time_days=round(ct, 2),
            target_metric="Throughput (λ)",
            derivation_formula="λ = L / W"
        )

class QueuingTheorySimulator:
    """
    Erlang-C Multi-Server M/M/c Queuing Engine for Engineering & QA Capacity Planning.
    Calculates queue congestion, developer utilization, and wait time distributions.
    """

    @classmethod
    def calculate_erlang_c(cls, arrival_rate: float, service_rate_per_server: float, servers_count: int) -> QueuingPerformanceMetrics:
        c = max(1, servers_count)
        lam = max(0.001, arrival_rate)
        mu = max(0.001, service_rate_per_server)

        # Traffic intensity (Erlang)
        a = lam / mu
        # Server utilization
        rho = a / c

        if rho >= 1.0:
            # Unstable queue: Arrivals exceed processing capacity!
            return QueuingPerformanceMetrics(
                arrival_rate_lambda=round(lam, 2),
                service_rate_mu=round(mu, 2),
                servers_count_c=c,
                utilization_factor_rho=round(rho, 3),
                is_system_stable=False,
                average_wip_items_l=float("inf"),
                average_queue_length_lq=float("inf"),
                average_lead_time_days_w=float("inf"),
                average_wait_time_days_wq=float("inf"),
                p0_idle_probability=0.0
            )

        # Compute P0 (Probability of zero items in system)
        sum_terms = sum((a ** n) / math.factorial(n) for n in range(c))
        last_term = ((a ** c) / (math.factorial(c) * (1.0 - rho)))
        p0 = 1.0 / (sum_terms + last_term)

        # Erlang C formula for probability that an arriving task must wait in queue: P(wait) = C(c, a)
        erlang_c_prob = last_term * p0

        # Average queue length (items waiting before being picked up by developer/tester)
        lq = (erlang_c_prob * rho) / (1.0 - rho)
        # Total average items in system (WIP)
        l = lq + a
        # Average wait time in queue (days)
        wq = lq / lam
        # Total lead time / system time (days)
        w = wq + (1.0 / mu)

        return QueuingPerformanceMetrics(
            arrival_rate_lambda=round(lam, 2),
            service_rate_mu=round(mu, 2),
            servers_count_c=c,
            utilization_factor_rho=round(rho, 3),
            is_system_stable=True,
            average_wip_items_l=round(l, 2),
            average_queue_length_lq=round(lq, 2),
            average_lead_time_days_w=round(w, 2),
            average_wait_time_days_wq=round(wq, 2),
            p0_idle_probability=round(p0, 4)
        )


class MonteCarloSimulationEngine:
    """
    Enterprise Stochastic Delivery Forecasting Engine.
    Executes multi-run Monte Carlo simulations with confidence bands,
    burn-rate variance tracking, and probability distributions.
    """

    def __init__(self, iterations: int = 2500):
        self.iterations = max(100, iterations)
        self.random_seed: Optional[int] = None

    def set_seed(self, seed: int) -> None:
        self.random_seed = seed
        random.seed(seed)

    def run_backlog_completion_simulation(
        self,
        remaining_items: int,
        daily_throughput_samples: List[int],
        start_date: Optional[date] = None,
        target_deadline: Optional[date] = None
    ) -> Dict[str, Any]:
        if start_date is None:
            start_date = date.today()

        if not daily_throughput_samples or all(x <= 0 for x in daily_throughput_samples):
            daily_throughput_samples = [1, 2, 0, 3, 1, 2, 1, 0, 2, 2, 3, 1, 0, 2, 4]

        results_days: List[int] = []

        for _ in range(self.iterations):
            items_left = remaining_items
            elapsed_days = 0
            while items_left > 0:
                sampled_tp = random.choice(daily_throughput_samples)
                items_left -= sampled_tp
                elapsed_days += 1
                if elapsed_days > 730:  # 2 years safeguard
                    break
            results_days.append(elapsed_days)

        results_days.sort()

        def get_quantile(q: float) -> int:
            idx = int(self.iterations * q)
            idx = min(self.iterations - 1, max(0, idx))
            return results_days[idx]

        bands = ConfidenceBands(
            p10_optimistic=float(get_quantile(0.10)),
            p25_lower_quartile=float(get_quantile(0.25)),
            p50_median=float(get_quantile(0.50)),
            p75_upper_quartile=float(get_quantile(0.75)),
            p85_standard_commitment=float(get_quantile(0.85)),
            p90_conservative=float(get_quantile(0.90)),
            p95_high_certainty=float(get_quantile(0.95)),
            p99_near_absolute=float(get_quantile(0.99))
        )

        calendar_dates = {
            "p10": (start_date + timedelta(days=int(bands.p10_optimistic))).isoformat(),
            "p50": (start_date + timedelta(days=int(bands.p50_median))).isoformat(),
            "p85": (start_date + timedelta(days=int(bands.p85_standard_commitment))).isoformat(),
            "p95": (start_date + timedelta(days=int(bands.p95_high_certainty))).isoformat()
        }

        # Histogram frequency distribution
        min_d = results_days[0]
        max_d = results_days[-1]
        bucket_count = min(30, max(5, max_d - min_d + 1))
        step = max(1.0, (max_d - min_d + 1) / bucket_count)

        histogram = []
        for b in range(bucket_count):
            b_start = min_d + (b * step)
            b_end = b_start + step
            count = sum(1 for d in results_days if b_start <= d < b_end)
            freq = count / self.iterations
            histogram.append({
                "days_range": f"{int(b_start)}-{int(b_end)}",
                "count": count,
                "frequency_percent": round(freq * 100.0, 2),
                "cumulative_probability_percent": round(sum(1 for d in results_days if d < b_end) / self.iterations * 100.0, 2)
            })

        # Probability of meeting deadline
        prob_deadline = None
        if target_deadline:
            days_allowed = (target_deadline - start_date).days
            met_runs = sum(1 for d in results_days if d <= days_allowed)
            prob_deadline = round(met_runs / self.iterations * 100.0, 2)

        return {
            "simulations_count": self.iterations,
            "remaining_backlog_items": remaining_items,
            "historical_throughput_mean": round(statistics.mean(daily_throughput_samples), 2),
            "historical_throughput_stdev": round(statistics.stdev(daily_throughput_samples), 2) if len(daily_throughput_samples) > 1 else 0.0,
            "confidence_bands_days": bands.model_dump(),
            "calendar_projections": calendar_dates,
            "probability_meeting_target_deadline_percent": prob_deadline,
            "distribution_histogram": histogram
        }

    def run_sprint_scope_risk_simulation(
        self,
        committed_points: float,
        daily_velocity_mean: float,
        daily_velocity_stdev: float,
        sprint_days: int,
        scope_creep_probability: float = 0.25,
        avg_scope_creep_points: float = 3.0
    ) -> Dict[str, Any]:
        """
        Simulate scope creep and velocity volatility over a sprint duration.
        """
        success_runs = 0
        final_completed_points_list: List[float] = []

        for _ in range(self.iterations):
            current_scope = committed_points
            points_done = 0.0

            for _ in range(sprint_days):
                # Daily velocity sample
                daily_v = max(0.0, random.gauss(daily_velocity_mean, daily_velocity_stdev))
                points_done += daily_v

                # Scope creep event
                if random.random() < scope_creep_probability:
                    current_scope += random.expovariate(1.0 / max(0.5, avg_scope_creep_points))

            final_completed_points_list.append(points_done)
            if points_done >= current_scope:
                success_runs += 1

        final_completed_points_list.sort()
        success_rate = (success_runs / self.iterations * 100.0)

        return {
            "sprint_days": sprint_days,
            "committed_points": committed_points,
            "sprint_completion_probability_percent": round(success_rate, 2),
            "p50_expected_delivered_points": round(final_completed_points_list[int(self.iterations * 0.5)], 2),
            "p85_conservative_delivered_points": round(final_completed_points_list[int(self.iterations * 0.15)], 2),
            "p95_safe_delivered_points": round(final_completed_points_list[int(self.iterations * 0.05)], 2)
        }
