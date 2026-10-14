# Handoff · guiones de narración · Wwise + Unreal · Intro a Wwise

## Proyecto

Que los estudiantes entiendan las diapositivas sin el profesor. Primer paso: un guion narrado por diapositiva y por paso para cada una de las cinco clases de la sección Intro. Después se decidirá si el texto pasa a un campo «narracion» de los diccionarios y si se produce audio o video. Formato, proceso, convenciones y reglas de revisión: `../screenplay_creation_guide.md`.

## Reglas vigentes

Las seis reglas de revisión de la guía se aplican a todos los guiones: ideas guía visibles en una esquina, mínimo de palabras, sin mención al curso ni al orden de clases (cada clase es individual; los requisitos por clase y la lista de contenidos del curso se harán aparte), apertura que dice qué se aprende y por qué, narración en bloque de código, y ojos en movimiento (cambio visual máximo cada 6 s, promedio 2,5 s; por ahora solo se minimiza el texto).

## Archivos

Todos en esta carpeta, `src/presentations/creacion_guiones_wwise-unreal/`:

- Clase 1 · Datos, programas y servidores: `guion_clase_1_datos.md`. Revisado, corregido, ajustado a las reglas de revisión y con la primera revisión del docente aplicada hasta la biblioteca (2026-10-14); el docente edita el resto directamente; propuestas de diapositivas al final.
- Clase 2 · ¿Qué es un motor de audio?: `guion_clase_2_motor.md`. Por escribir.
- Clase 3 · Wwise por adentro: `guion_clase_3_wwise_por_adentro.md`. Por escribir.
- Clase 4 · El editor Wwise: `guion_clase_4_editor.md`. Por escribir.
- Clase 5 · Wwise Objects: `guion_clase_5_objects.md`. Por escribir.

Fuentes por clase: `../wwise-unreal/<slug>.dict.tsx` (objeto `es`) y `../wwise-unreal/<slug>.tsx`.

## Pendiente

- Revisar el diff de `guion_clase_1_datos.md` en VS Code, pedir correcciones y aprobar.
- Aprobar o rechazar las propuestas de cambio de diapositivas de la clase 1, al final de ese archivo: correcciones de texto en las diapositivas existentes, decisión sobre hardware (dejar, PC de audio o eliminar), diapositivas nuevas (tres ideas con sus transiciones, qué es un dato, cierre), notas de cliente-servidor sin restaurante, `lectura.es.md` desactualizada, la pregunta de práctica etiquetada «restaurante» y el rediseño para el movimiento de ojos (regla 6). El guion ya está numerado según esa estructura.
- Más reglas de revisión por venir del docente; incorporarlas a la guía y repasar los guiones existentes con ellas.

## Siguiente

Clase 2 `que-es-un-motor-de-audio`, 10 unidades: portada; s=1 compilados con tres pasos (el paso 0 muestra solo el título); s=2 interpretados; s=3 qué es un motor con cinco pasos (definición, navegador, Python, game engine, Wwise). Luego clase 3 (2 unidades), clase 4 (8) y clase 5 (18, con el flujo de cinco pasos).
