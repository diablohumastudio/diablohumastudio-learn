import Deck, { Slide } from '../../components/incine/Deck';
import s from '../../components/incine/Deck.module.css';

export default function QueEsUnMotorDeAudio() {
  return (
    <Deck name="¿Qué es un motor de audio?" context="Intro a Wwise · Wwise + Unreal">
      <Slide z="▶" label="intro">
        <div className={s.eyebrow}>Intro a Wwise · de lenguajes a motores</div>
        <h1>
          ¿Qué es un motor
          <br />
          de <span className={s.accent}>audio</span>?
        </h1>
        <p className={s.note}>Navega con ← → · espacio</p>
      </Slide>

      <Slide z="1" label="lenguajes">
        <div className={s.eyebrow}>Concepto 1</div>
        <h2>
          Compilados <span className={s.teal}>vs</span> interpretados
        </h2>
        <figure>
          <svg
            viewBox="0 0 900 300"
            role="img"
            aria-label="Un programa compilado se traduce una vez a binario antes de correr; un programa interpretado sigue siendo texto y alguien tiene que leerlo en vivo."
          >
            <defs>
              <marker id="arrS2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>
            <line x1="450" y1="20" x2="450" y2="280" stroke="currentColor" strokeOpacity=".15" strokeDasharray="4 6" />

            <text x="230" y="32" fontSize="13" fill="#f2a33c" letterSpacing="3" textAnchor="middle">COMPILADO</text>
            <rect x="150" y="50" width="160" height="52" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="230" y="72" fontSize="13" fill="currentColor" textAnchor="middle">main.c</text>
            <text x="230" y="91" fontSize="10.5" fill="currentColor" opacity=".55" textAnchor="middle">texto</text>
            <line x1="230" y1="102" x2="230" y2="124" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS2)" />
            <rect x="130" y="128" width="200" height="52" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
            <text x="230" y="150" fontSize="13" fill="#f2a33c" textAnchor="middle">COMPILADOR</text>
            <text x="230" y="169" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">una vez · antes de correr</text>
            <line x1="230" y1="180" x2="230" y2="202" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS2)" />
            <rect x="150" y="206" width="160" height="52" rx="8" fill="#232730" stroke="#f2a33c" />
            <text x="230" y="228" fontSize="13" fill="currentColor" textAnchor="middle">0110 1001</text>
            <text x="230" y="247" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">binario</text>
            <text x="230" y="286" fontSize="12" fill="currentColor" opacity=".6" textAnchor="middle">listo para la CPU</text>

            <text x="670" y="32" fontSize="13" fill="#63b6a4" letterSpacing="3" textAnchor="middle">INTERPRETADO</text>
            <rect x="590" y="50" width="160" height="52" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="670" y="72" fontSize="13" fill="currentColor" textAnchor="middle">player.gd</text>
            <text x="670" y="91" fontSize="10.5" fill="currentColor" opacity=".55" textAnchor="middle">texto</text>
            <line x1="670" y1="102" x2="670" y2="202" stroke="currentColor" strokeOpacity=".4" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="686" y="156" fontSize="11" fill="currentColor" opacity=".55">no se traduce</text>
            <rect x="590" y="206" width="160" height="52" rx="8" fill="#1d2026" stroke="#63b6a4" strokeDasharray="5 4" />
            <text x="670" y="228" fontSize="13" fill="currentColor" textAnchor="middle">player.gd</text>
            <text x="670" y="247" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">sigue siendo texto</text>
            <text x="670" y="286" fontSize="12" fill="#63b6a4" textAnchor="middle">¿quién lo lee entonces?</text>
          </svg>
          <figcaption>Traducido una vez, antes — o leído en vivo, cada vez.</figcaption>
        </figure>
      </Slide>

      <Slide z="2" label="compilados">
        <div className={s.eyebrow}>Concepto 2</div>
        <h2>
          A los compilados los corre <span className={s.accent}>el OS</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 900 270"
            role="img"
            aria-label="El binario corre sobre el OS y el OS sobre la CPU; el OS solo lanza el binario, que ya habla el idioma de la máquina."
          >
            <defs>
              <marker id="arrS3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>
            <rect x="170" y="26" width="560" height="54" rx="8" fill="#232730" stroke="#f2a33c" />
            <text x="450" y="49" fontSize="14" fill="currentColor" textAnchor="middle">game.exe</text>
            <text x="450" y="68" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">binario compilado</text>
            <line x1="450" y1="80" x2="450" y2="108" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS3)" />
            <text x="470" y="98" fontSize="11.5" fill="#f2a33c">el OS solo lo lanza</text>
            <rect x="170" y="112" width="560" height="54" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text className={s.svgSans} x="450" y="135" fontSize="15" fontWeight="600" fill="currentColor" textAnchor="middle">OS</text>
            <text x="450" y="155" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">Windows · macOS · Linux</text>
            <line x1="450" y1="166" x2="450" y2="194" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS3)" />
            <text x="470" y="184" fontSize="11.5" fill="currentColor" opacity=".65">instrucciones directas</text>
            <rect x="170" y="198" width="560" height="54" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text className={s.svgSans} x="450" y="221" fontSize="15" fontWeight="600" fill="currentColor" textAnchor="middle">CPU</text>
            <text x="450" y="241" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">ejecuta el binario tal cual</text>
          </svg>
          <figcaption>El binario ya habla idioma de máquina — nadie lo traduce en runtime.</figcaption>
        </figure>
      </Slide>

      <Slide z="3" label="interpretados">
        <div className={s.eyebrow}>Concepto 3</div>
        <h2>
          A los interpretados los corre <span className={s.accent}>un motor</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 900 330"
            role="img"
            aria-label="El mismo stack anterior con un piso nuevo: el script corre sobre un motor, el motor sobre el OS y el OS sobre la CPU."
          >
            <defs>
              <marker id="arrS4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>
            <rect x="170" y="20" width="560" height="50" rx="8" fill="#1d2026" stroke="#63b6a4" />
            <text x="450" y="41" fontSize="13" fill="currentColor" textAnchor="middle">player.gd</text>
            <text x="450" y="60" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">texto</text>
            <line x1="450" y1="70" x2="450" y2="94" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS4)" />
            <text x="470" y="87" fontSize="11.5" fill="#f2a33c">el motor lo lee en vivo</text>
            <rect x="170" y="98" width="560" height="50" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="450" y="119" fontSize="14" fill="#f2a33c" textAnchor="middle">MOTOR</text>
            <text x="450" y="138" fontSize="11" fill="currentColor" opacity=".65" textAnchor="middle">intérprete · un programa más, compilado</text>
            <line x1="450" y1="148" x2="450" y2="172" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS4)" />
            <text x="470" y="165" fontSize="11.5" fill="currentColor" opacity=".65">el OS corre al motor</text>
            <rect x="170" y="176" width="560" height="50" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text className={s.svgSans} x="450" y="205" fontSize="15" fontWeight="600" fill="currentColor" textAnchor="middle">OS</text>
            <line x1="450" y1="226" x2="450" y2="250" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS4)" />
            <rect x="170" y="254" width="560" height="50" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text className={s.svgSans} x="450" y="283" fontSize="15" fontWeight="600" fill="currentColor" textAnchor="middle">CPU</text>
          </svg>
          <figcaption>La CPU nunca ve tu script: ve al motor leyéndolo.</figcaption>
        </figure>
      </Slide>

      <Slide z="4" label="qué es un motor">
        <div className={s.eyebrow}>Concepto 4 · la definición</div>
        <h2>
          Un motor es un programa que corre
          <br />
          para <span className={s.accent}>correr programas</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 900 190"
            role="img"
            aria-label="El motor recibe programas en código o en configuraciones de datos, y produce comportamiento."
          >
            <defs>
              <marker id="arrS5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>
            <rect x="40" y="26" width="240" height="56" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="160" y="49" fontSize="12" fill="#f2a33c" textAnchor="middle">PROGRAMADOS</text>
            <text x="160" y="68" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">código · scripts</text>
            <rect x="40" y="108" width="240" height="56" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="160" y="131" fontSize="12" fill="#f2a33c" textAnchor="middle">CONFIGURADOS</text>
            <text x="160" y="150" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">solo datos · sin código</text>
            <line x1="280" y1="54" x2="368" y2="86" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS5)" />
            <line x1="280" y1="136" x2="368" y2="104" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS5)" />
            <rect x="374" y="66" width="220" height="58" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="484" y="90" fontSize="15" fill="#f2a33c" textAnchor="middle">MOTOR</text>
            <text x="484" y="110" fontSize="10.5" fill="currentColor" opacity=".65" textAnchor="middle">un programa corriendo</text>
            <line x1="594" y1="95" x2="700" y2="95" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS5)" />
            <text className={s.svgSans} x="712" y="100" fontSize="14" fill="currentColor">comportamiento</text>
          </svg>
        </figure>
        <table className={s.plain}>
          <thead>
            <tr>
              <th>Motor</th>
              <th>Corre</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>navegador</td>
              <td>HTML + JS</td>
            </tr>
            <tr>
              <td>Python</td>
              <td>scripts .py</td>
            </tr>
            <tr>
              <td>Unreal / Godot</td>
              <td>escenas + scripts</td>
            </tr>
            <tr>
              <td>Wwise</td>
              <td>Wwise objects</td>
            </tr>
          </tbody>
        </table>
      </Slide>

      <Slide z="5" label="game engines">
        <div className={s.eyebrow}>Concepto 5</div>
        <h2>
          Un game engine corre <span className={s.accent}>configs y código</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 910 260"
            role="img"
            aria-label="Las configuraciones y el código usan recursos; el game engine corre todo junto y produce el juego."
          >
            <defs>
              <marker id="arrS6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
              <marker id="arrS6t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#63b6a4" />
              </marker>
            </defs>
            <rect x="30" y="98" width="210" height="64" rx="8" fill="#1d2026" stroke="#63b6a4" />
            <text x="135" y="123" fontSize="12" fill="#63b6a4" textAnchor="middle">RECURSOS</text>
            <text x="135" y="142" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">texturas · modelos · audios</text>
            <line x1="240" y1="112" x2="294" y2="76" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrS6t)" />
            <line x1="240" y1="148" x2="294" y2="184" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrS6t)" />
            <text x="262" y="66" fontSize="10.5" fill="#63b6a4">usan</text>
            <text x="262" y="200" fontSize="10.5" fill="#63b6a4">usan</text>
            <rect x="300" y="40" width="250" height="64" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
            <text x="425" y="65" fontSize="12" fill="#f2a33c" textAnchor="middle">CONFIGURACIONES</text>
            <text x="425" y="84" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">escenas · maps · prefabs</text>
            <rect x="300" y="156" width="250" height="64" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
            <text x="425" y="181" fontSize="12" fill="#f2a33c" textAnchor="middle">CÓDIGO</text>
            <text x="425" y="200" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">scripts · gameplay</text>
            <line x1="550" y1="72" x2="614" y2="112" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS6)" />
            <line x1="550" y1="188" x2="614" y2="148" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS6)" />
            <rect x="620" y="96" width="200" height="68" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="720" y="123" fontSize="13" fill="#f2a33c" textAnchor="middle">GAME ENGINE</text>
            <text x="720" y="142" fontSize="10.5" fill="currentColor" opacity=".65" textAnchor="middle">los corre juntos</text>
            <line x1="820" y1="130" x2="876" y2="130" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS6)" />
            <text className={s.svgSans} x="848" y="118" fontSize="12" fill="currentColor" textAnchor="middle">el juego</text>
          </svg>
          <figcaption>Configuras y programas; el engine junta todo con los recursos y lo corre.</figcaption>
        </figure>
      </Slide>

      <Slide z="6" label="audio engines">
        <div className={s.eyebrow}>Concepto 6 · Wwise de punta a punta</div>
        <h2>
          El motor de audio: <span className={s.accent}>mismo patrón</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 960 430"
            role="img"
            aria-label="Los audio clips y las configuraciones del diseñador entran al Wwise editor, que genera SoundBanks hacia el proyecto del engine; en el build, el juego hace Wwise calls al Wwise engine, que corre los SoundBanks y produce el audio."
          >
            <defs>
              <marker id="arrS7" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>

            <text x="24" y="98" fontSize="12" fill="currentColor">audio clips</text>
            <line x1="24" y1="108" x2="144" y2="108" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS7)" />
            <text x="24" y="158" fontSize="12" fill="currentColor">configs del diseñador</text>
            <line x1="24" y1="168" x2="144" y2="168" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS7)" />

            <rect x="150" y="60" width="210" height="160" rx="10" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="166" y="88" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">WWISE EDITOR</text>
            <rect x="170" y="104" width="170" height="60" rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity=".8" />
            <text x="255" y="130" fontSize="12" fill="currentColor" textAnchor="middle">Wwise project</text>
            <text x="255" y="148" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">todas las decisiones</text>
            <line x1="360" y1="180" x2="430" y2="318" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS7)" />
            <text x="352" y="262" fontSize="11" fill="#f2a33c" textAnchor="end">genera SoundBanks</text>

            <rect x="430" y="40" width="240" height="360" rx="10" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="446" y="68" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">ENGINE EDITOR</text>
            <text x="446" y="86" fontSize="10.5" fill="currentColor" opacity=".45">engine project</text>
            <rect x="450" y="100" width="200" height="56" rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity=".8" />
            <text x="550" y="124" fontSize="12" fill="currentColor" textAnchor="middle">Wwise code calls</text>
            <text x="550" y="142" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">tu código de audio</text>
            <line x1="515" y1="192" x2="515" y2="160" stroke="#f2a33c" strokeWidth="1.5" markerEnd="url(#arrS7)" />
            <line x1="545" y1="160" x2="545" y2="192" stroke="#f2a33c" strokeWidth="1.5" markerEnd="url(#arrS7)" />
            <rect x="450" y="196" width="200" height="56" rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity=".8" />
            <text x="550" y="220" fontSize="12" fill="currentColor" textAnchor="middle">Wwise plugin</text>
            <text x="550" y="238" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">la API en el editor</text>
            <rect x="450" y="300" width="200" height="56" rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity=".8" />
            <text x="550" y="324" fontSize="12" fill="currentColor" textAnchor="middle">Wwise SoundBanks</text>
            <text x="550" y="342" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">.bnk · estructura + media</text>

            <rect x="700" y="40" width="210" height="360" rx="10" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="716" y="68" fontSize="11.5" fill="currentColor" opacity=".65" letterSpacing="2">WRAPPER · BUILD</text>
            <rect x="716" y="84" width="178" height="120" rx="8" fill="none" stroke="currentColor" strokeOpacity=".5" />
            <text x="728" y="106" fontSize="11" fill="currentColor" opacity=".65">GAME</text>
            <rect x="728" y="120" width="154" height="52" rx="8" fill="#232730" stroke="#f2a33c" />
            <text x="805" y="142" fontSize="12" fill="currentColor" textAnchor="middle">Wwise calls</text>
            <text x="805" y="159" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">tu código</text>
            <rect x="716" y="232" width="178" height="140" rx="8" fill="none" stroke="#f2a33c" strokeOpacity=".9" />
            <text x="728" y="254" fontSize="11" fill="#f2a33c">WWISE ENGINE</text>
            <rect x="728" y="286" width="154" height="52" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".8" />
            <text x="805" y="308" fontSize="12" fill="currentColor" textAnchor="middle">SoundBanks</text>
            <text x="805" y="325" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">cargados</text>
            <line x1="785" y1="176" x2="785" y2="280" stroke="#f2a33c" strokeWidth="1.5" markerEnd="url(#arrS7)" />
            <line x1="825" y1="176" x2="825" y2="280" stroke="#f2a33c" strokeWidth="1.5" markerEnd="url(#arrS7)" />

            <line x1="650" y1="128" x2="722" y2="144" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS7)" />
            <line x1="650" y1="224" x2="710" y2="258" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS7)" />
            <line x1="650" y1="328" x2="722" y2="312" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS7)" />

            <line x1="894" y1="302" x2="946" y2="302" stroke="#f2a33c" strokeWidth="2.5" markerEnd="url(#arrS7)" />
            <text className={s.svgSans} x="920" y="290" fontSize="13" fill="currentColor" textAnchor="middle">AUDIO</text>
          </svg>
          <figcaption>
            Objects configurados + audios → SoundBanks · el juego solo usa la interface: los calls.
          </figcaption>
        </figure>
      </Slide>
    </Deck>
  );
}
