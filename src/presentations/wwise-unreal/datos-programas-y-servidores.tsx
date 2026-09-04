import Deck, { Slide } from '../../components/learn/Deck';
import s from '../../components/learn/Deck.module.css';
import { useT } from '../../i18n/useT';
import { datosDict } from './datos-programas-y-servidores.dict';
import type {
  EscenaArranqueTexts,
  RotulosBibliotecaTexts,
  RotulosClienteServidorTexts,
  RotulosComputadorTexts,
  RotulosRestauranteTexts,
} from './datos-programas-y-servidores.dict';

const SHELF_XS: number[] = [70, 240, 410];
const SPINE_OFFSETS: number[] = [22, 44, 61, 86, 105, 127];
const SPINES_D: string = SHELF_XS.map((shelfX) =>
  SPINE_OFFSETS.map((offset) => `M ${shelfX + offset} 34 V 66`).join(' ')
).join(' ');

const LIBROS_XY: [number, number][] = [
  [490, 225],
  [525, 225],
  [95, 365],
  [130, 365],
  [545, 365],
  [580, 365],
];

function Libro({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="30" height="20" rx="3" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <line x1={x + 8} y1={y - 5} x2={x + 8} y2={y + 4} stroke="#63b6a4" strokeWidth="1.5" />
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
        <rect key={shelfX} x={shelfX} y="24" width="150" height="52" rx="8" fill="#1d2026" stroke="#63b6a4" />
      ))}
      <path d={SPINES_D} fill="none" stroke="#63b6a4" strokeOpacity=".45" strokeWidth="1.5" />
      <line x1="145" y1="76" x2="145" y2="194" stroke="#63b6a4" strokeWidth="2" markerEnd={`url(#${markerPrefix}t)`} />

      <rect x="70" y="200" width="580" height="200" rx="12" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      {LIBROS_XY.map(([x, y]) => (
        <Libro key={`${x}-${y}`} x={x} y={y} />
      ))}

      <path d="M 486 235 L 412 235 Q 400 235 400 247 L 400 264" fill="none" stroke="#f2a33c" strokeWidth="2" markerEnd={`url(#${markerPrefix})`} />
      <rect x="290" y="270" width="140" height="64" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <circle cx="228" cy="302" r="13" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <circle cx="492" cy="302" r="13" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <line x1="290" y1="302" x2="248" y2="302" stroke="#f2a33c" strokeWidth="2" markerEnd={`url(#${markerPrefix})`} />
      <line x1="430" y1="302" x2="472" y2="302" stroke="#f2a33c" strokeWidth="2" markerEnd={`url(#${markerPrefix})`} />
    </>
  );
}

function RotulosBiblioteca({ r }: { r: RotulosBibliotecaTexts }) {
  return (
    <>
      <text x="615" y="46" fontSize="12" fill="#63b6a4">{r.estanterias}</text>
      <text x="615" y="64" fontSize="10.5" fill="currentColor" opacity=".6">{r.todasLasMaterias}</text>
      <text x="157" y="140" fontSize="10.5" fill="#63b6a4">{r.levantarse}</text>
      <text x="95" y="226" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.laMesa}</text>
      <text x="478" y="227" fontSize="10.5" fill="#f2a33c" textAnchor="end">{r.alcanzar}</text>
      <text x="360" y="296" fontSize="12" fill="#f2a33c" textAnchor="middle">{r.librosAbiertos}</text>
      <text x="360" y="314" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.materiaActual}</text>
      <text x="360" y="352" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.leer}</text>
    </>
  );
}

function RotulosComputador({ r }: { r: RotulosComputadorTexts }) {
  return (
    <>
      <text x="615" y="46" fontSize="12" fill="#63b6a4">{r.discoDuro}</text>
      <text x="615" y="64" fontSize="10.5" fill="currentColor" opacity=".6">{r.todosLosDatos}</text>
      <text x="157" y="140" fontSize="10.5" fill="#63b6a4">{r.cargar}</text>
      <text x="95" y="226" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.ram}</text>
      <text x="478" y="227" fontSize="10.5" fill="#f2a33c" textAnchor="end">{r.traer}</text>
      <text x="360" y="296" fontSize="12" fill="#f2a33c" textAnchor="middle">{r.cache}</text>
      <text x="360" y="314" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.loQueUsas}</text>
      <text x="360" y="352" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.leerCache}</text>
      <text x="228" y="341" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.cpu}</text>
      <text x="492" y="341" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.cpu}</text>
    </>
  );
}

/* Geometría compartida por "el restaurante" y su morph "cliente-servidor";
   los textos van aparte porque son lo único que cruza de dominio. */
function EscenaRestaurante({ markerPrefix }: { markerPrefix: string }) {
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

      <rect x="700" y="28" width="150" height="52" rx="8" fill="#1d2026" stroke="#63b6a4" />
      <line x1="775" y1="80" x2="775" y2="152" stroke="#63b6a4" strokeWidth="2" markerEnd={`url(#${markerPrefix}t)`} />

      <rect x="70" y="160" width="160" height="80" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <rect x="700" y="160" width="150" height="80" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />

      <line x1="230" y1="178" x2="692" y2="178" stroke="#f2a33c" strokeWidth="2" markerEnd={`url(#${markerPrefix})`} />
      <line x1="700" y1="222" x2="238" y2="222" stroke="#f2a33c" strokeWidth="2" markerEnd={`url(#${markerPrefix})`} />
    </>
  );
}

function RotulosRestaurante({ r }: { r: RotulosRestauranteTexts }) {
  return (
    <>
      <text x="775" y="50" fontSize="12" fill="#63b6a4" textAnchor="middle">{r.ingredientes}</text>
      <text x="775" y="68" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.laDespensa}</text>
      <text x="150" y="192" fontSize="12" fill="currentColor" textAnchor="middle">{r.tu}</text>
      <text x="150" y="210" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.enLaMesa}</text>
      <text x="775" y="186" fontSize="12" fill="#f2a33c" textAnchor="middle">{r.cocina}</text>
      <text x="775" y="204" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.hayIngredientes}</text>
      <text x="775" y="220" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.siSeCocina}</text>
      <text x="461" y="168" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.pides}</text>
      <text x="461" y="196" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.aTuMedida}</text>
      <text x="461" y="242" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.teTrae}</text>
      <text x="461" y="258" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.oNoHay}</text>
    </>
  );
}

function RotulosClienteServidor({ r }: { r: RotulosClienteServidorTexts }) {
  return (
    <>
      <text x="775" y="50" fontSize="12" fill="#63b6a4" textAnchor="middle">{r.recursos}</text>
      <text x="775" y="68" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.datosPermisos}</text>
      <text x="150" y="192" fontSize="12" fill="currentColor" textAnchor="middle">{r.pcCliente}</text>
      <text x="150" y="210" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.quienPide}</text>
      <text x="775" y="186" fontSize="12" fill="#f2a33c" textAnchor="middle">{r.pcServidor}</text>
      <text x="775" y="204" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.tienesAcceso}</text>
      <text x="775" y="220" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.siArma}</text>
      <text x="461" y="168" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.peticion}</text>
      <text x="461" y="196" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.loQueQuieres}</text>
      <text x="461" y="242" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.respuesta}</text>
      <text x="461" y="258" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.oError}</text>
    </>
  );
}

/* Escena del arranque en el celular. Cada slide "=" avanza un paso y anima solo
   la pieza nueva (las anteriores quedan estáticas); paso 3 además hace aparecer
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

const ARRANQUE_PASOS: { label: 'arranque' | 'pide' | 'busca' | 'sube'; z: string; markerPrefix: string }[] = [
  { label: 'arranque', z: '6', markerPrefix: 'arrD6a' },
  { label: 'pide', z: '=', markerPrefix: 'arrD6b' },
  { label: 'busca', z: '=', markerPrefix: 'arrD6c' },
  { label: 'sube', z: '=', markerPrefix: 'arrD6d' },
];

export default function DatosProgramasYServidores() {
  const t = useT(datosDict);

  return (
    <Deck name={t.name} context={t.context}>
      <Slide z="▶" label={t.labels.intro} backgroundImage="/assets/presentations/wwise-unreal/Cover.jpg">
        <div className={s.eyebrow}>{t.cover.eyebrow}</div>
        <h1>{t.cover.title}</h1>
        <p className={s.note}>{t.cover.hint}</p>
      </Slide>

      <Slide z="1" label={t.labels.biblioteca}>
        <div className={s.eyebrow}>{t.biblioteca.eyebrow}</div>
        <h2>{t.biblioteca.title}</h2>
        <figure>
          <svg viewBox="0 0 920 430" role="img" aria-label={t.biblioteca.aria}>
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
          <svg viewBox="0 0 920 430" role="img" aria-label={t.computador.aria}>
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
          <svg viewBox="0 0 920 270" role="img" aria-label={t.restaurante.aria}>
            <EscenaRestaurante markerPrefix="arrD3" />
            <RotulosRestaurante r={t.restaurante.rotulos} />
          </svg>
          <figcaption>{t.restaurante.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label={t.labels.clienteServidor}>
        <div className={s.eyebrow}>{t.clienteServidor.eyebrow}</div>
        <h2>{t.clienteServidor.title}</h2>
        <figure>
          <svg viewBox="0 0 920 270" role="img" aria-label={t.clienteServidor.aria}>
            <EscenaRestaurante markerPrefix="arrD3b" />
            {/* Paso único, sin espera y más lento que el estándar: los rótulos cruzan de dominio */}
            <g className={s.morphOut} style={{ animationDuration: '1.2s' }}>
              <RotulosRestaurante r={t.restaurante.rotulos} />
            </g>
            <g className={s.morphIn} style={{ animationDuration: '1.2s' }}>
              <RotulosClienteServidor r={t.clienteServidor.rotulos} />
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

            {t.servidores.filas.map(({ servidor, pides, sirve }, i) => {
              const y = 40 + i * 90;
              return (
                <g key={servidor}>
                  <rect x="330" y={y} width="280" height="60" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
                  <text x="470" y={y + 35} fontSize="12" fill="#f2a33c" textAnchor="middle">{servidor}</text>
                  <text x="206" y={y + 8} fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{pides}</text>
                  <line x1="90" y1={y + 18} x2="322" y2={y + 18} stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD4)" />
                  <line x1="330" y1={y + 42} x2="98" y2={y + 42} stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD4)" />
                  <text x="206" y={y + 56} fontSize="10.5" fill="#f2a33c" textAnchor="middle">{sirve}</text>
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
          <svg viewBox="0 0 920 360" role="img" aria-label={t.hardware.aria}>
            <defs>
              <marker id="arrD5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>

            <rect x="300" y="50" width="360" height="290" rx="12" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="320" y="78" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{t.hardware.computadoraServidor}</text>

            <rect x="330" y="100" width="90" height="46" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="375" y="128" fontSize="12" fill="currentColor" textAnchor="middle">{t.hardware.cpu}</text>
            <rect x="435" y="100" width="90" height="46" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="480" y="128" fontSize="12" fill="currentColor" textAnchor="middle">{t.hardware.ram}</text>
            <rect x="540" y="100" width="90" height="46" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="585" y="128" fontSize="12" fill="currentColor" textAnchor="middle">{t.hardware.disco}</text>

            <rect x="330" y="170" width="300" height="56" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="480" y="192" fontSize="12" fill="#f2a33c" textAnchor="middle">{t.hardware.tarjetaRed}</text>
            <text x="480" y="210" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{t.hardware.conectada}</text>

            <rect x="330" y="250" width="300" height="56" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="480" y="272" fontSize="12" fill="#f2a33c" textAnchor="middle">{t.hardware.fuente}</text>
            <text x="480" y="290" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{t.hardware.encendida}</text>

            <line x1="90" y1="186" x2="322" y2="186" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD5)" />
            <text x="196" y="176" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{t.hardware.peticiones}</text>
            <line x1="330" y1="212" x2="98" y2="212" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD5)" />
            <text x="196" y="230" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{t.hardware.respuestas}</text>

            <rect x="700" y="170" width="170" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity=".35" strokeDasharray="6 6" />
            <text x="785" y="190" fontSize="12" fill="currentColor" opacity=".5" textAnchor="middle">{t.hardware.tarjetaGrafica}</text>
            <text x="785" y="206" fontSize="10.5" fill="currentColor" opacity=".5" textAnchor="middle">{t.hardware.noHaceFalta}</text>
            <text x="785" y="220" fontSize="10.5" fill="currentColor" opacity=".5" textAnchor="middle">{t.hardware.nadieMira}</text>
          </svg>
          <figcaption>{t.hardware.caption}</figcaption>
        </figure>
      </Slide>

      {ARRANQUE_PASOS.map(({ label, z, markerPrefix }, paso) => (
        <Slide key={label} z={z} label={t.labels[label]}>
          <div className={s.eyebrow}>{t.arranque.eyebrow}</div>
          <h2>{t.arranque.title}</h2>
          <figure>
            <svg viewBox="0 0 920 420" role="img" aria-label={t.arranque.arias[paso]}>
              <EscenaArranque paso={paso} markerPrefix={markerPrefix} r={t.arranque.escena} />
            </svg>
            <figcaption>{t.arranque.captions[paso]}</figcaption>
          </figure>
        </Slide>
      ))}
    </Deck>
  );
}
