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
    camino: [string, string, string, string, string, string, string];
    preguntas: string;
    contenido: string;
    estructura: string;
    herencia: string;
    busses: string;
    aux: string;
    efectos: string;
    sharesets: string;
    events: string;
    gameSyncs: string;
    seleccion: string;
    packaging: string;
  };
  cover: { eyebrow: string; title: ReactNode; hint: string };
  camino: {
    eyebrow: string;
    title: ReactNode;
    /** One per step. */
    arias: [string, string, string, string, string, string, string];
    captions: [string, string, string, string, string, string, string];
    game: string;
    postea: string;
    event: string;
    ejecuta: string;
    actions: string;
    apunta: string;
    object: string;
    objectSub: string;
    resuelve: string;
    contenido: string;
    contenidoSub: string;
    gameSyncs: string;
    gameSyncsSub: string;
    consulta: string;
    envia: string;
    bus: string;
    procesa: string;
    procesaSub: string;
    llega: string;
    salida: string;
    soundBank: string;
  };
  preguntas: { eyebrow: string; title: ReactNode; aria: string; caption: string; familias: Caja[] };
  contenido: { eyebrow: string; title: ReactNode; aria: string; caption: string; objetos: Caja[]; audioData: string };
  estructura: { eyebrow: string; title: ReactNode; aria: string; caption: string; contenedores: Caja[] };
  herencia: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    padre: Caja;
    hijos: Caja[];
  };
  busses: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    jerarquiaContenido: string;
    jerarquiaMixer: string;
    actorMixer: Caja;
    sonido: Caja;
    unBus: string;
    seMueve: string;
    master: Caja;
    busSfx: Caja;
    busMusic: Caja;
    auxReverb: Caja;
    motion: Caja;
    secondary: Caja;
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
    master: Caja;
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
    actions: Caja[];
    cadaAction: string;
    dialogue: Caja;
  };
  gameSyncs: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    codigo: Caja;
    tipos: Caja[];
    lectores: string;
  };
  seleccion: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    laneSeleccion: string;
    action: Caja;
    switchValor: Caja;
    lee: string;
    container: Caja;
    elige: string;
    hijo: Caja;
    laneModificacion: string;
    rtpc: Caja;
    curva: string;
    propiedad: Caja;
    sinAction: string;
  };
  packaging: { eyebrow: string; title: ReactNode; aria: string; caption: string; items: Caja[] };
};

const es: WwiseObjectsTexts = {
  name: 'Wwise Objects',
  context: 'Intro a Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    camino: ['event', 'actions', 'object', 'contenido', 'bus', 'procesa', 'salida'],
    preguntas: 'siete preguntas',
    contenido: 'contenido',
    estructura: 'estructura',
    herencia: 'herencia',
    busses: 'routing',
    aux: 'aux busses',
    efectos: 'efectos',
    sharesets: 'sharesets',
    events: 'events',
    gameSyncs: 'game syncs',
    seleccion: 'elegir vs modificar',
    packaging: 'packaging',
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
  camino: {
    eyebrow: 'Concepto 1 · el camino de un sonido',
    title: (
      <>
        Todo sonido sigue <span className={s.accent}>el mismo camino</span>
      </>
    ),
    arias: [
      'El juego postea un Event.',
      'El juego postea un Event, y el Event ejecuta sus Actions.',
      'El juego postea un Event, el Event ejecuta sus Actions y cada Action apunta a un object: un container o un sonido.',
      'El object resuelve a contenido real, consultando los Game Syncs si hace falta.',
      'La señal resultante se envía a un bus.',
      'Los busses aplican procesamiento: efectos y mezcla.',
      'La mezcla llega a un dispositivo de salida. Todo va empaquetado en SoundBanks para que el juego lo cargue.',
    ],
    captions: [
      'El juego solo hace una cosa: postear un Event.',
      'El Event no suena: ejecuta Actions.',
      'Cada Action apunta a un object: un container o un sonido.',
      'El object resuelve a contenido, consultando los Game Syncs si hace falta.',
      'La señal resultante se envía a un bus.',
      'Los busses procesan: efectos y mezcla.',
      'La mezcla sale por el dispositivo · todo viaja empaquetado en SoundBanks.',
    ],
    game: 'GAME',
    postea: 'postea',
    event: 'EVENT',
    ejecuta: 'ejecuta',
    actions: 'ACTIONS',
    apunta: 'apunta a',
    object: 'OBJECT',
    objectSub: 'container o sonido',
    resuelve: 'resuelve a',
    contenido: 'CONTENIDO',
    contenidoSub: 'audio real',
    gameSyncs: 'GAME SYNCS',
    gameSyncsSub: 'Switch · State · RTPC',
    consulta: 'consulta',
    envia: 'envía a',
    bus: 'BUS',
    procesa: 'PROCESA',
    procesaSub: 'efectos · mezcla',
    llega: 'llega a',
    salida: 'SALIDA',
    soundBank: 'SOUNDBANKS · todo empaquetado para que el juego lo cargue',
  },
  preguntas: {
    eyebrow: 'Concepto 1 · el mapa',
    title: (
      <>
        Cada objeto responde <span className={s.accent}>una pregunta</span>
      </>
    ),
    aria: 'Siete familias de objetos, cada una con su pregunta: contenido (¿qué suena?), estructura (¿cómo se elige o combina?), routing (¿a dónde va la señal?), procesamiento (¿qué le pasa a la señal?), triggers (¿quién lo dispara?), game input (¿qué le dice el juego a Wwise?) y packaging (¿cómo se entrega?).',
    caption: 'Siete preguntas a lo largo del camino · el resto de la clase las recorre.',
    familias: [
      { nombre: 'CONTENIDO', subs: ['¿qué suena?'] },
      { nombre: 'ESTRUCTURA', subs: ['¿cómo se elige o combina?'] },
      { nombre: 'ROUTING', subs: ['¿a dónde va la señal?'] },
      { nombre: 'PROCESAMIENTO', subs: ['¿qué le pasa a la señal?'] },
      { nombre: 'TRIGGERS', subs: ['¿quién lo dispara?'] },
      { nombre: 'GAME INPUT', subs: ['¿qué le dice el juego?'] },
      { nombre: 'PACKAGING', subs: ['¿cómo se entrega?'] },
    ],
  },
  contenido: {
    eyebrow: 'Concepto 2 · ¿qué suena?',
    title: (
      <>
        Los únicos que apuntan a <span className={s.accent}>audio real</span>
      </>
    ),
    aria: 'Cinco objetos de contenido —Sound SFX, Sound Voice, Music Track, Music Segment y plug-in sources— apuntan hacia abajo a los datos de audio.',
    caption: 'Todo lo demás existe para decidir si, cuándo, cuál y cómo suenan estos.',
    objetos: [
      { nombre: 'Sound SFX', subs: ['una o más fuentes', 'el caballo de batalla'] },
      { nombre: 'Sound Voice', subs: ['como SFX, pero', 'una fuente por idioma'] },
      { nombre: 'Music Track', subs: ['audio del sistema musical', 'sub-tracks y clips'] },
      { nombre: 'Music Segment', subs: ['timeline con tracks', 'cues · tempo · compás'] },
      { nombre: 'Plug-in sources', subs: ['contenido generado', 'Wwise Synth · tone gen'] },
    ],
    audioData: 'DATOS DE AUDIO · wav · síntesis',
  },
  estructura: {
    eyebrow: 'Concepto 3 · ¿cómo se elige o combina?',
    title: (
      <>
        Containers: hijos + <span className={s.accent}>una regla</span>
      </>
    ),
    aria: 'Ocho objetos estructurales, cada uno con su pregunta: Actor-Mixer (sin regla), Random (¿cuál?), Sequence (¿en qué orden?), Switch (¿según qué dice el juego?), Blend (¿cuánto de cada uno?), Music Playlist, Music Switch y Folders.',
    caption: 'Ninguno produce audio: tienen hijos y deciden cómo se reproducen.',
    contenedores: [
      { nombre: 'Actor-Mixer', subs: ['sin regla', 'agrupa · hereda propiedades'] },
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
    eyebrow: 'Concepto 3 · herencia',
    title: (
      <>
        Lo del padre <span className={s.accent}>baja a los hijos</span>
      </>
    ),
    aria: 'Un Actor-Mixer con volumen −6 dB y tres hijos: dos heredan el valor y el tercero lo sobreescribe con −12 dB.',
    caption: 'Una propiedad del padre fluye hacia abajo, salvo que un hijo la sobreescriba.',
    padre: { nombre: 'Actor-Mixer · footsteps', subs: ['Volume −6 dB · Output bus: SFX'] },
    hijos: [
      { nombre: 'footstep_wood', subs: ['hereda · −6 dB'] },
      { nombre: 'footstep_grass', subs: ['hereda · −6 dB'] },
      { nombre: 'footstep_metal', subs: ['override · −12 dB'] },
    ],
  },
  busses: {
    eyebrow: 'Concepto 4 · ¿a dónde va la señal?',
    title: (
      <>
        Un árbol de mezcla <span className={s.accent}>aparte</span>
      </>
    ),
    aria: 'A la izquierda, la Actor-Mixer Hierarchy con un Sound SFX; a la derecha, la Master-Mixer Hierarchy: Master Audio Bus con los busses SFX y Music, un Aux Bus de reverb, el Master Motion Bus y un Secondary Bus. El sonido apunta con una flecha a su único output bus.',
    caption: 'Cada objeto apunta a exactamente un output bus: la señal se mueve, no se copia.',
    jerarquiaContenido: 'ACTOR-MIXER HIERARCHY',
    jerarquiaMixer: 'MASTER-MIXER HIERARCHY',
    actorMixer: { nombre: 'Actor-Mixer · footsteps', subs: [] },
    sonido: { nombre: 'Sound SFX · footstep_wood', subs: ['Output bus: SFX'] },
    unBus: 'un solo output bus',
    seMueve: 'la señal se mueve',
    master: { nombre: 'Master Audio Bus', subs: ['la salida principal'] },
    busSfx: { nombre: 'Audio Bus · SFX', subs: [] },
    busMusic: { nombre: 'Audio Bus · Music', subs: [] },
    auxReverb: { nombre: 'Aux Bus · Reverb', subs: ['destino de sends'] },
    motion: { nombre: 'Master Motion Bus', subs: ['no audible · vibración · hápticos'] },
    secondary: { nombre: 'Secondary Bus', subs: ['otro hardware · parlante del control'] },
  },
  aux: {
    eyebrow: 'Concepto 4 · aux busses',
    title: (
      <>
        El send es <span className={s.accent}>una copia</span>
      </>
    ),
    aria: 'Un Sound SFX manda su señal seca a su Audio Bus y una copia, con nivel de send por objeto, al Aux Bus de reverb; ambos busses desembocan en el Master Audio Bus.',
    caption: 'Bus normal = un destino, sin duplicar · Aux bus = duplicación para efectos compartidos.',
    sonido: { nombre: 'Sound SFX · footstep_wood', subs: ['Output bus: SFX · send: Reverb'] },
    dry: 'dry · se mueve · un destino',
    send: 'send · copia · nivel por objeto',
    busSfx: { nombre: 'Audio Bus · SFX', subs: ['la señal seca'] },
    auxReverb: { nombre: 'Aux Bus · Reverb', subs: ['la copia procesada'] },
    master: { nombre: 'Master Audio Bus', subs: ['dry + wet'] },
  },
  efectos: {
    eyebrow: 'Concepto 5 · ¿qué le pasa a la señal?',
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
    eyebrow: 'Concepto 5 · sharesets',
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
    eyebrow: 'Concepto 6 · ¿quién lo dispara?',
    title: (
      <>
        El juego solo ve <span className={s.accent}>el Event</span>
      </>
    ),
    aria: 'El juego postea por nombre el Event Play_Footstep; adentro, tres Actions: Play sobre el container footsteps, Set Switch de surface y Stop sobre el bus de música. Al lado, un Dialogue Event: un árbol de decisión por State groups.',
    caption: 'El juego nunca ve las Actions: cambiar el comportamiento no toca el código.',
    game: { nombre: 'GAME', subs: ['código'] },
    postea: 'postea por nombre',
    event: 'EVENT · Play_Footstep',
    actions: [
      { nombre: 'Play', subs: ['→ footsteps (container)'] },
      { nombre: 'Set Switch', subs: ['→ surface = grass'] },
      { nombre: 'Stop', subs: ['→ Audio Bus · Music'] },
    ],
    cadaAction: 'cada Action: target · fade · delay · scope',
    dialogue: { nombre: 'DIALOGUE EVENT', subs: ['árbol de decisión', 'varios State groups', '→ un objeto'] },
  },
  gameSyncs: {
    eyebrow: 'Concepto 7 · ¿qué le dice el juego?',
    title: (
      <>
        Game Syncs: valores <span className={s.accent}>desde el código</span>
      </>
    ),
    aria: 'El código del juego setea cuatro tipos de Game Sync —Switch, State, RTPC y Trigger— que luego leen los objects, containers y busses.',
    caption: 'Switch = «qué sonido para este objeto» · State = «cuál es la situación para todos».',
    codigo: { nombre: 'CÓDIGO DEL JUEGO', subs: ['setea los valores'] },
    tipos: [
      { nombre: 'Switch', subs: ['discreto · local', 'un Game Object', 'Enemy A: wood · Enemy B: tile'] },
      { nombre: 'State', subs: ['discreto · global', 'todo el juego a la vez', 'Low Health · con transición'] },
      { nombre: 'RTPC', subs: ['continuo · por curva', 'propiedades de object o bus', 'RPM del auto → pitch'] },
      { nombre: 'Trigger', subs: ['momentáneo', 'una señal puntual', 'stingers de música'] },
    ],
    lectores: 'LEÍDOS POR OBJECTS · CONTAINERS · BUSSES',
  },
  seleccion: {
    eyebrow: 'Concepto 7 · events vs game syncs',
    title: (
      <>
        Los Events dicen cuándo; los Game Syncs, <span className={s.accent}>cómo</span>
      </>
    ),
    aria: 'Dos carriles. Selección: una Action Play toca un Switch Container, que lee el Switch surface = grass y elige el hijo footstep_grass. Modificación: un RTPC de RPM pasa por una curva y altera el pitch del objeto sin ninguna Action.',
    caption: 'Selección: la Action toca, el Switch/State elige · Modificación: el RTPC altera en vivo, sin Action.',
    laneSeleccion: 'SELECCIÓN · Action + Switch / State',
    action: { nombre: 'Action · Play', subs: ['desde un Event'] },
    switchValor: { nombre: 'Switch · surface = grass', subs: [] },
    lee: 'lee',
    container: { nombre: 'Switch Container', subs: ['footsteps'] },
    elige: 'elige',
    hijo: { nombre: 'footstep_grass', subs: ['el hijo correcto'] },
    laneModificacion: 'MODIFICACIÓN · RTPC',
    rtpc: { nombre: 'RTPC · car_rpm', subs: ['4200'] },
    curva: 'curva',
    propiedad: { nombre: 'pitch del objeto', subs: ['o volumen · filtro · efecto'] },
    sinAction: 'sin ninguna Action · en tiempo real',
  },
  packaging: {
    eyebrow: 'Concepto 8 · ¿cómo se entrega?',
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
};

const en: WwiseObjectsTexts = {
  name: 'Wwise Objects',
  context: 'Intro to Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    camino: ['event', 'actions', 'object', 'content', 'bus', 'process', 'output'],
    preguntas: 'seven questions',
    contenido: 'content',
    estructura: 'structure',
    herencia: 'inheritance',
    busses: 'routing',
    aux: 'aux busses',
    efectos: 'effects',
    sharesets: 'sharesets',
    events: 'events',
    gameSyncs: 'game syncs',
    seleccion: 'select vs modify',
    packaging: 'packaging',
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
  camino: {
    eyebrow: 'Concept 1 · the path of one sound',
    title: (
      <>
        Every sound follows <span className={s.accent}>the same path</span>
      </>
    ),
    arias: [
      'The game posts an Event.',
      'The game posts an Event, and the Event executes its Actions.',
      'The game posts an Event, the Event executes its Actions and each Action targets an object: a container or a sound.',
      'The object resolves to actual content, consulting Game Syncs if needed.',
      'The resulting signal is sent to a bus.',
      'Busses apply processing: effects and mixing.',
      'The mix reaches an output device. Everything is packaged into SoundBanks so the game can load it.',
    ],
    captions: [
      'The game does one thing only: post an Event.',
      'The Event makes no sound: it executes Actions.',
      'Each Action targets an object: a container or a sound.',
      'The object resolves to content, consulting Game Syncs if needed.',
      'The resulting signal is sent to a bus.',
      'Busses process: effects and mixing.',
      'The mix leaves through the device · everything ships packaged in SoundBanks.',
    ],
    game: 'GAME',
    postea: 'posts',
    event: 'EVENT',
    ejecuta: 'executes',
    actions: 'ACTIONS',
    apunta: 'targets',
    object: 'OBJECT',
    objectSub: 'container or sound',
    resuelve: 'resolves to',
    contenido: 'CONTENT',
    contenidoSub: 'actual audio',
    gameSyncs: 'GAME SYNCS',
    gameSyncsSub: 'Switch · State · RTPC',
    consulta: 'consults',
    envia: 'sent to',
    bus: 'BUS',
    procesa: 'PROCESS',
    procesaSub: 'effects · mixing',
    llega: 'reaches',
    salida: 'OUTPUT',
    soundBank: 'SOUNDBANKS · everything packaged so the game can load it',
  },
  preguntas: {
    eyebrow: 'Concept 1 · the map',
    title: (
      <>
        Each object answers <span className={s.accent}>one question</span>
      </>
    ),
    aria: 'Seven object families, each with its question: content (what plays?), structure (how is it chosen or combined?), routing (where does the signal go?), processing (what happens to the signal?), triggers (who tells it to happen?), game input (what does the game tell Wwise?) and packaging (how does it ship?).',
    caption: 'Seven questions along the path · the rest of the class walks through them.',
    familias: [
      { nombre: 'CONTENT', subs: ['what plays?'] },
      { nombre: 'STRUCTURE', subs: ['how is it chosen or combined?'] },
      { nombre: 'ROUTING', subs: ['where does the signal go?'] },
      { nombre: 'PROCESSING', subs: ['what happens to the signal?'] },
      { nombre: 'TRIGGERS', subs: ['who tells it to happen?'] },
      { nombre: 'GAME INPUT', subs: ['what does the game say?'] },
      { nombre: 'PACKAGING', subs: ['how does it ship?'] },
    ],
  },
  contenido: {
    eyebrow: 'Concept 2 · what plays?',
    title: (
      <>
        The only ones that point to <span className={s.accent}>actual audio</span>
      </>
    ),
    aria: 'Five content objects —Sound SFX, Sound Voice, Music Track, Music Segment and plug-in sources— point down to the audio data.',
    caption: 'Everything else exists to decide whether, when, which and how these play.',
    objetos: [
      { nombre: 'Sound SFX', subs: ['one or more sources', 'the workhorse'] },
      { nombre: 'Sound Voice', subs: ['like SFX, but', 'one source per language'] },
      { nombre: 'Music Track', subs: ['audio in the music system', 'sub-tracks and clips'] },
      { nombre: 'Music Segment', subs: ['timeline holding tracks', 'cues · tempo · meter'] },
      { nombre: 'Plug-in sources', subs: ['generated content', 'Wwise Synth · tone gen'] },
    ],
    audioData: 'AUDIO DATA · wav · synthesis',
  },
  estructura: {
    eyebrow: 'Concept 3 · how is it chosen or combined?',
    title: (
      <>
        Containers: children + <span className={s.accent}>one rule</span>
      </>
    ),
    aria: 'Eight structural objects, each with its question: Actor-Mixer (no rule), Random (which one?), Sequence (in what order?), Switch (based on what the game says?), Blend (how much of each?), Music Playlist, Music Switch and Folders.',
    caption: 'None of them produce audio: they own children and decide how they play.',
    contenedores: [
      { nombre: 'Actor-Mixer', subs: ['no rule', 'groups · shares properties'] },
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
    eyebrow: 'Concept 3 · inheritance',
    title: (
      <>
        The parent's values <span className={s.accent}>flow down</span>
      </>
    ),
    aria: 'An Actor-Mixer with volume −6 dB and three children: two inherit the value and the third overrides it with −12 dB.',
    caption: 'A property set on the parent flows down, unless a child overrides it.',
    padre: { nombre: 'Actor-Mixer · footsteps', subs: ['Volume −6 dB · Output bus: SFX'] },
    hijos: [
      { nombre: 'footstep_wood', subs: ['inherits · −6 dB'] },
      { nombre: 'footstep_grass', subs: ['inherits · −6 dB'] },
      { nombre: 'footstep_metal', subs: ['override · −12 dB'] },
    ],
  },
  busses: {
    eyebrow: 'Concept 4 · where does the signal go?',
    title: (
      <>
        A <span className={s.accent}>separate</span> mixer tree
      </>
    ),
    aria: 'On the left, the Actor-Mixer Hierarchy with a Sound SFX; on the right, the Master-Mixer Hierarchy: Master Audio Bus with the SFX and Music busses, a reverb Aux Bus, the Master Motion Bus and a Secondary Bus. The sound points with an arrow to its single output bus.',
    caption: 'Every object points to exactly one output bus: the signal is moved, not copied.',
    jerarquiaContenido: 'ACTOR-MIXER HIERARCHY',
    jerarquiaMixer: 'MASTER-MIXER HIERARCHY',
    actorMixer: { nombre: 'Actor-Mixer · footsteps', subs: [] },
    sonido: { nombre: 'Sound SFX · footstep_wood', subs: ['Output bus: SFX'] },
    unBus: 'a single output bus',
    seMueve: 'the signal is moved',
    master: { nombre: 'Master Audio Bus', subs: ['the main output'] },
    busSfx: { nombre: 'Audio Bus · SFX', subs: [] },
    busMusic: { nombre: 'Audio Bus · Music', subs: [] },
    auxReverb: { nombre: 'Aux Bus · Reverb', subs: ['send destination'] },
    motion: { nombre: 'Master Motion Bus', subs: ['not audible · rumble · haptics'] },
    secondary: { nombre: 'Secondary Bus', subs: ['other hardware · controller speaker'] },
  },
  aux: {
    eyebrow: 'Concept 4 · aux busses',
    title: (
      <>
        A send is <span className={s.accent}>a copy</span>
      </>
    ),
    aria: 'A Sound SFX sends its dry signal to its Audio Bus and a copy, at a per-object send level, to the reverb Aux Bus; both busses flow into the Master Audio Bus.',
    caption: 'Regular bus = one destination, no duplication · Aux bus = duplication for shared effects.',
    sonido: { nombre: 'Sound SFX · footstep_wood', subs: ['Output bus: SFX · send: Reverb'] },
    dry: 'dry · moved · one destination',
    send: 'send · copy · per-object level',
    busSfx: { nombre: 'Audio Bus · SFX', subs: ['the dry signal'] },
    auxReverb: { nombre: 'Aux Bus · Reverb', subs: ['the processed copy'] },
    master: { nombre: 'Master Audio Bus', subs: ['dry + wet'] },
  },
  efectos: {
    eyebrow: 'Concept 5 · what happens to the signal?',
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
    eyebrow: 'Concept 5 · sharesets',
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
    eyebrow: 'Concept 6 · who tells it to happen?',
    title: (
      <>
        The game only sees <span className={s.accent}>the Event</span>
      </>
    ),
    aria: 'The game posts the Event Play_Footstep by name; inside, three Actions: Play on the footsteps container, Set Switch for surface and Stop on the music bus. Beside it, a Dialogue Event: a decision tree by State groups.',
    caption: 'The game never sees the Actions: changing behavior does not touch the code.',
    game: { nombre: 'GAME', subs: ['code'] },
    postea: 'posts by name',
    event: 'EVENT · Play_Footstep',
    actions: [
      { nombre: 'Play', subs: ['→ footsteps (container)'] },
      { nombre: 'Set Switch', subs: ['→ surface = grass'] },
      { nombre: 'Stop', subs: ['→ Audio Bus · Music'] },
    ],
    cadaAction: 'each Action: target · fade · delay · scope',
    dialogue: { nombre: 'DIALOGUE EVENT', subs: ['decision tree', 'several State groups', '→ one object'] },
  },
  gameSyncs: {
    eyebrow: 'Concept 7 · what does the game say?',
    title: (
      <>
        Game Syncs: values <span className={s.accent}>from the code</span>
      </>
    ),
    aria: 'The game code sets four kinds of Game Sync —Switch, State, RTPC and Trigger— that objects, containers and busses then read.',
    caption: 'Switch = "which sound for this object" · State = "what is the situation for everything".',
    codigo: { nombre: 'GAME CODE', subs: ['sets the values'] },
    tipos: [
      { nombre: 'Switch', subs: ['discrete · local', 'one Game Object', 'Enemy A: wood · Enemy B: tile'] },
      { nombre: 'State', subs: ['discrete · global', 'the whole game at once', 'Low Health · with transition'] },
      { nombre: 'RTPC', subs: ['continuous · via curve', 'object or bus properties', 'car RPM → pitch'] },
      { nombre: 'Trigger', subs: ['momentary', 'a one-shot signal', 'music stingers'] },
    ],
    lectores: 'READ BY OBJECTS · CONTAINERS · BUSSES',
  },
  seleccion: {
    eyebrow: 'Concept 7 · events vs game syncs',
    title: (
      <>
        Events say when; Game Syncs say <span className={s.accent}>how</span>
      </>
    ),
    aria: 'Two lanes. Selection: a Play Action plays a Switch Container, which reads the Switch surface = grass and picks the child footstep_grass. Modification: an RPM RTPC goes through a curve and alters the object pitch without any Action.',
    caption: 'Selection: the Action plays, the Switch/State picks · Modification: the RTPC alters live, with no Action.',
    laneSeleccion: 'SELECTION · Action + Switch / State',
    action: { nombre: 'Action · Play', subs: ['from an Event'] },
    switchValor: { nombre: 'Switch · surface = grass', subs: [] },
    lee: 'reads',
    container: { nombre: 'Switch Container', subs: ['footsteps'] },
    elige: 'picks',
    hijo: { nombre: 'footstep_grass', subs: ['the right child'] },
    laneModificacion: 'MODIFICATION · RTPC',
    rtpc: { nombre: 'RTPC · car_rpm', subs: ['4200'] },
    curva: 'curve',
    propiedad: { nombre: 'object pitch', subs: ['or volume · filter · effect'] },
    sinAction: 'without any Action · in real time',
  },
  packaging: {
    eyebrow: 'Concept 8 · how does it ship?',
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
};

export const wwiseObjectsDict = { es, en };
