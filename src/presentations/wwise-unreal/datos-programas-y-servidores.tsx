import type { CSSProperties, ReactNode } from 'react';
import Deck, { Slide, useSlideStep } from '../../components/learn/Deck';
import s from '../../components/learn/Deck.module.css';
import { useT } from '../../i18n/useT';
import { datosDict } from './datos-programas-y-servidores.dict';
import type {
  ArranqueTexts,
  BibliotecaTexts,
  EscenaArranqueTexts,
  MaquinaTexts,
  RotulosBackendTexts,
  RotulosPeticionTexts,
} from './datos-programas-y-servidores.dict';

const PIEZAS_BASE: string = '/assets/presentations/wwise-unreal/';

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

function Imagen({ pieza }: { pieza: Pieza }) {
  return <image href={PIEZAS_BASE + pieza.archivo} x={pieza.x} y={pieza.y} width={pieza.width} height={pieza.height} />;
}

/* Rótulo de velocidad partido en dos líneas alrededor de la flecha horizontal. */
function RotuloVelocidad({ x, texto }: { x: number; texto: string }) {
  const [arriba, abajo] = texto.split(' · ');
  return (
    <>
      <text x={x} y="284" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{arriba}</text>
      <text x={x} y="312" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{abajo}</text>
    </>
  );
}

/* Una casilla de la analogía. En el paso 1 la pieza de biblioteca se desvanece
   y la del computador entra (deslizándose desde `glideFrom` si se indica); los
   grupos llevan delays distintos y solapados para que el cruce sea rápido. */
function GrupoAnalogia({
  paso,
  delay,
  glideFrom,
  biblioteca,
  computador,
}: {
  paso: number;
  delay: string;
  glideFrom?: string;
  biblioteca: ReactNode;
  computador: ReactNode;
}) {
  if (paso === 0) return <>{biblioteca}</>;
  const entrada = (
    <g className={s.morphIn} style={{ animationDelay: delay }}>
      {computador}
    </g>
  );
  return (
    <>
      <g className={s.morphOut} style={{ animationDelay: delay }}>
        {biblioteca}
      </g>
      {glideFrom ? (
        <g className={s.morphGlide} style={{ animationDelay: delay, '--morph-from': glideFrom } as CSSProperties}>
          {entrada}
        </g>
      ) : (
        entrada
      )}
    </>
  );
}

/* Un solo slide con dos pasos: la biblioteca y, al avanzar, el computador. */
function FiguraBiblioteca({ r }: { r: BibliotecaTexts }) {
  const paso = useSlideStep();
  const b = r.biblioteca;
  const c = r.computador;
  return (
    <figure>
      <svg viewBox="0 0 920 455" role="img" aria-label={r.arias[paso]}>
        <defs>
          <marker id="arrD1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
          </marker>
          <marker id="arrD1t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#63b6a4" />
          </marker>
        </defs>

        <line x1="460" y1="152" x2="460" y2="172" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrD1t)" />
        <line x1="254" y1="295" x2="350" y2="295" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD1)" />
        <line x1="666" y1="295" x2="570" y2="295" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD1)" />

        <GrupoAnalogia
          paso={paso}
          delay="0s"
          biblioteca={
            <>
              <Imagen pieza={PIEZAS.mesaCentral} />
              <text x="455" y="430" fontSize="12" fill="#f2a33c" textAnchor="end">{b.librosAbiertos}</text>
              <text x="465" y="430" fontSize="10.5" fill="currentColor" opacity=".6">{b.materiaActual}</text>
              <text x="460" y="446" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{b.leer}</text>
            </>
          }
          computador={
            <>
              <Imagen pieza={PIEZAS.cpu} />
              <text x="455" y="430" fontSize="12" fill="#f2a33c" textAnchor="end">{c.cpu} · {c.cache}</text>
              <text x="465" y="430" fontSize="10.5" fill="currentColor" opacity=".6">{c.loQueUsas}</text>
              <text x="460" y="446" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{c.leerCache}</text>
            </>
          }
        />

        <GrupoAnalogia
          paso={paso}
          delay="0.25s"
          glideFrom="translateX(-40px)"
          biblioteca={
            <>
              <Imagen pieza={PIEZAS.mesaIzquierda} />
              <text x="200" y="430" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">{b.laMesa}</text>
              <RotuloVelocidad x={302} texto={b.alcanzar} />
            </>
          }
          computador={
            <>
              <Imagen pieza={PIEZAS.ramIzquierda} />
              <text x="200" y="430" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">{c.ram}</text>
              <RotuloVelocidad x={302} texto={c.traer} />
            </>
          }
        />

        <GrupoAnalogia
          paso={paso}
          delay="0.25s"
          glideFrom="translateX(40px)"
          biblioteca={
            <>
              <Imagen pieza={PIEZAS.mesaDerecha} />
              <text x="720" y="430" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">{b.laMesa}</text>
              <RotuloVelocidad x={618} texto={b.alcanzar} />
            </>
          }
          computador={
            <>
              <Imagen pieza={PIEZAS.ramDerecha} />
              <text x="720" y="430" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">{c.ram}</text>
              <RotuloVelocidad x={618} texto={c.traer} />
            </>
          }
        />

        <GrupoAnalogia
          paso={paso}
          delay="0.5s"
          glideFrom="translateY(-30px)"
          biblioteca={
            <>
              <Imagen pieza={PIEZAS.estanterias} />
              <text x="275" y="145" fontSize="12" fill="#63b6a4">{b.estanterias}</text>
              <text x="645" y="145" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="end">{b.todasLasMaterias}</text>
              <text x="470" y="166" fontSize="10.5" fill="#63b6a4">{b.levantarse}</text>
            </>
          }
          computador={
            <>
              <Imagen pieza={PIEZAS.discos} />
              <text x="275" y="145" fontSize="12" fill="#63b6a4">{c.discoDuro}</text>
              <text x="645" y="145" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="end">{c.todosLosDatos}</text>
              <text x="470" y="166" fontSize="10.5" fill="#63b6a4">{c.cargar}</text>
            </>
          }
        />
      </svg>
      <figcaption>{r.caption}</figcaption>
    </figure>
  );
}

/* Énfasis al entrar el slide: aparece y pulsa, con el delay de su turno. */
function Resalte({ delay, children }: { delay: string; children: ReactNode }) {
  return (
    <g className={s.morphPulse} style={{ animationDelay: delay }}>
      <g className={s.morphIn} style={{ animationDelay: delay }}>
        {children}
      </g>
    </g>
  );
}

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

/* El cliente habla con un solo punto del backend (la API); adentro, la API
   consulta a la autorización y a la base de datos. */
function EscenaBackend({ r }: { r: RotulosBackendTexts }) {
  return (
    <>
      <defs>
        <marker id="arrD8" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
        </marker>
        <marker id="arrD8t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#63b6a4" />
        </marker>
      </defs>

      <rect x="40" y="110" width="180" height="80" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="130" y="145" fontSize="12" fill="currentColor" textAnchor="middle">{r.cliente}</text>
      <text x="130" y="165" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.clienteSub}</text>

      <rect x="330" y="20" width="570" height="260" rx="12" fill="#1d2026" stroke="#f2a33c" strokeWidth="2" />
      <text x="350" y="46" fontSize="11.5" fill="#f2a33c" letterSpacing="2">{r.backend}</text>

      <rect x="350" y="122" width="180" height="56" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <text x="440" y="145" fontSize="12" fill="#f2a33c" textAnchor="middle">{r.api}</text>
      <text x="440" y="163" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.apiSub}</text>

      <rect x="700" y="60" width="180" height="56" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="790" y="83" fontSize="11" fill="currentColor" textAnchor="middle">{r.autorizacion}</text>
      <text x="790" y="101" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.autorizacionSub}</text>

      <rect x="700" y="190" width="180" height="56" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="790" y="213" fontSize="12" fill="currentColor" textAnchor="middle">{r.baseDeDatos}</text>
      <text x="790" y="231" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{r.baseDeDatosSub}</text>

      <path d="M 530 140 L 603 140 Q 615 140 615 128 L 615 100 Q 615 88 627 88 L 694 88" fill="none" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrD8t)" />
      <text x="627" y="80" fontSize="10.5" fill="#63b6a4">{r.valida}</text>
      <path d="M 530 160 L 603 160 Q 615 160 615 172 L 615 206 Q 615 218 627 218 L 694 218" fill="none" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrD8t)" />
      <text x="627" y="236" fontSize="10.5" fill="#63b6a4">{r.busca}</text>

      <line x1="220" y1="135" x2="344" y2="135" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD8)" />
      <text x="282" y="125" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.pides}</text>
      <line x1="350" y1="165" x2="228" y2="165" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD8)" />
      <text x="282" y="183" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.recibes}</text>
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

/* Copia del juego que se desliza desde su origen (`desdeX`) hasta `x`; solo se
   anima en el paso en que aparece. */
function CopiaJuego({ x, desdeX, sub, anima, r }: { x: number; desdeX: number; sub: string; anima: boolean; r: EscenaArranqueTexts }) {
  const caja = (
    <>
      <rect x={x} y="140" width="160" height="50" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
      <text x={x + 80} y="161" fontSize="12" fill="#f2a33c" textAnchor="middle">{r.juego}</text>
      <text x={x + 80} y="179" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{sub}</text>
    </>
  );
  if (!anima) return caja;
  return (
    <g className={s.morphGlide} style={{ animationDuration: '0.9s', '--morph-from': `translateX(${desdeX - x}px)` } as CSSProperties}>
      {caja}
    </g>
  );
}

/* Instalar y abrir: paso 1 una copia del juego va del servidor al disco del
   celular; paso 2 otra copia va del disco a la RAM. Los originales se quedan. */
function EscenaArranque({ paso, r }: { paso: number; r: EscenaArranqueTexts }) {
  return (
    <>
      <defs>
        <marker id="arrD6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
        </marker>
      </defs>

      <rect x="30" y="80" width="190" height="170" rx="8" fill="#1d2026" stroke="#63b6a4" />
      <text x="45" y="102" fontSize="11.5" fill="#63b6a4" letterSpacing="2">{r.servidor}</text>
      <text x="45" y="118" fontSize="10" fill="currentColor" opacity=".6">{r.servidorSub}</text>
      <CopiaJuego x={45} desdeX={45} sub={r.instalado} anima={false} r={r} />

      <rect x="250" y="30" width="650" height="250" rx="12" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="270" y="56" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.celular}</text>

      <rect x="280" y="80" width="280" height="170" rx="8" fill="#1d2026" stroke="#63b6a4" />
      <text x="295" y="102" fontSize="11.5" fill="#63b6a4" letterSpacing="2">{r.disco}</text>

      <rect x="590" y="80" width="280" height="170" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="605" y="102" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{r.ram}</text>

      {paso >= 1 && (
        <>
          <g className={paso === 1 ? s.morphIn : undefined}>
            <line x1="220" y1="165" x2="272" y2="165" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD6)" />
            <text x="246" y="153" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.instalas}</text>
          </g>
          <CopiaJuego x={340} desdeX={45} sub={r.instalado} anima={paso === 1} r={r} />
        </>
      )}

      {paso >= 2 && (
        <>
          <g className={s.morphIn}>
            <line x1="560" y1="165" x2="582" y2="165" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD6)" />
            <text x="571" y="153" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{r.abres}</text>
          </g>
          <CopiaJuego x={650} desdeX={340} sub={r.corriendo} anima r={r} />
        </>
      )}
    </>
  );
}

/* Un slide con tres pasos cuyo título cambia al abrir el juego. */
function ContenidoArranque({ r }: { r: ArranqueTexts }) {
  const paso = useSlideStep();
  return (
    <>
      <h2>{r.titles[paso]}</h2>
      <figure>
        <svg viewBox="0 0 920 300" role="img" aria-label={r.arias[paso]}>
          <EscenaArranque paso={paso} r={r.escena} />
        </svg>
        <figcaption>{r.caption}</figcaption>
      </figure>
    </>
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

      <Slide z="1" label={[t.labels.biblioteca, t.labels.computador]} notes={t.biblioteca.notes}>
        <div className={s.eyebrow}>{t.biblioteca.eyebrow}</div>
        <h2>{t.biblioteca.title}</h2>
        <FiguraBiblioteca r={t.biblioteca} />
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

            {t.lenguajes.niveles.map(({ titulo, resaltado, lineas }, i) => {
              const y = 34 + i * 94;
              const esMaquina = i === t.lenguajes.niveles.length - 1;
              const tituloTexto = (
                <text x="240" y={y + 21} fontSize="12" fill={esMaquina ? '#f2a33c' : 'currentColor'}>
                  {titulo}
                  {resaltado ? <tspan fill="#f2a33c">{resaltado}</tspan> : null}
                </text>
              );
              return (
                <g key={titulo}>
                  {esMaquina ? (
                    <rect x="220" y={y} width="480" height="58" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
                  ) : (
                    <rect x="220" y={y} width="480" height="58" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
                  )}
                  {resaltado ? <Resalte delay="0.6s">{tituloTexto}</Resalte> : tituloTexto}
                  <text x="240" y={y + 37} fontSize="10.5" fill="currentColor" opacity=".6">{lineas[0]}</text>
                  <text x="240" y={y + 51} fontSize="10.5" fill="currentColor" opacity=".6">{lineas[1]}</text>
                </g>
              );
            })}

            <text x="220" y="398" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">{t.lenguajes.masCercaMaquina}</text>
            <text x="700" y="398" fontSize="10.5" fill="#f2a33c" textAnchor="end">{t.lenguajes.masRapido}</text>

            <text x="200" y="67" fontSize="11.5" fill="#63b6a4" letterSpacing="2" textAnchor="end">{t.lenguajes.masAbstracto}</text>
            <text x="200" y="349" fontSize="11.5" fill="#f2a33c" letterSpacing="2" textAnchor="end">{t.lenguajes.menosAbstracto}</text>

            <Resalte delay="0s">
              <text x="770" y="53" fontSize="10.5" fill="#63b6a4" textAnchor="middle">{t.lenguajes.tuEscribes}</text>
              <line x1="830" y1="63" x2="708" y2="63" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrD7t)" />
            </Resalte>
            <Resalte delay="1.2s">
              <text x="770" y="335" fontSize="10.5" fill="#f2a33c" textAnchor="middle">{t.lenguajes.laCpuLee}</text>
              <line x1="830" y1="345" x2="708" y2="345" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD7)" />
            </Resalte>
          </svg>
          <figcaption>{t.lenguajes.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="3" label={t.labels.clienteServidor} notes={t.clienteServidor.notes}>
        <div className={s.eyebrow}>{t.clienteServidor.eyebrow}</div>
        <h2>{t.clienteServidor.title}</h2>
        <figure>
          <svg viewBox="0 0 920 230" role="img" aria-label={t.clienteServidor.aria}>
            <EscenaPeticion markerPrefix="arrD3" />
            <RotulosPeticion r={t.clienteServidor.rotulos} />
          </svg>
          <figcaption>{t.clienteServidor.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="4" label={t.labels.servidores} notes={t.servidores.notes}>
        <div className={s.eyebrow}>{t.servidores.eyebrow}</div>
        <h2>{t.servidores.title}</h2>
        <figure>
          <svg viewBox="0 0 940 300" role="img" aria-label={t.servidores.aria}>
            <defs>
              <marker id="arrD4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>

            {t.servidores.filas.map(({ servidor, pides, sirve, sirveDetalle, ejemplos }, i) => {
              const y = 20 + i * 66;
              const ejemplosY = ejemplos.length > 1 ? [y + 24, y + 38] : [y + 30];
              return (
                <g key={servidor}>
                  <rect x="390" y={y} width="250" height="50" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
                  <text x="515" y={y + 30} fontSize="12" fill="#f2a33c" textAnchor="middle">{servidor}</text>
                  <text x="221" y={y + 6} fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{pides}</text>
                  <line x1="60" y1={y + 16} x2="382" y2={y + 16} stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD4)" />
                  <line x1="390" y1={y + 34} x2="68" y2={y + 34} stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrD4)" />
                  <text x="221" y={y + 48} fontSize="10.5" fill="#f2a33c" textAnchor="middle">{sirve}</text>
                  {sirveDetalle ? (
                    <text x="221" y={y + 60} fontSize="10" fill="currentColor" opacity=".6" textAnchor="middle">{sirveDetalle}</text>
                  ) : null}
                  {ejemplos.map((linea, j) => (
                    <text key={linea} x="658" y={ejemplosY[j]} fontSize="10.5" fill="currentColor" opacity=".6">{linea}</text>
                  ))}
                </g>
              );
            })}
          </svg>
          <figcaption>{t.servidores.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="5" label={t.labels.backend} notes={t.backend.notes}>
        <div className={s.eyebrow}>{t.backend.eyebrow}</div>
        <h2>{t.backend.title}</h2>
        <figure>
          <svg viewBox="0 0 920 300" role="img" aria-label={t.backend.aria}>
            <EscenaBackend r={t.backend.rotulos} />
          </svg>
          <figcaption>{t.backend.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="6" label={t.labels.hardware}>
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

      <Slide z="7" label={[t.labels.arranque, t.labels.instalas, t.labels.abres]}>
        <div className={s.eyebrow}>{t.arranque.eyebrow}</div>
        <ContenidoArranque r={t.arranque} />
      </Slide>
    </Deck>
  );
}
