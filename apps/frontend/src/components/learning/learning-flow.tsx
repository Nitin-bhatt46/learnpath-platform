"use client";

import { useMemo, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Concept, Lecture } from "@/lib/content";
import { useProgress } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { ConceptView } from "@/components/learning/concept-view";
import { FeedbackView } from "@/components/learning/feedback-view";
import { ProgressBar } from "@/components/learning/progress-bar";
import { QuizView } from "@/components/learning/quiz-view";

type Step = "concept" | "quiz" | "feedback";

export function LearningFlow({
  lecture,
  concepts,
  imageUrls,
  courseLecturesData = [],
  courseName = "",
  moduleLecturesData = [],
  moduleName = ""
}: {
  lecture: Lecture;
  concepts: Concept[];
  imageUrls: Record<string, string>;
  courseLecturesData?: Array<{ id: string; conceptCount: number }>;
  courseName?: string;
  moduleLecturesData?: Array<{ id: string; conceptCount: number }>;
  moduleName?: string;
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
  moduleName = ""
}: {
  lecture: Lecture;
  concepts: Concept[];
  imageUrls: Record<string, string>;
  courseLecturesData?: Array<{ id: string; conceptCount: number }>;
  courseName?: string;
  moduleLecturesData?: Array<{ id: string; conceptCount: number }>;
  moduleName?: string;
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
        <header className="sticky top-0 z-10 -mx-4 mb-8 border-b border-border-color bg-bg-primary/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{lecture.title}</p>
              <h1 className="mt-1 text-xs font-bold text-text-main">
                {concept.title}
              </h1>
            </div>
            <button
              className="min-h-10 rounded-xl px-4 border border-border-color bg-surface text-xs font-bold text-text-muted hover:text-text-main hover:bg-bg-primary transition-colors shadow-3xs cursor-pointer"
              onClick={() => router.push("/")}
            >
              Exit Flow
            </button>
          </div>
          
          {/* Progress Stack (Course, Module, Unit, Quiz Completion) */}
          <div className="space-y-3 border-t border-border-color/30 pt-3">
            {courseName && (
              <ProgressBar value={courseProgressPct} label={`Course Progress: ${courseName}`} variant="amber" />
            )}
            {moduleName && (
              <ProgressBar value={moduleProgressPct} label={`Module Progress: ${moduleName}`} variant="amber" />
            )}
            <ProgressBar
              value={lessonProgressPct}
              label={`Unit Progress: Unit ${conceptIndex + 1} of ${concepts.length}`}
              variant="amber"
            />
            {step === "quiz" && totalQuestions > 0 && (
              <ProgressBar
                value={(answeredCount / totalQuestions) * 100}
                label={`Quiz Completion: ${answeredCount} of ${totalQuestions} answered`}
                variant="amber"
              />
            )}
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
    </main>
  );
}
