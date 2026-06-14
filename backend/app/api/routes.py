import time
from fastapi import APIRouter, HTTPException

from app.models.schemas import EmployeeInput, PredictionResponse
from app.services.model_loader import load_artifacts
from app.services.predictor import predict_attrition


router = APIRouter(tags=["Attrition"])


@router.get("/health", summary="Service health check")
def health() -> dict:
    """Returns model status, feature count, and threshold."""
    try:
        artifacts = load_artifacts()
        return {
            "status":        "ok",
            "model":         artifacts.model.__class__.__name__,
            "feature_count": len(artifacts.model_columns),
            "threshold":     artifacts.threshold,
            "income_median": artifacts.income_median,
        }
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Model not loaded: {exc}") from exc


@router.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict employee attrition",
)
def predict(employee: EmployeeInput) -> PredictionResponse:
    """
    Accepts a full employee profile and returns:
    - Attrition probability
    - Risk level (Low / Medium / High)
    - Top 5 SHAP factors increasing risk
    - Full feature contribution list
    - HR recommendations
    """
    try:
        return predict_attrition(employee)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
