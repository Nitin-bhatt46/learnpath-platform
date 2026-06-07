"use client";

import { useMemo, useState, Suspense, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Concept, Lecture } from "@/lib/content";
import { useProgress } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { ConceptView } from "@/components/learning/concept-view";
import { FeedbackView } from "@/components/learning/feedback-view";
import { ContextProgress } from "@/components/learning/progress-indicators";
import { QuizView } from "@/components/learning/quiz-view";

type Step = "concept" | "quiz" | "feedback";

export function LearningFlow({
  lecture,
  concepts,
  imageUrls,
  courseLecturesData = [],
  courseName = "",
  moduleLecturesData = [],
  moduleName = "",
  courseId = ""
}: {
  lecture: Lecture;
  concepts: Concept[];
  imageUrls: Record<string, string>;
  courseLecturesData?: Array<{ id: string; conceptCount: number }>;
  courseName?: string;
  moduleLecturesData?: Array<{ id: string; conceptCount: number }>;
  moduleName?: string;
  courseId?: string;
}) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-400">Loading flow...</div>}>
      <LearningFlowContent
        lecture={lecture}
        concepts={concepts}
        imageUrls={imageUrls}
        courseLecturesData={courseLecturesData}
        courseName={courseName}
        moduleLecturesData={moduleLecturesData}
        moduleName={moduleName}
        courseId={courseId}
      />
    </Suspense>
  );
}

function LearningFlowContent({
  lecture,
  concepts,
  imageUrls,
  courseLecturesData = [],
  courseName = "",
  moduleLecturesData = [],
  moduleName = "",
  courseId = ""
}: {
  lecture: Lecture;
  concepts: Concept[];
  imageUrls: Record<string, string>;
  courseLecturesData?: Array<{ id: string; conceptCount: number }>;
  courseName?: string;
  moduleLecturesData?: Array<{ id: string; conceptCount: number }>;
  moduleName?: string;
  courseId?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conceptParam = searchParams.get("concept");

  const { getLectureProgress, saveConceptScore, completeLecture } = useProgress();
  const savedProgress = getLectureProgress(lecture.id);

  const initialIndex = useMemo(() => {
    if (conceptParam) {
      const idx = concepts.findIndex((c) => c.id === conceptParam);
      if (idx >= 0) return idx;
    }
    const firstUnfinished = concepts.findIndex((concept) => !savedProgress.completedConcepts.includes(concept.id));
    return firstUnfinished >= 0 ? firstUnfinished : 0;
  }, [conceptParam, concepts, savedProgress.completedConcepts]);

  const [conceptIndex, setConceptIndex] = useState(initialIndex);
  const [step, setStep] = useState<Step>("concept");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    if (!showExitModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowExitModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showExitModal]);

  const handleExitClick = useCallback(() => {
    setShowExitModal(true);
  }, []);

  const handleCancelExit = useCallback(() => {
    setShowExitModal(false);
  }, []);

  const handleConfirmExit = useCallback(() => {
    setShowExitModal(false);
    router.push(courseId ? `/courses/${courseId}` : "/");
  }, [router, courseId]);

  const concept = concepts[conceptIndex];

  // Course Progress: Percent of completed concepts across all sibling course lectures
  const courseProgressPct = useMemo(() => {
    if (!courseLecturesData || courseLecturesData.length === 0) return 0;
    let total = 0;
    let completed = 0;
    for (const item of courseLecturesData) {
      total += item.conceptCount;
      const lp = getLectureProgress(item.id);
      completed += Math.min(lp.completedConcepts.length, item.conceptCount);
    }
    return total > 0 ? (completed / total) * 100 : 0;
  }, [courseLecturesData, getLectureProgress]);

  // Module Progress: Percent of completed concepts across all lectures in the current module (Skill)
  const moduleProgressPct = useMemo(() => {
    if (!moduleLecturesData || moduleLecturesData.length === 0) return 0;
    let total = 0;
    let completed = 0;
    for (const item of moduleLecturesData) {
      total += item.conceptCount;
      const lp = getLectureProgress(item.id);
      completed += Math.min(lp.completedConcepts.length, item.conceptCount);
    }
    return total > 0 ? (completed / total) * 100 : 0;
  }, [moduleLecturesData, getLectureProgress]);

  // Lesson Progress (Unit Progress): Percent of completed concepts in this specific lecture
  const lessonProgressPct = useMemo(() => {
    const currentCompleted = savedProgress.completedConcepts.length;
    return concepts.length > 0 ? (currentCompleted / concepts.length) * 100 : 0;
  }, [savedProgress.completedConcepts, concepts.length]);

  const handleAnswer = useCallback((questionId: string, optionIndex: number) => {
    setAnswers((current) => ({ ...current, [questionId]: optionIndex }));
  }, []);

  const submitQuiz = useCallback(() => {
    const score = concept.mcqs.filter((mcq) => answers[mcq.id] === mcq.correctAnswer).length;
    saveConceptScore(lecture.id, concept.id, {
      score,
      total: concept.mcqs.length,
      answers
    });
    setStep("feedback");
  }, [concept, answers, lecture.id, saveConceptScore]);

  const continueFlow = useCallback(() => {
    const isLastConcept = conceptIndex === concepts.length - 1;
    if (isLastConcept) {
      completeLecture(lecture.id);
      router.push(`/lecture/${lecture.id}/report`);
      return;
    }

    setConceptIndex((current) => current + 1);
    setAnswers({});
    setStep("concept");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [conceptIndex, concepts.length, lecture.id, completeLecture, router]);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = concept.mcqs.length;

  return (
    <main className="min-h-screen bg-bg-primary px-4 py-5 text-text-main sm:px-6 sm:py-8 transition-colors duration-200">
      {/* Centered Readability Width Outer Shell */}
      <div className="mx-auto max-w-[800px] w-full">
        {/* Sticky Header Panel with Progression Tracking */}
        <header className="sticky top-0 z-10 -mx-4 mb-8 border-b border-border-color bg-bg-primary/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-4 text-xs">
            {/* Left side: Breadcrumb path */}
            <div className="flex items-center gap-1.5 font-semibold text-text-muted min-w-0">
              <span className="hidden sm:inline hover:text-primary transition-colors cursor-pointer whitespace-nowrap" onClick={() => router.push("/courses")}>Career Paths</span>
              <span className="hidden sm:inline opacity-40 select-none">&gt;</span>
              {courseId ? (
                <span className="hidden md:inline hover:text-primary transition-colors cursor-pointer truncate max-w-[120px]" onClick={() => router.push(`/courses/${courseId}`)}>{courseName}</span>
              ) : (
                <span className="hidden md:inline truncate max-w-[120px]">{courseName}</span>
              )}
              <span className="hidden md:inline opacity-40 select-none">&gt;</span>
              <span className="truncate max-w-[100px] sm:max-w-none">{moduleName}</span>
              <span className="opacity-40 select-none">&gt;</span>
              <span className="text-text-main font-bold whitespace-nowrap">Unit {conceptIndex + 1}</span>
              {step === "quiz" && (
                <>
                  <span className="opacity-40 select-none">&gt;</span>
                  <span className="text-amber-500 font-bold whitespace-nowrap">Quiz</span>
                </>
              )}
            </div>

            {/* Right side: Context Progress and Exit Button */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {step === "quiz" ? (
                <ContextProgress
                  type="quiz"
                  currentQuestion={Math.min(answeredCount + 1, totalQuestions)}
                  totalQuestions={totalQuestions}
                  progressPct={totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}
                />
              ) : (
                <ContextProgress
                  type="unit"
                  currentUnit={conceptIndex + 1}
                  totalUnits={concepts.length}
                  progressPct={lessonProgressPct}
                />
              )}
              
              <button
                className="rounded-lg border border-border-color/80 bg-transparent px-2.5 py-1 text-[11px] font-semibold text-text-muted hover:text-[#EF4444] hover:border-[#EF4444] hover:bg-[#EF4444]/10 transition-all duration-200 cursor-pointer whitespace-nowrap"
                onClick={handleExitClick}
              >
                Exit Flow
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="space-y-6 pt-2">
          {step === "concept" && (
            <div className="space-y-6">
              <ConceptView concept={concept} imageUrl={imageUrls[concept.id]} />
              <div className="pt-2">
                <Button onClick={() => setStep("quiz")} className="w-full sm:w-auto">
                  Answer quick quiz
                </Button>
              </div>
            </div>
          )}

          {step === "quiz" && (
            <QuizView
              concept={concept}
              answers={answers}
              lessonNumber={conceptIndex + 1}
              totalLessons={concepts.length}
              lectureTitle={lecture.title}
              difficulty={lecture.difficulty}
              onAnswer={handleAnswer}
              onSubmit={submitQuiz}
            />
          )}

          {step === "feedback" && (
            <FeedbackView
              concept={concept}
              answers={answers}
              isLastConcept={conceptIndex === concepts.length - 1}
              onContinue={continueFlow}
            />
          )}
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-modal-backdrop"
          onClick={handleCancelExit}
        >
          <div 
            className="relative w-full max-w-sm rounded-2xl border border-border-color bg-card-bg p-6 shadow-xl animate-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-bold text-text-main">
              Leave Learning Flow?
            </h3>
            <p className="mt-2 text-sm text-text-muted">
              Your progress has been saved.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
              <button
                className="w-full sm:w-auto rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all cursor-pointer shadow-sm active:scale-[0.98] text-center"
                onClick={handleCancelExit}
              >
                Continue Learning
              </button>
              <button
                className="w-full sm:w-auto rounded-lg border border-border-color/80 bg-transparent px-4 py-2 text-sm font-semibold text-text-muted hover:text-[#EF4444] hover:border-[#EF4444] hover:bg-[#EF4444]/10 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/50 focus:ring-offset-2 transition-all duration-200 cursor-pointer text-center"
                onClick={handleConfirmExit}
              >
                Exit Flow
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
