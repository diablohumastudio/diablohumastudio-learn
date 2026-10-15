/* Formato del archivo de revisión (questions/reviews/*.md) y las dos operaciones sobre él:
   renderizarlo desde el banco y leerlo de vuelta. Lo usan build-review.js y review-to-import.js.

   Bloque de una pregunta, tal como lo escribe render() y lo lee parse():

     ### wu-wo-012 · estructura
     **Pregunta:** …
     **Correcta:** …                         (o **Correctas (n):** con una lista)
     | Nivel | Incorrecta | Por qué |
     | 5 | texto de la incorrecta | motivo |  una fila por respuesta incorrecta, en el orden del banco
     **Modo difícil:** …
     **Propuestas de nivel 5**
     - ➕ «texto en español» · en: «text in English» — por qué sería un 5   (el « · en: … » es opcional al revisar,
                                                                           obligatorio para importar)
     - ✋ por qué no se propone (o no se propone otra)
     > *Nota:* observación sobre la pregunta (gramática, fuente, veracidad, ambigüedad)

   Al revisar se puede cambiar el número de nivel, editar o borrar propuestas ➕ y añadir notas.
   No cambiar el texto de la columna Incorrecta: es la llave con la que se vuelve a unir al banco. */
const HARD_MODE_MIN_LEVEL5 = 3;
const HARD_LEVEL = 5;
const LEVEL_NAMES = { 5: 'Casi correcta', 3: 'Plausible', 1: 'Descartable' };

function normalize(text) {
  return String(text).replace(/\\\|/g, '|').replace(/\s+/g, ' ').trim();
}

function cell(text) {
  return String(text).replace(/\|/g, '\\|');
}

function splitRow(line) {
  const cells = [];
  let current = '';
  for (let i = 1; i < line.length; i++) {
    const char = line[i];
    if (char === '\\' && line[i + 1] === '|') { current += '|'; i++; continue; }
    if (char === '|') { cells.push(current.trim()); current = ''; continue; }
    current += char;
  }
  return cells;
}

/** Lee un archivo de revisión. Devuelve Map id → { incorrect: [{ level, text, reason }], proposals: [{ es, en, reason }],
    noProposal: [string], notes: [string] }. El nivel es null cuando la celda no es un número. */
function parse(markdown) {
  const questions = new Map();
  let current = null;
  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trimEnd();
    let match;
    if ((match = line.match(/^### (\S+)/))) {
      current = { incorrect: [], proposals: [], noProposal: [], notes: [] };
      questions.set(match[1], current);
      continue;
    }
    if (!current) continue;
    if (/^\|/.test(line) && !/^\|\s*Nivel\s*\|/.test(line) && !/^\|\s*:?-+:?\s*\|/.test(line)) {
      const cells = splitRow(line);
      if (cells.length >= 3) {
        const level = /^[1-5]$/.test(cells[0]) ? Number(cells[0]) : null;
        current.incorrect.push({ level, text: normalize(cells[1]), reason: cells[2] });
      }
      continue;
    }
    if ((match = line.match(/^- ➕ «(.+?)»(?: · en: «(.+?)»)? — (.+)$/))) {
      current.proposals.push({ es: match[1].trim(), en: match[2] ? match[2].trim() : null, reason: match[3].trim() });
      continue;
    }
    if ((match = line.match(/^- ✋ (.+)$/))) { current.noProposal.push(match[1].trim()); continue; }
    if ((match = line.match(/^> \*Nota:\* (.+)$/))) { current.notes.push(match[1].trim()); continue; }
  }
  return questions;
}

function countLevels(levels) {
  const counts = { 5: 0, 3: 0, 1: 0, other: 0, missing: 0 };
  for (const level of levels) {
    if (level === null) counts.missing++;
    else if (counts[level] !== undefined) counts[level]++;
    else counts.other++;
  }
  return counts;
}

function missingText(missing) {
  return `falta${missing === 1 ? '' : 'n'} ${missing}`;
}

function hardModeLine(question, counts, proposals) {
  if (question.retired) return '**Modo difícil:** no aplica (pregunta retirada)';
  const missing = HARD_MODE_MIN_LEVEL5 - counts[5];
  if (missing <= 0) return `**Modo difícil:** ✅ entra (${counts[5]} de nivel 5)`;
  const withProposals = counts[5] + proposals;
  const tail = proposals === 0 ? '' : withProposals >= HARD_MODE_MIN_LEVEL5
    ? ` · con las propuestas entraría (${withProposals})`
    : ` · con las propuestas seguiría fuera (${withProposals})`;
  return `**Modo difícil:** ❌ no entra (${counts[5]} de nivel 5, ${missingText(missing)})${tail}`;
}

function scaleTable() {
  return [
    '| Nivel | Nombre | Criterio |',
    '|:---:|---|---|',
    `| 5 | ${LEVEL_NAMES[5]} | Del mismo tipo que la respuesta correcta y además un elemento parecido o cercano a ella: la hermana con la que se confunde, la misma afirmación con un detalle cambiado, o su inversa. |`,
    `| 3 | ${LEVEL_NAMES[3]} | Del tema pero de otra categoría, o del mismo tipo que la correcta pero un elemento que no se le parece. |`,
    `| 1 | ${LEVEL_NAMES[1]} | Fuera de tema, absurda o descartable con sentido común, sin haber visto la clase. |`,
  ].join('\n');
}

/** Escribe el archivo de revisión. `entries` es un Map id → el mismo objeto que devuelve parse() (puede venir vacío
    o parcial); los niveles se toman primero de la respuesta del banco (`level`) y si no, de la entrada previa con el
    mismo texto. `header.source` describe de dónde salió el banco; `header.findings` es Markdown libre para los
    hallazgos de la revisión. */
function render(bank, entries, header) {
  const byTopic = new Map();
  for (const question of bank) {
    const topic = question.topic || '(sin clase)';
    if (!byTopic.has(topic)) byTopic.set(topic, []);
    byTopic.get(topic).push(question);
  }
  const summaryRows = [];
  const sections = [];
  let hardCount = 0;
  let hardWithProposals = 0;
  let activeCount = 0;
  let proposalCount = 0;
  let noteCount = 0;
  let questionsWithNotes = 0;
  let unrated = 0;

  for (const [topic, topicQuestions] of byTopic) {
    const blocks = [];
    for (const question of topicQuestions) {
      const entry = entries.get(question.id) || { incorrect: [], proposals: [], noProposal: [], notes: [] };
      const previous = new Map(entry.incorrect.map((row) => [row.text, row]));
      const rows = question.incorrect.map((answer) => {
        const carried = previous.get(normalize(answer.es));
        const level = Number.isInteger(answer.level) ? answer.level : carried ? carried.level : null;
        if (level === null) unrated++;
        return { level, text: answer.es, reason: carried ? carried.reason : '' };
      });
      const counts = countLevels(rows.map((row) => row.level));
      const proposals = entry.proposals.length;
      proposalCount += proposals;
      noteCount += entry.notes.length;
      if (entry.notes.length > 0) questionsWithNotes++;
      if (!question.retired) {
        activeCount++;
        if (counts[5] >= HARD_MODE_MIN_LEVEL5) hardCount++;
        if (counts[5] + proposals >= HARD_MODE_MIN_LEVEL5) hardWithProposals++;
      }
      const slides = (question.slides || []).join(', ');
      const correctLabel = question.correct.length === 1 ? '**Correcta:**' : `**Correctas (${question.correct.length}):**`;
      const correctText = question.correct.length === 1
        ? question.correct[0].es
        : '\n' + question.correct.map((answer) => `- ${answer.es}`).join('\n');
      const lines = [
        `### ${question.id}${slides ? ' · ' + slides : ''}${question.retired ? ' · RETIRADA' : ''}`,
        '',
        `**Pregunta:** ${question.prompt.es}`,
        '',
        `${correctLabel} ${correctText}`,
        '',
        '| Nivel | Incorrecta | Por qué |',
        '|:---:|---|---|',
        ...rows.map((row) => `| ${row.level === null ? '?' : row.level} | ${cell(row.text)} | ${cell(row.reason)} |`),
        '',
        hardModeLine(question, counts, proposals),
      ];
      if (proposals > 0 || entry.noProposal.length > 0) {
        lines.push('', `**Propuestas de nivel 5${proposals === 0 ? ': ninguna' : ''}**`);
        for (const proposal of entry.proposals) {
          const english = proposal.en ? ` · en: «${proposal.en}»` : '';
          lines.push(`- ➕ «${proposal.es}»${english} — ${proposal.reason}`);
        }
        for (const reason of entry.noProposal) lines.push(`- ✋ ${reason}`);
      }
      for (const note of entry.notes) lines.push('', `> *Nota:* ${note}`);
      blocks.push(lines.join('\n'));
      const hard = question.retired ? 'retirada' : counts[5] >= HARD_MODE_MIN_LEVEL5 ? '✅' : `❌ ${missingText(HARD_MODE_MIN_LEVEL5 - counts[5])}`;
      const hardAfter = question.retired ? '—' : counts[5] + proposals >= HARD_MODE_MIN_LEVEL5 ? '✅' : '❌';
      const notes = entry.notes.length === 0 ? '🟢 0' : `🔴 ${entry.notes.length}`;
      summaryRows.push(`| ${question.id} | ${topic} | ${counts[5]} | ${counts[3]} | ${counts[1]} | ${hard} | ${proposals} | ${hardAfter} | ${notes} |`);
    }
    sections.push(`## ${topic} (${topicQuestions.length})\n\n${blocks.join('\n\n')}`);
  }

  const retired = bank.filter((q) => q.retired).length;
  const unratedLine = unrated === 0 ? '' : `\n\n**Sin nivel:** ${unrated} respuestas incorrectas aparecen con «?» en la columna Nivel; hay que calificarlas antes de importar.`;
  const intro = `# ${header.title}

Fuente: ${header.source}. ${bank.length} preguntas, ${retired} retirada${retired === 1 ? '' : 's'}. Nada de esto está escrito en el banco: es un documento de revisión; cómo se usa está en questions/README.md.

Cada respuesta incorrecta lleva su nivel y el motivo. Los niveles son 1, 3 y 5 (escala pensada para 5, con 2 y 4 libres para afinar después).

## Escala

${scaleTable()}

**Modo difícil:** una pregunta entra solo si tiene al menos ${HARD_MODE_MIN_LEVEL5} distractores de nivel ${HARD_LEVEL}; si no, se excluye (no se rellena con niveles menores). Entran **${hardCount} de ${activeCount}** preguntas activas; con las propuestas de distractores nuevos entrarían **${hardWithProposals} de ${activeCount}**.${unratedLine}

## Propuestas de distractores nuevos

Donde faltan distractores de nivel 5 hay una lista **Propuestas de nivel 5** con el texto propuesto (➕) y por qué sería un 5. Antes de importar, cada propuesta aceptada necesita su versión en inglés (« · en: «…»»). Donde una propuesta sería forzada, o defendible como correcta, no se propone y se explica (✋). En total: ${proposalCount} propuestas.
${header.findings ? '\n' + header.findings.trim() + '\n' : ''}
## Cómo revisar

- Cambia el número de la columna **Nivel** donde no estés de acuerdo; el motivo es solo la justificación de la propuesta.
- Marca las propuestas ➕ que aceptas añadiendo su inglés; las que no, bórralas. No cambies el texto de la columna **Incorrecta**: es la llave para volver a unir la revisión con el banco.
- Las líneas *Nota* son observaciones sobre la pregunta misma (${noteCount} notas en ${questionsWithNotes} preguntas); los cambios a los enunciados se hacen en el editor, no aquí.
- Las preguntas con varias respuestas correctas muestran todas; el nivel se asigna a la incorrecta en relación con cualquiera de ellas.

## Resumen

La columna **Notas** marca la prioridad de revisión: 🔴 tiene observaciones sobre la pregunta misma (gramática, fuente, veracidad o ambigüedad); 🟢 no tiene ninguna.

| Pregunta | Clase | Nivel 5 | Nivel 3 | Nivel 1 | Modo difícil | Propuestas | Con propuestas | Notas |
|---|---|:---:|:---:|:---:|---|:---:|:---:|:---:|
${summaryRows.join('\n')}
`;
  const stats = { questions: bank.length, active: activeCount, hard: hardCount, hardWithProposals, proposals: proposalCount, notes: noteCount, unrated };
  return { markdown: intro + '\n' + sections.join('\n\n') + '\n', stats };
}

module.exports = { parse, render, normalize, HARD_MODE_MIN_LEVEL5, HARD_LEVEL };
