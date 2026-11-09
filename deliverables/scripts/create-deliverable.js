#!/usr/bin/env node
/* Crea una entrega (colección `deliverables`) como borrador a partir de un JSON, para no teclear
   las preguntas en el formulario. Usa la cuenta de servicio de .env.local (FIREBASE_SERVICE_ACCOUNT)
   y escribe saltándose las reglas. El borrador no lo ve ningún estudiante: el docente lo abre desde
   su página, /teacher/deliverable/<id>, con el botón Abrir, como uno creado en el formulario.

   Uso, desde la raíz del repo:
     node deliverables/scripts/create-deliverable.js <ruta/entrega.json> [--dry-run]

   El JSON lleva los campos del formulario; los que falten toman el valor por defecto:
     {
       "title": "Lección · Game Syncs",
       "courseSlug": "wwise-unreal",
       "role": "exam",                       "homework" | "exam"; dónde se lista
       "kind": "text",                       "text" | "repo" | "docLink"; qué entrega el estudiante
       "guideUrl": "",                       enlace a la guía, o vacío
       "instructions": "",                   texto sobre el formulario, o vacío
       "questions": [                        solo kind text; cada una recibe su id al crearse
         { "text": "¿…?", "points": 1.5, "maxChars": null }
       ],
       "maxScore": 10,                       solo kinds de enlace; en texto es la suma de los puntos
       "durationMinutes": 30,                rol exam: minutos desde que se abre
       "deadline": "2026-11-15T23:59",       rol homework: cierre en hora local, o null
       "assignedUids": []                    vacío: para todos los inscritos en el curso
     } */
const fs = require('fs');
const path = require('path');
const { roundScore } = require('./scoring');

const repoRoot = path.resolve(__dirname, '..', '..');
const projectRequire = require('module').createRequire(path.join(repoRoot, 'package.json'));
projectRequire('@next/env').loadEnvConfig(repoRoot);
const { cert, initializeApp } = projectRequire('firebase-admin/app');
const { FieldValue, Timestamp, getFirestore } = projectRequire('firebase-admin/firestore');

const ROLES = ['homework', 'exam'];
const KINDS = ['text', 'repo', 'docLink'];
const DEFAULT_MAX_SCORE = 10;
const DEFAULT_QUESTION_POINTS = 1;
const DEFAULT_DURATION_MINUTES = 90;
const QUESTION_ID_LENGTH = 6;

const args = process.argv.slice(2);
const jsonPath = args.find((arg) => !arg.startsWith('--'));
const dryRun = args.includes('--dry-run');

if (!jsonPath) {
  console.error('Uso: node deliverables/scripts/create-deliverable.js <ruta/entrega.json> [--dry-run]');
  process.exit(1);
}
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('Falta FIREBASE_SERVICE_ACCOUNT en .env.local (ver docs/exam.md).');
  process.exit(1);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

/* El mismo id opaco que da el formulario (newQuestionId en src/data/deliverable/types.ts). */
function newQuestionId() {
  return Array.from({ length: QUESTION_ID_LENGTH }, () => Math.floor(Math.random() * 36).toString(36)).join('');
}

function textOf(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPositive(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function questionsOf(input) {
  if (input.kind !== 'text') return [];
  const stored = Array.isArray(input.questions) ? input.questions : [];
  if (stored.length === 0) fail('Una entrega de texto necesita al menos una pregunta.');
  return stored.map((question, index) => {
    const text = textOf(question && question.text);
    if (text === '') fail(`La pregunta ${index + 1} no tiene texto.`);
    const points = question.points === undefined ? DEFAULT_QUESTION_POINTS : question.points;
    if (!isPositive(points)) fail(`La pregunta ${index + 1} necesita puntos mayores que cero.`);
    const maxChars = question.maxChars === undefined || question.maxChars === null ? null : question.maxChars;
    if (maxChars !== null && !(Number.isInteger(maxChars) && maxChars > 0)) {
      fail(`El límite de caracteres de la pregunta ${index + 1} debe ser un entero mayor que cero, o null.`);
    }
    return { id: newQuestionId(), text, maxChars, points };
  });
}

function deadlineOf(input) {
  if (input.role !== 'homework' || input.deadline === undefined || input.deadline === null) return null;
  const ms = new Date(input.deadline).getTime();
  if (Number.isNaN(ms)) fail(`El cierre no es una fecha válida: ${input.deadline}`);
  return Timestamp.fromMillis(ms);
}

/* Los mismos campos y valores por defecto que guarda el formulario (toStoredSettings en
   src/components/deliverable/deliverables.ts), más el estado de borrador. */
function documentOf(input) {
  const title = textOf(input.title);
  const courseSlug = textOf(input.courseSlug);
  if (title === '') fail('Falta el título.');
  if (courseSlug === '') fail('Falta courseSlug.');
  if (!ROLES.includes(input.role)) fail(`role debe ser uno de: ${ROLES.join(', ')}.`);
  if (!KINDS.includes(input.kind)) fail(`kind debe ser uno de: ${KINDS.join(', ')}.`);
  const guideUrl = textOf(input.guideUrl);
  if (guideUrl !== '' && !/^https?:\/\//.test(guideUrl)) fail('guideUrl debe ser una dirección https completa, o vacío.');
  const questions = questionsOf(input);
  const maxScore = input.kind === 'text' ? roundScore(questions.reduce((sum, question) => sum + question.points, 0)) : input.maxScore ?? DEFAULT_MAX_SCORE;
  if (!isPositive(maxScore)) fail('La nota máxima debe ser mayor que cero.');
  const durationMinutes = input.durationMinutes ?? DEFAULT_DURATION_MINUTES;
  if (!(Number.isInteger(durationMinutes) && durationMinutes > 0)) fail('durationMinutes debe ser un entero mayor que cero.');
  const assignedUids = Array.isArray(input.assignedUids) ? input.assignedUids.filter((uid) => typeof uid === 'string') : [];
  return {
    title,
    courseSlug,
    role: input.role,
    kind: input.kind,
    guideUrl,
    instructions: textOf(input.instructions),
    questions,
    maxScore,
    durationMinutes,
    deadline: deadlineOf(input),
    assignedUids,
    forEveryone: assignedUids.length === 0,
    status: 'draft',
    createdAt: FieldValue.serverTimestamp(),
  };
}

(async () => {
  const input = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const document = documentOf(input);
  console.log(`${document.role === 'exam' ? 'Lección' : 'Deber'} de entrega «${document.title}» · ${document.courseSlug} · ${document.kind}`);
  document.questions.forEach((question, index) => console.log(`  ${index + 1}. (${question.points} pts) ${question.text}`));
  console.log(`  Nota máxima ${document.maxScore}${document.role === 'exam' ? ` · ${document.durationMinutes} minutos` : ''}`);
  if (dryRun) {
    console.log('[dry-run] No se escribió nada.');
    process.exit(0);
  }
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\r?\n/g, '\\n'));
  const db = getFirestore(initializeApp({ credential: cert(serviceAccount) }));
  const created = await db.collection('deliverables').add(document);
  console.log(`Borrador creado: deliverables/${created.id} → /teacher/deliverable/${created.id}`);
  process.exit(0);
})().catch((error) => {
  console.error('No se pudo crear la entrega:', error.message);
  process.exit(1);
});
