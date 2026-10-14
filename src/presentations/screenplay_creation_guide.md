# Guía para crear los guiones de narración

Los guiones hacen que una clase de diapositivas se entienda sin el profesor: una narración hablada por diapositiva, o por paso de una diapositiva con pasos, pensada para grabarse o sintetizarse y sonar mientras el estudiante mira la diapositiva. Esta guía fija el formato de los archivos de guion, el proceso para producirlos, las convenciones de escritura y las reglas de revisión. El estado de cada curso vive en `creacion_guiones_<curso>/handoff.md`.

## Formato del archivo de guion

Un archivo por clase, `guion_clase_<n>_<tema>.md`, dentro de `creacion_guiones_<curso>/`.

- Título `# Guion · Clase N · Título`, un párrafo de estado (borrador, revisado, aprobado) con la fecha, y los enlaces a esta guía y al `handoff.md`.
- Encabezado de la clase: `## Clase N · Título` y la ruta `/course/<curso>/class/<slug>`.
- Una sección por diapositiva: `### s=N · label · Título`. Una diapositiva con pasos lleva `### s=N · Título (diapositiva con K pasos)` y una subsección por paso: `#### s=N p=K · label`. `s` es el índice de la diapositiva en la plataforma (`?s=`) y `p` el paso (`&p=`), los dos desde cero. Cuando el guion propone diapositivas nuevas, se numera según la estructura propuesta y el encabezado anota la correspondencia con los índices actuales de la plataforma.
- Dentro de cada unidad, en este orden:
  - «Pantalla:» lo que el estudiante ve mientras suena la narración: kicker, título, rótulos, dibujo y animación, tal como están hoy en la diapositiva. No se narra; es el contexto para quien revisa sin abrir la plataforma, incluidos los agentes revisores, que no leen nada más.
  - «Objetivo: N s · P palabras ≈ T s»: duración prevista, cuenta de palabras y estimación a 2,4 palabras por segundo, con tolerancia del 15 %. La cuenta excluye las líneas del bloque de código y el marcador `[pausa]`.
  - El texto narrado, dentro de un bloque de código (```` ```text ````) para que resalte del resto del archivo, en párrafos de una a tres frases separados por una línea en blanco. Cada párrafo ancla un elemento visual o una idea.
- `[pausa]` marca un silencio de dos a tres segundos, para dejar que una animación termine antes de describirla. Es el único marcador.
- Al final del archivo, una sección «Propuestas de cambio en las diapositivas», numerada y pendiente de aprobación, con lo que la revisión encontró en el contenido de las diapositivas: pertinencia con el curso, completitud para principiantes, gramática y especificidad, y lo que piden las reglas de revisión. Una diapositiva nueva se escribe como una unidad normal marcada «PROPUESTA».

## Proceso

Clase por clase, sin flujos de varios agentes: consumen la cuota en minutos.

1. Escribir el guion completo de la clase leyendo el diccionario `<curso>/<slug>.dict.tsx` (objeto `es`, la fuente de verdad) y el componente `<curso>/<slug>.tsx` (orden de las diapositivas, pasos, geometría y animaciones), aplicando las convenciones y las reglas de revisión de esta guía. No usar `lectura.es.md` ni `reglas-de-estilo.md` como fuente del guion.
2. Pasar el borrador a dos agentes revisores, que leen únicamente el archivo del guion:
   - Verificador de veracidad: contrasta cada afirmación en internet, con fuentes oficiales y un tope de búsquedas, y devuelve hallazgos con veredicto, evidencia y corrección sugerida.
   - Verificador de pedagogía: de lo general a lo específico; términos simples, explícitos y concisos, definidos al usarse; que no aburra ni sea largo; completo para principiantes; gramática, tildes y especificidad; guía de la mirada coherente con «Pantalla»; pertinencia de cada diapositiva con el curso; cumplimiento de las reglas de revisión.
3. Aplicar solo las observaciones acertadas, informar las descartadas con su razón, y anotar al final del guion las propuestas de cambio de diapositivas.
4. Hacer commit del guion corregido, un commit por archivo.
5. El docente indica cambios. Se aplican sin commit, para que pueda revisar el diff en VS Code y aprobar o volver a corregir. Cada versión aprobada se vuelve a commitear.
6. Los cambios en las diapositivas (diccionarios y componentes) solo se hacen con aprobación explícita, en español e inglés con largos parecidos, en commits aparte.
7. Al cerrar una clase, actualizar `handoff.md` (estado, pendientes, siguiente clase) para empezar la siguiente en una conversación nueva.

## Convenciones de escritura

- Audiencia y voz: un estudiante solo, con la diapositiva en pantalla. Tuteo, español neutro de Latinoamérica, voz de profesor cercano sin muletillas de video. Nunca «ustedes», ni referencias a un profesor presente, a un laboratorio ni a «hoy en clase».
- Términos: los técnicos y los nombres de producto en inglés, como en las diapositivas. Terminología actual de Wwise (Property Container, Main Audio Bus); nunca nombres viejos.
- Curso introductorio: no asumir nada. Definir cada término la primera vez que se usa, con palabras simples. Nada que permita asumir algo incorrecto: evitar absolutos como «siempre», «nunca», «el único» o «nada más», salvo que sean ciertos.
- De lo general a lo específico, dentro de cada unidad y a lo largo de la clase. Cada unidad: una frase de puente, el recorrido del dibujo en el orden en que se lee y la idea en una frase propia (sin leer el título ni la leyenda). En una diapositiva con pasos, el primero presenta el marco y cada paso narra solo lo que se añade.
- Guiar la mirada: decir a qué mirar y dónde está (a la izquierda, arriba, la caja ámbar, la flecha turquesa). Ámbar es lo protagónico; turquesa, lo secundario o lo externo. Nombrar las animaciones cuando ayude.
- Pertinencia: cada clase enlaza con Wwise o con Unreal donde el contenido lo permite. Ya no existe la diapositiva del restaurante.
- Preguntas para pensar: máximo una por diapositiva, con `[pausa]` y la respuesta en la misma unidad.
- Duración: objetivo por unidad a 2,4 palabras por segundo, tolerancia del 15 %. Portada, 20 a 25 s; diapositiva normal, 40 a 65 s; paso, 20 a 40 s; cierre, 20 a 30 s.
- Para leerse en voz alta: frases de hasta unas 20 palabras, una idea por frase; sin símbolos, flechas, paréntesis, abreviaturas, listas ni markdown; números pequeños en letras; teclas como «F5»; evitar el punto y coma.
- Continuidad solo dentro de la clase: cada diapositiva arranca donde terminó la anterior. Se puede decir «la diapositiva anterior», nunca «la clase anterior» ni «la siguiente clase» (regla 3).

## Reglas de revisión del guion

Se aplican a todo guion, nuevo o existente, y los revisores comprueban su cumplimiento.

1. **Ideas guía visibles.** Las ideas que ordenan la clase (por ejemplo «tres ideas») se presentan en una diapositiva propia, con un recuadro por idea, y ese esquema se mantiene en pequeño en una esquina de todas las diapositivas siguientes, con la idea actual resaltada. La narración de esa diapositiva solo anuncia que se verán esas ideas como bases teóricas; al entrar a cada idea se nombra («primero vamos a ver cómo se mueven los datos dentro de un computador»). Mientras el visual no exista, la narración hace igual la referencia explícita: «Ahora la segunda idea que mencionamos al principio: qué es un programa».
2. **Mínimo de palabras.** Decir lo que se quiere transmitir con la menor cantidad de palabras. No explicar lo que no se va a hacer: «Esta es la clase teórica de Intro a Wwise», no «y todavía no vamos a abrir Wwise».
3. **Sin curso ni orden de clases.** No mencionar el curso, la clase anterior ni la siguiente: cada clase se trata como individual. Los requisitos por clase y la lista de contenidos del curso se definirán aparte, más adelante.
4. **Qué se aprende y por qué.** La apertura dice, con gramática clara, qué va a ver el estudiante y para qué le sirve: «En esta clase verás tres ideas que te servirán como bases teóricas para entender el funcionamiento de Wwise».
5. **Narración resaltada.** En el archivo, el texto hablado de cada unidad va dentro de un bloque de código, separado de «Pantalla» y «Objetivo».
6. **Ojos en movimiento.** La mirada del estudiante debe cambiar de punto como máximo cada 6 segundos y en promedio cada 2,5. Las diapositivas necesitan cambios visuales con ese ritmo (pasos, resaltes, animaciones) y, donde hay pocas gráficas, se minimiza el texto hablado. Por ahora solo se minimiza el texto; el rediseño de las diapositivas queda pendiente.
