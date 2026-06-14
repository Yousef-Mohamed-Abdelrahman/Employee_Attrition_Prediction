from app.models.schemas import EmployeeInput, Recommendation


def build_recommendations(
    employee: EmployeeInput,
    income_median: int | float,
) -> list[Recommendation]:
    """
    Generate targeted HR retention recommendations based on the employee's
    profile and the derived risk flags used in feature engineering.
    """
    recs: list[Recommendation] = []

    # ── Overtime burden ─────────────────────────────────────────────────
    if employee.OverTime == "Yes":
        recs.append(Recommendation(
            key="OverTime",
            message=(
                "⏱️  Reduce overtime workload. Consider redistributing tasks or "
                "hiring additional support to prevent burnout."
            ),
        ))

    # ── Long commute ────────────────────────────────────────────────────
    if employee.DistanceFromHome > 10:
        recs.append(Recommendation(
            key="LongDistance",
            message=(
                "🏠  Offer hybrid or remote work options to reduce commute impact. "
                "A flexible schedule can significantly improve work-life balance."
            ),
        ))

    # ── Below-median compensation ────────────────────────────────────────
    if employee.MonthlyIncome < income_median:
        recs.append(Recommendation(
            key="LowIncome",
            message=(
                "💰  Review the compensation package. This employee's income is "
                "below the company median — a salary adjustment or bonus scheme may improve retention."
            ),
        ))

    # ── Stalled career progression ───────────────────────────────────────
    if employee.YearsSinceLastPromotion >= 5:
        recs.append(Recommendation(
            key="PromotionDelay",
            message=(
                "📈  Create an immediate promotion or career growth plan. "
                "Five or more years without advancement is a strong attrition driver."
            ),
        ))

    # ── Low job or environment satisfaction ──────────────────────────────
    if employee.JobSatisfaction <= 2:
        recs.append(Recommendation(
            key="JobSatisfaction",
            message=(
                "😟  Schedule a 1-on-1 to address low job satisfaction. "
                "Explore role adjustments, project variety, or mentoring opportunities."
            ),
        ))

    if employee.EnvironmentSatisfaction <= 2:
        recs.append(Recommendation(
            key="EnvironmentSatisfaction",
            message=(
                "🏢  Investigate workplace environment concerns. "
                "Team dynamics, physical space, or management style may need attention."
            ),
        ))

    # ── Poor work-life balance ───────────────────────────────────────────
    if employee.WorkLifeBalance == 1:
        recs.append(Recommendation(
            key="WorkLifeBalance",
            message=(
                "⚖️  Address work-life imbalance with flexible scheduling, "
                "mandatory time-off policies, or workload review."
            ),
        ))

    # ── Young employee with low satisfaction ─────────────────────────────
    if employee.Age < 30 and employee.JobSatisfaction <= 2:
        recs.append(Recommendation(
            key="YoungAndDissatisfied",
            message=(
                "🎓  Young employees with low satisfaction are high flight risks. "
                "Fast-track development programmes and clear career paths are essential."
            ),
        ))

    # ── Fallback: positive reinforcement ─────────────────────────────────
    if not recs:
        recs.append(Recommendation(
            key="Retention",
            message=(
                "✅  No immediate risk factors detected. "
                "Maintain current engagement, recognition, and career development practices."
            ),
        ))

    return recs
