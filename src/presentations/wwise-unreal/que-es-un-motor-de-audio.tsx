import Deck, { Slide } from '../../components/incine/Deck';
import s from '../../components/incine/Deck.module.css';

export default function QueEsUnMotorDeAudio() {
  return (
    <Deck name="¿Qué es un motor de audio?" context="Intro a Wwise · Wwise + Unreal">
      <Slide z="▶" label="intro" backgroundImage="/assets/presentations/wwise-unreal/Cover.jpg">
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
          Programas compilados <span className={s.teal}>vs</span> interpretados
        </h2>
        <figure>
          <svg
            viewBox="0 0 900 300"
            role="img"
            aria-label="Un programa compilado se traduce una vez a binario (juego.exe) antes de correr; un programa interpretado sigue siendo texto y alguien tiene que leerlo en vivo."
          >
            <defs>
              <marker id="arrS2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>
            <line x1="450" y1="20" x2="450" y2="280" stroke="currentColor" strokeOpacity=".15" strokeDasharray="4 6" />

            <text x="230" y="32" fontSize="13" fill="#f2a33c" letterSpacing="3" textAnchor="middle">COMPILADO</text>
            <rect x="150" y="50" width="160" height="52" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="230" y="72" fontSize="13" fill="currentColor" textAnchor="middle">juego.c</text>
            <text x="230" y="91" fontSize="10.5" fill="currentColor" opacity=".55" textAnchor="middle">texto</text>
            <line x1="230" y1="102" x2="230" y2="124" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS2)" />
            <rect x="130" y="128" width="200" height="52" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
            <text x="230" y="150" fontSize="13" fill="#f2a33c" textAnchor="middle">COMPILADOR</text>
            <text x="230" y="169" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">una vez · antes de correr</text>
            <line x1="230" y1="180" x2="230" y2="202" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS2)" />
            <rect x="150" y="206" width="160" height="52" rx="8" fill="#232730" stroke="#f2a33c" />
            <text x="230" y="228" fontSize="13" fill="currentColor" textAnchor="middle">juego.exe</text>
            <text x="230" y="247" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">0110 1001 · binario</text>
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
            aria-label="El binario juego.exe corre sobre el OS y el OS sobre la CPU; el OS solo lanza el binario, que ya habla el idioma de la máquina."
          >
            <defs>
              <marker id="arrS3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>
            <rect x="170" y="26" width="560" height="54" rx="8" fill="#232730" stroke="#f2a33c" />
            <text x="450" y="49" fontSize="14" fill="currentColor" textAnchor="middle">juego.exe</text>
            <text x="450" y="68" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">0110 1001 · binario compilado</text>
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
            aria-label="El motor recibe programas, programados o configurados, hechos de recursos, código y configuraciones, y produce comportamiento."
          >
            <defs>
              <marker id="arrS5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>
            <rect x="40" y="66" width="280" height="58" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="180" y="89" fontSize="11.5" fill="#f2a33c" textAnchor="middle">programas programados/configurados</text>
            <text x="180" y="107" fontSize="10.5" fill="currentColor" fillOpacity=".6" textAnchor="middle">
              <tspan fill="#63b6a4" fillOpacity="1">recursos</tspan>
              {' · código · configuraciones'}
            </text>
            <line x1="320" y1="95" x2="368" y2="95" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS5)" />
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
            viewBox="0 0 910 330"
            role="img"
            aria-label="Los recursos, externos y arriba, alimentan a las configuraciones y al código; el game engine corre todo junto y produce el juego."
          >
            <defs>
              <marker id="arrS6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
              <marker id="arrS6t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#63b6a4" />
              </marker>
            </defs>
            <rect x="40" y="20" width="230" height="56" rx="8" fill="#1d2026" stroke="#63b6a4" />
            <text x="155" y="44" fontSize="12" fill="#63b6a4" textAnchor="middle">RECURSOS</text>
            <text x="155" y="63" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">texturas · modelos · audios</text>
            <path d="M 210 76 L 210 128 Q 210 140 222 140 L 292 140" fill="none" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrS6t)" />
            <path d="M 100 76 L 100 238 Q 100 250 112 250 L 292 250" fill="none" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrS6t)" />
            <text x="198" y="112" fontSize="10.5" fill="#63b6a4" textAnchor="end">usan</text>
            <text x="88" y="214" fontSize="10.5" fill="#63b6a4" textAnchor="end">usan</text>
            <rect x="300" y="110" width="250" height="60" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
            <text x="425" y="134" fontSize="12" fill="#f2a33c" textAnchor="middle">CONFIGURACIONES</text>
            <text x="425" y="153" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">escenas · maps · prefabs</text>
            <rect x="300" y="220" width="250" height="60" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
            <text x="425" y="244" fontSize="12" fill="#f2a33c" textAnchor="middle">CÓDIGO</text>
            <text x="425" y="263" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">scripts · gameplay</text>
            <path d="M 550 140 L 738 140 Q 750 140 750 152 L 750 154" fill="none" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS6)" />
            <path d="M 550 250 L 738 250 Q 750 250 750 238 L 750 236" fill="none" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS6)" />
            <rect x="650" y="160" width="200" height="70" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="750" y="189" fontSize="13" fill="#f2a33c" textAnchor="middle">GAME ENGINE</text>
            <text x="750" y="208" fontSize="10.5" fill="currentColor" opacity=".65" textAnchor="middle">los corre juntos</text>
            <line x1="850" y1="195" x2="884" y2="195" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS6)" />
            <text className={s.svgSans} x="860" y="183" fontSize="12" fill="currentColor" textAnchor="middle">el juego</text>
          </svg>
          <figcaption>Configuras y programas; el engine junta todo con los recursos y lo corre.</figcaption>
        </figure>
      </Slide>

      <Slide z="6" label="audio engines">
        <div className={s.eyebrow}>Concepto 6</div>
        <h2>
          El motor de audio: <span className={s.accent}>mismo patrón</span>
        </h2>
        <figure>
          <svg
            viewBox="0 0 910 220"
            role="img"
            aria-label="Los recursos —canciones, sonidos y voces— alimentan las configuraciones de sonido interactivo; el sound engine las corre y produce el audio."
          >
            <defs>
              <marker id="arrS7" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
              <marker id="arrS7t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#63b6a4" />
              </marker>
            </defs>
            <rect x="40" y="20" width="230" height="56" rx="8" fill="#1d2026" stroke="#63b6a4" />
            <text x="155" y="44" fontSize="12" fill="#63b6a4" textAnchor="middle">RECURSOS</text>
            <text x="155" y="63" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">canciones · sonidos · voces</text>
            <path d="M 155 76 L 155 138 Q 155 150 167 150 L 292 150" fill="none" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrS7t)" />
            <text x="143" y="112" fontSize="10.5" fill="#63b6a4" textAnchor="end">usan</text>
            <rect x="300" y="120" width="250" height="60" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
            <text x="425" y="139" fontSize="11.5" fill="#f2a33c" textAnchor="middle">Configuraciones de</text>
            <text x="425" y="153" fontSize="11.5" fill="#f2a33c" textAnchor="middle">Sonido Interactivo</text>
            <text x="425" y="170" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">tracks · buses · events</text>
            <line x1="550" y1="150" x2="644" y2="150" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS7)" />
            <rect x="650" y="115" width="200" height="70" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="750" y="144" fontSize="13" fill="#f2a33c" textAnchor="middle">SOUND ENGINE</text>
            <text x="750" y="163" fontSize="10.5" fill="currentColor" opacity=".65" textAnchor="middle">los corre</text>
            <line x1="850" y1="150" x2="884" y2="150" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS7)" />
            <text className={s.svgSans} x="860" y="138" fontSize="12" fill="currentColor" textAnchor="middle">audio</text>
          </svg>
          <figcaption>Mismo patrón: recursos afuera, sonido configurado, un engine que lo corre.</figcaption>
        </figure>
      </Slide>
    </Deck>
  );
}
