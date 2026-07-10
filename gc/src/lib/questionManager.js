import { questions } from "../data/question";

const STORAGE_KEY = "usedQuestionIds";

export function getNextQuestion(phase) {
  const phaseQuestions = questions[phase] || [];

  const usedIds = JSON.parse(
    (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null) || "[]"
  );

  const availableQuestions = phaseQuestions.filter(
    (q) => !usedIds.includes(q.id)
  );

  if (availableQuestions.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(
    Math.random() * availableQuestions.length
  );

  return availableQuestions[randomIndex];
}

export function markQuestionAsUsed(questionId) {
  const usedIds = JSON.parse(
    (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null) || "[]"
  );

  if (!usedIds.includes(questionId)) {
    usedIds.push(questionId);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(usedIds)
    );
  }
}