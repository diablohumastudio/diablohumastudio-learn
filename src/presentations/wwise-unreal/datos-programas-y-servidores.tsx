import Deck, { Slide } from '../../components/learn/Deck';
import s from '../../components/learn/Deck.module.css';

const SHELF_XS: number[] = [70, 240, 410];
const SPINE_OFFSETS: number[] = [22, 44, 61, 86, 105, 127];
const SPINES_D: string = SHELF_XS.map((shelfX) =>
  SPINE_OFFSETS.map((offset) => `M ${shelfX + offset} 34 V 66`).join(' ')
).join(' ');

const NIVELES_DE_LENGUAJE: { titulo: string; lineas: [string, string] }[] = [
  { titulo: 'PYTHON / JAVASCRIPT', lineas: ['se lee casi como inglés', 'la memoria la maneja el lenguaje por ti'] },
  { titulo: 'C++ / RUST', lineas: ['control total del hardware y la memoria', 'se compila antes de correr'] },
  { titulo: 'ENSAMBLADOR (ASSEMBLY)', lineas: ['instrucciones directas al procesador', 'difícil de leer para un humano'] },
  { titulo: 'CÓDIGO MÁQUINA · 1s y 0s', lineas: ['el único lenguaje que la CPU entiende', 'pulsos eléctricos: 1 = encendido · 0 = apagado'] },
];

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

function RotulosRestaurante() {
  return (
    <>
      <text x="775" y="50" fontSize="12" fill="#63b6a4" textAnchor="middle">INGREDIENTES</text>
      <text x="775" y="68" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">la despensa</text>
      <text x="150" y="192" fontSize="12" fill="currentColor" textAnchor="middle">TÚ</text>
      <text x="150" y="210" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">en la mesa</text>
      <text x="775" y="186" fontSize="12" fill="#f2a33c" textAnchor="middle">COCINA</text>
      <text x="775" y="204" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">¿hay ingredientes?</text>
      <text x="775" y="220" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">sí → se cocina</text>
      <text x="461" y="168" fontSize="10.5" fill="#f2a33c" textAnchor="middle">pides la hamburguesa al camarero</text>
      <text x="461" y="196" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">a tu medida</text>
      <text x="461" y="242" fontSize="10.5" fill="#f2a33c" textAnchor="middle">el camarero te trae la hamburguesa</text>
      <text x="461" y="258" fontSize="10.5" fill="#f2a33c" textAnchor="middle">…o la noticia de que no hay hamburguesas</text>
    </>
  );
}

function RotulosClienteServidor() {
  return (
    <>
      <text x="775" y="50" fontSize="12" fill="#63b6a4" textAnchor="middle">RECURSOS</text>
      <text x="775" y="68" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">datos · permisos</text>
      <text x="150" y="192" fontSize="12" fill="currentColor" textAnchor="middle">PC CLIENTE</text>
      <text x="150" y="210" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">quien pide</text>
      <text x="775" y="186" fontSize="12" fill="#f2a33c" textAnchor="middle">PC SERVIDOR</text>
      <text x="775" y="204" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">¿tienes acceso?</text>
      <text x="775" y="220" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">sí → arma la respuesta</text>
      <text x="461" y="168" fontSize="10.5" fill="#f2a33c" textAnchor="middle">petición</text>
      <text x="461" y="196" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">lo que quieres, como lo quieres</text>
      <text x="461" y="242" fontSize="10.5" fill="#f2a33c" textAnchor="middle">respuesta</text>
      <text x="461" y="258" fontSize="10.5" fill="#f2a33c" textAnchor="middle">…o un error si no se puede</text>
    </>
  );
}

/* Escena del arranque en el celular. Cada slide "=" avanza un paso y anima solo
   la pieza nueva (las anteriores quedan estáticas); paso 3 además hace aparecer
   soundbank_menus en la posición libre. */
function EscenaArranque({ paso, markerPrefix }: { paso: number; markerPrefix: string }) {
  const flecha = `url(#${markerPrefix})`;
  return (
    <>
      <defs>
        <marker id={markerPrefix} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
        </marker>
      </defs>

      <rect x="70" y="40" width="780" height="360" rx="12" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="90" y="66" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">CELULAR</text>

      <rect x="95" y="90" width="270" height="290" rx="8" fill="#1d2026" stroke="#63b6a4" />
      <text x="110" y="112" fontSize="11.5" fill="#63b6a4" letterSpacing="2">DISCO</text>
      <rect x="110" y="125" width="240" height="240" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="125" y="147" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">EL JUEGO</text>
      <rect x="125" y="158" width="210" height="46" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="230" y="176" fontSize="10.5" fill="currentColor" textAnchor="middle">escena main · game engine</text>
      <text x="230" y="193" fontSize="10.5" fill="currentColor" textAnchor="middle">sound engine</text>
      <rect x="125" y="216" width="210" height="28" rx="8" fill="#1d2026" stroke="#63b6a4" />
      <text x="230" y="234" fontSize="10.5" fill="#63b6a4" textAnchor="middle">soundbank_init</text>
      <rect x="125" y="252" width="210" height="32" rx="8" fill="#1d2026" stroke="#63b6a4" />
      <text x="230" y="272" fontSize="10.5" fill="#63b6a4" textAnchor="middle">soundbank_menus</text>
      <rect x="125" y="296" width="210" height="28" rx="8" fill="#1d2026" stroke="#63b6a4" />
      <text x="230" y="314" fontSize="10.5" fill="#63b6a4" textAnchor="middle">soundbank_nivel_1</text>

      <rect x="555" y="90" width="270" height="290" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="570" y="112" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">MEMORIA RAM</text>
      <rect x="595" y="150" width="200" height="26" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <text x="695" y="167" fontSize="12" fill="#f2a33c" textAnchor="middle">GAME ENGINE</text>
      <rect x="595" y="184" width="200" height="26" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <text x="695" y="201" fontSize="12" fill="#f2a33c" textAnchor="middle">ESCENA MAIN</text>
      <rect x="595" y="244" width="200" height="26" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <text x="695" y="261" fontSize="12" fill="#f2a33c" textAnchor="middle">SOUND ENGINE</text>
      <rect x="595" y="278" width="200" height="26" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <text x="695" y="295" fontSize="10.5" fill="#f2a33c" textAnchor="middle">soundbank_init</text>

      <rect x="595" y="336" width="200" height="30" rx="8" fill="none" stroke="currentColor" strokeOpacity=".35" strokeDasharray="6 6" />

      {paso >= 1 && (
        <g className={paso === 1 ? s.morphIn : undefined}>
          <line x1="650" y1="210" x2="650" y2="236" stroke="#f2a33c" strokeWidth="2" markerEnd={flecha} />
          <text x="664" y="227" fontSize="10.5" fill="#f2a33c">① «suena el menú»</text>
        </g>
      )}

      {paso >= 2 && (
        <g className={paso === 2 ? s.morphIn : undefined}>
          <line x1="595" y1="257" x2="343" y2="257" stroke="#f2a33c" strokeWidth="2" markerEnd={flecha} />
          <text x="469" y="247" fontSize="10.5" fill="#f2a33c" textAnchor="middle">② busca soundbank_menus</text>
        </g>
      )}

      {paso >= 3 ? (
        <>
          <g className={s.morphIn}>
            <path d="M 335 276 L 556 276 Q 568 276 568 288 L 568 339 Q 568 351 580 351 L 587 351" fill="none" stroke="#f2a33c" strokeWidth="2" markerEnd={flecha} />
            <text x="445" y="294" fontSize="10.5" fill="#f2a33c" textAnchor="middle">③ sube a la RAM</text>
          </g>
          <g className={s.morphOut} style={{ animationDelay: '0.6s' }}>
            <text x="695" y="355" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">…libre</text>
          </g>
          <g className={s.morphPulse} style={{ animationDelay: '0.6s' }}>
            <g className={s.morphIn} style={{ animationDelay: '0.6s' }}>
              <rect x="595" y="336" width="200" height="30" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
              <text x="695" y="355" fontSize="10.5" fill="#f2a33c" textAnchor="middle">soundbank_menus</text>
            </g>
          </g>
        </>
      ) : (
        <text x="695" y="355" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">…libre</text>
      )}
    </>
  );
}

export default function DatosProgramasYServidores() {
  return (
    <Deck name="Datos, programas y servidores" context="Intro a Wwise · Wwise + Unreal">
      <Slide z="▶" label="intro" backgroundImage="/assets/presentations/wwise-unreal/Cover.jpg">
        <div className={s.eyebrow}>Intro a Wwise · del disco al servidor</div>
        <h1>
          Datos, programas
          <br />
          y <span className={s.accent}>servidores</span>
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

      <Slide z="2" label="lenguajes">
        <div className={s.eyebrow}>Concepto 2 · los lenguajes</div>
        <h2>
          La CPU solo entiende <span className={s.accent}>unos y ceros</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 920 420"
            role="img"
            aria-label="Cuatro niveles de lenguaje apilados de arriba hacia abajo, del más cercano al humano al más cercano a la máquina: Python y JavaScript (se leen casi como inglés y el lenguaje maneja la memoria por ti), C++ y Rust (control total del hardware y la memoria, se compilan antes de correr), ensamblador (instrucciones directas al procesador, difícil de leer para un humano) y código máquina en unos y ceros (el único lenguaje que la CPU entiende: pulsos eléctricos, 1 encendido y 0 apagado). Tú escribes en el nivel de arriba; la CPU lee el de abajo."
          >
            <defs>
              <marker id="arrD7" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
              <marker id="arrD7t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#63b6a4" />
              </marker>
            </defs>

            <text x="220" y="18" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">MÁS CERCA DEL HUMANO</text>
            <text x="700" y="18" fontSize="10.5" fill="#63b6a4" textAnchor="end">más fácil para ti</text>

            {NIVELES_DE_LENGUAJE.map(({ titulo, lineas }, i) => {
              const y = 34 + i * 94;
              const esMaquina = i === NIVELES_DE_LENGUAJE.length - 1;
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

            <text x="220" y="398" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">MÁS CERCA DE LA MÁQUINA</text>
            <text x="700" y="398" fontSize="10.5" fill="#f2a33c" textAnchor="end">más rápido para la CPU</text>

            <text x="770" y="53" fontSize="10.5" fill="#63b6a4" textAnchor="middle">tú escribes aquí</text>
            <line x1="830" y1="63" x2="708" y2="63" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrD7t)" />
            <text x="770" y="335" fontSize="10.5" fill="#f2a33c" textAnchor="middle">la CPU lee aquí</text>
            <line x1="830" y1="345" x2="708" y2="345" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD7)" />
          </svg>
          <figcaption>Cuanto más arriba, más fácil para ti; cuanto más abajo, más rápido para la CPU.</figcaption>
        </figure>
      </Slide>

      <Slide z="3" label="restaurante">
        <div className={s.eyebrow}>Concepto 3 · el restaurante</div>
        <h2>
          Un servidor es un programa que <span className={s.accent}>atiende peticiones</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 920 270"
            role="img"
            aria-label="Un restaurante visto como flujo: tú en la mesa pides la hamburguesa al camarero, la petición llega a la cocina, la cocina verifica si hay ingredientes y la cocina, y el camarero te trae la hamburguesa o la noticia de que no hay. La despensa de ingredientes alimenta a la cocina desde arriba."
          >
            <EscenaRestaurante markerPrefix="arrD3" />
            <RotulosRestaurante />
          </svg>
          <figcaption>Recibir el pedido, verificar que se puede, prepararlo y devolverlo: eso hace un servidor.</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label="cliente-servidor">
        <div className={s.eyebrow}>Concepto 3 · cliente y servidor</div>
        <h2>
          El restaurante es <span className={s.accent}>cliente y servidor</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 920 270"
            role="img"
            aria-label="El mismo diagrama del restaurante con nombres de computación: tú eres el PC cliente, la cocina es el PC servidor, la despensa son sus recursos, y las flechas son la petición y la respuesta. Verificar los ingredientes es verificar que tienes acceso y que se puede armar la respuesta."
          >
            <EscenaRestaurante markerPrefix="arrD3b" />
            {/* Paso único, sin espera y más lento que el estándar: los rótulos cruzan de dominio */}
            <g className={s.morphOut} style={{ animationDuration: '1.2s' }}>
              <RotulosRestaurante />
            </g>
            <g className={s.morphIn} style={{ animationDuration: '1.2s' }}>
              <RotulosClienteServidor />
            </g>
          </svg>
          <figcaption>Misma escena, otros nombres: el servidor verifica que puedes y que hay, arma la respuesta y la manda.</figcaption>
        </figure>
      </Slide>

      <Slide z="4" label="servidores">
        <div className={s.eyebrow}>Concepto 4 · servir</div>
        <h2>
          Cada servidor <span className={s.accent}>sirve</span> lo suyo
        </h2>
        <figure>
          <svg
            viewBox="0 0 920 300"
            role="img"
            aria-label="Tres filas iguales donde la petición entra por la izquierda y la respuesta regresa por el mismo lado: pides una página y el servidor web sirve páginas web; pides un archivo y el servidor FTP sirve archivos; pides unos datos y el servidor de base de datos sirve datos."
          >
            <defs>
              <marker id="arrD4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>

            <rect x="330" y="40" width="280" height="60" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="470" y="75" fontSize="12" fill="#f2a33c" textAnchor="middle">SERVIDOR WEB</text>
            <text x="206" y="48" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">pides una página</text>
            <line x1="90" y1="58" x2="322" y2="58" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD4)" />
            <line x1="330" y1="82" x2="98" y2="82" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD4)" />
            <text x="206" y="96" fontSize="10.5" fill="#f2a33c" textAnchor="middle">sirve páginas web</text>

            <rect x="330" y="130" width="280" height="60" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="470" y="165" fontSize="12" fill="#f2a33c" textAnchor="middle">SERVIDOR FTP</text>
            <text x="206" y="138" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">pides un archivo</text>
            <line x1="90" y1="148" x2="322" y2="148" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD4)" />
            <line x1="330" y1="172" x2="98" y2="172" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD4)" />
            <text x="206" y="186" fontSize="10.5" fill="#f2a33c" textAnchor="middle">sirve archivos</text>

            <rect x="330" y="220" width="280" height="60" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="470" y="255" fontSize="12" fill="#f2a33c" textAnchor="middle">SERVIDOR DE BASE DE DATOS</text>
            <text x="206" y="228" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">pides unos datos</text>
            <line x1="90" y1="238" x2="322" y2="238" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD4)" />
            <line x1="330" y1="262" x2="98" y2="262" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD4)" />
            <text x="206" y="276" fontSize="10.5" fill="#f2a33c" textAnchor="middle">sirve datos</text>
          </svg>
          <figcaption>Por eso se llama servidor: sirve páginas, archivos o datos — siempre a quien los pide.</figcaption>
        </figure>
      </Slide>

      <Slide z="5" label="hardware">
        <div className={s.eyebrow}>Concepto 5 · la máquina</div>
        <h2>
          Una computadora servidor: hecha para <span className={s.accent}>servir todo el día</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 920 360"
            role="img"
            aria-label="Una computadora servidor por dentro: CPU, RAM y disco arriba; una tarjeta de red conectada 24/7 por donde entran las peticiones y salen las respuestas; una fuente de poder encendida 24/7. Afuera, punteada, la tarjeta gráfica que no hace falta porque nadie mira la pantalla."
          >
            <defs>
              <marker id="arrD5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>

            <rect x="300" y="50" width="360" height="290" rx="12" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="320" y="78" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">COMPUTADORA SERVIDOR</text>

            <rect x="330" y="100" width="90" height="46" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="375" y="128" fontSize="12" fill="currentColor" textAnchor="middle">CPU</text>
            <rect x="435" y="100" width="90" height="46" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="480" y="128" fontSize="12" fill="currentColor" textAnchor="middle">RAM</text>
            <rect x="540" y="100" width="90" height="46" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="585" y="128" fontSize="12" fill="currentColor" textAnchor="middle">DISCO</text>

            <rect x="330" y="170" width="300" height="56" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="480" y="192" fontSize="12" fill="#f2a33c" textAnchor="middle">TARJETA(S) DE RED</text>
            <text x="480" y="210" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">conectada · 24/7</text>

            <rect x="330" y="250" width="300" height="56" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="480" y="272" fontSize="12" fill="#f2a33c" textAnchor="middle">FUENTE DE PODER</text>
            <text x="480" y="290" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">encendida · 24/7</text>

            <line x1="90" y1="186" x2="322" y2="186" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD5)" />
            <text x="196" y="176" fontSize="10.5" fill="#f2a33c" textAnchor="middle">peticiones · día y noche</text>
            <line x1="330" y1="212" x2="98" y2="212" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD5)" />
            <text x="196" y="230" fontSize="10.5" fill="#f2a33c" textAnchor="middle">respuestas</text>

            <rect x="700" y="170" width="170" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity=".35" strokeDasharray="6 6" />
            <text x="785" y="190" fontSize="12" fill="currentColor" opacity=".5" textAnchor="middle">TARJETA GRÁFICA</text>
            <text x="785" y="206" fontSize="10.5" fill="currentColor" opacity=".5" textAnchor="middle">no hace falta:</text>
            <text x="785" y="220" fontSize="10.5" fill="currentColor" opacity=".5" textAnchor="middle">nadie mira la pantalla</text>
          </svg>
          <figcaption>Nada para mostrar, todo para responder: la máquina está hecha para no apagarse.</figcaption>
        </figure>
      </Slide>

      <Slide z="6" label="arranque">
        <div className={s.eyebrow}>Concepto 6 · el arranque</div>
        <h2>
          Arranca el juego, y los bancos suben <span className={s.accent}>cuando hacen falta</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 920 420"
            role="img"
            aria-label="Un celular con el juego ya corriendo: en el disco está instalado el juego con sus tres SoundBanks (soundbank_init, soundbank_menus y soundbank_nivel_1); en la memoria RAM están cargados el game engine, la escena main, el sound engine y soundbank_init, con una posición libre punteada debajo."
          >
            <EscenaArranque paso={0} markerPrefix="arrD6a" />
          </svg>
          <figcaption>Lo mínimo ya está cargado: los engines, la escena y el init — el resto espera en el disco.</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label="pide">
        <div className={s.eyebrow}>Concepto 6 · el arranque</div>
        <h2>
          Arranca el juego, y los bancos suben <span className={s.accent}>cuando hacen falta</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 920 420"
            role="img"
            aria-label="El mismo diagrama del celular: la escena main le pide al sound engine que suene el menú."
          >
            <EscenaArranque paso={1} markerPrefix="arrD6b" />
          </svg>
          <figcaption>La escena pide música de menú; el sound engine todavía no la tiene.</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label="busca">
        <div className={s.eyebrow}>Concepto 6 · el arranque</div>
        <h2>
          Arranca el juego, y los bancos suben <span className={s.accent}>cuando hacen falta</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 920 420"
            role="img"
            aria-label="El mismo diagrama del celular: el sound engine sale a buscar soundbank_menus al disco."
          >
            <EscenaArranque paso={2} markerPrefix="arrD6c" />
          </svg>
          <figcaption>El sound engine sale a buscar el banco al disco.</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label="sube">
        <div className={s.eyebrow}>Concepto 6 · el arranque</div>
        <h2>
          Arranca el juego, y los bancos suben <span className={s.accent}>cuando hacen falta</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 920 420"
            role="img"
            aria-label="El mismo diagrama del celular: soundbank_menus sube del disco a la posición libre de la memoria RAM y aparece cargado. soundbank_nivel_1 se queda en el disco."
          >
            <EscenaArranque paso={3} markerPrefix="arrD6d" />
          </svg>
          <figcaption>El banco del menú sube a la posición libre — nivel_1 sigue esperando en el disco.</figcaption>
        </figure>
      </Slide>
    </Deck>
  );
}
