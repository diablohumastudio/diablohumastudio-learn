import Deck, { Slide, useSlideStep } from '../../components/learn/Deck';
import s from '../../components/learn/Deck.module.css';
import { useT } from '../../i18n/useT';
import { datosDict } from './datos-programas-y-servidores.dict';
import type {
  ArranqueTexts,
  EscenaArranqueTexts,
  MaquinaTexts,
  RotulosBibliotecaTexts,
  RotulosComputadorTexts,
  RotulosPeticionTexts,
} from './datos-programas-y-servidores.dict';

const SHELF_XS: number[] = [40, 330, 620];
const SHELF_SPINE_OFFSETS: number[] = [14, 34, 50, 72, 92, 112, 130, 152, 170, 192, 212, 232, 246];
const SHELF_SPINES_D: string = SHELF_XS.map((shelfX) =>
  SHELF_SPINE_OFFSETS.map((offset) => `M ${shelfX + offset} 36 V 54 M ${shelfX + offset} 60 V 78`).join(' ')
).join(' ');

/* Libros cerrados en las puntas de la mesa: lejos de los abiertos del centro. */
const LIBROS_CERRADOS_XY: [number, number][] = [
  [66, 232],
  [101, 232],
  [66, 282],
  [101, 282],
  [785, 232],
  [820, 232],
  [785, 282],
  [820, 282],
];

function LibroCerrado({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="30" height="20" rx="3" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <line x1={x + 6} y1={y} x2={x + 6} y2={y + 20} stroke="#63b6a4" strokeWidth="1.5" />
    </g>
  );
}

function LibroAbierto({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M ${x + 16} ${y + 2} L ${x + 16} ${y + 24}`} stroke="#f2a33c" strokeWidth="1.5" />
      <path d={`M ${x} ${y + 4} Q ${x + 8} ${y} ${x + 16} ${y + 3} V ${y + 24} Q ${x + 8} ${y + 21} ${x} ${y + 25} Z`} fill="#232730" stroke="#f2a33c" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={`M ${x + 32} ${y + 4} Q ${x + 24} ${y} ${x + 16} ${y + 3} V ${y + 24} Q ${x + 24} ${y + 21} ${x + 32} ${y + 25} Z`} fill="#232730" stroke="#f2a33c" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={`M ${x + 4} ${y + 10} h 8 M ${x + 4} ${y + 15} h 8 M ${x + 20} ${y + 10} h 8 M ${x + 20} ${y + 15} h 8`} stroke="currentColor" strokeOpacity=".4" strokeWidth="1" />
    </g>
  );
}

/* Persona sentada a la mesa, vista de frente: una carita. */
function Cara({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="16" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <circle cx={cx - 5.5} cy={cy - 4} r="1.8" fill="#f2a33c" />
      <circle cx={cx + 5.5} cy={cy - 4} r="1.8" fill="#f2a33c" />
      <path d={`M ${cx - 6} ${cy + 4} Q ${cx} ${cy + 10} ${cx + 6} ${cy + 4}`} fill="none" stroke="#f2a33c" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

/* Geometría compartida por los dos slides (el z="=" hace morph sobre ella);
   los textos van aparte porque son lo único que cruza de dominio. */
function EscenaBiblioteca({ markerPrefix }: { markerPrefix: string }) {
  return (
    <>
      <defs>
        <marker id={markerPrefix} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
        </marker>
        <marker id={`${markerPrefix}t`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#63b6a4" />
        </marker>
      </defs>

      {SHELF_XS.map((shelfX) => (
        <g key={shelfX}>
          <rect x={shelfX} y="30" width="260" height="52" rx="6" fill="#1d2026" stroke="#63b6a4" />
          <line x1={shelfX} y1="56" x2={shelfX + 260} y2="56" stroke="#63b6a4" strokeOpacity=".6" />
        </g>
      ))}
      <path d={SHELF_SPINES_D} fill="none" stroke="#63b6a4" strokeOpacity=".45" strokeWidth="1.5" />
      <line x1="170" y1="82" x2="170" y2="186" stroke="#63b6a4" strokeWidth="2" markerEnd={`url(#${markerPrefix}t)`} />

      <rect x="40" y="192" width="840" height="140" rx="12" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      {LIBROS_CERRADOS_XY.map(([x, y]) => (
        <LibroCerrado key={`${x}-${y}`} x={x} y={y} />
      ))}

      <line x1="138" y1="262" x2="364" y2="262" stroke="#f2a33c" strokeWidth="2" markerEnd={`url(#${markerPrefix})`} />
      <rect x="370" y="228" width="180" height="68" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <LibroAbierto x={382} y={248} />

      <Cara cx={460} cy={150} />
      <Cara cx={460} cy={380} />
      <line x1="460" y1="224" x2="460" y2="172" stroke="#f2a33c" strokeWidth="2" markerEnd={`url(#${markerPrefix})`} />
      <line x1="460" y1="300" x2="460" y2="358" stroke="#f2a33c" strokeWidth="2" markerEnd={`url(#${markerPrefix})`} />
    </>
  );
}

function RotulosBiblioteca({ r }: { r: RotulosBibliotecaTexts }) {
  return (
    <>
      <text x="40" y="20" fontSize="12" fill="#63b6a4">{r.estanterias}</text>
      <text x="880" y="20" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="end">{r.todasLasMaterias}</text>
      <text x="182" y="140" fontSize="10.5" fill="#63b6a4">{r.levantarse}</text>
      <text x="56" y="212" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.laMesa}</text>
      <text x="251" y="252" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.alcanzar}</text>
      <text x="474" y="256" fontSize="12" fill="#f2a33c" textAnchor="middle">{r.librosAbiertos}</text>
      <text x="474" y="274" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.materiaActual}</text>
      <text x="474" y="186" fontSize="10.5" fill="#f2a33c">{r.leer}</text>
    </>
  );
}

function RotulosComputador({ r }: { r: RotulosComputadorTexts }) {
  return (
    <>
      <text x="40" y="20" fontSize="12" fill="#63b6a4">{r.discoDuro}</text>
      <text x="880" y="20" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="end">{r.todosLosDatos}</text>
      <text x="182" y="140" fontSize="10.5" fill="#63b6a4">{r.cargar}</text>
      <text x="56" y="212" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.ram}</text>
      <text x="251" y="252" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.traer}</text>
      <text x="474" y="256" fontSize="12" fill="#f2a33c" textAnchor="middle">{r.cache}</text>
      <text x="474" y="274" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.loQueUsas}</text>
      <text x="474" y="186" fontSize="10.5" fill="#f2a33c">{r.leerCache}</text>
      <text x="484" y="154" fontSize="10.5" fill="#f2a33c">{r.cpu}</text>
      <text x="484" y="384" fontSize="10.5" fill="#f2a33c">{r.cpu}</text>
    </>
  );
}

/* Geometría compartida por "el restaurante" y su morph "cliente-servidor";
   los textos van aparte porque son lo único que cruza de dominio. */
function EscenaPeticion({ markerPrefix }: { markerPrefix: string }) {
  return (
    <>
      <defs>
        <marker id={markerPrefix} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
        </marker>
      </defs>

      <rect x="70" y="80" width="200" height="110" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <rect x="600" y="40" width="280" height="150" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />

      <line x1="270" y1="108" x2="592" y2="108" stroke="#f2a33c" strokeWidth="2" markerEnd={`url(#${markerPrefix})`} />
      <line x1="600" y1="166" x2="278" y2="166" stroke="#f2a33c" strokeWidth="2" markerEnd={`url(#${markerPrefix})`} />
    </>
  );
}

function RotulosPeticion({ r }: { r: RotulosPeticionTexts }) {
  return (
    <>
      <text x="170" y="128" fontSize="12" fill="currentColor" textAnchor="middle">{r.cliente}</text>
      <text x="170" y="148" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.clienteSub}</text>
      <text x="740" y="68" fontSize="12" fill="#f2a33c" textAnchor="middle">{r.servidor}</text>
      <text x="618" y="100" fontSize="10.5" fill="currentColor" opacity=".8">{r.paso1}</text>
      <text x="618" y="126" fontSize="10.5" fill="currentColor" opacity=".8">{r.paso2}</text>
      <text x="618" y="152" fontSize="10.5" fill="currentColor" opacity=".8">{r.paso3}</text>
      <text x="431" y="98" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.peticion}</text>
      <text x="431" y="124" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.peticionSub}</text>
      <text x="431" y="188" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.respuesta}</text>
      <text x="431" y="204" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.respuestaSub}</text>
    </>
  );
}

/* Una computadora por dentro; `protagonista` marca qué piezas van en ámbar. */
function Maquina({ x, r, protagonista }: { x: number; r: MaquinaTexts; protagonista: 'red' | 'video' }) {
  const y = 64;
  const piezaProtagonista = { fill: '#232730', stroke: '#f2a33c', strokeWidth: 2 };
  const piezaNormal = { fill: '#1d2026', stroke: 'currentColor', strokeOpacity: 0.35 };
  const piezaAusente = { fill: 'none', stroke: 'currentColor', strokeOpacity: 0.35, strokeDasharray: '6 6' };
  const redEsProtagonista = protagonista === 'red';
  const piezas: { titulo: string; sub: string; estilo: object; protagonista: boolean; ausente: boolean }[] = [
    { titulo: r.tarjetaRed, sub: r.tarjetaRedSub, estilo: redEsProtagonista ? piezaProtagonista : piezaNormal, protagonista: redEsProtagonista, ausente: false },
    { titulo: r.fuente, sub: r.fuenteSub, estilo: redEsProtagonista ? piezaProtagonista : piezaNormal, protagonista: redEsProtagonista, ausente: false },
    {
      titulo: r.tarjetaVideo,
      sub: r.tarjetaVideoSub,
      estilo: redEsProtagonista ? piezaAusente : piezaProtagonista,
      protagonista: !redEsProtagonista,
      ausente: redEsProtagonista,
    },
  ];

  return (
    <g>
      <rect x={x} y={y} width="410" height="340" rx="12" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x={x + 20} y={y + 28} fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.titulo}</text>

      {[r.cpu, r.ram, r.disco].map((nombre, i) => (
        <g key={nombre}>
          <rect x={x + 22 + i * 124} y={y + 46} width="118" height="44" rx="8" {...piezaNormal} />
          <text x={x + 81 + i * 124} y={y + 73} fontSize="12" fill="currentColor" textAnchor="middle">{nombre}</text>
        </g>
      ))}

      {piezas.map((pieza, i) => {
        const py = y + 108 + i * 70;
        const opacidad = pieza.ausente ? '.5' : '1';
        return (
          <g key={pieza.titulo}>
            <rect x={x + 22} y={py} width="366" height="56" rx="8" {...pieza.estilo} />
            <text x={x + 205} y={py + 22} fontSize="12" fill={pieza.protagonista ? '#f2a33c' : 'currentColor'} opacity={opacidad} textAnchor="middle">{pieza.titulo}</text>
            <text x={x + 205} y={py + 40} fontSize="10.5" fill="currentColor" opacity={pieza.ausente ? '.5' : '.6'} textAnchor="middle">{pieza.sub}</text>
          </g>
        );
      })}
    </g>
  );
}

/* Escena del arranque en el celular. Cada paso del slide añade una pieza y
   anima solo esa (las anteriores quedan estáticas); paso 3 además hace aparecer
   soundbank_menus en la posición libre. */
function EscenaArranque({ paso, markerPrefix, r }: { paso: number; markerPrefix: string; r: EscenaArranqueTexts }) {
  const flecha = `url(#${markerPrefix})`;
  return (
    <>
      <defs>
        <marker id={markerPrefix} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
        </marker>
      </defs>

      <rect x="70" y="40" width="780" height="360" rx="12" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="90" y="66" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.celular}</text>

      <rect x="95" y="90" width="270" height="290" rx="8" fill="#1d2026" stroke="#63b6a4" />
      <text x="110" y="112" fontSize="11.5" fill="#63b6a4" letterSpacing="2">{r.disco}</text>
      <rect x="110" y="125" width="240" height="240" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="125" y="147" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.elJuego}</text>
      <rect x="125" y="158" width="210" height="46" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="230" y="176" fontSize="10.5" fill="currentColor" textAnchor="middle">{r.escenaMainEngine}</text>
      <text x="230" y="193" fontSize="10.5" fill="currentColor" textAnchor="middle">{r.soundEngine}</text>
      <rect x="125" y="216" width="210" height="28" rx="8" fill="#1d2026" stroke="#63b6a4" />
      <text x="230" y="234" fontSize="10.5" fill="#63b6a4" textAnchor="middle">soundbank_init</text>
      <rect x="125" y="252" width="210" height="32" rx="8" fill="#1d2026" stroke="#63b6a4" />
      <text x="230" y="272" fontSize="10.5" fill="#63b6a4" textAnchor="middle">soundbank_menus</text>
      <rect x="125" y="296" width="210" height="28" rx="8" fill="#1d2026" stroke="#63b6a4" />
      <text x="230" y="314" fontSize="10.5" fill="#63b6a4" textAnchor="middle">soundbank_nivel_1</text>

      <rect x="555" y="90" width="270" height="290" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="570" y="112" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.ram}</text>
      <rect x="595" y="150" width="200" height="26" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <text x="695" y="167" fontSize="12" fill="#f2a33c" textAnchor="middle">{r.gameEngineRam}</text>
      <rect x="595" y="184" width="200" height="26" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <text x="695" y="201" fontSize="12" fill="#f2a33c" textAnchor="middle">{r.escenaMainRam}</text>
      <rect x="595" y="244" width="200" height="26" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <text x="695" y="261" fontSize="12" fill="#f2a33c" textAnchor="middle">{r.soundEngineRam}</text>
      <rect x="595" y="278" width="200" height="26" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <text x="695" y="295" fontSize="10.5" fill="#f2a33c" textAnchor="middle">soundbank_init</text>

      <rect x="595" y="336" width="200" height="30" rx="8" fill="none" stroke="currentColor" strokeOpacity=".35" strokeDasharray="6 6" />

      {paso >= 1 && (
        <g className={paso === 1 ? s.morphIn : undefined}>
          <line x1="650" y1="210" x2="650" y2="236" stroke="#f2a33c" strokeWidth="2" markerEnd={flecha} />
          <text x="664" y="227" fontSize="10.5" fill="#f2a33c">{r.paso1}</text>
        </g>
      )}

      {paso >= 2 && (
        <g className={paso === 2 ? s.morphIn : undefined}>
          <line x1="595" y1="257" x2="343" y2="257" stroke="#f2a33c" strokeWidth="2" markerEnd={flecha} />
          <text x="469" y="247" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.paso2}</text>
        </g>
      )}

      {paso >= 3 ? (
        <>
          <g className={s.morphIn}>
            <path d="M 335 276 L 556 276 Q 568 276 568 288 L 568 339 Q 568 351 580 351 L 587 351" fill="none" stroke="#f2a33c" strokeWidth="2" markerEnd={flecha} />
            <text x="445" y="294" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.paso3}</text>
          </g>
          <g className={s.morphOut} style={{ animationDelay: '0.6s' }}>
            <text x="695" y="355" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.libre}</text>
          </g>
          <g className={s.morphPulse} style={{ animationDelay: '0.6s' }}>
            <g className={s.morphIn} style={{ animationDelay: '0.6s' }}>
              <rect x="595" y="336" width="200" height="30" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
              <text x="695" y="355" fontSize="10.5" fill="#f2a33c" textAnchor="middle">soundbank_menus</text>
            </g>
          </g>
        </>
      ) : (
        <text x="695" y="355" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.libre}</text>
      )}
    </>
  );
}

/* Un solo slide con cuatro pasos; el paso actual lo da el Deck. */
function FiguraArranque({ r }: { r: ArranqueTexts }) {
  const paso = useSlideStep();
  return (
    <figure>
      <svg viewBox="0 0 920 420" role="img" aria-label={r.arias[paso]}>
        <EscenaArranque paso={paso} markerPrefix="arrD6" r={r.escena} />
      </svg>
      <figcaption>{r.captions[paso]}</figcaption>
    </figure>
  );
}

export default function DatosProgramasYServidores() {
  const t = useT(datosDict);

  return (
    <Deck name={t.name} context={t.context}>
      <Slide z="▶" label={t.labels.intro} backgroundImage="/assets/presentations/wwise-unreal/ComputerCover.jpg">
        <div className={s.eyebrow}>{t.cover.eyebrow}</div>
        <h1>{t.cover.title}</h1>
        <p className={s.note}>{t.cover.hint}</p>
      </Slide>

      <Slide z="1" label={t.labels.biblioteca}>
        <div className={s.eyebrow}>{t.biblioteca.eyebrow}</div>
        <h2>{t.biblioteca.title}</h2>
        <figure>
          <svg viewBox="0 0 920 410" role="img" aria-label={t.biblioteca.aria}>
            <EscenaBiblioteca markerPrefix="arrD1" />
            <RotulosBiblioteca r={t.biblioteca.rotulos} />
          </svg>
          <figcaption>{t.biblioteca.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label={t.labels.computador}>
        <div className={s.eyebrow}>{t.computador.eyebrow}</div>
        <h2>{t.computador.title}</h2>
        <figure>
          <svg viewBox="0 0 920 410" role="img" aria-label={t.computador.aria}>
            <EscenaBiblioteca markerPrefix="arrD2" />
            {/* Paso único, sin espera y más lento que el estándar: los rótulos cruzan de dominio */}
            <g className={s.morphOut} style={{ animationDuration: '1.2s' }}>
              <RotulosBiblioteca r={t.biblioteca.rotulos} />
            </g>
            <g className={s.morphIn} style={{ animationDuration: '1.2s' }}>
              <RotulosComputador r={t.computador.rotulos} />
            </g>
          </svg>
          <figcaption>{t.computador.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="2" label={t.labels.lenguajes}>
        <div className={s.eyebrow}>{t.lenguajes.eyebrow}</div>
        <h2>{t.lenguajes.title}</h2>
        <figure>
          <svg viewBox="0 0 920 420" role="img" aria-label={t.lenguajes.aria}>
            <defs>
              <marker id="arrD7" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
              <marker id="arrD7t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#63b6a4" />
              </marker>
            </defs>

            <text x="220" y="18" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{t.lenguajes.masCercaHumano}</text>
            <text x="700" y="18" fontSize="10.5" fill="#63b6a4" textAnchor="end">{t.lenguajes.masFacil}</text>

            {t.lenguajes.niveles.map(({ titulo, lineas }, i) => {
              const y = 34 + i * 94;
              const esMaquina = i === t.lenguajes.niveles.length - 1;
              return (
                <g key={titulo}>
                  {esMaquina ? (
                    <rect x="220" y={y} width="480" height="58" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
                  ) : (
                    <rect x="220" y={y} width="480" height="58" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
                  )}
                  <text x="240" y={y + 21} fontSize="12" fill={esMaquina ? '#f2a33c' : 'currentColor'}>{titulo}</text>
                  <text x="240" y={y + 37} fontSize="10.5" fill="currentColor" opacity=".6">{lineas[0]}</text>
                  <text x="240" y={y + 51} fontSize="10.5" fill="currentColor" opacity=".6">{lineas[1]}</text>
                  {!esMaquina && (
                    <line x1="460" y1={y + 62} x2="460" y2={y + 88} stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD7)" />
                  )}
                </g>
              );
            })}

            <text x="220" y="398" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{t.lenguajes.masCercaMaquina}</text>
            <text x="700" y="398" fontSize="10.5" fill="#f2a33c" textAnchor="end">{t.lenguajes.masRapido}</text>

            <text x="770" y="53" fontSize="10.5" fill="#63b6a4" textAnchor="middle">{t.lenguajes.tuEscribes}</text>
            <line x1="830" y1="63" x2="708" y2="63" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrD7t)" />
            <text x="770" y="335" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{t.lenguajes.laCpuLee}</text>
            <line x1="830" y1="345" x2="708" y2="345" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD7)" />
          </svg>
          <figcaption>{t.lenguajes.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="3" label={t.labels.restaurante}>
        <div className={s.eyebrow}>{t.restaurante.eyebrow}</div>
        <h2>{t.restaurante.title}</h2>
        <figure>
          <svg viewBox="0 0 920 230" role="img" aria-label={t.restaurante.aria}>
            <EscenaPeticion markerPrefix="arrD3" />
            <RotulosPeticion r={t.restaurante.rotulos} />
          </svg>
          <figcaption>{t.restaurante.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label={t.labels.clienteServidor}>
        <div className={s.eyebrow}>{t.clienteServidor.eyebrow}</div>
        <h2>{t.clienteServidor.title}</h2>
        <figure>
          <svg viewBox="0 0 920 230" role="img" aria-label={t.clienteServidor.aria}>
            <EscenaPeticion markerPrefix="arrD3b" />
            {/* Paso único, sin espera y más lento que el estándar: los rótulos cruzan de dominio */}
            <g className={s.morphOut} style={{ animationDuration: '1.2s' }}>
              <RotulosPeticion r={t.restaurante.rotulos} />
            </g>
            <g className={s.morphIn} style={{ animationDuration: '1.2s' }}>
              <RotulosPeticion r={t.clienteServidor.rotulos} />
            </g>
          </svg>
          <figcaption>{t.clienteServidor.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="4" label={t.labels.servidores}>
        <div className={s.eyebrow}>{t.servidores.eyebrow}</div>
        <h2>{t.servidores.title}</h2>
        <figure>
          <svg viewBox="0 0 920 300" role="img" aria-label={t.servidores.aria}>
            <defs>
              <marker id="arrD4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>

            {t.servidores.filas.map(({ servidor, pides, sirve, ejemplos }, i) => {
              const y = 40 + i * 90;
              return (
                <g key={servidor}>
                  <rect x="330" y={y} width="280" height="60" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
                  <text x="470" y={y + 35} fontSize="12" fill="#f2a33c" textAnchor="middle">{servidor}</text>
                  <text x="206" y={y + 8} fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{pides}</text>
                  <line x1="90" y1={y + 18} x2="322" y2={y + 18} stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD4)" />
                  <line x1="330" y1={y + 42} x2="98" y2={y + 42} stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD4)" />
                  <text x="206" y={y + 56} fontSize="10.5" fill="#f2a33c" textAnchor="middle">{sirve}</text>
                  <text x="628" y={y + 35} fontSize="10.5" fill="currentColor" opacity=".6">{ejemplos}</text>
                </g>
              );
            })}
          </svg>
          <figcaption>{t.servidores.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="5" label={t.labels.hardware}>
        <div className={s.eyebrow}>{t.hardware.eyebrow}</div>
        <h2>{t.hardware.title}</h2>
        <figure>
          <svg viewBox="0 0 920 420" role="img" aria-label={t.hardware.aria}>
            <defs>
              <marker id="arrD5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>

            <line x1="150" y1="10" x2="150" y2="58" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD5)" />
            <text x="160" y="36" fontSize="10.5" fill="#f2a33c">{t.hardware.peticiones}</text>
            <line x1="340" y1="58" x2="340" y2="10" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD5)" />
            <text x="350" y="36" fontSize="10.5" fill="#f2a33c">{t.hardware.respuestas}</text>

            <Maquina x={40} r={t.hardware.servidor} protagonista="red" />
            <Maquina x={470} r={t.hardware.diseno} protagonista="video" />
          </svg>
          <figcaption>{t.hardware.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="6" label={[t.labels.arranque, t.labels.pide, t.labels.busca, t.labels.sube]}>
        <div className={s.eyebrow}>{t.arranque.eyebrow}</div>
        <h2>{t.arranque.title}</h2>
        <FiguraArranque r={t.arranque} />
      </Slide>
    </Deck>
  );
}
