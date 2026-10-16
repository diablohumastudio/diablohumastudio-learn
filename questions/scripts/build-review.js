#!/usr/bin/env node
/* Genera un archivo de revisión (Markdown) a partir de una exportación del banco.

   Uso, desde la raíz del repo:
     node questions/scripts/build-review.js --bank questions/exports/AAAA-MM-DD/questions.json \
       --out questions/reviews/all_questions_AAAA_mes_DD.md \
       [--from questions/reviews/revision-anterior.md]… [--findings hallazgos.md] \
       [--title "Título"] [--source "de dónde salió el banco"]

   --from arrastra de una revisión anterior los niveles (cuando el banco todavía no los trae), los motivos, las
   propuestas ➕ y las notas de cada pregunta, uniendo por id y por el texto de la incorrecta. Se puede repetir
   (la ronda anterior y la revisión de un set nuevo, por ejemplo): si una pregunta está en varios archivos manda
   el último. Las respuestas que ya traen `level` en el banco mandan sobre lo arrastrado. --findings inserta un
   Markdown con los hallazgos de la revisión después de la sección de propuestas. */
const fs = require('fs');
const path = require('path');
const { parse, render } = require('./review-md');

const REPEATABLE_ARGS = new Set(['from']);

function readArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) throw new Error(`argumento inesperado: ${argv[i]}`);
    const key = argv[i].slice(2);
    const value = argv[i + 1];
    if (REPEATABLE_ARGS.has(key)) (args[key] = args[key] || []).push(value);
    else args[key] = value;
    i++;
  }
  return args;
}

function carriedEntries(files) {
  const entries = new Map();
  for (const file of files) {
    for (const [id, entry] of parse(fs.readFileSync(file, 'utf8'))) entries.set(id, entry);
  }
  return entries;
}

const args = readArgs(process.argv.slice(2));
if (!args.bank || !args.out) {
  console.error('Uso: build-review.js --bank <questions.json> --out <revision.md> [--from <revision-anterior.md>]… [--findings <hallazgos.md>] [--title …] [--source …]');
  process.exit(1);
}

const bank = JSON.parse(fs.readFileSync(args.bank, 'utf8'));
const fromFiles = args.from || [];
const entries = carriedEntries(fromFiles);
const fromText = fromFiles.map((file) => path.relative(process.cwd(), file)).join(' y ');
const header = {
  title: args.title || 'Revisión del banco de preguntas',
  source: args.source || `la exportación ${path.relative(process.cwd(), args.bank)}${fromFiles.length > 0 ? `, con niveles, propuestas y notas arrastrados de ${fromText}` : ''}`,
  findings: args.findings ? fs.readFileSync(args.findings, 'utf8') : '',
};
const { markdown, stats } = render(bank, entries, header);
fs.mkdirSync(path.dirname(args.out), { recursive: true });
fs.writeFileSync(args.out, markdown);
console.log(`${args.out}: ${stats.questions} preguntas, modo difícil ${stats.hard}/${stats.active} (con propuestas ${stats.hardWithProposals}), ${stats.proposals} propuestas, ${stats.notes} notas, ${stats.unrated} incorrectas sin nivel`);
