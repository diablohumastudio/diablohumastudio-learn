import type { CSSProperties } from 'react';
import Deck, { Slide, useSlideStep } from '../../components/learn/Deck';
import s from '../../components/learn/Deck.module.css';
import { useT } from '../../i18n/useT';
import { motorDict } from './que-es-un-motor-de-audio.dict';
import type { CompiladosTexts, QueEsUnMotorTexts } from './que-es-un-motor-de-audio.dict';

/* La pila de "compilados" e "interpretados" comparte estas filas (y = 20 + fila × 82)
   para que OS y CPU queden en el mismo sitio en los dos slides. */
const FILA_Y: number[] = [20, 102, 184, 266, 348];
const CAJA_X: number = 170;
const CAJA_ANCHO: number = 560;
const CAJA_ALTO: number = 54;

function Caja({
  fila,
  titulo,
  sub,
  estilo,
  sans,
}: {
  fila: number;
  titulo: string;
  sub?: string;
  estilo: 'normal' | 'protagonista' | 'teal';
  sans?: boolean;
}) {
  const y = FILA_Y[fila];
  const borde =
    estilo === 'protagonista'
      ? { fill: '#232730', stroke: '#f2a33c', strokeWidth: 2 }
      : estilo === 'teal'
        ? { fill: '#1d2026', stroke: '#63b6a4' }
        : { fill: '#1d2026', stroke: 'currentColor', strokeOpacity: 0.35 };
  return (
    <>
      <rect x={CAJA_X} y={y} width={CAJA_ANCHO} height={CAJA_ALTO} rx="8" {...borde} />
      <text
        className={sans ? s.svgSans : undefined}
        x="450"
        y={y + (sub ? 23 : 33)}
        fontSize={sans ? 15 : 13}
        fontWeight={sans ? 600 : undefined}
        fill={estilo === 'protagonista' ? '#f2a33c' : 'currentColor'}
        textAnchor="middle"
      >
        {titulo}
      </text>
      {sub ? (
        <text x="450" y={y + 42} fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">{sub}</text>
      ) : null}
    </>
  );
}

/* Flecha recta entre dos filas, con un rótulo opcional a su derecha. */
function FlechaFila({ desde, hasta, rotulo, ambar }: { desde: number; hasta: number; rotulo?: string; ambar?: boolean }) {
  const y1 = FILA_Y[desde] + CAJA_ALTO;
  const y2 = FILA_Y[hasta] - 4;
  return (
    <>
      <line x1="450" y1={y1} x2="450" y2={y2} stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrPila)" />
      {rotulo ? (
        <text x="470" y={(y1 + y2) / 2 + 4} fontSize="11.5" fill={ambar ? '#f2a33c' : 'currentColor'} opacity={ambar ? 1 : 0.65}>{rotulo}</text>
      ) : null}
    </>
  );
}

function MarcadorPila() {
  return (
    <defs>
      <marker id="arrPila" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
      </marker>
    </defs>
  );
}

/* La pila compilada en su estado final (los cinco pisos), para el slide de
   compilados y para la salida en el de interpretados. */
function PilaCompilada({ r }: { r: CompiladosTexts }) {
  return (
    <>
      <Caja fila={0} titulo="juego.c" sub={r.texto} estilo="normal" />
      <FlechaFila desde={0} hasta={1} />
      <Caja fila={1} titulo={r.compilador} sub={r.unaVez} estilo="protagonista" />
      <FlechaFila desde={1} hasta={2} />
      <Caja fila={2} titulo="juego.exe" sub={r.binario} estilo="protagonista" />
      <FlechaFila desde={2} hasta={3} rotulo={r.elOsLoLanza} ambar />
      <Caja fila={3} titulo={r.os} sub={r.sistemas} estilo="normal" sans />
      <FlechaFila desde={3} hasta={4} rotulo={r.instruccionesDirectas} />
      <Caja fila={4} titulo={r.cpu} sub={r.ejecutaTalCual} estilo="normal" sans />
    </>
  );
}

/* Tres pasos con la disposición fija (eyebrow, h2 de dos líneas y figura
   siempre ocupan su sitio) para que nada se mueva entre pasos. Paso 0: solo el
   título. Paso 1: "programas compilados" sube encogiéndose hasta el eyebrow y
   aparece la pila juego.c → compilador → juego.exe. Paso 2: OS y CPU debajo. */
function ContenidoCompilados({ r }: { r: CompiladosTexts }) {
  const paso = useSlideStep();
  const eyebrowSube = { '--morph-from': 'translateY(64px) scale(3.5)', transformOrigin: 'left top' } as CSSProperties;
  return (
    <>
      {paso === 0 ? (
        <div className={`${s.eyebrow} ${s.oculto}`}>{r.eyebrow}</div>
      ) : (
        <div className={`${s.eyebrow} ${s.morphGlide}`} style={eyebrowSube}>
          {r.eyebrow}
        </div>
      )}
      <h2 key={paso} className={`${s.h2TwoLines} ${paso > 0 ? s.morphIn : ''}`}>
        {r.titles[paso]}
      </h2>
      <figure className={paso === 0 ? s.oculto : undefined}>
        <svg viewBox="0 0 900 420" role="img" aria-label={r.arias[paso]}>
          <MarcadorPila />
          <g className={paso === 1 ? s.morphIn : undefined}>
            <Caja fila={0} titulo="juego.c" sub={r.texto} estilo="normal" />
            <FlechaFila desde={0} hasta={1} />
            <Caja fila={1} titulo={r.compilador} sub={r.unaVez} estilo="protagonista" />
            <FlechaFila desde={1} hasta={2} />
            <Caja fila={2} titulo="juego.exe" sub={r.binario} estilo="protagonista" />
          </g>
          {paso >= 2 && (
            <>
              <g className={s.morphIn}>
                <FlechaFila desde={2} hasta={3} rotulo={r.elOsLoLanza} ambar />
                <Caja fila={3} titulo={r.os} sub={r.sistemas} estilo="normal" sans />
              </g>
              <g className={s.morphIn} style={{ animationDelay: '0.3s' }}>
                <FlechaFila desde={3} hasta={4} rotulo={r.instruccionesDirectas} />
                <Caja fila={4} titulo={r.cpu} sub={r.ejecutaTalCual} estilo="normal" sans />
              </g>
            </>
          )}
        </svg>
        <figcaption>{r.caption}</figcaption>
      </figure>
    </>
  );
}

/* Qué es un motor: la misma forma (entrada → motor → comportamiento) con un
   ejemplo por paso; la tabla está completa desde el inicio y cada paso llena
   la fila de su ejemplo. */
function ContenidoMotor({ r }: { r: QueEsUnMotorTexts }) {
  const paso = useSlideStep();
  const actual = r.pasos[paso];
  return (
    <>
      <h2>{actual.title}</h2>
      <figure>
        <svg viewBox="0 0 900 190" role="img" aria-label={actual.aria}>
          <defs>
            <marker id="arrS5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
            </marker>
          </defs>
          <rect x="40" y="66" width="280" height="58" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
          <line x1="320" y1="95" x2="368" y2="95" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS5)" />
          <rect x="374" y="66" width="220" height="58" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
          <line x1="594" y1="95" x2="700" y2="95" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS5)" />
          <text className={s.svgSans} x="712" y="100" fontSize="14" fill="currentColor">{r.comportamiento}</text>
          {/* Con key por paso los textos se remontan y entran con fade en cada ejemplo */}
          <g key={paso} className={paso > 0 ? s.morphIn : undefined}>
            <text x="180" y="89" fontSize="11.5" fill="#f2a33c" textAnchor="middle">{actual.entrada}</text>
            <text x="180" y="107" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{actual.entradaSub}</text>
            <text x="484" y="90" fontSize="15" fill="#f2a33c" textAnchor="middle">{actual.motor}</text>
            <text x="484" y="110" fontSize="10.5" fill="currentColor" opacity=".65" textAnchor="middle">{r.unProgramaCorriendo}</text>
          </g>
        </svg>
      </figure>
      <table className={s.plain}>
        <thead>
          <tr>
            <th>{r.thMotor}</th>
            <th>{r.thCorre}</th>
          </tr>
        </thead>
        <tbody>
          {r.filas.map(([motor, corre], i) => {
            const visible = i < paso;
            return (
              <tr key={motor} className={i === paso - 1 ? s.morphIn : undefined}>
                <td>{visible ? motor : ' '}</td>
                <td>{visible ? corre : ' '}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default function QueEsUnMotorDeAudio() {
  const t = useT(motorDict);

  return (
    <Deck name={t.name} context={t.context}>
      <Slide z="▶" label={t.labels.intro} backgroundImage="/assets/presentations/wwise-unreal/Cover.jpg">
        <div className={s.eyebrow}>{t.cover.eyebrow}</div>
        <h1>{t.cover.title}</h1>
        <p className={s.note}>{t.cover.hint}</p>
      </Slide>

      <Slide z="1" label={[t.labels.lenguajes, t.labels.compilados, t.labels.elOs]}>
        <ContenidoCompilados r={t.compilados} />
      </Slide>

      <Slide z="2" label={t.labels.interpretados}>
        <div className={s.eyebrow}>{t.interpretados.eyebrow}</div>
        <h2 className={s.h2TwoLines}>{t.interpretados.title}</h2>
        <figure>
          <svg viewBox="0 0 900 420" role="img" aria-label={t.interpretados.aria}>
            <MarcadorPila />
            {/* Al entrar, la pila compilada del slide anterior sale por la izquierda… */}
            <g className={s.morphGlideOut} style={{ '--morph-to': 'translateX(-140px)' } as CSSProperties}>
              <PilaCompilada r={t.compilados} />
            </g>
            {/* …y la pila interpretada entra por la derecha, con OS y CPU en las mismas filas */}
            <g className={s.morphGlide} style={{ animationDelay: '0.3s', '--morph-from': 'translateX(140px)' } as CSSProperties}>
              <g className={s.morphIn} style={{ animationDelay: '0.3s' }}>
                <Caja fila={0} titulo="player.gd" sub={t.interpretados.texto} estilo="teal" />
                <FlechaFila desde={0} hasta={1} rotulo={t.interpretados.elMotorLoLee} ambar />
                <Caja fila={1} titulo={t.interpretados.motor} sub={t.interpretados.interprete} estilo="protagonista" />
                <FlechaFila desde={1} hasta={3} rotulo={t.interpretados.elOsCorreAlMotor} />
                <Caja fila={3} titulo={t.compilados.os} sub={t.compilados.sistemas} estilo="normal" sans />
                <FlechaFila desde={3} hasta={4} />
                <Caja fila={4} titulo={t.compilados.cpu} sub={t.compilados.ejecutaTalCual} estilo="normal" sans />
              </g>
            </g>
          </svg>
          <figcaption>{t.interpretados.caption}</figcaption>
        </figure>
      </Slide>

      <Slide
        z="3"
        label={[t.labels.queEsUnMotor, t.labels.navegador, t.labels.python, t.labels.gameEngines, t.labels.audioEngines]}
      >
        <div className={s.eyebrow}>{t.queEsUnMotor.eyebrow}</div>
        <ContenidoMotor r={t.queEsUnMotor} />
      </Slide>
    </Deck>
  );
}
