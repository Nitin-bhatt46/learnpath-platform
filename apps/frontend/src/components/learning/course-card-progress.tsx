"use client";

import React, { useMemo } from "react";
import { useProgress } from "@/lib/progress";
import { CourseProgress } from "@/components/learning/progress-indicators";
import type { Course } from "@/lib/content";

export function CourseCardProgress({
  course,
  isBeginner,
  isIntermediate
}: {
  course: Course;
  isBeginner: boolean;
  isIntermediate: boolean;
}) {
  const { getLectureProgress } = useProgress();

  const progressPct = useMemo(() => {
    let totalConcepts = 0;
    let completedConcepts = 0;
    
    if (!course.skills) return 0;
    
    for (const skill of course.skills) {
      if (!skill.lectures) continue;
      for (const lecture of skill.lectures) {
        totalConcepts += lecture.conceptCount || 0;
        const lp = getLectureProgress(lecture.id);
        completedConcepts += Math.min(
          (lp?.completedConcepts?.length || 0),
          lecture.conceptCount || 0
        );
      }
    }
    
    return totalConcepts > 0 ? (completedConcepts / totalConcepts) * 100 : 0;
  }, [course, getLectureProgress]);

  if (progressPct > 0) {
    return (
      <div className="pt-1.5 animate-fadeIn">
        <CourseProgress courseName={course.title} progressPct={progressPct} />
      </div>
    );
  }

  // Fallback to original Difficulty indicator if not started
  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-text-muted">
        <span>Beginner</span>
        <span>Advanced</span>
      </div>
      <div className="h-1 w-full rounded-full bg-bg-primary border border-border-color/30 overflow-hidden">
        <div
          className={`h-full rounded-full bg-primary transition-all duration-300 ${
            isBeginner ? "w-full" : isIntermediate ? "w-2/3 ml-[33%]" : "w-1/3 ml-[66%]"
          }`}
        />
      </div>
    </div>
  );
}
