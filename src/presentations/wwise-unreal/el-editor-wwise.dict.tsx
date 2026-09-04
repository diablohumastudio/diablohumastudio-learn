import type { ReactNode } from 'react';
import s from '../../components/learn/Deck.module.css';

/* Texts of the deck, one object per language. `es` is the source; keep the `en`
   phrases about the same length (±15 %) so the SVG labels stay in their boxes.
   Wwise view, editor and layout names are product names and stay in English. */

type EditorTexts = {
  name: string;
  context: string;
  labels: {
    intro: string;
    views: string;
    losUtiles: string;
    porPropiedad: string;
    porObjeto: string;
    layouts: string;
    deFabrica: string;
    designer: string;
  };
  cover: { eyebrow: string; title: ReactNode; hint: string };
  marco: { views: string; viewsDirectos: string; submenu: string; editors: string };
  views: { eyebrow: string; title: ReactNode; aria: string; caption: string };
  losUtiles: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    /** In the order of VIEWS_UTILES: Project Explorer, Transport Control, Soundcaster. */
    subs: [string, string, string];
  };
  porPropiedad: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    propiedadesDeCualquierObjeto: string;
    propertyEditor: string;
    /** In the order of EDITORS_PROPIEDADES: RTPC, States, Effects, Stingers, Metadata. */
    subs: [string, string, string, string, string];
  };
  porObjeto: { eyebrow: string; title: ReactNode; aria: string; caption: string; unEditorPorTipo: string };
  layouts: { eyebrow: string; title: ReactNode; aria: string; caption: string; unLayout: string; otroLayout: string };
  deFabrica: {
    eyebrow: string;
    title: ReactNode;
    thLayout: string;
    thParaQue: string;
    /** In the order of LAYOUTS_FABRICA_NOMBRES. */
    propositos: [string, string, string, string, string, string, string, string, string];
  };
  designer: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    todosLosElementosAbiertos: string;
    projectExplorer: string;
    navegarLaJerarquia: string;
    deObjetosWwise: string;
    contextualHelp: string;
    ayudaDeLoQueApuntas: string;
    transportControl: string;
    escuchar: string;
    pestanasDependientes: string;
    loQueTengasSeleccionado: string;
    propertyEditor: string;
    lasPropiedadesDelObjeto: string;
  };
};

const es: EditorTexts = {
  name: 'El editor Wwise',
  context: 'Intro a Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    views: 'views',
    losUtiles: 'los útiles',
    porPropiedad: 'por propiedad',
    porObjeto: 'por objeto',
    layouts: 'layouts',
    deFabrica: 'de fábrica',
    designer: 'designer',
  },
  cover: {
    eyebrow: 'Intro a Wwise · la herramienta de authoring',
    title: (
      <>
        El editor <span className={s.accent}>Wwise</span>
      </>
    ),
    hint: 'Navega con ← → · espacio',
  },
  marco: { views: 'VIEWS', viewsDirectos: 'views directos', submenu: '▸ submenú', editors: 'EDITORS' },
  views: {
    eyebrow: 'Concepto 1 · el menú Views',
    title: (
      <>
        El editor se arma con <span className={s.accent}>views</span>
      </>
    ),
    aria: 'El menú Views de Wwise: las familias Editors, Profiler y Utilities con submenú, y debajo los views directos: Audio Device Meter, Audio File Importer, Loudness Meter, Meter, Project Explorer, Soundcaster y Transport Control.',
    caption: 'Tres familias con submenú — y los views directos, a un clic.',
  },
  losUtiles: {
    eyebrow: 'Concepto 1 · los de siempre',
    title: (
      <>
        Los de <span className={s.accent}>todos los días</span>
      </>
    ),
    aria: 'El mismo menú Views con Project Explorer, Transport Control y Soundcaster destacados en ámbar; el resto de views y familias se atenúa.',
    caption: 'Project Explorer para moverte; Transport y Soundcaster para escuchar.',
    subs: ['navegar el proyecto', 'reproducir la selección', 'probar y mezclar'],
  },
  porPropiedad: {
    eyebrow: 'Concepto 2 · dentro de Editors',
    title: (
      <>
        Un editor por <span className={s.accent}>propiedad</span>
      </>
    ),
    aria: 'La familia Editors abierta: el Property Editor con sus pestañas General, Routing, Conversion, Positioning y Advanced, y debajo los editores de propiedades RTPC, States, Effects, Stingers y Metadata, que funcionan sobre cualquier Wwise Object.',
    caption: 'El Property Editor trae lo básico; cada propiedad grande tiene su editor aparte.',
    propiedadesDeCualquierObjeto: 'propiedades de cualquier Wwise Object',
    propertyEditor: 'Property Editor',
    subs: ['curvas de Game Parameters', 'ajustes por estado', 'efectos del objeto', 'remates sobre la música', 'datos extra del objeto'],
  },
  porObjeto: {
    eyebrow: 'Concepto 3 · dentro de Editors',
    title: (
      <>
        Un editor por <span className={s.accent}>tipo de objeto</span>
      </>
    ),
    aria: 'La familia Editors con los editores de objetos específicos: Music Playlist Editor, Music Segment Editor, State Editor, Switch Editor, SoundBank Editor, Effects Editor y Event Editor.',
    caption: 'Los objetos especializados traen su editor a medida.',
    unEditorPorTipo: 'un editor por cada tipo de objeto',
  },
  layouts: {
    eyebrow: 'Concepto 4 · layouts',
    title: (
      <>
        Un layout es un <span className={s.accent}>acomodo de views</span>
      </>
    ),
    aria: 'Dos pantallas con los mismos paneles internos acomodados distinto: un layout es una configuración de views en la pantalla.',
    caption: 'Mismos views disponibles, otro acomodo: cada tarea pide su pantalla.',
    unLayout: 'un layout',
    otroLayout: 'otro layout',
  },
  deFabrica: {
    eyebrow: 'Concepto 4 · los de fábrica',
    title: (
      <>
        Un layout por <span className={s.accent}>tarea</span>
      </>
    ),
    thLayout: 'Layout',
    thParaQue: 'Para qué',
    propositos: [
      'El de diario: crear y configurar Wwise Objects y Events.',
      'Conectarse al juego y ver en vivo qué suena y qué consume.',
      'Armar y generar los SoundBanks.',
      'Mezclar en conjunto: niveles, buses y sesiones de mezcla.',
      'La estructura del proyecto como diagrama, con su ruteo.',
      'Perfilar el audio basado en objetos (Audio Objects).',
      'Seguir cada voz que suena: de dónde salió y cómo llegó ahí.',
      'Ver los game objects registrados y sus parámetros en vivo.',
      'Los tuyos: guarda hasta cuatro acomodos propios.',
    ],
  },
  designer: {
    eyebrow: 'Concepto 5 · el layout Designer',
    title: (
      <>
        Designer: donde <span className={s.accent}>la magia</span> sucede
      </>
    ),
    aria: 'El layout Designer: a la izquierda Project Explorer, Contextual Help y Transport Control; en el centro un panel con una fila de pestañas por elemento abierto (Main Audio Bus, Music Bus, Level One Segment) y debajo las pestañas de views dependientes del elemento seleccionado (Selected Element Editor, RTPC, States, Effects, Metadata); a la derecha el Property Editor.',
    caption: 'Navegar, editar y escuchar sin cambiar de pantalla.',
    todosLosElementosAbiertos: 'todos los elementos abiertos',
    projectExplorer: 'Project Explorer',
    navegarLaJerarquia: 'navegar la jerarquía',
    deObjetosWwise: 'de objetos Wwise',
    contextualHelp: 'Contextual Help',
    ayudaDeLoQueApuntas: 'ayuda de lo que apuntas',
    transportControl: 'Transport Control',
    escuchar: 'escuchar',
    pestanasDependientes: 'pestañas de views dependientes del elemento seleccionado',
    loQueTengasSeleccionado: 'lo que tengas seleccionado',
    propertyEditor: 'Property Editor',
    lasPropiedadesDelObjeto: 'las propiedades del objeto',
  },
};

const en: EditorTexts = {
  name: 'The Wwise editor',
  context: 'Intro to Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    views: 'views',
    losUtiles: 'the useful ones',
    porPropiedad: 'by property',
    porObjeto: 'by object',
    layouts: 'layouts',
    deFabrica: 'factory',
    designer: 'designer',
  },
  cover: {
    eyebrow: 'Intro to Wwise · the authoring tool',
    title: (
      <>
        The <span className={s.accent}>Wwise</span> editor
      </>
    ),
    hint: 'Navigate with ← → · space',
  },
  marco: { views: 'VIEWS', viewsDirectos: 'direct views', submenu: '▸ submenu', editors: 'EDITORS' },
  views: {
    eyebrow: 'Concept 1 · the Views menu',
    title: (
      <>
        The editor is built from <span className={s.accent}>views</span>
      </>
    ),
    aria: 'The Wwise Views menu: the Editors, Profiler and Utilities families with a submenu, and below the direct views: Audio Device Meter, Audio File Importer, Loudness Meter, Meter, Project Explorer, Soundcaster and Transport Control.',
    caption: 'Three families with a submenu — and the direct views, one click away.',
  },
  losUtiles: {
    eyebrow: 'Concept 1 · the usual ones',
    title: (
      <>
        The <span className={s.accent}>everyday</span> ones
      </>
    ),
    aria: 'The same Views menu with Project Explorer, Transport Control and Soundcaster highlighted in amber; the other views and families fade out.',
    caption: 'Project Explorer to move around; Transport and Soundcaster to listen.',
    subs: ['browse the project', 'play the selection', 'try out and mix'],
  },
  porPropiedad: {
    eyebrow: 'Concept 2 · inside Editors',
    title: (
      <>
        One editor per <span className={s.accent}>property</span>
      </>
    ),
    aria: 'The Editors family open: the Property Editor with its General, Routing, Conversion, Positioning and Advanced tabs, and below the property editors RTPC, States, Effects, Stingers and Metadata, which work on any Wwise Object.',
    caption: 'The Property Editor covers the basics; each big property has its own editor.',
    propiedadesDeCualquierObjeto: 'properties of any Wwise Object',
    propertyEditor: 'Property Editor',
    subs: ['Game Parameter curves', 'settings per state', "the object's effects", 'hits over the music', 'extra object data'],
  },
  porObjeto: {
    eyebrow: 'Concept 3 · inside Editors',
    title: (
      <>
        One editor per <span className={s.accent}>object type</span>
      </>
    ),
    aria: 'The Editors family with the editors for specific objects: Music Playlist Editor, Music Segment Editor, State Editor, Switch Editor, SoundBank Editor, Effects Editor and Event Editor.',
    caption: 'Specialized objects come with a tailored editor.',
    unEditorPorTipo: 'one editor for each object type',
  },
  layouts: {
    eyebrow: 'Concept 4 · layouts',
    title: (
      <>
        A layout is an <span className={s.accent}>arrangement of views</span>
      </>
    ),
    aria: 'Two screens with the same inner panels arranged differently: a layout is a configuration of views on the screen.',
    caption: 'Same views available, another arrangement: each task asks for its own screen.',
    unLayout: 'one layout',
    otroLayout: 'another layout',
  },
  deFabrica: {
    eyebrow: 'Concept 4 · the factory ones',
    title: (
      <>
        One layout per <span className={s.accent}>task</span>
      </>
    ),
    thLayout: 'Layout',
    thParaQue: 'What for',
    propositos: [
      'The daily one: create and configure Wwise Objects and Events.',
      'Connect to the game and see live what plays and what it costs.',
      'Assemble and generate the SoundBanks.',
      'Mix as a whole: levels, buses and mixing sessions.',
      'The project structure as a diagram, with its routing.',
      'Profile object-based audio (Audio Objects).',
      'Follow each playing voice: where it came from and how it got there.',
      'See the registered game objects and their parameters live.',
      'Your own: save up to four custom arrangements.',
    ],
  },
  designer: {
    eyebrow: 'Concept 5 · the Designer layout',
    title: (
      <>
        Designer: where <span className={s.accent}>the magic</span> happens
      </>
    ),
    aria: 'The Designer layout: on the left Project Explorer, Contextual Help and Transport Control; in the middle a panel with a row of tabs per open element (Main Audio Bus, Music Bus, Level One Segment) and below the view tabs that depend on the selected element (Selected Element Editor, RTPC, States, Effects, Metadata); on the right the Property Editor.',
    caption: 'Browse, edit and listen without changing screens.',
    todosLosElementosAbiertos: 'all the open elements',
    projectExplorer: 'Project Explorer',
    navegarLaJerarquia: 'browse the hierarchy',
    deObjetosWwise: 'of Wwise objects',
    contextualHelp: 'Contextual Help',
    ayudaDeLoQueApuntas: 'help for what you point at',
    transportControl: 'Transport Control',
    escuchar: 'listen',
    pestanasDependientes: 'view tabs that depend on the selected element',
    loQueTengasSeleccionado: 'whatever you have selected',
    propertyEditor: 'Property Editor',
    lasPropiedadesDelObjeto: "the object's properties",
  },
};

export const editorDict = { es, en };
