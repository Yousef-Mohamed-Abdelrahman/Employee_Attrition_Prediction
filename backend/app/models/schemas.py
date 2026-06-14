from typing import Any, Literal
from pydantic import BaseModel, Field


BusinessTravel = Literal["Non-Travel", "Travel_Rarely", "Travel_Frequently"]
Department = Literal["Human Resources", "Research & Development", "Sales"]
EducationField = Literal[
    "Life Sciences",
    "Marketing",
    "Medical",
    "Other",
    "Technical Degree",
    "Human Resources",
]
Gender = Literal["Male", "Female"]
JobRole = Literal[
    "Healthcare Representative",
    "Human Resources",
    "Laboratory Technician",
    "Manager",
    "Manufacturing Director",
    "Research Director",
    "Research Scientist",
    "Sales Executive",
    "Sales Representative",
]
MaritalStatus = Literal["Married", "Single", "Divorced"]
OverTime = Literal["Yes", "No"]


class EmployeeInput(BaseModel):
    Age: int = Field(..., ge=16, le=80)
    DailyRate: int = Field(..., ge=0)
    DistanceFromHome: int = Field(..., ge=0)
    Education: int = Field(..., ge=1, le=5)
    EnvironmentSatisfaction: int = Field(..., ge=1, le=4)
    HourlyRate: int = Field(..., ge=0)
    JobInvolvement: int = Field(..., ge=1, le=4)
    JobLevel: int = Field(..., ge=1, le=5)
    JobSatisfaction: int = Field(..., ge=1, le=4)
    MonthlyIncome: int = Field(..., ge=0)
    MonthlyRate: int = Field(..., ge=0)
    NumCompaniesWorked: int = Field(..., ge=0)
    PercentSalaryHike: int = Field(..., ge=0)
    PerformanceRating: int = Field(..., ge=1, le=4)
    RelationshipSatisfaction: int = Field(..., ge=1, le=4)
    StockOptionLevel: int = Field(..., ge=0, le=3)
    TotalWorkingYears: int = Field(..., ge=0)
    TrainingTimesLastYear: int = Field(..., ge=0)
    WorkLifeBalance: int = Field(..., ge=1, le=4)
    YearsAtCompany: int = Field(..., ge=0)
    YearsInCurrentRole: int = Field(..., ge=0)
    YearsSinceLastPromotion: int = Field(..., ge=0)
    YearsWithCurrManager: int = Field(..., ge=0)
    BusinessTravel: BusinessTravel
    Department: Department
    EducationField: EducationField
    Gender: Gender
    JobRole: JobRole
    MaritalStatus: MaritalStatus
    OverTime: OverTime


class Factor(BaseModel):
    feature: str
    value: Any
    contribution: float
    direction: Literal["increase", "decrease"]


class Recommendation(BaseModel):
    key: str
    message: str


class PredictionResponse(BaseModel):
    probability: float
    prediction: str
    risk_level: Literal["Low Risk", "Medium Risk", "High Risk"]
    threshold: float
    top_factors: list[Factor]
    feature_contributions: list[Factor]
    recommendations: list[Recommendation]
    shap_base_value: float | None = None

