import {
  Bar, BarChart, CartesianGrid, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  AlertTriangle, CheckCircle2, ClipboardCheck,
  Lightbulb, ShieldAlert, TrendingDown, TrendingUp,
} from "lucide-react";
import { factorLabel, fmt, percent, riskBg, riskColor, riskHex } from "../utils/format.js";

/* ─── Probability meter ─────────────────────────────────────────────────── */
function ProbabilityMeter({ probability }) {
  const pct  = Math.round(probability * 1000) / 10;
  const hex  = probability >= 0.6 ? "#ef4444" : probability >= 0.3 ? "#f59e0b" : "#10b981";
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Attrition Probability</span>
        <span className="font-bold text-lg tabular-nums" style={{ color: hex }}>{pct}%</span>
      </div>
      {/* Track */}
      <div className="relative h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        {/* Filled bar */}
        <div
          className="animate-slide-bar h-full rounded-full"
          style={{ width: `${Math.min(pct, 100)}%`, background: hex }}
        />
      </div>
      {/* Tick marks */}
      <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
        <span>0%</span>
        <span>30%</span>
        <span>60%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

/* ─── Radial gauge number ───────────────────────────────────────────────── */
function RiskGauge({ probability, riskLevel }) {
  const hex  = riskHex(riskLevel);
  const pct  = Math.round(probability * 1000) / 10;
  const r    = 44;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(pct / 100, 1);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#e2e8f033" strokeWidth="10" />
        <circle
          cx="55" cy="55" r={r} fill="none"
          stroke={hex} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x="55" y="51" textAnchor="middle" fill={hex} fontSize="16" fontWeight="700">{pct}%</text>
        <text x="55" y="66" textAnchor="middle" fill="#94a3b8" fontSize="9">RISK</text>
      </svg>
    </div>
  );
}

/* ─── Contribution chart custom tooltip ─────────────────────────────────── */
function ContribTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 dark:border-slate-700 dark:bg-slate-900/95 p-3 shadow-xl text-sm">
      <p className="font-semibold mb-1">{p.payload.name}</p>
      <p style={{ color: p.fill }}>
        {Number(p.value) >= 0 ? "▲" : "▼"} {fmt(p.value)}
      </p>
    </div>
  );
}

/* ─── Placeholder (no result yet) ──────────────────────────────────────── */
function EmptyResult() {
  return (
    <section className="glass-card flex min-h-[380px] flex-col items-center justify-center gap-4 p-8 text-center animate-scale-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
        <ClipboardCheck size={28} className="text-violet-500" />
      </div>
      <div>
        <h2 className="text-base font-semibold">Prediction Result</h2>
        <p className="mt-1.5 max-w-xs text-sm text-slate-500 dark:text-slate-400">
          Submit an employee profile on the left to see attrition risk, SHAP
          explanations, and personalised HR recommendations.
        </p>
      </div>
    </section>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */
export default function PredictionResult({ result }) {
  if (!result) return <EmptyResult />;

  /* Chart data: top 10 SHAP contributors */
  const chartData = result.feature_contributions.slice(0, 10).map((f) => ({
    name:         factorLabel(f.feature),
    contribution: Number(f.contribution.toFixed(4)),
  }));

  const isHigh   = result.risk_level === "High Risk";
  const isMedium = result.risk_level === "Medium Risk";
  const riskCls  = riskColor(result.risk_level);
  const riskBgCls= riskBg(result.risk_level);
  const hex      = riskHex(result.risk_level);

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Risk summary card ──────────────────────────────────────── */}
      <section className="glass-card overflow-hidden animate-scale-in">
        {/* Coloured top strip */}
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${hex}, ${hex}80)` }}
        />
        <div className="p-5">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {/* Gauge */}
            <RiskGauge probability={result.probability} riskLevel={result.risk_level} />

            {/* Text info */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="label">Attrition Risk Assessment</p>
                <h2 className={`mt-2 text-3xl font-bold tracking-tight ${riskCls}`}>
                  {result.risk_level}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {result.prediction}
                  {" · "}
                  Threshold: {(result.threshold * 100).toFixed(0)}%
                </p>
              </div>
              <ProbabilityMeter probability={result.probability} />
            </div>
          </div>

          {/* Risk level pill description */}
          <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${riskBgCls}`}>
            {isHigh   && "⚠️  This employee shows significantly elevated attrition signals. Immediate HR intervention is recommended."}
            {isMedium && "⚡  Moderate attrition risk detected. Monitor closely and consider proactive engagement strategies."}
            {!isHigh && !isMedium && "✅  Low attrition risk. Continue current engagement and career development practices."}
          </div>
        </div>
      </section>

      {/* ── Top factors ────────────────────────────────────────────── */}
      {result.top_factors.length > 0 && (
        <section className="glass-card p-5 animate-fade-up">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10">
              <TrendingUp size={15} className="text-red-500" />
            </div>
            <h3 className="section-title">Top Risk Factors</h3>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 stagger">
            {result.top_factors.map((factor) => (
              <div
                key={factor.feature}
                className="flex items-start gap-3 rounded-xl border border-red-100/80 bg-red-50/50 p-3.5
                           dark:border-red-900/40 dark:bg-red-950/20"
              >
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-500" />
                <div>
                  <p className="text-sm font-semibold">{factorLabel(factor.feature)} <span className="text-red-500">(+)</span></p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    SHAP: +{fmt(factor.contribution)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SHAP Waterfall plot ─────────────────────────────────────── */}
      <section className="glass-card p-5 animate-fade-up" style={{ animationDelay: "60ms" }}>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
            <ShieldAlert size={15} className="text-violet-500" />
          </div>
          <div>
            <h3 className="section-title">SHAP Waterfall Plot</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Red = increases risk · Green = decreases risk
            </p>
          </div>
        </div>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 8, right: 24, top: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b815" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={148}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ContribTooltip />} />
              <Bar dataKey="contribution" radius={[0, 6, 6, 0]} maxBarSize={22}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.contribution >= 0 ? "#ef4444" : "#10b981"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {result.shap_base_value != null && (
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Base value (expected log-odds): {fmt(result.shap_base_value)}
          </p>
        )}
      </section>

      {/* ── Recommendations ─────────────────────────────────────────── */}
      <section className="glass-card p-5 animate-fade-up" style={{ animationDelay: "120ms" }}>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
            <Lightbulb size={15} className="text-amber-500" />
          </div>
          <h3 className="section-title">HR Recommendations</h3>
        </div>
        <div className="space-y-2.5 stagger">
          {result.recommendations.map((item) => (
            <div
              key={item.key}
              className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white/60 p-3.5
                         dark:border-slate-700/60 dark:bg-slate-800/40"
            >
              {result.risk_level === "Low Risk"
                ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                : <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" />
              }
              <p className="text-sm leading-relaxed">{item.message}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Contribution Table ───────────────────────────────── */}
      <section className="glass-card overflow-hidden p-5 animate-fade-up" style={{ animationDelay: "180ms" }}>
        <h3 className="section-title mb-4">Feature Contribution Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                {["Feature", "Value", "SHAP", "Direction"].map((h) => (
                  <th key={h} className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {result.feature_contributions.map((factor) => (
                <tr key={factor.feature} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 pr-4 font-medium">
                    {factorLabel(factor.feature)}
                  </td>
                  <td className="py-2.5 pr-4 tabular-nums text-slate-500 dark:text-slate-400">
                    {String(factor.value)}
                  </td>
                  <td className="py-2.5 pr-4 tabular-nums font-mono">
                    {fmt(factor.contribution)}
                  </td>
                  <td className="py-2.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      factor.direction === "increase"
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {factor.direction === "increase"
                        ? <TrendingUp  size={12} />
                        : <TrendingDown size={12} />}
                      {factor.direction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-right text-xs text-slate-400">
          Final probability: <strong>{percent(result.probability)}</strong>
        </div>
      </section>
    </div>
  );
}
