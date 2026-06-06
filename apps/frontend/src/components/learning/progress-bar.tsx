export function ProgressBar({
  value,
  label,
  variant = "primary"
}: {
  value: number;
  label: string;
  variant?: "primary" | "amber";
}) {
  return (
    <div className="space-y-1.5" aria-label={label}>
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-text-muted">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border-color/60">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            variant === "amber" ? "bg-amber-500" : "bg-primary"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

