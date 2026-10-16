import type { CSSProperties, ReactNode } from 'react';
import Deck, { Slide, useSlideStep } from '../../components/learn/Deck';
import s from '../../components/learn/Deck.module.css';
import { useT } from '../../i18n/useT';
import { datosYProgramasDict } from './datos-y-programas.dict';
import type { BibliotecaTexts, DatoTexts, DatosYProgramasTexts, LenguajesTexts, ProgramaTexts } from './datos-y-programas.dict';

const AMBAR: string = '#f2a33c';
const TEAL: string = '#63b6a4';
const FONDO: string = '#1d2026';
const FONDO_PROTAGONISTA: string = '#232730';
const ASSETS_BASE: string = '/assets/presentations/wwise-unreal/';
/* Las entradas de cada diapositiva se escalonan en el orden de la narración del
   guion (`creacion_guiones_wwise-unreal/guion_clase_1_datos_y_programas.md`),
   un turno por acción entre corchetes. */
const SEGUNDOS_POR_TURNO: number = 0.6;

type Textos = DatosYProgramasTexts;

function turno(numero: number): CSSProperties {
  return { animationDelay: `${(numero * SEGUNDOS_POR_TURNO).toFixed(1)}s` };
}

/* ---------- Entradas escalonadas ---------- */

/* Aparece en su turno. Con `activo` en falso dibuja el grupo tal cual: para los
   pasos de una diapositiva que ya mostró el elemento en un paso anterior. */
function Entra({ turnoNumero, activo = true, children }: { turnoNumero: number; activo?: boolean; children: ReactNode }) {
  if (!activo) return <g>{children}</g>;
  return (
    <g className={s.morphIn} style={turno(turnoNumero)}>
      {children}
    </g>
  );
}

/* Resalta un grupo ya visible: pulsa en su turno. */
function Pulsa({ turnoNumero, activo = true, children }: { turnoNumero: number; activo?: boolean; children: ReactNode }) {
  if (!activo) return <g>{children}</g>;
  return (
    <g className={s.morphPulse} style={turno(turnoNumero)}>
      {children}
    </g>
  );
}

function EntraYPulsa({ turnoNumero, children }: { turnoNumero: number; children: ReactNode }) {
  return (
    <Pulsa turnoNumero={turnoNumero}>
      <Entra turnoNumero={turnoNumero}>{children}</Entra>
    </Pulsa>
  );
}

/* Entrada por escala: crece desde su centro mientras aparece. */
function EntraPorEscala({ turnoNumero, children }: { turnoNumero: number; children: ReactNode }) {
  const estilo = { ...turno(turnoNumero), '--morph-from': 'scale(0.7)', transformBox: 'fill-box', transformOrigin: 'center' } as CSSProperties;
  return (
    <g className={s.morphGlide} style={estilo}>
      <Entra turnoNumero={turnoNumero}>{children}</Entra>
    </g>
  );
}

/* Se muestra desde un turno hasta otro: para las fotos que la voz enseña y luego borra. */
function Temporal({ desde, hasta, children }: { desde: number; hasta: number; children: ReactNode }) {
  return (
    <g className={s.morphIn} style={turno(desde)}>
      <g className={s.morphOut} style={turno(hasta)}>
        {children}
      </g>
    </g>
  );
}

/* La misma entrada por escala para un elemento HTML (título, kicker, pista). */
function estiloEscalaHtml(turnoNumero: number): CSSProperties {
  return { ...turno(turnoNumero), '--morph-from': 'scale(0.7)', transformOrigin: 'left center' } as CSSProperties;
}

function Marcador({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill={color} />
    </marker>
  );
}

/* ---------- Esquema de ideas (diapositiva propia y miniatura en la esquina) ---------- */

function CajaIdea({ x, y, width, height, numero, texto, resaltada, fontSize }: { x: number; y: number; width: number; height: number; numero: string; texto: string; resaltada: boolean; fontSize: number }) {
  const color: string = resaltada ? AMBAR : 'currentColor';
  return (
    <g opacity={resaltada ? 1 : 0.55}>
      <rect x={x} y={y} width={width} height={height} rx="8" fill={resaltada ? FONDO_PROTAGONISTA : FONDO} stroke={color} strokeOpacity={resaltada ? 1 : 0.35} />
      <text x={x + width * 0.07} y={y + height / 2 + fontSize * 0.55} fontSize={fontSize * 1.7} fill={AMBAR}>
        {numero}
      </text>
      <text x={x + width * 0.17} y={y + height / 2 + fontSize * 0.38} fontSize={fontSize} fill={color} className={s.svgSans}>
        {texto}
      </text>
    </g>
  );
}

/* Miniatura del esquema en la esquina, con la idea actual en ámbar. Con `entraGrande`
   aparece del tamaño del esquema a pantalla completa y se encoge hasta su sitio;
   `oculto` reserva su lugar en el paso en que todavía no se muestra. */
function EsquemaIdeas({ t, actual, entraGrande = false, oculto = false }: { t: Textos; actual?: number; entraGrande?: boolean; oculto?: boolean }) {
  const estiloEntrada: CSSProperties | undefined = entraGrande
    ? ({ '--morph-from': 'translate(0px, 86px) scale(4.4)', transformOrigin: '0 0', animationDuration: '0.9s' } as CSSProperties)
    : undefined;
  return (
    <svg className={`${s.minimap} ${entraGrande ? s.morphGlide : ''} ${oculto ? s.oculto : ''}`} style={estiloEntrada} viewBox="0 0 234 36" aria-hidden="true">
      {t.ideas.cortos.map((corto, index) => (
        <CajaIdea key={corto} x={index * 120} y={3} width={114} height={30} numero={String(index + 1)} texto={corto} resaltada={index === actual} fontSize={8} />
      ))}
    </svg>
  );
}

/* Dos pasos: los dos recuadros entran uno por uno; al avanzar, el primero queda
   en ámbar y el esquema se encoge hasta la esquina, donde seguirá en las
   diapositivas siguientes. */
function ContenidoIdeas({ t }: { t: Textos }) {
  const paso: number = useSlideStep();
  return (
    <>
      <EsquemaIdeas t={t} actual={paso === 1 ? 0 : undefined} entraGrande={paso === 1} oculto={paso === 0} />
      <div className={s.eyebrow}>{t.ideas.eyebrow}</div>
      <figure className={paso === 1 ? s.oculto : undefined}>
        <svg viewBox="0 0 940 150" role="img" aria-label={t.ideas.aria}>
          {t.ideas.items.map((item, index) => (
            <Entra key={item} turnoNumero={index} activo={paso === 0}>
              <CajaIdea x={50 + index * 440} y={28} width={400} height={90} numero={String(index + 1)} texto={item} resaltada fontSize={14} />
            </Entra>
          ))}
        </svg>
      </figure>
    </>
  );
}

/* ---------- Qué es un dato ---------- */

const ONDA: number[] = [6, 14, 22, 30, 18, 40, 52, 34, 20, 44, 60, 38, 24, 12, 28, 46, 70, 50, 32, 16, 26, 42, 58, 36, 20, 48, 64, 40, 22, 10, 30, 54, 44, 26, 14, 34, 50, 28, 12, 6];
const TARJETA_Y: number = 30;
const TARJETA_ANCHO: number = 260;
const TARJETA_ALTO: number = 190;

function Tarjeta({ x, rotulo, children }: { x: number; rotulo: string; children: ReactNode }) {
  return (
    <g>
      <rect x={x} y={TARJETA_Y} width={TARJETA_ANCHO} height={TARJETA_ALTO} rx="8" fill={FONDO} stroke="currentColor" strokeOpacity=".35" />
      {children}
      <text x={x + TARJETA_ANCHO / 2} y={TARJETA_Y + TARJETA_ALTO + 30} fontSize="12" fill={AMBAR} textAnchor="middle">
        {rotulo}
      </text>
    </g>
  );
}

function FiguraDato({ r }: { r: DatoTexts }) {
  return (
    <figure>
      <svg viewBox="0 0 900 270" role="img" aria-label={r.aria}>
        <defs>
          <clipPath id="recorteImagenDato">
            <rect x="321" y={TARJETA_Y + 1} width={TARJETA_ANCHO - 2} height={TARJETA_ALTO - 2} rx="8" />
          </clipPath>
        </defs>
        <Entra turnoNumero={0}>
          <Tarjeta x={20} rotulo={r.texto}>
            {r.textoLineas.map((linea, index) => (
              <text key={linea} className={s.svgSans} x="40" y={74 + index * 28} fontSize="15" fill="currentColor" opacity=".85">
                {linea}
              </text>
            ))}
          </Tarjeta>
        </Entra>
        <Entra turnoNumero={1}>
          <Tarjeta x={320} rotulo={r.imagen}>
            <image
              href={`${ASSETS_BASE}ComputerCover.jpg`}
              x="321"
              y={TARJETA_Y + 1}
              width={TARJETA_ANCHO - 2}
              height={TARJETA_ALTO - 2}
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#recorteImagenDato)"
            />
          </Tarjeta>
        </Entra>
        <Entra turnoNumero={2}>
          <Tarjeta x={620} rotulo={r.sonido}>
            {ONDA.map((alto, index) => (
              <rect key={index} x={630 + index * 6} y={TARJETA_Y + TARJETA_ALTO / 2 - alto / 2} width="3" height={alto} rx="1" fill={AMBAR} />
            ))}
          </Tarjeta>
        </Entra>
      </svg>
    </figure>
  );
}

/* ---------- Analogía de la biblioteca ---------- */

type Pieza = { archivo: string; x: number; y: number; width: number; height: number };

/* Recortes del PNG de la analogía (escala 0.5). Cada pieza del computador
   ocupa la casilla de su pieza de biblioteca, centrada en ella. */
const PIEZAS: Record<string, Pieza> = {
  estanterias: { archivo: 'biblioteca-estanterias.png', x: 275, y: 8, width: 370, height: 119 },
  discos: { archivo: 'computador-discos.png', x: 292, y: 8, width: 335, height: 119 },
  mesaIzquierda: { archivo: 'biblioteca-mesa-izquierda.png', x: 153, y: 178, width: 93, height: 233 },
  ramIzquierda: { archivo: 'computador-ram-izquierda.png', x: 164, y: 178, width: 72, height: 233 },
  mesaCentral: { archivo: 'biblioteca-mesa-central.png', x: 382, y: 178, width: 155, height: 233 },
  cpu: { archivo: 'computador-cpu.png', x: 366, y: 178, width: 188, height: 233 },
  mesaDerecha: { archivo: 'biblioteca-mesa-derecha.png', x: 674, y: 178, width: 93, height: 233 },
  ramDerecha: { archivo: 'computador-ram-derecha.png', x: 684, y: 178, width: 72, height: 233 },
};

/* Las cuatro cachés dentro del dibujo de la CPU (la franja cian de cada núcleo). */
const CACHES_EN_CPU: { x: number; y: number }[] = [
  { x: 414, y: 273 },
  { x: 464, y: 273 },
  { x: 414, y: 323 },
  { x: 464, y: 323 },
];

/* Turnos de la narración de cada paso (guion, s=3). */
const TURNOS_BIBLIOTECA = {
  figura: 0,
  titulo: 1,
  kicker: 2,
  personas: 3,
  kickerResalte: 4,
  librosAbiertos: 5,
  leer: 6,
  mesas: 7,
  alcanzar: 8,
  estanterias: 9,
  levantarse: 10,
  rotuloLento: 11,
  rotuloRapido: 12,
  rotuloInstante: 13,
};

const TURNOS_COMPUTADOR = {
  cpu: 0,
  kicker: 1,
  cache: 2,
  leerCache: 3,
  fotoChipEntra: 4,
  ram: 5,
  traer: 6,
  discos: 7,
  todosLosDatos: 8,
  cargar: 9,
  fotoChipSale: 9,
  fotoDiscoEntra: 10,
  cargando: 11,
  fotoDiscoSale: 14,
};

function Imagen({ pieza }: { pieza: Pieza }) {
  return <image href={ASSETS_BASE + pieza.archivo} x={pieza.x} y={pieza.y} width={pieza.width} height={pieza.height} />;
}

/* Rótulo de velocidad partido en dos líneas alrededor de la flecha horizontal. */
function RotuloVelocidad({ x, texto }: { x: number; texto: string }) {
  const [arriba, abajo] = texto.split(' · ');
  return (
    <>
      <text x={x} y="284" fontSize="10.5" fill={AMBAR} textAnchor="middle">{arriba}</text>
      <text x={x} y="312" fontSize="10.5" fill={AMBAR} textAnchor="middle">{abajo}</text>
    </>
  );
}

/* Una casilla de la analogía. En el paso 1 la pieza de biblioteca se desvanece
   y la del computador entra (deslizándose desde `glideFrom` si se indica) en
   el turno que le toca en la narración. */
function GrupoAnalogia({
  paso,
  turnoNumero,
  glideFrom,
  biblioteca,
  computador,
}: {
  paso: number;
  turnoNumero: number;
  glideFrom?: string;
  biblioteca: ReactNode;
  computador: ReactNode;
}) {
  if (paso === 0) return <>{biblioteca}</>;
  const entrada = (
    <g className={s.morphIn} style={turno(turnoNumero)}>
      {computador}
    </g>
  );
  return (
    <>
      <g className={s.morphOut} style={turno(turnoNumero)}>
        {biblioteca}
      </g>
      {glideFrom ? (
        <g className={s.morphGlide} style={{ ...turno(turnoNumero), '--morph-from': glideFrom } as CSSProperties}>
          {entrada}
        </g>
      ) : (
        entrada
      )}
    </>
  );
}

/* Foto del chip de un procesador, con un núcleo y la memoria caché señalados;
   la voz la enseña un momento y luego la borra. */
function FotoChip({ r }: { r: BibliotecaTexts }) {
  return (
    <g>
      <rect x="250" y="110" width="420" height="292" rx="8" fill={FONDO} stroke={AMBAR} strokeWidth="2" />
      <image href={`${ASSETS_BASE}cpu-die-13900k.jpg`} x="260" y="120" width="400" height="256" />
      <rect x="296" y="158" width="64" height="18" rx="4" fill={FONDO} opacity=".85" />
      <text x="328" y="171" fontSize="11" fill={AMBAR} textAnchor="middle">{r.fotoChip.nucleo}</text>
      <rect x="406" y="282" width="108" height="18" rx="4" fill={FONDO} opacity=".85" />
      <text x="460" y="295" fontSize="11" fill={AMBAR} textAnchor="middle">{r.fotoChip.cache}</text>
      <text x="460" y="392" fontSize="8.5" fill="currentColor" opacity=".55" textAnchor="middle">{r.fotoChip.credito}</text>
    </g>
  );
}

function FotoDisco({ r }: { r: BibliotecaTexts }) {
  return (
    <g>
      <rect x="310" y="90" width="320" height="310" rx="8" fill={FONDO} stroke={AMBAR} strokeWidth="2" />
      <image href={`${ASSETS_BASE}disco-duro-sata.jpg`} x="320" y="100" width="300" height="273" />
      <text x="470" y="390" fontSize="8.5" fill="currentColor" opacity=".55" textAnchor="middle">{r.creditoFotoDisco}</text>
    </g>
  );
}

/* Un solo slide con dos pasos: la biblioteca y, al avanzar, el computador. En el
   paso 0 cada rótulo entra en el turno en que la voz lo nombra; en el paso 1 las
   piezas cruzan a sus equivalentes en ese mismo orden. */
function FiguraBiblioteca({ r }: { r: BibliotecaTexts }) {
  const paso: number = useSlideStep();
  const b = r.biblioteca;
  const c = r.computador;
  const tb = TURNOS_BIBLIOTECA;
  const tc = TURNOS_COMPUTADOR;
  const enBiblioteca: boolean = paso === 0;
  const estiloFigura = { ...turno(tb.figura), '--morph-from': 'scale(0.8)', transformBox: 'fill-box', transformOrigin: 'center' } as CSSProperties;
  return (
    <figure>
      <svg viewBox="0 0 920 455" role="img" aria-label={r.arias[paso]}>
        <defs>
          <Marcador id="arrD1" color={AMBAR} />
          <Marcador id="arrD1t" color={TEAL} />
        </defs>

        <g className={s.morphGlide} style={estiloFigura}>
          <g className={s.morphIn} style={turno(tb.figura)}>
            <line x1="460" y1="152" x2="460" y2="172" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrD1t)" />
            <line x1="254" y1="295" x2="350" y2="295" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrD1)" />
            <line x1="666" y1="295" x2="570" y2="295" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrD1)" />

            <GrupoAnalogia
              paso={paso}
              turnoNumero={tc.cpu}
              biblioteca={
                <>
                  <Pulsa turnoNumero={tb.librosAbiertos} activo={enBiblioteca}>
                    <Pulsa turnoNumero={tb.personas} activo={enBiblioteca}>
                      <Imagen pieza={PIEZAS.mesaCentral} />
                    </Pulsa>
                  </Pulsa>
                  <text x="455" y="430" fontSize="12" fill={AMBAR} textAnchor="end">{b.librosAbiertos}</text>
                  <text x="465" y="430" fontSize="10.5" fill="currentColor" opacity=".6">{b.materiaActual}</text>
                  <Pulsa turnoNumero={tb.rotuloInstante} activo={enBiblioteca}>
                    <Entra turnoNumero={tb.leer} activo={enBiblioteca}>
                      <text x="460" y="446" fontSize="10.5" fill={AMBAR} textAnchor="middle">{b.leer}</text>
                    </Entra>
                  </Pulsa>
                </>
              }
              computador={
                <>
                  <Imagen pieza={PIEZAS.cpu} />
                  <text x="455" y="430" fontSize="12" fill={AMBAR} textAnchor="end">{c.cpu} · {c.cache}</text>
                  <text x="465" y="430" fontSize="10.5" fill="currentColor" opacity=".6">{c.loQueUsas}</text>
                  <EntraYPulsa turnoNumero={tc.cache}>
                    {CACHES_EN_CPU.map((cache) => (
                      <rect key={`${cache.x}-${cache.y}`} x={cache.x} y={cache.y} width="44" height="20" rx="4" fill="none" stroke={AMBAR} strokeWidth="2" />
                    ))}
                  </EntraYPulsa>
                  <Entra turnoNumero={tc.leerCache}>
                    <text x="460" y="446" fontSize="10.5" fill={AMBAR} textAnchor="middle">{c.leerCache}</text>
                  </Entra>
                </>
              }
            />

            <GrupoAnalogia
              paso={paso}
              turnoNumero={tc.ram}
              glideFrom="translateX(-40px)"
              biblioteca={
                <>
                  <Pulsa turnoNumero={tb.mesas} activo={enBiblioteca}>
                    <Imagen pieza={PIEZAS.mesaIzquierda} />
                  </Pulsa>
                  <Entra turnoNumero={tb.mesas} activo={enBiblioteca}>
                    <text x="200" y="430" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">{b.laMesa}</text>
                  </Entra>
                  <Pulsa turnoNumero={tb.rotuloRapido} activo={enBiblioteca}>
                    <Entra turnoNumero={tb.alcanzar} activo={enBiblioteca}>
                      <RotuloVelocidad x={302} texto={b.alcanzar} />
                    </Entra>
                  </Pulsa>
                </>
              }
              computador={
                <>
                  <Imagen pieza={PIEZAS.ramIzquierda} />
                  <text x="200" y="430" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">{c.ram}</text>
                  <Entra turnoNumero={tc.traer}>
                    <RotuloVelocidad x={302} texto={c.traer} />
                  </Entra>
                </>
              }
            />

            <GrupoAnalogia
              paso={paso}
              turnoNumero={tc.ram}
              glideFrom="translateX(40px)"
              biblioteca={
                <>
                  <Pulsa turnoNumero={tb.mesas} activo={enBiblioteca}>
                    <Imagen pieza={PIEZAS.mesaDerecha} />
                  </Pulsa>
                  <Entra turnoNumero={tb.mesas} activo={enBiblioteca}>
                    <text x="720" y="430" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">{b.laMesa}</text>
                  </Entra>
                  <Pulsa turnoNumero={tb.rotuloRapido} activo={enBiblioteca}>
                    <Entra turnoNumero={tb.alcanzar} activo={enBiblioteca}>
                      <RotuloVelocidad x={618} texto={b.alcanzar} />
                    </Entra>
                  </Pulsa>
                </>
              }
              computador={
                <>
                  <Imagen pieza={PIEZAS.ramDerecha} />
                  <text x="720" y="430" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">{c.ram}</text>
                  <Entra turnoNumero={tc.traer}>
                    <RotuloVelocidad x={618} texto={c.traer} />
                  </Entra>
                </>
              }
            />

            <GrupoAnalogia
              paso={paso}
              turnoNumero={tc.discos}
              glideFrom="translateY(-30px)"
              biblioteca={
                <>
                  <Pulsa turnoNumero={tb.estanterias} activo={enBiblioteca}>
                    <Imagen pieza={PIEZAS.estanterias} />
                  </Pulsa>
                  <text x="275" y="145" fontSize="12" fill={TEAL}>{b.estanterias}</text>
                  <Entra turnoNumero={tb.estanterias} activo={enBiblioteca}>
                    <text x="645" y="145" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="end">{b.todasLasMaterias}</text>
                  </Entra>
                  <Pulsa turnoNumero={tb.rotuloLento} activo={enBiblioteca}>
                    <Entra turnoNumero={tb.levantarse} activo={enBiblioteca}>
                      <text x="470" y="166" fontSize="10.5" fill={TEAL}>{b.levantarse}</text>
                    </Entra>
                  </Pulsa>
                </>
              }
              computador={
                <>
                  <Imagen pieza={PIEZAS.discos} />
                  <text x="275" y="145" fontSize="12" fill={TEAL}>{c.discoDuro}</text>
                  <Entra turnoNumero={tc.todosLosDatos}>
                    <text x="645" y="145" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="end">{c.todosLosDatos}</text>
                  </Entra>
                  <Entra turnoNumero={tc.cargar}>
                    <text x="470" y="166" fontSize="10.5" fill={TEAL}>{c.cargar}</text>
                  </Entra>
                </>
              }
            />

            {paso === 1 && (
              <>
                <Entra turnoNumero={tc.cargando}>
                  <path d="M 292 100 L 212 100 Q 200 100 200 112 L 200 172" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrD1)" />
                  <text x="246" y="92" fontSize="10.5" fill={AMBAR} textAnchor="middle">{c.cargando}</text>
                </Entra>
                <Temporal desde={tc.fotoChipEntra} hasta={tc.fotoChipSale}>
                  <FotoChip r={r} />
                </Temporal>
                <Temporal desde={tc.fotoDiscoEntra} hasta={tc.fotoDiscoSale}>
                  <FotoDisco r={r} />
                </Temporal>
              </>
            )}
          </g>
        </g>
      </svg>
      <figcaption className={paso === 1 ? s.morphIn : s.oculto} style={turno(tc.cargando)}>
        {r.caption}
      </figcaption>
    </figure>
  );
}

/* Kicker y título entran por escala en el paso 0; en el paso 1 el kicker cambia
   (crossfade al remontarse con `key`) y el título no se mueve. */
function ContenidoBiblioteca({ r }: { r: BibliotecaTexts }) {
  const paso: number = useSlideStep();
  const tb = TURNOS_BIBLIOTECA;
  const tc = TURNOS_COMPUTADOR;
  return (
    <>
      {paso === 0 ? (
        <div className={s.morphPulse} style={{ ...turno(tb.kickerResalte), alignSelf: 'flex-start', transformOrigin: 'left center' }}>
          <div className={s.morphIn} style={turno(tb.kicker)}>
            <div className={`${s.eyebrow} ${s.morphGlide}`} style={estiloEscalaHtml(tb.kicker)}>
              {r.eyebrows[0]}
            </div>
          </div>
        </div>
      ) : (
        <div key="computador" className={`${s.eyebrow} ${s.morphIn}`} style={turno(tc.kicker)}>
          {r.eyebrows[1]}
        </div>
      )}
      <div className={s.morphIn} style={turno(tb.titulo)}>
        <h2 className={s.morphGlide} style={estiloEscalaHtml(tb.titulo)}>
          {r.title}
        </h2>
      </div>
      <FiguraBiblioteca r={r} />
    </>
  );
}

/* ---------- Qué es un programa ---------- */

const TURNOS_PROGRAMA = {
  codigo: 1,
  conversor: 2,
  instrucciones: 3,
  ejemplos: 4,
};

const EJEMPLOS_Y: number = 300;
const EJEMPLOS_ALTO: number = 110;
/* Ancho de cada captura: 4:3 para Word y Excel, 16:9 para el juego. */
const EJEMPLOS: { archivo: string; x: number; width: number }[] = [
  { archivo: 'captura-word.png', x: 145, width: 147 },
  { archivo: 'juego-abyss-odyssey.jpg', x: 352, width: 196 },
  { archivo: 'captura-excel.png', x: 608, width: 147 },
];

function IconoProgramador() {
  return (
    <g fill="none" stroke="currentColor" strokeOpacity=".7" strokeWidth="1.5">
      <circle cx="110" cy="203" r="13" />
      <circle cx="104" cy="204" r="4" />
      <circle cx="116" cy="204" r="4" />
      <line x1="108" y1="204" x2="112" y2="204" />
      <path d="M 84 248 Q 110 220 136 248" />
    </g>
  );
}

function IconoPc() {
  return (
    <g fill={FONDO} stroke="currentColor" strokeOpacity=".7" strokeWidth="1.5">
      <rect x="718" y="188" width="64" height="42" rx="4" />
      <line x1="750" y1="230" x2="750" y2="242" />
      <line x1="732" y1="242" x2="768" y2="242" />
    </g>
  );
}

function FiguraPrograma({ r }: { r: ProgramaTexts }) {
  const tp = TURNOS_PROGRAMA;
  const estiloEscala = { ...turno(tp.ejemplos), '--morph-from': 'scale(1.08)', transformBox: 'fill-box', transformOrigin: '50% 0' } as CSSProperties;
  return (
    <figure>
      <svg viewBox="0 0 900 440" role="img" aria-label={r.aria}>
        <defs>
          <Marcador id="arrDP" color={AMBAR} />
        </defs>

        {/* El esquema de arriba se encoge un poco cuando entran los ejemplos. */}
        <g className={s.morphGlide} style={estiloEscala}>
          <Entra turnoNumero={tp.codigo}>
            <text x="140" y="30" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.archivo}</text>
            <rect x="40" y="40" width="200" height="120" rx="8" fill={FONDO} stroke="currentColor" strokeOpacity=".35" />
            {r.codigo.map((linea, index) => (
              <text key={linea} x="56" y={72 + index * 24} fontSize="12.5" fill={index === 0 ? TEAL : 'currentColor'} opacity=".9" xmlSpace="preserve">
                {linea}
              </text>
            ))}
            <IconoProgramador />
            <text className={s.svgSans} x="150" y="230" fontSize="13" fill="currentColor" opacity=".8">{r.programador}</text>
            <line x1="110" y1="186" x2="110" y2="166" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrDP)" />
          </Entra>

          <EntraYPulsa turnoNumero={tp.conversor}>
            <line x1="240" y1="100" x2="312" y2="100" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrDP)" />
            <rect x="320" y="70" width="240" height="60" rx="8" fill={FONDO_PROTAGONISTA} stroke={AMBAR} strokeWidth="2" />
            <text x="440" y="95" fontSize="12" fill={AMBAR} textAnchor="middle">{r.conversor}</text>
            <text x="440" y="114" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.conversorSub}</text>
          </EntraYPulsa>

          <Entra turnoNumero={tp.instrucciones}>
            <line x1="560" y1="100" x2="632" y2="100" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrDP)" />
            <text x="750" y="30" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.instrucciones}</text>
            <rect x="640" y="40" width="220" height="120" rx="8" fill={FONDO} stroke="currentColor" strokeOpacity=".35" />
            {r.listaInstrucciones.map((linea, index) => (
              <text key={linea} x="656" y={72 + index * 24} fontSize="12" fill="currentColor" opacity=".9" xmlSpace="preserve">
                {linea}
              </text>
            ))}
            <line x1="750" y1="160" x2="750" y2="184" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrDP)" />
            <IconoPc />
            <text className={s.svgSans} x="792" y="215" fontSize="13" fill="currentColor" opacity=".8">{r.pc}</text>
          </Entra>
        </g>

        <Entra turnoNumero={tp.ejemplos}>
          <path d="M 750 246 L 750 262 Q 750 270 742 270 L 226 270 Q 218 270 218 278 L 218 294" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrDP)" />
          <line x1="450" y1="270" x2="450" y2="294" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrDP)" />
          <line x1="681" y1="270" x2="681" y2="294" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrDP)" />
          {EJEMPLOS.map((ejemplo, index) => {
            const centro: number = ejemplo.x + ejemplo.width / 2;
            const textos = r.ejemplos[index];
            return (
              <g key={ejemplo.archivo}>
                <text x={centro} y={EJEMPLOS_Y - 8} fontSize="10.5" fill={AMBAR} textAnchor="middle">{textos.nombre}</text>
                <image href={ASSETS_BASE + ejemplo.archivo} x={ejemplo.x} y={EJEMPLOS_Y} width={ejemplo.width} height={EJEMPLOS_ALTO} preserveAspectRatio="xMidYMid slice" />
                <rect x={ejemplo.x} y={EJEMPLOS_Y} width={ejemplo.width} height={EJEMPLOS_ALTO} rx="3" fill="none" stroke="currentColor" strokeOpacity=".35" />
                {textos.credito.map((linea, lineaIndex) => (
                  <text key={linea} x={centro} y={EJEMPLOS_Y + EJEMPLOS_ALTO + 13 + lineaIndex * 11} fontSize="8" fill="currentColor" opacity=".55" textAnchor="middle">
                    {linea}
                  </text>
                ))}
              </g>
            );
          })}
        </Entra>
      </svg>
    </figure>
  );
}

/* ---------- Niveles de abstracción ---------- */

const NIVEL_X: number = 220;
const NIVEL_ANCHO: number = 400;
const NIVEL_ALTO: number = 58;
const CUADRO_X: number = 640;
const CUADRO_ANCHO: number = 270;
const TURNO_CAJAS: number = 0;
const TURNO_ABSTRACCION: number = 1;
const TURNO_PRIMERA_EXPLICACION: number = 2;
/* Cada explicación queda unos seis segundos, lo que tarda la voz en leerla. */
const TURNOS_POR_EXPLICACION: number = 10;
const TURNOS_CALLOUTS = { laCpuLee: 3, masRapido: 4, masFacil: 5, tuEscribes: 6 };

function nivelY(index: number): number {
  return 34 + index * 94;
}

/* La voz explica las cajas de abajo hacia arriba: código máquina primero. */
function turnoExplicacion(index: number): number {
  return TURNO_PRIMERA_EXPLICACION + (3 - index) * TURNOS_POR_EXPLICACION;
}

function FiguraLenguajes({ r }: { r: LenguajesTexts }) {
  const tcall = TURNOS_CALLOUTS;
  return (
    <figure>
      <svg viewBox="0 0 920 420" role="img" aria-label={r.aria}>
        <defs>
          <Marcador id="arrD7" color={AMBAR} />
          <Marcador id="arrD7t" color={TEAL} />
        </defs>

        {r.niveles.map(({ titulo }, index) => {
          const y: number = nivelY(index);
          const esMaquina: boolean = index === r.niveles.length - 1;
          return (
            <Pulsa key={titulo} turnoNumero={turnoExplicacion(index)}>
              <g className={s.morphIn} style={{ animationDelay: `${(TURNO_CAJAS * SEGUNDOS_POR_TURNO + index * 0.15).toFixed(2)}s` }}>
                {esMaquina ? (
                  <rect x={NIVEL_X} y={y} width={NIVEL_ANCHO} height={NIVEL_ALTO} rx="8" fill={FONDO_PROTAGONISTA} stroke={AMBAR} strokeWidth="2" />
                ) : (
                  <rect x={NIVEL_X} y={y} width={NIVEL_ANCHO} height={NIVEL_ALTO} rx="8" fill={FONDO} stroke="currentColor" strokeOpacity=".35" />
                )}
                <text x={NIVEL_X + NIVEL_ANCHO / 2} y={y + 34} fontSize="11.5" fill={esMaquina ? AMBAR : 'currentColor'} textAnchor="middle">
                  {titulo}
                </text>
              </g>
            </Pulsa>
          );
        })}

        <Entra turnoNumero={TURNO_ABSTRACCION}>
          <text x={NIVEL_X} y="18" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.masCercaHumano}</text>
          <text x={NIVEL_X} y="398" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.masCercaMaquina}</text>
          <text x="200" y="67" fontSize="11.5" fill={TEAL} letterSpacing="2" textAnchor="end">{r.masAbstracto}</text>
          <text x="200" y="349" fontSize="11.5" fill={AMBAR} letterSpacing="2" textAnchor="end">{r.menosAbstracto}</text>
        </Entra>

        {r.niveles.map(({ titulo, explicacion }, index) => (
          <Temporal key={titulo} desde={turnoExplicacion(index)} hasta={turnoExplicacion(index) + TURNOS_POR_EXPLICACION}>
            <rect x={CUADRO_X} y="120" width={CUADRO_ANCHO} height="140" rx="8" fill={FONDO} stroke="currentColor" strokeOpacity=".35" />
            <text x={CUADRO_X + 16} y="146" fontSize="11" fill={AMBAR}>{titulo}</text>
            {explicacion.map((linea, lineaIndex) => (
              <text key={linea} x={CUADRO_X + 16} y={172 + lineaIndex * 18} fontSize="10.5" fill="currentColor" opacity=".8">
                {linea}
              </text>
            ))}
          </Temporal>
        ))}

        <Entra turnoNumero={tcall.masFacil}>
          <text x={NIVEL_X + NIVEL_ANCHO} y="18" fontSize="10.5" fill={TEAL} textAnchor="end">{r.masFacil}</text>
        </Entra>
        <Entra turnoNumero={tcall.masRapido}>
          <text x={NIVEL_X + NIVEL_ANCHO} y="398" fontSize="10.5" fill={AMBAR} textAnchor="end">{r.masRapido}</text>
        </Entra>
        <EntraYPulsa turnoNumero={tcall.tuEscribes}>
          <text x="780" y="50" fontSize="10" fill={TEAL} textAnchor="middle">{r.tuEscribes[0]}</text>
          <text x="780" y="64" fontSize="10" fill={TEAL} textAnchor="middle">{r.tuEscribes[1]}</text>
          <line x1="700" y1="78" x2="628" y2="78" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrD7t)" />
        </EntraYPulsa>
        <EntraYPulsa turnoNumero={tcall.laCpuLee}>
          <text x="780" y="335" fontSize="10.5" fill={AMBAR} textAnchor="middle">{r.laCpuLee}</text>
          <line x1="700" y1="345" x2="628" y2="345" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrD7)" />
        </EntraYPulsa>
      </svg>
      <figcaption>{r.caption}</figcaption>
    </figure>
  );
}

export default function DatosYProgramas() {
  const t = useT(datosYProgramasDict);

  return (
    <Deck name={t.name} context={t.context}>
      <Slide z="▶" label={t.labels.intro} backgroundImage={`${ASSETS_BASE}ComputerCover.jpg`}>
        <div className={s.eyebrow}>{t.cover.eyebrow}</div>
        <div className={s.morphIn} style={turno(0)}>
          <h1 className={s.morphGlide} style={estiloEscalaHtml(0)}>
            {t.cover.title}
          </h1>
        </div>
        <div className={s.morphIn} style={turno(1)}>
          <p className={`${s.note} ${s.morphGlide}`} style={estiloEscalaHtml(1)}>
            {t.cover.hint}
          </p>
        </div>
      </Slide>

      <Slide z="0" label={[t.labels.ideas, t.labels.datos]}>
        <ContenidoIdeas t={t} />
      </Slide>

      <Slide z="1" label={t.labels.dato}>
        <EsquemaIdeas t={t} actual={0} />
        <h2>{t.dato.title}</h2>
        <FiguraDato r={t.dato} />
      </Slide>

      <Slide z="=" label={[t.labels.biblioteca, t.labels.computador]} notes={t.biblioteca.notes}>
        <EsquemaIdeas t={t} actual={0} />
        <ContenidoBiblioteca r={t.biblioteca} />
      </Slide>

      <Slide z="2" label={t.labels.programa} notes={t.programa.notes}>
        <EsquemaIdeas t={t} actual={1} entraGrande />
        <h2>{t.programa.title}</h2>
        <FiguraPrograma r={t.programa} />
      </Slide>

      <Slide z="=" label={t.labels.lenguajes}>
        <EsquemaIdeas t={t} actual={1} />
        <div className={s.eyebrow}>{t.lenguajes.eyebrow}</div>
        <h2>{t.lenguajes.title}</h2>
        <FiguraLenguajes r={t.lenguajes} />
      </Slide>

      <Slide z="↺" label={t.labels.cierre}>
        <h2>{t.cierre.title}</h2>
        {t.cierre.ideas.map((idea, index) => (
          <p key={idea.clave} className={`${s.lede} ${s.morphIn}`} style={turno(index)}>
            <span className={s.accent}>{idea.clave}</span> {idea.texto}
          </p>
        ))}
      </Slide>
    </Deck>
  );
}
