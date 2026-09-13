import Deck, { Slide, useSlideStep } from '../../components/learn/Deck';
import s from '../../components/learn/Deck.module.css';
import { useT } from '../../i18n/useT';
import { wwiseObjectsDict } from './wwise-objects.dict';

const AMBAR: string = '#f2a33c';
const TEAL: string = '#63b6a4';
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
};

/* Caja con título y subtítulos centrados verticalmente. */
function Caja({ x, y, width, height, caja, estilo = 'normal', primerSubAmbar = false }: CajaProps) {
  const lineas: number = 1 + caja.subs.length;
  const primeraLinea: number = y + height / 2 - ((lineas - 1) * INTERLINEADO) / 2 + 4.5;
  const centroX: number = x + width / 2;
  const fill: string = estilo === 'protagonista' ? FONDO_PROTAGONISTA : FONDO;
  const stroke: string = estilo === 'protagonista' ? AMBAR : estilo === 'teal' ? TEAL : 'currentColor';
  const strokeOpacity: string = estilo === 'normal' ? '.35' : estilo === 'atenuada' ? '.2' : '1';
  const colorNombre: string = estilo === 'protagonista' ? AMBAR : estilo === 'teal' ? TEAL : 'currentColor';
  const opacidadNombre: string = estilo === 'atenuada' ? '.5' : '1';
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="8" fill={fill} stroke={stroke} strokeOpacity={strokeOpacity} />
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

type CaminoTextos = (typeof wwiseObjectsDict.es)['camino'];

/* Las siete cajas del camino, de izquierda a derecha. */
const CAMINO_X: number[] = [20, 150, 280, 410, 540, 670, 800];
const CAMINO_ANCHO: number = 110;
const CAMINO_Y: number = 150;
const CAMINO_ALTO: number = 60;
const CAMINO_CENTRO_Y: number = CAMINO_Y + CAMINO_ALTO / 2;

function FlechaCamino({ desde, rotulo }: { desde: number; rotulo: string }) {
  const x1: number = CAMINO_X[desde] + CAMINO_ANCHO;
  const x2: number = CAMINO_X[desde + 1] - 4;
  return (
    <>
      <line x1={x1} y1={CAMINO_CENTRO_Y} x2={x2} y2={CAMINO_CENTRO_Y} stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO1)" />
      <text x={(x1 + x2) / 2} y={CAMINO_CENTRO_Y - 10} fontSize="10" fill={AMBAR} textAnchor="middle">
        {rotulo}
      </text>
    </>
  );
}

/* Escena del camino de un sonido. Cada paso añade una pieza y anima solo esa. */
function EscenaCamino({ paso, r }: { paso: number; r: CaminoTextos }) {
  const pieza = (indice: number): string | undefined => (paso === indice ? s.morphIn : undefined);
  return (
    <>
      <Caja x={CAMINO_X[0]} y={CAMINO_Y} width={CAMINO_ANCHO} height={CAMINO_ALTO} caja={{ nombre: r.game, subs: [] }} />
      <FlechaCamino desde={0} rotulo={r.postea} />
      <Caja x={CAMINO_X[1]} y={CAMINO_Y} width={CAMINO_ANCHO} height={CAMINO_ALTO} caja={{ nombre: r.event, subs: [] }} estilo="protagonista" />

      {paso >= 1 && (
        <g className={pieza(1)}>
          <FlechaCamino desde={1} rotulo={r.ejecuta} />
          <Caja x={CAMINO_X[2]} y={CAMINO_Y} width={CAMINO_ANCHO} height={CAMINO_ALTO} caja={{ nombre: r.actions, subs: [] }} estilo="protagonista" />
        </g>
      )}

      {paso >= 2 && (
        <g className={pieza(2)}>
          <FlechaCamino desde={2} rotulo={r.apunta} />
          <Caja x={CAMINO_X[3]} y={CAMINO_Y} width={CAMINO_ANCHO} height={CAMINO_ALTO} caja={{ nombre: r.object, subs: [r.objectSub] }} estilo="protagonista" />
        </g>
      )}

      {paso >= 3 && (
        <g className={pieza(3)}>
          <FlechaCamino desde={3} rotulo={r.resuelve} />
          <Caja x={CAMINO_X[4]} y={CAMINO_Y} width={CAMINO_ANCHO} height={CAMINO_ALTO} caja={{ nombre: r.contenido, subs: [r.contenidoSub] }} estilo="protagonista" />
          <Caja x={380} y={40} width={170} height={50} caja={{ nombre: r.gameSyncs, subs: [r.gameSyncsSub] }} estilo="teal" />
          <line x1="465" y1="90" x2="465" y2="146" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrWO1t)" />
          <text x="472" y="122" fontSize="10" fill={TEAL}>
            {r.consulta}
          </text>
        </g>
      )}

      {paso >= 4 && (
        <g className={pieza(4)}>
          <FlechaCamino desde={4} rotulo={r.envia} />
          <Caja x={CAMINO_X[5]} y={CAMINO_Y} width={CAMINO_ANCHO} height={CAMINO_ALTO} caja={{ nombre: r.bus, subs: [] }} estilo="protagonista" />
        </g>
      )}

      {paso >= 5 && (
        <g className={pieza(5)}>
          <line x1="725" y1="210" x2="725" y2="236" stroke={TEAL} strokeWidth="2" />
          <Caja x={CAMINO_X[5]} y={236} width={CAMINO_ANCHO} height={44} caja={{ nombre: r.procesa, subs: [r.procesaSub] }} estilo="teal" />
        </g>
      )}

      {paso >= 6 && (
        <g className={pieza(6)}>
          <FlechaCamino desde={5} rotulo={r.llega} />
          <Caja x={CAMINO_X[6]} y={CAMINO_Y} width={CAMINO_ANCHO} height={CAMINO_ALTO} caja={{ nombre: r.salida, subs: [] }} />
          <rect x="140" y="20" width="650" height="280" rx="10" fill="none" stroke={AMBAR} strokeOpacity=".5" strokeDasharray="6 6" />
          <text x="152" y="292" fontSize="10.5" fill={AMBAR} opacity=".8">
            {r.soundBank}
          </text>
        </g>
      )}
    </>
  );
}

/* Un solo slide con siete pasos; el paso actual lo da el Deck. */
function FiguraCamino({ r }: { r: CaminoTextos }) {
  const paso = useSlideStep();
  return (
    <figure>
      <svg viewBox="0 0 940 320" role="img" aria-label={r.arias[paso]}>
        <Marcadores id="arrWO1" />
        <EscenaCamino paso={paso} r={r} />
      </svg>
      <figcaption>{r.captions[paso]}</figcaption>
    </figure>
  );
}

const PREGUNTAS_FILA1_X: number[] = [20, 246, 472, 698];
const PREGUNTAS_FILA2_X: number[] = [133, 359, 585];
const CATALOGO_FILA1_X: number[] = [16, 200, 384, 568, 752];
const CATALOGO_FILA2_X: number[] = [200, 384, 568];
const CATALOGO_ANCHO: number = 172;
const HIJOS_X: number[] = [100, 370, 640];
const GAME_SYNCS_X: number[] = [20, 246, 472, 698];
const VOCES_Y: number[] = [70, 130, 190];

export default function WwiseObjects() {
  const t = useT(wwiseObjectsDict);

  return (
    <Deck name={t.name} context={t.context}>
      <Slide z="▶" label={t.labels.intro} backgroundImage="/assets/presentations/wwise-unreal/Cover.jpg">
        <div className={s.eyebrow}>{t.cover.eyebrow}</div>
        <h1>{t.cover.title}</h1>
        <p className={s.note}>{t.cover.hint}</p>
      </Slide>

      <Slide z="1" label={[...t.labels.camino]}>
        <div className={s.eyebrow}>{t.camino.eyebrow}</div>
        <h2>{t.camino.title}</h2>
        <FiguraCamino r={t.camino} />
      </Slide>

      <Slide z="=" label={t.labels.preguntas}>
        <div className={s.eyebrow}>{t.preguntas.eyebrow}</div>
        <h2>{t.preguntas.title}</h2>
        <figure>
          <svg viewBox="0 0 940 250" role="img" aria-label={t.preguntas.aria}>
            {PREGUNTAS_FILA1_X.map((x, index) => (
              <Caja key={t.preguntas.familias[index].nombre} x={x} y={30} width={210} height={80} caja={t.preguntas.familias[index]} estilo="protagonista" />
            ))}
            {PREGUNTAS_FILA2_X.map((x, index) => (
              <Caja key={t.preguntas.familias[index + 4].nombre} x={x} y={140} width={210} height={80} caja={t.preguntas.familias[index + 4]} estilo="protagonista" />
            ))}
          </svg>
          <figcaption>{t.preguntas.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="2" label={t.labels.contenido}>
        <div className={s.eyebrow}>{t.contenido.eyebrow}</div>
        <h2>{t.contenido.title}</h2>
        <figure>
          <svg viewBox="0 0 940 260" role="img" aria-label={t.contenido.aria}>
            <Marcadores id="arrWO2" />
            {CATALOGO_FILA1_X.map((x, index) => (
              <g key={t.contenido.objetos[index].nombre}>
                <Caja x={x} y={30} width={CATALOGO_ANCHO} height={84} caja={t.contenido.objetos[index]} estilo="protagonista" />
                <line x1={x + CATALOGO_ANCHO / 2} y1="114" x2={x + CATALOGO_ANCHO / 2} y2="182" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrWO2t)" />
              </g>
            ))}
            <rect x="16" y="186" width="908" height="44" rx="8" fill={FONDO} stroke={TEAL} />
            <text x="470" y="213" fontSize="12" fill={TEAL} letterSpacing="2" textAnchor="middle">
              {t.contenido.audioData}
            </text>
          </svg>
          <figcaption>{t.contenido.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="3" label={t.labels.estructura}>
        <div className={s.eyebrow}>{t.estructura.eyebrow}</div>
        <h2>{t.estructura.title}</h2>
        <figure>
          <svg viewBox="0 0 940 240" role="img" aria-label={t.estructura.aria}>
            {CATALOGO_FILA1_X.map((x, index) => (
              <Caja key={t.estructura.contenedores[index].nombre} x={x} y={16} width={CATALOGO_ANCHO} height={88} caja={t.estructura.contenedores[index]} primerSubAmbar />
            ))}
            {CATALOGO_FILA2_X.map((x, index) => (
              <Caja key={t.estructura.contenedores[index + 5].nombre} x={x} y={128} width={CATALOGO_ANCHO} height={88} caja={t.estructura.contenedores[index + 5]} primerSubAmbar />
            ))}
          </svg>
          <figcaption>{t.estructura.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label={t.labels.herencia}>
        <div className={s.eyebrow}>{t.herencia.eyebrow}</div>
        <h2>{t.herencia.title}</h2>
        <figure>
          <svg viewBox="0 0 940 270" role="img" aria-label={t.herencia.aria}>
            <Marcadores id="arrWO4" />
            <Caja x={370} y={24} width={200} height={64} caja={t.herencia.padre} estilo="protagonista" />
            <path d="M 470 88 L 470 118 Q 470 130 458 130 L 212 130 Q 200 130 200 142 L 200 166" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO4)" />
            <line x1="470" y1="88" x2="470" y2="166" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO4)" />
            <path d="M 470 88 L 470 118 Q 470 130 482 130 L 728 130 Q 740 130 740 142 L 740 166" fill="none" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO4)" />
            {HIJOS_X.map((x, index) => (
              <Caja key={t.herencia.hijos[index].nombre} x={x} y={170} width={200} height={60} caja={t.herencia.hijos[index]} estilo={index === 2 ? 'protagonista' : 'teal'} />
            ))}
          </svg>
          <figcaption>{t.herencia.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="4" label={t.labels.busses}>
        <div className={s.eyebrow}>{t.busses.eyebrow}</div>
        <h2>{t.busses.title}</h2>
        <figure>
          <svg viewBox="0 0 940 330" role="img" aria-label={t.busses.aria}>
            <Marcadores id="arrWO5" />
            <Panel x={30} y={20} width={290} height={290} titulo={t.busses.jerarquiaContenido} />
            <Caja x={60} y={64} width={230} height={44} caja={t.busses.actorMixer} />
            <line x1="175" y1="108" x2="175" y2="134" stroke="currentColor" strokeOpacity=".35" strokeWidth="2" />
            <Caja x={60} y={134} width={230} height={52} caja={t.busses.sonido} estilo="protagonista" />
            <line x1="290" y1="160" x2="416" y2="160" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO5)" />
            <text x="353" y="148" fontSize="10" fill={AMBAR} textAnchor="middle">
              {t.busses.unBus}
            </text>
            <text x="353" y="178" fontSize="10" fill={AMBAR} textAnchor="middle">
              {t.busses.seMueve}
            </text>

            <Panel x={390} y={20} width={520} height={290} titulo={t.busses.jerarquiaMixer} />
            <Caja x={455} y={56} width={250} height={48} caja={t.busses.master} estilo="protagonista" />
            <Caja x={420} y={134} width={150} height={52} caja={t.busses.busSfx} />
            <Caja x={590} y={134} width={150} height={52} caja={t.busses.busMusic} />
            <Caja x={760} y={134} width={140} height={52} caja={t.busses.auxReverb} estilo="teal" />
            <line x1="495" y1="134" x2="495" y2="108" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO5)" />
            <line x1="665" y1="134" x2="665" y2="108" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO5)" />
            <path d="M 830 134 L 830 92 Q 830 80 818 80 L 709 80" fill="none" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrWO5t)" />
            <Caja x={420} y={236} width={230} height={56} caja={t.busses.motion} />
            <Caja x={670} y={236} width={230} height={56} caja={t.busses.secondary} />
          </svg>
          <figcaption>{t.busses.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label={t.labels.aux}>
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
            <Caja x={720} y={100} width={190} height={60} caja={t.aux.master} estilo="protagonista" />
          </svg>
          <figcaption>{t.aux.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="5" label={t.labels.efectos}>
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

      <Slide z="6" label={t.labels.events}>
        <div className={s.eyebrow}>{t.events.eyebrow}</div>
        <h2>{t.events.title}</h2>
        <figure>
          <svg viewBox="0 0 940 290" role="img" aria-label={t.events.aria}>
            <Marcadores id="arrWO9" />
            <Caja x={20} y={110} width={120} height={64} caja={t.events.game} />
            <line x1="140" y1="142" x2="266" y2="142" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO9)" />
            <text x="203" y="130" fontSize="10" fill={AMBAR} textAnchor="middle">
              {t.events.postea}
            </text>
            <rect x="270" y="30" width="400" height="232" rx="10" fill={FONDO_PROTAGONISTA} stroke={AMBAR} strokeWidth="2" />
            <text x="470" y="58" fontSize="12" fill={AMBAR} textAnchor="middle">
              {t.events.event}
            </text>
            {t.events.actions.map((action, index) => (
              <Caja key={action.nombre} x={290} y={76 + index * 54} width={360} height={46} caja={action} />
            ))}
            <text x="470" y="250" fontSize="10" fill="currentColor" opacity=".6" textAnchor="middle">
              {t.events.cadaAction}
            </text>
            <Caja x={700} y={100} width={210} height={90} caja={t.events.dialogue} estilo="teal" />
          </svg>
          <figcaption>{t.events.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="7" label={t.labels.gameSyncs}>
        <div className={s.eyebrow}>{t.gameSyncs.eyebrow}</div>
        <h2>{t.gameSyncs.title}</h2>
        <figure>
          <svg viewBox="0 0 940 310" role="img" aria-label={t.gameSyncs.aria}>
            <Marcadores id="arrWO10" />
            <Caja x={320} y={16} width={300} height={48} caja={t.gameSyncs.codigo} estilo="teal" />
            <line x1="470" y1="64" x2="470" y2="92" stroke={TEAL} strokeWidth="2" />
            <line x1="125" y1="92" x2="803" y2="92" stroke={TEAL} strokeWidth="2" />
            {GAME_SYNCS_X.map((x, index) => (
              <g key={t.gameSyncs.tipos[index].nombre}>
                <line x1={x + 105} y1="92" x2={x + 105} y2="116" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrWO10t)" />
                <Caja x={x} y={120} width={210} height={96} caja={t.gameSyncs.tipos[index]} estilo="protagonista" />
                <line x1={x + 105} y1="216" x2={x + 105} y2="240" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO10)" />
              </g>
            ))}
            <rect x="20" y="244" width="904" height="44" rx="8" fill={FONDO} stroke="currentColor" strokeOpacity=".35" />
            <text x="472" y="270" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2" textAnchor="middle">
              {t.gameSyncs.lectores}
            </text>
          </svg>
          <figcaption>{t.gameSyncs.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="=" label={t.labels.seleccion}>
        <div className={s.eyebrow}>{t.seleccion.eyebrow}</div>
        <h2>{t.seleccion.title}</h2>
        <figure>
          <svg viewBox="0 0 940 340" role="img" aria-label={t.seleccion.aria}>
            <Marcadores id="arrWO11" />
            <Panel x={30} y={16} width={880} height={160} titulo={t.seleccion.laneSeleccion} />
            <Caja x={70} y={118} width={170} height={48} caja={t.seleccion.action} />
            <line x1="240" y1="142" x2="296" y2="142" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO11)" />
            <Caja x={300} y={54} width={210} height={40} caja={t.seleccion.switchValor} estilo="teal" />
            <line x1="405" y1="94" x2="405" y2="114" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrWO11t)" />
            <text x="414" y="108" fontSize="10" fill={TEAL}>
              {t.seleccion.lee}
            </text>
            <Caja x={300} y={118} width={210} height={48} caja={t.seleccion.container} estilo="protagonista" />
            <line x1="510" y1="142" x2="596" y2="142" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO11)" />
            <text x="553" y="132" fontSize="10" fill={AMBAR} textAnchor="middle">
              {t.seleccion.elige}
            </text>
            <Caja x={600} y={118} width={210} height={48} caja={t.seleccion.hijo} estilo="protagonista" />

            <Panel x={30} y={192} width={880} height={132} titulo={t.seleccion.laneModificacion} />
            <Caja x={70} y={248} width={170} height={48} caja={t.seleccion.rtpc} estilo="teal" />
            <line x1="240" y1="272" x2="296" y2="272" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrWO11t)" />
            <rect x="300" y="248" width="130" height="48" rx="8" fill={FONDO} stroke="currentColor" strokeOpacity=".35" />
            <polyline points="312,288 340,285 362,274 390,260 418,256" fill="none" stroke={AMBAR} strokeWidth="2" />
            <text x="365" y="242" fontSize="10" fill={AMBAR} textAnchor="middle">
              {t.seleccion.curva}
            </text>
            <line x1="430" y1="272" x2="496" y2="272" stroke={AMBAR} strokeWidth="2" markerEnd="url(#arrWO11)" />
            <Caja x={500} y={248} width={230} height={48} caja={t.seleccion.propiedad} estilo="protagonista" />
            <text className={s.svgSans} x="815" y="276" fontSize="10.5" fill={AMBAR} textAnchor="middle">
              {t.seleccion.sinAction}
            </text>
          </svg>
          <figcaption>{t.seleccion.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="8" label={t.labels.packaging}>
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
    </Deck>
  );
}
