# Handoff · guiones de narración · Wwise + Unreal · Intro a Wwise

## Proyecto

Que los estudiantes entiendan las diapositivas sin el profesor. Primer paso: un guion narrado por diapositiva y por paso para cada clase de la sección Intro. Después se decidirá si el texto pasa a un campo «narracion» de los diccionarios y si se produce audio o video. Formato, proceso, convenciones y reglas de revisión: `../screenplay_creation_guide.md`.

## Reglas vigentes

Las doce reglas de revisión de la guía se aplican a todos los guiones. Las seis primeras: ideas guía visibles en una esquina, mínimo de palabras, sin mención al curso ni al orden de clases (cada clase es individual; los requisitos por clase y la lista de contenidos del curso se harán aparte), apertura que dice qué se aprende y por qué, narración en bloque de código, y ojos en movimiento (cambio visual máximo cada 6 s, intentando 4,5 s, promedio 2,5 s). Las seis siguientes: pantalla entre corchetes y voz entre llaves, una definición por diapositiva, transición con el esquema de ideas (en diapositiva propia o en la primera frase de la de contenido), frase completa al señalar, sin coloquialismos, y matices a la lectura.

El guion describe el estado final de cada diapositiva: sin sección de propuestas, sin marcas PROPUESTA y sin referencias a las diapositivas anteriores. Al implementar una clase se compara el guion con las diapositivas existentes y se reutilizan las gráficas y los textos que sirvan.

## Archivos

Todos en esta carpeta, `src/presentations/creacion_guiones_wwise-unreal/`. La clase actual de la plataforma «Datos, programas y servidores» se propone dividir en dos; los guiones ya están divididos y las clases siguientes se renumeran:

- Clase 1 · Datos y programas: `guion_clase_1_datos_y_programas.md`. Terminado y aprobado por el docente, en formato de estado final. Implementado el 2026-10-16 en `../wwise-unreal/datos-y-programas.tsx` y `.dict.tsx` (siete diapositivas, registrada primera de Intro en `src/data/learn.ts`), pendiente de revisión visual del docente. Sus preguntas nuevas están en `questions/reviews/datos_y_programas_2026_oct_16.json` con su revisión, sin importar.
- Clase 2 · Servidores: `guion_clase_2_servidores.md`. Revisado por los agentes y corregido; pendiente de revisión del docente. Sigue en el formato anterior, con sección de propuestas y marcas PROPUESTA. Mientras tanto, la entrada `datos-programas-y-servidores` sigue registrada con el título provisional «Servidores» y solo con las diapositivas de servidores (sin portada vieja, biblioteca ni lenguajes); al implementar la clase 2 se decide si cambia el slug.
- Clase 3 · ¿Qué es un motor de audio?: `guion_clase_3_motor.md`. Por escribir.
- Clase 4 · Wwise por adentro: `guion_clase_4_wwise_por_adentro.md`. Por escribir.
- Clase 5 · El editor Wwise: `guion_clase_5_editor.md`. Por escribir.
- Clase 6 · Wwise Objects: `guion_clase_6_objects.md`. Por escribir.
- Clase 7 · Work Units y control de versiones: `guion_clase_7_work_units_y_vcs.md`. Escrito junto con las diapositivas nuevas (`../wwise-unreal/work-units-y-vcs.tsx`, cinco diapositivas, registrada en `src/data/learn.ts`), a partir de `Clases/Clase07/Contenido.md` del material docente (verificado por el revisor de veracidad). Revisado por el verificador de pedagogía; pendiente de revisión del docente. Sus preguntas están en `questions/reviews/work_units_y_vcs_2026_oct_16.json` con su revisión, sin importar.

Fuentes por clase: `../wwise-unreal/<slug>.dict.tsx` (objeto `es`) y `../wwise-unreal/<slug>.tsx`. La clase 1 ya tiene deck propio, `datos-y-programas`; la clase 2 sigue en `datos-programas-y-servidores`.

## Pendiente

- El docente revisa `guion_clase_2_servidores.md` en VS Code. Después se pasa al formato de estado final: incorporar a «Pantalla» las correcciones de su sección de propuestas, borrar la sección y las marcas PROPUESTA, y escribir las acciones en pantalla de todas sus unidades.
- El docente revisa la clase 1 implementada en la plataforma y, en el editor de preguntas, pasa wu-002 a `datos-y-programas` (diapositiva `lenguajes`), corrige wu-001 y wu-004 y retira wu-003 y wu-005. Luego revisa `questions/reviews/datos_y_programas_2026_oct_16.md`, genera el archivo de importación con `review-to-import.js` e importa las catorce preguntas nuevas.
- Las acciones entre corchetes del guion de la clase 1 están implementadas como entradas escalonadas (un turno de 0,6 s por acción, en el orden de la narración); cuando exista audio habrá que sincronizarlas con la voz.
- Más reglas de revisión por venir del docente; incorporarlas a la guía y repasar los guiones existentes con ellas.

## Siguiente

Clase 3 `que-es-un-motor-de-audio`, 10 unidades: portada; s=1 compilados con tres pasos (el paso 0 muestra solo el título); s=2 interpretados; s=3 qué es un motor con cinco pasos (definición, navegador, Python, game engine, Wwise). Luego clase 4 (2 unidades), clase 5 (8) y clase 6 (18, con el flujo de cinco pasos).
