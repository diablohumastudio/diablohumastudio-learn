# TODO

Lista de pendientes del sitio. Al terminar uno se marca con `[x]`, no se borra.

## Learn

- [x] **Importador de preguntas: subir archivo y revisar antes de escribir.** Elegir un `.json` además de pegarlo; lista de todas las preguntas con su estado (nueva en verde, reemplaza con cambios en rojo, sin id en rojo, idéntica en amarillo), botón Editar por pregunta y advertencia con los conteos al confirmar. Diseñado en `docs/new_homeworks_design.md` (ítem 5).
- [ ] **Deber de entrega.** Un deber donde el alumno sube la foto o el escaneo de un trabajo hecho a mano (por ejemplo una transcripción), creado como un deber aparte. Necesita almacenamiento de archivos (confirmar si Firebase Storage exige el plan Blaze, o usar otro), pantalla de subida, reglas y un visor para el profesor.
- [ ] **Importador: conservar los ids de las respuestas al reemplazar.** Cada respuesta de una pregunta (cada opción correcta o incorrecta) tiene un id interno propio, y los exámenes lo usan: un intento guarda "en la pregunta X eligió la opción con id tal".
  - **El problema**: si un archivo importado reemplaza una pregunta que ya está en el banco y no trae ids de respuestas (los archivos escritos a mano no los traen), el importador les pone ids nuevos a todas sus respuestas, aunque el texto sea el mismo. Los intentos de examen ya guardados siguen apuntando a los ids viejos.
  - **Qué se pierde**: el vínculo entre la opción que eligió el alumno y la respuesta actual del banco. La repetición del intento se sigue viendo bien, porque el intento guarda también los textos.
  - **Cuándo importa**: solo al reemplazar preguntas que algún examen ya usó. Importar preguntas nuevas no tiene este problema.
  - **Mientras no esté arreglado**: para corregir preguntas ya usadas en exámenes, partir de un Export JSON (trae los ids de las respuestas) o editarlas en el editor, no desde un archivo escrito a mano.
  - **El arreglo**: al reemplazar, reutilizar el id de la respuesta existente cuando el texto es el mismo.
- [ ] **Editor de preguntas: editar en la misma lista.** Pedido al revisar la primera importación con revisión.
  - **Editar en línea**: al pulsar Editar, la pregunta se despliega ahí mismo (crece en vertical) con el formulario, en vez de cambiar de pantalla; Guardar o Cancelar la vuelven a plegar.
  - **Campos que crecen**: si el texto no cabe, el campo gana filas en vez de obligar a recorrerlo con el teclado para leerlo.
  - **Preguntas borradas**: un símbolo que marque las retiradas (no se borran del todo, quedan como legacy) y un botón directo para borrarlas (retirarlas), visible también con la pregunta plegada, no solo desplegada.
- [ ] **Registro de actividad (auditoría).** Saber qué pasó con los datos que nunca entran a un commit: quién creó o cambió un deber, un examen o una pregunta, y cuándo. Tres piezas: campos de auditoría en cada documento (`createdAt`, `createdBy`, `updatedAt`, `updatedBy`; hoy solo se guarda `createdAt`), una colección `auditLog` en Firestore donde cada acción del profesor deja una línea (quién, qué, sobre qué documento, cuándo), y una página "Actividad" en el menú de docente que muestre ese registro como línea de tiempo filtrable por persona, fecha y objeto.
