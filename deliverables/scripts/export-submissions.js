#!/usr/bin/env node
/* Exporta las entregas de una entrega (colección `deliverables`) a Markdown para corregirlas a
   pedido, en modo solo lectura. Usa la cuenta de servicio de .env.local (FIREBASE_SERVICE_ACCOUNT),
   la misma que las rutas de API de exámenes.

   Uso, desde la raíz del repo:
     node deliverables/scripts/export-submissions.js <id-de-la-entrega> [--out <carpeta>] [--clone]

   Por defecto escribe en deliverables/exports/<fecha>_<título>/ (carpeta ignorada por git: trae datos
   de estudiantes). Para guardar fuera del repo, por ejemplo en Estudiantes/<periodo>/Actividades/,
   pasa --out. Escribe:
     entrega.md             título, tipo, cierre, guía, instrucciones y preguntas
     <estudiante>.md        un archivo por estudiante: respuestas o enlace, hora de guardado, retraso
                            y señales de escritura (solo las de texto)
     reviews.json           plantilla con un objeto por estudiante para rellenar nota y comentario,
                            que lee import-reviews.js
   Con --clone, en las entregas de tipo repo clona cada enlace (sin descargar LFS) en repos/<estudiante>/
   y guarda commits.md con el historial y los diffs de los archivos de texto por commit. */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const projectRequire = require('module').createRequire(path.join(repoRoot, 'package.json'));
projectRequire('@next/env').loadEnvConfig(repoRoot);
const { cert, initializeApp } = projectRequire('firebase-admin/app');
const { getFirestore } = projectRequire('firebase-admin/firestore');

const GRACE_MS = 60_000;
const TEXT_DIFF_PATTERNS = ['*.wwu', '*.wproj', '*.ini', '*.md', '*.txt', '*.json', '*.cpp', '*.h', '*.cs', '.gitignore', '.gitattributes'];

const args = process.argv.slice(2);
const deliverableId = args.find((arg) => !arg.startsWith('--'));
const outIndex = args.indexOf('--out');
const outArg = outIndex === -1 ? null : args[outIndex + 1];
const clone = args.includes('--clone');

if (!deliverableId) {
  console.error('Uso: node deliverables/scripts/export-submissions.js <id-de-la-entrega> [--out <carpeta>] [--clone]');
  process.exit(1);
}
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('Falta FIREBASE_SERVICE_ACCOUNT en .env.local (ver docs/exam.md).');
  process.exit(1);
}
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\r?\n/g, '\\n'));
const db = getFirestore(initializeApp({ credential: cert(serviceAccount) }));

function slug(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase() || 'sin_nombre';
}

function iso(timestamp) {
  return timestamp && typeof timestamp.toDate === 'function' ? timestamp.toDate().toISOString() : null;
}

function millis(timestamp) {
  return timestamp && typeof timestamp.toMillis === 'function' ? timestamp.toMillis() : null;
}

function elapsed(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function deliverableMarkdown(deliverable) {
  const lines = [`# ${deliverable.title}`, ''];
  lines.push(`- Id: ${deliverableId}`);
  lines.push(`- Curso: ${deliverable.courseSlug}`);
  lines.push(`- Rol: ${deliverable.role} · Tipo: ${deliverable.kind} · Nota máxima: ${deliverable.maxScore}`);
  lines.push(`- Abierta: ${iso(deliverable.openedAt) || '-'} · Cierre: ${iso(deliverable.closesAt) || '-'}`);
  if (deliverable.guideUrl) lines.push(`- Guía: ${deliverable.guideUrl}`);
  if (deliverable.instructions) lines.push('', '## Instrucciones', '', deliverable.instructions);
  if (Array.isArray(deliverable.questions) && deliverable.questions.length > 0) {
    lines.push('', '## Preguntas', '');
    deliverable.questions.forEach((question, index) => {
      const limit = question.maxChars ? ` (máx. ${question.maxChars} caracteres)` : '';
      lines.push(`${index + 1}. ${question.text}${limit}`);
    });
  }
  return lines.join('\n') + '\n';
}

function signalsMarkdown(typing, questions) {
  if (!typing) return ['', '## Señales de escritura', '', 'No se registró escritura.'];
  const lines = ['', '## Señales de escritura', ''];
  lines.push(`- Intentos de pegar: ${typing.pasteAttempts || 0} · de soltar: ${typing.dropAttempts || 0}`);
  lines.push(`- Saltos de 20+ caracteres: ${(typing.jumps || []).length} · Pérdidas de foco: ${typing.focusLosses || 0}`);
  lines.push(`- Velocidad máxima: ${Math.round(typing.maxCharsPerMinute || 0)} caracteres/min`);
  lines.push(`- Tiempo escribiendo: ${elapsed(typing.activeSeconds || 0)} · en la página: ${elapsed(typing.elapsedSeconds || 0)}`);
  for (const jump of typing.jumps || []) {
    const number = questions.findIndex((question) => question.id === jump.questionId) + 1;
    lines.push(`  - Salto de ${jump.chars} caracteres a los ${elapsed(jump.atSeconds)} en la pregunta ${number || '?'}`);
  }
  return lines;
}

function submissionMarkdown(deliverable, submission) {
  const name = submission.displayName || submission.email || submission.uid;
  const savedAtMs = millis(submission.savedAt);
  const closesAtMs = millis(deliverable.closesAt);
  const late = savedAtMs !== null && closesAtMs !== null && savedAtMs > closesAtMs + GRACE_MS;
  const lines = [`# ${name}`, ''];
  lines.push(`- Correo: ${submission.email || '-'} · uid: ${submission.uid}`);
  lines.push(`- Guardado: ${iso(submission.savedAt) || '-'}${late ? ` · TARDÍO (${elapsed((savedAtMs - closesAtMs) / 1000)} después del cierre)` : ''}`);
  const questions = Array.isArray(deliverable.questions) ? deliverable.questions : [];
  if (deliverable.kind === 'text') {
    questions.forEach((question, index) => {
      const answer = (submission.answers || {})[question.id] || '';
      lines.push('', `## ${index + 1}. ${question.text}`, '', answer.trim() === '' ? '_Sin respuesta_' : answer);
    });
    lines.push(...signalsMarkdown(submission.typing, questions));
  } else {
    lines.push('', '## Enlace', '', submission.url || '_Sin enlace_');
  }
  return lines.join('\n') + '\n';
}

function cloneRepo(url, targetDir) {
  const parsed = new URL(url);
  const segments = parsed.pathname.split('/').filter(Boolean);
  // gitlab.com/<grupo>/<repo>/-/tree/<rama>  ·  github.com/<usuario>/<repo>/tree/<rama>
  const treeIndex = segments.findIndex((segment, index) => segment === 'tree' && index >= 2);
  const repoSegments = treeIndex === -1 ? segments : segments.slice(0, treeIndex).filter((segment) => segment !== '-');
  const branch = treeIndex === -1 ? null : decodeURIComponent(segments.slice(treeIndex + 1).join('/'));
  const repoUrl = `${parsed.origin}/${repoSegments.join('/')}.git`;
  const cloneArgs = ['clone', '--quiet'];
  if (branch) cloneArgs.push('--branch', branch);
  cloneArgs.push(repoUrl, targetDir);
  execFileSync('git', cloneArgs, { stdio: 'inherit', env: { ...process.env, GIT_LFS_SKIP_SMUDGE: '1' } });
  return { repoUrl, branch };
}

function commitsMarkdown(repoDir, repoUrl, branch) {
  const git = (...gitArgs) => execFileSync('git', ['-C', repoDir, ...gitArgs], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const lines = [`# Commits de ${repoUrl}${branch ? ` · rama ${branch}` : ''}`, '', '```', git('log', '--date=iso', '--stat', '--reverse').trim(), '```', ''];
  const hashes = git('rev-list', '--reverse', 'HEAD').trim().split('\n').filter(Boolean);
  for (const hash of hashes) {
    const header = git('show', '--no-patch', '--date=iso', '--format=%h · %ad · %an · %s', hash).trim();
    const diff = git('show', '--format=', '--patch', hash, '--', ...TEXT_DIFF_PATTERNS).trim();
    lines.push(`## ${header}`, '');
    lines.push(diff === '' ? '_Sin cambios en archivos de texto._' : '```diff\n' + diff + '\n```', '');
  }
  return lines.join('\n');
}

(async () => {
  const deliverableSnapshot = await db.collection('deliverables').doc(deliverableId).get();
  if (!deliverableSnapshot.exists) {
    console.error(`No existe la entrega ${deliverableId}.`);
    process.exit(1);
  }
  const deliverable = deliverableSnapshot.data();
  const submissionsSnapshot = await db.collection('deliverables').doc(deliverableId).collection('submissions').get();
  const reviewsSnapshot = await db.collection('deliverables').doc(deliverableId).collection('reviews').get();
  const reviews = new Map(reviewsSnapshot.docs.map((doc) => [doc.id, doc.data()]));
  const today = new Date().toISOString().slice(0, 10);
  const outDir = path.resolve(outArg || path.join(repoRoot, 'deliverables', 'exports', `${today}_${slug(deliverable.title)}`));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'entrega.md'), deliverableMarkdown(deliverable));

  const template = [];
  const usedNames = new Set();
  for (const doc of submissionsSnapshot.docs) {
    const submission = { uid: doc.id, ...doc.data() };
    let fileName = slug(submission.displayName || submission.email || submission.uid);
    while (usedNames.has(fileName)) fileName += '_';
    usedNames.add(fileName);
    fs.writeFileSync(path.join(outDir, `${fileName}.md`), submissionMarkdown(deliverable, submission));
    const review = reviews.get(doc.id) || {};
    template.push({
      uid: submission.uid,
      displayName: submission.displayName || '',
      email: submission.email || '',
      score: typeof review.score === 'number' ? review.score : null,
      comment: review.comment || '',
    });
    if (clone && deliverable.kind === 'repo' && submission.url) {
      const repoDir = path.join(outDir, 'repos', fileName);
      try {
        const { repoUrl, branch } = cloneRepo(submission.url, repoDir);
        fs.writeFileSync(path.join(outDir, `${fileName}.commits.md`), commitsMarkdown(repoDir, repoUrl, branch));
      } catch (error) {
        console.error(`No se pudo clonar ${submission.url}: ${error.message}`);
      }
    }
  }
  fs.writeFileSync(path.join(outDir, 'reviews.json'), JSON.stringify(template, null, 2) + '\n');
  console.log(`${outDir}: ${submissionsSnapshot.size} entregas, ${reviews.size} ya revisadas`);
  process.exit(0);
})().catch((error) => {
  console.error('La exportación falló:', error.message);
  process.exit(1);
});
