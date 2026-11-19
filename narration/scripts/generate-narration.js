#!/usr/bin/env node
/* Genera la voz de una clase con ElevenLabs: un mp3 por paso y el segundo en que la
   voz llega a cada marca `[n]` del texto, que es cuando entra el turno n de ese paso.
   Usa ELEVENLABS_API_KEY de .env.local. ElevenLabs cobra por carácter, no por
   petición: un audio por paso cuesta lo mismo que uno solo para toda la clase.

   Uso, desde la raíz del repo:
     node narration/scripts/generate-narration.js <curso> <clase> [--lang es|en] [--only paso1,paso2] [--provider elevenlabs|say|web] [--dry-run]
     node narration/scripts/generate-narration.js <curso> <clase> [--lang es|en] --web-script

   `--provider web` no pide nada: corta por pasos los audios hechos a mano en la web
   de ElevenLabs, que es la forma de usar una voz de su biblioteca sin plan de pago.
   `--web-script` escribe el texto para pegar ahí, narration/para-elevenlabs/<clase>/
   <idioma>-<n>.txt, en partes, con una pausa `<break time="2s" />` entre paso y paso;
   el audio de cada parte se guarda al lado con el mismo nombre y `.mp3`. Los pasos se
   separan por esas pausas largas. La web no da el tiempo de cada letra: se estima
   repartiendo el tiempo hablado entre las letras y anclando cada pausa del audio al
   signo de puntuación más cercano, así que las marcas son aproximadas.

   `--provider say` usa la voz del sistema de macOS (comando `say`, más ffmpeg): no
   gasta nada y sirve de voz provisional para probar los pasos y las marcas antes de
   pedir la voz definitiva. Sus marcas son aproximadas: se miden sintetizando el
   texto hasta cada marca.

   Lee   src/presentations/<curso>/<clase>.narracion.json   { es: { <paso>: texto }, en: { … } }
         narration/voices.json                              modelo y voz por idioma
   Escribe
         public/assets/presentations/<curso>/narracion/<clase>/<idioma>/<paso>.mp3
         narration/alignments/<curso>/<clase>/<idioma>/<paso>.json   tiempo de cada letra
         src/presentations/<curso>/<clase>.narracion-tiempos.json    duración y marcas, lo que lee la plataforma

   Solo pide a ElevenLabs los pasos cuyo texto hablado, voz o modelo cambiaron. Mover
   una marca `[n]` no cambia el texto hablado: los tiempos se recalculan con la
   alineación guardada, sin gastar caracteres. `--dry-run` no llama a ElevenLabs y
   dice cuántos caracteres costaría. */
const { execFileSync, spawnSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const projectRequire = require('module').createRequire(path.join(repoRoot, 'package.json'));
projectRequire('@next/env').loadEnvConfig(repoRoot);

const API_BASE = 'https://api.elevenlabs.io/v1/text-to-speech';
const MARK_PATTERN = /\s*\[(\d+)\]\s*/g;
/* Dos animaciones nunca entran a la vez: las marcas quedan separadas al menos un turno. */
const MIN_SECONDS_BETWEEN_MARKS = 0.6;

const WEB_BREAK_TAG = '<break time="2s" />';
const WEB_BREAK_PATTERN = /<break[^>]*>/g;
const WEB_PART_MAX_CHARACTERS = 1600;
const SILENCE_NOISE_FLOOR = '-40dB';
const MIN_SILENCE_SECONDS = 0.15;
/* La pausa del tag dura unos 2,6 s con el silencio natural del final de la frase. */
const MIN_STEP_PAUSE_SECONDS = 1.2;
const MIN_SENTENCE_PAUSE_SECONDS = 0.3;
const SECONDS_KEPT_BEFORE_VOICE = 0.12;
const SECONDS_KEPT_AFTER_VOICE = 0.3;
const FILE_EDGE_SECONDS = 0.05;
/* Cuántas letras puede errar la estimación al buscar el signo de puntuación de una pausa. */
const PAUSE_SNAP_LETTERS = 15;

function parseArguments(argv) {
  const positional = [];
  const options = { lang: null, only: null, provider: 'elevenlabs', dryRun: false, webScript: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--dry-run') options.dryRun = true;
    else if (argument === '--web-script') options.webScript = true;
    else if (argument === '--lang') options.lang = argv[(index += 1)];
    else if (argument === '--provider') options.provider = argv[(index += 1)];
    else if (argument === '--only') options.only = argv[(index += 1)].split(',');
    else positional.push(argument);
  }
  return { course: positional[0], className: positional[1], ...options };
}

/* Separa el texto hablado de las marcas: `position` es cuántos caracteres del texto
   hablado hay antes de la marca. */
function splitSpokenTextAndMarks(narration) {
  const marks = [];
  let spoken = '';
  let cursor = 0;
  for (const match of narration.matchAll(MARK_PATTERN)) {
    spoken = appendPiece(spoken, narration.slice(cursor, match.index));
    marks.push({ turn: match[1], position: spoken.length });
    cursor = match.index + match[0].length;
  }
  spoken = appendPiece(spoken, narration.slice(cursor));
  return { spoken, marks };
}

function appendPiece(spoken, piece) {
  const trimmed = piece.trim();
  if (trimmed === '') return spoken;
  if (spoken === '') return trimmed;
  return /^[,.;:!?»”)]/.test(trimmed) ? spoken + trimmed : `${spoken} ${trimmed}`;
}

function hashOf(voiceKey, spoken) {
  return crypto.createHash('sha1').update(`${voiceKey}|${spoken}`).digest('hex');
}

/* El turno entra cuando la voz termina lo que hay antes de su marca. */
function secondsAtPosition(alignment, position) {
  for (let index = Math.min(position, alignment.characters.length) - 1; index >= 0; index -= 1) {
    if (alignment.characters[index].trim() !== '') return alignment.ends[index];
  }
  return 0;
}

function markSeconds(alignment, marks) {
  const timed = marks
    .map((mark) => ({ turn: mark.turn, seconds: secondsAtPosition(alignment, mark.position) }))
    .sort((a, b) => a.seconds - b.seconds);
  for (let index = 1; index < timed.length; index += 1) {
    timed[index].seconds = Math.max(timed[index].seconds, timed[index - 1].seconds + MIN_SECONDS_BETWEEN_MARKS);
  }
  return Object.fromEntries(timed.map((mark) => [mark.turn, Number(mark.seconds.toFixed(2))]));
}

async function requestElevenLabsSpeech({ voiceId, model, outputFormat, spoken, previousText, nextText }) {
  const response = await fetch(`${API_BASE}/${voiceId}/with-timestamps?output_format=${outputFormat}`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: spoken, model_id: model, previous_text: previousText, next_text: nextText }),
  });
  if (!response.ok) {
    throw new Error(`ElevenLabs respondió ${response.status}: ${await response.text()}`);
  }
  const body = await response.json();
  return {
    audio: Buffer.from(body.audio_base64, 'base64'),
    alignment: {
      characters: body.alignment.characters,
      starts: body.alignment.character_start_times_seconds,
      ends: body.alignment.character_end_times_seconds,
    },
  };
}

function sayToAiff(voiceName, rate, text, aiffFile) {
  execFileSync('say', ['-v', voiceName, '-r', String(rate), '-o', aiffFile, text]);
  const info = execFileSync('afinfo', [aiffFile], { encoding: 'utf8' });
  return Number(/estimated duration: ([\d.]+)/.exec(info)[1]);
}

/* `say` no devuelve el tiempo de cada letra: se mide cuánto dura el texto hasta cada
   marca y entre esos puntos se reparte el tiempo por igual entre las letras. */
function synthesizeWithSay({ voiceName, rate, spoken, marks }) {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'narration-say-'));
  const aiffFile = path.join(workDir, 'step.aiff');
  const mp3File = path.join(workDir, 'step.mp3');
  const anchors = [{ position: 0, seconds: 0 }];
  for (const position of [...new Set(marks.map((mark) => mark.position))].sort((a, b) => a - b)) {
    if (position > 0 && position < spoken.length) {
      anchors.push({ position, seconds: sayToAiff(voiceName, rate, spoken.slice(0, position), path.join(workDir, 'prefix.aiff')) });
    }
  }
  const duration = sayToAiff(voiceName, rate, spoken, aiffFile);
  anchors.push({ position: spoken.length, seconds: duration });
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', aiffFile, '-codec:a', 'libmp3lame', '-b:a', '128k', mp3File]);
  const audio = fs.readFileSync(mp3File);
  fs.rmSync(workDir, { recursive: true, force: true });

  const characters = [...spoken];
  const starts = [];
  const ends = [];
  for (let anchorIndex = 1; anchorIndex < anchors.length; anchorIndex += 1) {
    const from = anchors[anchorIndex - 1];
    const to = anchors[anchorIndex];
    const secondsPerCharacter = (Math.min(to.seconds, duration) - from.seconds) / (to.position - from.position);
    for (let position = from.position; position < to.position; position += 1) {
      starts.push(from.seconds + (position - from.position) * secondsPerCharacter);
      ends.push(from.seconds + (position - from.position + 1) * secondsPerCharacter);
    }
  }
  return { audio, alignment: { characters, starts, ends } };
}

function webDirOf(className) {
  return path.join(repoRoot, 'narration', 'para-elevenlabs', className);
}

function withSingleSpaces(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function writeWebScript(className, language, steps) {
  const dir = webDirOf(className);
  const parts = [[]];
  if (fs.existsSync(path.join(dir, `${language}-1.txt`))) {
    console.log(`${language}: ya hay guion en ${dir}; no se reescribe, porque sus audios se cortan con él.`);
    return;
  }
  for (const step of steps) {
    const currentPart = parts[parts.length - 1];
    const currentCharacters = currentPart.reduce((sum, partStep) => sum + partStep.spoken.length, 0);
    if (currentPart.length > 0 && currentCharacters + step.spoken.length > WEB_PART_MAX_CHARACTERS) parts.push([step]);
    else currentPart.push(step);
  }
  fs.mkdirSync(dir, { recursive: true });
  parts.forEach((part, index) => {
    const file = path.join(dir, `${language}-${index + 1}.txt`);
    fs.writeFileSync(file, `${part.map((step) => step.spoken).join(`\n\n${WEB_BREAK_TAG}\n\n`)}\n`);
    console.log(`${file}: ${part.length} pasos`);
  });
}

/* Cada <idioma>-<n>.txt dice qué pasos trae su audio. Si la narración cambió después
   de grabar, el texto ya no coincide y el audio de esa parte hay que rehacerlo. */
function readWebParts(className, language, steps) {
  const dir = webDirOf(className);
  const parts = [];
  let nextStep = 0;
  for (let partNumber = 1; fs.existsSync(path.join(dir, `${language}-${partNumber}.txt`)); partNumber += 1) {
    const name = `${language}-${partNumber}`;
    const audioFile = path.join(dir, `${name}.mp3`);
    const texts = fs.readFileSync(path.join(dir, `${name}.txt`), 'utf8').split(WEB_BREAK_PATTERN).map(withSingleSpaces).filter(Boolean);
    const partSteps = steps.slice(nextStep, nextStep + texts.length);
    if (!fs.existsSync(audioFile)) throw new Error(`Falta ${audioFile}.`);
    texts.forEach((text, index) => {
      if (!partSteps[index] || withSingleSpaces(partSteps[index].spoken) !== text) {
        throw new Error(`${name}.txt, paso ${index + 1}: el texto no coincide con el de ${partSteps[index] ? partSteps[index].stepId : 'ningún paso'} en la narración.`);
      }
    });
    parts.push({ name, audioFile, steps: partSteps });
    nextStep += texts.length;
  }
  if (nextStep !== steps.length) throw new Error(`Los guiones de ${dir} traen ${nextStep} pasos de ${language} y la narración tiene ${steps.length}.`);
  return parts;
}

function audioSeconds(file) {
  return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }));
}

function detectSilences(file, duration) {
  const filter = `silencedetect=noise=${SILENCE_NOISE_FLOOR}:d=${MIN_SILENCE_SECONDS}`;
  const log = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', filter, '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const starts = [...log.matchAll(/silence_start: (-?[\d.]+)/g)].map((match) => Math.max(0, Number(match[1])));
  const ends = [...log.matchAll(/silence_end: (-?[\d.]+)/g)].map((match) => Number(match[1]));
  return starts.map((start, index) => ({ start, end: ends[index] === undefined ? duration : ends[index] }));
}

function silentSecondsBetween(silences, from, to) {
  return silences.reduce((sum, silence) => sum + Math.max(0, Math.min(silence.end, to) - Math.max(silence.start, from)), 0);
}

function spokenWeight(character) {
  return /[\p{L}\p{N}]/u.test(character) ? 1 : 0;
}

function spokenWeightOf(text) {
  return [...text].reduce((sum, character) => sum + spokenWeight(character), 0);
}

/* Sin las pausas largas del tag, entre las pausas de frase se eligen las que dejan
   a cada paso una duración hablada más parecida a la que le toca por sus letras. */
function bestFittingPauses(pauses, silences, steps, voiceStart, voiceEnd) {
  const weights = steps.map((step) => spokenWeightOf(step.spoken));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const voicedSeconds = (from, to) => to - from - silentSecondsBetween(silences, from, to);
  const secondsPerLetter = voicedSeconds(voiceStart, voiceEnd) / totalWeight;
  const stepCost = (stepIndex, from, to) => (voicedSeconds(from, to) - weights[stepIndex] * secondsPerLetter) ** 2;
  const best = steps.map(() => pauses.map(() => ({ cost: Infinity, previous: -1 })));
  const chosen = [];
  let lastPause = -1;
  let lowestCost = Infinity;
  pauses.forEach((pause, pauseIndex) => {
    best[0][pauseIndex] = { cost: stepCost(0, voiceStart, pause.start), previous: -1 };
  });
  for (let stepIndex = 1; stepIndex < steps.length - 1; stepIndex += 1) {
    for (let pauseIndex = stepIndex; pauseIndex < pauses.length; pauseIndex += 1) {
      for (let previous = stepIndex - 1; previous < pauseIndex; previous += 1) {
        const cost = best[stepIndex - 1][previous].cost + stepCost(stepIndex, pauses[previous].end, pauses[pauseIndex].start);
        if (cost < best[stepIndex][pauseIndex].cost) best[stepIndex][pauseIndex] = { cost, previous };
      }
    }
  }
  pauses.forEach((pause, pauseIndex) => {
    const cost = best[steps.length - 2][pauseIndex].cost + stepCost(steps.length - 1, pause.end, voiceEnd);
    if (cost < lowestCost) {
      lowestCost = cost;
      lastPause = pauseIndex;
    }
  });
  for (let stepIndex = steps.length - 2; stepIndex >= 0; stepIndex -= 1) {
    chosen.unshift(pauses[lastPause]);
    lastPause = best[stepIndex][lastPause].previous;
  }
  return chosen;
}

function pausesBetweenSteps(part, silences, voiceStart, voiceEnd) {
  const inner = silences.filter((silence) => silence.start > voiceStart && silence.end < voiceEnd);
  const stepPauses = inner.filter((silence) => silence.end - silence.start >= MIN_STEP_PAUSE_SECONDS);
  const sentencePauses = inner.filter((silence) => silence.end - silence.start >= MIN_SENTENCE_PAUSE_SECONDS);
  if (part.steps.length === 1) return { pauses: [], exact: true };
  if (stepPauses.length === part.steps.length - 1) return { pauses: stepPauses, exact: true };
  if (sentencePauses.length < part.steps.length - 1) {
    throw new Error(`${part.name}.mp3 tiene ${sentencePauses.length} pausas y hacen falta ${part.steps.length - 1} para separar sus pasos.`);
  }
  return { pauses: bestFittingPauses(sentencePauses, silences, part.steps, voiceStart, voiceEnd), exact: false };
}

/* Dónde cortar cada paso de una parte y dónde quedan, ya dentro del corte, su voz y sus pausas. */
function locateStepsInPart(part) {
  const duration = audioSeconds(part.audioFile);
  const silences = detectSilences(part.audioFile, duration);
  const leading = silences.find((silence) => silence.start <= FILE_EDGE_SECONDS);
  const trailing = silences.find((silence) => silence.end >= duration - FILE_EDGE_SECONDS);
  const voiceStart = leading ? leading.end : 0;
  const voiceEnd = trailing ? trailing.start : duration;
  const { pauses, exact } = pausesBetweenSteps(part, silences, voiceStart, voiceEnd);
  const partHash = crypto.createHash('sha1').update(fs.readFileSync(part.audioFile)).digest('hex');
  return part.steps.map((step, index) => {
    const stepVoiceStart = index === 0 ? voiceStart : pauses[index - 1].end;
    const stepVoiceEnd = index === part.steps.length - 1 ? voiceEnd : pauses[index].start;
    const earliestCut = index === 0 ? 0 : (pauses[index - 1].start + pauses[index - 1].end) / 2;
    const latestCut = index === part.steps.length - 1 ? duration : (pauses[index].start + pauses[index].end) / 2;
    const cutStart = Math.max(earliestCut, stepVoiceStart - SECONDS_KEPT_BEFORE_VOICE);
    const cutEnd = Math.min(latestCut, stepVoiceEnd + SECONDS_KEPT_AFTER_VOICE);
    return {
      stepId: step.stepId,
      partName: part.name,
      partHash,
      audioFile: part.audioFile,
      exact,
      cutStart,
      cutEnd,
      voiceStart: stepVoiceStart - cutStart,
      voiceEnd: stepVoiceEnd - cutStart,
      silences: silences
        .filter((silence) => silence.start > stepVoiceStart && silence.end < stepVoiceEnd)
        .map((silence) => ({ start: silence.start - cutStart, end: silence.end - cutStart })),
    };
  });
}

function locateWebSteps(className, language, steps) {
  const located = new Map();
  for (const part of readWebParts(className, language, steps)) {
    const partSteps = locateStepsInPart(part);
    if (!partSteps[0].exact) console.log(`${part.name}.mp3 no trae las pausas largas entre pasos: cortado por las pausas de frase, conviene escucharlo.`);
    partSteps.forEach((step) => located.set(step.stepId, step));
  }
  return located;
}

/* El espacio donde cae una pausa, entre dos ya situadas: el más cercano a la letra
   estimada, y si hay uno tras un signo de puntuación a pocas letras, ese. */
function pauseIndexNear(characters, lettersBefore, expectedLetters, afterIndex, beforeIndex) {
  let nearestSpace = null;
  let nearestAfterPunctuation = null;
  const distanceOf = (index) => Math.abs(lettersBefore[index] - expectedLetters);
  for (let index = afterIndex + 1; index < beforeIndex; index += 1) {
    if (characters[index] !== ' ') continue;
    if (nearestSpace === null || distanceOf(index) < distanceOf(nearestSpace)) nearestSpace = index;
    if (/[,.;:!?»”)]/.test(characters[index - 1]) && (nearestAfterPunctuation === null || distanceOf(index) < distanceOf(nearestAfterPunctuation))) {
      nearestAfterPunctuation = index;
    }
  }
  if (nearestAfterPunctuation !== null && distanceOf(nearestAfterPunctuation) <= PAUSE_SNAP_LETTERS) return nearestAfterPunctuation;
  return nearestSpace;
}

/* Las pausas más largas eligen primero: así el final de una frase se queda con su
   punto y una respiración corta a media frase no se lo quita. */
function locatePausesInText(characters, lettersBefore, silences, voiceStart, voicedSeconds) {
  const located = [];
  const voicedBefore = (silence) => silence.start - voiceStart - silentSecondsBetween(silences, voiceStart, silence.start);
  for (const silence of [...silences].sort((a, b) => b.end - b.start - (a.end - a.start))) {
    const earlier = located.filter((pause) => pause.silence.start < silence.start).map((pause) => pause.index);
    const later = located.filter((pause) => pause.silence.start > silence.start).map((pause) => pause.index);
    const expectedLetters = (lettersBefore[characters.length] * voicedBefore(silence)) / voicedSeconds;
    const index = pauseIndexNear(characters, lettersBefore, expectedLetters, Math.max(0, ...earlier), Math.min(characters.length - 1, ...later));
    if (index !== null) located.push({ index, silence });
  }
  return located.sort((a, b) => a.index - b.index);
}

function estimateAlignment({ spoken, voiceStart, voiceEnd, silences }) {
  const characters = [...spoken];
  const weights = characters.map(spokenWeight);
  const lettersBefore = [0];
  const anchors = [{ index: 0, seconds: voiceStart }];
  const starts = [];
  const ends = [];
  const voicedSeconds = voiceEnd - voiceStart - silentSecondsBetween(silences, voiceStart, voiceEnd);
  weights.forEach((weight, index) => lettersBefore.push(lettersBefore[index] + weight));
  for (const pause of locatePausesInText(characters, lettersBefore, silences, voiceStart, voicedSeconds)) {
    anchors.push({ index: pause.index, seconds: pause.silence.start }, { index: pause.index + 1, seconds: pause.silence.end });
  }
  anchors.push({ index: characters.length, seconds: voiceEnd });
  for (let anchorIndex = 1; anchorIndex < anchors.length; anchorIndex += 1) {
    const from = anchors[anchorIndex - 1];
    const to = anchors[anchorIndex];
    const letters = lettersBefore[to.index] - lettersBefore[from.index];
    const secondsPerLetter = letters > 0 ? (to.seconds - from.seconds) / letters : 0;
    for (let index = from.index; index < to.index; index += 1) {
      const start = letters > 0 ? from.seconds + (lettersBefore[index] - lettersBefore[from.index]) * secondsPerLetter : from.seconds;
      starts.push(start);
      ends.push(letters > 0 ? start + weights[index] * secondsPerLetter : to.seconds);
    }
  }
  return { characters, starts, ends };
}

function cutWebStep(webStep, spoken) {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'narration-web-'));
  const mp3File = path.join(workDir, 'step.mp3');
  const seconds = String(webStep.cutEnd - webStep.cutStart);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', String(webStep.cutStart), '-t', seconds, '-i', webStep.audioFile, '-codec:a', 'copy', mp3File]);
  const audio = fs.readFileSync(mp3File);
  fs.rmSync(workDir, { recursive: true, force: true });
  return { audio, alignment: estimateAlignment({ spoken, voiceStart: webStep.voiceStart, voiceEnd: webStep.voiceEnd, silences: webStep.silences }) };
}

function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function main() {
  const { course, className, lang, only, provider, dryRun, webScript } = parseArguments(process.argv.slice(2));
  if (!course || !className || !['elevenlabs', 'say', 'web'].includes(provider)) {
    console.error('Uso: node narration/scripts/generate-narration.js <curso> <clase> [--lang es|en] [--only paso1,paso2] [--provider elevenlabs|say|web] [--dry-run] [--web-script]');
    process.exit(1);
  }
  if (provider === 'elevenlabs' && !dryRun && !process.env.ELEVENLABS_API_KEY) {
    console.error('Falta ELEVENLABS_API_KEY en .env.local.');
    process.exit(1);
  }

  const presentationsDir = path.join(repoRoot, 'src', 'presentations', course);
  const narrations = readJson(path.join(presentationsDir, `${className}.narracion.json`), null);
  if (!narrations) {
    console.error(`No existe ${className}.narracion.json en ${presentationsDir}.`);
    process.exit(1);
  }
  const timingsFile = path.join(presentationsDir, `${className}.narracion-tiempos.json`);
  const timings = readJson(timingsFile, {});
  const { model, outputFormat, voices, say } = readJson(path.join(repoRoot, 'narration', 'voices.json'), null);
  const languages = lang ? [lang] : Object.keys(narrations);
  let requestedCharacters = 0;

  for (const language of languages) {
    const voice = provider === 'say' ? { id: say.voices[language], name: `say · ${say.voices[language]}` } : voices[language];
    const voiceKey = provider === 'say' ? `say|${voice.id}|${say.rate}` : `${model}|${voice.id}`;
    const steps = Object.entries(narrations[language]).map(([stepId, narration]) => ({ stepId, ...splitSpokenTextAndMarks(narration) }));
    if (webScript) {
      writeWebScript(className, language, steps);
      continue;
    }
    const webSteps = provider === 'web' ? locateWebSteps(className, language, steps) : null;
    const audioDir = path.join(repoRoot, 'public', 'assets', 'presentations', course, 'narracion', className, language);
    const alignmentDir = path.join(repoRoot, 'narration', 'alignments', course, className, language);
    timings[language] = timings[language] || {};

    for (let index = 0; index < steps.length; index += 1) {
      const { stepId, spoken, marks } = steps[index];
      if (only && !only.includes(stepId)) continue;
      const hash = hashOf(provider === 'web' ? `web|${webSteps.get(stepId).partHash}` : voiceKey, spoken);
      const audioFile = path.join(audioDir, `${stepId}.mp3`);
      const alignmentFile = path.join(alignmentDir, `${stepId}.json`);
      let saved = readJson(alignmentFile, null);
      /* Cortar no cuesta nada: con `web` se rehace siempre, así un cambio en la estimación llega a los tiempos. */
      const upToDate = provider !== 'web' && saved && saved.hash === hash && fs.existsSync(audioFile);

      if (!upToDate) {
        requestedCharacters += spoken.length;
        if (dryRun) {
          console.log(`${language}/${stepId}: ${provider === 'elevenlabs' ? 'pediría' : 'generaría'} ${spoken.length} caracteres`);
          continue;
        }
        const speech =
          provider === 'web'
            ? cutWebStep(webSteps.get(stepId), spoken)
            : provider === 'say'
            ? synthesizeWithSay({ voiceName: voice.id, rate: say.rate, spoken, marks })
            : await requestElevenLabsSpeech({
                voiceId: voice.id,
                model,
                outputFormat,
                spoken,
                previousText: index > 0 ? steps[index - 1].spoken : undefined,
                nextText: index < steps.length - 1 ? steps[index + 1].spoken : undefined,
              });
        fs.mkdirSync(audioDir, { recursive: true });
        fs.writeFileSync(audioFile, speech.audio);
        saved = { hash, provider, voice: provider === 'web' ? 'ElevenLabs, hecho en la web' : voice.name, spoken, ...speech.alignment };
        writeJson(alignmentFile, saved);
        console.log(`${language}/${stepId}: generado (${spoken.length} caracteres)`);
      }

      timings[language][stepId] = {
        duration: Number(saved.ends[saved.ends.length - 1].toFixed(2)),
        marks: markSeconds(saved, marks),
        version: hash.slice(0, 8),
      };
    }
  }

  if (webScript) return;
  if (!dryRun) writeJson(timingsFile, timings);
  const spent = provider === 'web' ? 'Cortados de los audios de la web, sin costo' : provider === 'say' ? 'Sintetizados con say, sin costo' : dryRun ? 'Costaría' : 'Pedidos a ElevenLabs';
  console.log(`${spent}: ${requestedCharacters} caracteres.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
