import Deck, { Slide } from '../../components/incine/Deck';
import s from '../../components/incine/Deck.module.css';

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

function RotulosBiblioteca() {
  return (
    <>
      <text x="615" y="46" fontSize="12" fill="#63b6a4">ESTANTERÍAS</text>
      <text x="615" y="64" fontSize="10.5" fill="currentColor" opacity=".6">todas las materias</text>
      <text x="157" y="140" fontSize="10.5" fill="#63b6a4">levantarse · lento</text>
      <text x="95" y="226" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">LA MESA</text>
      <text x="478" y="227" fontSize="10.5" fill="#f2a33c" textAnchor="end">alcanzar · rápido</text>
      <text x="360" y="296" fontSize="12" fill="#f2a33c" textAnchor="middle">LIBROS ABIERTOS</text>
      <text x="360" y="314" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">la materia actual</text>
      <text x="360" y="352" fontSize="10.5" fill="#f2a33c" textAnchor="middle">leer · al instante</text>
    </>
  );
}

function RotulosComputador() {
  return (
    <>
      <text x="615" y="46" fontSize="12" fill="#63b6a4">DISCO DURO</text>
      <text x="615" y="64" fontSize="10.5" fill="currentColor" opacity=".6">todos los datos</text>
      <text x="157" y="140" fontSize="10.5" fill="#63b6a4">cargar del disco · lento</text>
      <text x="95" y="226" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">MEMORIA RAM</text>
      <text x="478" y="227" fontSize="10.5" fill="#f2a33c" textAnchor="end">traer de RAM · rápido</text>
      <text x="360" y="296" fontSize="12" fill="#f2a33c" textAnchor="middle">CACHÉ</text>
      <text x="360" y="314" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">lo que usas ya mismo</text>
      <text x="360" y="352" fontSize="10.5" fill="#f2a33c" textAnchor="middle">leer la caché · al instante</text>
      <text x="228" y="341" fontSize="10.5" fill="#f2a33c" textAnchor="middle">CPU</text>
      <text x="492" y="341" fontSize="10.5" fill="#f2a33c" textAnchor="middle">CPU</text>
    </>
  );
}

export default function DondeVivenLosDatos() {
  return (
    <Deck name="¿Dónde viven los datos?" context="Intro a Wwise · Wwise + Unreal">
      <Slide z="▶" label="intro" backgroundImage="/assets/presentations/wwise-unreal/Cover.jpg">
        <div className={s.eyebrow}>Intro a Wwise</div>
        <h1>
          ¿Dónde viven
          <br />
          los <span className={s.accent}>datos</span>?
        </h1>
        <p className={s.note}>Navega con ← → · espacio</p>
      </Slide>

      <Slide z="1" label="biblioteca">
        <div className={s.eyebrow}>Concepto 1 · la biblioteca</div>
        <h2>
          Para trabajar, los datos tienen que <span className={s.accent}>llegar a tus manos</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 920 430"
            role="img"
            aria-label="Una biblioteca vista desde arriba: las estanterías guardan todas las materias; en la mesa hay libros a medio leer con separadores; en el centro, dos personas leen los libros abiertos de la materia actual. Levantarse a las estanterías es lento, alcanzar otra esquina de la mesa es rápido y leer el libro abierto es instantáneo."
          >
            <EscenaBiblioteca markerPrefix="arrD1" />
            <RotulosBiblioteca />
          </svg>
          <figcaption>Cuanto más cerca de las manos, más rápido — y menos cabe.</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label="computador">
        <div className={s.eyebrow}>Concepto 1 · el computador</div>
        <h2>
          La biblioteca <span className={s.accent}>es tu computador</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 920 430"
            role="img"
            aria-label="El mismo diagrama de la biblioteca con nombres de hardware: las estanterías son el disco duro, la mesa es la memoria RAM, los libros abiertos son la caché y las dos personas son los CPU."
          >
            <EscenaBiblioteca markerPrefix="arrD2" />
            {/* Paso único, sin espera y más lento que el estándar: los rótulos cruzan de dominio */}
            <g className={s.morphOut} style={{ animationDuration: '1.2s' }}>
              <RotulosBiblioteca />
            </g>
            <g className={s.morphIn} style={{ animationDuration: '1.2s' }}>
              <RotulosComputador />
            </g>
          </svg>
          <figcaption>Mismo lugar, otros nombres: disco, RAM y caché son distancias hasta tus manos.</figcaption>
        </figure>
      </Slide>
    </Deck>
  );
}
