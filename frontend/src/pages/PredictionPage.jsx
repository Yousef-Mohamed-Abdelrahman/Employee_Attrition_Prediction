import { useState } from "react";
import { ChevronDown, Loader2, RotateCcw, Send } from "lucide-react";
import PredictionResult from "../components/PredictionResult.jsx";
import { predictAttrition } from "../api/client.js";
import {
  defaultEmployee,
  dropdownFields,
  isDropdown,
  numericMeta,
  numericSections,
} from "../data/formConfig.js";
import { savePrediction } from "../utils/history.js";

/* ─── Section block ─────────────────────────────────────────────────────── */
function FormSection({ id, title, fields, form, update }) {
  return (
    <fieldset id={`section-${id}`} className="rounded-2xl border border-slate-200/60 p-4 dark:border-slate-700/50">
      <legend className="px-2">
        <span className="label">{title}</span>
      </legend>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => {
          const drop = isDropdown(field);
          const meta = numericMeta[field] || {};
          return (
            <label key={field} className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </span>
              {drop ? (
                <div className="relative">
                  <select
                    id={`field-${field}`}
                    className="field appearance-none pr-8"
                    value={form[field]}
                    onChange={(e) => update(field, e.target.value)}
                  >
                    {dropdownFields[field].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              ) : (
                <input
                  id={`field-${field}`}
                  className="field"
                  type="number"
                  min={meta.min ?? 0}
                  max={meta.max}
                  step="1"
                  value={form[field]}
                  onChange={(e) => update(field, e.target.value)}
                  required
                />
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function PredictionPage({ onHistoryChange }) {
  const [form,    setForm]    = useState(defaultEmployee);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field, value) =>
    setForm((cur) => ({ ...cur, [field]: value }));

  const reset = () => {
    setForm(defaultEmployee);
    setResult(null);
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    /* Cast numeric fields */
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) =>
        isDropdown(k) ? [k, v] : [k, Number(v)]
      )
    );

    try {
      const data = await predictAttrition(payload);
      setResult(data);
      onHistoryChange(
        savePrediction({ ...data, created_at: new Date().toISOString() })
      );
      /* Scroll to result on mobile */
      setTimeout(() => {
        document.getElementById("result-panel")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (err) {
      setError(err.message || "Prediction request failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(440px,0.85fr)] animate-fade-in">

      {/* ── Form panel ──────────────────────────────────────────────── */}
      <section className="glass-card p-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="label">Employee Prediction</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">Employee Profile</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Fill in the employee details to predict attrition risk.
            </p>
          </div>
          <button
            id="reset-form-btn"
            type="button"
            onClick={reset}
            className="btn-ghost shrink-0 text-xs"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>

        <form id="prediction-form" onSubmit={submit} className="space-y-4">
          {numericSections.map((section) => (
            <FormSection
              key={section.id}
              {...section}
              form={form}
              update={update}
            />
          ))}

          {/* Error banner */}
          {error && (
            <div
              id="prediction-error"
              className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700
                         dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 animate-fade-up"
            >
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="submit-prediction-btn"
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analysing…
              </>
            ) : (
              <>
                <Send size={18} />
                Predict Attrition Risk
              </>
            )}
          </button>
        </form>
      </section>

      {/* ── Result panel ────────────────────────────────────────────── */}
      <div id="result-panel">
        <PredictionResult result={result} />
      </div>
    </div>
  );
}
