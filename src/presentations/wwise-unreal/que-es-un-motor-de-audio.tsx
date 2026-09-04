import type { CSSProperties } from 'react';
import Deck, { Slide } from '../../components/learn/Deck';
import s from '../../components/learn/Deck.module.css';
import { useT } from '../../i18n/useT';
import { motorDict } from './que-es-un-motor-de-audio.dict';

export default function QueEsUnMotorDeAudio() {
  const t = useT(motorDict);

  return (
    <Deck name={t.name} context={t.context}>
      <Slide z="▶" label={t.labels.intro} backgroundImage="/assets/presentations/wwise-unreal/Cover.jpg">
        <div className={s.eyebrow}>{t.cover.eyebrow}</div>
        <h1>{t.cover.title}</h1>
        <p className={s.note}>{t.cover.hint}</p>
      </Slide>

      <Slide z="1" label={t.labels.lenguajes}>
        <div className={s.eyebrow}>{t.lenguajes.eyebrow}</div>
        <h2>{t.lenguajes.title}</h2>
        <figure>
          <svg viewBox="0 0 900 300" role="img" aria-label={t.lenguajes.aria}>
            <defs>
              <marker id="arrS2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>
            <line x1="450" y1="20" x2="450" y2="280" stroke="currentColor" strokeOpacity=".15" strokeDasharray="4 6" />

            <text x="230" y="32" fontSize="13" fill="#f2a33c" letterSpacing="3" textAnchor="middle">{t.lenguajes.compilado}</text>
            <rect x="150" y="50" width="160" height="52" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="230" y="72" fontSize="13" fill="currentColor" textAnchor="middle">juego.c</text>
            <text x="230" y="91" fontSize="10.5" fill="currentColor" opacity=".55" textAnchor="middle">{t.lenguajes.texto}</text>
            <line x1="230" y1="102" x2="230" y2="124" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS2)" />
            <rect x="130" y="128" width="200" height="52" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
            <text x="230" y="150" fontSize="13" fill="#f2a33c" textAnchor="middle">{t.lenguajes.compilador}</text>
            <text x="230" y="169" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{t.lenguajes.unaVez}</text>
            <line x1="230" y1="180" x2="230" y2="202" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS2)" />
            <rect x="150" y="206" width="160" height="52" rx="8" fill="#232730" stroke="#f2a33c" />
            <text x="230" y="228" fontSize="13" fill="currentColor" textAnchor="middle">juego.exe</text>
            <text x="230" y="247" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{t.lenguajes.binario}</text>
            <text x="230" y="286" fontSize="12" fill="currentColor" opacity=".6" textAnchor="middle">{t.lenguajes.listoParaLaCpu}</text>

            <text x="670" y="32" fontSize="13" fill="#63b6a4" letterSpacing="3" textAnchor="middle">{t.lenguajes.interpretado}</text>
            <rect x="590" y="50" width="160" height="52" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="670" y="72" fontSize="13" fill="currentColor" textAnchor="middle">player.gd</text>
            <text x="670" y="91" fontSize="10.5" fill="currentColor" opacity=".55" textAnchor="middle">{t.lenguajes.texto}</text>
            <line x1="670" y1="102" x2="670" y2="202" stroke="currentColor" strokeOpacity=".4" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="686" y="156" fontSize="11" fill="currentColor" opacity=".55">{t.lenguajes.noSeTraduce}</text>
            <rect x="590" y="206" width="160" height="52" rx="8" fill="#1d2026" stroke="#63b6a4" strokeDasharray="5 4" />
            <text x="670" y="228" fontSize="13" fill="currentColor" textAnchor="middle">player.gd</text>
            <text x="670" y="247" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{t.lenguajes.sigueSiendoTexto}</text>
            <text x="670" y="286" fontSize="12" fill="#63b6a4" textAnchor="middle">{t.lenguajes.quienLoLee}</text>
          </svg>
          <figcaption>{t.lenguajes.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="2" label={t.labels.compilados}>
        <div className={s.eyebrow}>{t.compilados.eyebrow}</div>
        <h2>{t.compilados.title}</h2>
        <figure>
          <svg viewBox="0 0 900 270" role="img" aria-label={t.compilados.aria}>
            <defs>
              <marker id="arrS3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>
            <rect x="170" y="26" width="560" height="54" rx="8" fill="#232730" stroke="#f2a33c" />
            <text x="450" y="49" fontSize="14" fill="currentColor" textAnchor="middle">juego.exe</text>
            <text x="450" y="68" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">{t.compilados.binarioCompilado}</text>
            <line x1="450" y1="80" x2="450" y2="108" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS3)" />
            <text x="470" y="98" fontSize="11.5" fill="#f2a33c">{t.compilados.elOsLoLanza}</text>
            <rect x="170" y="112" width="560" height="54" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text className={s.svgSans} x="450" y="135" fontSize="15" fontWeight="600" fill="currentColor" textAnchor="middle">{t.compilados.os}</text>
            <text x="450" y="155" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">{t.compilados.sistemas}</text>
            <line x1="450" y1="166" x2="450" y2="194" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS3)" />
            <text x="470" y="184" fontSize="11.5" fill="currentColor" opacity=".65">{t.compilados.instruccionesDirectas}</text>
            <rect x="170" y="198" width="560" height="54" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text className={s.svgSans} x="450" y="221" fontSize="15" fontWeight="600" fill="currentColor" textAnchor="middle">{t.compilados.cpu}</text>
            <text x="450" y="241" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">{t.compilados.ejecutaTalCual}</text>
          </svg>
          <figcaption>{t.compilados.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="3" label={t.labels.interpretados}>
        <div className={s.eyebrow}>{t.interpretados.eyebrow}</div>
        <h2>{t.interpretados.title}</h2>
        <figure>
          <svg viewBox="0 0 900 330" role="img" aria-label={t.interpretados.aria}>
            <defs>
              <marker id="arrS4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>
            <rect x="170" y="20" width="560" height="50" rx="8" fill="#1d2026" stroke="#63b6a4" />
            <text x="450" y="41" fontSize="13" fill="currentColor" textAnchor="middle">player.gd</text>
            <text x="450" y="60" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">{t.interpretados.texto}</text>
            <line x1="450" y1="70" x2="450" y2="94" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS4)" />
            <text x="470" y="87" fontSize="11.5" fill="#f2a33c">{t.interpretados.elMotorLoLee}</text>
            <rect x="170" y="98" width="560" height="50" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="450" y="119" fontSize="14" fill="#f2a33c" textAnchor="middle">{t.interpretados.motor}</text>
            <text x="450" y="138" fontSize="11" fill="currentColor" opacity=".65" textAnchor="middle">{t.interpretados.interprete}</text>
            <line x1="450" y1="148" x2="450" y2="172" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS4)" />
            <text x="470" y="165" fontSize="11.5" fill="currentColor" opacity=".65">{t.interpretados.elOsCorreAlMotor}</text>
            <rect x="170" y="176" width="560" height="50" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text className={s.svgSans} x="450" y="205" fontSize="15" fontWeight="600" fill="currentColor" textAnchor="middle">{t.compilados.os}</text>
            <line x1="450" y1="226" x2="450" y2="250" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS4)" />
            <rect x="170" y="254" width="560" height="50" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text className={s.svgSans} x="450" y="283" fontSize="15" fontWeight="600" fill="currentColor" textAnchor="middle">{t.compilados.cpu}</text>
          </svg>
          <figcaption>{t.interpretados.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="4" label={t.labels.queEsUnMotor}>
        <div className={s.eyebrow}>{t.queEsUnMotor.eyebrow}</div>
        <h2>{t.queEsUnMotor.title}</h2>
        <figure>
          <svg viewBox="0 0 900 190" role="img" aria-label={t.queEsUnMotor.aria}>
            <defs>
              <marker id="arrS5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>
            <rect x="40" y="66" width="280" height="58" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="180" y="89" fontSize="11.5" fill="#f2a33c" textAnchor="middle">{t.queEsUnMotor.programas}</text>
            <text x="180" y="107" fontSize="10.5" fill="currentColor" fillOpacity=".6" textAnchor="middle">
              <tspan fill="#63b6a4" fillOpacity="1">{t.queEsUnMotor.recursos}</tspan>
              {t.queEsUnMotor.codigoYConfigs}
            </text>
            <line x1="320" y1="95" x2="368" y2="95" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS5)" />
            <rect x="374" y="66" width="220" height="58" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="484" y="90" fontSize="15" fill="#f2a33c" textAnchor="middle">{t.queEsUnMotor.motor}</text>
            <text x="484" y="110" fontSize="10.5" fill="currentColor" opacity=".65" textAnchor="middle">{t.queEsUnMotor.unProgramaCorriendo}</text>
            <line x1="594" y1="95" x2="700" y2="95" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS5)" />
            <text className={s.svgSans} x="712" y="100" fontSize="14" fill="currentColor">{t.queEsUnMotor.comportamiento}</text>
          </svg>
        </figure>
        <table className={s.plain}>
          <thead>
            <tr>
              <th>{t.queEsUnMotor.thMotor}</th>
              <th>{t.queEsUnMotor.thCorre}</th>
            </tr>
          </thead>
          <tbody>
            {t.queEsUnMotor.filas.map(([motor, corre]) => (
              <tr key={motor}>
                <td>{motor}</td>
                <td>{corre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Slide>

      <Slide z="5" label={t.labels.gameEngines}>
        <div className={s.eyebrow}>{t.gameEngines.eyebrow}</div>
        <h2>{t.gameEngines.title}</h2>
        <figure>
          <svg viewBox="0 0 910 330" role="img" aria-label={t.gameEngines.aria}>
            <defs>
              <marker id="arrS6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
              <marker id="arrS6t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#63b6a4" />
              </marker>
            </defs>
            <rect x="40" y="20" width="230" height="56" rx="8" fill="#1d2026" stroke="#63b6a4" />
            <text x="155" y="44" fontSize="12" fill="#63b6a4" textAnchor="middle">{t.gameEngines.recursos}</text>
            <text x="155" y="63" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{t.gameEngines.recursosDeJuego}</text>
            <path d="M 210 76 L 210 128 Q 210 140 222 140 L 292 140" fill="none" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrS6t)" />
            <path d="M 100 76 L 100 238 Q 100 250 112 250 L 292 250" fill="none" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrS6t)" />
            <text x="198" y="112" fontSize="10.5" fill="#63b6a4" textAnchor="end">{t.gameEngines.usan}</text>
            <text x="88" y="214" fontSize="10.5" fill="#63b6a4" textAnchor="end">{t.gameEngines.usan}</text>
            <rect x="300" y="110" width="250" height="60" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
            <text x="425" y="134" fontSize="12" fill="#f2a33c" textAnchor="middle">{t.gameEngines.configuraciones}</text>
            <text x="425" y="153" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">{t.gameEngines.configsDeJuego}</text>
            <rect x="300" y="220" width="250" height="60" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
            <text x="425" y="244" fontSize="12" fill="#f2a33c" textAnchor="middle">{t.gameEngines.codigo}</text>
            <text x="425" y="263" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">{t.gameEngines.scriptsGameplay}</text>
            <path d="M 550 140 L 738 140 Q 750 140 750 152 L 750 154" fill="none" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS6)" />
            <path d="M 550 250 L 738 250 Q 750 250 750 238 L 750 236" fill="none" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS6)" />
            <rect x="650" y="160" width="200" height="70" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
            <text x="750" y="189" fontSize="13" fill="#f2a33c" textAnchor="middle">{t.gameEngines.gameEngine}</text>
            <text x="750" y="208" fontSize="10.5" fill="currentColor" opacity=".65" textAnchor="middle">{t.gameEngines.losCorreJuntos}</text>
            <line x1="850" y1="195" x2="884" y2="195" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS6)" />
            <text className={s.svgSans} x="860" y="183" fontSize="12" fill="currentColor" textAnchor="middle">{t.gameEngines.elJuego}</text>
          </svg>
          <figcaption>{t.gameEngines.caption}</figcaption>
        </figure>
      </Slide>

      <Slide z="6" label={t.labels.audioEngines}>
        <div className={s.eyebrow}>{t.audioEngines.eyebrow}</div>
        <h2>{t.audioEngines.title}</h2>
        <figure>
          <svg viewBox="0 0 910 330" role="img" aria-label={t.audioEngines.aria}>
            <defs>
              <marker id="arrS7" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
              <marker id="arrS7t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#63b6a4" />
              </marker>
            </defs>

            {/* Igual que el slide 5 */}
            <rect x="40" y="20" width="230" height="56" rx="8" fill="#1d2026" stroke="#63b6a4" />
            <text x="155" y="44" fontSize="12" fill="#63b6a4" textAnchor="middle">{t.gameEngines.recursos}</text>
            <path d="M 210 76 L 210 128 Q 210 140 222 140 L 292 140" fill="none" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrS7t)" />
            <text x="198" y="112" fontSize="10.5" fill="#63b6a4" textAnchor="end">{t.gameEngines.usan}</text>
            <rect x="300" y="110" width="250" height="60" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />

            {/* Paso 1 (al entrar): CÓDIGO y sus flechas desaparecen */}
            <g className={s.morphOut}>
              <path d="M 100 76 L 100 238 Q 100 250 112 250 L 292 250" fill="none" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrS7t)" />
              <text x="88" y="214" fontSize="10.5" fill="#63b6a4" textAnchor="end">{t.gameEngines.usan}</text>
              <rect x="300" y="220" width="250" height="60" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
              <text x="425" y="244" fontSize="12" fill="#f2a33c" textAnchor="middle">{t.gameEngines.codigo}</text>
              <text x="425" y="263" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">{t.gameEngines.scriptsGameplay}</text>
              <path d="M 550 250 L 738 250 Q 750 250 750 238 L 750 236" fill="none" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS7)" />
            </g>

            {/* Paso 2 (0.6s): el engine sube y el codo se vuelve flecha recta */}
            <g className={s.morphOut} style={{ animationDelay: '0.6s' }}>
              <path d="M 550 140 L 738 140 Q 750 140 750 152 L 750 154" fill="none" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS7)" />
            </g>
            <g className={s.morphIn} style={{ animationDelay: '0.6s' }}>
              <line x1="550" y1="140" x2="644" y2="140" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS7)" />
            </g>
            <g className={s.morphGlide} style={{ animationDelay: '0.6s', '--morph-from': 'translateY(55px)' } as CSSProperties}>
              <rect x="650" y="105" width="200" height="70" rx="8" fill="#232730" stroke="#f2a33c" strokeWidth="2" />
              <line x1="850" y1="140" x2="884" y2="140" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrS7)" />
              <g className={s.morphOut} style={{ animationDelay: '1.2s' }}>
                <text x="750" y="134" fontSize="13" fill="#f2a33c" textAnchor="middle">{t.gameEngines.gameEngine}</text>
                <text x="750" y="153" fontSize="10.5" fill="currentColor" opacity=".65" textAnchor="middle">{t.gameEngines.losCorreJuntos}</text>
                <text className={s.svgSans} x="860" y="128" fontSize="12" fill="currentColor" textAnchor="middle">{t.gameEngines.elJuego}</text>
              </g>
              <g className={s.morphIn} style={{ animationDelay: '1.2s' }}>
                <text x="750" y="134" fontSize="13" fill="#f2a33c" textAnchor="middle">{t.audioEngines.soundEngine}</text>
                <text x="750" y="153" fontSize="10.5" fill="currentColor" opacity=".65" textAnchor="middle">{t.audioEngines.losCorre}</text>
                <text className={s.svgSans} x="860" y="128" fontSize="12" fill="currentColor" textAnchor="middle">{t.audioEngines.audio}</text>
              </g>
            </g>

            {/* Paso 3 (1.2s): los textos cambian al dominio de audio */}
            <g className={s.morphOut} style={{ animationDelay: '1.2s' }}>
              <text x="155" y="63" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{t.gameEngines.recursosDeJuego}</text>
              <text x="425" y="134" fontSize="12" fill="#f2a33c" textAnchor="middle">{t.gameEngines.configuraciones}</text>
              <text x="425" y="153" fontSize="11" fill="currentColor" opacity=".6" textAnchor="middle">{t.gameEngines.configsDeJuego}</text>
            </g>
            <g className={s.morphIn} style={{ animationDelay: '1.2s' }}>
              <text x="155" y="63" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{t.audioEngines.recursosDeAudio}</text>
              <text x="425" y="129" fontSize="11.5" fill="#f2a33c" textAnchor="middle">{t.audioEngines.configsDeAudioLinea1}</text>
              <text x="425" y="143" fontSize="11.5" fill="#f2a33c" textAnchor="middle">{t.audioEngines.configsDeAudioLinea2}</text>
              <text x="425" y="160" fontSize="10.5" fill="currentColor" opacity=".6" textAnchor="middle">{t.audioEngines.tracksBusesEvents}</text>
            </g>
          </svg>
          <figcaption>{t.audioEngines.caption}</figcaption>
        </figure>
      </Slide>
    </Deck>
  );
}
