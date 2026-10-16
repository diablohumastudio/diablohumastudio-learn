# Guion · Clase 7 · Work Units y control de versiones

Formato, proceso, convenciones y reglas de revisión: `../screenplay_creation_guide.md`. Estado del proyecto y archivos de las demás clases: `handoff.md`.

Estado: borrador escrito junto con las diapositivas (`../wwise-unreal/work-units-y-vcs.tsx`) a partir de `Clases/Clase07/Contenido.md` del material docente; revisado por el verificador de pedagogía y corregido; pendiente de revisión del docente (2026-10-16).

## Clase 7 · Work Units y control de versiones

`/course/wwise-unreal/class/work-units-y-vcs`

### s=0 · intro · Portada

Kicker: «Wwise + Git · lo que se guarda y lo que se regenera»

Título: «Work Units y control de versiones»

Pantalla:
- Portada con la foto de fondo de la máquina de engranajes de Wwise.
- Pista: «Navega con ← → · espacio».

Objetivo: 29 s · 70 palabras ≈ 29 s

```text
[El kicker ya está en pantalla]
Bienvenido a la clase Work Units y control de versiones. [Aparece el título]

Un proyecto de audio es una carpeta con cientos de archivos de Wwise y de Unreal. {pausa}

Verás qué archivos de esa carpeta guarda Git, qué es un Work Unit y cómo repartir el proyecto. Te servirá para trabajar solo o en equipo sin que el proyecto se rompa ni se pierda.

Avanza con la flecha derecha o la barra espaciadora. [Aparece la pista]
```

### s=1 · Qué guarda Git de tu proyecto (diapositiva con cuatro pasos)

Kicker: «Tres ideas»

Título: «Qué guarda Git de tu proyecto»

Pantalla:
- Tres recuadros en fila, numerados: «1 · Qué archivos van a Git», «2 · Un Work Unit es un archivo», «3 · Repartir el proyecto». Cada paso hace entrar un recuadro; el último paso añade la leyenda.
- Leyenda: «Git guarda archivos, no proyectos: todo parte de ahí.»

#### s=1 p=0 · tres ideas

Objetivo: 15 s · 37 palabras ≈ 15 s

```text
[El kicker y el título ya están en pantalla]
Git, el programa de control de versiones, guarda la historia de esa carpeta, pero no sabe qué es Wwise ni qué es Unreal. Solo ve archivos, y tú le dices cuáles ignorar. {pausa} Por eso veremos tres ideas.
```

#### s=1 p=1 · archivos

Objetivo: 4 s · 9 palabras ≈ 4 s

```text
Primero, qué archivos van a Git y cuáles no. [Entra el primer recuadro]
```

#### s=1 p=2 · work unit

Objetivo: 6 s · 14 palabras ≈ 6 s

```text
Segundo, qué es un Work Unit: el archivo donde Wwise escribe lo que creas. [Entra el segundo recuadro]
```

#### s=1 p=3 · repartir

Objetivo: 13 s · 32 palabras ≈ 13 s

```text
Y tercero, cómo repartir el proyecto en Work Units cuando trabajas solo y cuando trabajas en equipo. [Entra el tercer recuadro]

Las tres parten del mismo hecho: para Git, tu proyecto es una lista de archivos. [Aparece la leyenda]
```

### s=2 · Qué archivos van a Git (diapositiva con tres pasos)

Kicker: «Idea 1 · archivos»

Pantalla:
- Arriba a la izquierda, el esquema de las tres ideas en pequeño, con la primera resaltada en ámbar.
- Dos paneles del mismo tamaño, WWISE a la izquierda y UNREAL a la derecha. Cada panel es una lista de siete filas: a la izquierda el nombre del archivo o carpeta en monoespaciada (ámbar si va a Git, gris si no), en el centro una nota corta del porqué, y a la derecha una pastilla: «sí» rellena de ámbar, «no» con borde gris, «depende» rellena de turquesa. Las filas entran una a una, en el orden en que la voz las nombra.
- La marca «LFS» de las filas de Originals y de Content no se ve hasta el tercer paso.
- Debajo de los paneles, dos recuadros que ocupan el ancho de cada panel: a la izquierda, con borde ámbar, «texto: Git compara línea por línea · .wwu · .ini · .uproject»; a la derecha, con borde turquesa, «binario: cambió entero · Git LFS · .wav · .uasset · .umap · .bnk».

#### s=2 p=0 · wwise

Título: «Fuente sí, derivado no»

Pantalla: solo el panel de Wwise, con sus filas en este orden: `MiJuego_WW.wproj` sí · fuente; `Containers/*.wwu · Events/*.wwu` sí · fuente; `Originals/*.wav` sí · fuente; `.cache/` no · se regenera; `.backup/ · *.akd · *.prof` no · se regenera; `*.wsettings · *.validationcache` no · por usuario; `GeneratedSoundBanks/` depende · Unreal los lee.

Leyenda: «Lo que escribiste o importaste va a Git; lo que Wwise recalcula o es de tu usuario, no.»

Objetivo: 42 s · 101 palabras ≈ 42 s

```text
[El esquema de ideas se hace pequeño y queda en la esquina, con la primera idea resaltada]
Ahora veamos qué archivos van a Git. [Entra el panel de Wwise, vacío]

Lo que tú escribiste o importaste es fuente y va a Git. Lo que Wwise recalcula es derivado y no va. {pausa}

En Wwise son fuente el archivo del proyecto, los Work Units y los audios originales. [Entran las tres filas con «sí»]

La caché de conversión y las copias de respaldo son derivadas: Wwise las vuelve a crear. [Entran las dos filas con «no» de la caché y las copias] Las preferencias de tu usuario son personales y tampoco van. [Entra la fila de las preferencias]

Los SoundBanks, los paquetes de audio que Wwise genera para el juego, son derivados, pero Unreal los lee sin cambios. [Entra la fila de SoundBanks, con «depende»] Van a Git si el equipo quiere abrir el juego sin generarlos.
```

#### s=2 p=1 · unreal

Título: cambia a «Unreal: lo que el editor regenera no va»

Pantalla: entra el panel de Unreal con sus filas en este orden: `MiJuego_UE.uproject` sí · fuente; `Config/*.ini` sí · fuente; `Content/*.uasset · *.umap` sí · fuente; `Plugins/*/Source/` sí · código; `Binaries/ · Intermediate/` no · se recompila; `Saved/ · DerivedDataCache/` no · local y cachés; `Plugins/*/ThirdParty/` no · reinstalable.

Leyenda: cambia a «Binaries, Intermediate, Saved y DerivedDataCache se recrean solos; el SDK lo reinstala el Launcher.»

Objetivo: 29 s · 69 palabras ≈ 29 s

```text
[Cambian el título y la leyenda] Ahora, el proyecto de Unreal. [Entra el panel de Unreal, vacío]

Va a Git lo que tú creaste o configuraste: el archivo del proyecto, la configuración, el contenido y el código del plugin de Wwise. [Entran las cuatro filas con «sí»]

No va lo que el editor de Unreal vuelve a crear: Binaries, Intermediate, Saved y DerivedDataCache. [Entran las dos filas con «no»] Tampoco ThirdParty, las bibliotecas de Wwise que usa el plugin: pesan gigabytes y el Audiokinetic Launcher, el instalador de Wwise, las vuelve a instalar. [Entra la fila de ThirdParty]
```

#### s=2 p=2 · binarios

Título: cambia a «Texto se compara, binario no»

Pantalla: entran los dos recuadros de abajo, primero el ámbar y luego el turquesa; después aparece la marca «LFS» en las filas de Originals y de Content, con un pulso.

Leyenda: cambia a «Git LFS resuelve el peso de los binarios; que dos personas no editen el mismo lo resuelve la organización.»

Objetivo: 44 s · 106 palabras ≈ 44 s

```text
[Cambian el título y la leyenda] Git compara los archivos de texto línea por línea: los Work Units, la configuración y el archivo del proyecto. [Entra el recuadro ámbar]

Un archivo binario, como un wav o un uasset, no tiene líneas que comparar: Git solo sabe que cambió y guarda otra copia completa. [Entra el recuadro turquesa] Para que esas copias no pesen existe Git LFS: deja en Git una referencia pequeña y guarda el archivo aparte. [Aparece la marca «LFS» en las filas de Originals y de Content] {pausa}

Lo que Git LFS no resuelve es que dos personas editen el mismo binario: Git no puede combinar las dos versiones y hay que elegir una. Eso se resuelve repartiendo el trabajo, y para repartirlo hay que saber qué es un Work Unit.
```

### s=3 · Un Work Unit es un archivo (diapositiva con dos pasos)

Kicker: «Idea 2 · Work Units»

Pantalla:
- El esquema de ideas en la esquina, con la segunda idea resaltada.
- Dos columnas. A la izquierda, PROJECT EXPLORER: un árbol con `Containers` y, colgando, la caja «Default Work Unit» con las hojas `simple` y `Random`. A la derecha, EN EL DISCO: `Containers/` y, colgando, la caja «Default Work Unit.wwu». Una flecha ámbar recta une la caja del Work Unit con la caja del archivo.
- En el paso 2 se añaden, debajo, la caja ámbar «WU_Ambiente» con la hoja `amb_bosque_loop` a la izquierda, la caja ámbar «WU_Ambiente.wwu» a la derecha con la etiqueta «nuevo», una segunda flecha entre ambas, y la etiqueta turquesa «sin cambios» junto a «Default Work Unit.wwu».

#### s=3 p=0 · un archivo

Título: «Un Work Unit es un archivo .wwu»

Leyenda: «Lo que ves en el Project Explorer es la suma de archivos de texto, uno por Work Unit.»

Objetivo: 34 s · 81 palabras ≈ 34 s

```text
[El esquema de la esquina resalta la segunda idea]
Ahora veamos por qué un Work Unit es un archivo. [Entra el árbol del Project Explorer a la izquierda]

Lo que ves en el Project Explorer de Wwise sale de archivos de tu disco. [Entra la carpeta del disco a la derecha] Cada categoría de la pestaña Audio, como Containers, es una carpeta real en tu disco. [Pulsa la caja Default Work Unit.wwu del disco] Y cada Work Unit es un archivo de texto con extensión wwu, donde Wwise escribe los objetos que cuelgan de él. [Entra la flecha entre el Work Unit y su archivo] {pausa}

Al crear el proyecto, Wwise pone un Default Work Unit en cada categoría. [Pulsa la caja Default Work Unit del árbol] Así puedes empezar sin pensar en archivos.
```

#### s=3 p=1 · work unit nuevo

Título: cambia a «Un objeto vive en un solo archivo»

Leyenda: cambia a «Crear en WU_Ambiente no toca el Default Work Unit: para Git hay un archivo nuevo y ninguno modificado.»

Objetivo: 22 s · 54 palabras ≈ 22 s

```text
[Cambian el título y la leyenda] Si creas un Work Unit nuevo en Containers, aparece un archivo nuevo en esa carpeta. [Entran WU_Ambiente en el árbol y WU_Ambiente.wwu en el disco, con la etiqueta «nuevo»]

Cada objeto vive en un solo Work Unit. El sonido de ambiente que importes en ese Work Unit [Entra amb_bosque_loop bajo WU_Ambiente] se escribe en su archivo [Entra la segunda flecha] y el Default Work Unit no cambia. [Aparece la etiqueta «sin cambios»] Para Git hay un archivo nuevo y ninguno modificado.
```

### s=4 · Repartir el proyecto (diapositiva con dos pasos)

Kicker: «Idea 3 · repartir»

Pantalla:
- El esquema de ideas en la esquina, con la tercera idea resaltada.
- Dos columnas, `Containers/` a la izquierda y `Events/` a la derecha, cada una con cinco cajas en fila vertical: «Default Work Unit.wwu» atenuada y, en ámbar, «WU_Personaje.wwu», «WU_Ambiente.wwu», «WU_UI.wwu» y «WU_Musica.wwu». En el primer paso, la caja del Default entra sola y pulsa; las cuatro cajas ámbar entran después, una a una.
- En el paso 2 se añaden etiquetas turquesa a la derecha de las cajas: «Ana» en personaje y «Luis» en ambiente, en las dos columnas; en interfaz, la etiqueta roja «Ana · Luis» y el borde de la caja en rojo. Al pie, dos leyendas: en turquesa «archivos distintos: Git combina solo» y en rojo «mismo archivo: conflicto».

#### s=4 p=0 · solo

Título: «Solo: un Work Unit por bloque»

Leyenda: «El mismo nombre en Containers y en Events: cada bloque del juego son dos archivos.»

Objetivo: 26 s · 63 palabras ≈ 26 s

```text
[El esquema de la esquina resalta la tercera idea]
Ahora veamos cómo repartir el proyecto. [Entran las dos columnas, Containers y Events, con la caja del Default Work Unit]

Cuando trabajas solo, el Default Work Unit basta al principio. [Pulsa la caja Default Work Unit.wwu] Cuando el proyecto crece, conviene un Work Unit por bloque del juego: personaje, ambiente, interfaz y música. [Entran las cuatro cajas ámbar de cada columna, una por bloque]

Usa el mismo nombre en Containers y en Events. Así cada bloque del juego ocupa dos archivos, y cada commit, cada cambio que guardas en Git, dice de qué trata.
```

#### s=4 p=1 · en equipo

Título: cambia a «Equipo: una persona por archivo»

Leyenda: cambia a «Archivos distintos se combinan solos; el mismo archivo editado a la vez da un conflicto.»

Objetivo: 35 s · 84 palabras ≈ 35 s

```text
[Cambian el título y la leyenda] En equipo hay un solo proyecto de Wwise por juego, y cada persona trabaja en sus propios Work Units. [Entran las etiquetas: Ana en personaje y Luis en ambiente]

Si Ana y Luis editan archivos distintos, Git combina sus commits solo. [Aparece la leyenda turquesa] Si los dos editan el mismo archivo a la vez, Git puede marcar un conflicto. [Entra la etiqueta de los dos en interfaz y la caja se marca en rojo] Hay que resolverlo a mano, línea por línea. [Aparece la leyenda roja] {pausa}

La regla es simple: una persona por archivo y commits pequeños, fáciles de combinar. Guarda el proyecto en Wwise antes de cada commit: el archivo wwu solo cambia al guardar.
```
