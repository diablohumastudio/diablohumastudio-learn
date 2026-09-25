import type { ReactNode } from 'react';
import s from '../../components/learn/Deck.module.css';

/* Texts of the deck, one object per language. `es` is the source; keep the `en`
   phrases about the same length (±15 %) so the SVG labels stay in their boxes. */

/* One step of the "what is an engine" slide: what goes in, what runs it. */
export type PasoMotor = {
  title: ReactNode;
  aria: string;
  entrada: string;
  entradaSub: string;
  motor: string;
};

export type QueEsUnMotorTexts = {
  eyebrow: string;
  pasos: [PasoMotor, PasoMotor, PasoMotor, PasoMotor, PasoMotor];
  unProgramaCorriendo: string;
  comportamiento: string;
  thMotor: string;
  thCorre: string;
  filas: [[string, string], [string, string], [string, string], [string, string]];
};

/* Three steps: only the title "compiled vs interpreted"; then "programas
   compilados" rises into the eyebrow and the compile flow appears; then the OS
   and the CPU below it. */
export type CompiladosTexts = {
  eyebrow: string;
  titles: [ReactNode, ReactNode, ReactNode];
  arias: [string, string, string];
  caption: string;
  texto: string;
  compilador: string;
  unaVez: string;
  binario: string;
  elOsLoLanza: string;
  os: string;
  sistemas: string;
  instruccionesDirectas: string;
  cpu: string;
  ejecutaTalCual: string;
};

type MotorTexts = {
  name: string;
  context: string;
  labels: {
    intro: string;
    lenguajes: string;
    compilados: string;
    elOs: string;
    interpretados: string;
    queEsUnMotor: string;
    navegador: string;
    python: string;
    gameEngines: string;
    audioEngines: string;
  };
  cover: { eyebrow: string; title: ReactNode; hint: string };
  compilados: CompiladosTexts;
  interpretados: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    texto: string;
    elMotorLoLee: string;
    motor: string;
    interprete: string;
    elOsCorreAlMotor: string;
  };
  queEsUnMotor: QueEsUnMotorTexts;
};

const es: MotorTexts = {
  name: '¿Qué es un motor de audio?',
  context: 'Intro a Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    lenguajes: 'lenguajes',
    compilados: 'compilados',
    elOs: 'el OS',
    interpretados: 'interpretados',
    queEsUnMotor: 'qué es un motor',
    navegador: 'navegador',
    python: 'python',
    gameEngines: 'game engines',
    audioEngines: 'audio engines',
  },
  cover: {
    eyebrow: 'Intro a Wwise · de lenguajes a motores',
    title: (
      <>
        ¿Qué es un motor
        <br />
        de <span className={s.accent}>audio</span>?
      </>
    ),
    hint: 'Navega con ← → · espacio',
  },
  compilados: {
    eyebrow: 'Programas compilados',
    titles: [
      <>
        Programas compilados <span className={s.teal}>vs</span> interpretados
      </>,
      <>
        Tu código se compila: <span className={s.accent}>se vuelve binario</span>
      </>,
      <>
        Y a los <span className={s.accent}>compilados</span> los corre <span className={s.accent}>el OS</span>
      </>,
    ],
    arias: [
      'Solo el título: programas compilados vs interpretados.',
      'Una pila vertical: juego.c es texto, el compilador lo traduce una vez antes de correr y sale juego.exe en binario.',
      'La misma pila con dos pisos más abajo: el OS lanza el binario juego.exe y la CPU lo ejecuta tal cual, con instrucciones directas.',
    ],
    caption: 'El binario ya habla idioma de máquina — nadie lo traduce en runtime.',
    texto: 'texto',
    compilador: 'COMPILADOR',
    unaVez: 'una vez · antes de correr',
    binario: '0110 1001 · binario',
    elOsLoLanza: 'el OS solo lo lanza',
    os: 'OS',
    sistemas: 'Windows · macOS · Linux',
    instruccionesDirectas: 'instrucciones directas',
    cpu: 'CPU',
    ejecutaTalCual: 'ejecuta el binario tal cual',
  },
  interpretados: {
    eyebrow: 'Programas interpretados',
    title: (
      <>
        A los <span className={s.accent}>interpretados</span> los corre <span className={s.accent}>un motor</span>
      </>
    ),
    aria: 'La pila del slide anterior sale por la izquierda y entra por la derecha una nueva con OS y CPU en el mismo lugar; arriba, el script player.gd corre sobre un motor, y el motor sobre el OS.',
    caption: 'La CPU nunca ve tu script: ve al motor leyéndolo.',
    texto: 'texto',
    elMotorLoLee: 'el motor lo lee en vivo',
    motor: 'MOTOR',
    interprete: 'intérprete · un programa más, compilado',
    elOsCorreAlMotor: 'el OS corre al motor',
  },
  queEsUnMotor: {
    eyebrow: 'Definición de motor y ejemplos',
    pasos: [
      {
        title: (
          <>
            Un <span className={s.accent}>motor</span> es un programa que corre
            <br />
            para <span className={s.accent}>correr programas</span>
          </>
        ),
        aria: 'El motor recibe programas, programados o configurados, hechos de recursos, código y configuraciones, y produce comportamiento. Debajo, una tabla vacía de motor y qué corre.',
        entrada: 'programas programados/configurados',
        entradaSub: 'recursos · código · configuraciones',
        motor: 'MOTOR',
      },
      {
        title: (
          <>
            Un <span className={s.accent}>navegador web</span> es un programa que corre
            <br />
            <span className={s.accent}>páginas web</span> (html + css)
          </>
        ),
        aria: 'El mismo diagrama con un ejemplo: las páginas web, hechas de imágenes, html y css, entran al navegador web, que las corre y produce comportamiento. La tabla llena la fila del navegador.',
        entrada: 'PÁGINAS WEB',
        entradaSub: 'imágenes · html · css',
        motor: 'NAVEGADOR WEB',
      },
      {
        title: (
          <>
            <span className={s.accent}>Python</span> es un programa que corre
            <br />
            <span className={s.accent}>scripts .py</span>
          </>
        ),
        aria: 'El mismo diagrama con otro ejemplo: los scripts .py, archivos de texto con sus datos, entran a Python, que los corre y produce comportamiento. La tabla llena la fila de Python.',
        entrada: 'SCRIPTS .PY',
        entradaSub: 'archivos de texto · datos',
        motor: 'PYTHON',
      },
      {
        title: (
          <>
            Un <span className={s.accent}>game engine</span> es un programa que corre
            <br />
            <span className={s.accent}>escenas + scripts</span>
          </>
        ),
        aria: 'El mismo diagrama con otro ejemplo: las escenas y los scripts, con sus texturas, modelos y audios, entran al game engine, que los corre y produce comportamiento. La tabla llena la fila de Unreal / Godot.',
        entrada: 'ESCENAS + SCRIPTS',
        entradaSub: 'texturas · modelos · audios',
        motor: 'GAME ENGINE',
      },
      {
        title: (
          <>
            <span className={s.accent}>Wwise</span> es un programa que corre
            <br />
            <span className={s.accent}>Wwise objects</span>
          </>
        ),
        aria: 'El mismo diagrama con el último ejemplo: los Wwise objects, con sus canciones, sonidos y voces, entran al sound engine, que los corre y produce comportamiento. La tabla llena la fila de Wwise.',
        entrada: 'WWISE OBJECTS',
        entradaSub: 'canciones · sonidos · voces',
        motor: 'SOUND ENGINE',
      },
    ],
    unProgramaCorriendo: 'un programa corriendo',
    comportamiento: 'comportamiento',
    thMotor: 'Motor',
    thCorre: 'Corre',
    filas: [
      ['navegador web', 'páginas web (html + css)'],
      ['Python', 'scripts .py'],
      ['Unreal / Godot', 'escenas + scripts'],
      ['Wwise', 'Wwise objects'],
    ],
  },
};

const en: MotorTexts = {
  name: 'What is an audio engine?',
  context: 'Intro to Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    lenguajes: 'languages',
    compilados: 'compiled',
    elOs: 'the OS',
    interpretados: 'interpreted',
    queEsUnMotor: 'what is an engine',
    navegador: 'browser',
    python: 'python',
    gameEngines: 'game engines',
    audioEngines: 'audio engines',
  },
  cover: {
    eyebrow: 'Intro to Wwise · from languages to engines',
    title: (
      <>
        What is an
        <br />
        <span className={s.accent}>audio</span> engine?
      </>
    ),
    hint: 'Navigate with ← → · space',
  },
  compilados: {
    eyebrow: 'Compiled programs',
    titles: [
      <>
        Compiled <span className={s.teal}>vs</span> interpreted programs
      </>,
      <>
        Your code gets compiled: <span className={s.accent}>it becomes binary</span>
      </>,
      <>
        And <span className={s.accent}>compiled</span> programs are run by <span className={s.accent}>the OS</span>
      </>,
    ],
    arias: [
      'Only the title: compiled vs interpreted programs.',
      'A vertical stack: juego.c is text, the compiler translates it once before running and out comes juego.exe in binary.',
      'The same stack with two more floors below: the OS launches the binary juego.exe and the CPU runs it as is, with direct instructions.',
    ],
    caption: 'The binary already speaks machine language — nobody translates it at runtime.',
    texto: 'text',
    compilador: 'COMPILER',
    unaVez: 'once · before running',
    binario: '0110 1001 · binary',
    elOsLoLanza: 'the OS just launches it',
    os: 'OS',
    sistemas: 'Windows · macOS · Linux',
    instruccionesDirectas: 'direct instructions',
    cpu: 'CPU',
    ejecutaTalCual: 'runs the binary as is',
  },
  interpretados: {
    eyebrow: 'Interpreted programs',
    title: (
      <>
        <span className={s.accent}>Interpreted</span> programs are run by <span className={s.accent}>an engine</span>
      </>
    ),
    aria: 'The previous stack leaves to the left and a new one enters from the right with the OS and the CPU in the same place; on top, the script player.gd runs on an engine, and the engine on the OS.',
    caption: 'The CPU never sees your script: it sees the engine reading it.',
    texto: 'text',
    elMotorLoLee: 'the engine reads it live',
    motor: 'ENGINE',
    interprete: 'interpreter · one more program, compiled',
    elOsCorreAlMotor: 'the OS runs the engine',
  },
  queEsUnMotor: {
    eyebrow: 'Definition of engine and examples',
    pasos: [
      {
        title: (
          <>
            An <span className={s.accent}>engine</span> is a program that runs
            <br />
            to <span className={s.accent}>run programs</span>
          </>
        ),
        aria: 'The engine receives programs, programmed or configured, made of resources, code and configurations, and produces behavior. Below, an empty table of engine and what it runs.',
        entrada: 'programmed/configured programs',
        entradaSub: 'resources · code · configurations',
        motor: 'ENGINE',
      },
      {
        title: (
          <>
            A <span className={s.accent}>web browser</span> is a program that runs
            <br />
            <span className={s.accent}>web pages</span> (html + css)
          </>
        ),
        aria: 'The same diagram with an example: web pages, made of images, html and css, go into the web browser, which runs them and produces behavior. The table fills the browser row.',
        entrada: 'WEB PAGES',
        entradaSub: 'images · html · css',
        motor: 'WEB BROWSER',
      },
      {
        title: (
          <>
            <span className={s.accent}>Python</span> is a program that runs
            <br />
            <span className={s.accent}>.py scripts</span>
          </>
        ),
        aria: 'The same diagram with another example: .py scripts, text files with their data, go into Python, which runs them and produces behavior. The table fills the Python row.',
        entrada: '.PY SCRIPTS',
        entradaSub: 'text files · data',
        motor: 'PYTHON',
      },
      {
        title: (
          <>
            A <span className={s.accent}>game engine</span> is a program that runs
            <br />
            <span className={s.accent}>scenes + scripts</span>
          </>
        ),
        aria: 'The same diagram with another example: scenes and scripts, with their textures, models and audio, go into the game engine, which runs them and produces behavior. The table fills the Unreal / Godot row.',
        entrada: 'SCENES + SCRIPTS',
        entradaSub: 'textures · models · audio',
        motor: 'GAME ENGINE',
      },
      {
        title: (
          <>
            <span className={s.accent}>Wwise</span> is a program that runs
            <br />
            <span className={s.accent}>Wwise objects</span>
          </>
        ),
        aria: 'The same diagram with the last example: Wwise objects, with their songs, sounds and voices, go into the sound engine, which runs them and produces behavior. The table fills the Wwise row.',
        entrada: 'WWISE OBJECTS',
        entradaSub: 'songs · sounds · voices',
        motor: 'SOUND ENGINE',
      },
    ],
    unProgramaCorriendo: 'a running program',
    comportamiento: 'behavior',
    thMotor: 'Engine',
    thCorre: 'Runs',
    filas: [
      ['web browser', 'web pages (html + css)'],
      ['Python', '.py scripts'],
      ['Unreal / Godot', 'scenes + scripts'],
      ['Wwise', 'Wwise objects'],
    ],
  },
};

export const motorDict = { es, en };
