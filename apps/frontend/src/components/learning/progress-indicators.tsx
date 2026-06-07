"use client";

import React from "react";

// Helper to generate retro-modern text-based block progress bar
export function getTextProgressBar(progressPct: number, blocksCount = 10): string {
  const filled = Math.min(blocksCount, Math.max(0, Math.round((progressPct / 100) * blocksCount)));
  return "█".repeat(filled) + "░".repeat(blocksCount - filled);
}

export function CourseProgress({
  courseName,
  progressPct,
  className = ""
}: {
  courseName: string;
  progressPct: number;
  className?: string;
}) {
  const roundedPct = Math.round(progressPct);
  return (
    <div className={`w-full space-y-1.5 ${className}`} aria-label={`Course progress: ${courseName} ${roundedPct}%`}>
      <div className="flex justify-between items-center text-xs font-semibold text-text-main">
        <span className="font-display font-bold tracking-tight text-text-main">{courseName}</span>
        <span className="text-primary font-bold">{roundedPct}% Complete</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-border-color/40 overflow-hidden border border-border-color/10">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${roundedPct}%` }} 
        />
      </div>
    </div>
  );
}

export function ModuleProgress({
  moduleName,
  currentUnit,
  totalUnits,
  className = ""
}: {
  moduleName: string;
  currentUnit: number;
  totalUnits: number;
  className?: string;
}) {
  const pct = totalUnits > 0 ? (currentUnit / totalUnits) * 100 : 0;
  return (
    <div className={`w-full space-y-1 text-xs ${className}`} aria-label={`Module progress: ${moduleName}`}>
      <div className="flex justify-between items-center text-xs font-semibold text-text-main">
        <span className="font-display font-bold text-text-main">{moduleName}</span>
        <span className="text-text-muted text-[11px] font-medium">Unit {currentUnit} of {totalUnits}</span>
      </div>
      <div className="h-1 w-full rounded-full bg-border-color/40 overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${pct}%` }} 
        />
      </div>
    </div>
  );
}

export function UnitProgress({
  currentUnit,
  totalUnits,
  progressPct,
  className = ""
}: {
  currentUnit: number;
  totalUnits: number;
  progressPct: number;
  className?: string;
}) {
  const roundedPct = Math.round(progressPct);
  return (
    <div className={`flex items-center gap-2.5 text-[11px] font-semibold text-text-muted ${className}`}>
      <span>Unit {currentUnit} of {totalUnits}</span>
      <span className="opacity-30 select-none">|</span>
      <span>Progress {roundedPct}%</span>
    </div>
  );
}

export function QuizProgress({
  currentQuestion,
  totalQuestions,
  progressPct,
  className = ""
}: {
  currentQuestion: number;
  totalQuestions: number;
  progressPct: number;
  className?: string;
}) {
  const roundedPct = Math.round(progressPct);
  return (
    <div className={`flex items-center gap-2.5 text-[11px] font-semibold text-text-muted ${className}`}>
      <span>Question {currentQuestion} of {totalQuestions}</span>
      <span className="opacity-30 select-none">|</span>
      <span>Progress {roundedPct}%</span>
    </div>
  );
}

export type ContextProgressProps =
  | { type: "course"; courseName: string; progressPct: number }
  | { type: "module"; moduleName: string; currentUnit: number; totalUnits: number }
  | { type: "unit"; currentUnit: number; totalUnits: number; progressPct: number }
  | { type: "quiz"; currentQuestion: number; totalQuestions: number; progressPct: number };

export function ContextProgress(props: ContextProgressProps & { className?: string }) {
  const { className = "", ...rest } = props;
  switch (rest.type) {
    case "course":
      return <CourseProgress courseName={rest.courseName} progressPct={rest.progressPct} className={className} />;
    case "module":
      return <ModuleProgress moduleName={rest.moduleName} currentUnit={rest.currentUnit} totalUnits={rest.totalUnits} className={className} />;
    case "unit":
      return <UnitProgress currentUnit={rest.currentUnit} totalUnits={rest.totalUnits} progressPct={rest.progressPct} className={className} />;
    case "quiz":
      return <QuizProgress currentQuestion={rest.currentQuestion} totalQuestions={rest.totalQuestions} progressPct={rest.progressPct} className={className} />;
    default:
      return null;
  }
}
