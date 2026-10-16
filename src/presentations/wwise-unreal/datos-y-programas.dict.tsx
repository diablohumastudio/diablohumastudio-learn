import type { ReactNode } from 'react';
import s from '../../components/learn/Deck.module.css';

/* Texts of the deck, one object per language. `es` is the source; keep the `en`
   phrases about the same length (±15 %) so the SVG labels stay in their boxes. */

export type IdeasTexts = {
  eyebrow: string;
  aria: string;
  /** One box per idea, in the order the class visits them. */
  items: [string, string];
  /** Short forms for the corner scheme of the following slides. */
  cortos: [string, string];
};

export type DatoTexts = {
  title: ReactNode;
  aria: string;
  /** Lines of the text card, pre-wrapped so they fit it. */
  textoLineas: string[];
  texto: string;
  imagen: string;
  sonido: string;
};

export type RotulosBibliotecaTexts = {
  estanterias: string;
  todasLasMaterias: string;
  levantarse: string;
  laMesa: string;
  alcanzar: string;
  librosAbiertos: string;
  materiaActual: string;
  leer: string;
};

export type RotulosComputadorTexts = {
  discoDuro: string;
  todosLosDatos: string;
  cargar: string;
  ram: string;
  traer: string;
  cache: string;
  loQueUsas: string;
  leerCache: string;
  cpu: string;
  cargando: string;
};

export type FotoChipTexts = { nucleo: string; cache: string; credito: string };

export type BibliotecaTexts = {
  /** Kicker of each step: the rule of the library, then the rule of the computer. */
  eyebrows: [string, string];
  title: ReactNode;
  arias: [string, string];
  caption: string;
  notes: string;
  biblioteca: RotulosBibliotecaTexts;
  computador: RotulosComputadorTexts;
  fotoChip: FotoChipTexts;
  creditoFotoDisco: string;
};

/** `credito` has two lines so it stays narrower than the screenshot. */
export type EjemploPrograma = { nombre: string; credito: [string, string] };

export type ProgramaTexts = {
  title: ReactNode;
  aria: string;
  notes: string;
  archivo: string;
  codigo: string[];
  programador: string;
  conversor: string;
  conversorSub: string;
  instrucciones: string;
  listaInstrucciones: string[];
  pc: string;
  ejemplos: [EjemploPrograma, EjemploPrograma, EjemploPrograma];
};

/** `explicacion` is pre-wrapped: one entry per line of the explanation box. */
export type NivelDeLenguaje = { titulo: string; explicacion: string[] };

export type LenguajesTexts = {
  eyebrow: string;
  title: ReactNode;
  aria: string;
  caption: string;
  masCercaHumano: string;
  masFacil: string;
  masCercaMaquina: string;
  masRapido: string;
  masAbstracto: string;
  menosAbstracto: string;
  tuEscribes: [string, string];
  laCpuLee: string;
  niveles: [NivelDeLenguaje, NivelDeLenguaje, NivelDeLenguaje, NivelDeLenguaje];
};

export type IdeaDeCierre = { clave: string; texto: string };

export type CierreTexts = {
  title: ReactNode;
  ideas: [IdeaDeCierre, IdeaDeCierre];
};

export type DatosYProgramasTexts = {
  name: string;
  context: string;
  labels: {
    intro: string;
    ideas: string;
    datos: string;
    dato: string;
    biblioteca: string;
    computador: string;
    programa: string;
    lenguajes: string;
    cierre: string;
  };
  cover: { eyebrow: string; title: ReactNode; hint: string };
  ideas: IdeasTexts;
  dato: DatoTexts;
  biblioteca: BibliotecaTexts;
  programa: ProgramaTexts;
  lenguajes: LenguajesTexts;
  cierre: CierreTexts;
};

const es: DatosYProgramasTexts = {
  name: 'Datos y programas',
  context: 'Intro a Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    ideas: 'dos ideas',
    datos: 'los datos',
    dato: 'qué es un dato',
    biblioteca: 'biblioteca',
    computador: 'computador',
    programa: 'qué es un programa',
    lenguajes: 'lenguajes',
    cierre: 'cierre',
  },
  cover: {
    eyebrow: 'Intro a Wwise · Bases Teóricas',
    title: (
      <>
        Datos y <span className={s.accent}>programas</span>
      </>
    ),
    hint: 'Navega con ← → · espacio',
  },
  ideas: {
    eyebrow: 'Dos ideas introductorias',
    aria: 'Dos recuadros en fila con las dos ideas de la clase: los datos dentro del computador y qué es un programa.',
    items: ['Los datos dentro del computador', 'Qué es un programa'],
    cortos: ['datos', 'programa'],
  },
  dato: {
    title: (
      <>
        Un dato es <span className={s.accent}>información guardada</span>
      </>
    ),
    aria: 'Tres tarjetas con un ejemplo de dato cada una: un texto de unas líneas, una imagen y la forma de onda de un sonido.',
    textoLineas: ['Querido estudiante:', 'este párrafo también', 'es un dato: unas letras', 'guardadas en el disco.'],
    texto: 'un texto',
    imagen: 'una imagen',
    sonido: 'un sonido',
  },
  biblioteca: {
    eyebrows: ['Para trabajar los libros tienen que llegar a tus manos', 'Los datos tienen que llegar a la CPU para usarse'],
    title: (
      <>
        Analogía de un PC a una <span className={s.accent}>biblioteca</span>
      </>
    ),
    arias: [
      'Una biblioteca vista desde arriba: arriba, tres estanterías con todas las materias; abajo, dos mesas laterales con libros cerrados y, en el centro, una mesa con cuatro personas leyendo libros abiertos. Levantarse a las estanterías es lento, alcanzar las mesas laterales es rápido y leer el libro abierto es instantáneo.',
      'La misma escena con las piezas de un computador: las estanterías se vuelven discos duros, las mesas laterales se vuelven módulos de memoria RAM y la mesa central se vuelve una CPU de cuatro núcleos con su caché. Cargar del disco es lento, traer de RAM es rápido y leer la caché es instantáneo. Por un momento se muestran la foto del chip de un procesador, con un núcleo y la memoria caché señalados, y la foto de un disco duro con sus cables; al final una flecha «cargando» va del disco a la RAM.',
    ],
    caption: 'Mientras más cerca está la información, más rápido se procesa cuando se necesita.',
    notes:
      'Cuanto más cerca del procesador está el lugar donde reside la información que necesita una tarea, más rápido se puede empezar a trabajar en ella; a cambio, ese lugar es más pequeño.\n\nLas estanterías son el disco duro: cabe todo, pero ir a buscarlo es lento. Las mesas laterales son la memoria RAM: cabe menos, pero está al alcance de la mano. Los libros abiertos frente a cada persona son la caché de la CPU: cabe muy poco, pero se lee al instante.\n\nLa caché vive dentro del chip del procesador. La RAM va en módulos aparte, unidos a la CPU por pistas cortas de la mainboard. El disco se conecta con cables o con pistas largas, y por eso es el más lento de los tres. Cuando un programa dice «cargando», son datos copiándose del disco a la RAM.\n\nFotos: chip del Intel Core i9-13900K, por Fritzchens Fritz (CC0, Wikimedia Commons); disco duro con sus cables SATA, por Thomas Rosenau (CC BY-SA 2.5, Wikimedia Commons).',
    biblioteca: {
      estanterias: 'ESTANTERÍAS',
      todasLasMaterias: 'todas las materias',
      levantarse: 'levantarse · lento',
      laMesa: 'LA MESA',
      alcanzar: 'alcanzar · rápido',
      librosAbiertos: 'LIBROS ABIERTOS',
      materiaActual: 'la materia actual',
      leer: 'leer · al instante',
    },
    computador: {
      discoDuro: 'DISCO DURO',
      todosLosDatos: 'todos los datos',
      cargar: 'cargar del disco · lento',
      ram: 'MEMORIA RAM',
      traer: 'traer de RAM · rápido',
      cache: 'CACHÉ',
      loQueUsas: 'lo que usas ya mismo',
      leerCache: 'leer la caché · al instante',
      cpu: 'CPU',
      cargando: 'cargando…',
    },
    fotoChip: { nucleo: 'núcleo', cache: 'memoria caché', credito: 'Intel Core i9-13900K · foto: Fritzchens Fritz · CC0' },
    creditoFotoDisco: 'foto: Thomas Rosenau · CC BY-SA 2.5',
  },
  programa: {
    title: (
      <>
        Qué es un <span className={s.accent}>programa</span>
      </>
    ),
    aria: 'Arriba, un archivo de código escrito por un programador pasa por un compilador o intérprete y se convierte en una lista de instrucciones con sus unos y ceros, que ejecuta el PC. Abajo, tres programas de ejemplo: Word, un juego y Excel.',
    notes:
      'Un programa es código escrito por un programador que un compilador o un intérprete convierte en instrucciones de unos y ceros; el procesador solo ejecuta esas instrucciones. Word, un juego y Excel son programas.\n\nCapturas: Microsoft Word y Microsoft Excel, used with permission from Microsoft. Abyss Odyssey, captura publicada por ACE Team (CC BY-SA 3.0, Wikimedia Commons); es un juego hecho con Unreal Engine.',
    archivo: 'archivo de código',
    codigo: ['if (health < 1) {', '    die();', '}'],
    programador: 'un programador',
    conversor: 'COMPILADOR / INTÉRPRETE',
    conversorSub: 'convierte el código',
    instrucciones: 'instrucciones',
    listaInstrucciones: ['CMP  (0011 1001)', 'JGE  (0111 1101)', 'CALL (1110 1000)'],
    pc: 'el PC',
    ejemplos: [
      { nombre: 'Word', credito: ['Microsoft Word', 'Used with permission from Microsoft.'] },
      { nombre: 'un juego', credito: ['Abyss Odyssey · ACE Team', 'CC BY-SA 3.0'] },
      { nombre: 'Excel', credito: ['Microsoft Excel', 'Used with permission from Microsoft.'] },
    ],
  },
  lenguajes: {
    eyebrow: 'Los niveles de abstracción de los lenguajes de programación',
    title: (
      <>
        Más abstracto significa <span className={s.accent}>menos detalle</span>
      </>
    ),
    aria: 'Cuatro niveles de lenguaje apilados de arriba hacia abajo, del más abstracto al menos abstracto: Python, JavaScript, Wwise Objects y Blueprints; C++ y Rust; ensamblador; y código máquina en unos y ceros, el único que la CPU entiende. A la derecha, un cuadro explica cada nivel por turnos. En Wwise y Blueprints de Unreal tú escribes arriba; la CPU lee abajo.',
    caption: 'Mientras más abstracto es un lenguaje, menos detalle tienes que escribir y más fácil es de entender.',
    masCercaHumano: 'MÁS CERCA DEL HUMANO',
    masFacil: 'más fácil para ti',
    masCercaMaquina: 'MÁS CERCA DE LA MÁQUINA',
    masRapido: 'más rápido para la CPU',
    masAbstracto: 'MÁS ABSTRACTO',
    menosAbstracto: 'MENOS ABSTRACTO',
    tuEscribes: ['En Wwise y Blueprints', 'de Unreal, tú escribes aquí'],
    laCpuLee: 'la CPU lee aquí',
    niveles: [
      { titulo: 'PYTHON / JAVASCRIPT / WWISE OBJECTS / BLUEPRINTS', explicacion: ['se lee casi como inglés', 'la memoria la maneja', 'el lenguaje por ti'] },
      {
        titulo: 'C++ / RUST',
        explicacion: ['control total del hardware', 'y la memoria: *, free, malloc', 'por lo general se compila', 'antes de correr'],
      },
      { titulo: 'ENSAMBLADOR (ASSEMBLY)', explicacion: ['instrucciones directas al', 'procesador: MOV, ADD, SUB', 'difícil de leer para un humano'] },
      { titulo: 'CÓDIGO MÁQUINA · 1s y 0s', explicacion: ['pulsos eléctricos:', '1 = encendido · 0 = apagado', 'el único lenguaje', 'que la CPU entiende'] },
    ],
  },
  cierre: {
    title: (
      <>
        Dos ideas <span className={s.accent}>para llevarse</span>
      </>
    ),
    ideas: [
      { clave: 'Datos:', texto: 'del disco a la RAM, y de ahí al procesador.' },
      { clave: 'Programa:', texto: 'código escrito por un programador que se convierte en instrucciones (1s y 0s) que ejecuta el procesador.' },
    ],
  },
};

const en: DatosYProgramasTexts = {
  name: 'Data and programs',
  context: 'Intro to Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    ideas: 'two ideas',
    datos: 'the data',
    dato: 'what data is',
    biblioteca: 'library',
    computador: 'computer',
    programa: 'what a program is',
    lenguajes: 'languages',
    cierre: 'wrap-up',
  },
  cover: {
    eyebrow: 'Intro to Wwise · Theory Basics',
    title: (
      <>
        Data and <span className={s.accent}>programs</span>
      </>
    ),
    hint: 'Navigate with ← → · space',
  },
  ideas: {
    eyebrow: 'Two introductory ideas',
    aria: 'Two boxes in a row with the two ideas of the class: the data inside the computer and what a program is.',
    items: ['The data inside the computer', 'What a program is'],
    cortos: ['data', 'program'],
  },
  dato: {
    title: (
      <>
        Data is <span className={s.accent}>stored information</span>
      </>
    ),
    aria: 'Three cards with one example of data each: a text of a few lines, a picture and the waveform of a sound.',
    textoLineas: ['Dear student:', 'this paragraph is also', 'data: a few letters', 'stored on the disk.'],
    texto: 'a text',
    imagen: 'a picture',
    sonido: 'a sound',
  },
  biblioteca: {
    eyebrows: ['To work, the books have to reach your hands', 'Data has to reach the CPU to be used'],
    title: (
      <>
        Analogy of a PC to a <span className={s.accent}>library</span>
      </>
    ),
    arias: [
      'A library seen from above: on top, three shelves with every subject; below, two side tables with closed books and, in the middle, a table with four people reading open books. Getting up to the shelves is slow, reaching the side tables is fast and reading the open book is instant.',
      'The same scene with the parts of a computer: the shelves become hard disks, the side tables become RAM memory modules and the central table becomes a four-core CPU with its cache. Loading from disk is slow, fetching from RAM is fast and reading the cache is instant. For a moment the photo of a processor chip, with one core and the cache memory pointed out, and the photo of a hard disk with its cables are shown; at the end a "loading" arrow goes from the disk to the RAM.',
    ],
    caption: 'The closer the information is, the faster it gets processed when it is needed.',
    notes:
      'The closer to the processor the place where the information a task needs lives, the sooner that task can start; in exchange, that place is smaller.\n\nThe shelves are the hard disk: everything fits, but going to get it is slow. The side tables are the RAM memory: less fits, but it is within reach. The open books in front of each person are the CPU cache: very little fits, but it is read instantly.\n\nThe cache lives inside the processor chip. RAM comes in separate modules, joined to the CPU by short traces on the mainboard. The disk connects through cables or long traces, which is why it is the slowest of the three. When a program says "loading", data is being copied from the disk to the RAM.\n\nPhotos: Intel Core i9-13900K chip, by Fritzchens Fritz (CC0, Wikimedia Commons); hard disk with its SATA cables, by Thomas Rosenau (CC BY-SA 2.5, Wikimedia Commons).',
    biblioteca: {
      estanterias: 'SHELVES',
      todasLasMaterias: 'every subject',
      levantarse: 'get up · slow',
      laMesa: 'THE TABLE',
      alcanzar: 'reach · fast',
      librosAbiertos: 'OPEN BOOKS',
      materiaActual: 'the current subject',
      leer: 'read · instant',
    },
    computador: {
      discoDuro: 'HARD DISK',
      todosLosDatos: 'all the data',
      cargar: 'load from disk · slow',
      ram: 'RAM MEMORY',
      traer: 'fetch from RAM · fast',
      cache: 'CACHE',
      loQueUsas: 'what you use right now',
      leerCache: 'read the cache · instant',
      cpu: 'CPU',
      cargando: 'loading…',
    },
    fotoChip: { nucleo: 'core', cache: 'cache memory', credito: 'Intel Core i9-13900K · photo: Fritzchens Fritz · CC0' },
    creditoFotoDisco: 'photo: Thomas Rosenau · CC BY-SA 2.5',
  },
  programa: {
    title: (
      <>
        What a <span className={s.accent}>program</span> is
      </>
    ),
    aria: 'On top, a code file written by a programmer goes through a compiler or interpreter and becomes a list of instructions with their ones and zeros, which the PC runs. Below, three example programs: Word, a game and Excel.',
    notes:
      'A program is code written by a programmer that a compiler or an interpreter turns into instructions of ones and zeros; the processor only runs those instructions. Word, a game and Excel are programs.\n\nScreenshots: Microsoft Word and Microsoft Excel, used with permission from Microsoft. Abyss Odyssey, screenshot published by ACE Team (CC BY-SA 3.0, Wikimedia Commons); it is a game made with Unreal Engine.',
    archivo: 'code file',
    codigo: ['if (health < 1) {', '    die();', '}'],
    programador: 'a programmer',
    conversor: 'COMPILER / INTERPRETER',
    conversorSub: 'converts the code',
    instrucciones: 'instructions',
    listaInstrucciones: ['CMP  (0011 1001)', 'JGE  (0111 1101)', 'CALL (1110 1000)'],
    pc: 'the PC',
    ejemplos: [
      { nombre: 'Word', credito: ['Microsoft Word', 'Used with permission from Microsoft.'] },
      { nombre: 'a game', credito: ['Abyss Odyssey · ACE Team', 'CC BY-SA 3.0'] },
      { nombre: 'Excel', credito: ['Microsoft Excel', 'Used with permission from Microsoft.'] },
    ],
  },
  lenguajes: {
    eyebrow: 'The abstraction levels of programming languages',
    title: (
      <>
        More abstract means <span className={s.accent}>less detail</span>
      </>
    ),
    aria: 'Four language levels stacked top to bottom, from the most abstract to the least abstract: Python, JavaScript, Wwise Objects and Blueprints; C++ and Rust; assembly; and machine code in ones and zeros, the only one the CPU understands. On the right, a box explains each level in turn. In Wwise and Unreal Blueprints you write at the top; the CPU reads at the bottom.',
    caption: 'The more abstract a language is, the less detail you have to write and the easier it is to understand.',
    masCercaHumano: 'CLOSER TO THE HUMAN',
    masFacil: 'easier for you',
    masCercaMaquina: 'CLOSER TO THE MACHINE',
    masRapido: 'faster for the CPU',
    masAbstracto: 'MORE ABSTRACT',
    menosAbstracto: 'LESS ABSTRACT',
    tuEscribes: ['In Wwise and Unreal', 'Blueprints, you write here'],
    laCpuLee: 'the CPU reads here',
    niveles: [
      { titulo: 'PYTHON / JAVASCRIPT / WWISE OBJECTS / BLUEPRINTS', explicacion: ['reads almost like English', 'the language manages', 'memory for you'] },
      {
        titulo: 'C++ / RUST',
        explicacion: ['full control of the hardware', 'and memory: *, free, malloc', 'usually compiled', 'before it runs'],
      },
      { titulo: 'ASSEMBLY', explicacion: ['direct instructions to the', 'processor: MOV, ADD, SUB', 'hard for a human to read'] },
      { titulo: 'MACHINE CODE · 1s and 0s', explicacion: ['electric pulses:', '1 = on · 0 = off', 'the only language', 'the CPU understands'] },
    ],
  },
  cierre: {
    title: (
      <>
        Two ideas <span className={s.accent}>to take away</span>
      </>
    ),
    ideas: [
      { clave: 'Data:', texto: 'from the disk to the RAM, and from there to the processor.' },
      { clave: 'Program:', texto: 'code written by a programmer that becomes instructions (1s and 0s) that the processor runs.' },
    ],
  },
};

export const datosYProgramasDict = { es, en };
