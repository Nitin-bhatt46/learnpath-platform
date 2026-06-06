"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ConceptScore = {
  score: number;
  total: number;
  answers: Record<string, number>;
};

export type LectureProgress = {
  completedConcepts: string[];
  scores: Record<string, ConceptScore>;
  completed: boolean;
};

type ProgressStore = Record<string, LectureProgress>;

type ProgressContextValue = {
  progress: ProgressStore;
  getLectureProgress: (lectureId: string) => LectureProgress;
  saveConceptScore: (lectureId: string, conceptId: string, score: ConceptScore) => void;
  completeLecture: (lectureId: string) => void;
  resetLecture: (lectureId: string) => void;
};

const storageKey = "lectureflow-progress";
const emptyLectureProgress: LectureProgress = {
  completedConcepts: [],
  scores: {},
  completed: false
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressStore>({});

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setProgress(JSON.parse(saved) as ProgressStore);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      getLectureProgress: (lectureId) => progress[lectureId] ?? emptyLectureProgress,
      saveConceptScore: (lectureId, conceptId, score) => {
        setProgress((current) => {
          const lecture = current[lectureId] ?? emptyLectureProgress;
          return {
            ...current,
            [lectureId]: {
              ...lecture,
              completedConcepts: Array.from(new Set([...lecture.completedConcepts, conceptId])),
              scores: {
                ...lecture.scores,
                [conceptId]: score
              }
            }
          };
        });
      },
      completeLecture: (lectureId) => {
        setProgress((current) => ({
          ...current,
          [lectureId]: {
            ...(current[lectureId] ?? emptyLectureProgress),
            completed: true
          }
        }));
      },
      resetLecture: (lectureId) => {
        setProgress((current) => {
          const next = { ...current };
          delete next[lectureId];
          return next;
        });
      }
    }),
    [progress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return context;
}
