"""
TraceHub Advanced Mathematical Forecasting, Time Series & Reliability Models.
Includes Holt-Winters Exponential Smoothing, Kalman Filters for Velocity Tracking,
Rayleigh Software Reliability Models, and Multi-Horizon Sprint Forecasting.
"""

import math
import statistics
from typing import List, Dict, Optional, Any, Tuple
from pydantic import BaseModel, Field

class TimeSeriesPoint(BaseModel):
    timestamp: str
    observed_value: float
    fitted_value: Optional[float] = None
    forecast_value: Optional[float] = None
    lower_bound_95: Optional[float] = None
    upper_bound_95: Optional[float] = None

class HoltWintersResult(BaseModel):
    model_type: str  # "Additive" or "Multiplicative"
    alpha: float
    beta: float
    gamma: float
    season_length: int
    mean_squared_error: float
    mean_absolute_percentage_error: float
    series_points: List[TimeSeriesPoint]
    forecast_points: List[TimeSeriesPoint]

class KalmanFilterState(BaseModel):
    estimated_velocity: float
    velocity_variance: float
    process_noise: float
    measurement_noise: float
    gain: float


class HoltWintersForecaster:
    """
    Triple Exponential Smoothing (Holt-Winters) for Sprint Velocity & Workload Forecasting.
    Handles level (alpha), trend (beta), and seasonal (gamma) components.
    """

    def __init__(self, season_length: int = 4, alpha: float = 0.3, beta: float = 0.1, gamma: float = 0.1):
        self.season_length = max(2, season_length)
        self.alpha = min(1.0, max(0.01, alpha))
        self.beta = min(1.0, max(0.01, beta))
        self.gamma = min(1.0, max(0.01, gamma))

    def _initial_trend(self, series: List[float]) -> float:
        sum_val = 0.0
        for i in range(self.season_length):
            sum_val += (series[i + self.season_length] - series[i]) / self.season_length
        return sum_val / self.season_length

    def _initial_seasonal_components(self, series: List[float]) -> List[float]:
        seasonals = [0.0] * self.season_length
        n_seasons = len(series) // self.season_length
        season_averages = []
        for j in range(n_seasons):
            avg = sum(series[j * self.season_length : (j + 1) * self.season_length]) / self.season_length
            season_averages.append(avg)

        for i in range(self.season_length):
            sum_val = 0.0
            for j in range(n_seasons):
                sum_val += series[j * self.season_length + i] - season_averages[j]
            seasonals[i] = sum_val / n_seasons
        return seasonals

    def forecast_additive(self, series: List[float], forecast_horizon: int = 6) -> HoltWintersResult:
        n = len(series)
        if n < self.season_length * 2:
            # Fallback to simple exponential smoothing if insufficient seasonal cycles
            return self._fallback_simple_forecast(series, forecast_horizon)

        seasonals = self._initial_seasonal_components(series)
        level = series[0]
        trend = self._initial_trend(series)

        fitted: List[float] = []
        levels: List[float] = [level]
        trends: List[float] = [trend]

        for i in range(n):
            val = series[i]
            prev_level = level
            prev_trend = trend
            season_idx = i % self.season_length
            prev_seasonal = seasonals[season_idx]

            # Level update: L_t = alpha * (Y_t - S_{t-m}) + (1 - alpha) * (L_{t-1} + T_{t-1})
            level = self.alpha * (val - prev_seasonal) + (1.0 - self.alpha) * (prev_level + prev_trend)
            # Trend update: T_t = beta * (L_t - L_{t-1}) + (1 - beta) * T_{t-1}
            trend = self.beta * (level - prev_level) + (1.0 - self.beta) * prev_trend
            # Seasonal update: S_t = gamma * (Y_t - L_t) + (1 - gamma) * S_{t-m}
            seasonals[season_idx] = self.gamma * (val - level) + (1.0 - self.gamma) * prev_seasonal

            fit_val = prev_level + prev_trend + prev_seasonal
            fitted.append(fit_val)
            levels.append(level)
            trends.append(trend)

        # Forecast future points
        forecast_pts: List[float] = []
        for m in range(1, forecast_horizon + 1):
            season_idx = (n + m - 1) % self.season_length
            fc = level + (m * trend) + seasonals[season_idx]
            forecast_pts.append(max(0.0, fc))

        # Error metrics
        errors = [abs(series[i] - fitted[i]) for i in range(n)]
        mse = statistics.mean([e ** 2 for e in errors]) if errors else 0.0
        mape = statistics.mean([(e / max(0.1, series[i])) * 100.0 for i, e in enumerate(errors)]) if errors else 0.0
        std_err = math.sqrt(mse)

        series_objs: List[TimeSeriesPoint] = []
        for i in range(n):
            series_objs.append(TimeSeriesPoint(
                timestamp=f"Sprint {i+1}",
                observed_value=round(series[i], 2),
                fitted_value=round(fitted[i], 2),
                lower_bound_95=round(max(0.0, fitted[i] - 1.96 * std_err), 2),
                upper_bound_95=round(fitted[i] + 1.96 * std_err, 2)
            ))

        forecast_objs: List[TimeSeriesPoint] = []
        for j, fc in enumerate(forecast_pts):
            forecast_objs.append(TimeSeriesPoint(
                timestamp=f"Sprint {n+j+1} (Projected)",
                observed_value=0.0,
                forecast_value=round(fc, 2),
                lower_bound_95=round(max(0.0, fc - 1.96 * std_err * math.sqrt(j + 1)), 2),
                upper_bound_95=round(fc + 1.96 * std_err * math.sqrt(j + 1), 2)
            ))

        return HoltWintersResult(
            model_type="Additive",
            alpha=self.alpha,
            beta=self.beta,
            gamma=self.gamma,
            season_length=self.season_length,
            mean_squared_error=round(mse, 3),
            mean_absolute_percentage_error=round(mape, 2),
            series_points=series_objs,
            forecast_points=forecast_objs
        )

    def _fallback_simple_forecast(self, series: List[float], horizon: int) -> HoltWintersResult:
        mean_val = statistics.mean(series) if series else 10.0
        stdev_val = statistics.stdev(series) if len(series) > 1 else 2.0

        series_objs = [
            TimeSeriesPoint(timestamp=f"Sprint {i+1}", observed_value=round(v, 2), fitted_value=round(v, 2))
            for i, v in enumerate(series)
        ]
        forecast_objs = [
            TimeSeriesPoint(
                timestamp=f"Sprint {len(series)+j+1} (Projected)",
                observed_value=0.0,
                forecast_value=round(mean_val, 2),
                lower_bound_95=round(max(0.0, mean_val - 1.96 * stdev_val), 2),
                upper_bound_95=round(mean_val + 1.96 * stdev_val, 2)
            )
            for j in range(horizon)
        ]

        return HoltWintersResult(
            model_type="Simple Mean Fallback",
            alpha=self.alpha,
            beta=self.beta,
            gamma=self.gamma,
            season_length=self.season_length,
            mean_squared_error=round(stdev_val ** 2, 3),
            mean_absolute_percentage_error=10.0,
            series_points=series_objs,
            forecast_points=forecast_objs
        )


class KalmanVelocityTracker:
    """
    1-Dimensional Recursive Kalman Filter for Noisy Sprint Velocity Tracking.
    Filters out transient sprint volatility to estimate the true underlying team throughput.
    """

    def __init__(self, initial_velocity: float = 20.0, initial_variance: float = 10.0, process_noise_q: float = 1.0, measurement_noise_r: float = 4.0):
        self.x = initial_velocity  # State estimate
        self.p = initial_variance  # Estimation error covariance
        self.q = process_noise_q   # Process noise covariance
        self.r = measurement_noise_r  # Measurement noise covariance

    def update(self, observed_velocity: float) -> KalmanFilterState:
        # 1. Predict step
        x_pred = self.x
        p_pred = self.p + self.q

        # 2. Update step
        kalman_gain = p_pred / (p_pred + self.r)
        self.x = x_pred + kalman_gain * (observed_velocity - x_pred)
        self.p = (1.0 - kalman_gain) * p_pred

        return KalmanFilterState(
            estimated_velocity=round(self.x, 2),
            velocity_variance=round(self.p, 3),
            process_noise=self.q,
            measurement_noise=self.r,
            gain=round(kalman_gain, 3)
        )

    def filter_series(self, observed_velocities: List[float]) -> List[KalmanFilterState]:
        states = []
        for v in observed_velocities:
            states.append(self.update(v))
        return states


class RayleighDefectReliabilityModel:
    """
    Norden-Rayleigh Software Reliability Model for Defect Discovery & Staffing Estimation:
    Cumulative Defects D(t) = K * [1 - e^{-t^2 / (2 * t_m^2)}]
    Defect Arrival Rate d(t) = (K * t / t_m^2) * e^{-t^2 / (2 * t_m^2)}
    where K is total lifetime defects, and t_m is peak discovery time (usually at system test).
    """

    @staticmethod
    def calculate_rayleigh_curve(
        total_projected_defects_k: float,
        peak_discovery_time_tm_weeks: float,
        duration_weeks: int = 24
    ) -> List[Dict[str, float]]:
        tm = max(1.0, peak_discovery_time_tm_weeks)
        k = max(1.0, total_projected_defects_k)
        curve: List[Dict[str, float]] = []

        for week in range(1, duration_weeks + 1):
            t = float(week)
            exponent = -(t ** 2) / (2.0 * (tm ** 2))
            # Cumulative defects
            cum_d = k * (1.0 - math.exp(exponent))
            # Weekly defect arrival rate
            rate = (k * t / (tm ** 2)) * math.exp(exponent)

            curve.append({
                "week_number": week,
                "weekly_discovery_rate": round(rate, 2),
                "cumulative_defects": round(cum_d, 2),
                "remaining_latent_defects": round(max(0.0, k - cum_d), 2)
            })

        return curve

    @staticmethod
    def estimate_parameters_from_history(weekly_defect_arrivals: List[int]) -> Tuple[float, float]:
        """Estimate peak time (t_m) and total capacity (K) from historical defect spikes."""
        if not weekly_defect_arrivals:
            return 50.0, 8.0

        max_val = max(weekly_defect_arrivals)
        tm = float(weekly_defect_arrivals.index(max_val) + 1)
        total_seen = sum(weekly_defect_arrivals)
        # At peak t = t_m, cumulative defects is ~39.3% of total K
        estimated_k = total_seen / 0.8 if len(weekly_defect_arrivals) > tm * 1.5 else total_seen * 1.6
        return round(estimated_k, 1), round(tm, 1)
