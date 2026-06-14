// ─── Numeric fields: [fieldName, defaultValue, min, max] ──────────────────
export const numericFields = [
  ["Age",                    35,      16, 80],
  ["DailyRate",              800,      0, 9999],
  ["DistanceFromHome",         8,      0, 100],
  ["Education",               3,      1,    5],
  ["EnvironmentSatisfaction",  3,      1,    4],
  ["HourlyRate",              65,      0, 999],
  ["JobInvolvement",           3,      1,    4],
  ["JobLevel",                 2,      1,    5],
  ["JobSatisfaction",          3,      1,    4],
  ["MonthlyIncome",         5200,      0, 99999],
  ["MonthlyRate",          15000,      0, 99999],
  ["NumCompaniesWorked",       2,      0, 20],
  ["PercentSalaryHike",       14,      0, 100],
  ["PerformanceRating",        3,      1,    4],
  ["RelationshipSatisfaction", 3,      1,    4],
  ["StockOptionLevel",         1,      0,    3],
  ["TotalWorkingYears",        8,      0, 50],
  ["TrainingTimesLastYear",    2,      0, 20],
  ["WorkLifeBalance",          3,      1,    4],
  ["YearsAtCompany",           5,      0, 50],
  ["YearsInCurrentRole",       3,      0, 30],
  ["YearsSinceLastPromotion",  1,      0, 20],
  ["YearsWithCurrManager",     3,      0, 30],
];

// ─── Dropdown fields ────────────────────────────────────────────────────────
export const dropdownFields = {
  BusinessTravel:  ["Non-Travel", "Travel_Rarely", "Travel_Frequently"],
  Department:      ["Human Resources", "Research & Development", "Sales"],
  EducationField:  ["Life Sciences", "Marketing", "Medical", "Other", "Technical Degree", "Human Resources"],
  Gender:          ["Male", "Female"],
  JobRole: [
    "Healthcare Representative",
    "Human Resources",
    "Laboratory Technician",
    "Manager",
    "Manufacturing Director",
    "Research Director",
    "Research Scientist",
    "Sales Executive",
    "Sales Representative",
  ],
  MaritalStatus: ["Married", "Single", "Divorced"],
  OverTime:      ["No", "Yes"],
};

// ─── Grouped sections for the form UI ───────────────────────────────────────
export const numericSections = [
  {
    id: "personal",
    title: "Personal Information",
    fields: ["Age", "Gender", "MaritalStatus", "EducationField", "Education"],
  },
  {
    id: "job",
    title: "Job Details",
    fields: [
      "Department", "JobRole", "JobLevel", "JobInvolvement",
      "BusinessTravel", "OverTime",
    ],
  },
  {
    id: "compensation",
    title: "Compensation",
    fields: [
      "MonthlyIncome", "DailyRate", "HourlyRate", "MonthlyRate",
      "PercentSalaryHike", "StockOptionLevel",
    ],
  },
  {
    id: "satisfaction",
    title: "Satisfaction & Balance",
    fields: [
      "JobSatisfaction", "EnvironmentSatisfaction",
      "RelationshipSatisfaction", "WorkLifeBalance", "PerformanceRating",
    ],
  },
  {
    id: "tenure",
    title: "Tenure & History",
    fields: [
      "TotalWorkingYears", "NumCompaniesWorked", "YearsAtCompany",
      "YearsInCurrentRole", "YearsSinceLastPromotion", "YearsWithCurrManager",
      "TrainingTimesLastYear", "DistanceFromHome",
    ],
  },
];

// ─── Default employee ────────────────────────────────────────────────────────
export const defaultEmployee = {
  ...Object.fromEntries(numericFields.map(([name, def]) => [name, def])),
  BusinessTravel: "Travel_Rarely",
  Department:     "Research & Development",
  EducationField: "Life Sciences",
  Gender:         "Male",
  JobRole:        "Research Scientist",
  MaritalStatus:  "Married",
  OverTime:       "No",
};

// ─── Helper: is a field a dropdown? ─────────────────────────────────────────
export const isDropdown = (field) => field in dropdownFields;

// ─── Helper: get meta for a numeric field ───────────────────────────────────
export const numericMeta = Object.fromEntries(
  numericFields.map(([name, def, min, max]) => [name, { def, min, max }])
);
