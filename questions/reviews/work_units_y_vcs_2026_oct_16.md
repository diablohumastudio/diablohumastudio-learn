# Set nuevo · Work Units y control de versiones · 2026-10-16

Fuente: questions/reviews/work_units_y_vcs_2026_oct_16.json, escrito a mano para la clase work-units-y-vcs; sin importar. 10 preguntas, 0 retiradas. Nada de esto está escrito en el banco: es un documento de revisión; cómo se usa está en questions/README.md.

Cada respuesta incorrecta lleva su nivel y el motivo. Los niveles son 1, 3 y 5 (escala pensada para 5, con 2 y 4 libres para afinar después).

## Escala

| Nivel | Nombre | Criterio |
|:---:|---|---|
| 5 | Casi correcta | Del mismo tipo que la respuesta correcta y además un elemento parecido o cercano a ella: la hermana con la que se confunde, la misma afirmación con un detalle cambiado, o su inversa. |
| 3 | Plausible | Del tema pero de otra categoría, o del mismo tipo que la correcta pero un elemento que no se le parece. |
| 1 | Descartable | Fuera de tema, absurda o descartable con sentido común, sin haber visto la clase. |

**Modo difícil:** una pregunta entra solo si tiene al menos 3 distractores de nivel 5; si no, se excluye (no se rellena con niveles menores). Entran **10 de 10** preguntas activas; con las propuestas de distractores nuevos entrarían **10 de 10**.

## Propuestas de distractores nuevos

Donde faltan distractores de nivel 5 hay una lista **Propuestas de nivel 5** con el texto propuesto (➕) y por qué sería un 5. Antes de importar, cada propuesta aceptada necesita su versión en inglés (« · en: «…»»). Donde una propuesta sería forzada, o defendible como correcta, no se propone y se explica (✋). En total: 0 propuestas.

## Cómo revisar

- Cambia el número de la columna **Nivel** donde no estés de acuerdo; el motivo es solo la justificación de la propuesta.
- Marca las propuestas ➕ que aceptas añadiendo su inglés; las que no, bórralas. No cambies el texto de la columna **Incorrecta**: es la llave para volver a unir la revisión con el banco.
- Las líneas *Nota* son observaciones sobre la pregunta misma (0 notas en 0 preguntas); los cambios a los enunciados se hacen en el editor, no aquí.
- Las preguntas con varias respuestas correctas muestran todas; el nivel se asigna a la incorrecta en relación con cualquiera de ellas.

## Resumen

La columna **Notas** marca la prioridad de revisión: 🔴 tiene observaciones sobre la pregunta misma (gramática, fuente, veracidad o ambigüedad); 🟢 no tiene ninguna.

| Pregunta | Clase | Nivel 5 | Nivel 3 | Nivel 1 | Modo difícil | Propuestas | Con propuestas | Notas |
|---|---|:---:|:---:|:---:|---|:---:|:---:|:---:|
| nueva 01 | work-units-y-vcs | 4 | 1 | 1 | ✅ | 0 | ✅ | 🟢 0 |
| nueva 02 | work-units-y-vcs | 4 | 1 | 1 | ✅ | 0 | ✅ | 🟢 0 |
| nueva 03 | work-units-y-vcs | 4 | 1 | 1 | ✅ | 0 | ✅ | 🟢 0 |
| nueva 04 | work-units-y-vcs | 4 | 1 | 1 | ✅ | 0 | ✅ | 🟢 0 |
| nueva 05 | work-units-y-vcs | 4 | 1 | 1 | ✅ | 0 | ✅ | 🟢 0 |
| nueva 06 | work-units-y-vcs | 4 | 1 | 1 | ✅ | 0 | ✅ | 🟢 0 |
| nueva 07 | work-units-y-vcs | 4 | 1 | 1 | ✅ | 0 | ✅ | 🟢 0 |
| nueva 08 | work-units-y-vcs | 4 | 1 | 1 | ✅ | 0 | ✅ | 🟢 0 |
| nueva 09 | work-units-y-vcs | 4 | 1 | 1 | ✅ | 0 | ✅ | 🟢 0 |
| nueva 10 | work-units-y-vcs | 4 | 1 | 1 | ✅ | 0 | ✅ | 🟢 0 |

## work-units-y-vcs (10)

### <span style="color: cyan;">nueva 01 · archivoWwu</span>

**Pregunta:** Según la clase, ¿qué es un Work Unit de Wwise?

**Correcta:** Un archivo XML con extensión .wwu que guarda una parte del proyecto

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Un archivo binario con extensión .wwu que guarda los sonidos convertidos | mismo tipo (archivo .wwu) con dos detalles cambiados: no es binario ni guarda audio |
| 5 | Una carpeta real del disco que agrupa los objetos de una categoría | es el Physical Folder, la hermana con la que se confunde |
| 5 | Una carpeta que solo existe dentro del Project Explorer para ordenar objetos | es el Virtual Folder, la otra hermana |
| 5 | El archivo .wproj que lista las plataformas y los ajustes del proyecto | el otro archivo XML del proyecto |
| 3 | Un SoundBank generado para una plataforma | del tema (archivos de Wwise) pero de otra categoría |
| 1 | Una unidad de medida del volumen en Wwise | fuera de tema |

**Modo difícil:** ✅ entra (4 de nivel 5)

### <span style="color: cyan;">nueva 02 · archivoWwu</span>

**Pregunta:** Según la clase, ¿qué pasa si borras o renombras un Default Work Unit?

**Correcta:** Wwise lo recrea vacío y avisa al abrir el proyecto

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Wwise lo recrea con los objetos que tenía, leyéndolos del .wproj | la misma afirmación con un detalle cambiado: vacío frente a con objetos |
| 5 | El proyecto no abre hasta que lo restaures desde Git | consecuencia plausible, inversa de lo que pasa |
| 5 | Wwise mueve sus objetos al primer Work Unit que encuentre | misma situación, resultado cambiado |
| 5 | Nada: es un Work Unit como cualquier otro y se puede borrar | la inversa de «archivo crítico» |
| 3 | Se borran también los audios de Originals que usaba | del tema pero de otra categoría (Originals) |
| 1 | Se desinstala el plugin de Wwise de Unreal | fuera de tema |

**Modo difícil:** ✅ entra (4 de nivel 5)

### <span style="color: cyan;">nueva 03 · wwise</span>

**Pregunta:** Según la clase, ¿por qué la carpeta .cache de un proyecto de Wwise no se versiona?

**Correcta:** Es derivada: contiene conversiones que Wwise regenera desde Originals y los Work Units

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Es personal: guarda el layout y las preferencias de cada usuario | confunde con .wsettings, la otra razón de la clase para no versionar |
| 5 | Es fuente, pero pesa demasiado para Git sin LFS | misma estructura, categoría equivocada |
| 5 | Es derivada: contiene los SoundBanks que lee Unreal | confunde con GeneratedSoundBanks |
| 5 | Contiene las copias de respaldo que Wwise hace al migrar de versión | confunde con .backup |
| 3 | Contiene el código del plugin de Unreal | del tema (archivos) pero del lado de Unreal |
| 1 | Git no permite carpetas cuyo nombre empieza con punto | absurda |

**Modo difícil:** ✅ entra (4 de nivel 5)

### <span style="color: cyan;">nueva 04 · wwise</span>

**Pregunta:** Según la clase, ¿por qué los proyectos del curso suben GeneratedSoundBanks a Git aunque sea una carpeta derivada?

**Correcta:** Porque Unreal lee esa carpeta y así el proyecto suena al clonarlo sin abrir Wwise

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Porque Wwise no puede regenerarlos sin la carpeta .cache | misma estructura, mecanismo falso |
| 5 | Porque Git LFS los necesita para funcionar | mezcla dos ideas de la clase |
| 5 | Porque sin ellos el .wproj no abre | consecuencia falsa pero plausible |
| 5 | Porque son la fuente de los Work Units | invierte fuente y derivado |
| 3 | Porque contienen las preferencias del usuario | de otra categoría (.wsettings) |
| 1 | Porque GitLab solo acepta archivos .bnk | absurda |

**Modo difícil:** ✅ entra (4 de nivel 5)

### <span style="color: cyan;">nueva 05 · unreal</span>

**Pregunta:** Según la clase, ¿qué carpetas de un proyecto de Unreal regenera el editor y por eso van en el .gitignore?

**Correcta:** Binaries, Intermediate, Saved y DerivedDataCache

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Binaries, Intermediate, Content y Config | dos de las cuatro cambiadas por carpetas fuente |
| 5 | Saved, DerivedDataCache, Source y Config | dos de las cuatro cambiadas por carpetas fuente |
| 5 | Binaries, Intermediate, Saved y Content | una cambiada por una carpeta fuente |
| 5 | Plugins, Content, Config y Saved | una correcta y tres fuentes |
| 3 | Originals, .cache y GeneratedSoundBanks | carpetas de Wwise, no de Unreal |
| 1 | Las carpetas con nombre en mayúsculas | absurda |

**Modo difícil:** ✅ entra (4 de nivel 5)

### <span style="color: cyan;">nueva 06 · unreal</span>

**Pregunta:** Según la clase, ¿por qué la carpeta Plugins/WwiseSoundEngine/ThirdParty queda fuera de Git?

**Correcta:** Es el SDK de Wwise: pesa gigabytes y el Audiokinetic Launcher lo reinstala al integrar

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Es código del plugin que Unreal compila y vuelve a generar | confunde con Binaries e Intermediate |
| 5 | Contiene los SoundBanks, que ya están en el proyecto de Wwise | confunde con GeneratedSoundBanks |
| 5 | Es una caché del editor, como DerivedDataCache | confunde con DerivedDataCache |
| 5 | Contiene las preferencias de cada usuario del plugin | confunde con lo personal |
| 3 | Contiene los audios originales en formato .wav | del tema pero del lado de Wwise (Originals) |
| 1 | Git no acepta carpetas con nombres en inglés | absurda |

**Modo difícil:** ✅ entra (4 de nivel 5)

### <span style="color: cyan;">nueva 07 · binarios</span>

**Pregunta:** Según la clase, ¿qué hace Git LFS con un archivo .wav?

**Correcta:** Deja un puntero de texto en el repositorio y guarda el archivo real en un almacén aparte

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Comprime el .wav para que Git pueda comparar sus líneas | misma estructura, mecanismo falso |
| 5 | Guarda solo la diferencia entre una versión del .wav y la siguiente | lo contrario de lo que pasa con un binario |
| 5 | Permite que dos personas fusionen sus cambios en el mismo .wav | justo lo que la clase dice que LFS no resuelve |
| 5 | Convierte el .wav en texto para versionarlo como un .wwu | invierte la idea texto frente a binario |
| 3 | Lo convierte a .wem para que pese menos | conversión de Wwise, otra categoría |
| 1 | Lo sube a YouTube y guarda el enlace | absurda |

**Modo difícil:** ✅ entra (4 de nivel 5)

### <span style="color: cyan;">nueva 08 · nuevoWorkUnit</span>

**Pregunta:** Según la clase, importas un sonido en un Work Unit nuevo llamado WU_Ambiente y guardas el proyecto. ¿Qué ve Git en la carpeta Containers?

**Correcta:** Un archivo WU_Ambiente.wwu nuevo; Default Work Unit.wwu no cambia

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Un archivo WU_Ambiente.wwu nuevo y Default Work Unit.wwu modificado | misma situación con un detalle cambiado |
| 5 | Solo Default Work Unit.wwu modificado, porque lista todos los Work Units | mecanismo falso pero plausible |
| 5 | Ningún cambio hasta que generes los SoundBanks | confunde con GeneratedSoundBanks |
| 5 | Un archivo WU_Ambiente.wwu nuevo con una copia del audio dentro | contradice «el audio no está en el archivo» |
| 3 | Solo un .wem nuevo dentro de .cache | del tema, pero es la carpeta ignorada |
| 1 | Un correo de aviso a los miembros del repositorio | absurda |

**Modo difícil:** ✅ entra (4 de nivel 5)

### <span style="color: cyan;">nueva 09 · equipo</span>

**Pregunta:** Según la clase, ¿cómo evita un equipo los conflictos de Git en los Work Units de Wwise?

**Correcta:** Cada persona trabaja en Work Units distintos, con commits pequeños y guardando Wwise antes de cada commit

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Todas las personas trabajan en el Default Work Unit, que Git fusiona solo | la inversa de la regla |
| 5 | Cada persona tiene su propio proyecto de Wwise y al final se juntan | contradice «un proyecto por juego» |
| 5 | Se usa el plug-in de Git que trae Wwise para hacer check-out de cada archivo | no existe; confunde con Perforce y Subversion |
| 5 | Se bloquea el .wproj con Git LFS mientras alguien edita | mezcla LFS con el bloqueo de archivos |
| 3 | Se versiona también la carpeta .cache para que todos tengan lo mismo | del tema, otra regla |
| 1 | Se trabaja sin Git y se envían los archivos por correo | descartable con sentido común |

**Modo difícil:** ✅ entra (4 de nivel 5)

### <span style="color: cyan;">nueva 10 · solo</span>

**Pregunta:** Según la clase, ¿cómo conviene repartir los Work Units cuando trabajas solo y el proyecto crece?

**Correcta:** Un Work Unit por bloque del juego, con el mismo nombre en Containers y en Events

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Un Work Unit por tipo de objeto: uno para sonidos y otro para containers | criterio plausible, pero no el de la clase |
| 5 | Un Work Unit por cada sonido, para que los diffs sean mínimos | el mismo criterio llevado al extremo |
| 5 | Todo en el Default Work Unit, porque dividir solo sirve en equipo | la inversa |
| 5 | Un Work Unit por bloque del juego en Containers, y todos los Events en el Default Work Unit | la mitad de la regla |
| 3 | Un proyecto de Wwise por cada nivel del juego | contradice «un proyecto por juego» |
| 1 | Un Work Unit por cada día de trabajo | absurda |

**Modo difícil:** ✅ entra (4 de nivel 5)
