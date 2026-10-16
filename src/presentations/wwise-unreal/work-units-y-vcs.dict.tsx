import type { ReactNode } from 'react';
import s from '../../components/learn/Deck.module.css';

/* Texts of the deck, one object per language. `es` is the source; keep the `en`
   phrases about the same length (±15 %) so the SVG labels stay in their boxes.
   File and folder names (.wwu, Originals, Binaries…) and Wwise terms (Work Unit,
   Default Work Unit, Project Explorer) are product names and stay as they are. */

export type Veredicto = 'si' | 'no' | 'depende';

export type FilaArchivo = { nombre: string; veredicto: Veredicto; nota: string; lfs?: boolean };

export type WorkUnitsTexts = {
  name: string;
  context: string;
  labels: {
    intro: string;
    /** Steps of the ideas slide: the frame, then one per idea. */
    ideas: string;
    ideaArchivos: string;
    ideaWorkUnit: string;
    ideaRepartir: string;
    /** Steps of the files slide. */
    wwise: string;
    unreal: string;
    binarios: string;
    /** Steps of the Work Unit slide. */
    archivoWwu: string;
    nuevoWorkUnit: string;
    /** Steps of the split slide. */
    solo: string;
    equipo: string;
  };
  cover: { eyebrow: string; title: ReactNode; hint: string };
  ideas: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    items: [string, string, string];
    /** Short forms for the corner scheme of the following slides. */
    cortos: [string, string, string];
    notes: string;
  };
  archivos: {
    eyebrow: string;
    titles: [ReactNode, ReactNode, ReactNode];
    arias: [string, string, string];
    captions: [string, string, string];
    wwise: { titulo: string; filas: FilaArchivo[] };
    unreal: { titulo: string; filas: FilaArchivo[] };
    veredictos: Record<Veredicto, string>;
    binarios: { texto: string; textoEj: string; binario: string; binarioEj: string };
    notes: string;
  };
  workUnit: {
    eyebrow: string;
    titles: [ReactNode, ReactNode];
    arias: [string, string];
    captions: [string, string];
    explorer: string;
    disco: string;
    arbol: { containers: string; defaultWu: string; simple: string; random: string; nuevoWu: string; ambiente: string };
    archivos: { carpeta: string; defaultWu: string; nuevoWu: string };
    sinCambios: string;
    nuevo: string;
    notes: string;
  };
  repartir: {
    eyebrow: string;
    titles: [ReactNode, ReactNode];
    arias: [string, string];
    captions: [string, string];
    containers: string;
    events: string;
    /** The Default Work Unit first, then one per block of the game. */
    filas: [string, string, string, string, string];
    personas: { ana: string; luis: string; ambos: string };
    leyenda: { distinto: string; mismo: string };
    notes: string;
  };
};

const es: WorkUnitsTexts = {
  name: 'Work Units y control de versiones',
  context: 'Wwise 2025.1 · Unreal 5.8 · Git',
  labels: {
    intro: 'intro',
    ideas: 'tres ideas',
    ideaArchivos: 'archivos',
    ideaWorkUnit: 'work unit',
    ideaRepartir: 'repartir',
    wwise: 'wwise',
    unreal: 'unreal',
    binarios: 'binarios',
    archivoWwu: 'un archivo',
    nuevoWorkUnit: 'work unit nuevo',
    solo: 'solo',
    equipo: 'en equipo',
  },
  cover: {
    eyebrow: 'Wwise + Git · lo que se guarda y lo que se regenera',
    title: (
      <>
        Work Units y <span className={s.accent}>control de versiones</span>
      </>
    ),
    hint: 'Navega con ← → · espacio',
  },
  ideas: {
    eyebrow: 'Tres ideas',
    title: (
      <>
        Qué guarda Git de <span className={s.accent}>tu proyecto</span>
      </>
    ),
    aria: 'Tres recuadros en fila con las tres ideas de la clase: qué archivos van a Git, un Work Unit es un archivo, repartir el proyecto.',
    caption: 'Git guarda archivos, no proyectos: todo parte de ahí.',
    items: ['Qué archivos van a Git', 'Un Work Unit es un archivo', 'Repartir el proyecto'],
    cortos: ['archivos', 'work unit', 'repartir'],
    notes:
      'Un proyecto de audio para videojuegos es una carpeta con cientos de archivos que crean dos programas: Wwise y Unreal. Git no sabe qué es Wwise ni qué es Unreal: ve archivos. Por eso la clase empieza por los archivos, sigue por el archivo que más importa en Wwise (el Work Unit) y termina en cómo repartirlos entre personas.',
  },
  archivos: {
    eyebrow: 'Idea 1 · archivos',
    titles: [
      <>
        Fuente sí, <span className={s.accent}>derivado no</span>
      </>,
      <>
        Unreal: lo que el editor <span className={s.accent}>regenera</span> no va
      </>,
      <>
        Texto se compara, <span className={s.accent}>binario</span> no
      </>,
    ],
    arias: [
      'Panel de Wwise con siete archivos y carpetas del proyecto, cada uno con sí, no o depende; las filas entran una a una.',
      'Se añade el panel de Unreal con siete carpetas y archivos, cada uno con sí o no.',
      'Debajo de los dos paneles, dos recuadros: texto se compara línea a línea; binario cambió entero y va por Git LFS.',
    ],
    captions: [
      'Lo que escribiste o importaste va a Git; lo que Wwise recalcula o es de tu usuario, no.',
      'Binaries, Intermediate, Saved y DerivedDataCache se recrean solos; el SDK lo reinstala el Launcher.',
      'Git LFS resuelve el peso de los binarios; que dos personas no editen el mismo lo resuelve la organización.',
    ],
    wwise: {
      titulo: 'WWISE',
      filas: [
        { nombre: 'MiJuego_WW.wproj', veredicto: 'si', nota: 'fuente' },
        { nombre: 'Containers/*.wwu · Events/*.wwu', veredicto: 'si', nota: 'fuente' },
        { nombre: 'Originals/*.wav', veredicto: 'si', nota: 'fuente', lfs: true },
        { nombre: '.cache/', veredicto: 'no', nota: 'se regenera' },
        { nombre: '.backup/ · *.akd · *.prof', veredicto: 'no', nota: 'se regenera' },
        { nombre: '*.wsettings · *.validationcache', veredicto: 'no', nota: 'por usuario' },
        { nombre: 'GeneratedSoundBanks/', veredicto: 'depende', nota: 'Unreal los lee' },
      ],
    },
    unreal: {
      titulo: 'UNREAL',
      filas: [
        { nombre: 'MiJuego_UE.uproject', veredicto: 'si', nota: 'fuente' },
        { nombre: 'Config/*.ini', veredicto: 'si', nota: 'fuente' },
        { nombre: 'Content/*.uasset · *.umap', veredicto: 'si', nota: 'fuente', lfs: true },
        { nombre: 'Plugins/*/Source/', veredicto: 'si', nota: 'código' },
        { nombre: 'Binaries/ · Intermediate/', veredicto: 'no', nota: 'se recompila' },
        { nombre: 'Saved/ · DerivedDataCache/', veredicto: 'no', nota: 'local y cachés' },
        { nombre: 'Plugins/*/ThirdParty/', veredicto: 'no', nota: 'reinstalable' },
      ],
    },
    veredictos: { si: 'sí', no: 'no', depende: 'depende' },
    binarios: {
      texto: 'texto: Git compara línea por línea',
      textoEj: '.wwu · .ini · .uproject',
      binario: 'binario: cambió entero · Git LFS',
      binarioEj: '.wav · .uasset · .umap · .bnk',
    },
    notes:
      'Tres reglas: se versiona la fuente (lo que una persona escribió, importó o configuró), no lo derivado (lo que el programa regenera a partir de la fuente) y no lo personal (preferencias y cachés de tu máquina). El .gitignore es la lista de lo derivado y lo personal.\n\nGeneratedSoundBanks es derivado, pero el proyecto de Unreal lo lee tal cual: si va a Git, cualquiera que clone oye el juego sin abrir Wwise. El riesgo es subir bancos de generaciones distintas; se sube siempre la carpeta completa.\n\nGit LFS guarda en el repositorio un puntero de texto y el archivo real en un almacén aparte del servidor. Resuelve el peso de los .wav y los .uasset; no resuelve que dos personas editen el mismo .umap: eso se evita repartiendo el trabajo.',
  },
  workUnit: {
    eyebrow: 'Idea 2 · Work Units',
    titles: [
      <>
        Un Work Unit es <span className={s.accent}>un archivo .wwu</span>
      </>,
      <>
        Un objeto vive en <span className={s.accent}>un solo archivo</span>
      </>,
    ],
    arias: [
      'A la izquierda el árbol del Project Explorer: Containers, Default Work Unit, simple y Random. A la derecha el disco: la carpeta Containers con el archivo Default Work Unit.wwu. Una flecha une el Work Unit con su archivo.',
      'Se añade el Work Unit WU_Ambiente con amb_bosque_loop a la izquierda y el archivo WU_Ambiente.wwu a la derecha, marcado nuevo; el Default Work Unit.wwu queda sin cambios.',
    ],
    captions: [
      'Lo que ves en el Project Explorer es la suma de archivos de texto, uno por Work Unit.',
      'Crear en WU_Ambiente no toca el Default Work Unit: para Git hay un archivo nuevo y ninguno modificado.',
    ],
    explorer: 'PROJECT EXPLORER',
    disco: 'EN EL DISCO',
    arbol: {
      containers: 'Containers',
      defaultWu: 'Default Work Unit',
      simple: 'simple',
      random: 'Random',
      nuevoWu: 'WU_Ambiente',
      ambiente: 'amb_bosque_loop',
    },
    archivos: { carpeta: 'Containers/', defaultWu: 'Default Work Unit.wwu', nuevoWu: 'WU_Ambiente.wwu' },
    sinCambios: 'sin cambios',
    nuevo: 'nuevo',
    notes:
      'Cada categoría del proyecto (Containers, Events, Busses, States…) tiene su carpeta en el disco y, dentro, al menos un archivo: el Default Work Unit. Es un XML con los objetos de esa categoría: cada objeto tiene un ID único, solo se escriben las propiedades que cambiaste y el audio no está en el archivo, solo la ruta al .wav dentro de Originals.\n\nUn objeto vive en un solo Work Unit. Si lo arrastras a otro, desaparece de un archivo y aparece en el otro. Los Default Work Units no se renombran ni se borran: si faltan, Wwise los recrea vacíos.',
  },
  repartir: {
    eyebrow: 'Idea 3 · repartir',
    titles: [
      <>
        Solo: un Work Unit <span className={s.accent}>por bloque</span>
      </>,
      <>
        Equipo: una persona <span className={s.accent}>por archivo</span>
      </>,
    ],
    arias: [
      'Dos columnas, Containers y Events, cada una con el Default Work Unit y cuatro Work Units: personaje, ambiente, interfaz y música.',
      'Se añaden etiquetas con nombres de personas: Ana en personaje, Luis en ambiente; en interfaz están los dos y el archivo se marca en rojo como conflicto.',
    ],
    captions: [
      'El mismo nombre en Containers y en Events: cada bloque del juego son dos archivos.',
      'Archivos distintos se combinan solos; el mismo archivo editado a la vez da un conflicto.',
    ],
    containers: 'Containers/',
    events: 'Events/',
    filas: ['Default Work Unit.wwu', 'WU_Personaje.wwu', 'WU_Ambiente.wwu', 'WU_UI.wwu', 'WU_Musica.wwu'],
    personas: { ana: 'Ana', luis: 'Luis', ambos: 'Ana · Luis' },
    leyenda: { distinto: 'archivos distintos: Git combina solo', mismo: 'mismo archivo: conflicto' },
    notes:
      'Trabajando solo, el Default Work Unit basta al principio; divide cuando el proyecto crezca. Un Work Unit por bloque del juego, con el mismo nombre en Containers y en Events, hace que cada commit cuente de qué trata. Para crear uno: clic derecho sobre la carpeta física > New Child > Work Unit.\n\nEn equipo hay un solo proyecto Wwise por juego y cada persona trabaja en sus Work Units. Reglas: una persona por Work Unit a la vez, pull antes de empezar, guardar Wwise antes de hacer commit, commits pequeños, y no mover objetos entre Work Units mientras otra persona los edita. Wwise trae plug-ins para Perforce y Subversion, no para Git: con Git se trabaja desde Fork o la terminal, y Wwise avisa de los cambios externos.',
  },
};

const en: WorkUnitsTexts = {
  name: 'Work Units and version control',
  context: 'Wwise 2025.1 · Unreal 5.8 · Git',
  labels: {
    intro: 'intro',
    ideas: 'three ideas',
    ideaArchivos: 'files',
    ideaWorkUnit: 'work unit',
    ideaRepartir: 'splitting',
    wwise: 'wwise',
    unreal: 'unreal',
    binarios: 'binaries',
    archivoWwu: 'one file',
    nuevoWorkUnit: 'new work unit',
    solo: 'solo',
    equipo: 'as a team',
  },
  cover: {
    eyebrow: 'Wwise + Git · what is kept and what is regenerated',
    title: (
      <>
        Work Units and <span className={s.accent}>version control</span>
      </>
    ),
    hint: 'Navigate with ← → · space',
  },
  ideas: {
    eyebrow: 'Three ideas',
    title: (
      <>
        What Git keeps of <span className={s.accent}>your project</span>
      </>
    ),
    aria: 'Three boxes in a row with the three ideas of the class: which files go to Git, a Work Unit is a file, splitting the project.',
    caption: 'Git keeps files, not projects: everything starts there.',
    items: ['Which files go to Git', 'A Work Unit is a file', 'Splitting the project'],
    cortos: ['files', 'work unit', 'splitting'],
    notes:
      'A game audio project is a folder with hundreds of files created by two programs: Wwise and Unreal. Git does not know what Wwise or Unreal are: it sees files. So the class starts with the files, moves on to the file that matters most in Wwise (the Work Unit) and ends with how to split them among people.',
  },
  archivos: {
    eyebrow: 'Idea 1 · files',
    titles: [
      <>
        Source yes, <span className={s.accent}>derived no</span>
      </>,
      <>
        Unreal: what the editor <span className={s.accent}>regenerates</span> stays out
      </>,
      <>
        Text can be compared, <span className={s.accent}>binary</span> cannot
      </>,
    ],
    arias: [
      'Wwise panel with seven files and folders of the project, each marked yes, no or depends; the rows enter one by one.',
      'The Unreal panel is added with seven folders and files, each marked yes or no.',
      'Below both panels, two boxes: text is compared line by line; binary changed as a whole and goes through Git LFS.',
    ],
    captions: [
      'What you wrote or imported goes to Git; what Wwise recomputes or belongs to your user does not.',
      'Binaries, Intermediate, Saved and DerivedDataCache rebuild themselves; the Launcher reinstalls the SDK.',
      'Git LFS solves the weight of binaries; keeping two people off the same one is solved by organization.',
    ],
    wwise: {
      titulo: 'WWISE',
      filas: [
        { nombre: 'MyGame_WW.wproj', veredicto: 'si', nota: 'source' },
        { nombre: 'Containers/*.wwu · Events/*.wwu', veredicto: 'si', nota: 'source' },
        { nombre: 'Originals/*.wav', veredicto: 'si', nota: 'source', lfs: true },
        { nombre: '.cache/', veredicto: 'no', nota: 'regenerated' },
        { nombre: '.backup/ · *.akd · *.prof', veredicto: 'no', nota: 'regenerated' },
        { nombre: '*.wsettings · *.validationcache', veredicto: 'no', nota: 'per user' },
        { nombre: 'GeneratedSoundBanks/', veredicto: 'depende', nota: 'Unreal reads it' },
      ],
    },
    unreal: {
      titulo: 'UNREAL',
      filas: [
        { nombre: 'MyGame_UE.uproject', veredicto: 'si', nota: 'source' },
        { nombre: 'Config/*.ini', veredicto: 'si', nota: 'source' },
        { nombre: 'Content/*.uasset · *.umap', veredicto: 'si', nota: 'source', lfs: true },
        { nombre: 'Plugins/*/Source/', veredicto: 'si', nota: 'code' },
        { nombre: 'Binaries/ · Intermediate/', veredicto: 'no', nota: 'recompiled' },
        { nombre: 'Saved/ · DerivedDataCache/', veredicto: 'no', nota: 'local · caches' },
        { nombre: 'Plugins/*/ThirdParty/', veredicto: 'no', nota: 'reinstallable' },
      ],
    },
    veredictos: { si: 'yes', no: 'no', depende: 'depends' },
    binarios: {
      texto: 'text: Git compares line by line',
      textoEj: '.wwu · .ini · .uproject',
      binario: 'binary: changed as a whole · Git LFS',
      binarioEj: '.wav · .uasset · .umap · .bnk',
    },
    notes:
      'Three rules: version the source (what a person wrote, imported or configured), not the derived (what the program regenerates from the source) and not the personal (preferences and caches of your machine). The .gitignore is the list of the derived and the personal.\n\nGeneratedSoundBanks is derived, but the Unreal project reads it as is: if it goes to Git, anyone who clones hears the game without opening Wwise. The risk is pushing banks from different generations; always push the whole folder.\n\nGit LFS keeps a text pointer in the repository and the real file in a separate store on the server. It solves the weight of .wav and .uasset files; it does not solve two people editing the same .umap: that is avoided by splitting the work.',
  },
  workUnit: {
    eyebrow: 'Idea 2 · Work Units',
    titles: [
      <>
        A Work Unit is <span className={s.accent}>a .wwu file</span>
      </>,
      <>
        An object lives in <span className={s.accent}>one file only</span>
      </>,
    ],
    arias: [
      'On the left the Project Explorer tree: Containers, Default Work Unit, simple and Random. On the right the disk: the Containers folder with the file Default Work Unit.wwu. An arrow joins the Work Unit to its file.',
      'The Work Unit WU_Ambiente with amb_bosque_loop is added on the left and the file WU_Ambiente.wwu on the right, marked new; Default Work Unit.wwu stays unchanged.',
    ],
    captions: [
      'What you see in the Project Explorer is the sum of text files, one per Work Unit.',
      'Creating inside WU_Ambiente does not touch the Default Work Unit: for Git there is one new file and none modified.',
    ],
    explorer: 'PROJECT EXPLORER',
    disco: 'ON DISK',
    arbol: {
      containers: 'Containers',
      defaultWu: 'Default Work Unit',
      simple: 'simple',
      random: 'Random',
      nuevoWu: 'WU_Ambiente',
      ambiente: 'amb_bosque_loop',
    },
    archivos: { carpeta: 'Containers/', defaultWu: 'Default Work Unit.wwu', nuevoWu: 'WU_Ambiente.wwu' },
    sinCambios: 'unchanged',
    nuevo: 'new',
    notes:
      'Each category of the project (Containers, Events, Busses, States…) has its folder on disk and, inside, at least one file: the Default Work Unit. It is an XML with the objects of that category: every object has a unique ID, only the properties you changed are written, and the audio is not in the file, only the path to the .wav inside Originals.\n\nAn object lives in one Work Unit only. If you drag it to another one, it disappears from one file and appears in the other. Default Work Units are never renamed or deleted: if they are missing, Wwise recreates them empty.',
  },
  repartir: {
    eyebrow: 'Idea 3 · splitting',
    titles: [
      <>
        Solo: one Work Unit <span className={s.accent}>per block</span>
      </>,
      <>
        Team: one person <span className={s.accent}>per file</span>
      </>,
    ],
    arias: [
      'Two columns, Containers and Events, each with the Default Work Unit and four Work Units: character, ambience, interface and music.',
      'Tags with people names are added: Ana on character, Luis on ambience; on interface both of them, and the file is marked red as a conflict.',
    ],
    captions: [
      'The same name in Containers and in Events: each block of the game is two files.',
      'Different files merge on their own; the same file edited at once gives a conflict.',
    ],
    containers: 'Containers/',
    events: 'Events/',
    filas: ['Default Work Unit.wwu', 'WU_Personaje.wwu', 'WU_Ambiente.wwu', 'WU_UI.wwu', 'WU_Musica.wwu'],
    personas: { ana: 'Ana', luis: 'Luis', ambos: 'Ana · Luis' },
    leyenda: { distinto: 'different files: Git merges alone', mismo: 'same file: conflict' },
    notes:
      'Working alone, the Default Work Unit is enough at first; split when the project grows. One Work Unit per block of the game, with the same name in Containers and in Events, makes every commit tell what it is about. To create one: right-click the physical folder > New Child > Work Unit.\n\nIn a team there is one Wwise project per game and each person works in their own Work Units. Rules: one person per Work Unit at a time, pull before starting, save Wwise before committing, small commits, and never move objects between Work Units while someone else edits them. Wwise ships plug-ins for Perforce and Subversion, not for Git: with Git you work from Fork or the terminal, and Wwise warns about external changes.',
  },
};

export const workUnitsDict = { es, en };
