# Reglas de estilo — curso Wwise + Unreal

Reglas de todas las presentaciones de este curso (`src/presentations/wwise-unreal/`). Si una presentación necesita apartarse de algo, su override va en la sección [Por presentación](#por-presentación) de este mismo documento — no en un archivo aparte.

## Principio

**Súper gráfico, poquísimo texto.** Cada slide es una frase grande (`h2`) más un SVG protagonista. Nada de párrafos: si la idea necesita explicarse con texto, es que al dibujo le falta.

## Idioma

Español, con los términos técnicos en inglés tal como se usan en la industria: SoundBanks, engine, scripts, plugin, calls, prefabs.

## Color

| Color | Significado |
|---|---|
| Ámbar `#f2a33c` | Lo protagónico: el flujo principal, la caja que importa en este slide, las flechas del camino |
| Teal `#63b6a4` | Lo secundario o lo externo al flujo: recursos que alimentan desde afuera, el lado "interpretado" del contraste |
| Neutro `currentColor` con `strokeOpacity=".35"` | Contenedores y contexto que no compiten por atención |

## Anatomía de un slide

```tsx
<Slide z="N" label="tema corto">
  <div className={s.eyebrow}>Concepto N · matiz opcional</div>
  <h2>Frase corta con <span className={s.accent}>una parte en ámbar</span></h2>
  <figure>
    <svg viewBox="0 0 900 300" role="img" aria-label="Descripción completa del diagrama.">…</svg>
    <figcaption>Una línea que remata la idea.</figcaption>
  </figure>
</Slide>
```

- `viewBox` de ancho 900–960; la altura es la que pida el dibujo.
- El `figcaption` es el remate conceptual, no una descripción de lo que se ve.
- El `aria-label` del SVG sí describe el diagrama completo en una frase.

## Vocabulario visual del SVG

Cajas:

```tsx
{/* caja normal */}
<rect x="…" y="…" width="…" height="…" rx="8" fill="#1d2026" stroke="currentColor" strokeOpacity=".35" />
{/* caja protagonista */}
<rect x="…" y="…" width="…" height="…" rx="8" fill="#232730" stroke="#f2a33c" />
```

- Título dentro de la caja: `fontSize="12"` o `13`.
- Subtítulo dentro de la caja: `fontSize="10.5"` con `opacity=".6"`.
- Rótulo de contenedor (WWISE EDITOR, ENGINE EDITOR): `fontSize="11.5"`, `opacity=".65"`, `letterSpacing="2"`.
- El texto SVG hereda la mono por defecto; para la tipografía de cuerpo usa `className={s.svgSans}` (solo en etiquetas sueltas tipo "el juego", "AUDIO", "comportamiento").
- No pongas `font-family` a mano: lo maneja `Deck.module.css`.

Flechas — **siempre rectas o en codo, nunca diagonales**, y nunca cruzadas entre sí (elige los puntos de salida para que no se toquen). Cada SVG declara su propio `marker` con id único:

```tsx
<marker id="arrSN" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
  <path d="M0,0 L10,5 L0,10 z" fill="#f2a33c" />
</marker>
```

```tsx
{/* recta */}
<line x1="…" y1="…" x2="…" y2="…" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrSN)" />
{/* codo vertical → horizontal (radio 12) */}
<path d="M 100 76 L 100 128 Q 100 140 112 140 L 292 140" fill="none" stroke="#63b6a4" strokeWidth="2" markerEnd="url(#arrSN)" />
{/* codo horizontal → vertical */}
<path d="M 550 140 L 738 140 Q 750 140 750 152 L 750 154" fill="none" stroke="#f2a33c" strokeWidth="2" markerEnd="url(#arrSN)" />
```

Alinea las cajas para que las flechas salgan rectas siempre que se pueda; el codo es para cuando el origen y el destino están en ejes distintos.

## Convenciones de contenido ya establecidas

- Los ejemplos de programa se llaman `juego.c` / `juego.exe` (no `main.c` ni `game.exe`), y el binario muestra sus unos y ceros junto a la etiqueta: `0110 1001 · binario`.
- Lo que entra a un motor se dice "programas programados/configurados", con "recursos · código · configuraciones" debajo.
- Lo externo al flujo (los recursos) va arriba y separado, alimentando hacia abajo con codos.

## Por presentación

### que-es-un-motor-de-audio

- El arco de la clase: Portada → compilados vs interpretados → el OS corre los compilados → un motor corre los interpretados → qué es un motor → game engines → motores de audio. Cada slide nuevo debe encajar en esa progresión de lo general a lo específico.

### wwise-por-adentro

- Abre sin portada: el primer slide es un recap del último slide de `que-es-un-motor-de-audio` (mismo diagrama), con eyebrow "Recap · donde quedamos".
- El arco de la clase: recap del patrón del motor de audio → Wwise de punta a punta → (por definir; mantener la progresión de lo general a lo específico).

### wwise-inside-out

- Es anterior a estas reglas y no las sigue; no re-estilizarla sin que se pida explícitamente.
