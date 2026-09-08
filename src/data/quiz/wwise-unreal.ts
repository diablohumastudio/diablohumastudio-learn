import type { QuizQuestion } from './types';

/* Questions for the Wwise + Unreal course. `es` is the source language.
   Ids are permanent: add new ones at the end, never renumber or reuse. */

export const WWISE_UNREAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'wu-001',
    topic: 'datos-programas-y-servidores',
    prompt: {
      es: 'En la analogía de la biblioteca, ¿qué parte del computador es la mesa?',
      en: 'In the library analogy, which part of the computer is the table?',
    },
    choices: [
      { es: 'El disco duro', en: 'The hard disk' },
      { es: 'La memoria RAM', en: 'The RAM memory' },
      { es: 'La caché', en: 'The cache' },
      { es: 'La CPU', en: 'The CPU' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'Las estanterías son el disco, la mesa es la RAM, los libros abiertos son la caché y las personas que leen son las CPU.',
      en: 'The shelves are the disk, the table is the RAM, the open books are the cache and the people reading are the CPUs.',
    },
  },
  {
    id: 'wu-002',
    topic: 'datos-programas-y-servidores',
    prompt: {
      es: '¿Cuál es el único lenguaje que la CPU entiende?',
      en: 'Which is the only language the CPU understands?',
    },
    choices: [
      { es: 'Python', en: 'Python' },
      { es: 'C++', en: 'C++' },
      { es: 'Ensamblador', en: 'Assembly' },
      { es: 'Código máquina: unos y ceros', en: 'Machine code: ones and zeros' },
    ],
    correctIndex: 3,
    explanation: {
      es: 'Todo lo demás se traduce hacia abajo hasta llegar a pulsos eléctricos: 1 encendido, 0 apagado.',
      en: 'Everything else is translated down until it becomes electric pulses: 1 on, 0 off.',
    },
  },
  {
    id: 'wu-003',
    topic: 'datos-programas-y-servidores',
    prompt: {
      es: 'Según la clase, ¿qué es un servidor?',
      en: 'According to the class, what is a server?',
    },
    choices: [
      { es: 'Una computadora con tarjeta de video potente', en: 'A computer with a powerful video card' },
      { es: 'Un programa que atiende peticiones', en: 'A program that handles requests' },
      { es: 'Un cable de red muy rápido', en: 'A very fast network cable' },
      { es: 'Un archivo .exe', en: 'An .exe file' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'Como la cocina del restaurante: recibe el pedido, verifica que se puede, lo prepara y lo devuelve.',
      en: 'Like the restaurant kitchen: it takes the order, checks it can be done, prepares it and brings it back.',
    },
  },
  {
    id: 'wu-004',
    topic: 'datos-programas-y-servidores',
    prompt: {
      es: '¿Qué pieza suele no existir en una computadora servidor?',
      en: 'Which part usually does not exist in a server computer?',
    },
    choices: [
      { es: 'La fuente de poder', en: 'The power supply' },
      { es: 'La tarjeta de red', en: 'The network card' },
      { es: 'La tarjeta de video', en: 'The video card' },
      { es: 'La memoria RAM', en: 'The RAM memory' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'Nadie mira la pantalla de un servidor; lo que importa son la red y una fuente encendida 24/7.',
      en: 'Nobody looks at a server screen; what matters is the network and a power supply on 24/7.',
    },
  },
  {
    id: 'wu-005',
    topic: 'datos-programas-y-servidores',
    prompt: {
      es: 'Al arrancar el juego, ¿qué SoundBank ya está cargado en la RAM?',
      en: 'When the game boots, which SoundBank is already loaded in RAM?',
    },
    choices: [
      { es: 'soundbank_init', en: 'soundbank_init' },
      { es: 'soundbank_menus', en: 'soundbank_menus' },
      { es: 'soundbank_nivel_1', en: 'soundbank_nivel_1' },
      { es: 'Todos a la vez', en: 'All of them at once' },
    ],
    correctIndex: 0,
    explanation: {
      es: 'Solo lo mínimo sube al inicio; los demás bancos suben del disco cuando la escena los pide.',
      en: 'Only the minimum loads at start; the other banks come up from disk when the scene asks for them.',
    },
  },
  {
    id: 'wu-006',
    topic: 'que-es-un-motor-de-audio',
    prompt: {
      es: 'Un programa compilado…',
      en: 'A compiled program…',
    },
    choices: [
      { es: 'se traduce a binario una vez, antes de correr', en: 'is translated to binary once, before running' },
      { es: 'sigue siendo texto cuando corre', en: 'is still text when it runs' },
      { es: 'necesita un motor que lo lea en vivo', en: 'needs an engine to read it live' },
      { es: 'solo funciona en Windows', en: 'only works on Windows' },
    ],
    correctIndex: 0,
    explanation: {
      es: 'El compilador lo convierte en binario listo para la CPU; el OS solo lo lanza.',
      en: 'The compiler turns it into a binary ready for the CPU; the OS just launches it.',
    },
  },
  {
    id: 'wu-007',
    topic: 'que-es-un-motor-de-audio',
    prompt: {
      es: '¿Quién corre a un programa interpretado?',
      en: 'Who runs an interpreted program?',
    },
    choices: [
      { es: 'El OS, directamente', en: 'The OS, directly' },
      { es: 'La CPU, directamente', en: 'The CPU, directly' },
      { es: 'Un motor (intérprete)', en: 'An engine (interpreter)' },
      { es: 'La tarjeta de red', en: 'The network card' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'La CPU nunca ve tu script: ve al motor leyéndolo. El motor es un programa más, compilado.',
      en: 'The CPU never sees your script: it sees the engine reading it. The engine is one more compiled program.',
    },
  },
  {
    id: 'wu-008',
    topic: 'que-es-un-motor-de-audio',
    prompt: {
      es: 'Según la definición de la clase, un motor es…',
      en: 'According to the class definition, an engine is…',
    },
    choices: [
      { es: 'un programa que corre para correr programas', en: 'a program that runs to run programs' },
      { es: 'una pieza de hardware para audio', en: 'a piece of audio hardware' },
      { es: 'un archivo de configuración', en: 'a configuration file' },
      { es: 'un lenguaje de programación', en: 'a programming language' },
    ],
    correctIndex: 0,
    explanation: {
      es: 'Recibe programas hechos de recursos, código y configuraciones, y produce comportamiento: el navegador, Python, Unreal, Wwise.',
      en: 'It takes programs made of resources, code and configurations and produces behavior: the browser, Python, Unreal, Wwise.',
    },
  },
  {
    id: 'wu-009',
    topic: 'wwise-por-adentro',
    prompt: {
      es: '¿Qué genera el Wwise editor hacia el proyecto del engine?',
      en: 'What does the Wwise editor generate into the engine project?',
    },
    choices: [
      { es: 'Audio clips', en: 'Audio clips' },
      { es: 'SoundBanks (.bnk)', en: 'SoundBanks (.bnk)' },
      { es: 'Wwise calls', en: 'Wwise calls' },
      { es: 'El binario del juego', en: 'The game binary' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'Objects configurados + audios se empaquetan en SoundBanks: estructura + media.',
      en: 'Configured objects + audio are packed into SoundBanks: structure + media.',
    },
  },
  {
    id: 'wu-010',
    topic: 'wwise-por-adentro',
    prompt: {
      es: 'En el build, ¿cómo usa el juego a Wwise?',
      en: 'In the build, how does the game use Wwise?',
    },
    choices: [
      { es: 'Abre el Wwise editor en segundo plano', en: 'Opens the Wwise editor in the background' },
      { es: 'Hace Wwise calls al Wwise engine', en: 'Makes Wwise calls to the Wwise engine' },
      { es: 'Lee los audio clips directamente', en: 'Reads the audio clips directly' },
      { es: 'Recompila los SoundBanks', en: 'Recompiles the SoundBanks' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'El juego solo usa la interface: los calls. El Wwise engine corre los SoundBanks cargados y produce el audio.',
      en: 'The game only uses the interface: the calls. The Wwise engine runs the loaded SoundBanks and produces the audio.',
    },
  },
  {
    id: 'wu-011',
    topic: 'el-editor-wwise',
    prompt: {
      es: '¿Cuáles son los tres views de todos los días en Wwise?',
      en: 'Which are the three everyday views in Wwise?',
    },
    choices: [
      { es: 'Project Explorer, Transport Control y Soundcaster', en: 'Project Explorer, Transport Control and Soundcaster' },
      { es: 'Meter, Loudness Meter y Audio Device Meter', en: 'Meter, Loudness Meter and Audio Device Meter' },
      { es: 'Event Editor, Switch Editor y State Editor', en: 'Event Editor, Switch Editor and State Editor' },
      { es: 'Profiler, Utilities y Editors', en: 'Profiler, Utilities and Editors' },
    ],
    correctIndex: 0,
    explanation: {
      es: 'Project Explorer para moverte; Transport Control y Soundcaster para escuchar.',
      en: 'Project Explorer to move around; Transport Control and Soundcaster to listen.',
    },
  },
  {
    id: 'wu-012',
    topic: 'el-editor-wwise',
    prompt: {
      es: '¿Qué es un layout en Wwise?',
      en: 'What is a layout in Wwise?',
    },
    choices: [
      { es: 'Un acomodo de views en la pantalla', en: 'An arrangement of views on the screen' },
      { es: 'Un tipo de Wwise Object', en: 'A type of Wwise Object' },
      { es: 'Un SoundBank especial', en: 'A special SoundBank' },
      { es: 'Un plugin de efectos', en: 'An effects plugin' },
    ],
    correctIndex: 0,
    explanation: {
      es: 'Mismos views disponibles, otro acomodo: cada tarea pide su pantalla.',
      en: 'Same views available, another arrangement: each task asks for its own screen.',
    },
  },
  {
    id: 'wu-013',
    topic: 'el-editor-wwise',
    prompt: {
      es: '¿Cuál es el layout de diario para crear y configurar Wwise Objects y Events?',
      en: 'Which is the daily layout for creating and configuring Wwise Objects and Events?',
    },
    choices: [
      { es: 'Designer', en: 'Designer' },
      { es: 'Profiler', en: 'Profiler' },
      { es: 'SoundBank', en: 'SoundBank' },
      { es: 'Mixer', en: 'Mixer' },
    ],
    correctIndex: 0,
    explanation: {
      es: 'Designer: Project Explorer a la izquierda, el elemento abierto en el centro y el Property Editor a la derecha.',
      en: 'Designer: Project Explorer on the left, the open element in the middle and the Property Editor on the right.',
    },
  },
];
