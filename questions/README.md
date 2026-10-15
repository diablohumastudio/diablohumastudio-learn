# Preguntas: flujo de trabajo, revisión y creación

Todo lo pertinente al banco de preguntas de práctica y examen vive en esta carpeta: cómo se exporta, cómo se revisa, cómo vuelve al banco y cómo se escriben preguntas nuevas. El modelo de datos y el editor están descritos en [docs/practice.md](../docs/practice.md); las decisiones del sistema de dificultad, al final de este archivo.

## Qué hay aquí

| Ruta | Contenido |
|---|---|
| `reviews/` | Un archivo de revisión por ronda, con fecha en el nombre (`all_questions_2026_oct_13.md`). Se commitea en cada paso para poder ver el diff. |
| `scripts/` | `export-bank.js` (banco → JSON), `build-review.js` (JSON → Markdown de revisión), `review-to-import.js` (Markdown + JSON → archivo para Import JSON) y `review-md.js` (el formato compartido). |
| `exports/` | Exportaciones del banco, ignoradas por git: traen las respuestas correctas. Una carpeta por fecha. |

## Principios

- **La fuente de verdad es el banco en Firestore** (`questions` y `examQuestions`). El Markdown de revisión es un documento de trabajo: se genera desde el banco y se devuelve al banco con los scripts. No se edita el banco con JSON escritos a mano.
- **Los ids de las respuestas se conservan.** Los exámenes guardan «en la pregunta X eligió la opción con id tal». Todo archivo de importación se construye desde un Export reciente, nunca desde cero (ver el pendiente del importador en [TODO.md](../TODO.md)).
- **Nada se escribe sin revisión.** Import JSON muestra qué haría cada pregunta (nueva, reemplaza con cambios, idéntica) antes de escribir.
- **Español es el idioma fuente.** Los nombres de producto y de objetos de Wwise van en inglés y con el nombre oficial de la versión del curso (Wwise 2025.1).

## El ciclo de revisión

1. **Exportar el banco.** `node questions/scripts/export-bank.js` escribe `questions/exports/AAAA-MM-DD/questions.json` (más `examQuestions.json` y una vista legible). Solo lectura; usa la cuenta de servicio de `.env.local`.
2. **Generar la revisión.** `node questions/scripts/build-review.js --bank questions/exports/AAAA-MM-DD/questions.json --out questions/reviews/all_questions_AAAA_mes_DD.md --from questions/reviews/<revisión anterior>.md`. Con `--from`, los niveles, motivos, propuestas y notas de la ronda anterior se arrastran por id y por texto de la incorrecta; lo que ya está en el banco (`level`) manda. `--findings hallazgos.md` inserta los hallazgos generales de la ronda.
3. **Commit** del archivo generado: es el punto de partida contra el que se verá cada cambio.
4. **Revisar en el Markdown.** Cambiar niveles, aceptar o borrar propuestas ➕ (una propuesta aceptada necesita su inglés: `· en: «…»`), añadir notas. El resumen del inicio ordena la prioridad: 🔴 tiene notas, 🟢 no.
5. **Commit por ronda** (y vuelta al paso 4 las veces que haga falta; cada commit deja el diff a la vista).
6. **Generar el archivo de importación.** `node questions/scripts/review-to-import.js --bank questions/exports/AAAA-MM-DD/questions.json --review questions/reviews/<revisión>.md --out questions/exports/AAAA-MM-DD/import.json`. Se detiene si una incorrecta quedó sin nivel o una propuesta sin inglés; `--default-level 3` solo para una migración, nunca para una ronda normal.
7. **Importar** en `/teacher/questions` → Import JSON → Revisar → Importar. Las preguntas cuyo texto no cambió salen en amarillo y no se escriben.
8. **Exportar de nuevo** y comprobar que el banco quedó como la revisión. Esa exportación es el `--bank` de la próxima ronda.

Los cambios a enunciados, respuestas correctas o explicaciones no van por el Markdown: se hacen en el editor (o en el `import.json` antes de importar, con cuidado) y las notas de la revisión son la lista de qué tocar.

## Formato del archivo de revisión

Lo escribe `build-review.js` y lo lee `review-to-import.js`; `scripts/review-md.js` documenta cada línea. Por pregunta:

```
### <span style="color: cyan;">wu-wo-012 · estructura</span>
**Pregunta:** …
**Correcta:** …                      (o **Correctas (n):** con lista)
| Nivel | Incorrecta | Por qué |
| 5 | Random Container | motivo |    una fila por incorrecta, en el orden del banco
**Modo difícil:** …
**Propuestas de nivel 5**
- ➕ «texto» · en: «text» — por qué sería un 5
- ✋ por qué no se propone (otra)
> *Nota:* observación sobre la pregunta
```

Se puede editar: el número de **Nivel**, las propuestas ➕ (texto, inglés, borrarlas), las notas. No se edita el texto de la columna **Incorrecta**: es la llave que une la revisión con el banco. Un nivel que no sea 1, 3 o 5 se conserva, pero solo el 5 cuenta para el modo difícil.

## Cómo se califican los distractores

Cada respuesta incorrecta lleva un **nivel** que mide qué tan relacionada está con la respuesta correcta. La escala está pensada para cinco valores y hoy se usan tres:

| Nivel | Nombre | Criterio |
|:---:|---|---|
| 5 | Casi correcta | Del mismo tipo que la correcta **y** un elemento parecido o cercano a ella: la hermana con la que se confunde (Switch frente a Blend Container, State frente a Switch), la misma afirmación con un detalle cambiado, o su inversa. Solo se descarta sabiendo exactamente lo que pregunta. |
| 3 | Plausible | Del tema pero de otra categoría (un bus cuando se pregunta por un container), o del mismo tipo que la correcta pero un elemento que no se le parece (Folder cuando se pregunta por el Blend Container). |
| 1 | Descartable | Fuera de tema, absurda o descartable con sentido común, sin haber visto la clase. |

Reglas:

- El nivel se juzga **respecto a la correcta**, no respecto a lo difícil que parezca el distractor solo. Con varias correctas, respecto a cualquiera de ellas.
- Un distractor que pueda defenderse como correcto no es un nivel 5: es un error de la pregunta y va a las notas.
- El editor y la importación exigen el nivel. El valor 3 queda solo como respaldo para una migración de preguntas que lleguen sin él.
- Los motivos son cortos y dicen por qué ese nivel; sirven para que otra persona pueda discrepar con argumentos.

## Cómo se mide la dificultad de una pregunta

La dificultad **no es un campo de la pregunta**: se deriva de sus distractores. El **modo difícil** muestra solo distractores de nivel 5; como cada pantalla enseña tres incorrectas, una pregunta entra al modo difícil solo si tiene al menos **tres distractores de nivel 5**. Si no los tiene, se excluye de ese modo (no se rellena con niveles menores). El modo normal sortea como hoy, y el modo fácil preferirá los niveles bajos. El resumen de cada revisión dice qué preguntas entran y cuántos distractores de nivel 5 le faltan a cada una; escribir esos distractores es la forma de subir la dificultad de una pregunta.

Cuando el sistema esté en uso, la tasa de acierto por pregunta que ya guarda Firestore (`students/{uid}/questions/{id}`) sirve de contraste: una pregunta con tres niveles 5 que todos aciertan tiene distractores mal calificados.

## Reglas de revisión

Cada pregunta se revisa en cuatro aspectos; los hallazgos van en líneas *Nota* con el aspecto al inicio, y no se cambia la pregunta hasta que el usuario lo decide.

1. **Gramática y completitud.** Enunciado completo, acentos, concordancia (¿Cuál / ¿Cuáles si hay varias correctas), mayúsculas de los nombres de objetos, sin punto final en las respuestas, misma forma en todas las opciones.
2. **Fuente.** Toda afirmación que no sea un absoluto dice de dónde sale: «según la clase», «según la lectura», «según la diapositiva X». Son de fuente obligatoria las clasificaciones propias del curso (las cinco familias, Sonido/Estructura), los criterios de uso («el layout de diario», «los views de todos los días») y las simplificaciones (Events para Sí o No, Game Syncs para valores).
3. **Veracidad.** Cada afirmación de la correcta y de la explicación se contrasta con una fuente, en este orden: la instalación local de Wwise de la versión del curso (`/Library/Application Support/Audiokinetic/Wwise <versión>/Authoring/Data/WObjects/WObjects.xml` tiene los tipos de objeto, propiedades, valores por defecto y la lista de acciones; `Authoring/Help/WwiseHelp_en.chm` es la ayuda completa sin conexión), el proyecto Wwise del laboratorio (nombres y busses por defecto de la versión real), el plugin de Wwise en el proyecto de Unreal (nombres de funciones de Blueprint), la documentación oficial en línea, y por último foros y Q&A de Audiokinetic como fuente secundaria. Si la clase simplifica algo cierto, la nota propone «según la clase»; si la clase está equivocada, la nota lo dice y el arreglo va a la diapositiva y a la pregunta.
4. **Ambigüedad.** Ningún distractor debe poder defenderse como correcto; ninguna palabra del enunciado debe admitir dos lecturas («entiende», «suele», «toca»). Las preguntas que se solapan entre sí no deben contradecirse (el mismo ejemplo contado de dos maneras).

## Cómo crear un set nuevo de preguntas

**Formato.** Un archivo JSON con un arreglo de preguntas en el formato de Import JSON (`docs/practice.md`), con el nivel en cada incorrecta:

```json
{
  "id": "wu-wo-154",
  "topic": "wwise-objects",
  "slides": ["busses"],
  "prompt": { "es": "Según la clase, …", "en": "According to the class, …" },
  "correct": [{ "es": "…", "en": "…" }],
  "incorrect": [
    { "es": "…", "en": "…", "level": 5 },
    { "es": "…", "en": "…", "level": 5 },
    { "es": "…", "en": "…", "level": 5 },
    { "es": "…", "en": "…", "level": 3 },
    { "es": "…", "en": "…", "level": 3 },
    { "es": "…", "en": "…", "level": 1 }
  ],
  "explanation": { "es": "…", "en": "…" },
  "retired": false
}
```

Sin `id`, el importador asigna el siguiente de la clase (`wu-wo-`); un id nunca se reutiliza. `topic` es el slug de la clase y `slides` las claves de sus diapositivas (ver el editor).

**Reglas de redacción.**

- Una idea por pregunta, la que la diapositiva enseña; el enunciado dice la fuente salvo que sea un absoluto.
- La correcta es inequívoca y no se delata por longitud, forma o vocabulario distinto al de las incorrectas.
- Al menos tres incorrectas; la meta son seis: tres de nivel 5, dos de nivel 3 y una de nivel 1, para que el modo difícil tenga de dónde elegir y la pregunta cambie de cara en cada repetición.
- Con varias correctas, la explicación las cubre todas y el enunciado usa plural.
- Evitar «todas las anteriores» y «ninguna» salvo que midan algo.
- Nombres oficiales de Wwise 2025.1 (Main Audio Bus, Containers, Busses, Devices, Set Game Parameter) salvo cuando la pregunta mide la terminología de la clase, y entonces lo dice.

**Verificadores antes de importar.** Cada pregunta nueva pasa por los cuatro aspectos de la sección anterior, con énfasis en:

- *Veracidad:* la correcta y la explicación contrastadas con la fuente de la versión del curso, y los distractores comprobados como **falsos** (un distractor cierto a medias baja a nota).
- *Congruencia:* misma terminología que las diapositivas, la lectura de repaso y el handout; ningún ejemplo que contradiga otra pregunta del banco (buscar el término en `exports/…/questions.compact.txt`).
- *Niveles:* calificados con la escala, con motivo, y al menos tres niveles 5 reales, no forzados.

La forma más cómoda de escribir y verificar un set es generar su revisión con `build-review.js` sobre el JSON nuevo (sirve cualquier arreglo con el formato del banco), leerla como se lee una ronda, e importar cuando esté limpia.

## Estado del sistema

Decisiones tomadas el 2026-10-13: nivel por distractor con la escala de arriba; el modo lo elige el alumno en Config para la práctica libre y el profesor por ronda de deber y por examen; las preguntas sin tres distractores de nivel 5 quedan fuera del modo difícil; nivel por defecto 3 solo en migración. Pendiente de implementar en la plataforma: el campo `level` en el modelo y el importador (hoy el importador lo descarta), el selector de nivel en el editor, el modo en el jugador, los deberes y los exámenes. Hasta entonces, `review-to-import.js` produce el archivo correcto, pero el banco no guarda el nivel.
