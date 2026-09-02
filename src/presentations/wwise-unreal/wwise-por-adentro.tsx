import Deck, { Slide } from '../../components/incine/Deck';
import s from '../../components/incine/Deck.module.css';

export default function WwisePorAdentro() {
  return (
    <Deck name="Wwise por adentro" context="Intro a Wwise · Wwise + Unreal">
      <Slide z="↺" label="recap">
        <div className={s.eyebrow}>Recap · donde quedamos</div>
        <h2>
          Wwise: <span className={s.accent}>el mismo patrón</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 910 220"
            role="img"
            aria-label="Los recursos —canciones, sonidos y voces— alimentan a los Wwise objects; de ahí salen SoundBanks que el sound engine corre para producir el audio."
          >
            <defs>
              <marker id="arrW1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
              <marker id="arrW1t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#63b6a4" />
              </marker>
            </defs>
            <rect x="40" y="20" width="230" height="56" rx="8" fill="#1d2026" stroke="#63b6a4" />
            <text x="155" y="44" fontSize="12" fill="#63b6a4" textAnchor="middle">RECURSOS</text>
            <text x="155" y="63" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">canciones · sonidos · voces</text>
            <path d="M 155 76 L 155 138 Q 155 150 167 150 L 292 150" fill="none" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrW1t)" />
            <text x="143" y="112" fontSize="10.5" fill="#63b6a4" textAnchor="end">usan</text>
            <rect x="300" y="120" width="250" height="60" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
            <text x="425" y="144" fontSize="12" fill="#f2a33c" textAnchor="middle">WWISE OBJECT</text>
            <text x="425" y="163" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">segments · containers · events</text>
            <line x1="550" y1="150" x2="644" y2="150" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrW1)" />
            <text x="597" y="138" fontSize="11" fill="#f2a33c" textAnchor="middle">SoundBanks</text>
            <rect x="650" y="115" width="200" height="70" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="750" y="144" fontSize="13" fill="#f2a33c" textAnchor="middle">SOUND ENGINE</text>
            <text x="750" y="163" fontSize="10.5" fill="currentColor" opacity=".65" textAnchor="middle">los corre</text>
            <line x1="850" y1="150" x2="884" y2="150" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrW1)" />
            <text className={s.svgSans} x="860" y="138" fontSize="12" fill="currentColor" textAnchor="middle">audio</text>
          </svg>
          <figcaption>Mismo patrón: recursos afuera, objects configurados, un engine que los corre.</figcaption>
        </figure>
      </Slide>

      <Slide z="1" label="punta a punta">
        <div className={s.eyebrow}>Concepto 1 · el mapa completo</div>
        <h2>
          Wwise <span className={s.accent}>de punta a punta</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 960 430"
            role="img"
            aria-label="Los audio clips entran al Wwise project y las configuraciones del diseñador a los Wwise Objects; el Wwise editor genera SoundBanks hacia el proyecto del engine; en el build, el juego hace Wwise calls al Wwise engine, que corre los SoundBanks cargados y produce el audio."
          >
            <defs>
              <marker id="arrW2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>

            <text x="24" y="110" fontSize="12" fill="currentColor">audio clips</text>
            <line x1="24" y1="120" x2="160" y2="120" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrW2)" />
            <text x="24" y="158" fontSize="12" fill="currentColor">configs del diseñador</text>
            <line x1="24" y1="168" x2="174" y2="168" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrW2)" />

            <rect x="150" y="60" width="210" height="170" rx="10" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="166" y="88" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">WWISE EDITOR</text>
            <rect x="170" y="104" width="170" height="110" rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity=".8" />
            <text x="255" y="126" fontSize="12" fill="currentColor" textAnchor="middle">Wwise project</text>
            <rect x="184" y="142" width="142" height="52" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".8" />
            <text x="255" y="172" fontSize="11.5" fill="currentColor" textAnchor="middle">Wwise Objects</text>
            <path d="M 255 214 L 255 316 Q 255 328 267 328 L 444 328" fill="none" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrW2)" />
            <text x="355" y="318" fontSize="11" fill="#f2a33c" textAnchor="middle">genera SoundBanks</text>

            <rect x="430" y="40" width="240" height="360" rx="10" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="446" y="68" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">ENGINE EDITOR</text>
            <text x="446" y="86" fontSize="10.5" fill="currentColor" opacity=".45">engine project</text>
            <rect x="450" y="100" width="200" height="56" rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity=".8" />
            <text x="550" y="124" fontSize="12" fill="currentColor" textAnchor="middle">Wwise code calls</text>
            <text x="550" y="142" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">tu código de audio</text>
            <line x1="515" y1="192" x2="515" y2="160" stroke="#f2a33c" strokeWidth="1.5" markerEnd="url(#arrW2)" />
            <line x1="545" y1="160" x2="545" y2="192" stroke="#f2a33c" strokeWidth="1.5" markerEnd="url(#arrW2)" />
            <rect x="450" y="196" width="200" height="56" rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity=".8" />
            <text x="550" y="220" fontSize="12" fill="currentColor" textAnchor="middle">Wwise plugin</text>
            <text x="550" y="238" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">la API en el editor</text>
            <rect x="450" y="300" width="200" height="56" rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity=".8" />
            <text x="550" y="324" fontSize="12" fill="currentColor" textAnchor="middle">Wwise SoundBanks</text>
            <text x="550" y="342" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">.bnk · estructura + media</text>

            <rect x="700" y="40" width="210" height="360" rx="10" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="716" y="64" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">WRAPPER · BUILD</text>
            <rect x="716" y="76" width="178" height="96" rx="8" fill="none" stroke="currentColor" strokeOpacity=".5" />
            <text x="728" y="94" fontSize="11" fill="currentColor" opacity=".65">GAME</text>
            <rect x="728" y="102" width="154" height="52" rx="8" fill="#232730" stroke="#f2a33c" />
            <text x="805" y="124" fontSize="12" fill="currentColor" textAnchor="middle">Wwise calls</text>
            <text x="805" y="141" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">tu código</text>
            <rect x="716" y="232" width="178" height="140" rx="8" fill="none" stroke="#f2a33c" strokeOpacity=".9" />
            <text x="728" y="254" fontSize="11" fill="#f2a33c">WWISE ENGINE</text>
            <rect x="728" y="302" width="154" height="52" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".8" />
            <text x="805" y="324" fontSize="12" fill="currentColor" textAnchor="middle">SoundBanks</text>
            <text x="805" y="341" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">cargados</text>
            <line x1="785" y1="158" x2="785" y2="296" stroke="#f2a33c" strokeWidth="1.5" markerEnd="url(#arrW2)" />
            <line x1="825" y1="158" x2="825" y2="296" stroke="#f2a33c" strokeWidth="1.5" markerEnd="url(#arrW2)" />

            <line x1="650" y1="128" x2="722" y2="128" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrW2)" />
            <path d="M 650 224 L 736 224 Q 748 224 748 232" fill="none" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrW2)" />
            <line x1="650" y1="328" x2="722" y2="328" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrW2)" />

            <line x1="894" y1="302" x2="944" y2="302" stroke="#f2a33c" strokeWidth="2.5" markerEnd="url(#arrW2)" />
            <text className={s.svgSans} x="919" y="290" fontSize="13" fill="currentColor" textAnchor="middle">AUDIO</text>
          </svg>
          <figcaption>
            Objects configurados + audios → SoundBanks · el juego solo usa la interface: los calls.
          </figcaption>
        </figure>
      </Slide>
    </Deck>
  );
}
