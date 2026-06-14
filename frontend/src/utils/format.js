// ─── Percentage formatting ───────────────────────────────────────────────────
export function percent(value, decimals = 1) {
  return `${(Number(value || 0) * 100).toFixed(decimals)}%`;
}

// ─── Pretty-print a feature column name ──────────────────────────────────────
export function factorLabel(feature) {
  return feature
    .replace(/^(BusinessTravel|Department|EducationField|Gender|JobRole|MaritalStatus|OverTime)_/, "$1: ")
    .replaceAll("_", " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

// ─── CSS classes by risk level ────────────────────────────────────────────────
export function riskColor(riskLevel) {
  if (riskLevel === "High Risk")   return "text-red-500 dark:text-red-400";
  if (riskLevel === "Medium Risk") return "text-amber-500 dark:text-amber-400";
  return "text-emerald-500 dark:text-emerald-400";
}

export function riskBg(riskLevel) {
  if (riskLevel === "High Risk")   return "bg-red-500/10 border-red-400/30 text-red-600 dark:text-red-400";
  if (riskLevel === "Medium Risk") return "bg-amber-500/10 border-amber-400/30 text-amber-600 dark:text-amber-400";
  return "bg-emerald-500/10 border-emerald-400/30 text-emerald-600 dark:text-emerald-400";
}

export function riskHex(riskLevel) {
  if (riskLevel === "High Risk")   return "#ef4444";
  if (riskLevel === "Medium Risk") return "#f59e0b";
  return "#10b981";
}

// ─── Format raw contribution for display ─────────────────────────────────────
export function fmt(value, decimals = 4) {
  const n = Number(value);
  return isNaN(n) ? "—" : n.toFixed(decimals);
}
