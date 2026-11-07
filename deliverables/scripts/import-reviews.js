#!/usr/bin/env node
/* Escribe las revisiones (nota y comentario) de una entrega desde el reviews.json que genera
   export-submissions.js, una vez rellenado. Usa la cuenta de servicio de .env.local
   (FIREBASE_SERVICE_ACCOUNT): escribe en Firestore saltándose las reglas, así que revisa el
   archivo antes.

   Uso, desde la raíz del repo:
     node deliverables/scripts/import-reviews.js <id-de-la-entrega> <ruta/reviews.json> --by <uid-del-docente> [--dry-run]

   Cada objeto del JSON: { uid, score, comment }. Los demás campos se ignoran. Un objeto con score
   null y comment vacío no se escribe. --dry-run muestra qué escribiría sin tocar nada. */
const fs = require('fs');
const path = require('path');

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

(async () => {
  const deliverableRef = db.collection('deliverables').doc(deliverableId);
  const deliverableSnapshot = await deliverableRef.get();
  if (!deliverableSnapshot.exists) {
    console.error(`No existe la entrega ${deliverableId}.`);
    process.exit(1);
  }
  const maxScore = Number(deliverableSnapshot.data().maxScore) || 10;
  const reviews = JSON.parse(fs.readFileSync(path.resolve(reviewsPath), 'utf8'));
  if (!Array.isArray(reviews)) {
    console.error('El archivo debe ser un arreglo de objetos { uid, score, comment }.');
    process.exit(1);
  }
  const batch = db.batch();
  let count = 0;
  for (const review of reviews) {
    const score = review.score === null || review.score === undefined || review.score === '' ? null : Number(review.score);
    const comment = typeof review.comment === 'string' ? review.comment.trim() : '';
    if (typeof review.uid !== 'string' || review.uid === '') {
      console.error('Un objeto no tiene uid; se omite.');
      continue;
    }
    if (score === null && comment === '') continue;
    if (score !== null && (Number.isNaN(score) || score < 0 || score > maxScore)) {
      console.error(`Nota fuera de rango para ${review.displayName || review.uid}: ${review.score} (máximo ${maxScore}).`);
      process.exit(1);
    }
    console.log(`${dryRun ? '[dry-run] ' : ''}${review.displayName || review.uid}: ${score === null ? '-' : score} / ${maxScore}${comment ? ` · ${comment.slice(0, 60)}` : ''}`);
    batch.set(deliverableRef.collection('reviews').doc(review.uid), {
      score,
      maxScore,
      comment,
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
