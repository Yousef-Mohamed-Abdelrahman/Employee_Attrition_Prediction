from dataclasses import dataclass
from functools import lru_cache

import joblib

from app.core.config import settings


@dataclass(frozen=True)
class ModelArtifacts:
    model: object
    model_columns: list[str]
    income_median: int | float
    threshold: float


@lru_cache
def load_artifacts() -> ModelArtifacts:
    return ModelArtifacts(
        model=joblib.load(settings.model_path),
        model_columns=joblib.load(settings.model_columns_path),
        income_median=joblib.load(settings.income_median_path),
        threshold=float(joblib.load(settings.threshold_path)),
    )

