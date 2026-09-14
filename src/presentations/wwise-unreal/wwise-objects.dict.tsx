import type { ReactNode } from 'react';
import s from '../../components/learn/Deck.module.css';

/* Texts of the deck, one object per language. `es` is the source; keep the `en`
   phrases about the same length (±15 %) so the SVG labels stay in their boxes.
   Wwise object types (Sound SFX, Switch Container, Aux Bus…) are product names
   and stay in English. */

type Caja = { nombre: string; subs: string[] };

type WwiseObjectsTexts = {
  name: string;
  context: string;
  labels: {
    intro: string;
    /** One label per step of the flow slide. */
    flujo: [string, string, string, string, string];
    clasificacion: string;
    sonido: string;
    estructura: string;
    herencia: string;
    busses: string;
    aux: string;
    efectos: string;
    sharesets: string;
    events: string;
    gameSyncs: string;
    packaging: string;
    cierre: string;
  };
  cover: { eyebrow: string; title: ReactNode; hint: string };
  /** The five families, drawn by the flow and the classification slides and by the minimap. */
  familias: {
    gameInput: { titulo: string; pregunta: string; events: Caja; gameSyncs: Caja };
    contenido: {
      titulo: string;
      pregunta: string;
      sfx: string;
      music: string;
      /** Row by row: sound SFX, sound music, structure SFX, structure music. */
      celdas: [Caja, Caja, Caja, Caja];
    };
    mixing: Caja;
    procesamiento: Caja;
    packaging: Caja;
  };
  flujo: {
    eyebrow: string;
    title: ReactNode;
    /** One per step. */
    arias: [string, string, string, string, string];
    captions: [string, string, string, string, string];
    game: string;
    parametros: string;
    senal: string;
    salida: string;
    soundBank: string;
  };
  clasificacion: { eyebrow: string; title: ReactNode; aria: string; caption: string };
  sonido: { eyebrow: string; title: ReactNode; aria: string; caption: string; objetos: Caja[]; audioData: string };
  estructura: { eyebrow: string; title: ReactNode; aria: string; caption: string; contenedores: Caja[] };
  herencia: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    /** Three levels: the root container, two containers under it, three sounds under those. */
    raiz: Caja;
    medios: [Caja, Caja];
    hojas: [Caja, Caja, Caja];
  };
  busses: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    carpetaContainers: string;
    carpetaBusses: string;
    carpetaDevices: string;
    propertyContainer: Caja;
    sonido: Caja;
    unBus: string;
    seMueve: string;
    main: Caja;
    busSfx: Caja;
    busMusic: Caja;
    auxReverb: Caja;
    motion: Caja;
    secondary: Caja;
    parlante: string;
    control: string;
    audifonos: string;
  };
  aux: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    sonido: Caja;
    dry: string;
    send: string;
    busSfx: Caja;
    auxReverb: Caja;
    main: Caja;
  };
  efectos: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    enObjeto: string;
    enBus: string;
    voces: [string, string, string];
    fx: string;
    bus: string;
    unaPorVoz: string;
    unaParaTodo: string;
  };
  sharesets: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    shareset: Caja;
    tipos: string;
    lista: string[];
    usuarios: Caja[];
    custom: Caja;
  };
  events: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    game: Caja;
    postea: string;
    event: string;
    accion: string;
    /** The fourth action repeats the third with another value: drawn in red as the counterexample. */
    actions: [Caja, Caja, Caja, Caja];
    sinArgumentos: string;
  };
  gameSyncs: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    codigo: Caja;
    /** Switch, State, RTPC, Trigger; subs: [scope line, example line]. */
    tipos: [Caja, Caja, Caja, Caja];
    dibujos: {
      switchObjetos: [string, string];
      switchValores: [string, string, string];
      stateValores: [string, string, string];
      stateMarco: string;
      rtpcEjeX: string;
      rtpcEjeY: string;
      triggerStinger: string;
      triggerCompas: string;
    };
    lectores: string;
  };
  packaging: { eyebrow: string; title: ReactNode; aria: string; caption: string; items: Caja[] };
  cierre: { eyebrow: string; title: ReactNode; aria: string; caption: string };
};

const es: WwiseObjectsTexts = {
  name: 'Wwise Objects',
  context: 'Intro a Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    flujo: ['el camino', 'game input', 'señal', 'procesa', 'soundbanks'],
    clasificacion: 'clasificación',
    sonido: 'sonido',
    estructura: 'estructura',
    herencia: 'herencia',
    busses: 'mixing · routing',
    aux: 'aux busses',
    efectos: 'efectos',
    sharesets: 'sharesets',
    events: 'events',
    gameSyncs: 'game syncs',
    packaging: 'packaging',
    cierre: 'cierre',
  },
  cover: {
    eyebrow: 'Intro a Wwise · el catálogo de objetos',
    title: (
      <>
        Wwise <span className={s.accent}>Objects</span>
      </>
    ),
    hint: 'Navega con ← → · espacio',
  },
  familias: {
    gameInput: {
      titulo: 'GAME INPUT',
      pregunta: '¿qué le dice el juego?',
      events: { nombre: 'Events', subs: ['qué acciones hacer'] },
      gameSyncs: { nombre: 'Game Syncs', subs: ['qué variables cambiar', 'directamente'] },
    },
    contenido: {
      titulo: 'CONTENIDO',
      pregunta: '¿qué suena y cómo se elige?',
      sfx: 'SFX',
      music: 'MUSIC',
      celdas: [
        { nombre: 'Sonido', subs: ['Sound SFX', 'Sound Voice'] },
        { nombre: 'Sonido', subs: ['Music Track', 'Music Segment'] },
        { nombre: 'Estructura', subs: ['Random · Sequence', 'Switch · Blend'] },
        { nombre: 'Estructura', subs: ['Music Switch', 'Music Playlist'] },
      ],
    },
    mixing: { nombre: 'MIXING · ROUTING', subs: ['¿a dónde va la señal? · busses'] },
    procesamiento: { nombre: 'PROCESAMIENTO', subs: ['¿qué le pasa', 'a la señal?', 'efectos · ShareSets'] },
    packaging: { nombre: 'PACKAGING', subs: ['¿cómo se entrega?', 'SoundBanks'] },
  },
  flujo: {
    eyebrow: 'Concepto 1 · el camino de un sonido',
    title: (
      <>
        Todo sonido sigue <span className={s.accent}>el mismo camino</span>
      </>
    ),
    arias: [
      'Cinco familias de objetos entre el juego y la salida: Game Input a la izquierda, Contenido sobre Mixing en el centro, Procesamiento a la derecha.',
      'El juego solo toca el Game Input; desde ahí salen flechas hacia Contenido, hacia Mixing y, por arriba, hacia Procesamiento.',
      'La señal nace en Contenido, baja a Mixing y sale por el dispositivo.',
      'Procesamiento actúa sobre Contenido y sobre Mixing.',
      'Un marco punteado encierra Game Input, Contenido, Mixing y Procesamiento: los SoundBanks. El juego y la salida quedan afuera.',
    ],
    captions: [
      'Cinco familias de objetos entre el juego y la salida.',
      'El juego solo toca el Game Input: postea Events y setea Game Syncs.',
      'La señal nace en el contenido, pasa por los busses y sale.',
      'El procesamiento actúa sobre el contenido y sobre la mezcla · sus parámetros también vienen del juego.',
      'Todo lo de adentro viaja empaquetado en SoundBanks · el juego y la salida quedan afuera.',
    ],
    game: 'GAME',
    parametros: 'parámetros · RTPC · States',
    senal: 'señal',
    salida: 'SALIDA',
    soundBank: 'SOUNDBANKS · todo empaquetado para que el juego lo cargue',
  },
  clasificacion: {
    eyebrow: 'Concepto 1 · una clasificación didáctica',
    title: (
      <>
        Cinco familias, <span className={s.accent}>cinco preguntas</span>
      </>
    ),
    aria: 'Las mismas cinco familias del camino, ordenadas para nombrarlas: Game Input (¿qué le dice el juego?) con Events y Game Syncs adentro; Contenido (¿qué suena y cómo se elige?) con una grilla de Sonido y Estructura por SFX y Music; Mixing · Routing (¿a dónde va la señal?); Procesamiento (¿qué le pasa a la señal?) y Packaging (¿cómo se entrega?).',
    caption: 'No es la clasificación de Wwise: es la nuestra, para entender el camino de un sonido.',
  },
  sonido: {
    eyebrow: 'Concepto 2 · Contenido · Sonido',
    title: (
      <>
        Los únicos que apuntan a <span className={s.accent}>audio real</span>
      </>
    ),
    aria: 'Cinco objetos de sonido —Sound SFX y Sound Voice en la columna SFX, Music Track y Music Segment en la columna Music, y plug-in sources— apuntan hacia abajo a los datos de audio.',
    caption: 'Todo lo demás existe para decidir si, cuándo, cuál y cómo suenan estos.',
    objetos: [
      { nombre: 'Sound SFX', subs: ['una o más fuentes', 'el caballo de batalla'] },
      { nombre: 'Sound Voice', subs: ['como SFX, pero', 'una fuente por idioma'] },
      { nombre: 'Music Track', subs: ['audio del sistema musical', 'sub-tracks y clips'] },
      { nombre: 'Music Segment', subs: ['timeline con tracks', 'cues · tempo · compás'] },
      { nombre: 'Plug-in sources', subs: ['fuentes generadas', 'Wwise Synth · tone gen'] },
    ],
    audioData: 'DATOS DE AUDIO · wav · síntesis',
  },
  estructura: {
    eyebrow: 'Concepto 2 · Contenido · Estructura',
    title: (
      <>
        Containers: hijos + <span className={s.accent}>una regla</span>
      </>
    ),
    aria: 'Ocho objetos de estructura, cada uno con su pregunta: en la columna SFX, Property Container (sin regla), Random (¿cuál?), Sequence (¿en qué orden?), Switch (¿según qué dice el juego?) y Blend (¿cuánto de cada uno?); en la columna Music, Music Playlist y Music Switch; y Folders, que solo organizan.',
    caption: 'Ninguno produce audio: tienen hijos y deciden cómo se reproducen.',
    contenedores: [
      { nombre: 'Property Container', subs: ['sin regla', 'agrupa · hereda propiedades'] },
      { nombre: 'Random Container', subs: ['¿cuál?', 'uno · pesos · sin repetir'] },
      { nombre: 'Sequence Container', subs: ['¿en qué orden?', 'uno tras otro'] },
      { nombre: 'Switch Container', subs: ['¿según qué dice el juego?', 'por Switch o State'] },
      { nombre: 'Blend Container', subs: ['¿cuánto de cada uno?', 'varios a la vez · por RTPC'] },
      { nombre: 'Music Playlist', subs: ['¿en qué orden?', 'segments · en orden o random'] },
      { nombre: 'Music Switch', subs: ['¿según qué dice el juego?', 'segments · con transiciones'] },
      { nombre: 'Folders', subs: ['sin regla', 'solo organizan'] },
    ],
  },
  herencia: {
    eyebrow: 'Concepto 2 · Contenido · Estructura · herencia',
    title: (
      <>
        Lo del padre <span className={s.accent}>baja a los hijos</span>
      </>
    ),
    aria: 'Tres pisos: un Property Container footsteps con volumen −6 dB y bus SFX; debajo, player (0 dB, suma −6) y enemy (−4 dB, suma −10); debajo de player, footstep_wood (0 dB, suma −6) y footstep_grass (−2 dB, suma −8); debajo de enemy, footstep_metal (−4 dB, suma −14) que además sobreescribe el bus a Metal.',
    caption: 'Lo relativo (volumen, pitch) se suma piso a piso · lo absoluto (bus, efectos) se hereda, salvo que un hijo lo sobreescriba.',
    raiz: { nombre: 'Property Container · footsteps', subs: ['Volume −6 dB · Output bus: SFX'] },
    medios: [
      { nombre: 'Property Container · player', subs: ['Volume 0 dB → suma −6 dB'] },
      { nombre: 'Property Container · enemy', subs: ['Volume −4 dB → suma −10 dB'] },
    ],
    hojas: [
      { nombre: 'footstep_wood', subs: ['0 dB → suma −6 dB', 'bus SFX · heredado'] },
      { nombre: 'footstep_grass', subs: ['−2 dB → suma −8 dB', 'bus SFX · heredado'] },
      { nombre: 'footstep_metal', subs: ['−4 dB → suma −14 dB', 'override · bus: Metal'] },
    ],
  },
  busses: {
    eyebrow: 'Concepto 3 · Mixing · Routing',
    title: (
      <>
        Cómo se mezclan las señales y <span className={s.accent}>por dónde suena</span> esa mezcla
      </>
    ),
    aria: 'Tres carpetas de la pestaña Audio. Containers: un Sound SFX que apunta con una flecha a su único output bus. Busses: Main Audio Bus con los busses SFX y Music, un Aux Bus de reverb, el Master Motion Bus y un Secondary Bus. Devices: el Main Audio Bus sale a un parlante, el Motion Bus a un control y el Secondary Bus a unos audífonos.',
    caption: 'Cada objeto apunta a exactamente un output bus: la señal se mueve, no se copia.',
    carpetaContainers: 'CONTAINERS',
    carpetaBusses: 'BUSSES',
    carpetaDevices: 'DEVICES',
    propertyContainer: { nombre: 'Property Container · footsteps', subs: [] },
    sonido: { nombre: 'Sound SFX · footstep_wood', subs: ['Output bus: SFX'] },
    unBus: 'un solo output bus',
    seMueve: 'la señal se mueve',
    main: { nombre: 'Main Audio Bus', subs: ['la salida principal'] },
    busSfx: { nombre: 'Audio Bus · SFX', subs: [] },
    busMusic: { nombre: 'Audio Bus · Music', subs: [] },
    auxReverb: { nombre: 'Aux Bus · Reverb', subs: ['destino de sends'] },
    motion: { nombre: 'Master Motion Bus', subs: ['no audible · vibración · hápticos'] },
    secondary: { nombre: 'Secondary Bus', subs: ['audio a otro hardware'] },
    parlante: 'parlante',
    control: 'control',
    audifonos: 'audífonos',
  },
  aux: {
    eyebrow: 'Concepto 3 · Mixing · Routing · aux busses',
    title: (
      <>
        El send es <span className={s.accent}>una copia</span>
      </>
    ),
    aria: 'Un Sound SFX manda su señal seca a su Audio Bus y una copia, con nivel de send por objeto, al Aux Bus de reverb; ambos busses desembocan en el Main Audio Bus.',
    caption: 'Bus normal = un destino, sin duplicar · Aux bus = duplicación para efectos compartidos.',
    sonido: { nombre: 'Sound SFX · footstep_wood', subs: ['Output bus: SFX · send: Reverb'] },
    dry: 'dry · se mueve · un destino',
    send: 'send · copia · nivel por objeto',
    busSfx: { nombre: 'Audio Bus · SFX', subs: ['la señal seca'] },
    auxReverb: { nombre: 'Aux Bus · Reverb', subs: ['la copia procesada'] },
    main: { nombre: 'Main Audio Bus', subs: ['dry + wet'] },
  },
  efectos: {
    eyebrow: 'Concepto 4 · Procesamiento · efectos',
    title: (
      <>
        Un efecto por voz o <span className={s.accent}>uno para todas</span>
      </>
    ),
    aria: 'Dos paneles: a la izquierda, tres voces con un efecto cada una antes del bus; a la derecha, tres voces que entran al bus y un solo efecto después de la suma.',
    caption: 'En el objeto: flexible pero costoso · en el bus: una instancia sirve a todos · por eso la reverb vive en un aux bus.',
    enObjeto: 'EFECTO EN EL OBJETO',
    enBus: 'EFECTO EN EL BUS',
    voces: ['voz 1', 'voz 2', 'voz 3'],
    fx: 'FX',
    bus: 'BUS',
    unaPorVoz: '3 voces · 3 instancias · antes de mezclar',
    unaParaTodo: '3 voces · 1 instancia · sobre la suma',
  },
  sharesets: {
    eyebrow: 'Concepto 4 · Procesamiento · ShareSets',
    title: (
      <>
        Se edita una vez, <span className={s.accent}>se usa en todos</span>
      </>
    ),
    aria: 'Un Effect ShareSet de reverb, editado en un solo lugar, es usado por un sonido, un bus y un aux bus. Al lado, los tipos de ShareSet y la alternativa Custom para un solo uso.',
    caption: 'ShareSet = definición central reutilizable · Custom = versión local para un solo caso.',
    shareset: { nombre: 'Effect ShareSet · Reverb_Hall', subs: ['se edita en un solo lugar'] },
    tipos: 'TIPOS DE SHARESET',
    lista: ['Effect ShareSets', 'Attenuation ShareSets', 'Conversion Settings', 'Modulators · LFO · Envelope · Time'],
    usuarios: [
      { nombre: 'Sound SFX · door_slam', subs: ['usa Reverb_Hall'] },
      { nombre: 'Audio Bus · Music', subs: ['usa Reverb_Hall'] },
      { nombre: 'Aux Bus · Reverb', subs: ['usa Reverb_Hall'] },
    ],
    custom: { nombre: 'Custom (local)', subs: ['una versión propia', 'para un caso puntual'] },
  },
  events: {
    eyebrow: 'Concepto 5 · Game Input · Events',
    title: (
      <>
        El juego solo ve <span className={s.accent}>el Event</span>
      </>
    ),
    aria: 'El juego postea por nombre el Event Play_Footstep; adentro, sus Actions: Play sobre el container footsteps, Set Switch de surface a grass, Set RTPC de car_rpm a 4200 y, en rojo, otro Set RTPC de car_rpm a 6000: no se puede, porque los Events no reciben argumentos y hace falta un Event por valor.',
    caption: 'El juego nunca ve las Actions: cambiar el comportamiento no toca el código.',
    game: { nombre: 'GAME', subs: ['código'] },
    postea: 'postea por nombre',
    event: 'EVENT · Play_Footstep',
    accion: 'ACTION',
    actions: [
      { nombre: 'Play', subs: ['→ footsteps (container)'] },
      { nombre: 'Set Switch', subs: ['→ surface = grass'] },
      { nombre: 'Set RTPC', subs: ['→ car_rpm = 4200'] },
      { nombre: 'Set RTPC', subs: ['→ car_rpm = 6000'] },
    ],
    sinArgumentos: 'los Events no reciben argumentos: un Event por valor',
  },
  gameSyncs: {
    eyebrow: 'Concepto 5 · Game Input · Game Syncs',
    title: (
      <>
        Game Syncs: valores <span className={s.accent}>desde el código</span>
      </>
    ),
    aria: 'El código del juego setea cuatro tipos de Game Sync que luego leen los objects, containers y busses. Switch: un selector por Game Object (Enemy A en wood, Enemy B en tile). State: un solo selector para todo el juego (Low Health). RTPC: una curva continua de RPM a pitch. Trigger: un pulso que cae en el siguiente tiempo del compás, para stingers.',
    caption: 'Los Events dicen cuándo; los Game Syncs, cómo · Switch = qué sonido para este objeto · State = la situación para todos.',
    codigo: { nombre: 'CÓDIGO DEL JUEGO', subs: ['setea los valores'] },
    tipos: [
      { nombre: 'Switch', subs: ['discreto · local · un Game Object', 'Enemy A: wood · Enemy B: tile'] },
      { nombre: 'State', subs: ['discreto · global · todo el juego', 'Low Health · con transición'] },
      { nombre: 'RTPC', subs: ['continuo · por curva', 'RPM del auto → pitch'] },
      { nombre: 'Trigger', subs: ['momentáneo · una señal puntual', 'stingers de música'] },
    ],
    dibujos: {
      switchObjetos: ['Enemy A', 'Enemy B'],
      switchValores: ['wood', 'grass', 'tile'],
      stateValores: ['Low', 'Normal', 'Full'],
      stateMarco: 'todo el juego',
      rtpcEjeX: 'RPM',
      rtpcEjeY: 'pitch',
      triggerStinger: 'stinger',
      triggerCompas: 'compás',
    },
    lectores: 'LEÍDOS POR OBJECTS · CONTAINERS · BUSSES',
  },
  packaging: {
    eyebrow: 'Concepto 6 · Packaging',
    title: (
      <>
        Empaquetar y <span className={s.accent}>organizar</span>
      </>
    ),
    aria: 'Tres cajas: SoundBanks (Events, estructuras y media que se cargan en runtime), Work Units (archivos .wwu que parten el proyecto para control de versiones) y Queries y Sessions (herramientas, no objetos de runtime).',
    caption: 'Los SoundBanks viajan con el juego; Work Units, Queries y Sessions se quedan en el editor.',
    items: [
      { nombre: 'SoundBanks', subs: ['Events + estructuras + media', 'se cargan en runtime', 'también Auto-Defined por Event'] },
      { nombre: 'Work Units', subs: ['archivos .wwu', 'parten el proyecto', 'control de versiones · equipo'] },
      { nombre: 'Queries · Sessions', subs: ['buscar en el proyecto', 'perfilar y mezclar', 'no son objetos de runtime'] },
    ],
  },
  cierre: {
    eyebrow: 'Cierre · el camino de un sonido',
    title: (
      <>
        Todo sonido sigue <span className={s.accent}>el mismo camino</span>
      </>
    ),
    aria: 'El camino completo otra vez: el juego toca el Game Input; la señal nace en Contenido, baja a Mixing y sale por el dispositivo; Procesamiento actúa sobre Contenido y Mixing; todo lo de adentro viaja en SoundBanks.',
    caption: 'Game Input → Contenido → Mixing → Salida · Procesamiento actúa sobre el camino · SoundBanks lo empaquetan.',
  },
};

const en: WwiseObjectsTexts = {
  name: 'Wwise Objects',
  context: 'Intro to Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    flujo: ['the path', 'game input', 'signal', 'process', 'soundbanks'],
    clasificacion: 'classification',
    sonido: 'sound',
    estructura: 'structure',
    herencia: 'inheritance',
    busses: 'mixing · routing',
    aux: 'aux busses',
    efectos: 'effects',
    sharesets: 'sharesets',
    events: 'events',
    gameSyncs: 'game syncs',
    packaging: 'packaging',
    cierre: 'wrap-up',
  },
  cover: {
    eyebrow: 'Intro to Wwise · the object catalog',
    title: (
      <>
        Wwise <span className={s.accent}>Objects</span>
      </>
    ),
    hint: 'Navigate with ← → · space',
  },
  familias: {
    gameInput: {
      titulo: 'GAME INPUT',
      pregunta: 'what does the game say?',
      events: { nombre: 'Events', subs: ['which actions to do'] },
      gameSyncs: { nombre: 'Game Syncs', subs: ['which variables to change', 'directly'] },
    },
    contenido: {
      titulo: 'CONTENT',
      pregunta: 'what plays and how is it chosen?',
      sfx: 'SFX',
      music: 'MUSIC',
      celdas: [
        { nombre: 'Sound', subs: ['Sound SFX', 'Sound Voice'] },
        { nombre: 'Sound', subs: ['Music Track', 'Music Segment'] },
        { nombre: 'Structure', subs: ['Random · Sequence', 'Switch · Blend'] },
        { nombre: 'Structure', subs: ['Music Switch', 'Music Playlist'] },
      ],
    },
    mixing: { nombre: 'MIXING · ROUTING', subs: ['where does the signal go? · busses'] },
    procesamiento: { nombre: 'PROCESSING', subs: ['what happens', 'to the signal?', 'effects · ShareSets'] },
    packaging: { nombre: 'PACKAGING', subs: ['how does it ship?', 'SoundBanks'] },
  },
  flujo: {
    eyebrow: 'Concept 1 · the path of one sound',
    title: (
      <>
        Every sound follows <span className={s.accent}>the same path</span>
      </>
    ),
    arias: [
      'Five object families between the game and the output: Game Input on the left, Content above Mixing in the middle, Processing on the right.',
      'The game only touches the Game Input; from there arrows go to Content, to Mixing and, over the top, to Processing.',
      'The signal is born in Content, goes down to Mixing and leaves through the device.',
      'Processing acts on Content and on Mixing.',
      'A dashed frame encloses Game Input, Content, Mixing and Processing: the SoundBanks. The game and the output stay outside.',
    ],
    captions: [
      'Five object families between the game and the output.',
      'The game only touches the Game Input: it posts Events and sets Game Syncs.',
      'The signal is born in the content, goes through the busses and leaves.',
      'Processing acts on the content and on the mix · its parameters also come from the game.',
      'Everything inside ships packaged in SoundBanks · the game and the output stay outside.',
    ],
    game: 'GAME',
    parametros: 'parameters · RTPC · States',
    senal: 'signal',
    salida: 'OUTPUT',
    soundBank: 'SOUNDBANKS · everything packaged so the game can load it',
  },
  clasificacion: {
    eyebrow: 'Concept 1 · a didactic classification',
    title: (
      <>
        Five families, <span className={s.accent}>five questions</span>
      </>
    ),
    aria: 'The same five families of the path, laid out to name them: Game Input (what does the game say?) with Events and Game Syncs inside; Content (what plays and how is it chosen?) with a grid of Sound and Structure by SFX and Music; Mixing · Routing (where does the signal go?); Processing (what happens to the signal?) and Packaging (how does it ship?).',
    caption: 'Not the Wwise classification: ours, to understand the path of one sound.',
  },
  sonido: {
    eyebrow: 'Concept 2 · Content · Sound',
    title: (
      <>
        The only ones that point to <span className={s.accent}>actual audio</span>
      </>
    ),
    aria: 'Five sound objects —Sound SFX and Sound Voice in the SFX column, Music Track and Music Segment in the Music column, and plug-in sources— point down to the audio data.',
    caption: 'Everything else exists to decide whether, when, which and how these play.',
    objetos: [
      { nombre: 'Sound SFX', subs: ['one or more sources', 'the workhorse'] },
      { nombre: 'Sound Voice', subs: ['like SFX, but', 'one source per language'] },
      { nombre: 'Music Track', subs: ['audio in the music system', 'sub-tracks and clips'] },
      { nombre: 'Music Segment', subs: ['timeline holding tracks', 'cues · tempo · meter'] },
      { nombre: 'Plug-in sources', subs: ['generated sources', 'Wwise Synth · tone gen'] },
    ],
    audioData: 'AUDIO DATA · wav · synthesis',
  },
  estructura: {
    eyebrow: 'Concept 2 · Content · Structure',
    title: (
      <>
        Containers: children + <span className={s.accent}>one rule</span>
      </>
    ),
    aria: 'Eight structure objects, each with its question: in the SFX column, Property Container (no rule), Random (which one?), Sequence (in what order?), Switch (based on what the game says?) and Blend (how much of each?); in the Music column, Music Playlist and Music Switch; and Folders, organization only.',
    caption: 'None of them produce audio: they own children and decide how they play.',
    contenedores: [
      { nombre: 'Property Container', subs: ['no rule', 'groups · shares properties'] },
      { nombre: 'Random Container', subs: ['which one?', 'one · weights · no repeat'] },
      { nombre: 'Sequence Container', subs: ['in what order?', 'one after another'] },
      { nombre: 'Switch Container', subs: ['based on what the game says?', 'by Switch or State'] },
      { nombre: 'Blend Container', subs: ['how much of each?', 'several at once · by RTPC'] },
      { nombre: 'Music Playlist', subs: ['in what order?', 'segments · ordered or random'] },
      { nombre: 'Music Switch', subs: ['based on what the game says?', 'segments · with transitions'] },
      { nombre: 'Folders', subs: ['no rule', 'organization only'] },
    ],
  },
  herencia: {
    eyebrow: 'Concept 2 · Content · Structure · inheritance',
    title: (
      <>
        The parent's values <span className={s.accent}>flow down</span>
      </>
    ),
    aria: 'Three levels: a Property Container footsteps with volume −6 dB and bus SFX; below it, player (0 dB, sum −6) and enemy (−4 dB, sum −10); under player, footstep_wood (0 dB, sum −6) and footstep_grass (−2 dB, sum −8); under enemy, footstep_metal (−4 dB, sum −14), which also overrides the bus to Metal.',
    caption: 'Relative properties (volume, pitch) add up level by level · absolute ones (bus, effects) are inherited unless a child overrides them.',
    raiz: { nombre: 'Property Container · footsteps', subs: ['Volume −6 dB · Output bus: SFX'] },
    medios: [
      { nombre: 'Property Container · player', subs: ['Volume 0 dB → sum −6 dB'] },
      { nombre: 'Property Container · enemy', subs: ['Volume −4 dB → sum −10 dB'] },
    ],
    hojas: [
      { nombre: 'footstep_wood', subs: ['0 dB → sum −6 dB', 'bus SFX · inherited'] },
      { nombre: 'footstep_grass', subs: ['−2 dB → sum −8 dB', 'bus SFX · inherited'] },
      { nombre: 'footstep_metal', subs: ['−4 dB → sum −14 dB', 'override · bus: Metal'] },
    ],
  },
  busses: {
    eyebrow: 'Concept 3 · Mixing · Routing',
    title: (
      <>
        How the signals are mixed and <span className={s.accent}>where that mix</span> plays
      </>
    ),
    aria: 'Three folders of the Audio tab. Containers: a Sound SFX pointing with an arrow to its single output bus. Busses: Main Audio Bus with the SFX and Music busses, a reverb Aux Bus, the Master Motion Bus and a Secondary Bus. Devices: the Main Audio Bus goes out to a speaker, the Motion Bus to a controller and the Secondary Bus to headphones.',
    caption: 'Every object points to exactly one output bus: the signal is moved, not copied.',
    carpetaContainers: 'CONTAINERS',
    carpetaBusses: 'BUSSES',
    carpetaDevices: 'DEVICES',
    propertyContainer: { nombre: 'Property Container · footsteps', subs: [] },
    sonido: { nombre: 'Sound SFX · footstep_wood', subs: ['Output bus: SFX'] },
    unBus: 'a single output bus',
    seMueve: 'the signal is moved',
    main: { nombre: 'Main Audio Bus', subs: ['the main output'] },
    busSfx: { nombre: 'Audio Bus · SFX', subs: [] },
    busMusic: { nombre: 'Audio Bus · Music', subs: [] },
    auxReverb: { nombre: 'Aux Bus · Reverb', subs: ['send destination'] },
    motion: { nombre: 'Master Motion Bus', subs: ['not audible · rumble · haptics'] },
    secondary: { nombre: 'Secondary Bus', subs: ['audio to other hardware'] },
    parlante: 'speaker',
    control: 'controller',
    audifonos: 'headphones',
  },
  aux: {
    eyebrow: 'Concept 3 · Mixing · Routing · aux busses',
    title: (
      <>
        A send is <span className={s.accent}>a copy</span>
      </>
    ),
    aria: 'A Sound SFX sends its dry signal to its Audio Bus and a copy, at a per-object send level, to the reverb Aux Bus; both busses flow into the Main Audio Bus.',
    caption: 'Regular bus = one destination, no duplication · Aux bus = duplication for shared effects.',
    sonido: { nombre: 'Sound SFX · footstep_wood', subs: ['Output bus: SFX · send: Reverb'] },
    dry: 'dry · moved · one destination',
    send: 'send · copy · per-object level',
    busSfx: { nombre: 'Audio Bus · SFX', subs: ['the dry signal'] },
    auxReverb: { nombre: 'Aux Bus · Reverb', subs: ['the processed copy'] },
    main: { nombre: 'Main Audio Bus', subs: ['dry + wet'] },
  },
  efectos: {
    eyebrow: 'Concept 4 · Processing · effects',
    title: (
      <>
        One effect per voice or <span className={s.accent}>one for all</span>
      </>
    ),
    aria: 'Two panels: on the left, three voices with one effect each before the bus; on the right, three voices entering the bus and a single effect after the sum.',
    caption: 'On the object: flexible but costly · on the bus: one instance serves all · that is why reverb lives on an aux bus.',
    enObjeto: 'EFFECT ON THE OBJECT',
    enBus: 'EFFECT ON THE BUS',
    voces: ['voice 1', 'voice 2', 'voice 3'],
    fx: 'FX',
    bus: 'BUS',
    unaPorVoz: '3 voices · 3 instances · before mixing',
    unaParaTodo: '3 voices · 1 instance · on the sum',
  },
  sharesets: {
    eyebrow: 'Concept 4 · Processing · ShareSets',
    title: (
      <>
        Edited once, <span className={s.accent}>used everywhere</span>
      </>
    ),
    aria: 'A reverb Effect ShareSet, edited in one place, is used by a sound, a bus and an aux bus. Beside it, the ShareSet types and the Custom alternative for one-off use.',
    caption: 'ShareSet = central reusable definition · Custom = local version for a single case.',
    shareset: { nombre: 'Effect ShareSet · Reverb_Hall', subs: ['edited in a single place'] },
    tipos: 'SHARESET TYPES',
    lista: ['Effect ShareSets', 'Attenuation ShareSets', 'Conversion Settings', 'Modulators · LFO · Envelope · Time'],
    usuarios: [
      { nombre: 'Sound SFX · door_slam', subs: ['uses Reverb_Hall'] },
      { nombre: 'Audio Bus · Music', subs: ['uses Reverb_Hall'] },
      { nombre: 'Aux Bus · Reverb', subs: ['uses Reverb_Hall'] },
    ],
    custom: { nombre: 'Custom (local)', subs: ['its own version', 'for a one-off case'] },
  },
  events: {
    eyebrow: 'Concept 5 · Game Input · Events',
    title: (
      <>
        The game only sees <span className={s.accent}>the Event</span>
      </>
    ),
    aria: 'The game posts the Event Play_Footstep by name; inside, its Actions: Play on the footsteps container, Set Switch of surface to grass, Set RTPC of car_rpm to 4200 and, in red, another Set RTPC of car_rpm to 6000: not possible, because Events take no arguments and you need one Event per value.',
    caption: 'The game never sees the Actions: changing behavior does not touch the code.',
    game: { nombre: 'GAME', subs: ['code'] },
    postea: 'posts by name',
    event: 'EVENT · Play_Footstep',
    accion: 'ACTION',
    actions: [
      { nombre: 'Play', subs: ['→ footsteps (container)'] },
      { nombre: 'Set Switch', subs: ['→ surface = grass'] },
      { nombre: 'Set RTPC', subs: ['→ car_rpm = 4200'] },
      { nombre: 'Set RTPC', subs: ['→ car_rpm = 6000'] },
    ],
    sinArgumentos: 'Events take no arguments: one Event per value',
  },
  gameSyncs: {
    eyebrow: 'Concept 5 · Game Input · Game Syncs',
    title: (
      <>
        Game Syncs: values <span className={s.accent}>from the code</span>
      </>
    ),
    aria: 'The game code sets four kinds of Game Sync that objects, containers and busses then read. Switch: one selector per Game Object (Enemy A on wood, Enemy B on tile). State: a single selector for the whole game (Low Health). RTPC: a continuous curve from RPM to pitch. Trigger: a pulse that lands on the next beat of the bar, for stingers.',
    caption: 'Events say when; Game Syncs say how · Switch = which sound for this object · State = the situation for everything.',
    codigo: { nombre: 'GAME CODE', subs: ['sets the values'] },
    tipos: [
      { nombre: 'Switch', subs: ['discrete · local · one Game Object', 'Enemy A: wood · Enemy B: tile'] },
      { nombre: 'State', subs: ['discrete · global · the whole game', 'Low Health · with transition'] },
      { nombre: 'RTPC', subs: ['continuous · via curve', 'car RPM → pitch'] },
      { nombre: 'Trigger', subs: ['momentary · a one-shot signal', 'music stingers'] },
    ],
    dibujos: {
      switchObjetos: ['Enemy A', 'Enemy B'],
      switchValores: ['wood', 'grass', 'tile'],
      stateValores: ['Low', 'Normal', 'Full'],
      stateMarco: 'the whole game',
      rtpcEjeX: 'RPM',
      rtpcEjeY: 'pitch',
      triggerStinger: 'stinger',
      triggerCompas: 'bar',
    },
    lectores: 'READ BY OBJECTS · CONTAINERS · BUSSES',
  },
  packaging: {
    eyebrow: 'Concept 6 · Packaging',
    title: (
      <>
        Package and <span className={s.accent}>organize</span>
      </>
    ),
    aria: 'Three boxes: SoundBanks (Events, structures and media loaded at runtime), Work Units (.wwu files that split the project for version control) and Queries and Sessions (tooling, not runtime objects).',
    caption: 'SoundBanks travel with the game; Work Units, Queries and Sessions stay in the editor.',
    items: [
      { nombre: 'SoundBanks', subs: ['Events + structures + media', 'loaded at runtime', 'also Auto-Defined per Event'] },
      { nombre: 'Work Units', subs: ['.wwu files', 'split the project', 'version control · team work'] },
      { nombre: 'Queries · Sessions', subs: ['search the project', 'profile and mix', 'not runtime objects'] },
    ],
  },
  cierre: {
    eyebrow: 'Wrap-up · the path of one sound',
    title: (
      <>
        Every sound follows <span className={s.accent}>the same path</span>
      </>
    ),
    aria: 'The full path once more: the game touches the Game Input; the signal is born in Content, goes down to Mixing and leaves through the device; Processing acts on Content and Mixing; everything inside ships in SoundBanks.',
    caption: 'Game Input → Content → Mixing → Output · Processing acts on the path · SoundBanks package it.',
  },
};

export const wwiseObjectsDict = { es, en };
