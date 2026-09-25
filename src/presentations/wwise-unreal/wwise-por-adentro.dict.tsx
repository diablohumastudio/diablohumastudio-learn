import type { ReactNode } from 'react';
import s from '../../components/learn/Deck.module.css';

/* Texts of the deck, one object per language. `es` is the source; keep the `en`
   phrases about the same length (±15 %) so the SVG labels stay in their boxes. */

type WwisePorAdentroTexts = {
  name: string;
  context: string;
  labels: { recap: string; puntaAPunta: string };
  recap: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    wwiseObjects: string;
    recursosDeAudio: string;
    soundEngine: string;
    losCorre: string;
    audio: string;
    soundBanks: string;
  };
  puntaAPunta: {
    eyebrow: string;
    title: ReactNode;
    aria: string;
    caption: string;
    audioClips: string;
    configsDelDisenador: string;
    wwiseEditor: string;
    wwiseProject: string;
    wwiseObjects: string;
    generaSoundBanks: string;
    engineEditor: string;
    engineProject: string;
    wwiseCodeCalls: string;
    tuCodigoDeAudio: string;
    wwisePlugin: string;
    laApiEnElEditor: string;
    wwiseSoundBanks: string;
    bnk: string;
    wrapperBuild: string;
    game: string;
    wwiseCalls: string;
    tuCodigo: string;
    wwiseEngine: string;
    soundBanks: string;
    cargados: string;
    audio: string;
  };
};

const es: WwisePorAdentroTexts = {
  name: 'Wwise por adentro',
  context: 'Intro a Wwise · Wwise + Unreal',
  labels: { recap: 'recap', puntaAPunta: 'punta a punta' },
  recap: {
    eyebrow: 'Recap · donde quedamos',
    title: (
      <>
        Wwise: <span className={s.accent}>el mismo patrón</span>
      </>
    ),
    aria: 'Los Wwise objects, con sus canciones, sonidos y voces, entran como SoundBanks al sound engine, que los corre y produce el audio.',
    caption: 'Mismo patrón: recursos afuera, objects configurados, un engine que los corre.',
    wwiseObjects: 'WWISE OBJECTS',
    recursosDeAudio: 'canciones · sonidos · voces',
    soundEngine: 'SOUND ENGINE',
    losCorre: 'los corre',
    audio: 'audio',
    soundBanks: 'SoundBanks',
  },
  puntaAPunta: {
    eyebrow: 'Concepto 1 · el mapa completo',
    title: (
      <>
        Wwise <span className={s.accent}>de punta a punta</span>
      </>
    ),
    aria: 'Los audio clips entran al Wwise project y las configuraciones del diseñador a los Wwise Objects; el Wwise editor genera SoundBanks hacia el proyecto del engine; en el build, el juego hace Wwise calls al Wwise engine, que corre los SoundBanks cargados y produce el audio.',
    caption: 'Objects configurados + audios → SoundBanks · el juego solo usa la interface: los calls.',
    audioClips: 'audio clips',
    configsDelDisenador: 'configs del diseñador',
    wwiseEditor: 'WWISE EDITOR',
    wwiseProject: 'Wwise project',
    wwiseObjects: 'Wwise Objects',
    generaSoundBanks: 'genera SoundBanks',
    engineEditor: 'ENGINE EDITOR',
    engineProject: 'engine project',
    wwiseCodeCalls: 'Wwise code calls',
    tuCodigoDeAudio: 'tu código de audio',
    wwisePlugin: 'Wwise plugin',
    laApiEnElEditor: 'la API en el editor',
    wwiseSoundBanks: 'Wwise SoundBanks',
    bnk: '.bnk · estructura + media',
    wrapperBuild: 'WRAPPER · BUILD',
    game: 'GAME',
    wwiseCalls: 'Wwise calls',
    tuCodigo: 'tu código',
    wwiseEngine: 'WWISE ENGINE',
    soundBanks: 'SoundBanks',
    cargados: 'cargados',
    audio: 'AUDIO',
  },
};

const en: WwisePorAdentroTexts = {
  name: 'Wwise from the inside',
  context: 'Intro to Wwise · Wwise + Unreal',
  labels: { recap: 'recap', puntaAPunta: 'end to end' },
  recap: {
    eyebrow: 'Recap · where we left off',
    title: (
      <>
        Wwise: <span className={s.accent}>the same pattern</span>
      </>
    ),
    aria: 'The Wwise objects, with their songs, sounds and voices, go as SoundBanks into the sound engine, which runs them and produces the audio.',
    caption: 'Same pattern: resources outside, configured objects, an engine that runs them.',
    wwiseObjects: 'WWISE OBJECTS',
    recursosDeAudio: 'songs · sounds · voices',
    soundEngine: 'SOUND ENGINE',
    losCorre: 'runs them',
    audio: 'audio',
    soundBanks: 'SoundBanks',
  },
  puntaAPunta: {
    eyebrow: 'Concept 1 · the full map',
    title: (
      <>
        Wwise <span className={s.accent}>end to end</span>
      </>
    ),
    aria: 'The audio clips enter the Wwise project and the designer configurations go into the Wwise Objects; the Wwise editor generates SoundBanks into the engine project; in the build, the game makes Wwise calls to the Wwise engine, which runs the loaded SoundBanks and produces the audio.',
    caption: 'Configured objects + audio → SoundBanks · the game only uses the interface: the calls.',
    audioClips: 'audio clips',
    configsDelDisenador: "designer's configs",
    wwiseEditor: 'WWISE EDITOR',
    wwiseProject: 'Wwise project',
    wwiseObjects: 'Wwise Objects',
    generaSoundBanks: 'generates SoundBanks',
    engineEditor: 'ENGINE EDITOR',
    engineProject: 'engine project',
    wwiseCodeCalls: 'Wwise code calls',
    tuCodigoDeAudio: 'your audio code',
    wwisePlugin: 'Wwise plugin',
    laApiEnElEditor: 'the API in the editor',
    wwiseSoundBanks: 'Wwise SoundBanks',
    bnk: '.bnk · structure + media',
    wrapperBuild: 'WRAPPER · BUILD',
    game: 'GAME',
    wwiseCalls: 'Wwise calls',
    tuCodigo: 'your code',
    wwiseEngine: 'WWISE ENGINE',
    soundBanks: 'SoundBanks',
    cargados: 'loaded',
    audio: 'AUDIO',
  },
};

export const wwisePorAdentroDict = { es, en };
