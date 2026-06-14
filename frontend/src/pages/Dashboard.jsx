import {
  Bar, BarChart, CartesianGrid, Cell, Legend,
  Pie, PieChart, ResponsiveContainer, Tooltip,
  XAxis, YAxis,
} from "recharts";
import {
  Activity, AlertTriangle, CheckCircle2, Gauge,
  PlusCircle, RefreshCw, Sparkles,
} from "lucide-react";
import KpiCard  from "../components/KpiCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import { clearHistory } from "../utils/history.js";
import { percent } from "../utils/format.js";

/* ─── Palette ─────────────────────────────────────────────────────────────── */
const RISK_COLORS = {
  "High Risk":   "#ef4444",
  "Medium Risk": "#f59e0b",
  "Low Risk":    "#10b981",
};

/* ─── Custom tooltip ─────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900/95">
      <p className="mb-1 text-xs font-semibold text-slate-500">{label || payload[0]?.name}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-bold" style={{ color: p.fill || p.color }}>
          {p.value} employee{p.value !== 1 ? "s" : ""}
        </p>
      ))}
    </div>
  );
}

/* ─── Recent history list ─────────────────────────────────────────────────── */
function HistoryRow({ item, index }) {
  const riskColors = {
    "High Risk":   "risk-high",
    "Medium Risk": "risk-medium",
    "Low Risk":    "risk-low",
  };
  return (
    <div
      className="flex items-center justify-between rounded-xl border border-slate-100/80 bg-white/60 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-800/40 animate-fade-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800">
          #{index + 1}
        </div>
        <div>
          <p className="text-sm font-medium">{item.prediction}</p>
          <p className="text-xs text-slate-400">{percent(item.probability)} probability</p>
        </div>
      </div>
      <span className={riskColors[item.risk_level] || "risk-low"}>
        {item.risk_level}
      </span>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────────────────── */
export default function Dashboard({ history, onStartPrediction, onClearHistory }) {
  const counts = history.reduce(
    (acc, item) => {
      acc[item.risk_level] = (acc[item.risk_level] || 0) + 1;
      return acc;
    },
    { "High Risk": 0, "Medium Risk": 0, "Low Risk": 0 }
  );

  const distribution = ["Low Risk", "Medium Risk", "High Risk"].map((name) => ({
    name,
    value: counts[name],
  }));

  const hasData     = history.length > 0;
  const highPct     = hasData ? Math.round((counts["High Risk"]   / history.length) * 100) : 0;
  const avgProb     = hasData
    ? (history.reduce((s, i) => s + i.probability, 0) / history.length * 100).toFixed(1)
    : "—";

  function handleClear() {
    clearHistory();
    onClearHistory();
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label">HR Analytics</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor attrition risk across your workforce in real-time.
          </p>
        </div>
        <div className="flex gap-2">
          {hasData && (
            <button id="clear-history" onClick={handleClear} className="btn-ghost text-xs">
              <RefreshCw size={14} />
              Clear History
            </button>
          )}
          <button id="new-prediction-btn" onClick={onStartPrediction} className="btn-primary">
            <PlusCircle size={16} />
            New Prediction
          </button>
        </div>
      </div>

      {/* ── KPI cards ────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 stagger">
        <KpiCard title="Total Predictions"   value={history.length}        icon={Activity}       tone="violet" />
        <KpiCard title="High Risk"           value={counts["High Risk"]}   icon={AlertTriangle}  tone="red" />
        <KpiCard title="Medium Risk"         value={counts["Medium Risk"]} icon={Gauge}          tone="amber" />
        <KpiCard title="Low Risk"            value={counts["Low Risk"]}    icon={CheckCircle2}   tone="emerald" />
      </div>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      {hasData && (
        <div className="glass-card flex flex-wrap items-center gap-6 px-6 py-4 animate-fade-up">
          <div>
            <p className="label">Avg Probability</p>
            <p className="mt-1 text-xl font-bold">{avgProb}%</p>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <p className="label">High Risk Rate</p>
            <p className="mt-1 text-xl font-bold">{highPct}%</p>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <p className="label">Safe Employees</p>
            <p className="mt-1 text-xl font-bold">{counts["Low Risk"] + counts["Medium Risk"]}</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs font-medium text-violet-600 dark:text-violet-400">
            <Sparkles size={14} />
            Live analytics
          </div>
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────────── */}
      {!hasData && (
        <div className="glass-card flex flex-col items-center justify-center gap-4 py-16 text-center animate-scale-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
            <Activity size={30} className="text-violet-500" />
          </div>
          <div>
            <p className="text-base font-semibold">No predictions yet</p>
            <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Submit employee profiles to populate your analytics dashboard.
            </p>
          </div>
          <button onClick={onStartPrediction} className="btn-primary mt-2">
            <PlusCircle size={16} />
            Run First Prediction
          </button>
        </div>
      )}

      {/* ── Charts ───────────────────────────────────────────────────── */}
      {hasData && (
        <div className="grid gap-5 xl:grid-cols-2">
          {/* Pie */}
          <ChartCard
            title="Attrition Distribution"
            subtitle="Breakdown of total predictions by risk tier"
          >
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {distribution.map((entry) => (
                      <Cell key={entry.name} fill={RISK_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={9}
                    formatter={(val) => (
                      <span className="text-xs text-slate-600 dark:text-slate-300">{val}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Bar */}
          <ChartCard
            title="Risk Distribution"
            subtitle="Count of employees at each risk level"
          >
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={distribution}
                  margin={{ left: 0, right: 20, top: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={72}>
                    {distribution.map((entry) => (
                      <Cell key={entry.name} fill={RISK_COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {/* ── Recent predictions ──────────────────────────────────────── */}
      {hasData && (
        <div className="glass-card p-5">
          <h3 className="section-title mb-4">Recent Predictions</h3>
          <div className="space-y-2">
            {history.slice(0, 8).map((item, i) => (
              <HistoryRow key={i} item={item} index={i} />
            ))}
            {history.length > 8 && (
              <p className="pt-2 text-center text-xs text-slate-400">
                + {history.length - 8} more predictions in history
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
