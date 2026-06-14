import { useMemo, useState } from "react";
import {
  BarChart3,
  BrainCircuit,
  ClipboardList,
  Moon,
  Sun,
} from "lucide-react";
import Dashboard from "./pages/Dashboard.jsx";
import PredictionPage from "./pages/PredictionPage.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import { loadHistory } from "./utils/history.js";

/* ─── Nav items ─────────────────────────────────────────────────────────── */
const NAV = [
  { id: "dashboard", label: "Dashboard",  icon: BarChart3 },
  { id: "predict",   label: "Prediction", icon: ClipboardList },
];

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [history, setHistory]       = useState(loadHistory);
  const { theme, toggleTheme }      = useTheme();

  return (
    <div className="min-h-screen bg-hero-light dark:bg-hero-dark text-slate-900 dark:text-slate-100">

      {/* ── Sticky header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 backdrop-blur-2xl dark:border-slate-700/50 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
              <BrainCircuit size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none tracking-tight">
                Attrition AI
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                HR Analytics Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop nav */}
            <nav className="hidden rounded-xl border border-slate-200/80 bg-slate-100/80 p-1 dark:border-slate-700/60 dark:bg-slate-800/60 sm:flex">
              {NAV.map(({ id, label, icon: Icon }) => {
                const active = activePage === id;
                return (
                  <button
                    key={id}
                    id={`nav-${id}`}
                    onClick={() => setActivePage(id)}
                    className={[
                      "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
                    ].join(" ")}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                );
              })}
            </nav>

            {/* Theme toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="btn-ghost h-10 w-10 !p-0"
            >
              {theme === "dark"
                ? <Sun  size={17} className="text-amber-400" />
                : <Moon size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile bottom nav strip */}
        <div className="flex border-t border-slate-200/60 dark:border-slate-700/50 sm:hidden">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                className={[
                  "flex flex-1 items-center justify-center gap-2 py-3 text-xs font-medium transition-colors",
                  active
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-slate-400 dark:text-slate-500",
                ].join(" ")}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Page content ──────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activePage === "dashboard" ? (
          <Dashboard
            history={history}
            onStartPrediction={() => setActivePage("predict")}
            onClearHistory={() => setHistory([])}
          />
        ) : (
          <PredictionPage onHistoryChange={setHistory} />
        )}
      </main>
    </div>
  );
}
