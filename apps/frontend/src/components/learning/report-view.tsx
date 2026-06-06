"use client";

import Link from "next/link";
import type { Concept, Lecture, Summary } from "@/lib/content";
import { buildReport } from "@/lib/reporting";
import { useProgress } from "@/lib/progress";
import { Button, ButtonLink } from "@/components/ui/button";
import { ChevronRightIcon, RouteIcon, CheckCircleIcon, SparklesIcon } from "@/components/ui/icons";

export function ReportView({ lecture, concepts, summary }: { lecture: Lecture; concepts: Concept[]; summary: Summary }) {
  const { getLectureProgress, resetLecture } = useProgress();
  const progress = getLectureProgress(lecture.id);
  const report = buildReport(concepts, progress);

  return (
    <main className="min-h-screen bg-bg-primary px-4 py-6 text-text-main sm:px-6 sm:py-10 transition-colors duration-200">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/" className="inline-flex min-h-10 items-center text-xs font-bold text-text-muted hover:text-primary transition-colors">
          &larr; Back to Career Paths
        </Link>

        <section className="rounded-xl border border-border-color bg-card-bg p-6 shadow-3xs">
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-text border border-primary/10 flex items-center gap-1">
              <CheckCircleIcon className="h-3 w-3" />
              <span>Completion Report</span>
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-display font-bold text-text-main">{lecture.title}</h1>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Metric label="Total Score" value={`${report.totalScore} / ${report.totalQuestions}`} />
            <Metric label="Accuracy" value={`${report.percentage}%`} />
            <Metric label="Completed Units" value={`${progress.completedConcepts.length} / ${concepts.length}`} />
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <InsightList title="Core Strengths" empty="No strong concepts registered yet. Practice makes perfect." items={report.strongConcepts.map((item) => item.title)} type="strengths" />
          <InsightList title="Revision Targets" empty="No direct weaknesses. Maintain this steady pace!" items={report.weakConcepts.map((item) => item.title)} type="weaknesses" />
        </div>

        <section className="rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">Concept Score Breakdown</h2>
          <div className="mt-4 divide-y divide-border-color/40">
            {report.conceptScores.map((concept) => (
              <div key={concept.id} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center first:pt-0 last:pb-0">
                <span className="text-sm font-medium text-text-main">{concept.title}</span>
                <span className="text-xs font-bold text-text-muted">
                  {concept.score}/{concept.total} correct · <span className="text-primary">{concept.percentage}%</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">Quick Revision Guide</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {summary.quickRevision.map((item) => (
              <article key={item.title} className="rounded-xl border border-border-color/60 bg-bg-primary/50 p-4">
                <p className="text-sm font-bold text-text-main">{item.title}</p>
                <p className="mt-2 text-xs leading-5 text-text-muted">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs">
          <div className="flex items-center gap-1.5 mb-4">
            <RouteIcon className="h-4 w-4 text-text-muted" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">Learning Progression Map</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {summary.flow.map((item, index) => (
              <div key={item} className="flex items-center gap-2">
                <span className="rounded-lg border border-border-color bg-bg-primary px-3 py-1.5 text-xs font-bold text-text-muted">
                  {item}
                </span>
                {index < summary.flow.length - 1 && <ChevronRightIcon className="h-4 w-4 text-text-muted/60" />}
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row pt-4">
          <ButtonLink href={`/lecture/${lecture.id}`} className="w-full sm:w-auto">
            Revision Flow
          </ButtonLink>
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => {
              resetLecture(lecture.id);
              window.location.href = `/lecture/${lecture.id}`;
            }}
          >
            Start Over
          </Button>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg-primary border border-border-color/60 p-4 shadow-3xs">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1.5 text-xl font-display font-bold text-text-main">{value}</p>
    </div>
  );
}

function InsightList({ title, items, empty, type }: { title: string; items: string[]; empty: string; type: "strengths" | "weaknesses" }) {
  return (
    <section className="rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs">
      <div className="flex items-center gap-1.5">
        {type === "strengths" ? (
          <SparklesIcon className="h-4 w-4 text-primary" />
        ) : (
          <RouteIcon className="h-4 w-4 text-red-500/80" />
        )}
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">{title}</h2>
      </div>
      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <p className="text-xs leading-5 text-text-muted">{empty}</p>
        ) : (
          items.map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs font-medium text-text-main">
              <span className={`h-1.5 w-1.5 rounded-full ${type === "strengths" ? "bg-primary" : "bg-red-500/80"}`} />
              <span>{item}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
