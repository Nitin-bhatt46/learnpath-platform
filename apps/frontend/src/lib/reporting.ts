import type { Concept } from "./content";
import type { LectureProgress } from "./progress";

export type ConceptReport = {
  id: string;
  title: string;
  score: number;
  total: number;
  percentage: number;
};

export function buildReport(concepts: Concept[], progress: LectureProgress) {
  const conceptScores = concepts.map<ConceptReport>((concept) => {
    const saved = progress.scores[concept.id];
    const total = saved?.total ?? concept.mcqs.length;
    const score = saved?.score ?? 0;
    return {
      id: concept.id,
      title: concept.title,
      score,
      total,
      percentage: total === 0 ? 0 : Math.round((score / total) * 100)
    };
  });

  const totalScore = conceptScores.reduce((sum, concept) => sum + concept.score, 0);
  const totalQuestions = conceptScores.reduce((sum, concept) => sum + concept.total, 0);
  const percentage = totalQuestions === 0 ? 0 : Math.round((totalScore / totalQuestions) * 100);

  return {
    totalScore,
    totalQuestions,
    percentage,
    conceptScores,
    strongConcepts: conceptScores.filter((concept) => concept.percentage >= 80),
    weakConcepts: conceptScores.filter((concept) => concept.percentage < 60)
  };
}
