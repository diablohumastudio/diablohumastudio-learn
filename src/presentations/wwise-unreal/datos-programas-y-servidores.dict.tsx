import type { ReactNode } from 'react';
import s from '../../components/learn/Deck.module.css';

/* Texts of the deck, one object per language. `es` is the source; keep the `en`
   phrases about the same length (±15 %) so the SVG labels stay in their boxes. */

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
};

export type RotulosRestauranteTexts = {
  ingredientes: string;
  laDespensa: string;
  tu: string;
  enLaMesa: string;
  cocina: string;
  hayIngredientes: string;
  siSeCocina: string;
  pides: string;
  aTuMedida: string;
  teTrae: string;
  oNoHay: string;
};

export type RotulosClienteServidorTexts = {
  recursos: string;
  datosPermisos: string;
  pcCliente: string;
  quienPide: string;
  pcServidor: string;
  tienesAcceso: string;
  siArma: string;
  peticion: string;
  loQueQuieres: string;
  respuesta: string;
  oError: string;
};

export type EscenaArranqueTexts = {
  celular: string;
  disco: string;
  elJuego: string;
  escenaMainEngine: string;
  soundEngine: string;
  ram: string;
  gameEngineRam: string;
  escenaMainRam: string;
  soundEngineRam: string;
  libre: string;
  paso1: string;
  paso2: string;
  paso3: string;
};

export type NivelDeLenguaje = { titulo: string; lineas: [string, string] };

type DatosTexts = {
  name: string;
  context: string;
  labels: {
    intro: string;
    biblioteca: string;
    computador: string;
    lenguajes: string;
    restaurante: string;
    clienteServidor: string;
    servidores: string;
    hardware: string;
    arranque: string;
    pide: string;
    busca: string;
    sube: string;
  };
  cover: { eyebrow: string; title: ReactNode; hint: string };
  biblioteca: { eyebrow: string; title: ReactNode; aria: string; caption: string; rotulos: RotulosBibliotecaTexts };
  computador: { eyebrow: string; title: ReactNode; aria: string; caption: string; rotulos: RotulosComputadorTexts };
  lenguajes: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    masCercaHumano: string;
    masFacil: string;
    masCercaMaquina: string;
    masRapido: string;
    tuEscribes: string;
    laCpuLee: string;
    niveles: [NivelDeLenguaje, NivelDeLenguaje, NivelDeLenguaje, NivelDeLenguaje];
  };
  restaurante: { eyebrow: string; title: ReactNode; aria: string; caption: string; rotulos: RotulosRestauranteTexts };
  clienteServidor: { eyebrow: string; title: ReactNode; aria: string; caption: string; rotulos: RotulosClienteServidorTexts };
  servidores: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    filas: [FilaServidor, FilaServidor, FilaServidor];
  };
  hardware: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    computadoraServidor: string;
    cpu: string;
    ram: string;
    disco: string;
    tarjetaRed: string;
    conectada: string;
    fuente: string;
    encendida: string;
    peticiones: string;
    respuestas: string;
    tarjetaGrafica: string;
    noHaceFalta: string;
    nadieMira: string;
  };
  arranque: {
    eyebrow: string;
    title: ReactNode;
    arias: [string, string, string, string];
    captions: [string, string, string, string];
    escena: EscenaArranqueTexts;
  };
};

export type FilaServidor = { servidor: string; pides: string; sirve: string };

const es: DatosTexts = {
  name: 'Datos, programas y servidores',
  context: 'Intro a Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    biblioteca: 'biblioteca',
    computador: 'computador',
    lenguajes: 'lenguajes',
    restaurante: 'restaurante',
    clienteServidor: 'cliente-servidor',
    servidores: 'servidores',
    hardware: 'hardware',
    arranque: 'arranque',
    pide: 'pide',
    busca: 'busca',
    sube: 'sube',
  },
  cover: {
    eyebrow: 'Intro a Wwise · del disco al servidor',
    title: (
      <>
        Datos, programas
        <br />
        y <span className={s.accent}>servidores</span>
      </>
    ),
    hint: 'Navega con ← → · espacio',
  },
  biblioteca: {
    eyebrow: 'Concepto 1 · la biblioteca',
    title: (
      <>
        Para trabajar, los datos tienen que <span className={s.accent}>llegar a tus manos</span>
      </>
    ),
    aria: 'Una biblioteca vista desde arriba: las estanterías guardan todas las materias; en la mesa hay libros a medio leer con separadores; en el centro, dos personas leen los libros abiertos de la materia actual. Levantarse a las estanterías es lento, alcanzar otra esquina de la mesa es rápido y leer el libro abierto es instantáneo.',
    caption: 'Cuanto más cerca de las manos, más rápido — y menos cabe.',
    rotulos: {
      estanterias: 'ESTANTERÍAS',
      todasLasMaterias: 'todas las materias',
      levantarse: 'levantarse · lento',
      laMesa: 'LA MESA',
      alcanzar: 'alcanzar · rápido',
      librosAbiertos: 'LIBROS ABIERTOS',
      materiaActual: 'la materia actual',
      leer: 'leer · al instante',
    },
  },
  computador: {
    eyebrow: 'Concepto 1 · el computador',
    title: (
      <>
        La biblioteca <span className={s.accent}>es tu computador</span>
      </>
    ),
    aria: 'El mismo diagrama de la biblioteca con nombres de hardware: las estanterías son el disco duro, la mesa es la memoria RAM, los libros abiertos son la caché y las dos personas son los CPU.',
    caption: 'Mismo lugar, otros nombres: disco, RAM y caché son distancias hasta tus manos.',
    rotulos: {
      discoDuro: 'DISCO DURO',
      todosLosDatos: 'todos los datos',
      cargar: 'cargar del disco · lento',
      ram: 'MEMORIA RAM',
      traer: 'traer de RAM · rápido',
      cache: 'CACHÉ',
      loQueUsas: 'lo que usas ya mismo',
      leerCache: 'leer la caché · al instante',
      cpu: 'CPU',
    },
  },
  lenguajes: {
    eyebrow: 'Concepto 2 · los lenguajes',
    title: (
      <>
        La CPU solo entiende <span className={s.accent}>unos y ceros</span>
      </>
    ),
    aria: 'Cuatro niveles de lenguaje apilados de arriba hacia abajo, del más cercano al humano al más cercano a la máquina: Python y JavaScript (se leen casi como inglés y el lenguaje maneja la memoria por ti), C++ y Rust (control total del hardware y la memoria, se compilan antes de correr), ensamblador (instrucciones directas al procesador, difícil de leer para un humano) y código máquina en unos y ceros (el único lenguaje que la CPU entiende: pulsos eléctricos, 1 encendido y 0 apagado). Tú escribes en el nivel de arriba; la CPU lee el de abajo.',
    caption: 'Cuanto más arriba, más fácil para ti; cuanto más abajo, más rápido para la CPU.',
    masCercaHumano: 'MÁS CERCA DEL HUMANO',
    masFacil: 'más fácil para ti',
    masCercaMaquina: 'MÁS CERCA DE LA MÁQUINA',
    masRapido: 'más rápido para la CPU',
    tuEscribes: 'tú escribes aquí',
    laCpuLee: 'la CPU lee aquí',
    niveles: [
      { titulo: 'PYTHON / JAVASCRIPT', lineas: ['se lee casi como inglés', 'la memoria la maneja el lenguaje por ti'] },
      { titulo: 'C++ / RUST', lineas: ['control total del hardware y la memoria', 'se compila antes de correr'] },
      { titulo: 'ENSAMBLADOR (ASSEMBLY)', lineas: ['instrucciones directas al procesador', 'difícil de leer para un humano'] },
      { titulo: 'CÓDIGO MÁQUINA · 1s y 0s', lineas: ['el único lenguaje que la CPU entiende', 'pulsos eléctricos: 1 = encendido · 0 = apagado'] },
    ],
  },
  restaurante: {
    eyebrow: 'Concepto 3 · el restaurante',
    title: (
      <>
        Un servidor es un programa que <span className={s.accent}>atiende peticiones</span>
      </>
    ),
    aria: 'Un restaurante visto como flujo: tú en la mesa pides la hamburguesa al camarero, la petición llega a la cocina, la cocina verifica si hay ingredientes, y el camarero te trae la hamburguesa o la noticia de que no hay. La despensa de ingredientes alimenta a la cocina desde arriba.',
    caption: 'Recibir el pedido, verificar que se puede, prepararlo y devolverlo: eso hace un servidor.',
    rotulos: {
      ingredientes: 'INGREDIENTES',
      laDespensa: 'la despensa',
      tu: 'TÚ',
      enLaMesa: 'en la mesa',
      cocina: 'COCINA',
      hayIngredientes: '¿hay ingredientes?',
      siSeCocina: 'sí → se cocina',
      pides: 'pides la hamburguesa al camarero',
      aTuMedida: 'a tu medida',
      teTrae: 'el camarero te trae la hamburguesa',
      oNoHay: '…o la noticia de que no hay hamburguesas',
    },
  },
  clienteServidor: {
    eyebrow: 'Concepto 3 · cliente y servidor',
    title: (
      <>
        El restaurante es <span className={s.accent}>cliente y servidor</span>
      </>
    ),
    aria: 'El mismo diagrama del restaurante con nombres de computación: tú eres el PC cliente, la cocina es el PC servidor, la despensa son sus recursos, y las flechas son la petición y la respuesta. Verificar los ingredientes es verificar que tienes acceso y que se puede armar la respuesta.',
    caption: 'Misma escena, otros nombres: el servidor verifica que puedes y que hay, arma la respuesta y la manda.',
    rotulos: {
      recursos: 'RECURSOS',
      datosPermisos: 'datos · permisos',
      pcCliente: 'PC CLIENTE',
      quienPide: 'quien pide',
      pcServidor: 'PC SERVIDOR',
      tienesAcceso: '¿tienes acceso?',
      siArma: 'sí → arma la respuesta',
      peticion: 'petición',
      loQueQuieres: 'lo que quieres, como lo quieres',
      respuesta: 'respuesta',
      oError: '…o un error si no se puede',
    },
  },
  servidores: {
    eyebrow: 'Concepto 4 · servir',
    title: (
      <>
        Cada servidor <span className={s.accent}>sirve</span> lo suyo
      </>
    ),
    aria: 'Tres filas iguales donde la petición entra por la izquierda y la respuesta regresa por el mismo lado: pides una página y el servidor web sirve páginas web; pides un archivo y el servidor FTP sirve archivos; pides unos datos y el servidor de base de datos sirve datos.',
    caption: 'Por eso se llama servidor: sirve páginas, archivos o datos — siempre a quien los pide.',
    filas: [
      { servidor: 'SERVIDOR WEB', pides: 'pides una página', sirve: 'sirve páginas web' },
      { servidor: 'SERVIDOR FTP', pides: 'pides un archivo', sirve: 'sirve archivos' },
      { servidor: 'SERVIDOR DE BASE DE DATOS', pides: 'pides unos datos', sirve: 'sirve datos' },
    ],
  },
  hardware: {
    eyebrow: 'Concepto 5 · la máquina',
    title: (
      <>
        Una computadora servidor: hecha para <span className={s.accent}>servir todo el día</span>
      </>
    ),
    aria: 'Una computadora servidor por dentro: CPU, RAM y disco arriba; una tarjeta de red conectada 24/7 por donde entran las peticiones y salen las respuestas; una fuente de poder encendida 24/7. Afuera, punteada, la tarjeta gráfica que no hace falta porque nadie mira la pantalla.',
    caption: 'Nada para mostrar, todo para responder: la máquina está hecha para no apagarse.',
    computadoraServidor: 'COMPUTADORA SERVIDOR',
    cpu: 'CPU',
    ram: 'RAM',
    disco: 'DISCO',
    tarjetaRed: 'TARJETA(S) DE RED',
    conectada: 'conectada · 24/7',
    fuente: 'FUENTE DE PODER',
    encendida: 'encendida · 24/7',
    peticiones: 'peticiones · día y noche',
    respuestas: 'respuestas',
    tarjetaGrafica: 'TARJETA GRÁFICA',
    noHaceFalta: 'no hace falta:',
    nadieMira: 'nadie mira la pantalla',
  },
  arranque: {
    eyebrow: 'Concepto 6 · el arranque',
    title: (
      <>
        Arranca el juego, y los bancos suben <span className={s.accent}>cuando hacen falta</span>
      </>
    ),
    arias: [
      'Un celular con el juego ya corriendo: en el disco está instalado el juego con sus tres SoundBanks (soundbank_init, soundbank_menus y soundbank_nivel_1); en la memoria RAM están cargados el game engine, la escena main, el sound engine y soundbank_init, con una posición libre punteada debajo.',
      'El mismo diagrama del celular: la escena main le pide al sound engine que suene el menú.',
      'El mismo diagrama del celular: el sound engine sale a buscar soundbank_menus al disco.',
      'El mismo diagrama del celular: soundbank_menus sube del disco a la posición libre de la memoria RAM y aparece cargado. soundbank_nivel_1 se queda en el disco.',
    ],
    captions: [
      'Lo mínimo ya está cargado: los engines, la escena y el init — el resto espera en el disco.',
      'La escena pide música de menú; el sound engine todavía no la tiene.',
      'El sound engine sale a buscar el banco al disco.',
      'El banco del menú sube a la posición libre — nivel_1 sigue esperando en el disco.',
    ],
    escena: {
      celular: 'CELULAR',
      disco: 'DISCO',
      elJuego: 'EL JUEGO',
      escenaMainEngine: 'escena main · game engine',
      soundEngine: 'sound engine',
      ram: 'MEMORIA RAM',
      gameEngineRam: 'GAME ENGINE',
      escenaMainRam: 'ESCENA MAIN',
      soundEngineRam: 'SOUND ENGINE',
      libre: '…libre',
      paso1: '① «suena el menú»',
      paso2: '② busca soundbank_menus',
      paso3: '③ sube a la RAM',
    },
  },
};

const en: DatosTexts = {
  name: 'Data, programs and servers',
  context: 'Intro to Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    biblioteca: 'library',
    computador: 'computer',
    lenguajes: 'languages',
    restaurante: 'restaurant',
    clienteServidor: 'client-server',
    servidores: 'servers',
    hardware: 'hardware',
    arranque: 'boot',
    pide: 'asks',
    busca: 'looks',
    sube: 'loads',
  },
  cover: {
    eyebrow: 'Intro to Wwise · from disk to server',
    title: (
      <>
        Data, programs
        <br />
        and <span className={s.accent}>servers</span>
      </>
    ),
    hint: 'Navigate with ← → · space',
  },
  biblioteca: {
    eyebrow: 'Concept 1 · the library',
    title: (
      <>
        To work, the data has to <span className={s.accent}>reach your hands</span>
      </>
    ),
    aria: 'A library seen from above: the shelves hold every subject; on the table there are half-read books with bookmarks; in the middle, two people read the open books of the current subject. Getting up to the shelves is slow, reaching another corner of the table is fast and reading the open book is instant.',
    caption: 'The closer to your hands, the faster — and the less fits.',
    rotulos: {
      estanterias: 'SHELVES',
      todasLasMaterias: 'every subject',
      levantarse: 'get up · slow',
      laMesa: 'THE TABLE',
      alcanzar: 'reach · fast',
      librosAbiertos: 'OPEN BOOKS',
      materiaActual: 'the current subject',
      leer: 'read · instant',
    },
  },
  computador: {
    eyebrow: 'Concept 1 · the computer',
    title: (
      <>
        The library <span className={s.accent}>is your computer</span>
      </>
    ),
    aria: 'The same library diagram with hardware names: the shelves are the hard disk, the table is the RAM memory, the open books are the cache and the two people are the CPUs.',
    caption: 'Same place, other names: disk, RAM and cache are distances to your hands.',
    rotulos: {
      discoDuro: 'HARD DISK',
      todosLosDatos: 'all the data',
      cargar: 'load from disk · slow',
      ram: 'RAM MEMORY',
      traer: 'fetch from RAM · fast',
      cache: 'CACHE',
      loQueUsas: 'what you use right now',
      leerCache: 'read the cache · instant',
      cpu: 'CPU',
    },
  },
  lenguajes: {
    eyebrow: 'Concept 2 · languages',
    title: (
      <>
        The CPU only understands <span className={s.accent}>ones and zeros</span>
      </>
    ),
    aria: 'Four language levels stacked top to bottom, from the closest to the human to the closest to the machine: Python and JavaScript (read almost like English and the language manages memory for you), C++ and Rust (full control of hardware and memory, compiled before running), assembly (direct instructions to the processor, hard for a human to read) and machine code in ones and zeros (the only language the CPU understands: electric pulses, 1 on and 0 off). You write at the top level; the CPU reads the bottom one.',
    caption: 'The higher up, the easier for you; the lower down, the faster for the CPU.',
    masCercaHumano: 'CLOSER TO THE HUMAN',
    masFacil: 'easier for you',
    masCercaMaquina: 'CLOSER TO THE MACHINE',
    masRapido: 'faster for the CPU',
    tuEscribes: 'you write here',
    laCpuLee: 'the CPU reads here',
    niveles: [
      { titulo: 'PYTHON / JAVASCRIPT', lineas: ['reads almost like English', 'the language manages memory for you'] },
      { titulo: 'C++ / RUST', lineas: ['full control of hardware and memory', 'compiled before it runs'] },
      { titulo: 'ASSEMBLY', lineas: ['direct instructions to the processor', 'hard for a human to read'] },
      { titulo: 'MACHINE CODE · 1s and 0s', lineas: ['the only language the CPU understands', 'electric pulses: 1 = on · 0 = off'] },
    ],
  },
  restaurante: {
    eyebrow: 'Concept 3 · the restaurant',
    title: (
      <>
        A server is a program that <span className={s.accent}>handles requests</span>
      </>
    ),
    aria: 'A restaurant seen as a flow: you at the table order the burger from the waiter, the order reaches the kitchen, the kitchen checks whether there are ingredients, and the waiter brings you the burger or the news that there is none. The pantry of ingredients feeds the kitchen from above.',
    caption: 'Take the order, check it can be done, prepare it and bring it back: that is what a server does.',
    rotulos: {
      ingredientes: 'INGREDIENTS',
      laDespensa: 'the pantry',
      tu: 'YOU',
      enLaMesa: 'at the table',
      cocina: 'KITCHEN',
      hayIngredientes: 'any ingredients?',
      siSeCocina: 'yes → it cooks',
      pides: 'you order the burger from the waiter',
      aTuMedida: 'your way',
      teTrae: 'the waiter brings you the burger',
      oNoHay: '…or the news that there are no burgers',
    },
  },
  clienteServidor: {
    eyebrow: 'Concept 3 · client and server',
    title: (
      <>
        The restaurant is <span className={s.accent}>client and server</span>
      </>
    ),
    aria: 'The same restaurant diagram with computing names: you are the client PC, the kitchen is the server PC, the pantry is its resources, and the arrows are the request and the response. Checking the ingredients is checking that you have access and that the response can be built.',
    caption: 'Same scene, other names: the server checks you may and it can, builds the response and sends it.',
    rotulos: {
      recursos: 'RESOURCES',
      datosPermisos: 'data · permissions',
      pcCliente: 'CLIENT PC',
      quienPide: 'who asks',
      pcServidor: 'SERVER PC',
      tienesAcceso: 'do you have access?',
      siArma: 'yes → builds the response',
      peticion: 'request',
      loQueQuieres: 'what you want, how you want it',
      respuesta: 'response',
      oError: "…or an error if it can't",
    },
  },
  servidores: {
    eyebrow: 'Concept 4 · serving',
    title: (
      <>
        Each server <span className={s.accent}>serves</span> its own thing
      </>
    ),
    aria: 'Three equal rows where the request enters from the left and the response returns the same way: you ask for a page and the web server serves web pages; you ask for a file and the FTP server serves files; you ask for some data and the database server serves data.',
    caption: "That's why it's called a server: it serves pages, files or data — always to whoever asks.",
    filas: [
      { servidor: 'WEB SERVER', pides: 'you ask for a page', sirve: 'serves web pages' },
      { servidor: 'FTP SERVER', pides: 'you ask for a file', sirve: 'serves files' },
      { servidor: 'DATABASE SERVER', pides: 'you ask for some data', sirve: 'serves data' },
    ],
  },
  hardware: {
    eyebrow: 'Concept 5 · the machine',
    title: (
      <>
        A server computer: built to <span className={s.accent}>serve all day long</span>
      </>
    ),
    aria: 'A server computer from the inside: CPU, RAM and disk on top; a network card connected 24/7 where requests come in and responses go out; a power supply on 24/7. Outside, dotted, the graphics card that is not needed because nobody looks at the screen.',
    caption: 'Nothing to show, everything to answer: the machine is built to never turn off.',
    computadoraServidor: 'SERVER COMPUTER',
    cpu: 'CPU',
    ram: 'RAM',
    disco: 'DISK',
    tarjetaRed: 'NETWORK CARD(S)',
    conectada: 'connected · 24/7',
    fuente: 'POWER SUPPLY',
    encendida: 'powered on · 24/7',
    peticiones: 'requests · day and night',
    respuestas: 'responses',
    tarjetaGrafica: 'GRAPHICS CARD',
    noHaceFalta: 'not needed:',
    nadieMira: 'nobody looks at the screen',
  },
  arranque: {
    eyebrow: 'Concept 6 · the boot',
    title: (
      <>
        The game boots, and banks load <span className={s.accent}>when they are needed</span>
      </>
    ),
    arias: [
      'A phone with the game already running: the game is installed on disk with its three SoundBanks (soundbank_init, soundbank_menus and soundbank_nivel_1); the game engine, the main scene, the sound engine and soundbank_init are loaded in RAM, with a dotted free slot below.',
      'The same phone diagram: the main scene asks the sound engine to play the menu.',
      'The same phone diagram: the sound engine goes to the disk looking for soundbank_menus.',
      'The same phone diagram: soundbank_menus goes up from the disk to the free slot in RAM and appears loaded. soundbank_nivel_1 stays on disk.',
    ],
    captions: [
      'The minimum is loaded: the engines, the scene and init — the rest waits on disk.',
      "The scene asks for menu music; the sound engine doesn't have it yet.",
      'The sound engine goes to the disk to fetch the bank.',
      'The menu bank goes up to the free slot — nivel_1 keeps waiting on disk.',
    ],
    escena: {
      celular: 'PHONE',
      disco: 'DISK',
      elJuego: 'THE GAME',
      escenaMainEngine: 'main scene · game engine',
      soundEngine: 'sound engine',
      ram: 'RAM MEMORY',
      gameEngineRam: 'GAME ENGINE',
      escenaMainRam: 'MAIN SCENE',
      soundEngineRam: 'SOUND ENGINE',
      libre: '…free',
      paso1: '① “play the menu”',
      paso2: '② looks for soundbank_menus',
      paso3: '③ goes up to RAM',
    },
  },
};

export const datosDict = { es, en };
