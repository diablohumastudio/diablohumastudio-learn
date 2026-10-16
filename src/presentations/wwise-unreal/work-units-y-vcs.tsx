import type { ReactElement } from 'react';
import Deck, { Slide, useSlideStep } from '../../components/learn/Deck';
import s from '../../components/learn/Deck.module.css';
import { useT } from '../../i18n/useT';
import { workUnitsDict } from './work-units-y-vcs.dict';
import type { FilaArchivo, Veredicto, WorkUnitsTexts } from './work-units-y-vcs.dict';

const AMBAR: string = '#f2a33c';
const TEAL: string = '#63b6a4';
const ROJO: string = '#d9646a';
const FONDO: string = '#1d2026';
const FONDO_PROTAGONISTA: string = '#232730';

type Textos = WorkUnitsTexts;

/* ---------- Esquema de ideas (diapositiva propia y miniatura en la esquina) ---------- */

function CajaIdea({ x, y, width, height, numero, texto, resaltada, fontSize }: { x: number; y: number; width: number; height: number; numero: string; texto: string; resaltada: boolean; fontSize: number }) {
  const color: string = resaltada ? AMBAR : 'currentColor';
  return (
    <g opacity={resaltada ? 1 : 0.55}>
      <rect x={x} y={y} width={width} height={height} rx="8" fill={resaltada ? FONDO_PROTAGONISTA : FONDO} stroke={color} strokeOpacity={resaltada ? 1 : 0.35} />
      <text x={x + width * 0.09} y={y + height / 2 + fontSize * 0.55} fontSize={fontSize * 1.7} fill={AMBAR}>
        {numero}
      </text>
      <text x={x + width * 0.22} y={y + height / 2 + fontSize * 0.38} fontSize={fontSize} fill={color} className={s.svgSans}>
        {texto}
      </text>
    </g>
  );
}

/* Un recuadro por paso: el paso 0 solo tiene el título; el último añade la leyenda. */
function FiguraIdeas({ t }: { t: Textos }) {
  const step: number = useSlideStep();
  return (
    <figure>
      <svg viewBox="0 0 940 150" role="img" aria-label={t.ideas.aria}>
        {t.ideas.items.map((item, index) =>
          step >= index + 1 ? (
            <g key={item} className={s.morphIn}>
              <CajaIdea x={20 + index * 310} y={28} width={280} height={90} numero={String(index + 1)} texto={item} resaltada fontSize={14} />
            </g>
          ) : null,
        )}
      </svg>
      <figcaption className={step >= 3 ? s.morphIn : s.oculto} style={{ animationDelay: '0.6s' }}>
        {t.ideas.caption}
      </figcaption>
    </figure>
  );
}

/* Miniatura del esquema en la esquina de las diapositivas de contenido, con la idea actual resaltada. */
function EsquemaIdeas({ t, actual }: { t: Textos; actual: number }) {
  return (
    <svg className={s.minimap} viewBox="0 0 234 36" aria-hidden="true">
      {t.ideas.cortos.map((corto, index) => (
        <CajaIdea key={corto} x={index * 80} y={3} width={74} height={30} numero={String(index + 1)} texto={corto} resaltada={index === actual} fontSize={8} />
      ))}
    </svg>
  );
}

/* ---------- Idea 1: qué archivos van a Git ---------- */

const ALTO_FILA: number = 36;
const ANCHO_PANEL: number = 430;

function Pastilla({ x, y, veredicto, texto }: { x: number; y: number; veredicto: Veredicto; texto: string }) {
  const relleno: string = veredicto === 'si' ? AMBAR : veredicto === 'depende' ? TEAL : 'none';
  const colorTexto: string = veredicto === 'no' ? 'currentColor' : FONDO;
  return (
    <g>
      <rect x={x} y={y} width={64} height={20} rx="10" fill={relleno} stroke="currentColor" strokeOpacity={veredicto === 'no' ? 0.35 : 0} />
      <text x={x + 32} y={y + 14} fontSize="10.5" fill={colorTexto} opacity={veredicto === 'no' ? 0.6 : 1} textAnchor="middle" className={s.svgSans}>
        {texto}
      </text>
    </g>
  );
}

/* Las filas entran una a una en el orden del diccionario, que es el orden de la narración.
   La marca LFS se muestra (con un pulso) solo cuando el paso de binarios la explica. */
function PanelArchivos({ x, titulo, filas, veredictos, mostrarLfs }: { x: number; titulo: string; filas: FilaArchivo[]; veredictos: Record<Veredicto, string>; mostrarLfs: boolean }) {
  const y: number = 52;
  const alto: number = 48 + filas.length * ALTO_FILA + 8;
  return (
    <g>
      <rect x={x} y={y} width={ANCHO_PANEL} height={alto} rx="8" fill={FONDO} stroke="currentColor" strokeOpacity=".35" />
      <text x={x + 16} y={y + 24} fontSize="11.5" opacity=".65" letterSpacing="2">
        {titulo}
      </text>
      {filas.map((fila, index) => {
        const yFila: number = y + 48 + index * ALTO_FILA;
        const conLfs: boolean = mostrarLfs && fila.lfs === true;
        return (
          <g key={fila.nombre} className={s.morphIn} style={{ animationDelay: `${0.6 + index * 0.3}s` }}>
            <text x={x + 16} y={yFila + 14} fontSize="12" fill={fila.veredicto === 'no' ? 'currentColor' : AMBAR} opacity={fila.veredicto === 'no' ? 0.7 : 1}>
              {fila.nombre}
            </text>
            <g className={conLfs ? s.morphPulse : undefined} style={conLfs ? { animationDelay: '1.2s' } : undefined}>
              <text x={x + 250} y={yFila + 14} fontSize="10.5" opacity=".6" className={s.svgSans}>
                {conLfs ? `${fila.nota} · LFS` : fila.nota}
              </text>
            </g>
            <Pastilla x={x + ANCHO_PANEL - 16 - 64} y={yFila - 1} veredicto={fila.veredicto} texto={veredictos[fila.veredicto]} />
          </g>
        );
      })}
    </g>
  );
}

function CajaBinarios({ x, color, titulo, ejemplos }: { x: number; color: string; titulo: string; ejemplos: string }) {
  return (
    <g>
      <rect x={x} y={366} width={ANCHO_PANEL} height={46} rx="8" fill={FONDO_PROTAGONISTA} stroke={color} />
      <text x={x + 16} y={384} fontSize="12" fill={color} className={s.svgSans}>
        {titulo}
      </text>
      <text x={x + 16} y={402} fontSize="10.5" opacity=".7">
        {ejemplos}
      </text>
    </g>
  );
}

function ContenidoArchivos({ t }: { t: Textos }) {
  const step: number = useSlideStep();
  const r = t.archivos;
  const mostrarLfs: boolean = step >= 2;
  return (
    <>
      <EsquemaIdeas t={t} actual={0} />
      <div className={s.eyebrow}>{r.eyebrow}</div>
      <h2 className={s.h2TwoLines}>{r.titles[step]}</h2>
      <figure>
        <svg viewBox="0 0 940 420" role="img" aria-label={r.arias[step]}>
          <g className={s.morphIn}>
            <PanelArchivos x={20} titulo={r.wwise.titulo} filas={r.wwise.filas} veredictos={r.veredictos} mostrarLfs={mostrarLfs} />
          </g>
          {step >= 1 && (
            <g className={s.morphIn}>
              <PanelArchivos x={490} titulo={r.unreal.titulo} filas={r.unreal.filas} veredictos={r.veredictos} mostrarLfs={mostrarLfs} />
            </g>
          )}
          {step >= 2 && (
            <g>
              <g className={s.morphIn}>
                <CajaBinarios x={20} color={AMBAR} titulo={r.binarios.texto} ejemplos={r.binarios.textoEj} />
              </g>
              <g className={s.morphIn} style={{ animationDelay: '0.6s' }}>
                <CajaBinarios x={490} color={TEAL} titulo={r.binarios.binario} ejemplos={r.binarios.binarioEj} />
              </g>
            </g>
          )}
        </svg>
        <figcaption>{r.captions[step]}</figcaption>
      </figure>
    </>
  );
}

/* ---------- Idea 2: un Work Unit es un archivo ---------- */

function CajaNodo({ x, y, width, texto, protagonista = false, atenuada = false }: { x: number; y: number; width: number; texto: string; protagonista?: boolean; atenuada?: boolean }) {
  const color: string = protagonista ? AMBAR : 'currentColor';
  return (
    <g opacity={atenuada ? 0.6 : 1}>
      <rect x={x} y={y} width={width} height={28} rx="6" fill={protagonista ? FONDO_PROTAGONISTA : FONDO} stroke={color} strokeOpacity={protagonista ? 1 : 0.35} />
      <text x={x + 12} y={y + 18} fontSize="12" fill={color}>
        {texto}
      </text>
    </g>
  );
}

function Etiqueta({ x, y, texto, color, width = 80 }: { x: number; y: number; texto: string; color: string; width?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={22} rx="11" fill={color} />
      <text x={x + width / 2} y={y + 15} fontSize="10.5" fill={FONDO} textAnchor="middle" className={s.svgSans}>
        {texto}
      </text>
    </g>
  );
}

function RamaArbol({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return <line x1={x} y1={y1} x2={x} y2={y2} stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />;
}

function HojaArbol({ x, y, texto }: { x: number; y: number; texto: string }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x + 14} y2={y} stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />
      <text x={x + 22} y={y + 4} fontSize="12" opacity=".8">
        {texto}
      </text>
    </g>
  );
}

/* Pulso de énfasis sobre un grupo ya visible, en el momento que marca el guion. */
function Pulso({ delay, children }: { delay: string; children: ReactElement }) {
  return (
    <g className={s.morphPulse} style={{ animationDelay: delay }}>
      {children}
    </g>
  );
}

function ContenidoWorkUnit({ t }: { t: Textos }) {
  const step: number = useSlideStep();
  const r = t.workUnit;
  const xExplorer: number = 20;
  const xDisco: number = 520;
  const xFlechaInicio: number = xExplorer + 32 + 210 + 8;
  const xFlechaFin: number = xDisco + 32 - 8;
  return (
    <>
      <EsquemaIdeas t={t} actual={1} />
      <div className={s.eyebrow}>{r.eyebrow}</div>
      <h2 className={s.h2TwoLines}>{r.titles[step]}</h2>
      <figure>
        <svg viewBox="0 0 940 330" role="img" aria-label={r.arias[step]}>
          <defs>
            <marker id="arrWU" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={AMBAR} />
            </marker>
          </defs>

          {/* Árbol del Project Explorer: entra primero */}
          <g className={s.morphIn}>
            <text x={xExplorer} y={30} fontSize="11.5" opacity=".65" letterSpacing="2">
              {r.explorer}
            </text>
            <text x={xExplorer + 4} y={70} fontSize="13" opacity=".85">
              {r.arbol.containers}
            </text>
            <RamaArbol x={xExplorer + 12} y1={78} y2={step >= 1 ? 232 : 102} />
            <line x1={xExplorer + 12} y1={102} x2={xExplorer + 28} y2={102} stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />
            <Pulso delay="2.4s">
              <CajaNodo x={xExplorer + 32} y={88} width={210} texto={r.arbol.defaultWu} />
            </Pulso>
            <RamaArbol x={xExplorer + 48} y1={116} y2={172} />
            <HojaArbol x={xExplorer + 48} y={146} texto={r.arbol.simple} />
            <HojaArbol x={xExplorer + 48} y={172} texto={r.arbol.random} />
          </g>

          {/* Disco: entra después */}
          <g className={s.morphIn} style={{ animationDelay: '0.6s' }}>
            <text x={xDisco} y={30} fontSize="11.5" opacity=".65" letterSpacing="2">
              {r.disco}
            </text>
            <text x={xDisco + 4} y={70} fontSize="13" opacity=".85">
              {r.archivos.carpeta}
            </text>
            <RamaArbol x={xDisco + 12} y1={78} y2={step >= 1 ? 232 : 102} />
            <line x1={xDisco + 12} y1={102} x2={xDisco + 28} y2={102} stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />
            <Pulso delay="1.2s">
              <CajaNodo x={xDisco + 32} y={88} width={240} texto={r.archivos.defaultWu} />
            </Pulso>
          </g>

          {/* El Work Unit es el archivo */}
          <g className={s.morphIn} style={{ animationDelay: '1.8s' }}>
            <line x1={xFlechaInicio} y1={102} x2={xFlechaFin} y2={102} stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWU)" />
          </g>

          {step >= 1 && (
            <g>
              <g className={s.morphIn}>
                <line x1={xExplorer + 12} y1={232} x2={xExplorer + 28} y2={232} stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />
                <CajaNodo x={xExplorer + 32} y={218} width={210} texto={r.arbol.nuevoWu} protagonista />
                <line x1={xDisco + 12} y1={232} x2={xDisco + 28} y2={232} stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />
                <CajaNodo x={xDisco + 32} y={218} width={240} texto={r.archivos.nuevoWu} protagonista />
                <Etiqueta x={xDisco + 32 + 240 + 12} y={221} texto={r.nuevo} color={AMBAR} width={70} />
              </g>
              <g className={s.morphIn} style={{ animationDelay: '0.6s' }}>
                <RamaArbol x={xExplorer + 48} y1={246} y2={276} />
                <HojaArbol x={xExplorer + 48} y={276} texto={r.arbol.ambiente} />
              </g>
              <g className={s.morphIn} style={{ animationDelay: '1.2s' }}>
                <line x1={xFlechaInicio} y1={232} x2={xFlechaFin} y2={232} stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWU)" />
              </g>
              <g className={s.morphIn} style={{ animationDelay: '1.8s' }}>
                <Etiqueta x={xDisco + 32 + 240 + 12} y={91} texto={r.sinCambios} color={TEAL} width={96} />
              </g>
            </g>
          )}
        </svg>
        <figcaption>{r.captions[step]}</figcaption>
      </figure>
    </>
  );
}

/* ---------- Idea 3: repartir el proyecto ---------- */

const ALTO_FILA_WU: number = 52;

/* Paso 0: el Default entra y pulsa; los Work Units de bloque entran después, uno a uno.
   Paso 1: etiquetas de personas (Ana 0 s, Luis 0.3 s) y el conflicto en interfaz (1.5 s). */
function ColumnaWorkUnits({ x, titulo, filas, personas, equipo }: { x: number; titulo: string; filas: readonly string[]; personas: Textos['repartir']['personas']; equipo: boolean }) {
  const etiquetas: Array<{ texto: string; color: string; delay: string } | null> = [
    null,
    { texto: personas.ana, color: TEAL, delay: '0s' },
    { texto: personas.luis, color: TEAL, delay: '0.3s' },
    { texto: personas.ambos, color: ROJO, delay: '1.5s' },
    null,
  ];
  return (
    <g>
      <text x={x + 4} y={30} fontSize="13" opacity=".85">
        {titulo}
      </text>
      {filas.map((fila, index) => {
        const y: number = 50 + index * ALTO_FILA_WU;
        const esDefault: boolean = index === 0;
        const etiqueta = equipo ? etiquetas[index] : null;
        const conflicto: boolean = equipo && etiqueta !== null && etiqueta.color === ROJO;
        const entrada: string = esDefault ? '0s' : `${1.2 + (index - 1) * 0.3}s`;
        return (
          <g key={fila}>
            <g className={s.morphIn} style={{ animationDelay: entrada }}>
              {esDefault ? (
                <Pulso delay="0.6s">
                  <CajaNodo x={x + 24} y={y} width={300} texto={fila} atenuada />
                </Pulso>
              ) : (
                <CajaNodo x={x + 24} y={y} width={300} texto={fila} protagonista={!conflicto} />
              )}
            </g>
            {conflicto && (
              <g className={s.morphIn} style={{ animationDelay: '1.5s' }}>
                <rect x={x + 24} y={y} width={300} height={28} rx="6" fill="none" stroke={ROJO} strokeWidth="2" />
              </g>
            )}
            {etiqueta && (
              <g className={s.morphIn} style={{ animationDelay: etiqueta.delay }}>
                <Etiqueta x={x + 336} y={y + 3} texto={etiqueta.texto} color={etiqueta.color} width={84} />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

function ContenidoRepartir({ t }: { t: Textos }) {
  const step: number = useSlideStep();
  const r = t.repartir;
  const equipo: boolean = step >= 1;
  return (
    <>
      <EsquemaIdeas t={t} actual={2} />
      <div className={s.eyebrow}>{r.eyebrow}</div>
      <h2 className={s.h2TwoLines}>{r.titles[step]}</h2>
      <figure>
        <svg viewBox="0 0 940 360" role="img" aria-label={r.arias[step]}>
          <ColumnaWorkUnits x={20} titulo={r.containers} filas={r.filas} personas={r.personas} equipo={equipo} />
          <ColumnaWorkUnits x={500} titulo={r.events} filas={r.filas} personas={r.personas} equipo={equipo} />
          {equipo && (
            <g>
              <g className={s.morphIn} style={{ animationDelay: '0.9s' }}>
                <text x={20} y={340} fontSize="12" fill={TEAL} className={s.svgSans}>
                  {r.leyenda.distinto}
                </text>
              </g>
              <g className={s.morphIn} style={{ animationDelay: '2.1s' }}>
                <text x={500} y={340} fontSize="12" fill={ROJO} className={s.svgSans}>
                  {r.leyenda.mismo}
                </text>
              </g>
            </g>
          )}
        </svg>
        <figcaption>{r.captions[step]}</figcaption>
      </figure>
    </>
  );
}

/* ---------- Deck ---------- */

export default function WorkUnitsYVcs(): ReactElement {
  const t = useT(workUnitsDict);

  return (
    <Deck name={t.name} context={t.context}>
      <Slide z="▶" label={t.labels.intro} backgroundImage="/assets/presentations/wwise-unreal/Cover.jpg">
        <div className={s.eyebrow}>{t.cover.eyebrow}</div>
        <h1>{t.cover.title}</h1>
        <p className={s.note}>{t.cover.hint}</p>
      </Slide>

      <Slide z="0" label={[t.labels.ideas, t.labels.ideaArchivos, t.labels.ideaWorkUnit, t.labels.ideaRepartir]} notes={t.ideas.notes}>
        <div className={s.eyebrow}>{t.ideas.eyebrow}</div>
        <h2>{t.ideas.title}</h2>
        <FiguraIdeas t={t} />
      </Slide>

      <Slide z="1" label={[t.labels.wwise, t.labels.unreal, t.labels.binarios]} notes={t.archivos.notes}>
        <ContenidoArchivos t={t} />
      </Slide>

      <Slide z="2" label={[t.labels.archivoWwu, t.labels.nuevoWorkUnit]} notes={t.workUnit.notes}>
        <ContenidoWorkUnit t={t} />
      </Slide>

      <Slide z="3" label={[t.labels.solo, t.labels.equipo]} notes={t.repartir.notes}>
        <ContenidoRepartir t={t} />
      </Slide>
    </Deck>
  );
}
