"use client";

import type { Concept, Mcq } from "@/lib/content";
import { Button } from "@/components/ui/button";

function QuestionCard({
  mcq,
  index,
  selectedOption,
  onSelectOption
}: {
  mcq: Mcq;
  index: number;
  selectedOption: number | undefined;
  onSelectOption: (optionIndex: number) => void;
}) {
  return (
    <fieldset className="rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs space-y-4">
      <legend className="sr-only">Question {index + 1}</legend>
      <p className="text-base font-bold text-text-main leading-relaxed">
        {index + 1}. {mcq.question}
      </p>

      {/* Options list */}
      <div className="grid gap-2.5 pt-2">
        {mcq.options.map((option, optionIndex) => {
          const isSelected = selectedOption === optionIndex;

          let cardStyle = "border-border-color bg-bg-primary/20 text-text-main hover:border-primary/50";
          if (isSelected) {
            cardStyle = "border-l-4 border-l-amber-500 border-amber-500 bg-amber-500/10 text-text-main font-semibold ring-1 ring-amber-500/20";
          }

          return (
            <label
              key={option}
              className={`flex min-h-14 cursor-pointer items-center gap-3.5 rounded-xl border px-4 py-3.5 text-sm transition-all duration-150 whitespace-normal break-words leading-relaxed ${cardStyle}`}
            >
              <input
                className="h-4 w-4 accent-amber-500 cursor-pointer flex-shrink-0"
                type="radio"
                name={mcq.id}
                checked={isSelected}
                onChange={() => onSelectOption(optionIndex)}
              />
              <span className="flex-1">{option}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function QuizView({
  concept,
  answers,
  onAnswer,
  onSubmit,
  lessonNumber,
  totalLessons,
  lectureTitle,
  difficulty
}: {
  concept: Concept;
  answers: Record<string, number>;
  onAnswer: (questionId: string, optionIndex: number) => void;
  onSubmit: () => void;
  lessonNumber: number;
  totalLessons: number;
  lectureTitle: string;
  difficulty: string;
}) {
  const totalQuestions = concept.mcqs.length;
  const allAnswered = concept.mcqs.every((mcq) => answers[mcq.id] !== undefined);

  return (
    <section className="space-y-6 animate-fadeIn max-w-[800px] mx-auto w-full">
      {/* Question Header & Metadata */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
          <span>Lesson {lessonNumber} of {totalLessons}</span>
          <span className="opacity-40">•</span>
          <span>{lectureTitle}</span>
          <span className="opacity-40">•</span>
          <span className="text-amber-500">Unit Quiz: {totalQuestions} Questions</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded bg-accent/40 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-accent-text border border-primary/10">
            {difficulty}
          </span>
          {concept.tags && concept.tags.map((tag) => (
            <span key={tag} className="rounded bg-bg-primary border border-border-color/50 px-2 py-0.5 text-[9px] font-bold text-text-muted">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* List of Question Cards */}
      <div className="space-y-6">
        {concept.mcqs.map((mcq, idx) => (
          <QuestionCard
            key={mcq.id}
            mcq={mcq}
            index={idx}
            selectedOption={answers[mcq.id]}
            onSelectOption={(optionIndex) => onAnswer(mcq.id, optionIndex)}
          />
        ))}
      </div>

      {/* Submit Button block */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-color/30">
        {!allAnswered && (
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
            Please answer all {totalQuestions} questions to submit.
          </p>
        )}
        <Button
          disabled={!allAnswered}
          onClick={onSubmit}
          className="w-full sm:w-auto ml-auto"
        >
          Submit Unit Quiz
        </Button>
      </div>
    </section>
  );
}
