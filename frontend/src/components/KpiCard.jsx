import { TrendingDown, TrendingUp } from "lucide-react";

const tones = {
  violet:  { icon: "bg-violet-500/15 text-violet-600 dark:text-violet-400",  border: "border-violet-200/60 dark:border-violet-800/40"  },
  red:     { icon: "bg-red-500/15 text-red-600 dark:text-red-400",            border: "border-red-200/60 dark:border-red-800/40"          },
  amber:   { icon: "bg-amber-500/15 text-amber-600 dark:text-amber-400",      border: "border-amber-200/60 dark:border-amber-800/40"      },
  emerald: { icon: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",border: "border-emerald-200/60 dark:border-emerald-800/40" },
};

/**
 * @param {{ title: string, value: number|string, icon: React.FC,
 *           tone?: "violet"|"red"|"amber"|"emerald",
 *           trend?: number, suffix?: string }} props
 */
export default function KpiCard({ title, value, icon: Icon, tone = "violet", trend, suffix = "" }) {
  const style = tones[tone] || tones.violet;

  return (
    <section className={`glass-card p-5 animate-fade-up border ${style.border} hover:scale-[1.02] transition-transform duration-200 cursor-default`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label truncate">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums">
            {value}
            {suffix && <span className="ml-1 text-base font-medium text-slate-400">{suffix}</span>}
          </p>
          {typeof trend === "number" && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trend >= 0 ? "text-red-500" : "text-emerald-500"}`}>
              {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {Math.abs(trend)}% vs last period
            </div>
          )}
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}>
          <Icon size={21} />
        </div>
      </div>
    </section>
  );
}
