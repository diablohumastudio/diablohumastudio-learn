import type { CSSProperties } from 'react';
import Deck, { Slide } from '../../components/learn/Deck';
import s from '../../components/learn/Deck.module.css';

const VIEWS_DIRECTOS_FILA1: [number, string][] = [
  [60, 'Audio Device Meter'],
  [271, 'Audio File Importer'],
  [482, 'Loudness Meter'],
  [693, 'Meter'],
];

const VIEWS_DIRECTOS_FILA2: [number, string][] = [
  [140, 'Project Explorer'],
  [370, 'Soundcaster'],
  [600, 'Transport Control'],
];

type ViewUtil = { x: number; nombre: string; sub: string; delay: string };
const VIEWS_UTILES: ViewUtil[] = [
  { x: 140, nombre: 'Project Explorer', sub: 'navegar el proyecto', delay: '0s' },
  { x: 600, nombre: 'Transport Control', sub: 'reproducir la selección', delay: '0.6s' },
  { x: 370, nombre: 'Soundcaster', sub: 'probar y mezclar', delay: '1.2s' },
];

type EditorItem = { x: number; y: number; nombre: string; sub: string };
const EDITORS_PROPIEDADES: EditorItem[] = [
  { x: 70, y: 182, nombre: 'RTPC', sub: 'curvas de Game Parameters' },
  { x: 345, y: 182, nombre: 'States', sub: 'ajustes por estado' },
  { x: 620, y: 182, nombre: 'Effects', sub: 'efectos del objeto' },
  { x: 207, y: 254, nombre: 'Stingers', sub: 'remates sobre la música' },
  { x: 482, y: 254, nombre: 'Metadata', sub: 'datos extra del objeto' },
];

const PROPERTY_EDITOR_TABS: string[] = ['General', 'Routing', 'Conversion', 'Positioning', 'Advanced', '…'];

const LAYOUTS_FABRICA: [string, string][] = [
  ['Designer · F5', 'El de diario: crear y configurar Wwise Objects y Events.'],
  ['Profiler · F6', 'Conectarse al juego y ver en vivo qué suena y qué consume.'],
  ['SoundBank · F7', 'Armar y generar los SoundBanks.'],
  ['Mixer · F8', 'Mezclar en conjunto: niveles, buses y sesiones de mezcla.'],
  ['Schematic · F9', 'La estructura del proyecto como diagrama, con su ruteo.'],
  ['Audio Object Profiler · F10', 'Perfilar el audio basado en objetos (Audio Objects).'],
  ['Voice Profiler · F11', 'Seguir cada voz que suena: de dónde salió y cómo llegó ahí.'],
  ['Game Object Profiler · F12', 'Ver los game objects registrados y sus parámetros en vivo.'],
  ['User Layout · 1–4', 'Los tuyos: guarda hasta cuatro acomodos propios.'],
];

type TabDesigner = { x: number; width: number; nombre: string };
const DESIGNER_TABS_ELEMENTOS: TabDesigner[] = [
  { x: 276, width: 104, nombre: 'Main Audio Bus' },
  { x: 380, width: 76, nombre: 'Music Bus' },
  { x: 456, width: 124, nombre: 'Level One Segment' },
];
const DESIGNER_TABS_VIEWS: TabDesigner[] = [
  { x: 276, width: 148, nombre: 'Selected Element Editor' },
  { x: 424, width: 46, nombre: 'RTPC' },
  { x: 470, width: 54, nombre: 'States' },
  { x: 524, width: 56, nombre: 'Effects' },
  { x: 580, width: 60, nombre: 'Metadata' },
];

function TabDesignerCaja({ tab, activa, y }: { tab: TabDesigner; activa: boolean; y: number }) {
  return (
    <g>
      <rect
        x={tab.x}
        y={y}
        width={tab.width}
        height="26"
        fill={activa ? '#232730' : '#1d2026'}
        stroke={activa ? '#f2a33c' : 'currentColor'}
        strokeOpacity={activa ? '1' : '.25'}
      />
      <text
        x={tab.x + tab.width / 2}
        y={y + 17}
        fontSize="10"
        fill={activa ? '#f2a33c' : 'currentColor'}
        opacity={activa ? '1' : '.6'}
        textAnchor="middle"
      >
        {tab.nombre}
      </text>
    </g>
  );
}

const EDITORS_OBJETOS: EditorItem[] = [
  { x: 70, y: 90, nombre: 'Music Playlist Editor', sub: 'Playlist Containers' },
  { x: 275, y: 90, nombre: 'Music Segment Editor', sub: 'Music Segments' },
  { x: 480, y: 90, nombre: 'State Editor', sub: 'States' },
  { x: 685, y: 90, nombre: 'Switch Editor', sub: 'Switches' },
  { x: 172, y: 200, nombre: 'SoundBank Editor', sub: 'SoundBanks' },
  { x: 377, y: 200, nombre: 'Effects Editor', sub: 'Effect ShareSets' },
  { x: 582, y: 200, nombre: 'Event Editor', sub: 'Events' },
];

function MarcoViews() {
  return (
    <>
      <rect x="30" y="16" width="880" height="328" rx="10" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      <text x="48" y="46" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">VIEWS</text>
      <line x1="60" y1="160" x2="880" y2="160" stroke="currentColor" strokeOpacity=".2" />
      <text className={s.svgSans} x="470" y="180" fontSize="10.5" fill="currentColor" opacity=".45" textAnchor="middle">
        views directos
      </text>
    </>
  );
}

function CajaCategoria({ x, nombre, atenuada = false }: { x: number; nombre: string; atenuada?: boolean }) {
  return (
    <g>
      <rect x={x} y="68" width="260" height="64" rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity={atenuada ? '.25' : '.8'} />
      <text x={x + 130} y="96" fontSize="13" fill="#f2a33c" opacity={atenuada ? '.35' : '1'} textAnchor="middle">{nombre}</text>
      <text x={x + 130} y="116" fontSize="10.5" fill="currentColor" opacity={atenuada ? '.25' : '.6'} textAnchor="middle">
        ▸ submenú
      </text>
    </g>
  );
}

function CajaView({
  x,
  y,
  width,
  nombre,
  atenuada = false,
}: {
  x: number;
  y: number;
  width: number;
  nombre: string;
  atenuada?: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width={width} height="48" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity={atenuada ? '.15' : '.35'} />
      <text x={x + width / 2} y={y + 29} fontSize="11.5" fill="currentColor" opacity={atenuada ? '.3' : '1'} textAnchor="middle">
        {nombre}
      </text>
    </g>
  );
}

function MarcoEditors() {
  return (
    <>
      <rect x="40" y="30" width="860" height="290" rx="10" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".8" />
      <text x="58" y="60" fontSize="11.5" fill="#f2a33c" letterSpacing="2">EDITORS</text>
    </>
  );
}

function CajaEditor({ x, y, width, height = 72, nombre, sub }: EditorItem & { width: number; height?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity=".8" />
      <text x={x + width / 2} y={y + Math.round(height * 0.43)} fontSize="12" fill="currentColor" textAnchor="middle">{nombre}</text>
      <text x={x + width / 2} y={y + Math.round(height * 0.72)} fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{sub}</text>
    </g>
  );
}

function CajaPropertyEditor() {
  const tabWidth: number = 760 / PROPERTY_EDITOR_TABS.length;
  return (
    <g>
      <rect x="70" y="78" width="800" height="88" rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity=".8" />
      <text x="470" y="104" fontSize="12" fill="currentColor" textAnchor="middle">Property Editor</text>
      <rect x="90" y="118" width="760" height="36" rx="6" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
      {PROPERTY_EDITOR_TABS.map((tab, index) => (
        <g key={tab}>
          {index > 0 && (
            <line x1={90 + index * tabWidth} y1="118" x2={90 + index * tabWidth} y2="154" stroke="currentColor" strokeOpacity=".35" />
          )}
          <text x={90 + index * tabWidth + tabWidth / 2} y="140" fontSize="10.5" fill="currentColor" opacity=".7" textAnchor="middle">
            {tab}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function ElEditorWwise() {
  return (
    <Deck name="El editor Wwise" context="Intro a Wwise · Wwise + Unreal">
      <Slide z="▶" label="intro" backgroundImage="/assets/presentations/wwise-unreal/Cover.jpg">
        <div className={s.eyebrow}>Intro a Wwise · la herramienta de authoring</div>
        <h1>
          El editor <span className={s.accent}>Wwise</span>
        </h1>
        <p className={s.note}>Navega con ← → · espacio</p>
      </Slide>

      <Slide z="1" label="views">
        <div className={s.eyebrow}>Concepto 1 · el menú Views</div>
        <h2>
          El editor se arma con <span className={s.accent}>views</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 940 360"
            role="img"
            aria-label="El menú Views de Wwise: las familias Editors, Profiler y Utilities con submenú, y debajo los views directos: Audio Device Meter, Audio File Importer, Loudness Meter, Meter, Project Explorer, Soundcaster y Transport Control."
          >
            <MarcoViews />
            <CajaCategoria x={60} nombre="Editors" />
            <CajaCategoria x={340} nombre="Profiler" />
            <CajaCategoria x={620} nombre="Utilities" />
            {VIEWS_DIRECTOS_FILA1.map(([x, nombre]) => (
              <CajaView key={nombre} x={x} y={190} width={185} nombre={nombre} />
            ))}
            {VIEWS_DIRECTOS_FILA2.map(([x, nombre]) => (
              <CajaView key={nombre} x={x} y={262} width={200} nombre={nombre} />
            ))}
          </svg>
          <figcaption>Tres familias con submenú — y los views directos, a un clic.</figcaption>
        </figure>
      </Slide>

      <Slide z="2" label="los útiles">
        <div className={s.eyebrow}>Concepto 1 · los de siempre</div>
        <h2>
          Los de <span className={s.accent}>todos los días</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 940 360"
            role="img"
            aria-label="El mismo menú Views con Project Explorer, Transport Control y Soundcaster destacados en ámbar; el resto de views y familias se atenúa."
          >
            <MarcoViews />
            <g className={s.morphPulse} style={{ animationDelay: '1.8s' }}>
              <CajaCategoria x={60} nombre="Editors" />
            </g>
            <CajaCategoria x={340} nombre="Profiler" atenuada />
            <CajaCategoria x={620} nombre="Utilities" atenuada />
            {VIEWS_DIRECTOS_FILA1.map(([x, nombre]) => (
              <CajaView key={nombre} x={x} y={190} width={185} nombre={nombre} atenuada />
            ))}
            <g className={s.morphOut}>
              <CajaCategoria x={340} nombre="Profiler" />
              <CajaCategoria x={620} nombre="Utilities" />
              {VIEWS_DIRECTOS_FILA1.map(([x, nombre]) => (
                <CajaView key={nombre} x={x} y={190} width={185} nombre={nombre} />
              ))}
            </g>
            {VIEWS_UTILES.map(({ x, nombre, sub, delay }) => (
              <g key={nombre}>
                <g className={s.morphOut} style={{ animationDelay: delay }}>
                  <CajaView x={x} y={262} width={200} nombre={nombre} />
                </g>
                <g className={s.morphPulse} style={{ animationDelay: delay }}>
                  <g className={s.morphIn} style={{ animationDelay: delay }}>
                    <rect x={x} y="262" width="200" height="48" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
                    <text x={x + 100} y="281" fontSize="12" fill="#f2a33c" textAnchor="middle">{nombre}</text>
                    <text x={x + 100} y="298" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{sub}</text>
                  </g>
                </g>
              </g>
            ))}
          </svg>
          <figcaption>Project Explorer para moverte; Transport y Soundcaster para escuchar.</figcaption>
        </figure>
      </Slide>

      <Slide z="3" label="por propiedad">
        <div className={s.eyebrow}>Concepto 2 · dentro de Editors</div>
        <h2>
          Un editor por <span className={s.accent}>propiedad</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 940 350"
            role="img"
            aria-label="La familia Editors abierta: el Property Editor con sus pestañas General, Routing, Conversion, Positioning y Advanced, y debajo los editores de propiedades RTPC, States, Effects, Stingers y Metadata, que funcionan sobre cualquier Wwise Object."
          >
            <g className={s.morphGlide} style={{ '--morph-from': 'translate(48px, 59px) scale(0.3)' } as CSSProperties}>
              <MarcoEditors />
            </g>
            <g className={s.morphIn} style={{ animationDelay: '0.6s' }}>
              <text className={s.svgSans} x="882" y="60" fontSize="11" fill="#63b6a4" textAnchor="end">
                propiedades de cualquier Wwise Object
              </text>
              <CajaPropertyEditor />
              {EDITORS_PROPIEDADES.map((editor) => (
                <CajaEditor key={editor.nombre} width={250} height={60} {...editor} />
              ))}
            </g>
          </svg>
          <figcaption>El Property Editor trae lo básico; cada propiedad grande tiene su editor aparte.</figcaption>
        </figure>
      </Slide>

      <Slide z="4" label="por objeto">
        <div className={s.eyebrow}>Concepto 3 · dentro de Editors</div>
        <h2>
          Un editor por <span className={s.accent}>tipo de objeto</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 940 350"
            role="img"
            aria-label="La familia Editors con los editores de objetos específicos: Music Playlist Editor, Music Segment Editor, State Editor, Switch Editor, SoundBank Editor, Effects Editor y Event Editor."
          >
            <MarcoEditors />
            <g className={s.morphOut}>
              <text className={s.svgSans} x="882" y="60" fontSize="11" fill="#63b6a4" textAnchor="end">
                propiedades de cualquier Wwise Object
              </text>
              <CajaPropertyEditor />
              {EDITORS_PROPIEDADES.map((editor) => (
                <CajaEditor key={editor.nombre} width={250} height={60} {...editor} />
              ))}
            </g>
            <g className={s.morphIn}>
              <text className={s.svgSans} x="882" y="60" fontSize="11" fill="#63b6a4" textAnchor="end">
                un editor por cada tipo de objeto
              </text>
              {EDITORS_OBJETOS.map((editor) => (
                <CajaEditor key={editor.nombre} width={185} {...editor} />
              ))}
            </g>
          </svg>
          <figcaption>Los objetos especializados traen su editor a medida.</figcaption>
        </figure>
      </Slide>

      <Slide z="5" label="layouts">
        <div className={s.eyebrow}>Concepto 4 · layouts</div>
        <h2>
          Un layout es un <span className={s.accent}>acomodo de views</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 940 310"
            role="img"
            aria-label="Dos pantallas con los mismos paneles internos acomodados distinto: un layout es una configuración de views en la pantalla."
          >
            <rect x="40" y="30" width="400" height="240" rx="10" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <rect x="56" y="46" width="120" height="208" rx="8" fill="#232730" stroke="#f2a33c" />
            <rect x="192" y="46" width="232" height="120" rx="8" fill="#232730" stroke="#63b6a4" />
            <rect x="192" y="182" width="232" height="72" rx="8" fill="#232730" stroke="#6f9fd8" />
            <text className={s.svgSans} x="240" y="296" fontSize="11" fill="currentColor" opacity=".5" textAnchor="middle">
              un layout
            </text>

            <rect x="500" y="30" width="400" height="240" rx="10" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <rect x="516" y="46" width="120" height="208" rx="8" fill="#232730" stroke="#f2a33c" />
            <rect x="652" y="46" width="104" height="130" rx="8" fill="#232730" stroke="#a88bd4" />
            <rect x="652" y="192" width="104" height="62" rx="8" fill="#232730" stroke="#6f9fd8" />
            <rect x="772" y="46" width="112" height="208" rx="8" fill="#232730" stroke="#63b6a4" />
            <text className={s.svgSans} x="700" y="296" fontSize="11" fill="currentColor" opacity=".5" textAnchor="middle">
              otro layout
            </text>
          </svg>
          <figcaption>Mismos views disponibles, otro acomodo: cada tarea pide su pantalla.</figcaption>
        </figure>
      </Slide>

      <Slide z="6" label="de fábrica">
        <div className={s.eyebrow}>Concepto 4 · los de fábrica</div>
        <h2>
          Un layout por <span className={s.accent}>tarea</span>
        </h2>
        <table className={s.plain}>
          <thead>
            <tr>
              <th>Layout</th>
              <th>Para qué</th>
            </tr>
          </thead>
          <tbody>
            {LAYOUTS_FABRICA.map(([nombre, proposito]) => (
              <tr key={nombre}>
                <td>{nombre}</td>
                <td>{proposito}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Slide>

      <Slide z="7" label="designer">
        <div className={s.eyebrow}>Concepto 5 · el layout Designer</div>
        <h2>
          Designer: donde <span className={s.accent}>la magia</span> sucede
        </h2>
        <figure>
          <svg
            viewBox="0 0 940 470"
            role="img"
            aria-label="El layout Designer: a la izquierda Project Explorer, Contextual Help y Transport Control; en el centro un panel con una fila de pestañas por elemento abierto (Main Audio Bus, Music Bus, Level One Segment) y debajo las pestañas de views dependientes del elemento seleccionado (Selected Element Editor, RTPC, States, Effects, Metadata); a la derecha el Property Editor."
          >
            <defs>
              <marker id="arrEW7t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#63b6a4" />
              </marker>
            </defs>

            <rect x="40" y="60" width="860" height="390" rx="10" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />

            <text className={s.svgSans} x="458" y="34" fontSize="11" fill="#63b6a4" textAnchor="middle">
              todos los elementos abiertos
            </text>
            <line x1="458" y1="42" x2="458" y2="74" stroke="#63b6a4" strokeWidth="1.5" markerEnd="url(#arrEW7t)" />

            <rect x="60" y="80" width="200" height="190" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="160" y="164" fontSize="12" fill="#f2a33c" textAnchor="middle">Project Explorer</text>
            <text x="160" y="184" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">navegar la jerarquía</text>
            <text x="160" y="200" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">de objetos Wwise</text>
            <rect x="60" y="282" width="200" height="70" rx="8" fill="#232730" stroke="currentColor" strokeOpacity=".35" />
            <text x="160" y="314" fontSize="11.5" fill="currentColor" textAnchor="middle">Contextual Help</text>
            <text x="160" y="332" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">ayuda de lo que apuntas</text>
            <rect x="60" y="364" width="200" height="66" rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity=".8" />
            <text x="160" y="393" fontSize="11.5" fill="currentColor" textAnchor="middle">Transport Control</text>
            <text x="160" y="411" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">escuchar</text>

            {DESIGNER_TABS_ELEMENTOS.map((tab, index) => (
              <TabDesignerCaja key={tab.nombre} tab={tab} activa={index === 0} y={80} />
            ))}
            {DESIGNER_TABS_VIEWS.map((tab, index) => (
              <TabDesignerCaja key={tab.nombre} tab={tab} activa={index === 2} y={106} />
            ))}
            <rect x="276" y="132" width="364" height="298" fill="#232730" stroke="currentColor" strokeOpacity=".35" />
            <text className={s.svgSans} x="458" y="152" fontSize="10" fill="#63b6a4" textAnchor="middle">
              pestañas de views dependientes del elemento seleccionado
            </text>
            <text className={s.svgSans} x="458" y="300" fontSize="11" fill="currentColor" opacity=".4" textAnchor="middle">
              lo que tengas seleccionado
            </text>

            <rect x="656" y="80" width="224" height="350" rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity=".8" />
            <text x="768" y="108" fontSize="12" fill="currentColor" textAnchor="middle">Property Editor</text>
            <text x="768" y="128" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">las propiedades del objeto</text>
          </svg>
          <figcaption>Navegar, editar y escuchar sin cambiar de pantalla.</figcaption>
        </figure>
      </Slide>
    </Deck>
  );
}
