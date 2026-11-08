/* Lo que valen las preguntas de una entrega, leído de su documento de Firestore tal cual está.
   Misma regla que src/components/deliverable/deliverables.ts: una pregunta sin puntos vale 1 y,
   si ninguna los tiene (entregas anteriores a los puntos), se reparten la nota máxima guardada. */
const DEFAULT_MAX_SCORE = 10;
const DEFAULT_QUESTION_POINTS = 1;
const SCORE_DECIMALS = 100;

function roundScore(value) {
  return Math.round(value * SCORE_DECIMALS) / SCORE_DECIMALS;
}

function isPoints(value) {
  return typeof value === 'number' && value > 0;
}

function questionsOf(deliverable) {
  const stored = Array.isArray(deliverable.questions) ? deliverable.questions : [];
  const valid = stored.filter((question) => question && typeof question.id === 'string' && typeof question.text === 'string');
  const storedMaxScore = Number(deliverable.maxScore) || DEFAULT_MAX_SCORE;
  const hasPoints = valid.some((question) => isPoints(question.points));
  const legacyPoints = valid.length > 0 ? roundScore(storedMaxScore / valid.length) : DEFAULT_QUESTION_POINTS;
  return valid.map((question) => ({
    id: question.id,
    text: question.text,
    maxChars: isPoints(question.maxChars) ? question.maxChars : null,
    points: isPoints(question.points) ? question.points : hasPoints ? DEFAULT_QUESTION_POINTS : legacyPoints,
  }));
}

/* Texto: la suma de los puntos; enlace: la nota máxima guardada. */
function maxScoreOf(deliverable) {
  const questions = questionsOf(deliverable);
  if (deliverable.kind === 'text' && questions.length > 0) {
    return roundScore(questions.reduce((sum, question) => sum + question.points, 0));
  }
  return Number(deliverable.maxScore) || DEFAULT_MAX_SCORE;
}

module.exports = { maxScoreOf, questionsOf, roundScore };
