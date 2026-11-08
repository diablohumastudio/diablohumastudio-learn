#!/usr/bin/env node
/* Pone `forEveryone: true` y `assignedUids: []` en los deberes, exámenes y entregas que se
   guardaron antes de que existieran esos campos (docs/courses.md). Las reglas tratan un documento
   sin ellos como «para todos», pero las consultas de los estudiantes preguntan por los campos y
   no lo encontrarían. Se corre una vez, con la cuenta de servicio de .env.local
   (FIREBASE_SERVICE_ACCOUNT), desde la raíz del repo:
     node firebase/scripts/add-assignment-fields.js [--dry-run] */
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const projectRequire = require('module').createRequire(path.join(repoRoot, 'package.json'));
projectRequire('@next/env').loadEnvConfig(repoRoot);
const { cert, initializeApp } = projectRequire('firebase-admin/app');
const { getFirestore } = projectRequire('firebase-admin/firestore');

const COLLECTIONS = ['homeworks', 'exams', 'deliverables'];
const BATCH_LIMIT = 400;

const dryRun = process.argv.includes('--dry-run');

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('Falta FIREBASE_SERVICE_ACCOUNT en .env.local (ver docs/exam.md).');
  process.exit(1);
}
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\r?\n/g, '\\n'));
const db = getFirestore(initializeApp({ credential: cert(serviceAccount) }));

(async () => {
  let pending = [];
  let total = 0;
  for (const name of COLLECTIONS) {
    const snapshot = await db.collection(name).get();
    const missing = snapshot.docs.filter((doc) => typeof doc.get('forEveryone') !== 'boolean');
    console.log(`${name}: ${snapshot.size} documentos, ${missing.length} sin campos de asignación`);
    for (const doc of missing) {
      console.log(`  ${dryRun ? '[dry-run] ' : ''}${name}/${doc.id} · ${doc.get('title') || '(sin título)'}`);
      pending.push(doc.ref);
    }
  }
  while (pending.length > 0) {
    const chunk = pending.slice(0, BATCH_LIMIT);
    pending = pending.slice(BATCH_LIMIT);
    if (!dryRun) {
      const batch = db.batch();
      for (const ref of chunk) batch.update(ref, { forEveryone: true, assignedUids: [] });
      await batch.commit();
    }
    total += chunk.length;
  }
  console.log(`${dryRun ? 'Se actualizarían' : 'Actualizados'} ${total} documentos.`);
  process.exit(0);
})().catch((error) => {
  console.error('La migración falló:', error.message);
  process.exit(1);
});
