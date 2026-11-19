import type { CSSProperties, ReactNode } from 'react';
import Deck, { Slide, useSlideStep } from '../../components/learn/Deck';
import s from '../../components/learn/Deck.module.css';
import { useT } from '../../i18n/useT';
import { datosYProgramasDict } from './datos-y-programas.dict';
import type { BibliotecaTexts, CierreTexts, DatoTexts, DatosYProgramasTexts, LenguajesTexts, ProgramaTexts } from './datos-y-programas.dict';

const AMBAR: string = '#f2a33c';
const TEAL: string = '#63b6a4';
const FONDO: string = '#1d2026';
const FONDO_PROTAGONISTA: string = '#232730';
const ASSETS_BASE: string = '/assets/presentations/wwise-unreal/';
/* Cada diapositiva con pasos avanza un paso (un clic) por párrafo de la narración
   del guion (`creacion_guiones_wwise-unreal/guion_clase_1_datos_y_programas.md`).
   Dentro de un paso, las acciones entre corchetes entran de una en una, por
   turnos de 0,6 s, nunca a la vez: así cada paso es corto y se sincroniza con
   la voz. */
const SEGUNDOS_POR_TURNO: number = 0.6;

type Textos = DatosYProgramasTexts;

function turno(numero: number): CSSProperties {
  return { animationDelay: `${(numero * SEGUNDOS_POR_TURNO).toFixed(1)}s` };
}

/* ---------- Pasos y turnos ---------- */

/* Un elemento pertenece a un paso: antes de ese paso no se dibuja, en ese paso
   entra en su turno y después queda quieto. `actual` es el paso en pantalla. */
type EnPaso = { paso: number; actual: number; turnoNumero?: number; children: ReactNode };

function Entra({ paso, actual, turnoNumero = 0, children }: EnPaso) {
  if (actual < paso) return null;
  if (actual > paso) return <g>{children}</g>;
  return (
    <g className={s.morphIn} style={turno(turnoNumero)}>
      {children}
    </g>
  );
}

/* Resalta un elemento ya visible: pulsa en su turno, solo en su paso. */
function Pulsa({ paso, actual, turnoNumero = 0, children }: EnPaso) {
  if (actual !== paso) return <g>{children}</g>;
  return (
    <g className={s.morphPulse} style={turno(turnoNumero)}>
      {children}
    </g>
  );
}

function EntraYPulsa({ paso, actual, turnoNumero = 0, children }: EnPaso) {
  return (
    <Pulsa paso={paso} actual={actual} turnoNumero={turnoNumero}>
      <Entra paso={paso} actual={actual} turnoNumero={turnoNumero}>
        {children}
      </Entra>
    </Pulsa>
  );
}

/* La entrada por escala de un elemento HTML (título, kicker, pista): clases y
   estilo solo mientras entra. */
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
            <Entra key={item} paso={0} actual={paso} turnoNumero={index}>
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
        <Entra paso={0} actual={0} turnoNumero={0}>
          <Tarjeta x={20} rotulo={r.texto}>
            {r.textoLineas.map((linea, index) => (
              <text key={linea} className={s.svgSans} x="40" y={74 + index * 28} fontSize="15" fill="currentColor" opacity=".85">
                {linea}
              </text>
            ))}
          </Tarjeta>
        </Entra>
        <Entra paso={0} actual={0} turnoNumero={1}>
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
        <Entra paso={0} actual={0} turnoNumero={2}>
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

/* Un paso por párrafo del guion (s=3): seis de biblioteca y seis de computador.
   El orden es el de `labels` de la diapositiva. */
const PASOS_BIBLIOTECA = {
  biblioteca: 0,
  personas: 1,
  librosAbiertos: 2,
  mesas: 3,
  estanterias: 4,
  regla: 5,
  computador: 6,
  llegarCpu: 7,
  cache: 8,
  ram: 9,
  disco: 10,
  cargando: 11,
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

/* Una casilla de la analogía: la pieza de biblioteca hasta `pasoMorph`, donde se
   desvanece y entra la del computador (deslizándose desde `glideFrom` si se
   indica); después queda la del computador. */
function GrupoAnalogia({
  actual,
  pasoMorph,
  glideFrom,
  biblioteca,
  computador,
}: {
  actual: number;
  pasoMorph: number;
  glideFrom?: string;
  biblioteca: ReactNode;
  computador: ReactNode;
}) {
  if (actual < pasoMorph) return <>{biblioteca}</>;
  if (actual > pasoMorph) return <>{computador}</>;
  const entrada = (
    <g className={s.morphIn} style={turno(0)}>
      {computador}
    </g>
  );
  return (
    <>
      <g className={s.morphOut} style={turno(0)}>
        {biblioteca}
      </g>
      {glideFrom ? (
        <g className={s.morphGlide} style={{ ...turno(0), '--morph-from': glideFrom } as CSSProperties}>
          {entrada}
        </g>
      ) : (
        entrada
      )}
    </>
  );
}

/* Foto del chip de un procesador, con un núcleo y la memoria caché señalados;
   se muestra en el paso de la caché y se borra al siguiente clic. */
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

/* La figura de la analogía a lo largo de los doce pasos. */
function FiguraBiblioteca({ r, actual }: { r: BibliotecaTexts; actual: number }) {
  const b = r.biblioteca;
  const c = r.computador;
  const P = PASOS_BIBLIOTECA;
  const entrando: boolean = actual === P.biblioteca;
  const estiloFigura = { ...turno(0), '--morph-from': 'scale(0.8)', transformBox: 'fill-box', transformOrigin: 'center' } as CSSProperties;
  return (
    <figure>
      <svg viewBox="0 0 920 455" role="img" aria-label={r.arias[actual < P.computador ? 0 : 1]}>
        <defs>
          <Marcador id="arrD1" color={AMBAR} />
          <Marcador id="arrD1t" color={TEAL} />
        </defs>

        <g className={entrando ? s.morphGlide : undefined} style={entrando ? estiloFigura : undefined}>
          <g className={entrando ? s.morphIn : undefined} style={entrando ? turno(0) : undefined}>
            <line x1="460" y1="152" x2="460" y2="172" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrD1t)" />
            <line x1="254" y1="295" x2="350" y2="295" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrD1)" />
            <line x1="666" y1="295" x2="570" y2="295" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrD1)" />

            <GrupoAnalogia
              actual={actual}
              pasoMorph={P.computador}
              biblioteca={
                <>
                  <Pulsa paso={P.librosAbiertos} actual={actual}>
                    <Pulsa paso={P.personas} actual={actual}>
                      <Imagen pieza={PIEZAS.mesaCentral} />
                    </Pulsa>
                  </Pulsa>
                  <text x="455" y="430" fontSize="12" fill={AMBAR} textAnchor="end">{b.librosAbiertos}</text>
                  <text x="465" y="430" fontSize="10.5" fill="currentColor" opacity=".6">{b.materiaActual}</text>
                  <Pulsa paso={P.regla} actual={actual} turnoNumero={2}>
                    <Entra paso={P.librosAbiertos} actual={actual} turnoNumero={1}>
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
                  <EntraYPulsa paso={P.cache} actual={actual}>
                    {CACHES_EN_CPU.map((cache) => (
                      <rect key={`${cache.x}-${cache.y}`} x={cache.x} y={cache.y} width="44" height="20" rx="4" fill="none" stroke={AMBAR} strokeWidth="2" />
                    ))}
                  </EntraYPulsa>
                  <Entra paso={P.cache} actual={actual} turnoNumero={1}>
                    <text x="460" y="446" fontSize="10.5" fill={AMBAR} textAnchor="middle">{c.leerCache}</text>
                  </Entra>
                </>
              }
            />

            <GrupoAnalogia
              actual={actual}
              pasoMorph={P.ram}
              glideFrom="translateX(-40px)"
              biblioteca={
                <>
                  <Pulsa paso={P.mesas} actual={actual}>
                    <Imagen pieza={PIEZAS.mesaIzquierda} />
                  </Pulsa>
                  <Entra paso={P.mesas} actual={actual}>
                    <text x="200" y="430" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">{b.laMesa}</text>
                  </Entra>
                  <Pulsa paso={P.regla} actual={actual} turnoNumero={1}>
                    <Entra paso={P.mesas} actual={actual} turnoNumero={1}>
                      <RotuloVelocidad x={302} texto={b.alcanzar} />
                    </Entra>
                  </Pulsa>
                </>
              }
              computador={
                <>
                  <Imagen pieza={PIEZAS.ramIzquierda} />
                  <text x="200" y="430" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">{c.ram}</text>
                  <Entra paso={P.ram} actual={actual} turnoNumero={1}>
                    <RotuloVelocidad x={302} texto={c.traer} />
                  </Entra>
                </>
              }
            />

            <GrupoAnalogia
              actual={actual}
              pasoMorph={P.ram}
              glideFrom="translateX(40px)"
              biblioteca={
                <>
                  <Pulsa paso={P.mesas} actual={actual}>
                    <Imagen pieza={PIEZAS.mesaDerecha} />
                  </Pulsa>
                  <Entra paso={P.mesas} actual={actual}>
                    <text x="720" y="430" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">{b.laMesa}</text>
                  </Entra>
                  <Pulsa paso={P.regla} actual={actual} turnoNumero={1}>
                    <Entra paso={P.mesas} actual={actual} turnoNumero={1}>
                      <RotuloVelocidad x={618} texto={b.alcanzar} />
                    </Entra>
                  </Pulsa>
                </>
              }
              computador={
                <>
                  <Imagen pieza={PIEZAS.ramDerecha} />
                  <text x="720" y="430" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">{c.ram}</text>
                  <Entra paso={P.ram} actual={actual} turnoNumero={1}>
                    <RotuloVelocidad x={618} texto={c.traer} />
                  </Entra>
                </>
              }
            />

            <GrupoAnalogia
              actual={actual}
              pasoMorph={P.disco}
              glideFrom="translateY(-30px)"
              biblioteca={
                <>
                  <Pulsa paso={P.estanterias} actual={actual}>
                    <Imagen pieza={PIEZAS.estanterias} />
                  </Pulsa>
                  <text x="275" y="145" fontSize="12" fill={TEAL}>{b.estanterias}</text>
                  <Entra paso={P.estanterias} actual={actual}>
                    <text x="645" y="145" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="end">{b.todasLasMaterias}</text>
                  </Entra>
                  <Pulsa paso={P.regla} actual={actual} turnoNumero={0}>
                    <Entra paso={P.estanterias} actual={actual} turnoNumero={1}>
                      <text x="470" y="166" fontSize="10.5" fill={TEAL}>{b.levantarse}</text>
                    </Entra>
                  </Pulsa>
                </>
              }
              computador={
                <>
                  <Imagen pieza={PIEZAS.discos} />
                  <text x="275" y="145" fontSize="12" fill={TEAL}>{c.discoDuro}</text>
                  <Entra paso={P.disco} actual={actual} turnoNumero={1}>
                    <text x="645" y="145" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="end">{c.todosLosDatos}</text>
                  </Entra>
                  <Entra paso={P.disco} actual={actual} turnoNumero={2}>
                    <text x="470" y="166" fontSize="10.5" fill={TEAL}>{c.cargar}</text>
                  </Entra>
                </>
              }
            />

            <Entra paso={P.cargando} actual={actual}>
              <path d="M 292 100 L 212 100 Q 200 100 200 112 L 200 172" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrD1)" />
              <text x="246" y="92" fontSize="10.5" fill={AMBAR} textAnchor="middle">{c.cargando}</text>
            </Entra>

            {/* Las fotos viven solo en su paso: el siguiente clic las borra. */}
            {actual === P.cache && (
              <Entra paso={P.cache} actual={actual} turnoNumero={2}>
                <FotoChip r={r} />
              </Entra>
            )}
            {actual === P.disco && (
              <Entra paso={P.disco} actual={actual} turnoNumero={3}>
                <FotoDisco r={r} />
              </Entra>
            )}
          </g>
        </g>
      </svg>
      <figcaption className={actual < P.cargando ? s.oculto : actual === P.cargando ? s.morphIn : undefined} style={turno(0)}>
        {r.caption}
      </figcaption>
    </figure>
  );
}

/* Kicker y título entran por escala en el primer paso; el kicker pulsa en el
   paso de las personas y cambia (remontado con `key`) al llegar a la CPU. */
function ContenidoBiblioteca({ r }: { r: BibliotecaTexts }) {
  const actual: number = useSlideStep();
  const P = PASOS_BIBLIOTECA;
  const entrando: boolean = actual === P.biblioteca;
  return (
    <>
      {actual < P.llegarCpu ? (
        <div className={actual === P.personas ? s.morphPulse : undefined} style={{ ...turno(1), alignSelf: 'flex-start', transformOrigin: 'left center' }}>
          <div className={entrando ? s.morphIn : undefined} style={turno(2)}>
            <div className={`${s.eyebrow} ${entrando ? s.morphGlide : ''}`} style={entrando ? estiloEscalaHtml(2) : undefined}>
              {r.eyebrows[0]}
            </div>
          </div>
        </div>
      ) : (
        <div key="computador" className={`${s.eyebrow} ${actual === P.llegarCpu ? s.morphIn : ''}`} style={turno(0)}>
          {r.eyebrows[1]}
        </div>
      )}
      <div className={entrando ? s.morphIn : undefined} style={turno(1)}>
        <h2 className={entrando ? s.morphGlide : undefined} style={entrando ? estiloEscalaHtml(1) : undefined}>
          {r.title}
        </h2>
      </div>
      <FiguraBiblioteca r={r} actual={actual} />
    </>
  );
}

/* ---------- Qué es un programa ---------- */

/* Tres pasos: el esquema de ideas se encoge, el camino del código a las
   instrucciones, y los ejemplos. */
const PASOS_PROGRAMA = { programa: 0, codigo: 1, ejemplos: 2 };

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

function FiguraPrograma({ r, actual }: { r: ProgramaTexts; actual: number }) {
  const P = PASOS_PROGRAMA;
  /* El esquema de arriba está un poco más grande hasta que entran los ejemplos; entonces se encoge. */
  const estiloEsquema: CSSProperties =
    actual < P.ejemplos
      ? { transform: 'scale(1.08)', transformBox: 'fill-box', transformOrigin: '50% 0' }
      : actual === P.ejemplos
        ? ({ ...turno(0), '--morph-from': 'scale(1.08)', transformBox: 'fill-box', transformOrigin: '50% 0' } as CSSProperties)
        : {};
  return (
    <figure>
      <svg viewBox="0 0 900 440" role="img" aria-label={r.aria}>
        <defs>
          <Marcador id="arrDP" color={AMBAR} />
        </defs>

        <g className={actual === P.ejemplos ? s.morphGlide : undefined} style={estiloEsquema}>
          <Entra paso={P.codigo} actual={actual} turnoNumero={0}>
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

          <EntraYPulsa paso={P.codigo} actual={actual} turnoNumero={1}>
            <line x1="240" y1="100" x2="312" y2="100" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrDP)" />
            <rect x="320" y="70" width="240" height="60" rx="8" fill={FONDO_PROTAGONISTA} stroke={AMBAR} strokeWidth="2" />
            <text x="440" y="95" fontSize="12" fill={AMBAR} textAnchor="middle">{r.conversor}</text>
            <text x="440" y="114" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.conversorSub}</text>
          </EntraYPulsa>

          <Entra paso={P.codigo} actual={actual} turnoNumero={2}>
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

        <Entra paso={P.ejemplos} actual={actual}>
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

function ContenidoPrograma({ t }: { t: Textos }) {
  const actual: number = useSlideStep();
  return (
    <>
      <EsquemaIdeas t={t} actual={1} entraGrande={actual === PASOS_PROGRAMA.programa} />
      <h2>{t.programa.title}</h2>
      <FiguraPrograma r={t.programa} actual={actual} />
    </>
  );
}

/* ---------- Niveles de abstracción ---------- */

/* Diez pasos, uno por párrafo: las cajas, los rótulos de abstracción, una
   explicación por nivel (de abajo hacia arriba), y los cuatro callouts. */
const PASOS_LENGUAJES = {
  lenguajes: 0,
  abstraccion: 1,
  codigoMaquina: 2,
  ensamblador: 3,
  compilados: 4,
  altoNivel: 5,
  cpuLee: 6,
  motores: 7,
  desarrollo: 8,
  wwise: 9,
};

const NIVEL_X: number = 220;
const NIVEL_ANCHO: number = 400;
const NIVEL_ALTO: number = 58;
const CUADRO_X: number = 640;
const CUADRO_ANCHO: number = 270;

function nivelY(index: number): number {
  return 34 + index * 94;
}

/* La voz explica las cajas de abajo hacia arriba: código máquina (índice 3) en
   el paso `codigoMaquina`, y así hasta la de arriba. */
function pasoDelNivel(index: number): number {
  return PASOS_LENGUAJES.codigoMaquina + (3 - index);
}

function FiguraLenguajes({ r, actual }: { r: LenguajesTexts; actual: number }) {
  const P = PASOS_LENGUAJES;
  const nivelExplicado: number = 3 - (actual - P.codigoMaquina);
  const explicando: boolean = actual >= P.codigoMaquina && actual <= P.altoNivel;
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
          const entrando: boolean = actual === P.lenguajes;
          return (
            <Pulsa key={titulo} paso={pasoDelNivel(index)} actual={actual}>
              <g className={entrando ? s.morphIn : undefined} style={entrando ? { animationDelay: `${(index * 0.15).toFixed(2)}s` } : undefined}>
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

        <Entra paso={P.abstraccion} actual={actual}>
          <text x="200" y="67" fontSize="11.5" fill={TEAL} letterSpacing="2" textAnchor="end">{r.masAbstracto}</text>
          <text x="200" y="349" fontSize="11.5" fill={AMBAR} letterSpacing="2" textAnchor="end">{r.menosAbstracto}</text>
        </Entra>

        {/* El cuadro de explicación cambia de nivel en cada paso y se borra al pasar a la CPU. */}
        {explicando && (
          <g key={actual} className={s.morphIn} style={turno(0)}>
            <rect x={CUADRO_X} y="120" width={CUADRO_ANCHO} height="140" rx="8" fill={FONDO} stroke="currentColor" strokeOpacity=".35" />
            <text x={CUADRO_X + 16} y="146" fontSize="11" fill={AMBAR}>{r.niveles[nivelExplicado].titulo}</text>
            {r.niveles[nivelExplicado].explicacion.map((linea, lineaIndex) => (
              <text key={linea} x={CUADRO_X + 16} y={172 + lineaIndex * 18} fontSize="10.5" fill="currentColor" opacity=".8">
                {linea}
              </text>
            ))}
          </g>
        )}

        <EntraYPulsa paso={P.cpuLee} actual={actual}>
          <text x="780" y="335" fontSize="10.5" fill={AMBAR} textAnchor="middle">{r.laCpuLee}</text>
          <line x1="700" y1="345" x2="628" y2="345" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrD7)" />
        </EntraYPulsa>
        <Entra paso={P.motores} actual={actual}>
          <text x={NIVEL_X} y="398" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.masCercaMaquina}</text>
          <text x={NIVEL_X + NIVEL_ANCHO} y="398" fontSize="10.5" fill={AMBAR} textAnchor="end">{r.masRapido}</text>
        </Entra>
        <Entra paso={P.desarrollo} actual={actual}>
          <text x={NIVEL_X} y="18" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.masCercaHumano}</text>
          <text x={NIVEL_X + NIVEL_ANCHO} y="18" fontSize="10.5" fill={TEAL} textAnchor="end">{r.masFacil}</text>
        </Entra>
        <EntraYPulsa paso={P.wwise} actual={actual}>
          <text x="780" y="50" fontSize="10" fill={TEAL} textAnchor="middle">{r.tuEscribes[0]}</text>
          <text x="780" y="64" fontSize="10" fill={TEAL} textAnchor="middle">{r.tuEscribes[1]}</text>
          <line x1="700" y1="78" x2="628" y2="78" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrD7t)" />
        </EntraYPulsa>
      </svg>
      <figcaption>{r.caption}</figcaption>
    </figure>
  );
}

function ContenidoLenguajes({ t }: { t: Textos }) {
  const actual: number = useSlideStep();
  return (
    <>
      <EsquemaIdeas t={t} actual={1} />
      <div className={s.eyebrow}>{t.lenguajes.eyebrow}</div>
      <h2>{t.lenguajes.title}</h2>
      <FiguraLenguajes r={t.lenguajes} actual={actual} />
    </>
  );
}

/* ---------- Cierre ---------- */

/* Dos pasos, una frase cada uno. */
function ContenidoCierre({ r }: { r: CierreTexts }) {
  const actual: number = useSlideStep();
  return (
    <>
      <h2>{r.title}</h2>
      {r.ideas.map((idea, index) =>
        actual >= index ? (
          <p key={idea.clave} className={`${s.lede} ${actual === index ? s.morphIn : ''}`} style={turno(0)}>
            <span className={s.accent}>{idea.clave}</span> {idea.texto}
          </p>
        ) : null,
      )}
    </>
  );
}

export default function DatosYProgramas() {
  const t = useT(datosYProgramasDict);
  const l = t.labels;

  return (
    <Deck name={t.name} context={t.context}>
      <Slide z="▶" label={l.intro} backgroundImage={`${ASSETS_BASE}ComputerCover.jpg`}>
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

      <Slide z="0" label={[l.ideas, l.datos]}>
        <ContenidoIdeas t={t} />
      </Slide>

      <Slide z="1" label={l.dato}>
        <EsquemaIdeas t={t} actual={0} />
        <h2>{t.dato.title}</h2>
        <FiguraDato r={t.dato} />
      </Slide>

      <Slide
        z="="
        label={[l.biblioteca, l.personas, l.librosAbiertos, l.mesas, l.estanterias, l.regla, l.computador, l.llegarCpu, l.cache, l.ram, l.disco, l.cargando]}
        notes={t.biblioteca.notes}
      >
        <EsquemaIdeas t={t} actual={0} />
        <ContenidoBiblioteca r={t.biblioteca} />
      </Slide>

      <Slide z="2" label={[l.programa, l.codigo, l.ejemplos]} notes={t.programa.notes}>
        <ContenidoPrograma t={t} />
      </Slide>

      <Slide
        z="="
        label={[l.lenguajes, l.abstraccion, l.codigoMaquina, l.ensamblador, l.compilados, l.altoNivel, l.cpuLee, l.motores, l.desarrollo, l.wwise]}
      >
        <ContenidoLenguajes t={t} />
      </Slide>

      <Slide z="↺" label={[l.cierre, l.cierrePrograma]}>
        <ContenidoCierre r={t.cierre} />
      </Slide>
    </Deck>
  );
}
