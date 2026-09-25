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

export type BibliotecaTexts = {
  eyebrow: string;
  title: ReactNode;
  arias: [string, string];
  caption: string;
  notes: string;
  biblioteca: RotulosBibliotecaTexts;
  computador: RotulosComputadorTexts;
};

export type RotulosBackendTexts = {
  cliente: string;
  clienteSub: string;
  backend: string;
  api: string;
  apiSub: string;
  autorizacion: string;
  autorizacionSub: string;
  baseDeDatos: string;
  baseDeDatosSub: string;
  valida: string;
  busca: string;
  pides: string;
  recibes: string;
};

export type RotulosPeticionTexts = {
  cliente: string;
  clienteSub: string;
  servidor: string;
  paso1: string;
  paso2: string;
  paso3: string;
  peticion: string;
  peticionSub: string;
  respuesta: string;
  respuestaSub: string;
};

export type MaquinaTexts = {
  titulo: string;
  cpu: string;
  ram: string;
  disco: string;
  tarjetaRed: string;
  tarjetaRedSub: string;
  fuente: string;
  fuenteSub: string;
  tarjetaVideo: string;
  tarjetaVideoSub: string;
};

export type EscenaArranqueTexts = {
  servidor: string;
  servidorSub: string;
  celular: string;
  disco: string;
  ram: string;
  juego: string;
  instalado: string;
  corriendo: string;
  instalas: string;
  abres: string;
};

/* `resaltado` is a trailing part of the title drawn in amber and pulsed on entry. */
export type NivelDeLenguaje = { titulo: string; resaltado?: string; lineas: [string, string] };

type DatosTexts = {
  name: string;
  context: string;
  labels: {
    intro: string;
    biblioteca: string;
    computador: string;
    lenguajes: string;
    clienteServidor: string;
    servidores: string;
    backend: string;
    hardware: string;
    arranque: string;
    instalas: string;
    abres: string;
  };
  cover: { eyebrow: string; title: ReactNode; hint: string };
  biblioteca: BibliotecaTexts;
  lenguajes: {
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
    tuEscribes: string;
    laCpuLee: string;
    niveles: [NivelDeLenguaje, NivelDeLenguaje, NivelDeLenguaje, NivelDeLenguaje];
  };
  clienteServidor: { eyebrow: string; title: ReactNode; aria: string; caption: string; notes: string; rotulos: RotulosPeticionTexts };
  servidores: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    notes: string;
    filas: FilaServidor[];
  };
  backend: { eyebrow: string; title: ReactNode; aria: string; caption: string; notes: string; rotulos: RotulosBackendTexts };
  hardware: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    peticiones: string;
    respuestas: string;
    servidor: MaquinaTexts;
    diseno: MaquinaTexts;
  };
  arranque: ArranqueTexts;
};

/* Three steps: before installing, installing (server → disk), opening (disk → RAM).
   `titles` has one entry per step. */
export type ArranqueTexts = {
  eyebrow: string;
  titles: [ReactNode, ReactNode, ReactNode];
  arias: [string, string, string];
  caption: string;
  escena: EscenaArranqueTexts;
};

/* `sirveDetalle` is a second, muted line under `sirve`; `ejemplos` has one or two lines. */
export type FilaServidor = { servidor: string; pides: string; sirve: string; sirveDetalle?: string; ejemplos: string[] };

const es: DatosTexts = {
  name: 'Datos, programas y servidores',
  context: 'Intro a Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    biblioteca: 'biblioteca',
    computador: 'computador',
    lenguajes: 'lenguajes',
    clienteServidor: 'cliente-servidor',
    servidores: 'tipos y ejemplos de servidores',
    backend: 'backend',
    hardware: 'hardware de servidor',
    arranque: 'arranque',
    instalas: 'instalas el juego',
    abres: 'abres el juego',
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
    eyebrow: 'Los datos tienen que llegar al procesador',
    title: (
      <>
        Analogía de un PC a una <span className={s.accent}>biblioteca</span>
      </>
    ),
    arias: [
      'Una biblioteca vista desde arriba: arriba, tres estanterías con todas las materias; abajo, dos mesas laterales con libros cerrados y, en el centro, una mesa con cuatro personas leyendo libros abiertos. Levantarse a las estanterías es lento, alcanzar las mesas laterales es rápido y leer el libro abierto es instantáneo.',
      'La misma escena con las piezas de un computador: las estanterías se vuelven discos duros, las mesas laterales se vuelven módulos de memoria RAM y la mesa central se vuelve un CPU de cuatro núcleos con su caché. Cargar del disco es lento, traer de RAM es rápido y leer la caché es instantáneo.',
    ],
    caption: 'Mientras más cerca está la información, más rápido se procesa cuando se necesita.',
    notes:
      'Cuanto más cerca del procesador está el lugar donde reside la información que necesita una tarea, más rápido se puede empezar a trabajar en ella; a cambio, ese lugar es más pequeño.\n\nLas estanterías son el disco duro: cabe todo, pero ir a buscarlo es lento. Las mesas laterales son la memoria RAM: cabe menos, pero está al alcance de la mano. Los libros abiertos frente a cada persona son la caché del CPU: cabe muy poco, pero se lee al instante.',
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
    },
  },
  lenguajes: {
    eyebrow: 'Los niveles de abstracción de los lenguajes de programación',
    title: (
      <>
        Más abstracto significa <span className={s.accent}>menos detalle</span>
      </>
    ),
    aria: 'Cuatro niveles de lenguaje apilados de arriba hacia abajo, del más abstracto al menos abstracto: Python, JavaScript, GDScript y Blueprints (se leen casi como inglés y el lenguaje maneja la memoria por ti), C++ y Rust (control total del hardware y la memoria, se compilan antes de correr), ensamblador (instrucciones directas al procesador, difícil de leer para un humano) y código máquina en unos y ceros (el único lenguaje que la CPU entiende: pulsos eléctricos, 1 encendido y 0 apagado). Tú escribes en el nivel de arriba; la CPU lee el de abajo.',
    caption: 'Mientras más abstracto es un lenguaje, menos detalle tienes que escribir y más fácil es de entender.',
    masCercaHumano: 'MÁS CERCA DEL HUMANO',
    masFacil: 'más fácil para ti',
    masCercaMaquina: 'MÁS CERCA DE LA MÁQUINA',
    masRapido: 'más rápido para la CPU',
    masAbstracto: 'MÁS ABSTRACTO',
    menosAbstracto: 'MENOS ABSTRACTO',
    tuEscribes: 'tú escribes aquí',
    laCpuLee: 'la CPU lee aquí',
    niveles: [
      { titulo: 'PYTHON / JAVASCRIPT / ', resaltado: 'GDSCRIPT / BLUEPRINTS', lineas: ['se lee casi como inglés', 'la memoria la maneja el lenguaje por ti'] },
      { titulo: 'C++ / RUST', lineas: ['control total del hardware y la memoria', 'se compila antes de correr'] },
      { titulo: 'ENSAMBLADOR (ASSEMBLY)', lineas: ['instrucciones directas al procesador', 'difícil de leer para un humano'] },
      { titulo: 'CÓDIGO MÁQUINA · 1s y 0s', lineas: ['el único lenguaje que la CPU entiende', 'pulsos eléctricos: 1 = encendido · 0 = apagado'] },
    ],
  },
  clienteServidor: {
    eyebrow: 'Modelo cliente-servidor',
    title: (
      <>
        Un <span className={s.accent}>servidor</span> es un programa que <span className={s.accent}>atiende peticiones</span>
      </>
    ),
    aria: 'Un PC cliente a la izquierda envía una petición al PC servidor de la derecha; el servidor valida al usuario, busca los recursos y arma la respuesta, y la devuelve al cliente, o un error si no se pudo.',
    caption:
      'Flujo: el cliente envía una petición; el servidor ① valida al usuario, ② busca los recursos y ③ arma la respuesta; y devuelve la respuesta al cliente (o un error si no se pudo).',
    notes:
      'Analogía del restaurante. Tú, sentado en la mesa, le pides al camarero una hamburguesa a tu gusto: esa es la petición. El pedido llega a la cocina, que hace tres cosas: verifica que el plato esté en el menú, revisa y trae los ingredientes, y prepara la hamburguesa. Después el camarero te la trae, o te trae la noticia de que no hay hamburguesas: esa es la respuesta.\n\nCambia los nombres y tienes el modelo cliente-servidor: tú eres el PC cliente, la cocina es el PC servidor, el pedido es la petición y lo que vuelve es la respuesta. Los tres pasos de la cocina son los tres pasos del servidor: validar al usuario (¿quién eres, tienes permiso?), buscar los recursos que hacen falta y armar la respuesta antes de enviarla.\n\nCada vez que abres una página, ves un video o entras a un juego en línea, estás siendo cliente de algún servidor.',
    rotulos: {
      cliente: 'PC CLIENTE',
      clienteSub: 'quien pide',
      servidor: 'PC SERVIDOR',
      paso1: '① valida al usuario',
      paso2: '② busca los recursos',
      paso3: '③ arma la respuesta',
      peticion: 'petición',
      peticionSub: 'lo que quieres, como lo quieres',
      respuesta: 'respuesta',
      respuestaSub: '…o un error si no se puede',
    },
  },
  servidores: {
    eyebrow: 'Tipos y ejemplos de servidores',
    title: (
      <>
        Cada servidor <span className={s.accent}>sirve</span> lo suyo
      </>
    ),
    aria: 'Cuatro filas iguales donde la petición entra por la izquierda y la respuesta regresa por el mismo lado: pides una página y el servidor web sirve páginas web; pides unos datos y el servidor de base de datos sirve datos; pides el código de un repositorio y el servidor de git sirve repositorios; pides entrar con tu cuenta y el servidor de autorización sirve un permiso de acceso. A la derecha, ejemplos reales de cada tipo.',
    caption: 'Por eso se llama servidor: sirve páginas, archivos o datos — siempre a quien los pide.',
    notes:
      'Hay más tipos: un servidor FTP sirve archivos (le pides un archivo y te lo manda; FileZilla Server y vsftpd son ejemplos). El patrón es siempre el mismo; lo que cambia es qué se pide y qué se entrega.',
    filas: [
      { servidor: 'SERVIDOR WEB', pides: 'pides una página', sirve: 'sirve páginas web', ejemplos: ['ej.: Apache · Nginx'] },
      { servidor: 'SERVIDOR DE BASE DE DATOS', pides: 'pides unos datos', sirve: 'sirve datos', ejemplos: ['ej.: PostgreSQL · MySQL'] },
      { servidor: 'SERVIDOR DE GIT', pides: 'pides el código de un repositorio', sirve: 'sirve repositorios de código', ejemplos: ['ej.: GitHub · GitLab'] },
      {
        servidor: 'SERVIDOR DE AUTORIZACIÓN',
        pides: 'pides entrar con tu cuenta',
        sirve: 'sirve un permiso de acceso (token)',
        ejemplos: ['ej.: OAuth de Google · OAuth de Apple'],
      },
    ],
  },
  backend: {
    eyebrow: 'Backend-as-a-Service',
    title: (
      <>
        Un <span className={s.accent}>backend</span> es un conjunto de servidores que trabajan juntos
      </>
    ),
    aria: 'El PC cliente a la izquierda envía una petición (pides un DLC) a un backend a la derecha: una caja grande con un servidor web / API que recibe la petición, un servidor de autorización que valida quién eres y una base de datos que busca qué te corresponde, unidos por flechas internas. El backend devuelve la respuesta (recibes el DLC).',
    caption:
      'El cliente habla con un solo punto; adentro, varios servidores se comunican entre sí para armar la respuesta. Ejemplos: Nakama · LootLocker · Steamworks · Google Play Services · Apple Game Center.',
    notes:
      'El DLC del ejemplo es un paquete nuevo del juego (niveles, personajes, música) que trae su propio soundbank: así el sound engine carga los sonidos nuevos sin reinstalar el juego.\n\nPlataformas backend-as-a-service: Nakama, LootLocker, Steamworks, Google Play Services y Apple Game Center. Cada una junta varios servicios (cuentas, guardado en la nube, compras, logros, DLC) detrás de un solo punto de contacto para el juego.',
    rotulos: {
      cliente: 'PC CLIENTE',
      clienteSub: 'quien pide',
      backend: 'BACKEND',
      api: 'SERVIDOR WEB / API',
      apiSub: 'recibe la petición',
      autorizacion: 'SERVIDOR DE AUTORIZACIÓN',
      autorizacionSub: '¿quién eres?',
      baseDeDatos: 'BASE DE DATOS',
      baseDeDatosSub: 'qué te corresponde',
      valida: 'valida',
      busca: 'busca',
      pides: 'pides un DLC',
      recibes: 'recibes el DLC',
    },
  },
  hardware: {
    eyebrow: 'Hardware de servidor',
    title: (
      <>
        Una <span className={s.accent}>computadora</span> servidor: hecha <span className={s.accent}>para servir todo el día</span>
      </>
    ),
    aria: 'Dos computadoras por dentro, lado a lado. La computadora servidor: CPU, RAM y disco; tarjetas de red súper rápidas y robustas por donde entran las peticiones y salen las respuestas día y noche; una fuente de poder súper robusta encendida 24/7; y la tarjeta de video, inexistente, porque nadie mira la pantalla. La PC de diseño gráfico: las mismas piezas, pero con tarjeta de red básica, fuente básica y una tarjeta de video potente.',
    caption: 'Mismas piezas, prioridades opuestas: el servidor responde todo el día; la PC de diseño muestra.',
    peticiones: 'peticiones · día y noche',
    respuestas: 'respuestas',
    servidor: {
      titulo: 'COMPUTADORA SERVIDOR',
      cpu: 'CPU',
      ram: 'RAM',
      disco: 'DISCO',
      tarjetaRed: 'TARJETA(S) DE RED',
      tarjetaRedSub: 'súper rápidas y robustas · 24/7',
      fuente: 'FUENTE DE PODER',
      fuenteSub: 'súper robusta · encendida 24/7',
      tarjetaVideo: 'TARJETA DE VIDEO',
      tarjetaVideoSub: 'inexistente: nadie mira la pantalla',
    },
    diseno: {
      titulo: 'PC DE DISEÑO GRÁFICO',
      cpu: 'CPU',
      ram: 'RAM',
      disco: 'DISCO',
      tarjetaRed: 'TARJETA DE RED',
      tarjetaRedSub: 'básica',
      fuente: 'FUENTE DE PODER',
      fuenteSub: 'básica',
      tarjetaVideo: 'TARJETA DE VIDEO',
      tarjetaVideoSub: 'potente: todo se ve en pantalla',
    },
  },
  arranque: {
    eyebrow: 'Instalar y abrir un programa',
    titles: [
      <>
        Instalar un programa es <span className={s.accent}>copiarlo de un servidor al disco</span>
      </>,
      <>
        Instalar un programa es <span className={s.accent}>copiarlo de un servidor al disco</span>
      </>,
      <>
        Abrir un programa es <span className={s.accent}>copiarlo del disco a la RAM</span>
      </>,
    ],
    arias: [
      'A la izquierda, fuera del celular, un servidor (o disco externo de instalación) con el juego. El celular por dentro: el disco y la memoria RAM, vacíos.',
      'Al instalar el juego, una copia viaja del servidor al disco del celular y queda instalada ahí.',
      'Al abrir el juego, otra copia viaja del disco a la memoria RAM y queda corriendo ahí; el original sigue instalado en el disco.',
    ],
    caption: 'Instalar copia el programa del servidor al disco; abrirlo lo copia del disco a la RAM, donde corre.',
    escena: {
      servidor: 'SERVIDOR',
      servidorSub: 'o disco de instalación',
      celular: 'CELULAR',
      disco: 'DISCO',
      ram: 'MEMORIA RAM',
      juego: 'JUEGO',
      instalado: 'instalado',
      corriendo: 'corriendo',
      instalas: 'instalas el juego',
      abres: 'abres el juego',
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
    clienteServidor: 'client-server',
    servidores: 'types and examples of servers',
    backend: 'backend',
    hardware: 'server hardware',
    arranque: 'boot',
    instalas: 'you install the game',
    abres: 'you open the game',
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
    eyebrow: 'Data has to reach the processor',
    title: (
      <>
        Analogy of a PC to a <span className={s.accent}>library</span>
      </>
    ),
    arias: [
      'A library seen from above: on top, three shelves with every subject; below, two side tables with closed books and, in the middle, a table with four people reading open books. Getting up to the shelves is slow, reaching the side tables is fast and reading the open book is instant.',
      'The same scene with the parts of a computer: the shelves become hard disks, the side tables become RAM memory modules and the central table becomes a four-core CPU with its cache. Loading from disk is slow, fetching from RAM is fast and reading the cache is instant.',
    ],
    caption: 'The closer the information is, the faster it gets processed when it is needed.',
    notes:
      'The closer to the processor the place where the information a task needs lives, the sooner that task can start; in exchange, that place is smaller.\n\nThe shelves are the hard disk: everything fits, but going to get it is slow. The side tables are the RAM memory: less fits, but it is within reach. The open books in front of each person are the CPU cache: very little fits, but it is read instantly.',
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
    },
  },
  lenguajes: {
    eyebrow: 'The abstraction levels of programming languages',
    title: (
      <>
        More abstract means <span className={s.accent}>less detail</span>
      </>
    ),
    aria: 'Four language levels stacked top to bottom, from the most abstract to the least abstract: Python, JavaScript, GDScript and Blueprints (read almost like English and the language manages memory for you), C++ and Rust (full control of hardware and memory, compiled before running), assembly (direct instructions to the processor, hard for a human to read) and machine code in ones and zeros (the only language the CPU understands: electric pulses, 1 on and 0 off). You write at the top level; the CPU reads the bottom one.',
    caption: 'The more abstract a language is, the less detail you have to write and the easier it is to understand.',
    masCercaHumano: 'CLOSER TO THE HUMAN',
    masFacil: 'easier for you',
    masCercaMaquina: 'CLOSER TO THE MACHINE',
    masRapido: 'faster for the CPU',
    masAbstracto: 'MORE ABSTRACT',
    menosAbstracto: 'LESS ABSTRACT',
    tuEscribes: 'you write here',
    laCpuLee: 'the CPU reads here',
    niveles: [
      { titulo: 'PYTHON / JAVASCRIPT / ', resaltado: 'GDSCRIPT / BLUEPRINTS', lineas: ['reads almost like English', 'the language manages memory for you'] },
      { titulo: 'C++ / RUST', lineas: ['full control of hardware and memory', 'compiled before it runs'] },
      { titulo: 'ASSEMBLY', lineas: ['direct instructions to the processor', 'hard for a human to read'] },
      { titulo: 'MACHINE CODE · 1s and 0s', lineas: ['the only language the CPU understands', 'electric pulses: 1 = on · 0 = off'] },
    ],
  },
  clienteServidor: {
    eyebrow: 'Client-server model',
    title: (
      <>
        A <span className={s.accent}>server</span> is a program that <span className={s.accent}>handles requests</span>
      </>
    ),
    aria: 'A client PC on the left sends a request to the server PC on the right; the server validates the user, looks up the resources and builds the response, and returns it to the client, or an error if it could not.',
    caption:
      'Flow: the client sends a request; the server ① validates the user, ② looks up the resources and ③ builds the response; and returns the response to the client (or an error if it could not).',
    notes:
      'The restaurant analogy. You, seated at the table, order a burger your way from the waiter: that is the request. The order reaches the kitchen, which does three things: checks the dish is on the menu, checks and fetches the ingredients, and cooks the burger. Then the waiter brings it to you, or brings the news that there are no burgers: that is the response.\n\nChange the names and you have the client-server model: you are the client PC, the kitchen is the server PC, the order is the request and what comes back is the response. The three kitchen steps are the three server steps: validate the user (who are you, are you allowed?), look up the resources it needs and build the response before sending it.\n\nEvery time you open a page, watch a video or join an online game, you are the client of some server.',
    rotulos: {
      cliente: 'CLIENT PC',
      clienteSub: 'who asks',
      servidor: 'SERVER PC',
      paso1: '① validates the user',
      paso2: '② looks up the resources',
      paso3: '③ builds the response',
      peticion: 'request',
      peticionSub: 'what you want, how you want it',
      respuesta: 'response',
      respuestaSub: "…or an error if it can't",
    },
  },
  servidores: {
    eyebrow: 'Types and examples of servers',
    title: (
      <>
        Each server <span className={s.accent}>serves</span> its own thing
      </>
    ),
    aria: "Four equal rows where the request enters from the left and the response returns the same way: you ask for a page and the web server serves web pages; you ask for some data and the database server serves data; you ask for a repository's code and the git server serves repositories; you ask to sign in with your account and the authorization server serves an access permission. On the right, real examples of each type.",
    caption: "That's why it's called a server: it serves pages, files or data — always to whoever asks.",
    notes:
      'There are more types: an FTP server serves files (you ask for a file and it sends it; FileZilla Server and vsftpd are examples). The pattern is always the same; what changes is what is asked for and what is delivered.',
    filas: [
      { servidor: 'WEB SERVER', pides: 'you ask for a page', sirve: 'serves web pages', ejemplos: ['e.g. Apache · Nginx'] },
      { servidor: 'DATABASE SERVER', pides: 'you ask for some data', sirve: 'serves data', ejemplos: ['e.g. PostgreSQL · MySQL'] },
      { servidor: 'GIT SERVER', pides: "you ask for a repository's code", sirve: 'serves code repositories', ejemplos: ['e.g. GitHub · GitLab'] },
      {
        servidor: 'AUTHORIZATION SERVER',
        pides: 'you ask to sign in with your account',
        sirve: 'serves an access permission (token)',
        ejemplos: ['e.g. Google OAuth · Apple OAuth'],
      },
    ],
  },
  backend: {
    eyebrow: 'Backend-as-a-Service',
    title: (
      <>
        A <span className={s.accent}>backend</span> is a set of servers working together
      </>
    ),
    aria: 'The client PC on the left sends a request (you ask for a DLC) to a backend on the right: a large box with a web / API server that receives the request, an authorization server that validates who you are and a database that looks up what you are entitled to, joined by internal arrows. The backend returns the response (you receive the DLC).',
    caption:
      'The client talks to a single point; inside, several servers talk to each other to build the response. Examples: Nakama · LootLocker · Steamworks · Google Play Services · Apple Game Center.',
    notes:
      'The DLC in the example is a new package of the game (levels, characters, music) that brings its own soundbank: that way the sound engine loads the new sounds without reinstalling the game.\n\nBackend-as-a-service platforms: Nakama, LootLocker, Steamworks, Google Play Services and Apple Game Center. Each one bundles several services (accounts, cloud saves, purchases, achievements, DLC) behind a single point of contact for the game.',
    rotulos: {
      cliente: 'CLIENT PC',
      clienteSub: 'who asks',
      backend: 'BACKEND',
      api: 'WEB SERVER / API',
      apiSub: 'receives the request',
      autorizacion: 'AUTHORIZATION SERVER',
      autorizacionSub: 'who are you?',
      baseDeDatos: 'DATABASE',
      baseDeDatosSub: 'what you are owed',
      valida: 'validates',
      busca: 'looks up',
      pides: 'you ask for a DLC',
      recibes: 'you receive the DLC',
    },
  },
  hardware: {
    eyebrow: 'Server hardware',
    title: (
      <>
        A server <span className={s.accent}>computer</span>: built <span className={s.accent}>to serve all day long</span>
      </>
    ),
    aria: 'Two computers from the inside, side by side. The server computer: CPU, RAM and disk; super fast and robust network cards where requests come in and responses go out day and night; a super robust power supply on 24/7; and the video card, nonexistent, because nobody looks at the screen. The graphic design PC: the same parts, but with a basic network card, a basic power supply and a powerful video card.',
    caption: 'Same parts, opposite priorities: the server answers all day; the design PC shows.',
    peticiones: 'requests · day and night',
    respuestas: 'responses',
    servidor: {
      titulo: 'SERVER COMPUTER',
      cpu: 'CPU',
      ram: 'RAM',
      disco: 'DISK',
      tarjetaRed: 'NETWORK CARD(S)',
      tarjetaRedSub: 'super fast and robust · 24/7',
      fuente: 'POWER SUPPLY',
      fuenteSub: 'super robust · powered on 24/7',
      tarjetaVideo: 'VIDEO CARD',
      tarjetaVideoSub: 'none: nobody looks at the screen',
    },
    diseno: {
      titulo: 'GRAPHIC DESIGN PC',
      cpu: 'CPU',
      ram: 'RAM',
      disco: 'DISK',
      tarjetaRed: 'NETWORK CARD',
      tarjetaRedSub: 'basic',
      fuente: 'POWER SUPPLY',
      fuenteSub: 'basic',
      tarjetaVideo: 'VIDEO CARD',
      tarjetaVideoSub: 'powerful: everything shows on screen',
    },
  },
  arranque: {
    eyebrow: 'Installing and opening a program',
    titles: [
      <>
        Installing a program is <span className={s.accent}>copying it from a server to disk</span>
      </>,
      <>
        Installing a program is <span className={s.accent}>copying it from a server to disk</span>
      </>,
      <>
        Opening a program is <span className={s.accent}>copying it from disk to RAM</span>
      </>,
    ],
    arias: [
      'On the left, outside the phone, a server (or external install disk) with the game. The phone from the inside: the disk and the RAM memory, both empty.',
      'When you install the game, a copy travels from the server to the phone disk and stays installed there.',
      'When you open the game, another copy travels from the disk to the RAM memory and runs there; the original stays installed on disk.',
    ],
    caption: 'Installing copies the program from the server to disk; opening it copies it from disk to RAM, where it runs.',
    escena: {
      servidor: 'SERVER',
      servidorSub: 'or install disk',
      celular: 'PHONE',
      disco: 'DISK',
      ram: 'RAM MEMORY',
      juego: 'GAME',
      instalado: 'installed',
      corriendo: 'running',
      instalas: 'you install the game',
      abres: 'you open the game',
    },
  },
};

export const datosDict = { es, en };
