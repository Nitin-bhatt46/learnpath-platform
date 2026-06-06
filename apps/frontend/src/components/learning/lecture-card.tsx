import type { LectureOverview } from "@/lib/content";
import { ButtonLink } from "@/components/ui/button";
import { ClockIcon } from "@/components/ui/icons";

export function LectureCard({ lecture }: { lecture: LectureOverview }) {
  return (
    <article className="rounded-xl border border-border-color bg-card-bg p-5 hover-lift shadow-3xs">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="rounded bg-accent px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-accent-text border border-primary/10">
            {lecture.difficulty}
          </span>
          <h2 className="mt-2 text-lg font-display font-bold text-text-main leading-snug">{lecture.title}</h2>
        </div>
        <span className="rounded-full bg-bg-primary border border-border-color px-2.5 py-0.5 text-[10px] font-bold text-text-muted">
          {lecture.conceptCount} Units
        </span>
      </div>
      <p className="mt-3 min-h-12 text-xs leading-5 text-text-muted">{lecture.description}</p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border-color/40 pt-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>{lecture.estimatedMinutes} min</span>
        </div>
        <ButtonLink href={`/lecture/${lecture.id}`} size="sm">
          Start
        </ButtonLink>
      </div>
    </article>
  );
}

