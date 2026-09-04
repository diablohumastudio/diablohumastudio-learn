import type { ReactNode } from 'react';
import s from '../../components/learn/Deck.module.css';

/* Texts of the deck, one object per language. `es` is the source; keep the `en`
   phrases about the same length (±15 %) so the SVG labels stay in their boxes. */

type MotorTexts = {
  name: string;
  context: string;
  labels: {
    intro: string;
    lenguajes: string;
    compilados: string;
    interpretados: string;
    queEsUnMotor: string;
    gameEngines: string;
    audioEngines: string;
  };
  cover: { eyebrow: string; title: ReactNode; hint: string };
  lenguajes: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    compilado: string;
    texto: string;
    compilador: string;
    unaVez: string;
    binario: string;
    listoParaLaCpu: string;
    interpretado: string;
    noSeTraduce: string;
    sigueSiendoTexto: string;
    quienLoLee: string;
  };
  compilados: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    binarioCompilado: string;
    elOsLoLanza: string;
    os: string;
    sistemas: string;
    instruccionesDirectas: string;
    cpu: string;
    ejecutaTalCual: string;
  };
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
  queEsUnMotor: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    programas: string;
    recursos: string;
    codigoYConfigs: string;
    motor: string;
    unProgramaCorriendo: string;
    comportamiento: string;
    thMotor: string;
    thCorre: string;
    filas: [[string, string], [string, string], [string, string], [string, string]];
  };
  gameEngines: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    recursos: string;
    recursosDeJuego: string;
    usan: string;
    configuraciones: string;
    configsDeJuego: string;
    codigo: string;
    scriptsGameplay: string;
    gameEngine: string;
    losCorreJuntos: string;
    elJuego: string;
  };
  audioEngines: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    recursosDeAudio: string;
    configsDeAudioLinea1: string;
    configsDeAudioLinea2: string;
    tracksBusesEvents: string;
    soundEngine: string;
    losCorre: string;
    audio: string;
  };
};

const es: MotorTexts = {
  name: '¿Qué es un motor de audio?',
  context: 'Intro a Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    lenguajes: 'lenguajes',
    compilados: 'compilados',
    interpretados: 'interpretados',
    queEsUnMotor: 'qué es un motor',
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
  lenguajes: {
    eyebrow: 'Concepto 1',
    title: (
      <>
        Programas compilados <span className={s.teal}>vs</span> interpretados
      </>
    ),
    aria: 'Un programa compilado se traduce una vez a binario (juego.exe) antes de correr; un programa interpretado sigue siendo texto y alguien tiene que leerlo en vivo.',
    caption: 'Traducido una vez, antes — o leído en vivo, cada vez.',
    compilado: 'COMPILADO',
    texto: 'texto',
    compilador: 'COMPILADOR',
    unaVez: 'una vez · antes de correr',
    binario: '0110 1001 · binario',
    listoParaLaCpu: 'listo para la CPU',
    interpretado: 'INTERPRETADO',
    noSeTraduce: 'no se traduce',
    sigueSiendoTexto: 'sigue siendo texto',
    quienLoLee: '¿quién lo lee entonces?',
  },
  compilados: {
    eyebrow: 'Concepto 2',
    title: (
      <>
        A los compilados los corre <span className={s.accent}>el OS</span>
      </>
    ),
    aria: 'El binario juego.exe corre sobre el OS y el OS sobre la CPU; el OS solo lanza el binario, que ya habla el idioma de la máquina.',
    caption: 'El binario ya habla idioma de máquina — nadie lo traduce en runtime.',
    binarioCompilado: '0110 1001 · binario compilado',
    elOsLoLanza: 'el OS solo lo lanza',
    os: 'OS',
    sistemas: 'Windows · macOS · Linux',
    instruccionesDirectas: 'instrucciones directas',
    cpu: 'CPU',
    ejecutaTalCual: 'ejecuta el binario tal cual',
  },
  interpretados: {
    eyebrow: 'Concepto 3',
    title: (
      <>
        A los interpretados los corre <span className={s.accent}>un motor</span>
      </>
    ),
    aria: 'El mismo stack anterior con un piso nuevo: el script corre sobre un motor, el motor sobre el OS y el OS sobre la CPU.',
    caption: 'La CPU nunca ve tu script: ve al motor leyéndolo.',
    texto: 'texto',
    elMotorLoLee: 'el motor lo lee en vivo',
    motor: 'MOTOR',
    interprete: 'intérprete · un programa más, compilado',
    elOsCorreAlMotor: 'el OS corre al motor',
  },
  queEsUnMotor: {
    eyebrow: 'Concepto 4 · la definición',
    title: (
      <>
        Un motor es un programa que corre
        <br />
        para <span className={s.accent}>correr programas</span>
      </>
    ),
    aria: 'El motor recibe programas, programados o configurados, hechos de recursos, código y configuraciones, y produce comportamiento.',
    programas: 'programas programados/configurados',
    recursos: 'recursos',
    codigoYConfigs: ' · código · configuraciones',
    motor: 'MOTOR',
    unProgramaCorriendo: 'un programa corriendo',
    comportamiento: 'comportamiento',
    thMotor: 'Motor',
    thCorre: 'Corre',
    filas: [
      ['navegador', 'HTML + JS'],
      ['Python', 'scripts .py'],
      ['Unreal / Godot', 'escenas + scripts'],
      ['Wwise', 'Wwise objects'],
    ],
  },
  gameEngines: {
    eyebrow: 'Concepto 5',
    title: (
      <>
        Un game engine corre <span className={s.accent}>configs y código</span>
      </>
    ),
    aria: 'Los recursos, externos y arriba, alimentan a las configuraciones y al código; el game engine corre todo junto y produce el juego.',
    caption: 'Configuras y programas; el engine junta todo con los recursos y lo corre.',
    recursos: 'RECURSOS',
    recursosDeJuego: 'texturas · modelos · audios',
    usan: 'usan',
    configuraciones: 'CONFIGURACIONES',
    configsDeJuego: 'escenas · maps · prefabs',
    codigo: 'CÓDIGO',
    scriptsGameplay: 'scripts · gameplay',
    gameEngine: 'GAME ENGINE',
    losCorreJuntos: 'los corre juntos',
    elJuego: 'el juego',
  },
  audioEngines: {
    eyebrow: 'Concepto 6',
    title: (
      <>
        El motor de audio: <span className={s.accent}>mismo patrón</span>
      </>
    ),
    aria: 'El diagrama del game engine se reduce: quedan los recursos —canciones, sonidos y voces— alimentando las configuraciones de sonido interactivo, y el sound engine que las corre y produce el audio.',
    caption: 'Mismo patrón: recursos afuera, sonido configurado, un engine que lo corre.',
    recursosDeAudio: 'canciones · sonidos · voces',
    configsDeAudioLinea1: 'Configuraciones de',
    configsDeAudioLinea2: 'Sonido Interactivo',
    tracksBusesEvents: 'tracks · buses · events',
    soundEngine: 'SOUND ENGINE',
    losCorre: 'los corre',
    audio: 'audio',
  },
};

const en: MotorTexts = {
  name: 'What is an audio engine?',
  context: 'Intro to Wwise · Wwise + Unreal',
  labels: {
    intro: 'intro',
    lenguajes: 'languages',
    compilados: 'compiled',
    interpretados: 'interpreted',
    queEsUnMotor: 'what is an engine',
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
  lenguajes: {
    eyebrow: 'Concept 1',
    title: (
      <>
        Compiled <span className={s.teal}>vs</span> interpreted programs
      </>
    ),
    aria: 'A compiled program is translated once into binary (juego.exe) before running; an interpreted program stays as text and someone has to read it live.',
    caption: 'Translated once, beforehand — or read live, every time.',
    compilado: 'COMPILED',
    texto: 'text',
    compilador: 'COMPILER',
    unaVez: 'once · before running',
    binario: '0110 1001 · binary',
    listoParaLaCpu: 'ready for the CPU',
    interpretado: 'INTERPRETED',
    noSeTraduce: 'not translated',
    sigueSiendoTexto: 'still just text',
    quienLoLee: 'so who reads it?',
  },
  compilados: {
    eyebrow: 'Concept 2',
    title: (
      <>
        Compiled programs are run by <span className={s.accent}>the OS</span>
      </>
    ),
    aria: 'The binary juego.exe runs on the OS and the OS on the CPU; the OS just launches the binary, which already speaks the language of the machine.',
    caption: 'The binary already speaks machine language — nobody translates it at runtime.',
    binarioCompilado: '0110 1001 · compiled binary',
    elOsLoLanza: 'the OS just launches it',
    os: 'OS',
    sistemas: 'Windows · macOS · Linux',
    instruccionesDirectas: 'direct instructions',
    cpu: 'CPU',
    ejecutaTalCual: 'runs the binary as is',
  },
  interpretados: {
    eyebrow: 'Concept 3',
    title: (
      <>
        Interpreted programs are run by <span className={s.accent}>an engine</span>
      </>
    ),
    aria: 'The same stack as before with a new floor: the script runs on an engine, the engine on the OS and the OS on the CPU.',
    caption: 'The CPU never sees your script: it sees the engine reading it.',
    texto: 'text',
    elMotorLoLee: 'the engine reads it live',
    motor: 'ENGINE',
    interprete: 'interpreter · one more program, compiled',
    elOsCorreAlMotor: 'the OS runs the engine',
  },
  queEsUnMotor: {
    eyebrow: 'Concept 4 · the definition',
    title: (
      <>
        An engine is a program that runs
        <br />
        to <span className={s.accent}>run programs</span>
      </>
    ),
    aria: 'The engine receives programs, programmed or configured, made of resources, code and configurations, and produces behavior.',
    programas: 'programmed/configured programs',
    recursos: 'resources',
    codigoYConfigs: ' · code · configurations',
    motor: 'ENGINE',
    unProgramaCorriendo: 'a running program',
    comportamiento: 'behavior',
    thMotor: 'Engine',
    thCorre: 'Runs',
    filas: [
      ['browser', 'HTML + JS'],
      ['Python', '.py scripts'],
      ['Unreal / Godot', 'scenes + scripts'],
      ['Wwise', 'Wwise objects'],
    ],
  },
  gameEngines: {
    eyebrow: 'Concept 5',
    title: (
      <>
        A game engine runs <span className={s.accent}>configs and code</span>
      </>
    ),
    aria: 'The resources, external and on top, feed the configurations and the code; the game engine runs everything together and produces the game.',
    caption: 'You configure and code; the engine joins it all with the resources and runs it.',
    recursos: 'RESOURCES',
    recursosDeJuego: 'textures · models · audio',
    usan: 'use',
    configuraciones: 'CONFIGURATIONS',
    configsDeJuego: 'scenes · maps · prefabs',
    codigo: 'CODE',
    scriptsGameplay: 'scripts · gameplay',
    gameEngine: 'GAME ENGINE',
    losCorreJuntos: 'runs them together',
    elJuego: 'the game',
  },
  audioEngines: {
    eyebrow: 'Concept 6',
    title: (
      <>
        The audio engine: <span className={s.accent}>same pattern</span>
      </>
    ),
    aria: 'The game engine diagram shrinks: the resources —songs, sounds and voices— remain, feeding the interactive sound configurations, and the sound engine that runs them and produces the audio.',
    caption: 'Same pattern: resources outside, configured sound, an engine that runs it.',
    recursosDeAudio: 'songs · sounds · voices',
    configsDeAudioLinea1: 'Interactive Sound',
    configsDeAudioLinea2: 'Configurations',
    tracksBusesEvents: 'tracks · buses · events',
    soundEngine: 'SOUND ENGINE',
    losCorre: 'runs them',
    audio: 'audio',
  },
};

export const motorDict = { es, en };
