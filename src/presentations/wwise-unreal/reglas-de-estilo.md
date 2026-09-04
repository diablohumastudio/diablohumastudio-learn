# Reglas de estilo — curso Wwise + Unreal

Reglas de todas las presentaciones de este curso (`src/presentations/wwise-unreal/`). Si una presentación necesita apartarse de algo, su override va en la sección [Por presentación](#por-presentación) de este mismo documento — no en un archivo aparte.

## Principio

**Súper gráfico, poquísimo texto.** Cada slide es una frase grande (`h2`) más un SVG protagonista. Nada de párrafos: si la idea necesita explicarse con texto, es que al dibujo le falta.

## Idioma

Español, con los términos técnicos en inglés tal como se usan en la industria: SoundBanks, engine, scripts, plugin, calls, prefabs.

Cada deck tiene un diccionario hermano `<slug>.dict.tsx` con todos sus textos en `es` y `en` (la mecánica está en `docs/learn-courses-and-slides.md`). El español es la fuente: se escribe primero y el inglés se ajusta a él. Reglas del curso:

- Nada de texto literal en el deck: `h1`/`h2`, eyebrows, `figcaption`, `aria-label`, cada `<text>` del SVG, los `label` de los slides y el `name`/`context` del `Deck` salen del diccionario. Los `Rotulos*` reciben su objeto de textos por prop; las `Escena*` (geometría) no reciben textos.
- El inglés se elige del mismo largo que el español (±15 % de caracteres) para que los rótulos no se salgan de sus cajas ni pisen flechas; si no alcanza, se absorbe con `textAnchor` antes de mover coordenadas. Nombres de producto (views, editors, layouts, `juego.exe`, `player.gd`) quedan en inglés en ambos idiomas.
- Al tocar una frase en español, revisar su gemela en inglés en el mismo cambio, y abrir el slide en `/learn/...` y `/es/learn/...`.

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

## Animaciones y transiciones

### Diagramas que continúan el slide anterior (morph)

Cuando un slide es *el mismo diagrama* del slide anterior con piezas menos o textos nuevos, se anima la transición al entrar: el SVG copia el `viewBox` y las coordenadas del diagrama anterior, se dibuja en su **estado final**, y las clases de `Deck.module.css` reproducen el estado previo al montarse el slide:

- `s.morphOut` — el elemento empieza visible (estado del slide anterior) y se desvanece.
- `s.morphIn` — el elemento aparece.
- `s.morphGlide` — el elemento viaja desde `--morph-from` (un `transform`) hasta su posición final.
- `s.morphPulse` — énfasis: el grupo escala brevemente desde su centro (envuelve al `morphIn` del elemento a destacar).

Siempre sobre `<g>` envolventes (opacidad natural 1), nunca sobre elementos con atributo `opacity`. Los pasos se escalonan con `animation-delay` inline en pasos de 0.6s; la espera antes de la primera animación es **0s** — el primer paso arranca justo al entrar el slide, sin pausa inicial. Un crossfade de texto son dos `<g>` (viejo `morphOut`, nuevo `morphIn`) con el mismo delay. Con `prefers-reduced-motion` el slide queda directo en su estado final.

## Convenciones de contenido ya establecidas

- Los ejemplos de programa se llaman `juego.c` / `juego.exe` (no `main.c` ni `game.exe`), y el binario muestra sus unos y ceros junto a la etiqueta: `0110 1001 · binario`.
- Lo que entra a un motor se dice "programas programados/configurados", con "recursos · código · configuraciones" debajo.
- Lo externo al flujo (los recursos) va arriba y separado, alimentando hacia abajo con codos.

## Por presentación

### que-es-un-motor-de-audio

- El arco de la clase: Portada → compilados vs interpretados → el OS corre los compilados → un motor corre los interpretados → qué es un motor → game engines → motores de audio. Cada slide nuevo debe encajar en esa progresión de lo general a lo específico.
- El slide "audio engines" (z=6) hace morph desde el diagrama de "game engines" (z=5): CÓDIGO y sus flechas se desvanecen, el engine sube a alinearse con las configuraciones y los textos cruzan al dominio de audio. Si cambia la geometría del z=5, hay que actualizar el estado inicial del z=6.

### datos-programas-y-servidores

- Es la primera clase de la sección `Intro` del curso (todas las clases llevan `section: 'Intro'` en el registro). Es hermana de `que-es-un-motor-de-audio`, que va justo después. Abre con portada (mismo formato: `z="▶"`, `Cover.jpg`, título en `h1` con una palabra en ámbar; el eyebrow de la portada carga el detalle que el título corto no nombra: "Intro a Wwise · del disco al servidor").
- El arco de la clase: Portada → la biblioteca (analogía de disco/RAM/caché) → morph a hardware → los lenguajes (niveles de abstracción: de Python al código máquina que lee la CPU) → el restaurante (qué es un servidor: petición/proceso/respuesta) → morph a cliente/servidor → cada servidor sirve lo suyo (web/FTP/base de datos) → la computadora servidor (hardware para servir 24/7, sin gráfica) → el arranque del juego en un celular (el juego corre en RAM con el init cargado y soundbank_menus sube del disco al vuelo) → (por definir; mantener la progresión de lo general a lo específico).
- La analogía: estanterías = disco, la mesa con libros a medio leer = RAM, los libros abiertos del centro = caché, las dos personas sentadas = CPU. Las tres flechas codifican velocidad con su largo: levantarse a la estantería (lento) > alcanzar otra esquina de la mesa (rápido) > leer el libro abierto (al instante).
- El slide "computador" (z="=") hace morph desde "la biblioteca" (z=1): geometría idéntica (compartida en `EscenaBiblioteca`), solo los rótulos cruzan de dominio en un paso único, más lento que el estándar (`animation-duration` 1.2s inline). Los rótulos de cada dominio viven en `RotulosBiblioteca` / `RotulosComputador`; si cambia uno, revisar su gemelo.
- El slide "lenguajes" (z=2) es una pila vertical de cuatro niveles (`t.lenguajes.niveles` en el diccionario), del más humano arriba al código máquina abajo, unidos por flechas ámbar rectas. Solo la caja de código máquina es protagonista: es lo que lee la CPU del slide anterior, y así se enlaza con él. Dos callouts laterales lo rematan: "tú escribes aquí" (teal, arriba) y "la CPU lee aquí" (ámbar, abajo). La línea "se compila antes de correr" de C++ anticipa a propósito el Concepto 1 de `que-es-un-motor-de-audio` (compilados vs interpretados), la clase siguiente, para tender el puente entre las dos.
- El slide "cliente-servidor" (z="=") repite ese mismo patrón desde "el restaurante" (z=3): geometría compartida en `EscenaRestaurante`, rótulos gemelos en `RotulosRestaurante` / `RotulosClienteServidor` (tú → PC cliente, cocina → PC servidor, despensa → recursos, flechas → petición/respuesta, verificar ingredientes → verificar acceso y poder armar la respuesta).
- El arranque es una secuencia de pasos manuales: el slide "arranque" (z=6) más tres slides "=" ("pide", "busca", "sube"), todos con la misma escena (`EscenaArranque({ paso })`) y el mismo h2/eyebrow — cada avance de slide añade un paso y anima solo la pieza nueva con `morphIn` (las anteriores quedan estáticas). El disco muestra EL JUEGO con sus SoundBanks como cajas individuales (soundbank_init, soundbank_menus, soundbank_nivel_1); la RAM arranca con game engine, escena main, sound engine y soundbank_init (cajas sueltas, sin contenedor) y una posición libre punteada. Pasos: ① escena main → sound engine («suena el menú»), ② sound engine → soundbank_menus en el disco, ③ el banco sube en codo a la posición libre y aparece soundbank_menus con `morphPulse` (0.6s después de la flecha) — nivel_1 se queda en disco. Pendiente: pasos siguientes donde aparece soundbank_nivel_1 en RAM y desaparece soundbank_menus.

### wwise-por-adentro

- Abre sin portada: el primer slide es un recap del último slide de `que-es-un-motor-de-audio` (mismo diagrama), con eyebrow "Recap · donde quedamos".
- El recap hace morph desde el estado final de ese slide (misma geometría, `viewBox` incluido) al entrar: la caja central cruza hacia WWISE OBJECT con un `morphPulse` de énfasis y pasa a estilo protagonista, y aparece el label "SoundBanks". Si cambia aquel diagrama, este estado inicial se actualiza con él.
- El arco de la clase: recap del patrón del motor de audio → Wwise de punta a punta → (por definir; mantener la progresión de lo general a lo específico).

### el-editor-wwise

- El arco de la clase: Portada → los views (el menú Views tal cual: las familias Editors / Profiler / Utilities con submenú, y los views directos) → los de todos los días (Project Explorer, Transport Control, Soundcaster) → editors de propiedades (Property Editor con pestañas + RTPC, States, Effects, Stingers, Metadata) → editors por tipo de objeto (Music Playlist, Music Segment, State, Switch, SoundBank, Effects, Event) → los layouts (dos acomodos del mismo lienzo) → tabla de layouts de fábrica → el layout Designer.
- El slide z=6 (tabla de layouts) usa `s.plain` — excepción deliberada al principio de poquísimo texto, para listar los layouts de fábrica con su atajo (F5–F12) y su propósito.
- El slide z=2 hace morph desde z=1: misma geometría; los tres views útiles cruzan a protagonistas con pulso escalonado, el resto se atenúa, y la caja Editors pulsa al final como puente al z=3.
- El slide z=3 entra con un zoom (`morphGlide`) desde la posición de la caja Editors del z=2; el z=4 es un crossfade de contenido en un paso único sobre el mismo contenedor del z=3. Si cambia la geometría de uno de estos slides, actualizar la de su vecino.
