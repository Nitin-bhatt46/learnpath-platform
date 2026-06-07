"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { Button, ButtonLink } from "@/components/ui/button";
import { CourseProgress, ModuleProgress } from "@/components/learning/progress-indicators";
import type { Course, Skill, LectureOverview } from "@/lib/content";
import {
  CheckCircleIcon,
  ClockIcon,
  TargetIcon,
  GitBranchIcon,
  RouteIcon,
  FolderIcon,
  BookOpenIcon,
  ChevronRightIcon
} from "@/components/ui/icons";

export function CourseRoadmapView({ course }: { course: Course }) {
  const { progress, getLectureProgress } = useProgress();
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const [activePartId, setActivePartId] = useState<string | null>(null);

  // 1. Find the active skill details
  const activeSkill = useMemo(() => {
    if (!activeSkillId) return null;
    return course.skills.find((s) => s.id.toLowerCase() === activeSkillId.toLowerCase()) ?? null;
  }, [course.skills, activeSkillId]);

  // 2. Find the active part details
  const activePart = useMemo(() => {
    if (!activeSkill || !activePartId) return null;
    return activeSkill.lectures.find((l) => l.id.toLowerCase() === activePartId.toLowerCase() || l.partId?.toLowerCase() === activePartId.toLowerCase()) ?? null;
  }, [activeSkill, activePartId]);

  // 3. Compute stats for each skill
  const skillStats = useMemo(() => {
    const stats: Record<string, { totalLessons: number; totalMinutes: number; completedLessons: number; completedParts: number; progressPct: number }> = {};
    
    for (const skill of course.skills) {
      let totalLessons = 0;
      let totalMinutes = 0;
      let completedLessons = 0;
      let completedParts = 0;

      for (const lecture of skill.lectures) {
        totalLessons += lecture.conceptCount;
        totalMinutes += lecture.estimatedMinutes;
        
        const lp = getLectureProgress(lecture.id);
        completedLessons += lp.completedConcepts.length;
        if (lp.completed) {
          completedParts += 1;
        }
      }

      const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      stats[skill.id] = { totalLessons, totalMinutes, completedLessons, completedParts, progressPct };
    }

    return stats;
  }, [course.skills, getLectureProgress, progress]);

  // 4. Compute total metrics for dashboard
  const courseMetrics = useMemo(() => {
    let totalModules = course.skills.filter((s) => s.lectures.length > 0).length;
    let totalLessons = 0;
    
    for (const skill of course.skills) {
      if (skill.lectures.length > 0) {
        totalLessons += skill.lectures.reduce((acc, l) => acc + l.conceptCount, 0);
      }
    }

    return {
      modulesCount: totalModules,
      lessonsCount: totalLessons,
      projectsCount: course.projectsCount || 0,
      difficulty: course.difficulty || "Beginner to Advanced"
    };
  }, [course]);

  // Filter skills to only show those that have content (lectures)
  const courseProgressPct = useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;
    for (const skill of course.skills) {
      for (const lecture of skill.lectures) {
        totalLessons += lecture.conceptCount;
        const lp = getLectureProgress(lecture.id);
        completedLessons += lp.completedConcepts.length;
      }
    }
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  }, [course.skills, getLectureProgress, progress]);

  const activeSkillProgress = useMemo(() => {
    if (!activeSkill) return null;
    let totalLessons = 0;
    let completedLessons = 0;
    for (const lecture of activeSkill.lectures) {
      totalLessons += lecture.conceptCount;
      const lp = getLectureProgress(lecture.id);
      completedLessons += lp.completedConcepts.length;
    }
    return { completedLessons, totalLessons };
  }, [activeSkill, getLectureProgress, progress]);

  const availableSkills = useMemo(() => {
    return course.skills.filter((s) => s.lectures.length > 0);
  }, [course.skills]);

  return (
    <div className="space-y-6">
      
      {/* BREADCRUMBS */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-text-muted">
        <button
          onClick={() => {
            setActiveSkillId(null);
            setActivePartId(null);
          }}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          {course.title} Dashboard
        </button>
        
        {activeSkill && (
          <>
            <ChevronRightIcon className="h-3.5 w-3.5 text-text-muted/60" />
            <button
              onClick={() => {
                setActivePartId(null);
              }}
              className={`hover:text-primary transition-colors cursor-pointer ${!activePart ? "text-text-main font-bold" : ""}`}
            >
              {activeSkill.title}
            </button>
          </>
        )}

        {activePart && (
          <>
            <ChevronRightIcon className="h-3.5 w-3.5 text-text-muted/60" />
            <span className="text-text-main font-bold">
              {activePart.partTitle || activePart.title}
            </span>
          </>
        )}
      </div>

      {/* VIEW 0: MAIN DASHBOARD */}
      {!activeSkill && (
        <div className="space-y-10">
          
          {/* SECTION 1: HERO */}
          <section className="rounded-xl border border-border-color bg-card-bg p-6 shadow-3xs">
            <div>
              <span className="inline-flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-text border border-primary/10">
                <RouteIcon className="h-3 w-3" />
                <span>Roadmap Map</span>
              </span>
              <h1 className="mt-3 text-2xl font-display font-bold text-text-main">
                {course.title} Roadmap
              </h1>
              <p className="mt-2 text-xs leading-5 text-text-muted max-w-xl">
                {course.description}
              </p>
            </div>

            {/* Metrics */}
            <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-4">
              <div className="rounded-lg bg-bg-primary border border-border-color/60 p-3.5 shadow-3xs">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Modules</span>
                <span className="text-base font-bold text-text-main mt-0.5 block">{courseMetrics.modulesCount} Tracks</span>
              </div>
              <div className="rounded-lg bg-bg-primary border border-border-color/60 p-3.5 shadow-3xs">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Lessons</span>
                <span className="text-base font-bold text-text-main mt-0.5 block">{courseMetrics.lessonsCount} Units</span>
              </div>
              <div className="rounded-lg bg-bg-primary border border-border-color/60 p-3.5 shadow-3xs">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Projects</span>
                <span className="text-base font-bold text-text-main mt-0.5 block">{courseMetrics.projectsCount} Tasks</span>
              </div>
              <div className="rounded-lg bg-bg-primary border border-border-color/60 p-3.5 shadow-3xs">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Level</span>
                <span className="text-xs font-bold text-text-main mt-0.5 block line-clamp-1">{courseMetrics.difficulty}</span>
              </div>
            </div>
            {courseProgressPct > 0 && (
              <div className="mt-6 border-t border-border-color/30 pt-5">
                <CourseProgress courseName={course.title} progressPct={courseProgressPct} />
              </div>
            )}
          </section>

          {/* SECTION 2: ROADMAP OVERVIEW FLOW */}
          {course.roadmapOverview && course.roadmapOverview.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">Roadmap Overview</h2>
              <div className="flex flex-wrap items-center gap-2">
                {course.roadmapOverview.map((step, idx) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="rounded-md border border-border-color bg-card-bg px-2.5 py-1 text-xs font-semibold text-text-main shadow-3xs">
                      {step}
                    </span>
                    {idx < (course.roadmapOverview?.length ?? 0) - 1 && (
                      <ChevronRightIcon className="h-4 w-4 text-text-muted/60" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 3: AVAILABLE MODULES */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">Available Modules</h2>
            
            {availableSkills.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {availableSkills.map((skill) => {
                  const stats = skillStats[skill.id] || { totalLessons: 0, totalMinutes: 0, completedLessons: 0, completedParts: 0, progressPct: 0 };
                  const isStarted = stats.completedLessons > 0;
                  const isFinished = stats.completedLessons === stats.totalLessons && stats.totalLessons > 0;

                  return (
                    <article
                      key={skill.id}
                      className="hover-lift flex flex-col justify-between rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs"
                    >
                      <div className="space-y-4">
                        <div>
                          <span className="rounded bg-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-text border border-primary/10">
                            Core Module
                          </span>
                          <h3 className="mt-1.5 text-base font-bold text-text-main">{skill.title}</h3>
                          <p className="mt-0.5 text-xs text-text-muted leading-4">{skill.description}</p>
                        </div>

                        {/* Stats list */}
                        <div className="grid grid-cols-3 gap-2 border-y border-border-color/50 py-2.5 text-xs font-semibold text-text-main bg-bg-primary/30 rounded-lg px-2">
                          <div>
                            <span className="text-text-muted block text-[10px] font-normal">Parts</span>
                            <span>{stats.completedParts} / {skill.lectures.length}</span>
                          </div>
                          <div>
                            <span className="text-text-muted block text-[10px] font-normal">Lessons</span>
                            <span>{stats.completedLessons} / {stats.totalLessons}</span>
                          </div>
                          <div>
                            <span className="text-text-muted block text-[10px] font-normal">Duration</span>
                            <span>{stats.totalMinutes}m</span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        {isStarted && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-semibold text-text-muted">
                              <span>Module Progress</span>
                              <span>{stats.progressPct}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-bg-primary border border-border-color/20 overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${stats.progressPct}%` }} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-5">
                        <Button
                          onClick={() => setActiveSkillId(skill.id)}
                          variant="primary"
                          className="w-full justify-center"
                        >
                          {isFinished ? "Review Module" : isStarted ? "Continue Path" : "Start Learning"}
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border-color bg-card-bg p-10 text-center space-y-4 shadow-3xs">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/30 text-primary">
                  <TargetIcon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-text-main">Roadmap Under Construction</h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto leading-5">
                  We are currently writing the lessons and projects for this pathway. Register to get notified when modules go live!
                </p>
                <div>
                  <Button variant="secondary" size="sm" onClick={() => alert("We've logged your vote for this roadmap!")}>
                    Vote for early release
                  </Button>
                </div>
              </div>
            )}
          </section>

        </div>
      )}

      {/* VIEW 1: MODULE PARTS LIST */}
      {activeSkill && !activePart && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header */}
          <div className="space-y-3">
            <button
              onClick={() => setActiveSkillId(null)}
              className="text-xs font-semibold text-text-muted hover:text-primary transition-colors cursor-pointer"
            >
              &larr; Back to Modules Dashboard
            </button>
            <div className="flex flex-col gap-1.5 font-semibold">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">MODULE PARTS</span>
              <h2 className="text-2xl font-display font-bold text-text-main">{activeSkill.title}</h2>
              <p className="text-xs text-text-muted font-medium leading-5 max-w-xl">{activeSkill.description}</p>
              {activeSkillProgress && (
                <div className="mt-2.5 max-w-md w-full animate-fadeIn">
                  <ModuleProgress
                    moduleName={activeSkill.title}
                    currentUnit={activeSkillProgress.completedLessons}
                    totalUnits={activeSkillProgress.totalLessons}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Parts Grid */}
          <div className="grid gap-4">
            {activeSkill.lectures.map((lecture, idx) => {
              const lp = getLectureProgress(lecture.id);
              const isPartStarted = lp.completedConcepts.length > 0;
              const isPartFinished = lp.completed;
              
              // Calculate status labels
              let statusText = "Not Started";
              let statusColor = "text-text-muted bg-bg-primary border-border-color";
              
              if (isPartFinished) {
                statusText = "Completed";
                statusColor = "text-primary bg-accent/40 border-primary/20";
              } else if (isPartStarted) {
                statusText = `In Progress (${lp.completedConcepts.length}/${lecture.conceptCount})`;
                statusColor = "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400";
              }

              return (
                <article
                  key={lecture.id}
                  className="flex flex-col justify-between rounded-xl border border-border-color bg-card-bg p-4 shadow-3xs sm:flex-row sm:items-center hover-lift hover:border-primary/30"
                >
                  <div className="space-y-2 sm:max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-bg-primary border border-border-color px-2 py-0.5 text-[9px] font-bold text-text-muted">
                        Part {idx + 1}
                      </span>
                      <span className={`rounded border px-2 py-0.5 text-[9px] font-bold ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-text-main">{lecture.partTitle || lecture.title}</h3>
                    <p className="text-xs text-text-muted leading-4">{lecture.description}</p>
                  </div>

                  {/* Actions & stats */}
                  <div className="mt-4 flex items-center justify-between border-t border-border-color/30 pt-3 sm:mt-0 sm:border-0 sm:pt-0 gap-6">
                    <div className="text-right text-[10px] text-text-muted font-bold uppercase tracking-wider hidden md:block leading-4">
                      <span className="block">{lecture.conceptCount} Units</span>
                      <span className="block">{lecture.estimatedMinutes} Mins</span>
                    </div>
                    
                    <Button
                      onClick={() => setActivePartId(lecture.id)}
                      variant={isPartFinished ? "secondary" : "primary"}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      {isPartFinished ? "Review Lessons" : isPartStarted ? "Continue Part" : "Start Part"}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: PART LESSONS LIST */}
      {activeSkill && activePart && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header */}
          <div className="space-y-3">
            <button
              onClick={() => setActivePartId(null)}
              className="text-xs font-semibold text-text-muted hover:text-primary transition-colors cursor-pointer"
            >
              &larr; Back to Parts List
            </button>
            <div className="flex flex-col gap-1.5 font-semibold">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">PART LESSONS</span>
              <h2 className="text-2xl font-display font-bold text-text-main">{activePart.partTitle || activePart.title}</h2>
              <p className="text-xs text-text-muted font-medium leading-5 max-w-xl">{activePart.description}</p>
              {activeSkillProgress && (
                <div className="mt-2.5 max-w-md w-full animate-fadeIn">
                  <ModuleProgress
                    moduleName={activeSkill.title}
                    currentUnit={activeSkillProgress.completedLessons}
                    totalUnits={activeSkillProgress.totalLessons}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Panel & Resume Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-border-color bg-card-bg p-4 shadow-3xs gap-4">
            <div className="grid grid-cols-3 gap-6 text-xs font-semibold text-text-main">
              <div>
                <span className="text-text-muted block text-[10px] font-normal">Lessons Count</span>
                <span className="text-sm font-bold text-text-main">{activePart.conceptCount}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] font-normal">Completion</span>
                <span className="text-sm font-bold text-text-main">
                  {getLectureProgress(activePart.id).completedConcepts.length} / {activePart.conceptCount}
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] font-normal">Estimated</span>
                <span className="text-sm font-bold text-text-main">{activePart.estimatedMinutes}m</span>
              </div>
            </div>

            <ButtonLink
              href={`/lecture/${activePart.id}`}
              variant="primary"
              className="w-full sm:w-auto text-center"
            >
              {getLectureProgress(activePart.id).completed ? "Review Study Flow" : getLectureProgress(activePart.id).completedConcepts.length > 0 ? "Resume Study Flow" : "Start Study Flow"}
            </ButtonLink>
          </div>

          {/* Lessons list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Topic Milestone Units</h3>
            
            <div className="grid gap-3">
              {activePart.concepts?.map((concept, index) => {
                const lp = getLectureProgress(activePart.id);
                const isConceptCompleted = lp.completedConcepts.includes(concept.id);
                
                return (
                  <div
                    key={concept.id}
                    className="flex items-center justify-between rounded-xl border border-border-color/50 bg-card-bg p-3.5 shadow-3xs"
                  >
                    <div className="flex items-center gap-3">
                      {isConceptCompleted ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-primary border border-primary/20 shadow-3xs">
                          <CheckCircleIcon className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bg-primary border border-border-color text-[9px] font-bold text-text-muted">
                          {index + 1}
                        </span>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-text-main">{concept.title}</h4>
                        <div className="flex items-center gap-1 text-[9px] font-medium text-text-muted mt-0.5">
                          <ClockIcon className="h-3 w-3" />
                          <span>{concept.estimatedMinutes} Mins</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/lecture/${activePart.id}?concept=${concept.id}`}
                      className={`text-2xs font-bold px-2.5 py-1.5 rounded-md transition border ${
                        isConceptCompleted
                          ? "border-border-color text-text-muted hover:bg-bg-primary hover:text-text-main"
                          : "border-primary/20 text-primary hover:bg-accent"
                      }`}
                    >
                      {isConceptCompleted ? "Review" : "Study Unit"}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
