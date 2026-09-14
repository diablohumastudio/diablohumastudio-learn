import type { CSSProperties, ReactElement } from 'react';
import Deck, { Slide, useSlideStep } from '../../components/learn/Deck';
import s from '../../components/learn/Deck.module.css';
import { useT } from '../../i18n/useT';
import { wwiseObjectsDict } from './wwise-objects.dict';

const AMBAR: string = '#f2a33c';
const TEAL: string = '#63b6a4';
const ROJO: string = '#d9646a';
const SFX_COLOR: string = '#6f9fd8';
const MUSIC_COLOR: string = '#a88bd4';
const FONDO: string = '#1d2026';
const FONDO_PROTAGONISTA: string = '#232730';
const INTERLINEADO: number = 17;

type CajaTextos = { nombre: string; subs: string[] };
type CajaEstilo = 'normal' | 'protagonista' | 'teal' | 'atenuada';

type CajaProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  caja: CajaTextos;
  estilo?: CajaEstilo;
  /** Draws the first sub in amber (the container's question). */
  primerSubAmbar?: boolean;
  /** Overrides the border and name color (the SFX / Music columns, the red counterexample). */
  colorBorde?: string;
  /** Small label in the top-left corner (e.g. ACTION). */
  esquina?: string;
};

/* Caja con título y subtítulos centrados verticalmente. */
function Caja({ x, y, width, height, caja, estilo = 'normal', primerSubAmbar = false, colorBorde, esquina }: CajaProps) {
  const lineas: number = 1 + caja.subs.length;
  const primeraLinea: number = y + height / 2 - ((lineas - 1) * INTERLINEADO) / 2 + 4.5;
  const centroX: number = x + width / 2;
  const fill: string = estilo === 'protagonista' ? FONDO_PROTAGONISTA : FONDO;
  const stroke: string = colorBorde ?? (estilo === 'protagonista' ? AMBAR : estilo === 'teal' ? TEAL : 'currentColor');
  const strokeOpacity: string = colorBorde ? '1' : estilo === 'normal' ? '.35' : estilo === 'atenuada' ? '.2' : '1';
  const colorNombre: string = colorBorde ?? (estilo === 'protagonista' ? AMBAR : estilo === 'teal' ? TEAL : 'currentColor');
  const opacidadNombre: string = estilo === 'atenuada' ? '.5' : '1';
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="8" fill={fill} stroke={stroke} strokeOpacity={strokeOpacity} />
      {esquina && (
        <text x={x + 8} y={y + 11} fontSize="8" fill={colorNombre} opacity=".55" letterSpacing="1.5">
          {esquina}
        </text>
      )}
      <text x={centroX} y={primeraLinea} fontSize="12" fill={colorNombre} opacity={opacidadNombre} textAnchor="middle">
        {caja.nombre}
      </text>
      {caja.subs.map((sub, index) => {
        const esPregunta: boolean = primerSubAmbar && index === 0;
        return (
          <text
            key={sub}
            x={centroX}
            y={primeraLinea + (index + 1) * INTERLINEADO}
            fontSize={esPregunta ? '11' : '10.5'}
            fill={esPregunta ? AMBAR : 'currentColor'}
            opacity={esPregunta ? '.9' : '.6'}
            textAnchor="middle"
          >
            {sub}
          </text>
        );
      })}
    </g>
  );
}

/* Cada SVG declara sus marcadores con id único: `${id}` ámbar y `${id}t` teal. */
function Marcadores({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={AMBAR} />
      </marker>
      <marker id={`${id}t`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={TEAL} />
      </marker>
    </defs>
  );
}

function Panel({ x, y, width, height, titulo }: { x: number; y: number; width: number; height: number; titulo: string }) {
  return (
    <>
      <rect x={x} y={y} width={width} height={height} rx="10" fill="none" stroke="currentColor" strokeOpacity=".35" />
      <text x={x + 16} y={y + 26} fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">
        {titulo}
      </text>
    </>
  );
}

type FamiliasTextos = (typeof wwiseObjectsDict.es)['familias'];
type FlujoTextos = (typeof wwiseObjectsDict.es)['flujo'];
type GameSyncsTextos = (typeof wwiseObjectsDict.es)['gameSyncs'];

/* ==================== */
/* Las cinco familias   */
/* ==================== */

/* Se dibujan con el mismo tamaño en el flujo y en la clasificación (mismo
   viewBox 940×410), así la clasificación puede deslizarlas (morphGlide) desde
   donde estaban en el flujo. */
const FAMILIA_ALTO: number = 192;
const GAME_INPUT_ANCHO: number = 200;
const CONTENIDO_ANCHO: number = 360;
const MIXING_ALTO: number = 56;
const PROCESAMIENTO_ANCHO: number = 140;
const PROCESAMIENTO_ALTO: number = 110;
const PACKAGING_ANCHO: number = 140;
const PACKAGING_ALTO: number = 80;
const CELDA_ALTO: number = 60;
const CELDA_ANCHO: number = 158;

type Posicion = { x: number; y: number };
type PosicionesFamilias = { gameInput: Posicion; contenido: Posicion; mixing: Posicion; procesamiento: Posicion };

const FLUJO: PosicionesFamilias = {
  gameInput: { x: 140, y: 50 },
  contenido: { x: 380, y: 50 },
  mixing: { x: 380, y: 278 },
  procesamiento: { x: 790, y: 100 },
};

const CLASIFICACION: PosicionesFamilias & { packaging: Posicion } = {
  gameInput: { x: 90, y: 70 },
  contenido: { x: 320, y: 70 },
  mixing: { x: 320, y: 286 },
  procesamiento: { x: 710, y: 70 },
  packaging: { x: 710, y: 200 },
};

function MarcoFamilia({ x, y, width, height, titulo, pregunta }: Posicion & { width: number; height: number; titulo: string; pregunta: string }) {
  return (
    <>
      <rect x={x} y={y} width={width} height={height} rx="10" fill={FONDO_PROTAGONISTA} stroke={AMBAR} strokeOpacity=".8" />
      <text x={x + 16} y={y + 22} fontSize="11.5" fill={AMBAR} letterSpacing="2">
        {titulo}
      </text>
      <text x={x + 16} y={y + 38} fontSize="10.5" fill="currentColor" opacity=".6">
        {pregunta}
      </text>
    </>
  );
}

function CajaGameInput({ x, y, f }: Posicion & { f: FamiliasTextos['gameInput'] }) {
  return (
    <g>
      <MarcoFamilia x={x} y={y} width={GAME_INPUT_ANCHO} height={FAMILIA_ALTO} titulo={f.titulo} pregunta={f.pregunta} />
      <Caja x={x + 16} y={y + 56} width={GAME_INPUT_ANCHO - 32} height={CELDA_ALTO} caja={f.events} estilo="teal" />
      <Caja x={x + 16} y={y + 124} width={GAME_INPUT_ANCHO - 32} height={CELDA_ALTO} caja={f.gameSyncs} estilo="teal" />
    </g>
  );
}

/* Grilla 2×2: filas Sonido / Estructura, columnas SFX / Music (cada columna con su color). */
function CajaContenido({ x, y, f }: Posicion & { f: FamiliasTextos['contenido'] }) {
  const columnas: { x: number; rotulo: string; color: string }[] = [
    { x: x + 16, rotulo: f.sfx, color: SFX_COLOR },
    { x: x + 16 + CELDA_ANCHO + 12, rotulo: f.music, color: MUSIC_COLOR },
  ];
  const filasY: number[] = [y + 56, y + 124];
  return (
    <g>
      <MarcoFamilia x={x} y={y} width={CONTENIDO_ANCHO} height={FAMILIA_ALTO} titulo={f.titulo} pregunta={f.pregunta} />
      {filasY.map((filaY, fila) =>
        columnas.map((columna, indice) => (
          <g key={`${fila}-${columna.rotulo}`}>
            <Caja x={columna.x} y={filaY} width={CELDA_ANCHO} height={CELDA_ALTO} caja={f.celdas[fila * 2 + indice]} colorBorde={columna.color} />
            <text x={columna.x + CELDA_ANCHO - 7} y={filaY + 11} fontSize="8" fill={columna.color} letterSpacing="1.5" textAnchor="end">
              {columna.rotulo}
            </text>
          </g>
        ))
      )}
    </g>
  );
}

function CajaMixing({ x, y, caja }: Posicion & { caja: CajaTextos }) {
  return <Caja x={x} y={y} width={CONTENIDO_ANCHO} height={MIXING_ALTO} caja={caja} estilo="protagonista" />;
}

function CajaProcesamiento({ x, y, caja }: Posicion & { caja: CajaTextos }) {
  return <Caja x={x} y={y} width={PROCESAMIENTO_ANCHO} height={PROCESAMIENTO_ALTO} caja={caja} estilo="protagonista" />;
}

function CajaPackaging({ x, y, caja }: Posicion & { caja: CajaTextos }) {
  return <Caja x={x} y={y} width={PACKAGING_ANCHO} height={PACKAGING_ALTO} caja={caja} estilo="protagonista" />;
}

function desdePosicion(desde: Posicion, hasta: Posicion): CSSProperties {
  return { '--morph-from': `translate(${desde.x - hasta.x}px, ${desde.y - hasta.y}px)` } as CSSProperties;
}

/* ==================== */
/* El flujo             */
/* ==================== */

/* Piezas del flujo alrededor de las familias, en coordenadas de FLUJO. `m` es el
   prefijo de los marcadores del SVG que las dibuja. */
function GameYSalida({ r, m }: { r: FlujoTextos; m: string }) {
  return (
    <>
      <Caja x={10} y={118} width={90} height={48} caja={{ nombre: r.game, subs: [] }} />
      <line x1="100" y1="142" x2="136" y2="142" stroke={AMBAR} strokeWidth="2" markerEnd={`url(#${m})`} />
      <Caja x={505} y={358} width={110} height={44} caja={{ nombre: r.salida, subs: [] }} />
    </>
  );
}

function FlechasGameInput({ r, m }: { r: FlujoTextos; m: string }) {
  return (
    <>
      <line x1="340" y1="142" x2="376" y2="142" stroke={TEAL} strokeWidth="2" markerEnd={`url(#${m}t)`} />
      <path d="M 240 242 L 240 294 Q 240 306 252 306 L 376 306" fill="none" stroke={TEAL} strokeWidth="2" markerEnd={`url(#${m}t)`} />
      <path d="M 240 50 L 240 42 Q 240 30 252 30 L 848 30 Q 860 30 860 42 L 860 96" fill="none" stroke={TEAL} strokeWidth="2" markerEnd={`url(#${m}t)`} />
      <text x="560" y="24" fontSize="10" fill={TEAL} textAnchor="middle">
        {r.parametros}
      </text>
    </>
  );
}

function FlechasSenal({ r, m }: { r: FlujoTextos; m: string }) {
  return (
    <>
      <line x1="560" y1="242" x2="560" y2="274" stroke={AMBAR} strokeWidth="2" markerEnd={`url(#${m})`} />
      <text x="570" y="262" fontSize="10" fill={AMBAR}>
        {r.senal}
      </text>
      <line x1="560" y1="334" x2="560" y2="354" stroke={AMBAR} strokeWidth="2" markerEnd={`url(#${m})`} />
    </>
  );
}

function FlechasProcesamiento({ m }: { m: string }) {
  return (
    <>
      <line x1="790" y1="155" x2="744" y2="155" stroke={TEAL} strokeWidth="2" markerEnd={`url(#${m}t)`} />
      <path d="M 860 210 L 860 294 Q 860 306 848 306 L 744 306" fill="none" stroke={TEAL} strokeWidth="2" markerEnd={`url(#${m}t)`} />
    </>
  );
}

function MarcoSoundBanks({ r }: { r: FlujoTextos }) {
  return (
    <>
      <rect x="128" y="12" width="808" height="334" rx="10" fill="none" stroke={AMBAR} strokeOpacity=".5" strokeDasharray="6 6" />
      <text x="140" y="341" fontSize="10" fill={AMBAR} opacity=".8">
        {r.soundBank}
      </text>
    </>
  );
}

/* Escena del flujo: cada paso añade sus flechas y anima solo esas. Con
   `paso` fijo en el último dibuja el estado final (el cierre). */
function EscenaFlujo({ paso, f, r, m }: { paso: number; f: FamiliasTextos; r: FlujoTextos; m: string }) {
  const pieza = (indice: number): string | undefined => (paso === indice ? s.morphIn : undefined);
  return (
    <>
      <CajaGameInput x={FLUJO.gameInput.x} y={FLUJO.gameInput.y} f={f.gameInput} />
      <CajaContenido x={FLUJO.contenido.x} y={FLUJO.contenido.y} f={f.contenido} />
      <CajaMixing x={FLUJO.mixing.x} y={FLUJO.mixing.y} caja={f.mixing} />
      <CajaProcesamiento x={FLUJO.procesamiento.x} y={FLUJO.procesamiento.y} caja={f.procesamiento} />
      <GameYSalida r={r} m={m} />

      {paso >= 1 && (
        <g className={pieza(1)}>
          <FlechasGameInput r={r} m={m} />
        </g>
      )}
      {paso >= 2 && (
        <g className={pieza(2)}>
          <FlechasSenal r={r} m={m} />
        </g>
      )}
      {paso >= 3 && (
        <g className={pieza(3)}>
          <FlechasProcesamiento m={m} />
        </g>
      )}
      {paso >= 4 && (
        <g className={pieza(4)}>
          <MarcoSoundBanks r={r} />
        </g>
      )}
    </>
  );
}

/* Un solo slide con cinco pasos; el paso actual lo da el Deck. */
function FiguraFlujo({ f, r }: { f: FamiliasTextos; r: FlujoTextos }) {
  const paso = useSlideStep();
  return (
    <figure>
      <svg viewBox="0 0 940 410" role="img" aria-label={r.arias[paso]}>
        <Marcadores id="arrWO1" />
        <EscenaFlujo paso={paso} f={f} r={r} m="arrWO1" />
      </svg>
      <figcaption>{r.captions[paso]}</figcaption>
    </figure>
  );
}

/* ==================== */
/* La miniatura         */
/* ==================== */

type Resaltado = 'events' | 'gameSyncs' | 'sonido' | 'estructura' | 'mixing' | 'procesamiento' | 'packaging';

const MINI_TEXTO_GRIS: string = '.35';
const MINI_BORDE_GRIS: string = '.25';
const MINI_CAJA_ANCHO: number = 60;
const MINI_CAJA_ALTO: number = 18;
/* Sonido y Estructura van en una sola caja cada uno, 1.4× de ancho, para que
   la silueta se parezca a la clasificación grande. */
const MINI_CONTENIDO_ANCHO: number = 84;

function CajaMini({ x, y, width, height, texto, activa }: { x: number; y: number; width: number; height: number; texto: string; activa: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="3"
        fill={activa ? FONDO_PROTAGONISTA : FONDO}
        stroke={activa ? AMBAR : 'currentColor'}
        strokeOpacity={activa ? '1' : MINI_BORDE_GRIS}
      />
      <text x={x + width / 2} y={y + height / 2 + 2.5} fontSize="7.5" fill={activa ? AMBAR : 'currentColor'} opacity={activa ? '1' : MINI_TEXTO_GRIS} textAnchor="middle">
        {texto}
      </text>
    </g>
  );
}

function MarcoMini({ x, y, width, height, titulo }: { x: number; y: number; width: number; height: number; titulo: string }) {
  return (
    <>
      <rect x={x} y={y} width={width} height={height} rx="4" fill="none" stroke="currentColor" strokeOpacity={MINI_BORDE_GRIS} />
      <text x={x + 3} y={y + 9} fontSize="6.5" fill="currentColor" opacity={MINI_TEXTO_GRIS} letterSpacing="1">
        {titulo}
      </text>
    </>
  );
}

/* Miniatura de la clasificación, solo títulos: todo en gris salvo la caja de la
   familia del slide actual. Con `entraGrande`, aparece del tamaño de la
   clasificación grande y se encoge hasta su lugar. */
function Minimapa({ resaltado, f, entraGrande = false }: { resaltado: Resaltado; f: FamiliasTextos; entraGrande?: boolean }) {
  const activa = (clave: Resaltado): boolean => clave === resaltado;
  const estiloEntrada: CSSProperties | undefined = entraGrande
    ? ({ '--morph-from': 'translate(0px, 110px) scale(4.4)', transformOrigin: '0 0', animationDuration: '0.9s' } as CSSProperties)
    : undefined;
  return (
    <svg className={`${s.minimap} ${entraGrande ? s.morphGlide : ''}`} style={estiloEntrada} viewBox="0 0 234 78" aria-hidden="true">
      <MarcoMini x={0} y={0} width={66} height={55} titulo={f.gameInput.titulo} />
      <CajaMini x={3} y={13} width={MINI_CAJA_ANCHO} height={MINI_CAJA_ALTO} texto={f.gameInput.events.nombre} activa={activa('events')} />
      <CajaMini x={3} y={34} width={MINI_CAJA_ANCHO} height={MINI_CAJA_ALTO} texto={f.gameInput.gameSyncs.nombre} activa={activa('gameSyncs')} />

      <MarcoMini x={72} y={0} width={90} height={55} titulo={f.contenido.titulo} />
      <CajaMini x={75} y={13} width={MINI_CONTENIDO_ANCHO} height={MINI_CAJA_ALTO} texto={f.contenido.celdas[0].nombre} activa={activa('sonido')} />
      <CajaMini x={75} y={34} width={MINI_CONTENIDO_ANCHO} height={MINI_CAJA_ALTO} texto={f.contenido.celdas[2].nombre} activa={activa('estructura')} />

      <CajaMini x={72} y={60} width={90} height={MINI_CAJA_ALTO} texto={f.mixing.nombre} activa={activa('mixing')} />
      <CajaMini x={168} y={0} width={66} height={28} texto={f.procesamiento.nombre} activa={activa('procesamiento')} />
      <CajaMini x={168} y={33} width={66} height={22} texto={f.packaging.nombre} activa={activa('packaging')} />
    </svg>
  );
}

/* ==================== */
/* Dispositivos         */
/* ==================== */

function IconoParlante({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g fill="none" stroke={AMBAR} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <rect x={cx - 20} y={cy - 10} width="14" height="20" rx="2" />
      <polygon points={`${cx - 6},${cy - 10} ${cx + 6},${cy - 20} ${cx + 6},${cy + 20} ${cx - 6},${cy + 10}`} />
      <path d={`M ${cx + 12} ${cy - 7} Q ${cx + 18} ${cy} ${cx + 12} ${cy + 7}`} />
      <path d={`M ${cx + 17} ${cy - 13} Q ${cx + 26} ${cy} ${cx + 17} ${cy + 13}`} />
    </g>
  );
}

function IconoControl({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g fill="none" stroke={AMBAR} strokeWidth="2" strokeLinecap="round">
      <rect x={cx - 24} y={cy - 11} width="48" height="22" rx="9" />
      <line x1={cx - 14} y1={cy - 5} x2={cx - 14} y2={cy + 5} />
      <line x1={cx - 19} y1={cy} x2={cx - 9} y2={cy} />
      <circle cx={cx + 11} cy={cy - 3} r="2" fill={AMBAR} />
      <circle cx={cx + 17} cy={cy + 3} r="2" fill={AMBAR} />
    </g>
  );
}

function IconoAudifonos({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g fill="none" stroke={AMBAR} strokeWidth="2" strokeLinecap="round">
      <path d={`M ${cx - 18} ${cy + 6} A 18 18 0 0 1 ${cx + 18} ${cy + 6}`} />
      <rect x={cx - 23} y={cy + 4} width="9" height="14" rx="2" fill={FONDO} />
      <rect x={cx + 14} y={cy + 4} width="9" height="14" rx="2" fill={FONDO} />
    </g>
  );
}

/* ==================== */
/* Game Syncs           */
/* ==================== */

type DibujoProps = { x: number; y: number; d: GameSyncsTextos['dibujos'] };

/* Dos selectores de tres posiciones, uno por Game Object (alcance local). */
function DibujoSwitch({ x, y, d }: DibujoProps) {
  const filas: { objeto: string; y: number; elegido: number }[] = [
    { objeto: d.switchObjetos[0], y: y + 66, elegido: 0 },
    { objeto: d.switchObjetos[1], y: y + 98, elegido: 2 },
  ];
  return (
    <g>
      {filas.map((fila) => (
        <g key={fila.objeto}>
          <text x={x + 22} y={fila.y + 11} fontSize="9" fill="currentColor" opacity=".8">
            {fila.objeto}
          </text>
          {d.switchValores.map((valor, indice) => {
            const elegido: boolean = indice === fila.elegido;
            const celdaX: number = x + 98 + indice * 30;
            return (
              <g key={valor}>
                <rect x={celdaX} y={fila.y} width="27" height="16" rx="3" fill={elegido ? AMBAR : 'none'} stroke={elegido ? AMBAR : 'currentColor'} strokeOpacity={elegido ? '1' : '.4'} />
                <text x={celdaX + 13.5} y={fila.y + 11} fontSize="7" fill={elegido ? FONDO : 'currentColor'} opacity={elegido ? '1' : '.6'} textAnchor="middle">
                  {valor}
                </text>
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

/* Un solo selector, con un marco que lo declara global. */
function DibujoState({ x, y, d }: DibujoProps) {
  return (
    <g>
      <text x={x + 105} y={y + 66} fontSize="8.5" fill={TEAL} textAnchor="middle">
        {d.stateMarco}
      </text>
      <rect x={x + 20} y={y + 72} width="170" height="46" rx="6" fill="none" stroke={TEAL} strokeDasharray="4 3" />
      {d.stateValores.map((valor, indice) => {
        const elegido: boolean = indice === 0;
        const celdaX: number = x + 30 + indice * 55;
        return (
          <g key={valor}>
            <rect x={celdaX} y={y + 85} width="50" height="20" rx="3" fill={elegido ? AMBAR : 'none'} stroke={elegido ? AMBAR : 'currentColor'} strokeOpacity={elegido ? '1' : '.4'} />
            <text x={celdaX + 25} y={y + 98} fontSize="8.5" fill={elegido ? FONDO : 'currentColor'} opacity={elegido ? '1' : '.6'} textAnchor="middle">
              {valor}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* Ejes, curva y el punto del valor actual. */
function DibujoRtpc({ x, y, d }: DibujoProps) {
  return (
    <g>
      <line x1={x + 40} y1={y + 118} x2={x + 192} y2={y + 118} stroke="currentColor" strokeOpacity=".4" />
      <line x1={x + 40} y1={y + 118} x2={x + 40} y2={y + 58} stroke="currentColor" strokeOpacity=".4" />
      <polyline
        points={`${x + 40},${y + 114} ${x + 70},${y + 110} ${x + 100},${y + 98} ${x + 130},${y + 78} ${x + 160},${y + 64} ${x + 190},${y + 60}`}
        fill="none"
        stroke={AMBAR}
        strokeWidth="2"
      />
      <circle cx={x + 130} cy={y + 78} r="3.5" fill={AMBAR} />
      <text x={x + 192} y={y + 129} fontSize="8.5" fill="currentColor" opacity=".6" textAnchor="end">
        {d.rtpcEjeX}
      </text>
      <text x={x + 35} y={y + 62} fontSize="8.5" fill="currentColor" opacity=".6" textAnchor="end">
        {d.rtpcEjeY}
      </text>
    </g>
  );
}

/* Un pulso que cae en el siguiente tiempo del compás. */
function DibujoTrigger({ x, y, d }: DibujoProps) {
  const ticksX: number[] = [x + 130, x + 148, x + 166, x + 184];
  return (
    <g>
      <text x={x + 60} y={y + 62} fontSize="8.5" fill={AMBAR} textAnchor="middle">
        {d.triggerStinger}
      </text>
      <polyline points={`${x + 20},${y + 112} ${x + 56},${y + 112} ${x + 60},${y + 68} ${x + 64},${y + 112} ${x + 110},${y + 112}`} fill="none" stroke={AMBAR} strokeWidth="2" />
      <line x1={x + 120} y1={y + 112} x2={x + 194} y2={y + 112} stroke="currentColor" strokeOpacity=".5" />
      {ticksX.map((tickX, indice) => (
        <line key={tickX} x1={tickX} y1={y + 96} x2={tickX} y2={y + 112} stroke={indice === 2 ? AMBAR : 'currentColor'} strokeOpacity={indice === 2 ? '1' : '.5'} strokeWidth={indice === 2 ? '2' : '1'} />
      ))}
      <path d={`M ${x + 68} ${y + 80} L ${x + 154} ${y + 80} Q ${x + 166} ${y + 80} ${x + 166} ${y + 92} L ${x + 166} ${y + 93}`} fill="none" stroke={AMBAR} strokeWidth="1.5" strokeDasharray="3 3" />
      <text x={x + 157} y={y + 126} fontSize="8.5" fill="currentColor" opacity=".6" textAnchor="middle">
        {d.triggerCompas}
      </text>
    </g>
  );
}

const GAME_SYNC_ANCHO: number = 210;
const GAME_SYNC_ALTO: number = 156;

/* Caja de un Game Sync: nombre, alcance, dibujo y ejemplo. */
function CajaGameSync({ x, y, caja, d, Dibujo }: { x: number; y: number; caja: CajaTextos; d: GameSyncsTextos['dibujos']; Dibujo: (props: DibujoProps) => ReactElement }) {
  return (
    <g>
      <rect x={x} y={y} width={GAME_SYNC_ANCHO} height={GAME_SYNC_ALTO} rx="8" fill={FONDO_PROTAGONISTA} stroke={AMBAR} />
      <text x={x + GAME_SYNC_ANCHO / 2} y={y + 20} fontSize="12" fill={AMBAR} textAnchor="middle">
        {caja.nombre}
      </text>
      <text x={x + GAME_SYNC_ANCHO / 2} y={y + 36} fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">
        {caja.subs[0]}
      </text>
      <Dibujo x={x} y={y} d={d} />
      <text x={x + GAME_SYNC_ANCHO / 2} y={y + 146} fontSize="10.5" fill="currentColor" opacity=".8" textAnchor="middle">
        {caja.subs[1]}
      </text>
    </g>
  );
}

const DIBUJOS_GAME_SYNCS: ((props: DibujoProps) => ReactElement)[] = [DibujoSwitch, DibujoState, DibujoRtpc, DibujoTrigger];

/* ==================== */
/* Constantes de layout */
/* ==================== */

const CATALOGO_FILA1_X: number[] = [16, 200, 384, 568, 752];
const CATALOGO_FILA2_X: number[] = [200, 384, 568];
const CATALOGO_ANCHO: number = 172;
/* Column color of each object of the sound and structure slides; undefined = neutral. */
const SONIDO_COLORES: (string | undefined)[] = [SFX_COLOR, SFX_COLOR, MUSIC_COLOR, MUSIC_COLOR, undefined];
const ESTRUCTURA_COLORES: (string | undefined)[] = [undefined, SFX_COLOR, SFX_COLOR, SFX_COLOR, SFX_COLOR, MUSIC_COLOR, MUSIC_COLOR, undefined];
const HOJAS_X: number[] = [40, 300, 560];
const GAME_SYNCS_X: number[] = [20, 246, 472, 698];
const VOCES_Y: number[] = [70, 130, 190];

export default function WwiseObjects() {
  const t = useT(wwiseObjectsDict);

  return (
    <Deck name={t.name} context={t.context}>
      <Slide z="▶" label={t.labels.intro} backgroundImage="/assets/presentations/wwise-unreal/WwiseObjectsCover.jpg">
        <div className={s.eyebrow}>{t.cover.eyebrow}</div>
        <h1>{t.cover.title}</h1>
        <p className={s.note}>{t.cover.hint}</p>
      </Slide>

      <Slide z="1" label={[...t.labels.flujo]}>
        <div className={s.eyebrow}>{t.flujo.eyebrow}</div>
        <h2>{t.flujo.title}</h2>
        <FiguraFlujo f={t.familias} r={t.flujo} />
      </Slide>

      <Slide z="=" label={t.labels.clasificacion}>
        <div className={s.eyebrow}>{t.clasificacion.eyebrow}</div>
        <h2>{t.clasificacion.title}</h2>
        <figure>
          <svg viewBox="0 0 940 410" role="img" aria-label={t.clasificacion.aria}>
            <Marcadores id="arrWO0" />
            <g className={s.morphOut}>
              <GameYSalida r={t.flujo} m="arrWO0" />
              <FlechasGameInput r={t.flujo} m="arrWO0" />
              <FlechasSenal r={t.flujo} m="arrWO0" />
              <FlechasProcesamiento m="arrWO0" />
              <MarcoSoundBanks r={t.flujo} />
            </g>
            <g className={s.morphGlide} style={desdePosicion(FLUJO.gameInput, CLASIFICACION.gameInput)}>
              <CajaGameInput x={CLASIFICACION.gameInput.x} y={CLASIFICACION.gameInput.y} f={t.familias.gameInput} />
            </g>
            <g className={s.morphGlide} style={desdePosicion(FLUJO.contenido, CLASIFICACION.contenido)}>
              <CajaContenido x={CLASIFICACION.contenido.x} y={CLASIFICACION.contenido.y} f={t.familias.contenido} />
            </g>
            <g className={s.morphGlide} style={desdePosicion(FLUJO.mixing, CLASIFICACION.mixing)}>
              <CajaMixing x={CLASIFICACION.mixing.x} y={CLASIFICACION.mixing.y} caja={t.familias.mixing} />
            </g>
            <g className={s.morphGlide} style={desdePosicion(FLUJO.procesamiento, CLASIFICACION.procesamiento)}>
              <CajaProcesamiento x={CLASIFICACION.procesamiento.x} y={CLASIFICACION.procesamiento.y} caja={t.familias.procesamiento} />
            </g>
            <g className={s.morphIn} style={{ animationDelay: '0.6s' }}>
              <CajaPackaging x={CLASIFICACION.packaging.x} y={CLASIFICACION.packaging.y} caja={t.familias.packaging} />
            </g>
          </svg>
          <figcaption>{t.clasificacion.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="2" label={t.labels.sonido}>
        <Minimapa resaltado="sonido" f={t.familias} entraGrande />
        <div className={s.eyebrow}>{t.sonido.eyebrow}</div>
        <h2>{t.sonido.title}</h2>
        <figure>
          <svg viewBox="0 0 940 260" role="img" aria-label={t.sonido.aria}>
            <Marcadores id="arrWO2" />
            {CATALOGO_FILA1_X.map((x, index) => (
              <g key={t.sonido.objetos[index].nombre}>
                <Caja x={x} y={30} width={CATALOGO_ANCHO} height={84} caja={t.sonido.objetos[index]} colorBorde={SONIDO_COLORES[index]} />
                <line x1={x + CATALOGO_ANCHO / 2} y1="114" x2={x + CATALOGO_ANCHO / 2} y2="182" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrWO2t)" />
              </g>
            ))}
            <rect x="16" y="186" width="908" height="44" rx="8" fill={FONDO} stroke={TEAL} />
            <text x="470" y="213" fontSize="12" fill={TEAL} letterSpacing="2" textAnchor="middle">
              {t.sonido.audioData}
            </text>
          </svg>
          <figcaption>{t.sonido.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label={t.labels.estructura}>
        <Minimapa resaltado="estructura" f={t.familias} />
        <div className={s.eyebrow}>{t.estructura.eyebrow}</div>
        <h2>{t.estructura.title}</h2>
        <figure>
          <svg viewBox="0 0 940 240" role="img" aria-label={t.estructura.aria}>
            {CATALOGO_FILA1_X.map((x, index) => (
              <Caja
                key={t.estructura.contenedores[index].nombre}
                x={x}
                y={16}
                width={CATALOGO_ANCHO}
                height={88}
                caja={t.estructura.contenedores[index]}
                colorBorde={ESTRUCTURA_COLORES[index]}
                primerSubAmbar
              />
            ))}
            {CATALOGO_FILA2_X.map((x, index) => (
              <Caja
                key={t.estructura.contenedores[index + 5].nombre}
                x={x}
                y={128}
                width={CATALOGO_ANCHO}
                height={88}
                caja={t.estructura.contenedores[index + 5]}
                colorBorde={ESTRUCTURA_COLORES[index + 5]}
                primerSubAmbar
              />
            ))}
          </svg>
          <figcaption>{t.estructura.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label={t.labels.herencia}>
        <Minimapa resaltado="estructura" f={t.familias} />
        <div className={s.eyebrow}>{t.herencia.eyebrow}</div>
        <h2>{t.herencia.title}</h2>
        <figure>
          <svg viewBox="0 0 940 320" role="img" aria-label={t.herencia.aria}>
            <Marcadores id="arrWO4" />
            <Caja x={340} y={20} width={260} height={64} caja={t.herencia.raiz} estilo="protagonista" />
            <path d="M 470 84 L 470 100 Q 470 112 458 112 L 282 112 Q 270 112 270 124 L 270 126" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO4)" />
            <path d="M 470 84 L 470 100 Q 470 112 482 112 L 658 112 Q 670 112 670 124 L 670 126" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO4)" />
            <Caja x={140} y={130} width={260} height={64} caja={t.herencia.medios[0]} estilo="teal" />
            <Caja x={540} y={130} width={260} height={64} caja={t.herencia.medios[1]} estilo="teal" />
            <path d="M 270 194 L 270 210 Q 270 222 258 222 L 162 222 Q 150 222 150 234 L 150 236" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO4)" />
            <path d="M 270 194 L 270 210 Q 270 222 282 222 L 398 222 Q 410 222 410 234 L 410 236" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO4)" />
            <line x1="670" y1="194" x2="670" y2="236" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO4)" />
            {HOJAS_X.map((x, index) => (
              <Caja key={t.herencia.hojas[index].nombre} x={x} y={240} width={220} height={70} caja={t.herencia.hojas[index]} estilo={index === 2 ? 'protagonista' : 'teal'} />
            ))}
          </svg>
          <figcaption>{t.herencia.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="3" label={t.labels.busses}>
        <Minimapa resaltado="mixing" f={t.familias} />
        <div className={s.eyebrow}>{t.busses.eyebrow}</div>
        <h2>{t.busses.title}</h2>
        <figure>
          <svg viewBox="0 0 940 330" role="img" aria-label={t.busses.aria}>
            <Marcadores id="arrWO5" />
            <Panel x={30} y={20} width={260} height={290} titulo={t.busses.carpetaContainers} />
            <Caja x={40} y={64} width={240} height={44} caja={t.busses.propertyContainer} />
            <line x1="160" y1="108" x2="160" y2="134" stroke="currentColor" strokeOpacity=".35" strokeWidth="2" />
            <Caja x={40} y={134} width={240} height={52} caja={t.busses.sonido} estilo="protagonista" />
            <line x1="280" y1="160" x2="376" y2="160" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO5)" />
            <text x="323" y="148" fontSize="10" fill={AMBAR} textAnchor="middle">
              {t.busses.unBus}
            </text>
            <text x="323" y="178" fontSize="10" fill={AMBAR} textAnchor="middle">
              {t.busses.seMueve}
            </text>

            <Panel x={360} y={20} width={440} height={290} titulo={t.busses.carpetaBusses} />
            <Caja x={400} y={56} width={230} height={48} caja={t.busses.main} estilo="protagonista" />
            <Caja x={380} y={134} width={130} height={52} caja={t.busses.busSfx} />
            <Caja x={520} y={134} width={130} height={52} caja={t.busses.busMusic} />
            <Caja x={660} y={134} width={130} height={52} caja={t.busses.auxReverb} estilo="teal" />
            <line x1="445" y1="134" x2="445" y2="108" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO5)" />
            <line x1="585" y1="134" x2="585" y2="108" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO5)" />
            <path d="M 725 134 L 725 108 Q 725 96 713 96 L 634 96" fill="none" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrWO5t)" />
            <Caja x={380} y={196} width={410} height={40} caja={t.busses.motion} />
            <Caja x={380} y={250} width={410} height={40} caja={t.busses.secondary} />

            <Panel x={820} y={20} width={100} height={290} titulo={t.busses.carpetaDevices} />
            <line x1="630" y1="80" x2="826" y2="80" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO5)" />
            <line x1="790" y1="216" x2="826" y2="216" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO5)" />
            <line x1="790" y1="270" x2="826" y2="270" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO5)" />
            <IconoParlante cx={870} cy={80} />
            <text className={s.svgSans} x="870" y="115" fontSize="10" fill="currentColor" opacity=".7" textAnchor="middle">
              {t.busses.parlante}
            </text>
            <IconoControl cx={870} cy={210} />
            <text className={s.svgSans} x="870" y="236" fontSize="10" fill="currentColor" opacity=".7" textAnchor="middle">
              {t.busses.control}
            </text>
            <IconoAudifonos cx={870} cy={262} />
            <text className={s.svgSans} x="870" y="298" fontSize="10" fill="currentColor" opacity=".7" textAnchor="middle">
              {t.busses.audifonos}
            </text>
          </svg>
          <figcaption>{t.busses.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label={t.labels.aux}>
        <Minimapa resaltado="mixing" f={t.familias} />
        <div className={s.eyebrow}>{t.aux.eyebrow}</div>
        <h2>{t.aux.title}</h2>
        <figure>
          <svg viewBox="0 0 940 260" role="img" aria-label={t.aux.aria}>
            <Marcadores id="arrWO6" />
            <Caja x={40} y={100} width={220} height={60} caja={t.aux.sonido} estilo="protagonista" />
            <path d="M 150 100 L 150 72 Q 150 60 162 60 L 396 60" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO6)" />
            <text x="280" y="50" fontSize="10" fill={AMBAR} textAnchor="middle">
              {t.aux.dry}
            </text>
            <path d="M 150 160 L 150 188 Q 150 200 162 200 L 396 200" fill="none" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrWO6t)" />
            <text x="280" y="216" fontSize="10" fill={TEAL} textAnchor="middle">
              {t.aux.send}
            </text>
            <Caja x={400} y={30} width={200} height={60} caja={t.aux.busSfx} />
            <Caja x={400} y={170} width={200} height={60} caja={t.aux.auxReverb} estilo="teal" />
            <path d="M 600 60 L 748 60 Q 760 60 760 72 L 760 96" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO6)" />
            <path d="M 600 200 L 748 200 Q 760 200 760 188 L 760 164" fill="none" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrWO6t)" />
            <Caja x={720} y={100} width={190} height={60} caja={t.aux.main} estilo="protagonista" />
          </svg>
          <figcaption>{t.aux.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="4" label={t.labels.efectos}>
        <Minimapa resaltado="procesamiento" f={t.familias} />
        <div className={s.eyebrow}>{t.efectos.eyebrow}</div>
        <h2>{t.efectos.title}</h2>
        <figure>
          <svg viewBox="0 0 940 300" role="img" aria-label={t.efectos.aria}>
            <Marcadores id="arrWO7" />
            <Panel x={30} y={20} width={430} height={260} titulo={t.efectos.enObjeto} />
            {VOCES_Y.map((y, index) => (
              <g key={t.efectos.voces[index]}>
                <Caja x={50} y={y} width={110} height={44} caja={{ nombre: t.efectos.voces[index], subs: [] }} />
                <line x1="160" y1={y + 22} x2="196" y2={y + 22} stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO7)" />
                <Caja x={200} y={y} width={80} height={44} caja={{ nombre: t.efectos.fx, subs: [] }} estilo="protagonista" />
              </g>
            ))}
            <path d="M 280 92 L 373 92 Q 385 92 385 104 L 385 126" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO7)" />
            <line x1="280" y1="152" x2="326" y2="152" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO7)" />
            <path d="M 280 212 L 373 212 Q 385 212 385 200 L 385 178" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO7)" />
            <Caja x={330} y={130} width={110} height={44} caja={{ nombre: t.efectos.bus, subs: [] }} />
            <text x="245" y="262" fontSize="10.5" fill={AMBAR} textAnchor="middle">
              {t.efectos.unaPorVoz}
            </text>

            <Panel x={480} y={20} width={430} height={260} titulo={t.efectos.enBus} />
            {VOCES_Y.map((y, index) => (
              <Caja key={t.efectos.voces[index]} x={500} y={y} width={110} height={44} caja={{ nombre: t.efectos.voces[index], subs: [] }} />
            ))}
            <path d="M 610 92 L 693 92 Q 705 92 705 104 L 705 126" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO7)" />
            <line x1="610" y1="152" x2="646" y2="152" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO7)" />
            <path d="M 610 212 L 693 212 Q 705 212 705 200 L 705 178" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO7)" />
            <Caja x={650} y={130} width={110} height={44} caja={{ nombre: t.efectos.bus, subs: [] }} />
            <line x1="760" y1="152" x2="806" y2="152" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO7)" />
            <Caja x={810} y={130} width={80} height={44} caja={{ nombre: t.efectos.fx, subs: [] }} estilo="protagonista" />
            <text x="695" y="262" fontSize="10.5" fill={AMBAR} textAnchor="middle">
              {t.efectos.unaParaTodo}
            </text>
          </svg>
          <figcaption>{t.efectos.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label={t.labels.sharesets}>
        <Minimapa resaltado="procesamiento" f={t.familias} />
        <div className={s.eyebrow}>{t.sharesets.eyebrow}</div>
        <h2>{t.sharesets.title}</h2>
        <figure>
          <svg viewBox="0 0 940 280" role="img" aria-label={t.sharesets.aria}>
            <Marcadores id="arrWO8" />
            <Panel x={30} y={24} width={280} height={104} titulo={t.sharesets.tipos} />
            {t.sharesets.lista.map((tipo, index) => (
              <text key={tipo} x="46" y={70 + index * 16} fontSize="10.5" fill="currentColor" opacity=".75">
                {tipo}
              </text>
            ))}
            <Caja x={360} y={30} width={240} height={64} caja={t.sharesets.shareset} estilo="protagonista" />
            <Caja x={650} y={24} width={260} height={104} caja={t.sharesets.custom} estilo="atenuada" />
            <path d="M 480 94 L 480 138 Q 480 150 468 150 L 227 150 Q 215 150 215 162 L 215 186" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO8)" />
            <line x1="480" y1="94" x2="480" y2="186" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO8)" />
            <path d="M 480 94 L 480 138 Q 480 150 492 150 L 733 150 Q 745 150 745 162 L 745 186" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO8)" />
            {[120, 385, 650].map((x, index) => (
              <Caja key={t.sharesets.usuarios[index].nombre} x={x} y={190} width={190} height={56} caja={t.sharesets.usuarios[index]} />
            ))}
          </svg>
          <figcaption>{t.sharesets.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="5" label={t.labels.events}>
        <Minimapa resaltado="events" f={t.familias} />
        <div className={s.eyebrow}>{t.events.eyebrow}</div>
        <h2>{t.events.title}</h2>
        <figure>
          <svg viewBox="0 0 940 350" role="img" aria-label={t.events.aria}>
            <Marcadores id="arrWO9" />
            <Caja x={40} y={150} width={120} height={64} caja={t.events.game} />
            <line x1="160" y1="182" x2="296" y2="182" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO9)" />
            <text x="228" y="170" fontSize="10" fill={AMBAR} textAnchor="middle">
              {t.events.postea}
            </text>
            <rect x="300" y="30" width="420" height="300" rx="10" fill={FONDO_PROTAGONISTA} stroke={AMBAR} strokeWidth="2" />
            <text x="510" y="58" fontSize="12" fill={AMBAR} textAnchor="middle">
              {t.events.event}
            </text>
            {t.events.actions.map((action, index) => {
              const esContraejemplo: boolean = index === 3;
              return (
                <Caja
                  key={`${action.nombre}-${index}`}
                  x={320}
                  y={76 + index * 52}
                  width={380}
                  height={44}
                  caja={action}
                  esquina={t.events.accion}
                  colorBorde={esContraejemplo ? ROJO : undefined}
                />
              );
            })}
            <text x="510" y="304" fontSize="10" fill={ROJO} textAnchor="middle">
              {t.events.sinArgumentos}
            </text>
          </svg>
          <figcaption>{t.events.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label={t.labels.gameSyncs}>
        <Minimapa resaltado="gameSyncs" f={t.familias} />
        <div className={s.eyebrow}>{t.gameSyncs.eyebrow}</div>
        <h2>{t.gameSyncs.title}</h2>
        <figure>
          <svg viewBox="0 0 940 360" role="img" aria-label={t.gameSyncs.aria}>
            <Marcadores id="arrWO10" />
            <Caja x={320} y={16} width={300} height={48} caja={t.gameSyncs.codigo} estilo="teal" />
            <line x1="470" y1="64" x2="470" y2="92" stroke={TEAL} strokeWidth="2" />
            <line x1="125" y1="92" x2="803" y2="92" stroke={TEAL} strokeWidth="2" />
            {GAME_SYNCS_X.map((x, index) => (
              <g key={t.gameSyncs.tipos[index].nombre}>
                <line x1={x + 105} y1="92" x2={x + 105} y2="116" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrWO10t)" />
                <CajaGameSync x={x} y={120} caja={t.gameSyncs.tipos[index]} d={t.gameSyncs.dibujos} Dibujo={DIBUJOS_GAME_SYNCS[index]} />
                <line x1={x + 105} y1="276" x2={x + 105} y2="300" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO10)" />
              </g>
            ))}
            <rect x="20" y="304" width="904" height="44" rx="8" fill={FONDO} stroke="currentColor" strokeOpacity=".35" />
            <text x="472" y="330" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">
              {t.gameSyncs.lectores}
            </text>
          </svg>
          <figcaption>{t.gameSyncs.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="6" label={t.labels.packaging}>
        <Minimapa resaltado="packaging" f={t.familias} />
        <div className={s.eyebrow}>{t.packaging.eyebrow}</div>
        <h2>{t.packaging.title}</h2>
        <figure>
          <svg viewBox="0 0 940 200" role="img" aria-label={t.packaging.aria}>
            {[30, 336, 642].map((x, index) => (
              <Caja key={t.packaging.items[index].nombre} x={x} y={30} width={280} height={120} caja={t.packaging.items[index]} estilo={index === 0 ? 'protagonista' : 'normal'} />
            ))}
          </svg>
          <figcaption>{t.packaging.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="↺" label={t.labels.cierre}>
        <div className={s.eyebrow}>{t.cierre.eyebrow}</div>
        <h2>{t.cierre.title}</h2>
        <figure>
          <svg viewBox="0 0 940 410" role="img" aria-label={t.cierre.aria}>
            <Marcadores id="arrWO12" />
            <EscenaFlujo paso={4} f={t.familias} r={t.flujo} m="arrWO12" />
          </svg>
          <figcaption>{t.cierre.caption}</figcaption>
        </figure>
      </Slide>
    </Deck>
  );
}
