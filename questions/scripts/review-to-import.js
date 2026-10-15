#!/usr/bin/env node
/* Une una exportación fresca del banco con un archivo de revisión y escribe el JSON que lee Import JSON en
   /teacher/questions: cada incorrecta con su `level`, y las propuestas ➕ aceptadas (las que tienen inglés) como
   incorrectas nuevas de nivel 5. Las correctas, los ids de respuesta, enunciados y explicaciones se copian tal cual
   de la exportación: partir siempre de un Export reciente conserva los ids que los exámenes ya usaron.

   Uso, desde la raíz del repo:
     node questions/scripts/review-to-import.js --bank questions/exports/AAAA-MM-DD/questions.json \
       --review questions/reviews/all_questions_AAAA_mes_DD.md --out questions/exports/AAAA-MM-DD/import.json \
       [--default-level 3] [--skip-proposals-without-en]

   Sin --default-level, una incorrecta sin nivel detiene el script (el banco no debe recibir niveles sin revisar;
   el 3 es solo el respaldo de migración). Sin --skip-proposals-without-en, una propuesta sin inglés también lo
   detiene. */
const fs = require('fs');
const path = require('path');
const { parse, normalize } = require('./review-md');

const PROPOSAL_LEVEL = 5;

function readArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) throw new Error(`argumento inesperado: ${argv[i]}`);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) { args[argv[i].slice(2)] = true; continue; }
    args[argv[i].slice(2)] = next;
    i++;
  }
  return args;
}

const args = readArgs(process.argv.slice(2));
if (!args.bank || !args.review || !args.out) {
  console.error('Uso: review-to-import.js --bank <questions.json> --review <revision.md> --out <import.json> [--default-level 3] [--skip-proposals-without-en]');
  process.exit(1);
}
const defaultLevel = args['default-level'] === undefined ? null : Number(args['default-level']);

const bank = JSON.parse(fs.readFileSync(args.bank, 'utf8'));
const review = parse(fs.readFileSync(args.review, 'utf8'));
const errors = [];
let levelsSet = 0;
let defaulted = 0;
let added = 0;
let skippedProposals = 0;

function answerOut(answer, level) {
  const out = { es: answer.es, en: answer.en };
  if (answer.id) out.id = answer.id;
  if (level !== undefined) out.level = level;
  return out;
}

const output = bank.map((question) => {
  const entry = review.get(question.id);
  if (!entry) {
    errors.push(`${question.id}: no está en la revisión`);
    return null;
  }
  const rows = new Map(entry.incorrect.map((row) => [row.text, row]));
  const incorrect = question.incorrect.map((answer) => {
    const row = rows.get(normalize(answer.es));
    let level = row ? row.level : null;
    if (level === null) {
      if (defaultLevel === null) {
        errors.push(`${question.id}: sin nivel para «${answer.es}»${row ? '' : ' (no aparece en la revisión)'}`);
      } else {
        level = defaultLevel;
        defaulted++;
      }
    } else {
      levelsSet++;
    }
    return answerOut(answer, level);
  });
  for (const proposal of entry.proposals) {
    if (!proposal.en) {
      if (args['skip-proposals-without-en']) { skippedProposals++; continue; }
      errors.push(`${question.id}: la propuesta «${proposal.es}» no tiene inglés`);
      continue;
    }
    incorrect.push({ es: proposal.es, en: proposal.en, level: PROPOSAL_LEVEL });
    added++;
  }
  const out = { id: question.id };
  if (question.topic) out.topic = question.topic;
  if (Array.isArray(question.slides) && question.slides.length > 0) out.slides = question.slides;
  out.prompt = question.prompt;
  out.correct = question.correct.map((answer) => answerOut(answer));
  out.incorrect = incorrect;
  if (question.explanation) out.explanation = question.explanation;
  out.retired = Boolean(question.retired);
  return out;
});

for (const id of review.keys()) if (!bank.some((q) => q.id === id)) errors.push(`${id}: está en la revisión pero no en el banco`);

if (errors.length > 0) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problema(s); no se escribió nada.`);
  process.exit(1);
}
fs.mkdirSync(path.dirname(args.out), { recursive: true });
fs.writeFileSync(args.out, JSON.stringify(output, null, 2));
console.log(`${args.out}: ${output.length} preguntas, ${levelsSet} niveles de la revisión, ${defaulted} por defecto, ${added} distractores nuevos, ${skippedProposals} propuestas sin inglés omitidas`);
