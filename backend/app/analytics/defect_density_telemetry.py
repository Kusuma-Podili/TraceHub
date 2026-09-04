import math
from typing import List, Dict, Optional, Any
from pydantic import BaseModel

class DefectDensityMetrics(BaseModel):
    module_name: str
    kloc_estimate: float
    total_defects_reported: int
    critical_defects_count: int
    defect_density_per_kloc: float
    defect_escape_rate_percent: float
    mean_time_to_resolve_hours: float
    quality_index_score: float  # 0 to 100

class DefectDensityTelemetry:
    """
    Defect Density, Defect Escape Rate, and Quality Index Telemetry.
    Computes defect density per 1,000 Lines of Code (KLOC) and Mean Time to Resolution (MTTR).
    """

    @staticmethod
    def calculate_module_density(
        module_name: str,
        kloc: float,
        defects: List[Dict[str, Any]],
        production_defects_escaped: int = 0
    ) -> DefectDensityMetrics:
        kloc_safe = max(0.1, kloc)
        total_bugs = len(defects)
        crit_bugs = sum(1 for b in defects if b.get("severity") in ["Critical", "High"])

        density = total_bugs / kloc_safe

        # Defect escape rate
        escape_rate = (production_defects_escaped / (total_bugs + production_defects_escaped) * 100.0) if (total_bugs + production_defects_escaped) > 0 else 0.0

        # MTTR (Mean time to resolve)
        resolve_durations: List[float] = []
        for b in defects:
            if b.get("resolved_hours"):
                resolve_durations.append(float(b["resolved_hours"]))

        mttr = sum(resolve_durations) / len(resolve_durations) if resolve_durations else 24.0

        # Quality Index Score: Higher is better, penalized by density and critical bugs
        base_score = 100.0
        score = base_score - (density * 5.0) - (crit_bugs * 8.0) - (escape_rate * 0.5)
        final_score = max(10.0, min(100.0, score))

        return DefectDensityMetrics(
            module_name=module_name,
            kloc_estimate=round(kloc_safe, 2),
            total_defects_reported=total_bugs,
            critical_defects_count=crit_bugs,
            defect_density_per_kloc=round(density, 2),
            defect_escape_rate_percent=round(escape_rate, 2),
            mean_time_to_resolve_hours=round(mttr, 1),
            quality_index_score=round(final_score, 1)
        )
