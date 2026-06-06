"use client";

import type { Concept } from "@/lib/content";
import { Button } from "@/components/ui/button";

export function FeedbackView({
  concept,
  answers,
  onContinue,
  isLastConcept
}: {
  concept: Concept;
  answers: Record<string, number>;
  onContinue: () => void;
  isLastConcept: boolean;
}) {
  const correctCount = concept.mcqs.filter((mcq) => answers[mcq.id] === mcq.correctAnswer).length;
  const totalCount = concept.mcqs.length;
  const incorrectCount = totalCount - correctCount;

  return (
    <section className="space-y-6 max-w-[800px] mx-auto w-full animate-fadeIn">
      {/* Premium Score Dashboard */}
      <div className="rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs space-y-4">
        <div>
          <span className="rounded bg-accent/40 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-accent-text border border-primary/10">
            Unit Quiz Feedback
          </span>
          <h1 className="mt-3 text-2xl font-display font-bold text-text-main">
            Quiz Result: {correctCount} of {totalCount} Correct
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Carefully review the answers and conceptual breakdowns below to solidify your understanding.
          </p>
        </div>

        {/* Breakdown Badges */}
        <div className="flex gap-3 text-xs font-bold pt-2 border-t border-border-color/30">
          <div className="flex items-center gap-1.5 rounded-lg bg-green-500/10 text-green-500 px-3 py-1.5 border border-green-500/20">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span>{correctCount} Correct</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-red-500/10 text-red-500 px-3 py-1.5 border border-red-500/20">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span>{incorrectCount} Incorrect</span>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-5">
        {concept.mcqs.map((mcq, index) => {
          const userAnswer = answers[mcq.id];
          const correct = userAnswer === mcq.correctAnswer;
          
          const getOptionText = (idx: number | undefined) => {
            if (idx === undefined || idx < 0 || idx >= mcq.options.length) return "None Selected";
            const letter = String.fromCharCode(65 + idx);
            return `${letter}. ${mcq.options[idx]}`;
          };

          return (
            <article
              key={mcq.id}
              className={`rounded-xl border p-5 shadow-3xs space-y-4 transition-colors duration-200 ${
                correct
                  ? "border-green-500/25 bg-green-500/5"
                  : "border-red-500/25 bg-red-500/5"
              }`}
            >
              {/* Question Index & Status Indicator */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Question {index + 1}
                </span>
                {correct ? (
                  <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-green-600 dark:text-green-400">
                    ✓ Correct
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400">
                    ✕ Incorrect
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h3 className="text-sm sm:text-base font-bold text-text-main leading-relaxed">
                {mcq.question}
              </h3>

              {/* Answers Grid */}
              <div className="grid gap-3 sm:grid-cols-2 pt-2 text-xs">
                {/* Your Answer */}
                <div className={`rounded-lg p-3 border ${
                  correct 
                    ? "bg-green-500/10 border-green-500/20 text-text-main" 
                    : "bg-red-500/10 border-red-500/20 text-text-main"
                }`}>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                    Your Answer
                  </span>
                  <p className="font-semibold leading-relaxed">
                    {getOptionText(userAnswer)}
                  </p>
                </div>

                {/* Correct Answer */}
                <div className="rounded-lg p-3 bg-green-500/10 border border-green-500/20 text-text-main">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                    Correct Answer
                  </span>
                  <p className="font-semibold leading-relaxed text-green-600 dark:text-green-400">
                    {getOptionText(mcq.correctAnswer)}
                  </p>
                </div>
              </div>

              {/* Explanations Section */}
              <div className="pt-3 border-t border-border-color/30 space-y-3.5 text-xs">
                {/* Solution Explainer */}
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Explanation
                  </span>
                  <p className="leading-6 text-text-main">
                    {mcq.explanation}
                  </p>
                </div>

                {/* Why It Matters */}
                <div className="space-y-1 pt-1.5 border-t border-border-color/20">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Why It Matters
                  </span>
                  <p className="leading-6 text-text-main">
                    {concept.content.explanation}
                  </p>
                </div>

                {/* Learning Takeaway */}
                <div className="space-y-1 pt-1.5 border-t border-border-color/20">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Learning Takeaway
                  </span>
                  <p className="leading-6 text-text-main font-semibold">
                    {concept.content.keyTakeaway}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Navigation Block */}
      <div className="pt-4 border-t border-border-color/30 flex justify-end">
        <Button onClick={onContinue} className="w-full sm:w-auto px-6 font-bold py-2 bg-primary hover:bg-primary/90">
          {isLastConcept ? "View Completion Report" : "Continue to Next Unit"}
        </Button>
      </div>
    </section>
  );
}
