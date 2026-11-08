#!/usr/bin/env node
/* Escribe las revisiones de una entrega desde el reviews.json que genera export-submissions.js, una
   vez rellenado. Usa la cuenta de servicio de .env.local (FIREBASE_SERVICE_ACCOUNT): escribe en
   Firestore saltándose las reglas, así que revisa el archivo antes.

   Uso, desde la raíz del repo:
     node deliverables/scripts/import-reviews.js <id-de-la-entrega> <ruta/reviews.json> --by <uid-del-docente> [--dry-run]

   Cada objeto del JSON: { uid, comment, answers: [{ questionId, points, score, comment }] } en las
   entregas de texto, donde la nota total es la suma de las notas dadas; { uid, score, comment } en
   las de enlace. Los demás campos se ignoran. Un objeto sin ninguna nota ni comentario no se
   escribe. --dry-run muestra qué escribiría sin tocar nada. */
const fs = require('fs');
const path = require('path');
const { maxScoreOf, questionsOf, roundScore } = require('./scoring');

const repoRoot = path.resolve(__dirname, '..', '..');
const projectRequire = require('module').createRequire(path.join(repoRoot, 'package.json'));
projectRequire('@next/env').loadEnvConfig(repoRoot);
const { cert, initializeApp } = projectRequire('firebase-admin/app');
const { FieldValue, getFirestore } = projectRequire('firebase-admin/firestore');

const args = process.argv.slice(2);
const positional = args.filter((arg, index) => !arg.startsWith('--') && args[index - 1] !== '--by');
const [deliverableId, reviewsPath] = positional;
const byIndex = args.indexOf('--by');
const reviewedBy = byIndex === -1 ? null : args[byIndex + 1];
const dryRun = args.includes('--dry-run');

if (!deliverableId || !reviewsPath || !reviewedBy) {
  console.error('Uso: node deliverables/scripts/import-reviews.js <id-de-la-entrega> <ruta/reviews.json> --by <uid-del-docente> [--dry-run]');
  process.exit(1);
}
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('Falta FIREBASE_SERVICE_ACCOUNT en .env.local (ver docs/exam.md).');
  process.exit(1);
}
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\r?\n/g, '\\n'));
const db = getFirestore(initializeApp({ credential: cert(serviceAccount) }));

function scoreOf(value) {
  return value === null || value === undefined || value === '' ? null : Number(value);
}

function commentOf(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isInRange(score, max) {
  return score === null || (!Number.isNaN(score) && score >= 0 && score <= max);
}

function nameOf(review) {
  return review.displayName || review.uid;
}

/* Nota y comentario por pregunta; la total es la suma de las dadas. Sin ninguna nota por pregunta
   vale la total escrita en `score` (revisiones anteriores a las notas por pregunta, o un docente
   que solo pone el total), validada contra la nota máxima. */
function textReview(review, questions, maxScore) {
  const scores = {};
  const comments = {};
  for (const answer of review.answers) {
    const question = questions.find((candidate) => candidate.id === answer.questionId);
    if (!question) {
      console.error(`${nameOf(review)}: la pregunta ${answer.questionId} no existe en la entrega.`);
      process.exit(1);
    }
    const score = scoreOf(answer.score);
    if (!isInRange(score, question.points)) {
      console.error(`${nameOf(review)}: nota fuera de rango en la pregunta ${answer.questionId}: ${answer.score} (máximo ${question.points}).`);
      process.exit(1);
    }
    scores[question.id] = score;
    const comment = commentOf(answer.comment);
    if (comment !== '') comments[question.id] = comment;
  }
  const given = Object.values(scores).filter((score) => score !== null);
  if (given.length === 0) return { ...linkReview(review, maxScore), scores, comments };
  return { score: roundScore(given.reduce((sum, score) => sum + score, 0)), scores, comments };
}

function linkReview(review, maxScore) {
  const score = scoreOf(review.score);
  if (!isInRange(score, maxScore)) {
    console.error(`Nota fuera de rango para ${nameOf(review)}: ${review.score} (máximo ${maxScore}).`);
    process.exit(1);
  }
  return { score, scores: {}, comments: {} };
}

(async () => {
  const deliverableRef = db.collection('deliverables').doc(deliverableId);
  const deliverableSnapshot = await deliverableRef.get();
  if (!deliverableSnapshot.exists) {
    console.error(`No existe la entrega ${deliverableId}.`);
    process.exit(1);
  }
  const deliverable = deliverableSnapshot.data();
  const questions = questionsOf(deliverable);
  const maxScore = maxScoreOf(deliverable);
  const reviews = JSON.parse(fs.readFileSync(path.resolve(reviewsPath), 'utf8'));
  if (!Array.isArray(reviews)) {
    console.error('El archivo debe ser un arreglo de objetos, uno por estudiante.');
    process.exit(1);
  }
  const batch = db.batch();
  let count = 0;
  for (const review of reviews) {
    if (typeof review.uid !== 'string' || review.uid === '') {
      console.error('Un objeto no tiene uid; se omite.');
      continue;
    }
    const byQuestion = deliverable.kind === 'text' && Array.isArray(review.answers) && review.answers.length > 0;
    const graded = byQuestion ? textReview(review, questions, maxScore) : linkReview(review, maxScore);
    const comment = commentOf(review.comment);
    if (graded.score === null && comment === '' && Object.keys(graded.comments).length === 0) continue;
    const perQuestion = byQuestion ? ` · ${Object.values(graded.scores).filter((score) => score !== null).length}/${questions.length} preguntas` : '';
    console.log(`${dryRun ? '[dry-run] ' : ''}${nameOf(review)}: ${graded.score === null ? '-' : graded.score} / ${maxScore}${perQuestion}${comment ? ` · ${comment.slice(0, 60)}` : ''}`);
    batch.set(deliverableRef.collection('reviews').doc(review.uid), {
      score: graded.score,
      maxScore,
      comment,
      scores: graded.scores,
      comments: graded.comments,
      reviewedBy,
      reviewedAt: FieldValue.serverTimestamp(),
    });
    count += 1;
  }
  if (!dryRun && count > 0) await batch.commit();
  console.log(`${dryRun ? 'Se escribirían' : 'Escritas'} ${count} revisiones.`);
  process.exit(0);
})().catch((error) => {
  console.error('La importación falló:', error.message);
  process.exit(1);
});
