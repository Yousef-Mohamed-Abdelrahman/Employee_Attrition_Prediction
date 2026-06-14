from functools import lru_cache
from typing import Any

import numpy as np
import pandas as pd

from app.models.schemas import Factor
from app.services.model_loader import load_artifacts


@lru_cache(maxsize=1)
def get_shap_explainer() -> Any | None:
    """
    Build a SHAP TreeExplainer for the loaded XGBoost model.
    Cached after first call so it is not rebuilt on every request.
    Returns None if SHAP is unavailable.
    """
    try:
        import shap
        artifacts = load_artifacts()
        return shap.TreeExplainer(artifacts.model)
    except Exception:
        return None


def _extract_base_value(raw_base: Any) -> float | None:
    """Safely extract a scalar base value from SHAP's expected_value."""
    try:
        arr = np.asarray(raw_base).reshape(-1)
        return float(arr[0])
    except Exception:
        return None


def explain_prediction(
    model_input: pd.DataFrame,
) -> tuple[list[Factor], float | None]:
    """
    Compute per-feature SHAP contributions for a single employee row.

    Returns:
        factors    – List of Factor objects sorted by |contribution| desc.
        base_value – SHAP base (expected) value, or None.
    """
    explainer = get_shap_explainer()
    if explainer is None:
        return [], None

    raw_shap = explainer.shap_values(model_input)
    values   = np.asarray(raw_shap)

    # Handle multi-output shape (n_classes, n_samples, n_features)
    if values.ndim == 3:
        values = values[:, :, 1]        # positive class
    values = values.reshape(model_input.shape[0], -1)[0]  # single row

    factors: list[Factor] = []
    for col, contrib in zip(model_input.columns, values):
        contrib_f = float(contrib)
        if abs(contrib_f) < 1e-9:
            continue
        raw_val = model_input.iloc[0][col]
        factors.append(
            Factor(
                feature=col,
                value=raw_val.item() if hasattr(raw_val, "item") else raw_val,
                contribution=contrib_f,
                direction="increase" if contrib_f >= 0 else "decrease",
            )
        )

    factors.sort(key=lambda f: abs(f.contribution), reverse=True)
    base = _extract_base_value(getattr(explainer, "expected_value", None))
    return factors, base
