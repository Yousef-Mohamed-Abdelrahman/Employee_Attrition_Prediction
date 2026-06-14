# 🧠 Employee Attrition Prediction System

**Author:** Yousef Mohamed

> A production-ready, full-stack HR Analytics platform that predicts employee attrition risk, explains model decisions using SHAP, and generates personalised HR retention recommendations.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Screen Shots](#-Screen-Shots)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Research & Data Pipeline](#-research--data-pipeline)
6. [Datasets](#-datasets)
7. [Model Artifacts](#-model-artifacts)
8. [Backend — FastAPI](#-backend--fastapi)
9. [Frontend — React + Vite](#-frontend--react--vite)
10. [Feature Engineering](#-feature-engineering)
11. [Encoding Pipeline](#-encoding-pipeline)
12. [SHAP Explainability](#-shap-explainability)
13. [Recommendations Engine](#-recommendations-engine)
14. [API Reference](#-api-reference)
15. [Running the Project](#-running-the-project)
16. [Environment Variables](#-environment-variables)
17. [Application Pages](#-application-pages)

---

## 🔍 Project Overview

This system takes an employee's profile as input and produces:

| Output | Description |
|--------|-------------|
| **Risk Level** | `Low Risk` · `Medium Risk` · `High Risk` |
| **Probability** | Attrition probability score (0 – 100%) |
| **Prediction** | `Attrition Likely` / `Attrition Unlikely` |
| **Top SHAP Factors** | Top 5 features pushing the score up |
| **SHAP Waterfall** | Visual chart of all feature contributions |
| **Feature Table** | Full contribution table with direction |
| **Recommendations** | Actionable HR interventions |

The model was trained on IBM's HR Employee Attrition dataset using **XGBoost** with class imbalance handling. The deployment threshold was tuned for maximum recall of true attritions.

---

## Screen Shots

![My ScreenShot](ScreenShots/screen_1.png)
![My ScreenShot](ScreenShots/screen_2.png)
![My ScreenShot](ScreenShots/screen_3.png)
![My ScreenShot](ScreenShots/screen_4.png)
![My ScreenShot](ScreenShots/screen_5.png)
![My ScreenShot](ScreenShots/screen_6.png)
![My ScreenShot](ScreenShots/screen_7.png)

---

## 🛠️ Tech Stack

### Machine Learning
| Tool | Purpose |
|------|---------|
| Python 3.11+ | Core language |
| Pandas / NumPy | Data manipulation |
| XGBoost | Gradient boosted classifier |
| Scikit-learn | Preprocessing, metrics |
| SHAP | Shapley value explanations |
| Joblib | Model serialisation |

### Backend
| Tool | Purpose |
|------|---------|
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| Pydantic v2 | Request/response validation |
| Pydantic-Settings | Environment config management |

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 6 | Build tool & dev server |
| Tailwind CSS v3 | Utility-first CSS |
| Recharts | Data visualisations |
| Lucide React | Icon library |
| Axios | HTTP client |

---

## 📁 Project Structure

```
Hr/
│
├── 📓 Analysis 1 (EDA).ipynb              # Exploratory data analysis
├── 📓 Analysis 2 (Feature Engineering).ipynb  # Feature creation & encoding
├── 📓 Model.ipynb                         # XGBoost training & evaluation
│
├── 📂 Datasets/
│   ├── WA_Fn-UseC_-HR-Employee-Attrition.csv  # IBM raw dataset
│   ├── processed_hr_data.csv                   # Post-EDA cleaned data
│   └── processed_hr_data_model.csv             # Final encoded model input
│
├── 📂 models/                             # Serialised model artefacts
│   ├── xgb_model.pkl                      # Trained XGBClassifier
│   ├── model_columns.pkl                  # Exact column order used in training
│   ├── income_median.pkl                  # Training set MonthlyIncome median
│   └── threshold.pkl                      # Decision threshold (tuned for recall)
│
├── 📂 backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py                        # FastAPI app factory
│       ├── api/
│       │   └── routes.py                  # /health and /predict endpoints
│       ├── core/
│       │   └── config.py                  # Pydantic settings
│       ├── models/
│       │   └── schemas.py                 # Pydantic I/O schemas
│       ├── services/
│       │   ├── model_loader.py            # Loads & caches all pkl artefacts
│       │   ├── predictor.py               # Full prediction pipeline
│       │   ├── explainer.py               # SHAP TreeExplainer wrapper
│       │   └── recommendations.py         # HR recommendation engine
│       └── utils/
│           └── feature_engineering.py     # Derived features + encoding
│
├── 📂 ScreenShots/
│   ├── screen_1.png
│   ├── screen_2.png
│   ├── screen_3.png
│   ├── screen_4.png
│   ├── screen_5.png
│   ├── screen_6.png
│   └── screen_7.png
│
│
├── 📂 frontend/
│   ├── index.html                         # HTML shell + SEO meta
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx                       # React entry point
│       ├── App.jsx                        # Root layout + navigation
│       ├── styles.css                     # Global CSS + animations
│       ├── api/
│       │   └── client.js                  # Axios instance + predictAttrition()
│       ├── context/
│       │   └── ThemeContext.jsx           # Dark/Light mode context
│       ├── data/
│       │   └── formConfig.js              # Form fields, defaults, sections
│       ├── utils/
│       │   ├── format.js                  # percent(), riskColor(), factorLabel()
│       │   └── history.js                 # localStorage prediction history
│       ├── components/
│       │   ├── KpiCard.jsx                # Stat card with icon & tone
│       │   ├── ChartCard.jsx              # Generic chart wrapper
│       │   └── PredictionResult.jsx       # Full result display (gauge, SHAP, recs)
│       └── pages/
│           ├── Dashboard.jsx              # HR analytics dashboard
│           └── PredictionPage.jsx         # Employee form + result layout
│
└── 📂 .venv/                              # Python virtual environment
```

---

## 🔬 Research & Data Pipeline

The project follows a classic ML lifecycle spread across three Jupyter notebooks:

### Notebook 1 — EDA (`Analysis 1 (EDA).ipynb`)
- Loaded the raw IBM HR dataset (1,470 rows × 35 columns)
- Analysed distributions, class imbalance (~16% attrition)
- Identified outliers and zero-variance columns (`EmployeeCount`, `StandardHours`, `Over18`)
- Dropped leakage and ID columns
- Saved cleaned output → `processed_hr_data.csv`

### Notebook 2 — Feature Engineering (`Analysis 2 (Feature Engineering).ipynb`)
- Created 5 domain-driven derived features (see [Feature Engineering](#-feature-engineering))
- Applied `pd.get_dummies()` one-hot encoding with `drop_first=True`
- Computed and saved the MonthlyIncome training median
- Saved the final column order → `model_columns.pkl`
- Saved the final dataset → `processed_hr_data_model.csv`

### Notebook 3 — Model (`Model.ipynb`)
- Benchmarked multiple classifiers (Logistic Regression, Random Forest, XGBoost)
- Selected XGBoost for its best F1 / AUC on attrition class
- Tuned decision threshold using precision-recall curve (set to `0.1` for high recall)
- Serialised model → `xgb_model.pkl`
- Serialised threshold → `threshold.pkl`

---

## 📊 Datasets

| File | Size | Description |
|------|------|-------------|
| `WA_Fn-UseC_-HR-Employee-Attrition.csv` | 228 KB | Original IBM Watson Analytics dataset. 1,470 employees × 35 features. |
| `processed_hr_data.csv` | 226 KB | Cleaned data after EDA — nulls removed, zero-variance columns dropped. |
| `processed_hr_data_model.csv` | 169 KB | Final training-ready data — engineered features + one-hot encoded. |

---

## 🗃️ Model Artifacts

All artifacts are stored in `/models/` and loaded at server startup.

| File | Size | Description |
|------|------|-------------|
| `xgb_model.pkl` | 431 KB | Trained `XGBClassifier` with tuned hyperparameters. |
| `model_columns.pkl` | 1 KB | Python list of the 49 column names in training order. Required for exact reindexing. |
| `income_median.pkl` | 15 B | Scalar float — the median `MonthlyIncome` from the training set (~$4,919). Used in `LowIncome` feature. |
| `threshold.pkl` | 21 B | Scalar float (`0.1`) — the tuned decision boundary for `Attrition Likely`. |

---

## ⚙️ Backend — FastAPI

### Architecture

```
Request → Route → Predictor → Feature Engineering → Encoder → XGBoost
                                                              ↓
Response ← Schema ← Predictor ← SHAP Explainer + Recommendations
```

### Key Files

#### `app/core/config.py`
Uses `pydantic-settings` to manage paths and CORS origins. All paths resolve relative to the project root, so the server can be started from any working directory.

```python
class Settings(BaseSettings):
    model_path:         Path  # → models/xgb_model.pkl
    model_columns_path: Path  # → models/model_columns.pkl
    income_median_path: Path  # → models/income_median.pkl
    threshold_path:     Path  # → models/threshold.pkl
    cors_origins:       list[str]  # Defaults to localhost:5173
```

#### `app/models/schemas.py`
Full Pydantic v2 schema for the prediction request and response.

**Input** (`EmployeeInput`): 23 validated numeric fields + 7 validated literal dropdowns.

**Output** (`PredictionResponse`):
```json
{
  "probability": 0.859,
  "prediction": "Attrition Likely",
  "risk_level": "High Risk",
  "threshold": 0.1,
  "top_factors": [...],
  "feature_contributions": [...],
  "recommendations": [...],
  "shap_base_value": -1.43
}
```

#### `app/services/model_loader.py`
All four artifacts are loaded once and held in an `@lru_cache`-decorated `ModelArtifacts` dataclass. Subsequent requests hit zero I/O.

---

## 🧪 Feature Engineering

Five derived binary features are created on every inference request to mirror the training pipeline exactly:

| Feature | Logic | Rationale |
|---------|-------|-----------|
| `IsYoungEmployee` | `Age < 30` | Young employees have higher mobility |
| `LowIncome` | `MonthlyIncome < training_median` | Below-median pay raises quit risk |
| `LongDistance` | `DistanceFromHome > 10` | Long commutes reduce satisfaction |
| `PromotionDelay` | `YearsSinceLastPromotion >= 5` | Stalled careers drive attrition |
| `HighRiskOvertime` | `OverTime == "Yes" AND JobRole in {Sales Rep, Lab Tech, HR}` | Overtime in high-pressure roles is most damaging |

> ⚠️ **Critical**: These features must be created **before** one-hot encoding, in exactly the same way they were during training, or the model will receive unexpected input.

---

## 🔢 Encoding Pipeline

```python
# 1. Create derived features
df = engineer_features(raw_payload, income_median)

# 2. One-hot encode categorical columns with drop_first=True
encoded = pd.get_dummies(df, columns=CATEGORICAL_FIELDS, drop_first=True, dtype=int)

# 3. Reindex to exact training column order — fill unseen columns with 0
final = encoded.reindex(columns=model_columns, fill_value=0)
```

The 7 categorical fields encoded are:
`BusinessTravel`, `Department`, `EducationField`, `Gender`, `JobRole`, `MaritalStatus`, `OverTime`

This produces exactly **49 columns** matching the training matrix.

---

## 📐 SHAP Explainability

A `shap.TreeExplainer` is built from the loaded XGBClassifier and cached with `@lru_cache`.

For each prediction:
1. SHAP values are computed for the single-row input DataFrame
2. Multi-output shape `(n_classes, n_samples, n_features)` is handled by selecting the positive class (`[:, :, 1]`)
3. Features are sorted by `|contribution|` descending
4. Only non-zero contributions are returned

**Response fields:**
- `top_factors` — top 5 factors with `contribution > 0` (risk-increasing only)
- `feature_contributions` — top 20 factors by absolute SHAP value (both directions)
- `shap_base_value` — model's expected log-odds (baseline before any features)

---

## 💡 Recommendations Engine

Eight distinct rule-based scenarios generate targeted HR actions:

| Trigger | Condition | Recommendation |
|---------|-----------|----------------|
| Overtime | `OverTime == "Yes"` | Reduce workload or add support |
| Long Distance | `DistanceFromHome > 10` | Offer hybrid / remote work |
| Low Income | `MonthlyIncome < median` | Review compensation package |
| Promotion Delay | `YearsSinceLastPromotion >= 5` | Create growth plan immediately |
| Job Dissatisfaction | `JobSatisfaction <= 2` | Schedule 1-on-1 check-in |
| Env. Dissatisfaction | `EnvironmentSatisfaction <= 2` | Investigate workplace environment |
| Poor Work-Life Balance | `WorkLifeBalance == 1` | Enforce time-off / flexible scheduling |
| Young + Dissatisfied | `Age < 30 AND JobSatisfaction <= 2` | Fast-track development programme |
| No triggers | — | Maintain current engagement practices |

---

## 📡 API Reference

Base URL: `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

### `GET /health`

Returns service status and loaded model metadata.

**Response:**
```json
{
  "status": "ok",
  "model": "XGBClassifier",
  "feature_count": 49,
  "threshold": 0.1,
  "income_median": 4919
}
```

---

### `POST /predict`

Accepts a full employee profile and returns a complete attrition analysis.

**Request Body** (all fields required):

```json
{
  "Age": 26,
  "DailyRate": 500,
  "DistanceFromHome": 25,
  "Education": 3,
  "EnvironmentSatisfaction": 2,
  "HourlyRate": 40,
  "JobInvolvement": 2,
  "JobLevel": 1,
  "JobSatisfaction": 2,
  "MonthlyIncome": 3500,
  "MonthlyRate": 10000,
  "NumCompaniesWorked": 4,
  "PercentSalaryHike": 11,
  "PerformanceRating": 3,
  "RelationshipSatisfaction": 2,
  "StockOptionLevel": 0,
  "TotalWorkingYears": 3,
  "TrainingTimesLastYear": 1,
  "WorkLifeBalance": 1,
  "YearsAtCompany": 2,
  "YearsInCurrentRole": 1,
  "YearsSinceLastPromotion": 1,
  "YearsWithCurrManager": 1,
  "BusinessTravel": "Travel_Frequently",
  "Department": "Sales",
  "EducationField": "Life Sciences",
  "Gender": "Male",
  "JobRole": "Sales Representative",
  "MaritalStatus": "Single",
  "OverTime": "Yes"
}
```

**Response:**
```json
{
  "probability": 0.859,
  "prediction": "Attrition Likely",
  "risk_level": "High Risk",
  "threshold": 0.1,
  "top_factors": [
    { "feature": "WorkLifeBalance", "value": 1, "contribution": 0.482, "direction": "increase" },
    { "feature": "HighRiskOvertime", "value": 1, "contribution": 0.371, "direction": "increase" }
  ],
  "feature_contributions": [ "... up to 20 factors ..." ],
  "recommendations": [
    { "key": "OverTime",     "message": "⏱️ Reduce overtime workload ..." },
    { "key": "LongDistance", "message": "🏠 Offer hybrid / remote work ..." }
  ],
  "shap_base_value": -1.4303802251815796
}
```

**Dropdown field allowed values:**

| Field | Allowed Values |
|-------|---------------|
| `BusinessTravel` | `Non-Travel`, `Travel_Rarely`, `Travel_Frequently` |
| `Department` | `Human Resources`, `Research & Development`, `Sales` |
| `EducationField` | `Life Sciences`, `Marketing`, `Medical`, `Other`, `Technical Degree`, `Human Resources` |
| `Gender` | `Male`, `Female` |
| `JobRole` | `Healthcare Representative`, `Human Resources`, `Laboratory Technician`, `Manager`, `Manufacturing Director`, `Research Director`, `Research Scientist`, `Sales Executive`, `Sales Representative` |
| `MaritalStatus` | `Married`, `Single`, `Divorced` |
| `OverTime` | `Yes`, `No` |

---

## 🚀 Running the Project

### Prerequisites

- Python 3.11+
- Node.js 18+
- The `.venv` virtual environment already set up at `d:\Projects\Ai\Hr\.venv`

---

### 1. Start the Backend

```powershell
# From the project root
cd d:\Projects\Ai\Hr\backend

# Option A — using the project venv directly
d:\Projects\Ai\Hr\.venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000 --reload

# Option B — activate venv first
d:\Projects\Ai\Hr\.venv\Scripts\Activate.ps1
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- **API**: `http://localhost:8000`
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

### 2. Start the Frontend

```powershell
cd d:\Projects\Ai\Hr\frontend
npm install        # first time only
npm run dev
```

The app will be available at: **`http://localhost:5173`**

---

### 3. Install Backend Dependencies (if needed)

```powershell
cd d:\Projects\Ai\Hr\backend
d:\Projects\Ai\Hr\.venv\Scripts\pip.exe install -r requirements.txt
```

---

### Quick Health Check

```powershell
Invoke-RestMethod -Uri http://localhost:8000/health | ConvertTo-Json
```

---

## 🌐 Environment Variables

The backend reads optional environment variables prefixed with `ATTRITION_`:

| Variable | Default | Description |
|----------|---------|-------------|
| `ATTRITION_MODEL_PATH` | `<root>/models/xgb_model.pkl` | Path to XGBoost model |
| `ATTRITION_MODEL_COLUMNS_PATH` | `<root>/models/model_columns.pkl` | Path to column list |
| `ATTRITION_INCOME_MEDIAN_PATH` | `<root>/models/income_median.pkl` | Path to income median |
| `ATTRITION_THRESHOLD_PATH` | `<root>/models/threshold.pkl` | Path to decision threshold |
| `ATTRITION_CORS_ORIGINS` | `["http://localhost:5173"]` | Allowed CORS origins |

Create a `.env` file in `backend/` to override any of these.

The frontend reads:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend base URL |

Create a `.env` file in `frontend/` to override.

---

## 📱 Application Pages

### Dashboard (`/`)

The HR analytics home page. Displays:

- **4 KPI cards** — Total Predictions, High Risk, Medium Risk, Low Risk counts
- **Stats strip** — Average probability, High Risk rate, Safe employees
- **Attrition Distribution Pie Chart** — Visual breakdown by risk tier
- **Risk Distribution Bar Chart** — Count per tier
- **Recent Predictions List** — Last 8 predictions with risk badges
- **Empty state** — Prompt to run first prediction if no history

All data is sourced from `localStorage` and updates instantly after each prediction.

---

### Prediction Page (`/predict`)

Professional employee profile form with **5 grouped sections**:

| Section | Fields |
|---------|--------|
| **Personal Information** | Age, Gender, Marital Status, Education Field, Education level |
| **Job Details** | Department, Job Role, Job Level, Job Involvement, Business Travel, Overtime |
| **Compensation** | Monthly Income, Daily Rate, Hourly Rate, Monthly Rate, Salary Hike %, Stock Options |
| **Satisfaction & Balance** | Job Satisfaction, Environment Satisfaction, Relationship Satisfaction, Work-Life Balance, Performance Rating |
| **Tenure & History** | Total Working Years, Companies Worked, Years at Company, Years in Role, Years since Promotion, Years with Manager, Training Times, Distance from Home |

After submission, the **Prediction Result panel** appears alongside showing:

1. **SVG Radial Gauge** — Animated probability arc coloured by risk level
2. **Animated Probability Bar** — Fill animates from 0 to final value
3. **Risk description** — Contextual message per risk tier
4. **Top Risk Factors** — Cards for each SHAP factor pushing risk up
5. **SHAP Waterfall Chart** — Horizontal bar chart (red = risk-increasing, green = risk-decreasing)
6. **HR Recommendations** — Each action with emoji and detailed description
7. **Feature Contribution Table** — All 20 features with value, SHAP score, and direction arrow

---

### Theme System

- Defaults to **Dark Mode** on first visit
- Toggle via the 🌙/☀️ button in the header
- Preference persisted in `localStorage` under key `attrition_theme`
- Smooth 200ms CSS transition on all colour properties
- Background uses radial gradient:
  - **Light**: soft violet-to-white
  - **Dark**: deep indigo-to-black

---

## 📦 `requirements.txt`

```
fastapi==0.115.6
uvicorn[standard]==0.34.0
pydantic==2.10.4
pydantic-settings==2.7.1
pandas==2.2.3
numpy==1.26.4
scikit-learn==1.5.2
xgboost==2.1.3
shap==0.46.0
joblib==1.4.2
```

---

## 📦 `package.json` (Frontend)

```json
{
  "dependencies": {
    "axios": "^1.7.9",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^2.15.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "vite": "^6.0.5"
  }
}
```

---

## 🔒 Notes & Caveats

- **Prediction history** is stored in the browser's `localStorage` only — it does not persist across devices or browsers.
- The **SHAP explainer** is built once and cached in memory. On a cold start it may take 1–2 seconds to initialise; subsequent requests are near-instant.
- The model was trained on the IBM HR dataset (~1,470 rows). Predictions should be treated as **decision-support signals** rather than definitive outcomes.
- The decision **threshold is 0.1** (very low), meaning the model errs on the side of flagging potential attrition risk. This maximises recall at the cost of some false positives — intentional for an HR use case where missing a flight risk is more costly than a false alarm.

---

*Built with FastAPI · XGBoost · SHAP · React · Tailwind CSS · Recharts*


## Author

This project was designed, developed, and documented by **Yousef Mohamed**.



<h1 align="left">Hi 👋! My name is Yousef Mohamed</h1>

###

<h2 align="left">🚀 About Me</h2>

###

<p align="left">I'm a Machine Learning Engineer</p>

###

<h3 align="left">🔗 Links</h3>

###

<div align="left">
  <a href="www.linkedin.com/in/yousef-mohamed-5ba742322" target="_blank">
    <img src="https://raw.githubusercontent.com/maurodesouza/profile-readme-generator/master/src/assets/icons/social/linkedin/default.svg" width="52" height="40" alt="linkedin logo"  />
  </a>
</div>

###

<h3 align="left">🛠 Skills</h3>

###

<p align="left">- Python  <br>- Statistics <br>- SQL <br>- Machine Learning <br>- Deep Learning<br>- Artificial Intelligence<br>- Data Science</p>

###

<h3 align="left">Summary Of My Journey</h3>

###

<p align="left">✨ Creating bugs since my first Python script<br>📚 I'm currently learning advanced Machine Learning, Deep Learning, NLP, and Computer Vision while building full-stack AI applications<br>🎯 Goals: Become an AI engineer specializing in intelligent systems, recommendation engines, and real-world deep learning solutions<br>🎲 Fun fact: I’m a huge football and Formula 1 fan — I support Al Ahly SC and my favorite F1 driver is Lewis Hamilton 🏎️🔥</p>

###

<h2 align="left">My tech Stack</h2>

###

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" height="40" alt="python logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" height="40" alt="pandas logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" height="40" alt="numpy logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" height="40" alt="tensorflow logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" height="40" alt="mysql logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" height="40" alt="vscode logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original-wordmark.svg" height="40" alt="jupyter logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" height="40" alt="pytorch logo"  />
</div>

###
