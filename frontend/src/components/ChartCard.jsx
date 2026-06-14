export default function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <section className={`glass-card flex flex-col p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="section-title">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
}
