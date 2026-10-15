# Handoff · guiones de narración · Wwise + Unreal · Intro a Wwise

## Proyecto

Que los estudiantes entiendan las diapositivas sin el profesor. Primer paso: un guion narrado por diapositiva y por paso para cada clase de la sección Intro. Después se decidirá si el texto pasa a un campo «narracion» de los diccionarios y si se produce audio o video. Formato, proceso, convenciones y reglas de revisión: `../screenplay_creation_guide.md`.

## Reglas vigentes

Las doce reglas de revisión de la guía se aplican a todos los guiones. Las seis primeras: ideas guía visibles en una esquina, mínimo de palabras, sin mención al curso ni al orden de clases (cada clase es individual; los requisitos por clase y la lista de contenidos del curso se harán aparte), apertura que dice qué se aprende y por qué, narración en bloque de código, y ojos en movimiento (cambio visual máximo cada 6 s, intentando 4,5 s, promedio 2,5 s). Las seis siguientes: pantalla entre corchetes y voz entre llaves, una definición por diapositiva, transición con el esquema de ideas (en diapositiva propia o en la primera frase de la de contenido), frase completa al señalar, sin coloquialismos, y matices a la lectura.

El guion describe el estado final de cada diapositiva: sin sección de propuestas, sin marcas PROPUESTA y sin referencias a las diapositivas anteriores. Al implementar una clase se compara el guion con las diapositivas existentes y se reutilizan las gráficas y los textos que sirvan.

## Archivos

Todos en esta carpeta, `src/presentations/creacion_guiones_wwise-unreal/`. La clase actual de la plataforma «Datos, programas y servidores» se propone dividir en dos; los guiones ya están divididos y las clases siguientes se renumeran:

- Clase 1 · Datos y programas: `guion_clase_1_datos_y_programas.md`. Terminado: revisado por los agentes y por el docente, en formato de estado final. Falta implementarlo.
- Clase 2 · Servidores: `guion_clase_2_servidores.md`. Revisado por los agentes y corregido; pendiente de revisión del docente. Sigue en el formato anterior, con sección de propuestas y marcas PROPUESTA.
- Clase 3 · ¿Qué es un motor de audio?: `guion_clase_3_motor.md`. Por escribir.
- Clase 4 · Wwise por adentro: `guion_clase_4_wwise_por_adentro.md`. Por escribir.
- Clase 5 · El editor Wwise: `guion_clase_5_editor.md`. Por escribir.
- Clase 6 · Wwise Objects: `guion_clase_6_objects.md`. Por escribir.

Fuentes por clase: `../wwise-unreal/<slug>.dict.tsx` (objeto `es`) y `../wwise-unreal/<slug>.tsx`. Las clases 1 y 2 salen del mismo deck, `datos-programas-y-servidores`.

## Pendiente

- El docente revisa `guion_clase_2_servidores.md` en VS Code. Después se pasa al formato de estado final: incorporar a «Pantalla» las correcciones de su sección de propuestas, borrar la sección y las marcas PROPUESTA, y escribir las acciones en pantalla de todas sus unidades.
- Decidir qué hacer con las preguntas de práctica de «Datos, programas y servidores» antes de implementar la clase 1.
- Más reglas de revisión por venir del docente; incorporarlas a la guía y repasar los guiones existentes con ellas.

## Siguiente

Clase 3 `que-es-un-motor-de-audio`, 10 unidades: portada; s=1 compilados con tres pasos (el paso 0 muestra solo el título); s=2 interpretados; s=3 qué es un motor con cinco pasos (definición, navegador, Python, game engine, Wwise). Luego clase 4 (2 unidades), clase 5 (8) y clase 6 (18, con el flujo de cinco pasos).
