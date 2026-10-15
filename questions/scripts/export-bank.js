#!/usr/bin/env node
/* Exporta el banco de preguntas en vivo (Firestore) a JSON, en modo solo lectura.
   Nunca escribe en Firestore. Usa la cuenta de servicio de .env.local (FIREBASE_SERVICE_ACCOUNT),
   la misma que las rutas de API de exámenes.

   Uso, desde la raíz del repo:
     node questions/scripts/export-bank.js [carpeta-de-salida]
   Por defecto escribe en questions/exports/AAAA-MM-DD/ (carpeta ignorada por git: trae las respuestas correctas):
     questions.json          la colección `questions`, ordenada por id
     examQuestions.json      la colección `examQuestions` (banco solo para exámenes)
     questions.compact.txt   vista legible en español para revisar a ojo */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const projectRequire = require('module').createRequire(path.join(repoRoot, 'package.json'));
projectRequire('@next/env').loadEnvConfig(repoRoot);
const { cert, initializeApp } = projectRequire('firebase-admin/app');
const { getFirestore } = projectRequire('firebase-admin/firestore');

const today = new Date().toISOString().slice(0, 10);
const outDir = path.resolve(process.argv[2] || path.join(repoRoot, 'questions', 'exports', today));

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('Falta FIREBASE_SERVICE_ACCOUNT en .env.local (ver docs/exam.md).');
  process.exit(1);
}
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\r?\n/g, '\\n'));
const db = getFirestore(initializeApp({ credential: cert(serviceAccount) }));

function byId(a, b) {
  return a.id.localeCompare(b.id, undefined, { numeric: true });
}

async function readCollection(name) {
  const snapshot = await db.collection(name).get();
  return snapshot.docs
    .map((doc) => {
      const data = doc.data();
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') data.updatedAt = data.updatedAt.toDate().toISOString();
      return { id: doc.id, ...data };
    })
    .sort(byId);
}

function compact(questions, title) {
  const lines = [`=== ${title} (${questions.length})`];
  for (const q of questions) {
    const slides = Array.isArray(q.slides) ? q.slides.join(',') : '';
    lines.push('', `#${q.id} | ${q.topic || '-'} | ${slides}${q.retired ? ' | RETIRADA' : ''}`);
    lines.push(`P: ${q.prompt?.es}`);
    for (const c of q.correct || []) lines.push(`  + ${c.es}`);
    for (const w of q.incorrect || []) lines.push(`  - ${w.level ? `[${w.level}] ` : ''}${w.es}`);
    if (q.explanation) lines.push(`  E: ${q.explanation.es}`);
  }
  return lines.join('\n');
}

(async () => {
  const questions = await readCollection('questions');
  const examQuestions = await readCollection('examQuestions');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'questions.json'), JSON.stringify(questions, null, 2));
  fs.writeFileSync(path.join(outDir, 'examQuestions.json'), JSON.stringify(examQuestions, null, 2));
  fs.writeFileSync(
    path.join(outDir, 'questions.compact.txt'),
    compact(questions, 'questions') + '\n\n' + compact(examQuestions, 'examQuestions') + '\n',
  );
  const retired = questions.filter((q) => q.retired).length;
  console.log(`${outDir}: ${questions.length} preguntas (${retired} retiradas), ${examQuestions.length} solo examen`);
  process.exit(0);
})().catch((error) => {
  console.error('La exportación falló:', error.message);
  process.exit(1);
});
