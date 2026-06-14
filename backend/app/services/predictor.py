from app.models.schemas import EmployeeInput, PredictionResponse
from app.services.explainer import explain_prediction
from app.services.model_loader import load_artifacts
from app.services.recommendations import build_recommendations
from app.utils.feature_engineering import encode_for_model, engineer_features


def risk_level(probability: float) -> str:
    """Bucket a probability float into a human-readable risk tier."""
    if probability < 0.30:
        return "Low Risk"
    if probability < 0.60:
        return "Medium Risk"
    return "High Risk"


def predict_attrition(employee: EmployeeInput) -> PredictionResponse:
    """
    Full prediction pipeline:
    1. Feature engineering (derived features)
    2. One-hot encoding aligned to model columns
    3. XGBoost probability prediction
    4. SHAP explainability
    5. HR recommendations
    """
    artifacts = load_artifacts()
    raw       = employee.model_dump()

    # Step 1 – engineer derived features
    engineered = engineer_features(raw, artifacts.income_median)

    # Step 2 – encode to model column space
    model_input = encode_for_model(engineered, artifacts.model_columns)

    # Step 3 – predict
    proba       = float(artifacts.model.predict_proba(model_input)[0][1])
    prediction  = "Attrition Likely" if proba >= artifacts.threshold else "Attrition Unlikely"

    # Step 4 – explain
    contributions, base_value = explain_prediction(model_input)
    increasing = [f for f in contributions if f.contribution > 0]

    # Step 5 – recommendations
    recommendations = build_recommendations(employee, artifacts.income_median)

    return PredictionResponse(
        probability=proba,
        prediction=prediction,
        risk_level=risk_level(proba),
        threshold=artifacts.threshold,
        top_factors=increasing[:5],
        feature_contributions=contributions[:20],
        recommendations=recommendations,
        shap_base_value=base_value,
    )
