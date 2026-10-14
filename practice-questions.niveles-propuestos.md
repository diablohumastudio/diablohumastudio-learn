# Niveles propuestos para los distractores del banco de preguntas

Fuente: la colección `questions` del banco en vivo de Firestore, exportada el 2026-10-13 en modo solo lectura: 104 preguntas, 1 retirada. La colección `examQuestions` está vacía. Los dos JSON locales de septiembre quedaron atrás (doce preguntas ya difieren de ellos) y se borraron; la fuente de verdad es el banco en vivo. Nada de esto está escrito en el banco: es una propuesta para revisar.

Cada respuesta incorrecta lleva el nivel propuesto y el motivo. Los niveles son 1, 3 y 5 (escala pensada para 5, con 2 y 4 libres para afinar después). El editor y la importación exigirán el nivel; el 3 queda solo como valor por defecto de respaldo para una migración que llegue sin él.

## Escala

| Nivel | Nombre | Criterio |
|:---:|---|---|
| 5 | Casi correcta | Del mismo tipo que la respuesta correcta y además un elemento parecido o cercano a ella: la hermana con la que se confunde, la misma afirmación con un detalle cambiado, o su inversa. |
| 3 | Plausible | Del tema pero de otra categoría, o del mismo tipo que la correcta pero un elemento que no se le parece. |
| 1 | Descartable | Fuera de tema, absurda o descartable con sentido común, sin haber visto la clase. |

**Modo difícil:** una pregunta entra solo si tiene al menos 3 distractores de nivel 5; si no, se excluye (no se rellena con niveles menores). Con los niveles propuestos entran **28 de 103** preguntas activas. El resumen de abajo dice cuántos distractores de nivel 5 faltan en cada una; escribir esos distractores nuevos es el paso siguiente a esta revisión.

## Cómo revisar

- Cambia el número de la columna **Nivel** donde no estés de acuerdo; el motivo es solo la justificación de la propuesta.
- Las líneas *Nota* son observaciones sobre la pregunta misma (ambigüedades, repeticiones, erratas), no sobre los niveles.
- Las preguntas con varias respuestas correctas muestran todas; el nivel se asigna a la incorrecta en relación con cualquiera de ellas.

## Resumen

| Pregunta | Clase | Nivel 5 | Nivel 3 | Nivel 1 | Modo difícil |
|---|---|:---:|:---:|:---:|---|
| wu-001 | datos-programas-y-servidores | 2 | 1 | 0 | ❌ falta 1 |
| wu-002 | datos-programas-y-servidores | 1 | 2 | 0 | ❌ faltan 2 |
| wu-003 | datos-programas-y-servidores | 1 | 1 | 1 | ❌ faltan 2 |
| wu-004 | datos-programas-y-servidores | 0 | 2 | 1 | ❌ faltan 3 |
| wu-005 | datos-programas-y-servidores | 1 | 2 | 0 | ❌ faltan 2 |
| wu-006 | que-es-un-motor-de-audio | 2 | 0 | 1 | ❌ falta 1 |
| wu-007 | que-es-un-motor-de-audio | 2 | 0 | 1 | ❌ falta 1 |
| wu-008 | que-es-un-motor-de-audio | 0 | 3 | 0 | ❌ faltan 3 |
| wu-009 | wwise-por-adentro | 1 | 1 | 1 | ❌ faltan 2 |
| wu-010 | wwise-por-adentro | 1 | 2 | 0 | ❌ faltan 2 |
| wu-011 | el-editor-wwise | 1 | 2 | 0 | ❌ faltan 2 |
| wu-012 | el-editor-wwise | 0 | 1 | 2 | ❌ faltan 3 |
| wu-013 | el-editor-wwise | 1 | 2 | 0 | ❌ faltan 2 |
| wu-wo-001 | wwise-objects | 2 | 3 | 1 | ❌ falta 1 |
| wu-wo-002 | wwise-objects | 2 | 3 | 1 | ❌ falta 1 |
| wu-wo-003 | wwise-objects | 2 | 3 | 1 | ❌ falta 1 |
| wu-wo-004 | wwise-objects | 1 | 4 | 1 | ❌ faltan 2 |
| wu-wo-005 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-006 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-007 | wwise-objects | 1 | 7 | 0 | ❌ faltan 2 |
| wu-wo-008 | wwise-objects | 1 | 5 | 0 | ❌ faltan 2 |
| wu-wo-009 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-010 | wwise-objects | 1 | 5 | 1 | ❌ faltan 2 |
| wu-wo-011 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-012 | wwise-objects | 2 | 3 | 1 | ❌ falta 1 |
| wu-wo-013 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-014 | wwise-objects | 4 | 1 | 1 | ✅ |
| wu-wo-015 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-016 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-017 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-018 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-019 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-020 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-021 | wwise-objects | 4 | 1 | 1 | ✅ |
| wu-wo-022 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-023 | wwise-objects | 1 | 5 | 0 | ❌ faltan 2 |
| wu-wo-024 | wwise-objects | 1 | 5 | 0 | ❌ faltan 2 |
| wu-wo-025 | wwise-objects | 6 | 0 | 0 | ✅ |
| wu-wo-026 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-027 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-028 | wwise-objects | 2 | 3 | 1 | ❌ falta 1 |
| wu-wo-029 | wwise-objects | 1 | 3 | 2 | ❌ faltan 2 |
| wu-wo-030 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-031 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-032 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-033 | wwise-objects | 4 | 2 | 0 | ✅ |
| wu-wo-034 | wwise-objects | 2 | 2 | 2 | ❌ falta 1 |
| wu-wo-035 | wwise-objects | 3 | 2 | 1 | ✅ |
| wu-wo-036 | wwise-objects | 2 | 3 | 0 | ❌ falta 1 |
| wu-wo-037 | wwise-objects | 4 | 2 | 0 | ✅ |
| wu-wo-038 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-101 | wwise-objects | 1 | 5 | 0 | ❌ faltan 2 |
| wu-wo-102 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-103 | wwise-objects | 2 | 3 | 1 | ❌ falta 1 |
| wu-wo-104 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-105 | wwise-objects | 2 | 3 | 1 | ❌ falta 1 |
| wu-wo-106 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-107 | wwise-objects | 3 | 2 | 1 | ✅ |
| wu-wo-108 | wwise-objects | 6 | 0 | 0 | ✅ |
| wu-wo-109 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-110 | wwise-objects | 1 | 4 | 1 | ❌ faltan 2 |
| wu-wo-111 | wwise-objects | 1 | 5 | 0 | ❌ faltan 2 |
| wu-wo-112 | wwise-objects | 2 | 2 | 2 | ❌ falta 1 |
| wu-wo-113 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-114 | wwise-objects | 2 | 3 | 1 | ❌ falta 1 |
| wu-wo-115 | wwise-objects | 2 | 3 | 1 | ❌ falta 1 |
| wu-wo-116 | wwise-objects | 1 | 4 | 1 | ❌ faltan 2 |
| wu-wo-117 | wwise-objects | 1 | 3 | 2 | ❌ faltan 2 |
| wu-wo-118 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-119 | wwise-objects | 0 | 5 | 1 | ❌ faltan 3 |
| wu-wo-120 | wwise-objects | 1 | 3 | 2 | ❌ faltan 2 |
| wu-wo-121 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-122 | wwise-objects | 1 | 3 | 2 | ❌ faltan 2 |
| wu-wo-123 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-124 | wwise-objects | 0 | 5 | 1 | ❌ faltan 3 |
| wu-wo-125 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-126 | wwise-objects | 0 | 5 | 1 | ❌ faltan 3 |
| wu-wo-127 | wwise-objects | 4 | 1 | 0 | ✅ |
| wu-wo-128 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-129 | wwise-objects | 1 | 4 | 1 | ❌ faltan 2 |
| wu-wo-130 | wwise-objects | 1 | 5 | 0 | ❌ faltan 2 |
| wu-wo-131 | wwise-objects | 1 | 4 | 1 | ❌ faltan 2 |
| wu-wo-132 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-133 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-134 | wwise-objects | 1 | 4 | 1 | ❌ faltan 2 |
| wu-wo-135 | wwise-objects | 3 | 1 | 0 | ✅ |
| wu-wo-136 | wwise-objects | 4 | 0 | 0 | ✅ |
| wu-wo-137 | wwise-objects | 4 | 0 | 0 | ✅ |
| wu-wo-138 | wwise-objects | 2 | 3 | 0 | ❌ falta 1 |
| wu-wo-139 | wwise-objects | 0 | 5 | 1 | ❌ faltan 3 |
| wu-wo-140 | wwise-objects | 0 | 6 | 0 | ❌ faltan 3 |
| wu-wo-141 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-142 | wwise-objects | 1 | 5 | 0 | ❌ faltan 2 |
| wu-wo-143 | wwise-objects | 2 | 3 | 0 | ❌ falta 1 |
| wu-wo-144 | wwise-objects | 2 | 4 | 0 | ❌ falta 1 |
| wu-wo-145 | wwise-objects | 3 | 3 | 0 | ✅ |
| wu-wo-146 | wwise-objects | 1 | 5 | 0 | ❌ faltan 2 |
| wu-wo-147 | wwise-objects | 1 | 4 | 1 | ❌ faltan 2 |
| wu-wo-148 | wwise-objects | 0 | 5 | 1 | ❌ faltan 3 |
| wu-wo-149 | wwise-objects | 0 | 2 | 3 | ❌ faltan 3 |
| wu-wo-150 | wwise-objects | 1 | 4 | 1 | retirada |
| wu-wo-151 | wwise-objects | 2 | 3 | 0 | ❌ falta 1 |
| wu-wo-152 | wwise-objects | 1 | 3 | 2 | ❌ faltan 2 |
| wu-wo-153 | wwise-objects | 3 | 1 | 2 | ✅ |

## datos-programas-y-servidores (5)

### wu-001 · biblioteca, computador

**Pregunta:** En la analogía de la biblioteca, ¿qué parte del computador es la mesa?

**Correcta:** La memoria RAM

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | El disco duro | Almacena datos en la misma analogía (estanterías); RAM y disco se confunden siempre |
| 5 | La caché | Memoria rápida de la misma analogía (libros abiertos), vecina de la mesa |
| 3 | La CPU | Parte del computador en la analogía (personas), pero no almacena nada |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-002 · lenguajes

**Pregunta:** ¿Cuál es el único lenguaje que la CPU entiende?

**Correcta:** Código máquina: unos y ceros

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Python | Lenguaje, pero de alto nivel e interpretado: lejos de la CPU |
| 3 | C++ | Lenguaje compilado, «cercano a la máquina», pero igual se traduce |
| 5 | Ensamblador | El lenguaje más cercano al código máquina; se confunden fácilmente |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-003 · restaurante

**Pregunta:** Según la clase, ¿qué es un servidor?

**Correcta:** Un programa que atiende peticiones

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Una computadora con tarjeta de video potente | La confusión clásica: servidor = máquina potente, no programa |
| 1 | Un cable de red muy rápido | Hardware de red, otra categoría |
| 3 | Un archivo .exe | Es un programa, pero un archivo quieto que no atiende peticiones |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-004 · hardware

**Pregunta:** ¿Qué pieza suele no existir en una computadora servidor?

**Correcta:** La tarjeta de video

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 1 | La fuente de poder | Ningún aparato funciona sin ella; se descarta con sentido común |
| 3 | La tarjeta de red | Pieza real; justo la que más importa en un servidor |
| 3 | La memoria RAM | Pieza real e imprescindible en cualquier computador |

**Modo difícil:** ❌ no entra (0 de nivel 5, faltan 3)

### wu-005 · arranque

**Pregunta:** Al arrancar el juego, ¿qué SoundBank ya está cargado en la RAM?

**Correcta:** soundbank_init

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | soundbank_menus | Otro SoundBank que en el ejemplo de la clase también sube al inicio (wu-wo-117) |
| 3 | soundbank_nivel_1 | SoundBank real, pero sube cuando la escena lo pide |
| 3 | Todos a la vez | La idea ingenua de que todo sube al inicio |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

> *Nota:* La correcta puede chocar con wu-wo-117, donde el banco de menús se carga al abrir el juego. Conviene precisar el enunciado: «¿qué SoundBank carga Wwise siempre primero?».

## que-es-un-motor-de-audio (3)

### wu-006 · compilados

**Pregunta:** Un programa compilado…

**Correcta:** se traduce a binario una vez, antes de correr

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | sigue siendo texto cuando corre | Describe al programa interpretado, el concepto hermano |
| 5 | necesita un motor que lo lea en vivo | También describe al interpretado: el motor lo lee en vivo |
| 1 | solo funciona en Windows | Nada que ver con compilar |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-007 · interpretados

**Pregunta:** ¿Quién corre a un programa interpretado?

**Correcta:** Un motor (intérprete)

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | El OS, directamente | Es quien lanza a los compilados; confunde los dos tipos de programa |
| 5 | La CPU, directamente | La idea ingenua que la clase corrige: la CPU ve al motor, no al script |
| 1 | La tarjeta de red | Hardware sin relación |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-008 · queEsUnMotor

**Pregunta:** Según la definición de la clase, un motor es…

**Correcta:** un programa que corre para correr programas

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | una pieza de hardware para audio | Confunde «motor de audio» con hardware; otra categoría del tema |
| 3 | un archivo de configuración | Es una de las entradas que recibe un motor, no el motor |
| 3 | un lenguaje de programación | Python es motor y lenguaje en la clase, pero son cosas distintas |

**Modo difícil:** ❌ no entra (0 de nivel 5, faltan 3)

## wwise-por-adentro (2)

### wu-009 · puntaAPunta

**Pregunta:** ¿Qué genera el Wwise editor hacia el proyecto del engine?

**Correcta:** SoundBanks (.bnk)

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Audio clips | Flecha del mismo diagrama, pero entra al editor: es materia prima |
| 5 | Wwise calls | La otra flecha hacia el engine, solo que la hace el juego |
| 1 | El binario del juego | Lo genera Unreal, no Wwise |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-010 · puntaAPunta

**Pregunta:** En el build, ¿cómo usa el juego a Wwise?

**Correcta:** Hace Wwise calls al Wwise engine

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Abre el Wwise editor en segundo plano | Confunde editor con engine, la distinción que mide la pregunta |
| 3 | Lee los audio clips directamente | Saltarse Wwise; el juego nunca ve los audios |
| 3 | Recompila los SoundBanks | Los bancos ya vienen generados; el juego solo los carga |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

## el-editor-wwise (3)

### wu-011 · losUtiles

**Pregunta:** ¿Cuáles son los tres views de todos los días en Wwise?

**Correcta:** Project Explorer, Transport Control y Soundcaster

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Meter, Loudness Meter y Audio Device Meter | Views reales, pero de medición, no de trabajo diario |
| 5 | Event Editor, Switch Editor y State Editor | Views reales de edición que también se usan a diario |
| 3 | Profiler, Utilities y Editors | Un layout y dos grupos del menú Views, no tres views |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-012 · layouts

**Pregunta:** ¿Qué es un layout en Wwise?

**Correcta:** Un acomodo de views en la pantalla

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Un tipo de Wwise Object | Término real de la clase, pero otra categoría |
| 1 | Un SoundBank especial | Nada que ver con la pantalla |
| 1 | Un plugin de efectos | Nada que ver con la pantalla |

**Modo difícil:** ❌ no entra (0 de nivel 5, faltan 3)

### wu-013 · designer

**Pregunta:** ¿Cuál es el layout de diario para crear y configurar Wwise Objects y Events?

**Correcta:** Designer

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Profiler | Layout real, pero para analizar el juego corriendo |
| 3 | SoundBank | Layout real, pero para generar bancos |
| 5 | Mixer | Layout real de uso diario; el más cercano en propósito |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

## wwise-objects (91)

### wu-wo-001 · flujo

**Pregunta:** De las cinco familias de objetos, ¿cuál es la única que el juego toca directamente?

**Correcta:** Game Input: postea Events y setea Game Syncs

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Contenido: reproduce los Sound SFX uno por uno | Familia hermana y la que el juego parece «tocar» al hacer sonar algo |
| 3 | Mixing · Routing: envía cada sonido a su bus | Familia hermana, pero ocurre dentro de Wwise |
| 3 | Procesamiento: enciende y apaga los efectos | Familia hermana, pero ocurre dentro de Wwise |
| 5 | Packaging: arma los SoundBanks mientras corre | Familia hermana y el juego sí toca los bancos: los carga |
| 3 | Todas: el juego llama a cada familia por separado | La idea ingenua; contradice el diagrama |
| 1 | Ninguna: Wwise decide solo qué suena y cuándo | Sin el juego no suena nada |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-002 · flujo

**Pregunta:** ¿Qué camino sigue la señal de audio entre las familias?

**Correcta:** Nace en Contenido, baja a Mixing y sale por el dispositivo

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Nace en Mixing, sube a Contenido y sale por el dispositivo | Las mismas familias en orden invertido |
| 3 | Nace en el Game Input, pasa por Packaging y sale por el dispositivo | Camino con familias que no llevan señal de audio |
| 3 | Nace en Procesamiento, baja a Contenido y sale por el dispositivo | Procesamiento actúa sobre el camino, pero no lo origina |
| 1 | Nace en el código del juego y llega a Wwise como audio ya mezclado | El juego manda calls, nunca audio |
| 3 | Nace en los SoundBanks y va directo al dispositivo, sin pasar por busses | El audio viaja en los bancos, pero siempre pasa por busses |
| 5 | Nace en Contenido y sale por el dispositivo sin pasar por Mixing | Origen correcto; solo omite los busses |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-003 · flujo

**Pregunta:** En el diagrama del camino, ¿qué queda fuera del marco de los SoundBanks?

**Correcta:** El juego y la salida

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | El Game Input y el juego | Acierta el juego; Game Input parece «del juego» pero viaja en los bancos |
| 3 | Procesamiento y la salida | Acierta la salida; los efectos viajan en los bancos |
| 3 | Mixing y la salida | Acierta la salida; los busses viajan en los bancos |
| 3 | Contenido y Procesamiento | Las dos familias van claramente en los bancos |
| 5 | Solo la salida | Acierta la salida; solo olvida el juego |
| 1 | Nada: el marco encierra todo el diagrama | El juego nunca está dentro de un SoundBank |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-004 · clasificacion

**Pregunta:** ¿Qué pregunta responde la familia Contenido?

**Correcta:** ¿Qué suena y cómo se elige?

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | ¿Qué dice el juego? | Pregunta de Game Input; «cómo se elige» depende de lo que dice el juego |
| 3 | ¿A dónde va la señal? | Pregunta de Mixing, otra familia |
| 3 | ¿Qué le pasa a la señal? | Pregunta de Procesamiento, otra familia |
| 3 | ¿Cómo viaja? | Pregunta de Packaging, otra familia |
| 1 | ¿Quién edita el proyecto? | Ninguna familia responde eso |
| 3 | ¿Por qué dispositivo sale? | Variante de la pregunta de Mixing |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-005 · clasificacion

**Pregunta:** ¿Qué familia responde a la pregunta «¿a dónde va la señal?»?

**Correcta:** Mixing · Routing, con los busses

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Game Input, con los Events | Familia hermana; los Events disparan, no enrutan |
| 3 | Game Input, con los Game Syncs | Familia hermana; los Game Syncs informan, no enrutan |
| 3 | Contenido, con los containers | Familia hermana; los containers eligen qué suena, no a dónde va |
| 5 | Procesamiento, con los efectos | Vecina directa en el camino de la señal |
| 5 | Packaging, con los SoundBanks | Su pregunta es «¿cómo viaja?», casi la misma frase que «¿a dónde va?» |
| 3 | Procesamiento, con los ShareSets | Misma familia que los efectos, pero el ShareSet es una definición |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-006 · clasificacion

**Pregunta:** ¿De dónde sale la clasificación en cinco familias que usamos en la clase?

**Correcta:** Es nuestra, didáctica, para entender el camino de un sonido

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Es la clasificación oficial de la documentación de Wwise | La confusión exacta que la pregunta quiere evitar |
| 5 | Son las cinco pestañas del Project Explorer | La agrupación oficial real; la clase las contrasta |
| 3 | Son los cinco tipos de Work Unit del proyecto | Concepto real, sin relación con familias |
| 3 | Son las cinco categorías de la integración con Unreal | Suena técnico, no existe |
| 3 | Son los cinco layouts del editor de Wwise | Concepto real, pero hay más layouts y no clasifican objetos |
| 3 | Son las cinco secciones de un SoundBank | Concepto real; un banco tiene Events, estructuras y media |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-007 · sonido

**Pregunta:** ¿Cuál de estos objetos apunta a audio de verdad?

**Correctas (3):** 
- Sound SFX
- Sound Voice
- Music Track

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Random Container | Container de Contenido: tiene hijos, no audio |
| 3 | Switch Container | Container de Contenido: tiene hijos, no audio |
| 3 | Blend Container | Container de Contenido: tiene hijos, no audio |
| 5 | Music Playlist | Objeto de música que parece «la lista de canciones», pero solo ordena segmentos |
| 3 | Audio Bus | Lleva «audio» en el nombre, pero es Mixing |
| 3 | Aux Bus | Bus de envíos; otra familia |
| 3 | Event | Game Input; dispara, no suena |
| 3 | Property Container | Container que solo agrupa y comparte propiedades |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-008 · sonido

**Pregunta:** ¿En qué se diferencia un Sound Voice de un Sound SFX?

**Correcta:** Tiene una fuente de audio por idioma

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Solo puede sonar dentro de un Music Segment | Describe al Music Track, otro objeto de sonido |
| 3 | No apunta a audio: solo agrupa otros sonidos | Describe a un container |
| 3 | Genera su audio por síntesis, sin archivos wav | Describe a una fuente plug-in |
| 3 | No necesita un output bus para sonar | Todo objeto de Contenido necesita bus |
| 3 | Elige al azar entre sus hijos cada vez que suena | Describe al Random Container |
| 5 | Solo puede tener una fuente para todo el proyecto | Habla de fuentes, igual que la correcta, pero al revés |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-009 · sonido

**Pregunta:** ¿Qué es un Music Segment?

**Correcta:** Un timeline que contiene tracks, con cues, tempo y compás

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Una lista de segmentos que suenan en orden o al azar | Music Playlist Container, hermano directo en la jerarquía de música |
| 3 | Un bus dedicado a mezclar toda la música | Bus; otra familia |
| 3 | Un Game Sync que dispara stingers de música | Trigger; del sistema de música, pero otra familia |
| 3 | Una fuente generada por síntesis, como Wwise Synth | Fuente plug-in; otra categoría |
| 5 | Un container que elige música según un State | Music Switch Container, hermano directo |
| 3 | Un SoundBank que solo contiene archivos de música | Packaging; otra familia |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-010 · estructura

**Pregunta:** ¿Qué container responde a «¿cuánto de cada uno?» y hace sonar varios hijos a la vez según un RTPC?

**Correcta:** Blend Container

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Random Container | Container hermano, pero elige un solo hijo al azar |
| 3 | Sequence Container | Container hermano, pero hace sonar uno tras otro |
| 5 | Switch Container | Container hermano y también gobernado por un Game Sync |
| 3 | Property Container | Container hermano sin regla: solo comparte propiedades |
| 3 | Music Playlist | Container del sistema de música |
| 3 | Music Switch | Container del sistema de música |
| 1 | Folder | Organización del proyecto; se descarta con sentido común |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-011 · estructura

**Pregunta:** ¿Qué tienen en común todos los containers?

**Correcta:** No producen audio: tienen hijos y deciden cómo suenan

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Cada uno apunta a su propio archivo wav | Contradice la idea central: los containers no apuntan a audio |
| 5 | Todos eligen un solo hijo al azar cada vez | Generaliza la regla del Random a todos |
| 5 | Todos necesitan un Game Sync para funcionar | Generaliza la regla del Switch a todos |
| 5 | Todos hacen sonar a sus hijos al mismo tiempo | Generaliza la regla del Blend a todos |
| 3 | Solo existen en el sistema de música | Los containers de música son solo una parte |
| 3 | El juego los llama directamente por nombre | El juego solo ve Events |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-012 · estructura

**Pregunta:** Los pasos deben sonar distinto según la superficie que informa el juego. ¿Qué container corresponde?

**Correcta:** Switch Container

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Random Container | Container hermano; los pasos suelen variar al azar |
| 3 | Sequence Container | Container hermano, pero suena en orden fijo |
| 5 | Blend Container | Container hermano y también gobernado por el juego (RTPC) |
| 3 | Property Container | Container hermano sin regla |
| 3 | Music Playlist | Container del sistema de música |
| 1 | Folder | Organización del proyecto; se descarta con sentido común |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-013 · estructura

**Pregunta:** ¿Qué regla aplica un Random Container?

**Correcta:** Elige un hijo, con pesos y sin repetir

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Hace sonar a sus hijos uno tras otro, en orden | Regla del Sequence: también elige un hijo por vez |
| 5 | Elige el hijo según un Switch o un State | Regla del Switch: también elige un hijo por vez |
| 3 | Hace sonar varios hijos a la vez según un RTPC | Regla del Blend: varios hijos a la vez, lejos del azar |
| 3 | Ninguna: solo agrupa y comparte propiedades | Property Container: sin regla |
| 3 | Ninguna: es solo organización del proyecto | Folder: sin regla |
| 3 | Encadena segmentos de música con transiciones | Music Playlist: otro sistema |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-014 · herencia

**Pregunta:** footsteps tiene Volume −6 dB, su hijo enemy −4 dB y footstep_metal, hijo de enemy, −4 dB. ¿Con qué volumen suena footstep_metal?

**Correcta:** −14 dB

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | −4 dB | El valor propio, sin sumar la herencia |
| 5 | −6 dB | El valor de la raíz, sin sumar los hijos |
| 5 | −8 dB | Suma parcial: −4 + −4 |
| 5 | −10 dB | Suma parcial: −6 + −4 |
| 3 | −12 dB | Ninguna combinación natural de los tres valores |
| 1 | −96 dB | El mínimo de Wwise; absurdo aquí |

**Modo difícil:** ✅ entra (4 de nivel 5)

### wu-wo-015 · herencia

**Pregunta:** ¿Cómo bajan las propiedades del padre a sus hijos?

**Correcta:** Las relativas (volumen, pitch) se suman; las absolutas (bus, efectos) se heredan salvo override

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Las relativas (bus, efectos) se suman; las absolutas (volumen, pitch) se heredan salvo override | La misma afirmación con las categorías intercambiadas |
| 5 | Todas se suman nivel por nivel, incluido el output bus | Mitad cierta: suma, pero generalizada al bus |
| 3 | Ninguna baja: cada hijo define todas sus propiedades | Niega la herencia, idea básica de la clase |
| 5 | El valor del hijo siempre reemplaza al del padre, sin sumarse | Mitad cierta: override, pero generalizado a todo |
| 3 | El valor del padre siempre reemplaza al del hijo, sin excepción | Niega el override, idea básica de la clase |
| 3 | Solo bajan las de los Property Containers; los demás containers no heredan | Término real mal aplicado |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-016 · herencia

**Pregunta:** footsteps sale por el bus SFX. ¿Por qué footstep_metal sale por el bus Metal?

**Correcta:** Porque hace override del output bus heredado

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Porque los busses se suman nivel por nivel | Aplica la regla de las relativas a una propiedad absoluta: la confusión exacta |
| 3 | Porque los Sound SFX nunca heredan el bus | Niega la herencia del bus |
| 3 | Porque su volumen total bajó de −10 dB | Inventa una regla mezclando volumen y bus |
| 5 | Porque tiene un send hacia el bus Metal | Mecanismo hermano real: send contra output bus |
| 3 | Porque el juego elige el bus al postear el Event | El juego solo postea Events |
| 3 | Porque su padre enemy es un Switch Container | El tipo de container no cambia el bus |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-017 · busses

**Pregunta:** ¿A cuántos output busses apunta un objeto y qué pasa con su señal?

**Correcta:** A exactamente uno: la señal se mueve, no se copia

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | A exactamente uno: la señal se copia, no se mueve | La misma afirmación con el verbo cambiado |
| 5 | A todos los que quiera: la señal se copia a cada uno | Describe los sends a Aux Busses |
| 5 | A dos: uno para la señal dry y otro para la wet | Dry y wet es la idea de los Aux Busses |
| 3 | A ninguno: va directo al dispositivo de salida | Todo pasa por busses |
| 3 | A uno por cada dispositivo de salida conectado | Confunde con los Secondary Busses |
| 3 | A ninguno: el juego elige el bus en cada Event | El juego solo postea Events |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-018 · busses

**Pregunta:** ¿Para qué sirve el Master Motion Bus?

**Correcta:** Para señal no audible: rumble y haptics del control

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Para mezclar los sonidos de objetos en movimiento | Lectura literal de «motion»: la trampa exacta |
| 5 | Para llevar audio a otro hardware, como audífonos | Secondary Bus: también lleva señal a otro dispositivo |
| 3 | Para recibir los sends de reverb | Aux Bus; otro tipo de bus, pero no se parece |
| 3 | Es la salida principal de todo el audio | Main Audio Bus; otro bus maestro, pero audible |
| 3 | Para mezclar solo la música interactiva | Uso corriente de un bus normal |
| 3 | Para aplicar el efecto Doppler a los sonidos | Efecto, no bus; «movimiento» como anzuelo |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-019 · busses

**Pregunta:** ¿Para qué sirve un Secondary Bus?

**Correcta:** Para llevar audio a otro hardware, como unos audífonos

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Para señal no audible: rumble y haptics | Master Motion Bus: también saca señal por otro dispositivo |
| 3 | Para recibir copias de la señal por sends | Aux Bus; otro tipo de bus, no se parece |
| 3 | Para los sonidos de menor prioridad | Inventado |
| 5 | Es un respaldo por si falla el Main Audio Bus | Lectura literal de «secondary» como respaldo |
| 3 | Para mezclar la música aparte de los SFX | Uso corriente de un bus normal |
| 3 | Para la segunda fuente de un Sound Voice | «Segunda» como anzuelo; las fuentes son otra cosa |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-020 · aux

**Pregunta:** ¿Qué es un send hacia un Aux Bus?

**Correcta:** Una copia de la señal, con un nivel de send por objeto

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | El movimiento de la señal a su único destino | Es el output bus, el mecanismo hermano |
| 5 | Un override del output bus heredado | Otra forma de cambiar el ruteo de un objeto |
| 3 | Una Action que el juego postea por nombre | Game Input; otra familia |
| 3 | Un Game Sync que elige a qué bus va el sonido | Game Input; otra familia |
| 3 | Un efecto insertado en el objeto, una instancia por voz | Procesamiento; otra familia |
| 5 | Un segundo output bus que reemplaza al primero | Casi: un segundo destino, pero reemplaza en vez de copiar |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-021 · aux

**Pregunta:** Un Sound SFX sale por Audio Bus · SFX y tiene un send a Aux Bus · Reverb. ¿Qué llega al Main Audio Bus?

**Correcta:** La señal dry desde SFX más la copia procesada (wet) desde Reverb

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Solo la señal dry: los Aux Busses no llegan al Main Audio Bus | Mitad cierta: olvida que el Aux Bus desemboca en el Main |
| 5 | Solo la señal wet: el send reemplaza al output bus | Mitad cierta: cree que el send reemplaza al output bus |
| 1 | Nada: la señal se reparte y se pierde en el camino | Absurdo: la señal no se pierde |
| 5 | Dos copias de la señal dry, una por cada bus | Confunde la copia con duplicar la dry |
| 5 | La señal wet desde SFX más la señal dry desde Reverb | La correcta con dry y wet intercambiadas |
| 3 | La que tenga más volumen de las dos; la otra se descarta | Inventa una regla de prioridad |

**Modo difícil:** ✅ entra (4 de nivel 5)

### wu-wo-022 · efectos

**Pregunta:** Suenan tres voces de un objeto que tiene un efecto insertado en el objeto. ¿Cuántas instancias del efecto corren?

**Correcta:** Tres: una por voz, antes de mezclar

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Una: se aplica sobre la suma de las voces | Así se comporta el efecto en un bus |
| 5 | Una: las voces comparten el efecto por ser del mismo objeto | Una instancia compartida: la confusión natural |
| 3 | Ninguna: los efectos solo corren en los busses | Los objetos sí pueden tener efectos |
| 3 | Seis: una antes y otra después de mezclar, por voz | Inventado |
| 5 | Tres: una por voz, después de mezclar | Cantidad correcta, momento equivocado |
| 3 | Dos: una para la señal dry y otra para la wet | Mezcla el concepto de los Aux Busses |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-023 · efectos, aux

**Pregunta:** ¿Por qué la reverb suele vivir en un Aux Bus y no en cada objeto?

**Correcta:** Porque una sola instancia en el bus sirve a todas las voces

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Porque los objetos no pueden tener efectos | Los objetos sí pueden tener efectos |
| 5 | Porque en el bus cada voz recibe su propia instancia | La inversa exacta de la razón correcta |
| 3 | Porque los Aux Busses no gastan CPU | Sí gastan; gastan menos por compartir |
| 3 | Porque la reverb solo existe como efecto de bus | La reverb también puede ir en el objeto |
| 3 | Porque así el juego puede postear la reverb por nombre | Confunde con los Events |
| 3 | Porque los efectos en el objeto no viajan en los SoundBanks | Los efectos viajan en los bancos |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-024 · sharesets

**Pregunta:** ¿Qué es un ShareSet?

**Correcta:** Una definición central reutilizable: se edita en un solo lugar

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Una versión local de un efecto para un solo caso | Es Custom, la alternativa directa al ShareSet |
| 3 | Un bus que comparte su señal con otros busses | Bus; otra familia; «comparte» como anzuelo |
| 3 | Un SoundBank compartido entre varios niveles | Packaging; «compartido» como anzuelo |
| 3 | Un archivo .wwu que comparte el proyecto con el equipo | Work Unit; «comparte» como anzuelo |
| 3 | Un container que comparte propiedades con sus hijos | Property Container; «comparte» como anzuelo |
| 3 | Un Game Sync global, compartido por todo el juego | Game Sync; «global» como anzuelo |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-025 · sharesets

**Pregunta:** ¿Cuál de estos NO es un tipo de ShareSet?

**Correctas (3):** 
- Random Container
- Event
- SoundBank

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Effect ShareSet | Tipo real de ShareSet |
| 5 | Attenuation ShareSet | Tipo real de ShareSet |
| 5 | Conversion Settings | Tipo real de ShareSet |
| 5 | Modulator LFO | Tipo real de ShareSet |
| 5 | Modulator Envelope | Tipo real de ShareSet |
| 5 | Modulator Time | Tipo real de ShareSet |

**Modo difícil:** ✅ entra (6 de nivel 5)

### wu-wo-026 · sharesets

**Pregunta:** ¿Cuándo conviene un efecto Custom en vez de un ShareSet?

**Correcta:** Cuando es una versión propia para un caso puntual

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Cuando muchos objetos deben compartir los mismos valores | La inversa: el caso del ShareSet |
| 3 | Cuando el efecto va en un bus en vez de en un objeto | Dónde va el efecto no decide ShareSet o Custom |
| 5 | Cuando se quiere editar en un solo lugar para todos | La ventaja del ShareSet, no del Custom |
| 3 | Cuando el efecto tiene que viajar en un SoundBank | Ambos viajan en los bancos |
| 3 | Siempre: los ShareSets solo sirven para atenuaciones | Falso y absoluto |
| 3 | Cuando el juego necesita cambiarlo con un RTPC | El RTPC no decide ShareSet o Custom |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-027 · events

**Pregunta:** ¿Qué ve el código del juego cuando hace sonar unos pasos?

**Correcta:** Solo el Event, que postea por nombre

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Cada Action del Event, que ejecuta una por una | Lo que hay justo detrás del Event |
| 5 | El container footsteps, al que llama directamente | El objeto que la Action reproduce |
| 3 | El archivo wav que corresponde a cada paso | Muy por detrás: ni Wwise lo elige hasta reproducir |
| 3 | El output bus por el que va a salir el sonido | Mixing; otra familia |
| 5 | El Sound SFX exacto que eligió el container | El sonido que «se dispara»; parece lo que el juego pide |
| 3 | El Work Unit donde está guardado el sonido | Archivo del editor; nunca llega al juego |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-028 · events

**Pregunta:** Quieres usar Actions Set RTPC para poner car_rpm en 4200 y en 6000. ¿Qué necesitas?

**Correcta:** Un Event por valor, porque los Events no reciben argumentos

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Un solo Event al que el juego le pasa el valor como argumento | La confusión exacta: creer que los Events reciben argumentos |
| 5 | Un solo Event con las dos Actions: el juego elige cuál ejecutar | Variante cercana: un Event con dos Actions a elegir |
| 3 | Un Switch Container con un hijo por cada valor de RPM | Otro mecanismo; no setea un RTPC |
| 1 | Un SoundBank por valor, que se carga al cambiar las RPM | Absurdo |
| 3 | Nada: las Actions no pueden tocar un RTPC | Contradice la premisa de la pregunta |
| 3 | Un State por cada valor posible de car_rpm | Otro Game Sync, discreto; no sirve para un valor continuo |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-029 · events

**Pregunta:** ¿Qué ventaja tiene que el juego nunca vea las Actions de un Event?

**Correcta:** Cambiar el comportamiento del sonido no toca el código

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Los Events gastan menos memoria en el SoundBank | Inventado |
| 3 | El juego puede pasarle argumentos al Event | Falso; los Events no reciben argumentos (wu-wo-028) |
| 3 | Los Events ya no necesitan estar en un SoundBank | Falso; los Events viajan en los bancos |
| 1 | El audio se mezcla antes de llegar a los busses | Sin relación con los Events |
| 1 | Cada Action corre en su propio hilo del juego | Sin relación con los Events |
| 5 | Los programadores pueden editar las Actions desde el código | La inversa de la ventaja real |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-030 · gameSyncs

**Pregunta:** ¿En qué se diferencian un Switch y un State?

**Correcta:** El Switch es local, por Game Object; el State es global, para todo el juego

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | El Switch es global, para todo el juego; el State es local, por Game Object | La misma afirmación invertida |
| 5 | El Switch es continuo y el State es discreto | Diferencia plausible entre Game Syncs, pero es la del RTPC |
| 5 | El Switch es discreto y el State es continuo | Diferencia plausible entre Game Syncs, pero es la del RTPC |
| 3 | El Switch lo setea el código y el State solo se cambia en Wwise | Ambos los setea el juego |
| 3 | El Switch es para música y el State para SFX | Ninguno es exclusivo de música o SFX |
| 3 | No hay diferencia: son dos nombres del mismo Game Sync | Niega la diferencia |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-031 · gameSyncs

**Pregunta:** Las RPM del auto deben controlar el pitch del motor de forma continua. ¿Qué Game Sync corresponde?

**Correcta:** RTPC

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Switch | Game Sync hermano; discreto |
| 5 | State | Game Sync hermano; discreto y global |
| 5 | Trigger | Game Sync hermano; momentáneo |
| 3 | Un Event por cada valor de RPM | Game Input pero no Game Sync; el camino errado de wu-wo-028 |
| 3 | Un Random Container | Contenido; otra familia |
| 3 | Un Effect ShareSet | Procesamiento; otra familia |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-032 · gameSyncs

**Pregunta:** ¿Para qué se usa un Trigger?

**Correcta:** Para una señal momentánea, como un stinger de música

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Para un valor continuo que sigue una curva | Describe al RTPC, Game Sync hermano |
| 5 | Para un selector discreto por Game Object | Describe al Switch, Game Sync hermano |
| 5 | Para la situación global del juego, con transición | Describe al State, Game Sync hermano |
| 3 | Para cargar un SoundBank en runtime | Packaging; otra familia |
| 3 | Para postear un Event sin escribir código | Eso lo hace el código, no un Game Sync |
| 3 | Para enviar una copia de la señal a un Aux Bus | Mixing; otra familia |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-033 · gameSyncs

**Pregunta:** Cuando el jugador tiene poca vida, toda la mezcla debe cambiar con una transición. ¿Qué Game Sync corresponde?

**Correcta:** State

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Switch | Game Sync hermano; discreto pero local |
| 5 | RTPC | Game Sync hermano; continuo |
| 5 | Trigger | Game Sync hermano; momentáneo |
| 5 | Un Switch por cada Game Object del nivel | El enfoque del Switch escrito en largo |
| 3 | Un Blend Container | Contenido; otra familia |
| 3 | Un Attenuation ShareSet | Procesamiento; otra familia |

**Modo difícil:** ✅ entra (4 de nivel 5)

### wu-wo-034 · packaging

**Pregunta:** ¿Qué contiene un SoundBank?

**Correcta:** Events, estructuras y media, que se cargan en runtime

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Los archivos .wwu del proyecto, para control de versiones | Work Unit: el otro «archivo» del proyecto |
| 5 | Solo los archivos wav originales, sin convertir | Mitad cierta: la media, pero convertida y con más cosas |
| 3 | Las Queries y las Sessions de perfilado | Herramientas del editor |
| 1 | El código del juego que postea los Events | Absurdo |
| 3 | Solo los busses y los dispositivos de salida | Parcial: los busses son estructuras; los dispositivos no viajan |
| 1 | Los layouts del editor de Wwise | Pantallas del editor; absurdo en un banco |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-035 · packaging

**Pregunta:** ¿Qué es un Work Unit?

**Correcta:** Un archivo .wwu que parte el proyecto, para control de versiones y trabajo en equipo

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Un paquete de Events y media que el juego carga en runtime | SoundBank: el otro «archivo» del proyecto |
| 5 | Una búsqueda guardada dentro del proyecto | Query: hermana en la lista de cosas del editor |
| 5 | Una sesión para perfilar y mezclar el juego | Session: hermana en la lista de cosas del editor |
| 3 | Un container sin regla que solo agrupa sonidos | Folder; otra cosa |
| 3 | Una definición central reutilizable de un efecto | ShareSet; otra cosa |
| 1 | Una unidad de CPU que consume cada voz | Juego de palabras con «unit» |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-036 · packaging

**Pregunta:** ¿Cuál de estos se queda en el editor y NO viaja con el juego?

**Correctas (3):** 
- Work Units
- Queries
- Sessions

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | SoundBanks | El artefacto del proyecto que sí viaja; la confusión natural |
| 5 | Auto-Defined SoundBanks | Variante del anterior |
| 3 | Los Events incluidos en un SoundBank | Dice «incluidos en un SoundBank»: se descarta leyendo |
| 3 | La media incluida en un SoundBank | Dice «incluida en un SoundBank»: se descarta leyendo |
| 3 | Las estructuras incluidas en un SoundBank | Dice «incluidas en un SoundBank»: se descarta leyendo |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-037 · cierre, flujo

**Pregunta:** ¿Cuál es un camino completo de un sonido?

**Correcta:** Game Input → Contenido → Mixing → Salida

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Game Input → Mixing → Contenido → Salida | Un solo intercambio: Mixing y Contenido |
| 5 | Contenido → Game Input → Mixing → Salida | Un solo intercambio: Contenido y Game Input |
| 5 | Game Input → Contenido → Packaging → Salida | Una sola sustitución: Packaging por Mixing |
| 3 | Packaging → Game Input → Contenido → Salida | Sustitución y desplazamiento; dos errores |
| 5 | Game Input → Procesamiento → Mixing → Salida | Una sola sustitución: Procesamiento por Contenido |
| 3 | Mixing → Contenido → Game Input → Salida | Camino invertido |

**Modo difícil:** ✅ entra (4 de nivel 5)

### wu-wo-038 · cierre, flujo

**Pregunta:** ¿Sobre qué familias actúa Procesamiento?

**Correcta:** Sobre Contenido y sobre Mixing

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Solo sobre Contenido | Mitad cierta |
| 5 | Solo sobre Mixing | Mitad cierta |
| 3 | Sobre el Game Input y sobre Packaging | Familias sin señal de audio |
| 3 | Sobre el juego y sobre la salida | Fuera de los bancos; los efectos no llegan ahí |
| 3 | Solo sobre los SoundBanks | Packaging; otra familia |
| 5 | Sobre el Game Input y sobre Contenido | Mitad cierta, con una familia equivocada |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-101 · flujo

**Pregunta:** ¿Como maneja los datos Wwise por adentro?

**Correcta:** Con una base de datos de los elementos que el usuario crea para configurar su proyecto

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Con una lista de archivos de audio ordenados por nombre | Un almacén de datos, pero solo de audios: la idea ingenua |
| 3 | Con una copia del proyecto de Unreal | Otra herramienta; Wwise no copia el proyecto de Unreal |
| 3 | Con un solo SoundBank que guarda todo el proyecto | El SoundBank es la exportación, no el interior |
| 3 | Con una carpeta por cada view del editor | Los views son pantallas, no datos |
| 3 | Con los Blueprints que el juego le envía | Dirección invertida; los Blueprints llaman, no alimentan |
| 3 | Con una consola de mezcla conectada a los parlantes | Es la metáfora de los busses, no del almacenamiento |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

> *Nota:* Falta la tilde en «¿Cómo».

### wu-wo-102 · flujo

**Pregunta:** ¿Qué es un Wwise Object?

**Correcta:** Cada ítem de la base de datos del proyecto: un objeto que el usuario puede crear en el editor

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Solo un archivo de audio importado al proyecto | La identificación ingenua: objeto = audio |
| 3 | Cada view que se abre en el editor de Wwise | Pantalla, no dato |
| 3 | Cada bloque de Blueprint que llama a Wwise desde Unreal | Vive en Unreal, no en la base de datos |
| 3 | El proyecto exportado que el juego carga a memoria | Es la exportación, no cada ítem |
| 3 | El motor que procesa el audio dentro del juego | Es quien procesa, no un ítem |
| 5 | Cada pestaña del Project Explorer | Las pestañas agrupan objetos; se confunden con ellos |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-103 · flujo

**Pregunta:** ¿Qué es el Wwise Authoring Tool?

**Correcta:** El editor de Wwise, donde el usuario crea los Wwise Objects y se configura el proyecto

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | El motor de Wwise que se integra al entregable del juego | El motor: la otra pieza de Wwise, la confusión central |
| 5 | El plugin que expone los Game Inputs en Unreal | El plugin: la tercera pieza de Wwise |
| 3 | El view donde se generan los SoundBanks | Un view dentro del editor, no el editor |
| 3 | El bloque de Blueprint que llama a un Event | Vive en Unreal |
| 3 | La base de datos donde se guardan los audios | Vive dentro del editor, no es el editor |
| 1 | El bus principal por el que sale todo el audio | Un bus como herramienta: absurdo |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-104 · flujo

**Pregunta:** ¿En qué view se encuentran principalmente los Wwise Objects?

**Correcta:** Project Explorer

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Property Editor | View vecino en el layout Designer, donde se editan los objetos |
| 5 | SoundBank Manager | View que también lista objetos: los SoundBanks |
| 3 | Transport Control | View de reproducción |
| 3 | Soundcaster | View de reproducción |
| 3 | Contextual Help | View de ayuda |
| 3 | Loudness Meter | View de medición |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-105 · flujo

**Pregunta:** ¿Cuál de estos es un Wwise Object?

**Correctas (4):** 
- Un bus
- Un Work Unit
- Un property container
- Un sonido creado en el Project Explorer

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | El entregable del juego | Es el juego, fuera de Wwise |
| 5 | Un bloque de Blueprint en Unreal | Es lo que el plugin crea para «llamar» al objeto; se confunde con él |
| 3 | El plugin de Wwise instalado en Unreal | Herramienta de integración, no objeto del proyecto |
| 1 | Un parlante o un control que vibra | Equipo físico |
| 5 | El Property Editor | Vive dentro del editor, pero es un view, no un objeto |
| 3 | El motor del juego | Es Unreal, fuera de Wwise |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-106 · flujo

**Pregunta:** ¿Todos los tipos de Wwise Object se encuentran en el Project Explorer?

**Correcta:** No: algunos tipos se encuentran en otros views especializados

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Sí: todo Wwise Object aparece siempre en el Project Explorer | La inversa exacta |
| 3 | No: solo aparecen los que ya están dentro de un SoundBank | Los bancos no deciden qué se ve en el editor |
| 3 | Sí, pero solo después de generar los SoundBanks | Los bancos no deciden qué se ve en el editor |
| 3 | No: el Project Explorer solo muestra archivos de audio | El Project Explorer muestra objetos, no solo audios |
| 3 | No: los Wwise Objects solo se ven en el Property Editor | El Property Editor edita, no lista |
| 5 | Sí: por eso el editor no necesita ningún otro view | La posición del «sí» con otra justificación |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-107 · flujo

**Pregunta:** ¿Qué campos tienen todos los Wwise Objects?

**Correcta:** Nombre, tipo, id, hijos, propiedades y referencias

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Nombre, tipo y un archivo de audio propio | Lista parcial más un campo que no es universal |
| 5 | Nombre, volumen, pitch y un bus de salida | Nombre más propiedades concretas de algunos tipos |
| 3 | Un Event que los reproduce y un SoundBank que los contiene | Relaciones con otros objetos, no campos |
| 5 | Solo un nombre y un id; nada más | Subconjunto de la lista correcta |
| 3 | Plataforma, idioma y una lista de acciones | Campos de la exportación, no del objeto |
| 1 | Un bloque de Blueprint y un asset de Unreal | Cosas de Unreal; absurdo como campos |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-108 · flujo

**Pregunta:** ¿Cuál de estos campos NO lo tienen todos los Wwise Objects?

**Correctas (3):** 
- Un archivo de audio propio
- Una acción Play
- Una plataforma y un idioma

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Un nombre | Campo universal real |
| 5 | Un tipo | Campo universal real |
| 5 | Un id | Campo universal real |
| 5 | Hijos | Campo universal real |
| 5 | Propiedades | Campo universal real |
| 5 | Referencias | Campo universal real |

**Modo difícil:** ✅ entra (6 de nivel 5)

### wu-wo-109 · flujo

**Pregunta:** ¿Desde qué view se pueden editar las propiedades de cualquier Wwise Object, sea del tipo que sea?

**Correcta:** Property Editor

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Project Explorer | Donde se seleccionan los objetos; vecino del Property Editor |
| 3 | SoundBank Manager | View de bancos |
| 3 | Transport Control | View de reproducción |
| 3 | Soundcaster | View de reproducción |
| 5 | Music Segment Editor | Editor de un solo tipo: la trampa de «sea del tipo que sea» |
| 5 | Event Editor | Editor de un solo tipo: la trampa de «sea del tipo que sea» |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-110 · flujo

**Pregunta:** ¿De qué depende qué propiedades tiene un Wwise Object?

**Correcta:** Del tipo de objeto

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Del nombre que le pongas | Campo universal, no decide propiedades |
| 3 | Del SoundBank que lo contiene | La exportación no cambia el objeto |
| 5 | De la plataforma para la que se exporta | Plausible: los valores pueden variar por plataforma, pero las propiedades no |
| 3 | Del idioma del proyecto | Solo cambia fuentes de los Sound Voice |
| 1 | Del orden en que se creó | Absurdo |
| 3 | Del juego que lo llama | El juego llama, no define |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-111 · flujo

**Pregunta:** ¿Cómo están agrupados los distintos tipos de Wwise Object en el Project Explorer?

**Correcta:** En pestañas

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | En las cinco familias del diagrama de la clase | Las familias de la clase; la confusión exacta |
| 3 | En SoundBanks | Packaging; otra cosa |
| 3 | En layouts | Acomodos de views, no de objetos |
| 3 | Por plataforma e idioma | Campos de la exportación |
| 3 | En una sola lista, sin agrupar | Otra forma de agrupar, pero no se parece a pestañas |
| 3 | En carpetas, una por cada Event | Carpetas existen, pero no por Event |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-112 · flujo, clasificacion

**Pregunta:** ¿Cuál es la finalidad del diagrama de las cinco familias?

**Correcta:** Clasificar los Wwise Objects de una manera que facilite el aprendizaje

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Mostrar el orden en que hay que crear los objetos | Lectura plausible de un diagrama con flechas |
| 5 | Copiar tal cual las pestañas del Project Explorer | El contraste exacto que hace la clase |
| 3 | Indicar qué objetos van en cada SoundBank | Packaging; otra cosa |
| 1 | Explicar cómo se instala el plugin en Unreal | Sin relación con el diagrama |
| 1 | Listar todos los views del editor | Sin relación con el diagrama |
| 3 | Mostrar qué objetos consumen más CPU | Una clasificación por costo es imaginable, pero no es esta |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-113 · flujo, packaging

**Pregunta:** Según la lectura, ¿qué son los SoundBanks?

**Correcta:** Wwise Objects de nuestro proyecto de Wwise exportado para integrarlo al juego

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Los archivos de audio originales, antes de importarlos | Idea ingenua: bancos = audios |
| 5 | Una copia de seguridad del proyecto de Wwise | Una «exportación» del proyecto; cercana |
| 3 | Los busses que llegan a los parlantes | Mixing; otra familia |
| 3 | Los plugins que conectan Wwise con Unreal | Herramienta de integración |
| 3 | Las pestañas del Project Explorer | Agrupación del editor |
| 3 | Los efectos que se aplican a la señal | Procesamiento; otra familia |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-114 · flujo, packaging

**Pregunta:** Un SoundBank es como una lista. ¿De qué?

**Correcta:** De otros Wwise Objects y archivos de audio

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | De los views y layouts del editor | Cosas del editor |
| 3 | De los bloques de Blueprint del juego | Cosas de Unreal |
| 3 | De las plataformas e idiomas disponibles | Se configuran en el SoundBank Manager, pero no son la lista |
| 1 | De los parlantes y controles conectados | Equipo físico |
| 5 | Solo de archivos de audio, sin Wwise Objects | Mitad cierta: le faltan los Wwise Objects |
| 5 | Solo de Events, sin archivos de audio | Mitad cierta: le faltan los audios |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-115 · flujo, packaging

**Pregunta:** ¿Por qué se habla de SoundBanks, en plural?

**Correcta:** Porque podemos exportar solo lo que queramos y por partes, en uno o varios SoundBanks

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Porque Wwise genera siempre uno por cada archivo de audio | Regla de partición plausible |
| 5 | Porque es obligatorio uno para música y otro para SFX | Regla de partición plausible y práctica común |
| 3 | Porque cada bus necesita su propio SoundBank | Regla de partición rara |
| 3 | Porque uno es para el editor y otro para el juego | Los dos son del juego |
| 1 | Porque el juego necesita dos copias de cada sonido | Absurdo |
| 3 | Porque cada persona del equipo exporta el suyo | Confunde con los Work Units |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-116 · flujo, packaging

**Pregunta:** ¿Qué nos permite tener el proyecto exportado en varios SoundBanks?

**Correcta:** Cargar cada SoundBank a memoria desde el juego cuando lo queramos

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Editar los Wwise Objects desde el juego | El juego no edita objetos |
| 3 | Que el juego no necesite el motor de Wwise | El motor siempre hace falta |
| 5 | Reproducir audio sin cargar nada a memoria | Habla de memoria, como la correcta, pero al revés |
| 3 | Cambiar la plataforma del juego en cualquier momento | La plataforma se decide al exportar |
| 1 | Aplicar efectos sin usar busses | Sin relación |
| 3 | Llamar a los Events sin instalar el plugin | El plugin siempre hace falta |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-117 · flujo, packaging

**Pregunta:** Al abrir el juego solo quieres en memoria la música y los efectos de los menús. ¿Cómo lo logras?

**Correcta:** Con un SoundBank para los menús cargado al inicio y otro para el juego cargado al dar clic en «Jugar»

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Con un solo SoundBank con todo, cargado al abrir el juego | La alternativa exacta que la pregunta descarta |
| 3 | Bajando el volumen del bus de música hasta dar clic en «Jugar» | Mezcla; no toca la memoria |
| 3 | Con un Event que pausa los sonidos del juego mientras estás en el menú | Game Input; no toca la memoria |
| 1 | Poniendo un filtro en el bus de los menús | Nada que ver con la memoria |
| 3 | Con un Game Sync que silencia los sonidos del juego | Game Input; no toca la memoria |
| 1 | Borrando del proyecto los sonidos del juego | Absurdo |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-118 · flujo, packaging

**Pregunta:** ¿En qué view del editor se configuran los SoundBanks?

**Correcta:** SoundBank Manager

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Project Explorer | Los SoundBanks también aparecen ahí, en su pestaña |
| 5 | Property Editor | Edita propiedades de cualquier objeto, bancos incluidos |
| 3 | Transport Control | View de reproducción |
| 3 | Soundcaster | View de reproducción |
| 3 | Event Editor | Editor de otro tipo de objeto |
| 3 | Contextual Help | View de ayuda |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-119 · flujo, packaging

**Pregunta:** ¿Qué se configura en el SoundBank Manager?

**Correcta:** Qué Wwise Objects contiene cada SoundBank, y para qué plataforma e idioma se exporta

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | El volumen y el pitch de cada sonido | Se edita en el Property Editor |
| 3 | A qué bus se direcciona cada objeto de Contenido | Se edita en el Property Editor |
| 3 | Las acciones que ejecuta cada Event | Se editan en el Event Editor |
| 3 | Qué efectos se aplican a cada bus | Se editan en el bus |
| 1 | Qué bloques de Blueprint se exponen en Unreal | Lo hace el plugin en Unreal |
| 3 | El nombre, tipo e id de cada objeto | Campos del objeto; no se configuran ahí |

**Modo difícil:** ❌ no entra (0 de nivel 5, faltan 3)

### wu-wo-120 · flujo, packaging

**Pregunta:** ¿Qué pasa al dar clic en Generar en el SoundBank Manager?

**Correcta:** Se crean los SoundBanks donde lo hayamos configurado

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Se cargan los SoundBanks a la memoria del juego | La confusión exacta: generar no es cargar |
| 3 | Se reproducen todos los sonidos del proyecto | Generar no reproduce |
| 1 | Se instala el plugin de Wwise en Unreal | Sin relación |
| 3 | Se crea un Wwise Object por cada archivo de audio | Los objetos se crean a mano |
| 1 | Se abre el juego para probarlo | Sin relación |
| 3 | Se borra la configuración anterior del proyecto | Generar no borra configuración |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-121 · flujo, packaging

**Pregunta:** ¿Qué se le integra al entregable del juego para procesar el audio?

**Correcta:** El motor y los SoundBanks, el primero que procesa el audio según el segundo.

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | El editor de Wwise completo, con todos sus views | Confunde editor con motor |
| 5 | El proyecto de Wwise sin exportar | Confunde proyecto con exportación |
| 5 | Solo los archivos de audio: el juego los reproduce sin nada más | Mitad cierta: le falta el motor y sobran los audios sueltos |
| 3 | El SoundBank Manager | View del editor |
| 3 | El Project Explorer | View del editor |
| 3 | Un Blueprint por cada sonido | Cosas de Unreal |

**Modo difícil:** ✅ entra (3 de nivel 5)

> *Nota:* La correcta termina en punto; las demás respuestas del banco no.

### wu-wo-122 · flujo, packaging

**Pregunta:** Según la lectura, ¿qué es el entregable del juego?

**Correcta:** El juego exportado: al que le damos doble clic, se abre y jugamos

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | El proyecto de Wwise abierto en el editor | Es el proyecto, no el juego |
| 5 | El proyecto de Unreal abierto en su editor | El mismo juego, pero sin exportar: la distinción exacta |
| 3 | La lista de SoundBanks generados | Es lo que se integra al entregable |
| 3 | El plugin de Wwise para Unreal | Herramienta de integración |
| 1 | La carpeta con los audios originales | Sin relación |
| 1 | El diagrama de las cinco familias | Sin relación |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-123 · flujo

**Pregunta:** ¿Qué representa el grupo Game Input?

**Correcta:** Los Wwise Objects que sirven para comunicarse con el juego

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Los objetos «que se reproducen» | Definición de Contenido: lo que Game Input hace sonar |
| 3 | Los busses, que simbolizan una consola de mezcla | Definición de Mixing; familia lejana |
| 3 | Los objetos que manipulan la señal de audio con efectos | Definición de Procesamiento; familia lejana |
| 5 | El proyecto exportado que el juego carga a memoria | Definición de Packaging: lo otro que el juego toca (carga bancos) |
| 3 | Los views que el usuario abre en el editor | Cosas del editor |
| 3 | Los archivos de audio que entran al proyecto | Materia prima, no familia |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-124 · flujo

**Pregunta:** Al instalar el PLUGIN de Wwise en el motor del juego, ¿qué hace con los Wwise Objects de tipo Game Input?

**Correcta:** Los lee y los «expone» en la interfaz del editor del motor del juego

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Los copia dentro de cada SoundBank | El plugin lee, no copia |
| 3 | Los convierte en archivos de audio | El plugin no convierte nada |
| 1 | Los borra del proyecto de Wwise | Absurdo |
| 3 | Los reproduce uno por uno para probarlos | El plugin no reproduce |
| 3 | Los direcciona al bus principal | El ruteo es cosa de Wwise |
| 3 | Los agrupa en pestañas nuevas del Project Explorer | El plugin no toca el editor de Wwise |

**Modo difícil:** ❌ no entra (0 de nivel 5, faltan 3)

### wu-wo-125 · flujo

**Pregunta:** ¿Qué significa que el plugin «expone» un Wwise Object?

**Correctas (2):** 
- Que añade elementos que nos permiten «llamarlos» desde el juego
- Que crea, por ejemplo, un asset de Unreal para configurar un bloque de Blueprint

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Que lo exporta dentro de un SoundBank | «Exportar» por «exponer»: trampa de vocabulario |
| 3 | Que lo hace sonar en el editor de Wwise | El plugin no hace sonar nada en el editor |
| 3 | Que muestra sus propiedades en el Property Editor | Eso es del editor de Wwise |
| 3 | Que lo carga a memoria al abrir el juego | Eso lo hacen los SoundBanks |
| 3 | Que lo conecta a un bus de salida | Eso es ruteo |
| 5 | Que lo vuelve visible en el Project Explorer | «Exponer» leído como «hacer visible» |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-126 · flujo

**Pregunta:** ¿Qué pasa cuando el juego «llama» a un Wwise Object de tipo Game Input?

**Correcta:** El motor de Wwise hace «algo»; por ejemplo, hacer sonar una canción

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Se genera un SoundBank nuevo | Los bancos se generan en el editor |
| 3 | Se abre el editor de Wwise | El juego no abre el editor |
| 3 | Se crea un Wwise Object nuevo en el proyecto | Los objetos se crean en el editor |
| 1 | El plugin se vuelve a instalar | Absurdo |
| 3 | Nada: los Game Inputs solo organizan el proyecto | Los Game Inputs hacen cosas, no organizan |
| 3 | Se editan sus propiedades en el Property Editor | Eso es del editor |

**Modo difícil:** ❌ no entra (0 de nivel 5, faltan 3)

### wu-wo-127 · flujo, events

**Pregunta:** En Unreal, ¿con qué tipo de bloque de Blueprint se llama a un Event?

**Correcta:** PostEvent

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | LoadBank | Nodo real de Wwise, pero de bancos |
| 5 | SetSwitch | Nodo real de Game Input hermano: Game Sync |
| 5 | SetState | Nodo real de Game Input hermano: Game Sync |
| 5 | SetRTPCValue | Nodo real de Game Input hermano: Game Sync |
| 5 | PlaySound2D | Nodo nativo de Unreal que «reproduce»: trampa de vocabulario |

**Modo difícil:** ✅ entra (4 de nivel 5)

### wu-wo-128 · flujo

**Pregunta:** ¿Qué dos tipos de Game Input hay?

**Correcta:** Events y Game Syncs

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Sonido y Estructura | Otra pareja de la misma taxonomía de la clase |
| 5 | Música y SFX | Otra pareja de la misma taxonomía de la clase |
| 3 | Busses y efectos | No es pareja de la taxonomía |
| 3 | SoundBanks y Work Units | No es pareja de la taxonomía |
| 5 | Play y Stop | Tipos de acción, que viven dentro de los Events |
| 3 | Plugins y Blueprints | Cosas de Unreal |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-129 · flujo, events

**Pregunta:** ¿Qué hace un Event al ser llamado?

**Correcta:** Ejecuta la lista de acciones que le hayamos configurado

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Cambia una propiedad que tiene muchos valores | Es lo que hace un Game Sync, el Game Input hermano |
| 3 | Carga un SoundBank a memoria | Eso lo hace el juego con LoadBank |
| 3 | Mezcla la señal y la manda a los parlantes | Eso lo hacen los busses |
| 3 | Aplica un efecto a todos los busses | Eso es Procesamiento |
| 3 | Expone el objeto en la interfaz de Unreal | Eso lo hace el plugin |
| 1 | Crea un Wwise Object nuevo en el proyecto | Absurdo |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-130 · flujo, events

**Pregunta:** Además de su tipo (Play, Stop, Pause…), ¿qué tiene que tener cada acción de un Event?

**Correcta:** Un Wwise Object sobre el que se ejecuta

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Un valor numérico entre 0 y 100 | La idea de los Game Syncs, el Game Input hermano |
| 3 | Un SoundBank propio | Packaging; otra cosa |
| 3 | Un bloque de Blueprint | Cosas de Unreal |
| 3 | Una plataforma y un idioma | Campos de la exportación |
| 3 | Otro Event que la llame | Los Events no se encadenan así en la clase |
| 3 | Un efecto aplicado | Procesamiento; otra cosa |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-131 · flujo, events

**Pregunta:** ¿Cuál de estos es un tipo de acción de un Event?

**Correctas (3):** 
- Play
- Stop
- Pause

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | PostEvent | El nodo que llama al Event; se confunde con una acción |
| 3 | Generar | Botón del SoundBank Manager |
| 3 | Exponer | Verbo del plugin |
| 3 | Estructura | Grupo de la clasificación |
| 3 | SoundBank | Packaging |
| 1 | Project Explorer | Un view como acción: absurdo |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-132 · flujo, events

**Pregunta:** Un Event tiene una acción Play que apunta a un Music Segment con una canción. ¿Qué pasa cuando el juego llama a ese Event?

**Correcta:** Se reproduce la canción del Music Segment

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Se detiene la canción del Music Segment | Acción hermana: Stop |
| 5 | Se reproducen todas las canciones del proyecto | Sobregeneralización de la acción |
| 3 | Se genera un SoundBank con esa canción | Packaging; otra cosa |
| 3 | Se abre el Music Segment en el editor | Cosas del editor |
| 3 | Nada: una acción Play no necesita un Wwise Object | Las acciones siempre tienen objeto |
| 5 | Se sube el volumen de la canción a 85/100 | El ejemplo de Game Sync de la clase; se confunde con el Event |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-133 · flujo, events

**Pregunta:** ¿Para qué tipo de cosas se usan principalmente los Events?

**Correcta:** Para activar cosas que se definen por Sí o No, como reproducir o parar

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Para propiedades con muchos valores, como un volumen de 85/100 | El ejemplo de la clase para Game Syncs |
| 5 | Para elegir la tercera canción de una lista | El ejemplo de la clase para Game Syncs |
| 3 | Para decidir a qué bus va cada sonido | Ruteo |
| 3 | Para exportar el proyecto por partes | Packaging |
| 3 | Para agrupar sonidos en carpetas | Organización del proyecto |
| 3 | Para editar propiedades desde el editor | Cosa del editor |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-134 · flujo, gameSyncs

**Pregunta:** ¿Para qué se usan los Game Syncs?

**Correcta:** Para manipular propiedades de Wwise Objects que tienen muchos valores

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Para acciones de Sí o No, como reproducir o parar | El caso de los Events, el Game Input hermano |
| 3 | Para exportar los Wwise Objects al juego | Packaging |
| 3 | Para agrupar los objetos en pestañas | Organización del editor |
| 3 | Para conectar los busses a los parlantes | Mixing |
| 1 | Para instalar el plugin en Unreal | Sin relación |
| 3 | Para cargar los SoundBanks a memoria | Lo hace el juego, no un Game Sync |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-135 · flujo, gameSyncs

**Pregunta:** Desde el juego quieres subir el volumen a 85/100. ¿Qué tipo de Game Input corresponde?

**Correcta:** Un Game Sync

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Un Event con una acción Play | Event: el Game Input hermano |
| 5 | Un Event con una acción Stop | Event: el Game Input hermano |
| 5 | Un Event con una acción Pause | Event: el Game Input hermano |
| 3 | Ninguno: el volumen solo se cambia en el editor | Falso: el juego sí cambia el volumen |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-136 · flujo, gameSyncs

**Pregunta:** ¿Cuál de estos casos es para un Game Sync y no para un Event?

**Correctas (2):** 
- Subir el volumen a 85/100
- Cambiar a la tercera canción de la lista

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Reproducir una canción | Caso de Event, el Game Input hermano |
| 5 | Parar un sonido | Caso de Event, el Game Input hermano |
| 5 | Pausar la música | Caso de Event, el Game Input hermano |
| 5 | Aplicar un filtro | Caso de Event, el Game Input hermano |

**Modo difícil:** ✅ entra (4 de nivel 5)

### wu-wo-137 · flujo, events

**Pregunta:** ¿Cuál de estos casos es para un Event?

**Correctas (3):** 
- Reproducir una canción
- Parar un sonido
- Pausar la música

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Subir el volumen a 85/100 | Caso de Game Sync, el Game Input hermano |
| 5 | Bajar el volumen a 30/100 | Caso de Game Sync, el Game Input hermano |
| 5 | Cambiar a la tercera canción de la lista | Caso de Game Sync, el Game Input hermano |
| 5 | Cambiar a la quinta canción de la lista | Caso de Game Sync, el Game Input hermano |

**Modo difícil:** ✅ entra (4 de nivel 5)

### wu-wo-138 · flujo

**Pregunta:** ¿Qué representa el grupo Contenido?

**Correcta:** Los objetos «que se reproducen»

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Los Wwise Objects que sirven para comunicarse con el juego | Definición de Game Input, que actúa sobre Contenido |
| 3 | Los busses, que simbolizan una consola de mezcla | Definición de Mixing; familia lejana |
| 5 | Los objetos que manipulan la señal de audio con efectos | Definición de Procesamiento, que también actúa sobre Contenido |
| 3 | El proyecto exportado que el juego carga a memoria | Definición de Packaging; familia lejana |
| 3 | Los views donde se editan las propiedades | Cosas del editor |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-139 · flujo

**Pregunta:** ¿Sobre qué objetos se aplican los Game Syncs y las acciones de los Events?

**Correcta:** Sobre los de Contenido, los objetos «que se reproducen»

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Sobre los SoundBanks ya generados | Wwise Objects, pero de Packaging; no se reproducen |
| 3 | Sobre los views del editor | Cosas del editor |
| 3 | Sobre el entregable del juego | Fuera de Wwise |
| 3 | Sobre los bloques de Blueprint | Cosas de Unreal |
| 3 | Sobre los Work Units | Wwise Objects, pero de organización |
| 1 | Sobre los parlantes y controles | Equipo físico |

**Modo difícil:** ❌ no entra (0 de nivel 5, faltan 3)

### wu-wo-140 · flujo, busses

**Pregunta:** ¿Qué tienen que tener configurado todos los elementos de Contenido para ser reproducidos?

**Correcta:** Un bus al que van a ser direccionados

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Un SoundBank propio | Packaging; no hace falta para reproducir |
| 3 | Un efecto de reverb | Procesamiento; opcional |
| 3 | Un Game Sync | Game Input; opcional |
| 3 | Un Event con una acción Stop | Game Input; y Stop no reproduce |
| 3 | Una plataforma y un idioma | Campos de la exportación |
| 3 | Un bloque de Blueprint | Cosas de Unreal |

**Modo difícil:** ❌ no entra (0 de nivel 5, faltan 3)

### wu-wo-141 · flujo, clasificacion

**Pregunta:** En nuestra clasificación, ¿cómo se llaman los objetos de Contenido que contienen directamente el audio?

**Correcta:** Sonido

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Estructura | El otro grupo de la misma clasificación |
| 3 | Mixing | Familia distinta |
| 3 | Procesamiento | Familia distinta |
| 3 | Game Input | Familia distinta |
| 5 | SFX | El otro eje de clasificación; «sound effects» como anzuelo |
| 3 | SoundBanks | Packaging |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-142 · flujo, clasificacion

**Pregunta:** ¿Qué son los objetos de Estructura?

**Correcta:** Los que contienen varios Wwise Objects de Sonido

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Los que contienen directamente los archivos de audio | Definición de Sonido, el grupo hermano |
| 3 | Los que simbolizan una consola de mezcla | Mixing |
| 3 | Los que aplican efectos a la señal | Procesamiento |
| 3 | Los que sirven para comunicarse con el juego | Game Input |
| 3 | Los que definen para qué plataforma se exporta | Exportación |
| 3 | Los que solo sirven para voces | Las voces son otro subgrupo de Contenido, pero lejano |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-143 · flujo, clasificacion

**Pregunta:** ¿Cuáles son las dos clasificaciones internas de Contenido?

**Correcta:** Sonido o Estructura, y Música o SFX

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Events o Game Syncs, y Play o Stop | Parejas reales de la clase, pero de Game Input |
| 3 | Busses principales o secundarios, y efectos | No es pareja de la taxonomía |
| 3 | Editor o juego, y plataforma o idioma | No es pareja de la taxonomía |
| 3 | Nombre o tipo, e hijos o referencias | Campos del objeto, no clasificación |
| 5 | Sí o No, y muchos valores | Pareja real de la clase, pero de Game Input |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-144 · flujo, clasificacion

**Pregunta:** ¿Qué objetos de Contenido quedan fuera de la clasificación Música / SFX?

**Correctas (2):** 
- Los que sirven para voces y los que agrupan sin importar si es música o SFX
- Los de voces, las carpetas virtuales y los property containers

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Los Events y los Game Syncs | Game Input; no son Contenido |
| 3 | Los busses y los efectos | Mixing y Procesamiento; no son Contenido |
| 3 | Los SoundBanks y los Work Units | Packaging y editor; no son Contenido |
| 5 | Ninguno: todo objeto de Contenido es de Música o de SFX | La inversa exacta |
| 3 | Solo los Music Segments | Son música; están dentro de la clasificación |
| 5 | Los que contienen directamente el audio | Sonido, el otro eje de Contenido; se confunden los ejes |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

> *Nota:* Las dos respuestas correctas dicen lo mismo con otras palabras; conviene dejar una.

### wu-wo-145 · flujo, estructura

**Pregunta:** ¿Qué tienen en común las carpetas virtuales y los property containers?

**Correcta:** Agrupan objetos independientemente de si son de música o de SFX

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Contienen directamente los archivos de audio | Definición de Sonido, el grupo hermano de los agrupadores |
| 5 | Solo sirven para voces | El otro grupo que queda fuera de Música / SFX |
| 3 | Son tipos de bus | Mixing |
| 3 | Son tipos de Game Sync | Game Input |
| 5 | Solo pueden agrupar música | La correcta con un detalle invertido |
| 3 | Son acciones de un Event | Game Input |

**Modo difícil:** ✅ entra (3 de nivel 5)

### wu-wo-146 · flujo, busses

**Pregunta:** ¿Qué representa el grupo Mixing · Routing?

**Correcta:** Los busses

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Los Events y los Game Syncs | Definición de Game Input; familia lejana |
| 3 | Los objetos «que se reproducen» | Definición de Contenido; se conecta a los busses, pero no es lo mismo |
| 5 | Los efectos que manipulan la señal | Definición de Procesamiento, que actúa sobre los busses |
| 3 | Los SoundBanks | Packaging |
| 3 | Los archivos de audio | Materia prima |
| 3 | Los views del editor | Cosas del editor |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-147 · flujo, busses

**Pregunta:** ¿Qué simbolizan los busses?

**Correcta:** Una consola de mezcla de audio

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Una lista de reproducción | Es la idea de un Music Playlist |
| 3 | Un archivo de audio | Es Contenido |
| 3 | Una base de datos | Es el interior de Wwise |
| 5 | Un parlante | Es a lo que la consola se conecta; cercano |
| 3 | Una carpeta del proyecto | Organización |
| 1 | Un bloque de Blueprint | Cosas de Unreal; sin relación |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-148 · flujo, busses

**Pregunta:** ¿Qué hace un bus con los elementos de Contenido conectados a él cuando se reproducen?

**Correcta:** Les manipula el volumen y los efectos, y pasa la señal a los equipos físicos

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Elige al azar cuál de ellos suena | Regla de un Random Container |
| 3 | Los exporta a un SoundBank | Lo hace el SoundBank Manager |
| 3 | Los expone en la interfaz de Unreal | Lo hace el plugin |
| 3 | Ejecuta sus acciones Play y Stop | Lo hace un Event |
| 3 | Los guarda en la base de datos del proyecto | Es el interior de Wwise |
| 1 | Los convierte en Events | Absurdo |

**Modo difícil:** ❌ no entra (0 de nivel 5, faltan 3)

### wu-wo-149 · flujo, busses

**Pregunta:** ¿A qué equipo físico pueden estar conectados los busses?

**Correcta:** Parlantes o controles que vibran

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 1 | Teclados y ratones | Periféricos de entrada; sentido común |
| 1 | Discos duros | Almacenamiento; sentido común |
| 3 | Micrófonos y cámaras | Equipo de audio, pero de entrada |
| 3 | Pantallas y proyectores | Equipo de salida, pero de video |
| 1 | Servidores de internet | Sin relación |

**Modo difícil:** ❌ no entra (0 de nivel 5, faltan 3)

### wu-wo-150 · flujo, busses · RETIRADA

**Pregunta:** Un bus que no llega directo a los equipos físicos y entra a otro bus. ¿Qué pasa con su señal?

**Correcta:** Eventualmente llega al bus principal y suena

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | Se pierde: solo suena lo que va directo al equipo físico | La inversa exacta |
| 3 | Se queda en ese bus hasta que un Event la libere | Los Events no retienen señal |
| 3 | Vuelve al objeto de Contenido del que salió | La señal no vuelve |
| 3 | Se guarda en un SoundBank | Packaging |
| 3 | Solo suena si se le aplica un efecto | Los efectos no deciden si suena |
| 1 | Se convierte en un Game Sync | Absurdo |

**Modo difícil:** no aplica (pregunta retirada)

> *Nota:* Retirada: no se muestra; se califica solo por completitud.

### wu-wo-151 · flujo, efectos

**Pregunta:** ¿Qué representa el grupo Procesamiento?

**Correcta:** Los Wwise Objects que manipulan la señal de audio aplicando efectos

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 3 | Los Wwise Objects que sirven para comunicarse con el juego | Definición de Game Input; familia lejana |
| 5 | Los objetos «que se reproducen» | Definición de Contenido, sobre la que actúan los efectos |
| 5 | Los busses, que simbolizan una consola de mezcla | Definición de Mixing, sobre la que actúan los efectos |
| 3 | El proyecto exportado que el juego carga a memoria | Packaging |
| 3 | Los objetos que contienen varios objetos de Sonido | Definición de Estructura, un subgrupo de Contenido |

**Modo difícil:** ❌ no entra (2 de nivel 5, falta 1)

### wu-wo-152 · flujo, efectos

**Pregunta:** El jugador entra al agua y quieres que la música y los SFX suenen filtrados a la vez. ¿Dónde conviene aplicar el efecto?

**Correcta:** En un bus, porque modifica el sonido de varias cosas a la vez

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | En cada sonido por separado, uno por uno | La alternativa exacta: efecto por objeto |
| 3 | En un SoundBank | Packaging |
| 3 | En un Event con una acción Stop | Game Input |
| 1 | En el Project Explorer | Un view; sin relación |
| 1 | En el plugin de Unreal | Herramienta de integración; sin relación |
| 3 | En un Work Unit | Organización del proyecto |

**Modo difícil:** ❌ no entra (1 de nivel 5, faltan 2)

### wu-wo-153 · flujo, efectos

**Pregunta:** Quieres que cambie un solo sonido concreto, sin afectar a los demás. ¿Dónde conviene aplicar el efecto?

**Correcta:** Directamente en ese Wwise Object de Contenido

| Nivel | Incorrecta | Por qué |
|:---:|---|---|
| 5 | En el bus principal | La alternativa exacta: efecto en un bus |
| 5 | En el bus por el que salen todos los SFX | La alternativa exacta: efecto en un bus |
| 5 | En todos los busses a la vez | La alternativa exacta: efecto en todos los busses |
| 3 | En el SoundBank que lo contiene | Packaging |
| 1 | En el SoundBank Manager | Un view; sin relación |
| 1 | En el entregable del juego | Fuera de Wwise |

**Modo difícil:** ✅ entra (3 de nivel 5)
