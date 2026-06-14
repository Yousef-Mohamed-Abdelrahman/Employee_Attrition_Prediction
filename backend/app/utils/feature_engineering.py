import pandas as pd


# ─── Roles where overtime is especially high-risk ──────────────────────────
HIGH_RISK_OVERTIME_ROLES: frozenset[str] = frozenset({
    "Sales Representative",
    "Laboratory Technician",
    "Human Resources",
})

# ─── All categorical columns that will be one-hot encoded ──────────────────
CATEGORICAL_FIELDS: list[str] = [
    "BusinessTravel",
    "Department",
    "EducationField",
    "Gender",
    "JobRole",
    "MaritalStatus",
    "OverTime",
]

# ─── Original numeric columns (for reference / documentation) ──────────────
NUMERIC_FIELDS: list[str] = [
    "Age", "DailyRate", "DistanceFromHome", "Education",
    "EnvironmentSatisfaction", "HourlyRate", "JobInvolvement",
    "JobLevel", "JobSatisfaction", "MonthlyIncome", "MonthlyRate",
    "NumCompaniesWorked", "PercentSalaryHike", "PerformanceRating",
    "RelationshipSatisfaction", "StockOptionLevel", "TotalWorkingYears",
    "TrainingTimesLastYear", "WorkLifeBalance", "YearsAtCompany",
    "YearsInCurrentRole", "YearsSinceLastPromotion", "YearsWithCurrManager",
]


def engineer_features(payload: dict, income_median: int | float) -> pd.DataFrame:
    """
    Apply the same feature engineering that was used during model training:

    - IsYoungEmployee   : Age < 30
    - LowIncome         : MonthlyIncome < training median
    - LongDistance      : DistanceFromHome > 10
    - PromotionDelay    : YearsSinceLastPromotion >= 5
    - HighRiskOvertime  : OverTime == 'Yes' AND JobRole in high-risk set
    """
    row = payload.copy()

    row["IsYoungEmployee"] = int(row["Age"] < 30)
    row["LowIncome"]       = int(row["MonthlyIncome"] < income_median)
    row["LongDistance"]    = int(row["DistanceFromHome"] > 10)
    row["PromotionDelay"]  = int(row["YearsSinceLastPromotion"] >= 5)
    row["HighRiskOvertime"] = int(
        row["OverTime"] == "Yes"
        and row["JobRole"] in HIGH_RISK_OVERTIME_ROLES
    )

    return pd.DataFrame([row])


def encode_for_model(df: pd.DataFrame, model_columns: list[str]) -> pd.DataFrame:
    """
    One-hot encode categorical fields with drop_first=True (mirrors training),
    then reindex to the exact model column order, filling any missing columns
    with 0.
    """
    encoded = pd.get_dummies(
        df,
        columns=CATEGORICAL_FIELDS,
        drop_first=True,
        dtype=int,
    )
    return encoded.reindex(columns=model_columns, fill_value=0)
