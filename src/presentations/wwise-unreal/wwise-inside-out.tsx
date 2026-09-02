import Deck, { Slide } from '../../components/incine/Deck';
import s from '../../components/incine/Deck.module.css';

export default function WwiseInsideOut() {
  return (
    <Deck name="Wwise Inside Out" context="NazisVsCommies · Godot 4.7 · Wwise 2025.1">
      <Slide z="▶" label="signal check">
        <div className={s.eyebrow}>From general to specific · 7 zoom levels</div>
        <h1>
          Wwise
          <br />
          Inside <span className={s.accent}>Out</span>
        </h1>
        <p className={s.lede}>
          How the middleware actually works — from the two programs on your disk down to the bar line the music
          waits for. Every example is from your own project.
        </p>
        <p className={s.note}>Navigate with ← → or the buttons below</p>
      </Slide>

      <Slide z="0" label="the big picture">
        <div className={s.eyebrow}>Zoom 0</div>
        <h2>Two programs and a bridge</h2>
        <figure>
          <svg
            viewBox="0 0 940 260"
            role="img"
            aria-label="The Wwise authoring app generates SoundBanks, which the Wwise sound engine inside the game process loads and plays through the audio device."
          >
            <defs>
              <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>
            <rect x="20" y="40" width="330" height="180" rx="10" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="40" y="72" fontSize="12" fill="currentColor" opacity=".65" letterSpacing="2">AUTHORING · YOUR DESK</text>
            <text className={s.svgSans} x="40" y="104" fontSize="16" fontWeight="600" fill="currentColor">Wwise Authoring App</text>
            <text x="40" y="132" fontSize="12.5" fill="currentColor" opacity=".8">.wproj + .wwu — all the decisions</text>
            <text x="40" y="154" fontSize="12.5" fill="currentColor" opacity=".8">Originals/ — source WAVs</text>
            <text className={s.svgSans} x="40" y="196" fontSize="13" fill="currentColor" opacity=".55">never ships with the game</text>
            <line x1="350" y1="128" x2="560" y2="128" stroke="#f2a33c" strokeWidth="2.5" markerEnd="url(#arr)" />
            <text x="455" y="112" fontSize="12.5" fill="#f2a33c" textAnchor="middle">generates SoundBanks</text>
            <text x="455" y="150" fontSize="12.5" fill="#f2a33c" textAnchor="middle">Init.bnk + game.bnk</text>
            <rect x="570" y="30" width="350" height="200" rx="10" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
            <text x="590" y="60" fontSize="12" fill="currentColor" opacity=".65" letterSpacing="2">RUNTIME · INSIDE THE GAME</text>
            <rect x="590" y="76" width="310" height="86" rx="8" fill="#232730" stroke="#f2a33c" strokeOpacity=".8" />
            <text className={s.svgSans} x="606" y="104" fontSize="15" fontWeight="600" fill="currentColor">Wwise Sound Engine</text>
            <text x="606" y="126" fontSize="12" fill="currentColor" opacity=".8">addons/Wwise · GDExtension</text>
            <text x="606" y="146" fontSize="12" fill="currentColor" opacity=".8">executes the loaded banks</text>
            <line x1="745" y1="162" x2="745" y2="196" stroke="#f2a33c" strokeWidth="2.5" markerEnd="url(#arr)" />
            <text className={s.svgSans} x="762" y="216" fontSize="14" fill="currentColor" opacity=".8" textAnchor="middle">audio device</text>
          </svg>
          <figcaption>
            {"The engine can only do what a loaded bank contains — an event that isn't in one does nothing, silently."}
          </figcaption>
        </figure>
        <p className={s.lede}>
          Consequence: <strong>changing the audio = regenerating banks</strong> — not recompiling, not even
          touching, the game.
        </p>
      </Slide>

      <Slide z="1" label="the contract">
        <div className={s.eyebrow}>Zoom 1 · the entire API surface</div>
        <h2>
          The programmer posts an Event.
          <br />
          <span className={s.accent}>Nothing else.</span>
        </h2>
        <pre className={s.block}>
          <span className={s.c}>{"# the whole game's audio vocabulary:"}</span>
          {'\nAudioSystem.post_event('}
          <span className={s.a}>AK.EVENTS.PLAY_SHOOT_ENEMY</span>
          {')\n\n'}
          <span className={s.c}>{'# ...plus feeding the game syncs:'}</span>
          {'\nWwise.set_rtpc_value_id('}
          <span className={s.a}>AK.GAME_PARAMETERS.SFX_VOLUME</span>
          {', value, '}
          <span className={s.k}>null</span>
          {')'}
        </pre>
        <ul className={s.tight}>
          <li>
            {'Never "play '}
            <code>shot.wav</code>
            {'". Never a volume. Never a filename.'}
          </li>
          <li>
            The code says <strong>what happened</strong>; the sound designer decides{' '}
            <strong>what that sounds like</strong> — and can keep changing the answer after the code ships.
          </li>
          <li>
            Your project wraps even state changes in events (<code>set_music_sc_*</code>) so 100% of audio
            authority stays in Wwise.
          </li>
        </ul>
      </Slide>

      <Slide z="1" label="the pipeline">
        <div className={s.eyebrow}>Zoom 1 · memorize this shape</div>
        <h2>One pipeline, steered from the side</h2>
        <figure>
          <svg
            viewBox="0 0 900 360"
            role="img"
            aria-label="An event resolves through the object hierarchy into a voice, the voice flows through the bus hierarchy to the audio device, and game syncs modulate every stage from the side."
          >
            <defs>
              <marker id="arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
              <marker id="arrT" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#63b6a4" />
              </marker>
            </defs>
            <g>
              <rect x="30" y="16" width="560" height="44" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
              <text x="52" y="43" fontSize="13" fill="currentColor">game code</text>
              <text x="578" y="43" fontSize="12" fill="currentColor" opacity=".6" textAnchor="end">post_event(...)</text>

              <rect x="30" y="80" width="560" height="44" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
              <text x="52" y="107" fontSize="13" fill="#f2a33c">① EVENT</text>
              <text x="578" y="107" fontSize="12" fill="currentColor" opacity=".75" textAnchor="end">a named list of Actions</text>

              <rect x="30" y="144" width="560" height="44" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
              <text x="52" y="171" fontSize="13" fill="#f2a33c">② OBJECT HIERARCHY</text>
              <text x="578" y="171" fontSize="12" fill="currentColor" opacity=".75" textAnchor="end">containers resolve to ONE sound</text>

              <rect x="30" y="208" width="560" height="44" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
              <text x="52" y="235" fontSize="13" fill="#f2a33c">③ VOICE</text>
              <text x="578" y="235" fontSize="12" fill="currentColor" opacity=".75" textAnchor="end">media + final property values</text>

              <rect x="30" y="272" width="560" height="44" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
              <text x="52" y="299" fontSize="13" fill="#f2a33c">④ BUS HIERARCHY</text>
              <text x="578" y="299" fontSize="12" fill="currentColor" opacity=".75" textAnchor="end">mix · effects · ducking · limits</text>

              <rect x="30" y="336" width="560" height="10" rx="5" fill="#f2a33c" opacity=".85" />
            </g>
            <text x="610" y="345" fontSize="12" fill="currentColor" opacity=".7">⑤ audio device</text>
            <g stroke="#f2a33c" strokeWidth="2">
              <line x1="310" y1="60" x2="310" y2="76" markerEnd="url(#arr2)" />
              <line x1="310" y1="124" x2="310" y2="140" markerEnd="url(#arr2)" />
              <line x1="310" y1="188" x2="310" y2="204" markerEnd="url(#arr2)" />
              <line x1="310" y1="252" x2="310" y2="268" markerEnd="url(#arr2)" />
              <line x1="310" y1="316" x2="310" y2="332" markerEnd="url(#arr2)" />
            </g>
            <rect x="680" y="80" width="190" height="180" rx="8" fill="#1d2026" stroke="#63b6a4" strokeOpacity=".9" />
            <text x="775" y="112" fontSize="13" fill="#63b6a4" textAnchor="middle">GAME SYNCS</text>
            <text x="775" y="142" fontSize="12" fill="currentColor" opacity=".8" textAnchor="middle">states</text>
            <text x="775" y="164" fontSize="12" fill="currentColor" opacity=".8" textAnchor="middle">switches</text>
            <text x="775" y="186" fontSize="12" fill="currentColor" opacity=".8" textAnchor="middle">RTPCs</text>
            <text x="775" y="208" fontSize="12" fill="currentColor" opacity=".8" textAnchor="middle">triggers</text>
            <text className={s.svgSans} x="775" y="240" fontSize="11.5" fill="currentColor" opacity=".55" textAnchor="middle">set by game code too</text>
            <g stroke="#63b6a4" strokeWidth="2">
              <line x1="680" y1="102" x2="600" y2="102" markerEnd="url(#arrT)" />
              <line x1="680" y1="166" x2="600" y2="166" markerEnd="url(#arrT)" />
              <line x1="680" y1="230" x2="600" y2="230" markerEnd="url(#arrT)" />
              <line x1="680" y1="294" x2="600" y2="294" markerEnd="url(#arrT)" />
            </g>
          </svg>
          <figcaption>Triggered by events, steered by game syncs. Each next slide opens one numbered box.</figcaption>
        </figure>
      </Slide>

      <Slide z="2" label="① events">
        <div className={s.eyebrow}>Zoom 2 · box ①</div>
        <h2>An Event is a named list of Actions</h2>
        <div className={s.cols}>
          <div>
            <pre className={s.block}>
              <span className={s.a}>Event</span>
              {' "Play_shoot_enemy"\n └─ Action: '}
              <span className={s.k}>Play</span>
              {'\n     target: shoot_enemy\n     fade:   0 ms'}
            </pre>
          </div>
          <div>
            <pre className={s.block}>
              <span className={s.a}>Event</span>
              {' "set_popup_filter"\n └─ Action: '}
              <span className={s.k}>Set Bypass Effect</span>
              {'\n     target: Master Audio Bus\n     slot:   Parametric_EQ'}
            </pre>
          </div>
        </div>
        <ul className={s.tight}>
          <li>
            Action types: Play · Stop · Pause/Resume · Seek · Set State · Set Switch · Set Game Parameter ·
            Set/Reset Bypass · Trigger…
          </li>
          <li>
            One event can hold <strong>many actions with delays</strong>:{' '}
            {'"stop the music, wait 200 ms, play the sting, set state defeat" is ONE event — and the designer can grow it later without any code change.'}
          </li>
        </ul>
      </Slide>

      <Slide z="3" label="② hierarchy">
        <div className={s.eyebrow}>Zoom 3 · box ②</div>
        <h2>Containers decide, then resolve to one sound</h2>
        <figure>
          <svg
            viewBox="0 0 900 250"
            role="img"
            aria-label="The Play_shoot_enemy event targets the shoot_enemy random container, which picks one of its two child sounds; the picked sound's media in the bank becomes a new voice."
          >
            <defs>
              <marker id="arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
              </marker>
            </defs>
            <g fontSize="12.5">
              <rect x="20" y="90" width="230" height="52" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
              <text x="135" y="112" fill="currentColor" textAnchor="middle">Event</text>
              <text x="135" y="130" fill="#f2a33c" textAnchor="middle">Play_shoot_enemy</text>

              <line x1="250" y1="116" x2="320" y2="116" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arr3)" />
              <text x="285" y="104" fill="currentColor" opacity=".6" fontSize="11" textAnchor="middle">Play</text>

              <rect x="326" y="78" width="250" height="76" rx="8" fill="#1d2026" stroke="#f2a33c" strokeOpacity=".9" />
              <text x="451" y="104" fill="currentColor" textAnchor="middle">shoot_enemy</text>
              <text x="451" y="124" fill="currentColor" opacity=".65" fontSize="11.5" textAnchor="middle">Random Container</text>
              <text x="451" y="142" fill="#f2a33c" fontSize="11.5" textAnchor="middle">{'"which child THIS time?"'}</text>

              <line x1="576" y1="98" x2="648" y2="60" stroke="currentColor" strokeOpacity=".4" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="576" y1="134" x2="648" y2="176" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arr3)" />

              <rect x="652" y="38" width="228" height="46" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".3" />
              <text x="766" y="58" fill="currentColor" opacity=".55" textAnchor="middle">Dispara 1 · Sound SFX</text>
              <text x="766" y="75" fill="currentColor" opacity=".4" fontSize="11" textAnchor="middle">not this time</text>

              <rect x="652" y="152" width="228" height="46" rx="8" fill="#232730" stroke="#f2a33c" />
              <text x="766" y="172" fill="currentColor" textAnchor="middle">Dispara 2 · Sound SFX</text>
              <text x="766" y="189" fill="#f2a33c" fontSize="11" textAnchor="middle">picked → media → new VOICE</text>
            </g>
          </svg>
          <figcaption>Shuffle mode: no repeat until the pool empties. Resolution happens at post time, every time.</figcaption>
        </figure>
        <table className={s.plain}>
          <thead>
            <tr>
              <th>Container</th>
              <th>The question it answers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Random / Sequence</td>
              <td>which variation? (anti-repetition / fixed order)</td>
            </tr>
            <tr>
              <td>Switch</td>
              <td>which version fits the context? — reads a Switch sync (grass vs snow footstep)</td>
            </tr>
            <tr>
              <td>Blend</td>
              <td>how much of each simultaneous layer? — crossfaded by an RTPC</td>
            </tr>
            <tr>
              <td>Actor-Mixer</td>
              <td>{'not playable; a shared-properties handle ("all combat −3 dB")'}</td>
            </tr>
          </tbody>
        </table>
      </Slide>
    </Deck>
  );
}
