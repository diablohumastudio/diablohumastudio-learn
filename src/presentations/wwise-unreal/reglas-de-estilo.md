# Reglas de estilo — curso Wwise + Unreal

Reglas de todas las presentaciones de este curso (`src/presentations/wwise-unreal/`). Si una presentación necesita apartarse de algo, su override va en la sección [Por presentación](#por-presentación) de este mismo documento — no en un archivo aparte.

## Principio

**Súper gráfico, poquísimo texto.** Cada slide es una frase grande (`h2`) más un SVG protagonista. Nada de párrafos: si la idea necesita explicarse con texto, es que al dibujo le falta.

## Idioma

Español, con los términos técnicos en inglés tal como se usan en la industria: SoundBanks, engine, scripts, plugin, calls, prefabs.

Cada deck tiene un diccionario hermano `<slug>.dict.tsx` con todos sus textos en `es` y `en` (la mecánica está en `docs/learn-courses-and-slides.md`). El español es la fuente: se escribe primero y el inglés se ajusta a él. Reglas del curso:

- Nada de texto literal en el deck: `h1`/`h2`, eyebrows, `figcaption`, `aria-label`, cada `<text>` del SVG, los `label` de los slides y el `name`/`context` del `Deck` salen del diccionario. Los `Rotulos*` reciben su objeto de textos por prop; las `Escena*` (geometría) no reciben textos.
- El inglés se elige del mismo largo que el español (±15 % de caracteres) para que los rótulos no se salgan de sus cajas ni pisen flechas; si no alcanza, se absorbe con `textAnchor` antes de mover coordenadas. Nombres de producto (views, editors, layouts, `juego.exe`, `player.gd`) quedan en inglés en ambos idiomas.
- Al tocar una frase en español, revisar su gemela en inglés en el mismo cambio, y abrir el slide en `/course/...` y `/es/course/...`.

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
- Lo que no cabe en el slide (la analogía detrás de un diagrama, la explicación larga) va en las **notas** del slide: la prop `notes` de `Slide`, con su texto en el diccionario (mecánica en `docs/learn-courses-and-slides.md`). Un slide con pasos tiene las mismas notas en todos sus pasos.
- Las imágenes de un slide (PNG con transparencia, recortadas en piezas) van en `public/assets/presentations/wwise-unreal/` y se dibujan con `<image>` dentro del mismo SVG que los rótulos, para que compartan el `viewBox` y las animaciones.

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

### Secuencias dentro de un slide (pasos)

Cuando una secuencia es *el mismo diagrama con el mismo h2* que se va construyendo pieza a pieza, no se hace con varios slides `=` sino con un **slide con pasos**: `label` recibe un array (un rótulo por paso) y el contenido lee el paso actual con `useSlideStep()` (mecánica en `docs/learn-courses-and-slides.md`). Cada `→` añade una pieza sin remontar el slide, así que solo la pieza nueva lleva `morphIn` y las anteriores quedan estáticas. Un slide con pasos también sirve cuando la *forma* se mantiene y cambian los textos por paso (el `h2` incluido), como "qué es un motor" y sus ejemplos. Los slides `=` quedan para el morph a *otra idea*.

## Convenciones de contenido ya establecidas

- Los ejemplos de programa se llaman `juego.c` / `juego.exe` (no `main.c` ni `game.exe`), y el binario muestra sus unos y ceros junto a la etiqueta: `0110 1001 · binario`.
- Lo que entra a un motor se dice "programas programados/configurados", con "recursos · código · configuraciones" debajo.
- Lo externo al flujo (los recursos) va arriba y separado, alimentando hacia abajo con codos.

## Por presentación

### que-es-un-motor-de-audio

- El arco de la clase: Portada → compilados (slide con tres pasos: solo el título "compilados vs interpretados", tu código se compila, a los compilados los corre el OS) → a los interpretados los corre un motor → definición de motor y ejemplos (slide con pasos: definición, navegador, Python, game engine, Wwise). Cada slide nuevo debe encajar en esa progresión de lo general a lo específico.
- "Compilados" (z=1, claves `lenguajes`, `compilados`, `elOs`) tiene la disposición fija en los tres pasos: el eyebrow, el `h2` (clase `s.h2TwoLines`, alto de dos líneas) y la figura ocupan siempre su sitio (`s.oculto` cuando aún no se muestran), así nada se desplaza. Paso 1: solo el título. Paso 2: el eyebrow "PROGRAMAS COMPILADOS" entra con `morphGlide` desde la posición del título (`translateY(64px) scale(3.5)`, origen arriba a la izquierda), de modo que las palabras parecen subir y encogerse, y aparece juego.c → COMPILADOR → juego.exe. Paso 3: título "a los compilados los corre el OS" y aparecen OS y CPU en las filas 4 y 5.
- "Interpretados" (z=2) comparte con el anterior la pila vertical de cinco filas (`FILA_Y`, cajas `Caja` de 560 px y flechas `FlechaFila`). Al entrar, la pila compilada completa (`PilaCompilada`) sale hacia la izquierda desvaneciéndose (`morphGlideOut`, `--morph-to`) y la pila interpretada entra desde la derecha (0.3 s): player.gd (fila 1) → MOTOR (fila 2) → hueco (fila 3) → OS → CPU, con OS y CPU en las mismas filas que antes. El `h2` lleva también `s.h2TwoLines`.
- "Definición de motor y ejemplos" (z=3) es un slide con cinco pasos (claves `queEsUnMotor`, `navegador`, `python`, `gameEngines`, `audioEngines`) y una sola forma: caja de entrada (lo que se corre, con sus recursos como subtítulo adentro; no hay caja de recursos aparte) → caja del motor → "comportamiento". `ContenidoMotor` cambia el `h2` y los textos de las cajas por paso (`t.queEsUnMotor.pasos`). Para que todo quede a la misma altura, los cinco títulos van en dos líneas cortadas en el mismo sitio, con el sustantivo (motor, navegador web, Python, game engine, Wwise) y lo que corre (correr programas, páginas web, scripts .py, escenas + scripts, Wwise objects) en ámbar, y la tabla `s.plain` se muestra completa desde el paso 1 con sus cuatro filas vacías (`&nbsp;`), llenando la fila de cada ejemplo en su paso. Esta forma es la que continúa el recap de `wwise-por-adentro`.

### datos-y-programas

- Es la primera clase de la sección `Intro` del curso. Está implementada a partir del guion `creacion_guiones_wwise-unreal/guion_clase_1_datos_y_programas.md`: cada diapositiva es el estado final que describe su «Pantalla», y cada acción entre corchetes de la narración es una entrada escalonada (`Entra`, `Pulsa`, `EntraYPulsa`, `EntraPorEscala`, `Temporal`) en un turno de 0,6 s (`turno(n)`), en el orden en que la voz la nombra; los turnos de cada diapositiva viven en constantes `TURNOS_*`. Cuando exista audio, esos turnos se sincronizan con la voz.
- El arco: Portada (`z="▶"`, `ComputerCover.jpg`, título y pista entran por escala) → dos ideas (z=0, dos pasos: `ideas`, los dos recuadros entran uno por uno; `datos`, el primero queda en ámbar y el esquema se encoge hasta la esquina) → qué es un dato (z=1) → la analogía biblioteca/computador (z="=", dos pasos) → qué es un programa (z=2) → los niveles de abstracción (z="=") → cierre (`z="↺"`, dos frases). Los `z` numeran las dos ideas; `=` continúa la idea en curso.
- Esquema de ideas (`CajaIdea`, `EsquemaIdeas`): el mismo patrón que `work-units-y-vcs`, con dos cajas. A pantalla completa en z=0 (viewBox 940×150) y en miniatura (`s.minimap`, viewBox 234×36, textos de `ideas.cortos`) arriba a la izquierda de z=1 a los lenguajes, con la idea actual en ámbar. Entra grande y se encoge (`entraGrande`, `morphGlide` con `scale`) en el paso `datos` de z=0 y al abrir «qué es un programa»; en z=0 el hueco de la miniatura y el de la figura se reservan con `s.oculto` para que nada se mueva entre pasos. El cierre no lleva esquema.
- Qué es un dato (z=1, `FiguraDato`): tres `Tarjeta` iguales, texto / imagen / sonido, que entran una por una. El texto son líneas reales del diccionario (`textoLineas`), la imagen es la portada del curso (`ComputerCover.jpg`, recortada con `clipPath`) y el sonido es una forma de onda de barras ámbar (`ONDA`). Sin dibujos nuevos: las imágenes del deck son fotos y capturas reales.
- La analogía (z="=", `FiguraBiblioteca`, `ContenidoBiblioteca`) usa las piezas PNG (`biblioteca-*.png` / `computador-*.png`, recortes de una sola ilustración; `PIEZAS` a escala 0.5). Paso 0: la figura, el título y el kicker entran por escala, luego pulsan las personas, el kicker y los libros, y cada rótulo de velocidad entra cuando la voz lo nombra (`TURNOS_BIBLIOTECA`). Paso 1: el kicker cambia (`key` por paso) y las piezas cruzan en el orden de la voz (`TURNOS_COMPUTADOR`): CPU, cachés señaladas con cuatro rectángulos ámbar (`CACHES_EN_CPU`), foto del chip (`FotoChip`, `cpu-die-13900k.jpg`, con «núcleo» y «memoria caché» sobre la foto; `Temporal` la muestra y la borra), RAM, discos, foto del disco con cables (`FotoDisco`, `disco-duro-sata.jpg`) y al final la flecha «cargando…» del disco a la RAM con la leyenda, que solo existe en el paso 1 (`s.oculto` en el 0). `GrupoAnalogia` recibe el turno en vez de un delay fijo; `Entra` y `Pulsa` llevan `activo={paso === 0}` para que los rótulos de la biblioteca no vuelvan a animarse en el paso 1.
- Qué es un programa (z=2, `FiguraPrograma`): arriba, archivo de código → COMPILADOR / INTÉRPRETE (protagonista) → instrucciones con sus unos y ceros, con el programador bajo el código y el PC bajo las instrucciones (`IconoProgramador`, `IconoPc`: íconos de línea, como los de `wwise-objects`); abajo, tres capturas reales (`EJEMPLOS`: `captura-word.png`, `juego-abyss-odyssey.jpg`, `captura-excel.png`) unidas al PC por un bus de flechas. Al entrar los ejemplos, el esquema de arriba se encoge un poco (`morphGlide` desde `scale(1.08)`).
- Lenguajes (z="=", `FiguraLenguajes`): la pila de cuatro niveles (`NIVEL_X` 220, 400 px de ancho, solo títulos) con el código máquina como única caja protagonista, MÁS / MENOS ABSTRACTO a la izquierda y, a la derecha, el cuadro de explicación (`CUADRO_X` 640, 270 px) que muestra la explicación de cada nivel por turnos, de abajo hacia arriba (`turnoExplicacion`, `TURNOS_POR_EXPLICACION` ≈ 6 s cada una, con un pulso en la caja explicada) y luego se borra. Los callouts «En Wwise y Blueprints de Unreal, tú escribes aquí» (teal, dos líneas) y «la CPU lee aquí» (ámbar) entran en sus turnos sin esperar al ciclo, para que la diapositiva sirva sin audio. La caja de arriba dice PYTHON / JAVASCRIPT / WWISE OBJECTS / BLUEPRINTS. La línea «por lo general se compila antes de correr» de C++ anticipa a propósito la clase `que-es-un-motor-de-audio`.
- Créditos de las imágenes descargadas: una línea pequeña y gris bajo la imagen (`fontSize` 8 a 8,5, `opacity` .55) y el detalle en las notas de la diapositiva. Chip: Intel Core i9-13900K, Fritzchens Fritz, CC0. Disco: Thomas Rosenau, CC BY-SA 2.5. Juego: Abyss Odyssey, ACE Team, CC BY-SA 3.0 (hecho con Unreal Engine). Word y Excel: capturas sin alterar, «Used with permission from Microsoft.» según las condiciones de Microsoft (solo redimensionar, sin recortes ni contenido de terceros).

### datos-programas-y-servidores

- Entrada provisional: es la clase que quedó de dividir «Datos, programas y servidores» (2026-10-16). Conserva el slug para que las preguntas con ese `topic` y las URL sigan sirviendo, se titula «Servidores» y solo tiene las diapositivas de servidores; la portada es provisional. Se reemplazará con el guion `guion_clase_2_servidores.md`, y entonces se decidirá si cambia el slug.
- El arco actual: Portada → el modelo cliente-servidor (z=1: qué es un servidor: petición/proceso/respuesta) → tipos y ejemplos de servidores (z=2) → backend (z=3: varios servidores que trabajan juntos) → hardware de servidor (z=4: para servir 24/7, sin gráfica) → instalar y abrir un programa (z=5: abrir el juego es copiarlo del disco a la RAM; pendiente de decidir a qué clase pertenece).
- El slide "cliente-servidor" (z=1): geometría en `EscenaPeticion` (cliente a la izquierda, servidor grande a la derecha, dos flechas) y rótulos en `RotulosPeticion` (PC cliente, PC servidor, petición/respuesta). El servidor lista tres pasos numerados dentro de su caja: validar usuario / buscar recursos / armar la respuesta. No hay caja de recursos externa. La analogía del restaurante (tú → cocina → camarero) ya no es un slide: vive en las notas de este.
- El slide "servidores" (z=2) tiene cuatro filas compactas (web, base de datos, git, autorización) con ejemplos reales a la derecha (`ejemplos` admite dos líneas; `sirveDetalle` es una segunda línea opcional bajo "sirve"). FTP se menciona en las notas del slide, no en la figura.
- El slide "backend" (z=3, `EscenaBackend`): el PC cliente a la izquierda habla con un solo punto del backend, la caja SERVIDOR WEB / API dentro de una caja grande BACKEND; adentro, la API consulta en teal al servidor de autorización ("valida") y a la base de datos ("busca"). La petición es "pides un DLC" y la respuesta "recibes el DLC"; qué es el DLC (un paquete nuevo del juego con su soundbank) va en las notas, y los ejemplos de plataformas (Nakama, LootLocker, Steamworks, Google Play Services, Apple Game Center) en el caption y las notas.
- El slide "hardware" (z=4) compara dos máquinas lado a lado con el componente `Maquina`: la computadora servidor (tarjetas de red y fuente en ámbar; tarjeta de video punteada, "inexistente") y la PC de diseño gráfico (tarjeta de video en ámbar; red y fuente básicas). Las flechas de peticiones/respuestas entran por arriba del servidor.
- "Instalar y abrir un programa" (z=5) es un slide con tres pasos (claves `arranque`, `instalas`, `abres`) y título por paso (`titles`): fuera del CELULAR, a la izquierda, una caja SERVIDOR ("o disco de instalación") con el JUEGO; el celular tiene DISCO y MEMORIA RAM vacíos. Paso 2: flecha "instalas el juego" y una copia del JUEGO (`CopiaJuego`) se desliza del servidor al disco con `morphGlide` (0.9 s). Paso 3: flecha "abres el juego" y otra copia se desliza del disco a la RAM y queda "corriendo". Los originales se quedan donde estaban. La versión anterior con SoundBanks subiendo al vuelo se descartó.

### wwise-por-adentro

- Abre sin portada: el primer slide es un recap del último paso de "qué es un motor" en `que-es-un-motor-de-audio` (misma forma: WWISE OBJECTS con sus recursos adentro → SOUND ENGINE → audio, mismo `viewBox`), con eyebrow "Recap · donde quedamos".
- Lo único que se anima al entrar es el rótulo "SoundBanks" sobre la flecha entre las dos cajas (`morphIn`). Si cambia aquella forma, este slide se actualiza con ella.
- El arco de la clase: recap del patrón del motor de audio → Wwise de punta a punta → (por definir; mantener la progresión de lo general a lo específico).

### el-editor-wwise

- El arco de la clase: Portada → los views (el menú Views tal cual: las familias Editors / Profiler / Utilities con submenú, y los views directos) → los de todos los días (Project Explorer, Transport Control, Soundcaster) → editors de propiedades (Property Editor con pestañas + RTPC, States, Effects, Stingers, Metadata) → editors por tipo de objeto (Music Playlist, Music Segment, State, Switch, SoundBank, Effects, Event) → los layouts (dos acomodos del mismo lienzo) → tabla de layouts de fábrica → el layout Designer.
- El slide z=6 (tabla de layouts) usa `s.plain` — excepción deliberada al principio de poquísimo texto, para listar los layouts de fábrica con su atajo (F5–F12) y su propósito.
- El slide z=2 hace morph desde z=1: misma geometría; los tres views útiles cruzan a protagonistas con pulso escalonado, el resto se atenúa, y la caja Editors pulsa al final como puente al z=3.
- El slide z=3 entra con un zoom (`morphGlide`) desde la posición de la caja Editors del z=2; el z=4 es un crossfade de contenido en un paso único sobre el mismo contenedor del z=3. Si cambia la geometría de uno de estos slides, actualizar la de su vecino.

### wwise-objects

- El arco de la clase: Portada → el camino de un sonido (z=1, slide con cinco pasos: el camino / game input / señal / procesa / soundbanks) → una clasificación didáctica (z="=", morph desde el flujo: las mismas cinco familias ordenadas para nombrarlas) → y de ahí una familia por concepto, numerada por familia: Contenido (z=2: sonido, estructura, herencia) → Mixing · Routing (z=3: busses, aux) → Procesamiento (z=4: efectos, sharesets) → Game Input (z=5: events, game syncs) → Packaging (z=6) → cierre (z="↺": el flujo otra vez, en su estado final, sin pasos). El eyebrow lleva "Concepto N · familia · tema". Salvo la clasificación, los slides `=` son la continuación de la misma familia, no un morph.
- Herencia es un árbol de tres pisos (raíz → dos Property Containers → tres sonidos) para que la suma de volúmenes se vea piso a piso; el override se muestra con una propiedad absoluta (el bus), no con el volumen, que en Wwise es relativo y se suma. Lleva la miniatura de Estructura.
- Events muestra cuatro Actions con el rótulo ACTION en la esquina (`esquina` de `Caja`); la cuarta repite Set RTPC con otro valor y va en rojo (`ROJO`) como contraejemplo, con la advertencia de que los Events no reciben argumentos. Sin Dialogue Event: no aporta a ese slide.
- La clasificación es nuestra, no la de Wwise (el caption lo dice): **Game Input** (Events: qué acciones hacer · Game Syncs: qué variables cambiar directamente), **Contenido** (grilla 2×2: filas Sonido / Estructura, columnas SFX / Music), **Mixing · Routing** (busses), **Procesamiento** (efectos y ShareSets) y **Packaging**. Las cinco cajas (`CajaGameInput`, `CajaContenido`, `CajaMixing`, `CajaProcesamiento`, `CajaPackaging`) se dibujan con el mismo tamaño y el mismo `viewBox` (940×410) en el flujo y en la clasificación; sus posiciones viven en `FLUJO` y `CLASIFICACION`. La clasificación las desliza con `morphGlide` desde el flujo, desvanece las flechas, Game, Salida y el marco de SoundBanks (`morphOut`) y hace aparecer Packaging (`morphIn`, 0.6s).
- Desde z=2, cada slide que trata una familia abre con `Minimapa` arriba a la izquierda (clase `s.minimap`, 210 px, antes del eyebrow): la clasificación en miniatura, solo títulos y sin padding, todo en gris salvo la caja de la familia del slide (`resaltado`: `sonido`, `estructura`, `mixing`, `procesamiento`, `events`, `gameSyncs`, `packaging`). Sonido y Estructura van en una sola caja cada uno (1.4× de ancho) porque SFX y Music siempre se ven juntos. En el primer slide que la lleva (sonido) va con `entraGrande`: aparece del tamaño de la clasificación y se encoge hasta su lugar (`morphGlide` con `scale`, 0.9s). El cierre no lleva miniatura.
- En los slides de sonido y estructura, cada caja lleva el color de su columna (`SONIDO_COLORES`, `ESTRUCTURA_COLORES`); las que sirven a las dos columnas o no pertenecen a la grilla (Property Container, Plug-in sources, Folders) quedan neutras.
- El slide de busses (z=3) muestra las tres carpetas de la pestaña Audio: Containers, Busses y Devices. En Devices van tres íconos dibujados a mano (`IconoParlante`, `IconoControl`, `IconoAudifonos`): el Main Audio Bus sale al parlante, el Master Motion Bus al control y el Secondary Bus a los audífonos.
- El slide de game syncs lleva un dibujo dentro de cada caja (`DibujoSwitch`: dos selectores, uno por Game Object; `DibujoState`: un selector con marco "todo el juego"; `DibujoRtpc`: curva con el punto del valor actual; `DibujoTrigger`: un pulso que cae en el siguiente tiempo del compás). Sus textos viven en `gameSyncs.dibujos`.
- En el flujo hay dos tipos de flecha: **ámbar = señal** (Game → Game Input, Contenido → Mixing → Salida) y **teal = actúa sobre** (Game Input → Contenido / Mixing / Procesamiento; Procesamiento → Contenido / Mixing). El marco de SoundBanks encierra Game Input, Contenido, Mixing y Procesamiento; Game y Salida quedan afuera.
- Colores de columna en la grilla de Contenido: SFX azul `#6f9fd8`, Music violeta `#a88bd4` (los mismos que usan los paneles de layouts en `el-editor-wwise`); son los únicos colores fuera de ámbar/teal.
- Terminología de Wwise actual (2025): en el Project Explorer la pestaña Audio tiene las carpetas Devices, Busses y Containers; ya no existen la Actor-Mixer Hierarchy, la Master-Mixer Hierarchy ni la Interactive Music Hierarchy. El Actor-Mixer se llama Property Container y el Master Audio Bus, Main Audio Bus. No usar los nombres viejos en ningún slide.
- Es un catálogo de objetos, así que casi todo se dibuja con un solo componente `Caja` (título + subtítulos centrados; estilos `normal` / `protagonista` / `teal` / `atenuada`, o `colorBorde` para las columnas SFX / Music). Los textos de cada caja viven en el diccionario como `{ nombre, subs }`; en los containers (z=3) el primer sub es la pregunta que responde el container y va en ámbar (`primerSubAmbar`).
- Los nombres de tipo de objeto (Sound SFX, Switch Container, Aux Bus, Work Units…) quedan en inglés en ambos idiomas; los ejemplos usan `footstep_*`, `Play_Footstep`, `Reverb_Hall`, `car_rpm`.
- Color: ámbar para el flujo principal y las cajas que importan en el slide; teal para lo que alimenta desde afuera (Game Syncs, el código del juego, los sends y aux busses, los hijos que heredan).
- Los teaching points de la fuente van en el `figcaption`; las indicaciones dirigidas al profesor (cómo presentar algo) no se incluyen.

### work-units-y-vcs

- El arco de la clase, escrito desde el guion `creacion_guiones_wwise-unreal/guion_clase_7_work_units_y_vcs.md`: Portada → tres ideas (z=0, slide con cuatro pasos: el marco y un recuadro por idea, la leyenda entra en el último) → Idea 1, qué archivos van a Git (z=1, tres pasos: `wwise`, `unreal`, `binarios`) → Idea 2, un Work Unit es un archivo (z=2, dos pasos: `archivoWwu`, `nuevoWorkUnit`) → Idea 3, repartir el proyecto (z=3, dos pasos: `solo`, `equipo`). Cinco slides en total, a propósito: la clase es corta.
- Desde z=1, cada slide abre con `EsquemaIdeas` arriba a la izquierda (clase `s.minimap`, como el `Minimapa` de `wwise-objects`): las tres ideas en miniatura, en gris salvo la actual, en ámbar. Los textos cortos salen de `ideas.cortos`.
- Los slides con pasos llevan `h2` con `s.h2TwoLines` y título, `aria` y `figcaption` por paso (`titles`, `arias`, `captions`); la narración de cada paso empieza anunciando «cambian el título y la leyenda».
- Archivos (z=1): dos paneles iguales (`PanelArchivos`, 430 px), WWISE y UNREAL, con siete filas cada uno: nombre en mono (ámbar si va a Git, gris si no), nota corta del porqué en `s.svgSans` y una pastilla (`Pastilla`): «sí» rellena de ámbar, «no» solo borde, «depende» rellena de teal. Las filas entran una a una **en el orden del diccionario, que es el orden en que la voz las nombra** (no el orden de la tabla del material docente). La marca «LFS» de Originals y Content (`lfs: true` en la fila) se muestra solo en el paso de binarios, con `morphPulse`. El tercer paso añade dos recuadros (`CajaBinarios`): texto, ámbar; binario y Git LFS, teal.
- Work Unit (z=2): dos columnas sin marco, PROJECT EXPLORER y EN EL DISCO, con el árbol de `Containers` dibujado con `RamaArbol` y `HojaArbol`; los Work Units son `CajaNodo` y cada uno se une a su archivo con una flecha ámbar recta. Las entradas se escalonan en el orden del guion (árbol, disco, pulso del archivo, flecha, pulso del nodo); `Pulso` envuelve un grupo ya visible con `morphPulse` y un `animationDelay`. El paso 2 añade `WU_Ambiente` y su archivo en ámbar, la etiqueta «nuevo» y la etiqueta teal «sin cambios» junto al Default.
- Repartir (z=3): dos columnas, `Containers/` y `Events/`, con cinco `CajaNodo` cada una: el Default atenuado (entra y pulsa primero) y los cuatro `WU_*` en ámbar, que entran uno a uno. El paso 2 añade etiquetas de personas (`Etiqueta`, teal) y marca en rojo (`ROJO`) la caja que editan dos personas a la vez; las dos leyendas del pie entran con la voz (teal, luego rojo). Es el único slide del curso que usa rojo además de ámbar y teal, junto al contraejemplo de Events en `wwise-objects`.
- Nombres de archivo y de Work Unit (`WU_Ambiente`, `Default Work Unit.wwu`, `amb_bosque_loop`) son los de la práctica de la clase 7 del material docente y quedan iguales en ambos idiomas.
