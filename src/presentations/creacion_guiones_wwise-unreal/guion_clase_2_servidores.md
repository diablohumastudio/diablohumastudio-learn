# Guion · Clase 2 · Servidores

Formato, proceso, convenciones y reglas de revisión: `../screenplay_creation_guide.md`. Estado del proyecto y archivos de las demás clases: `handoff.md`.

Estado: borrador revisado por un verificador de veracidad y uno de pedagogía, corregido y ajustado a las reglas de revisión de la guía. Todavía no lo ha revisado el docente (2026-10-15).

Notas:
1) Esta clase viene de la división de la clase antigua de la plataforma, «Datos, programas y servidores», en dos clases propuestas: «Datos y programas» (`guion_clase_1_datos_y_programas.md`) y esta, «Servidores». Mientras no exista la división, los índices actuales en la plataforma son: cliente-servidor 3, servidores 4, backend 5, hardware 6, arranque 7.
2) Al final hay una lista de cambios propuestos para las diapositivas, pendientes de aprobación.

## Clase 2 · Servidores

`/course/wwise-unreal/class/datos-programas-y-servidores` (hoy; la clase dividida tendrá su propia ruta)

### s=0 · intro · Portada (PROPUESTA: portada nueva)

Kicker: «Intro a Wwise · Bases Teóricas»

Título propuesto: «Servidores»

Pantalla propuesta:
- Portada con una foto de fondo.
- Pista: «Navega con ← → · espacio».

Objetivo: 15 s · 32 palabras ≈ 13 s

```text
[El kicker ya está en pantalla]
Bienvenidos a la clase Intro a Wwise. [Aparece el título con animación de entrada por escala] Veremos qué es un servidor y cómo lo usa un juego.

Avanza con la flecha derecha o la barra espaciadora. Retrocede con la flecha izquierda. [Aparece la pista con animación de entrada por escala]
```

### s=1 · cliente-servidor · Un servidor es un programa que atiende peticiones

Kicker: «Modelo cliente-servidor»

Título: «Un servidor es un programa que atiende peticiones»

Pantalla:
- A la izquierda, una caja «PC CLIENTE · quien pide».
- A la derecha, una caja grande «PC SERVIDOR» con tres pasos numerados adentro: «valida al usuario», «busca los recursos», «arma la respuesta».
- Dos flechas entre las cajas: la de ida, «petición · lo que quieres, como lo quieres»; la de vuelta, «respuesta · …o un error si no se puede».

Leyenda: «Flujo: el cliente envía una petición; el servidor valida al usuario, busca los recursos y arma la respuesta; y devuelve la respuesta al cliente, o un error si no se pudo»

Objetivo: 60 s · 123 palabras ≈ 51 s

```text
Aquí no hay una sola computadora: son dos, conectadas por una red, como internet.

A la izquierda, la PC cliente: la que pide. Puede ser un navegador o un juego, dentro de tu computadora, tu celular o tu consola. A la derecha, la PC servidor: la que responde.

La flecha que va hacia el servidor es la petición: qué quieres y cómo lo quieres.

Dentro del servidor, si hace falta valida al usuario, busca los datos o archivos necesarios, arma la respuesta y la envía.

La que vuelve es la respuesta, o un error si no se pudo.

Un servidor es, ante todo, un programa que atiende peticiones. El cliente también es un programa, y los dos pueden estar en la misma computadora.
```

### s=2 · tipos y ejemplos de servidores · Cada servidor sirve lo suyo

Kicker: «Tipos y ejemplos de servidores»

Título: «Cada servidor sirve lo suyo»

Pantalla:
- Cuatro filas iguales; en cada una, la petición entra por la izquierda y la respuesta regresa por el mismo lado, y a la derecha hay ejemplos reales.
- Fila 1: «SERVIDOR WEB» · «pides una página» · «sirve páginas web» · «ej.: Apache · Nginx».
- Fila 2: «SERVIDOR DE BASE DE DATOS» · «pides unos datos» · «sirve datos» · «ej.: PostgreSQL · MySQL».
- Fila 3: «SERVIDOR DE GIT» · «pides el código de un repositorio» · «sirve repositorios de código» · «ej.: GitHub · GitLab».
- Fila 4: «SERVIDOR DE AUTORIZACIÓN» · «pides entrar con tu cuenta» · «sirve un permiso de acceso (token)» · «ej.: OAuth de Google · OAuth de Apple».

Leyenda: «Por eso se llama servidor: sirve páginas, archivos o datos, siempre a quien los pide»

Objetivo: 60 s · 163 palabras ≈ 68 s

```text
Se llama servidor porque sirve: entrega algo a quien lo pide. Cuatro tipos. En cada fila, la flecha de ida es la petición y la de vuelta, la respuesta.

Servidor web: pides una página y te la devuelve. Apache y Nginx son dos de los más usados.

Servidor de base de datos. Una base de datos es una colección ordenada de datos, como los usuarios de un juego. Pides unos datos, por ejemplo tu puntaje, y te los devuelve. PostgreSQL y MySQL son dos ejemplos.

Servidor de Git. Git guarda cada versión de un proyecto. El proyecto con su historial se llama repositorio. GitHub y GitLab lo ofrecen en línea. Así comparten su trabajo los equipos de videojuegos.

Servidor de autorización: pides entrar con tu cuenta y, si eres quien dices ser, te devuelve un permiso de acceso, un token. Es lo que pasa cuando entras con tu cuenta de Google o de Apple.

Cuatro servicios, un patrón: petición, trabajo del servidor, respuesta.
```

### s=3 · backend · Un backend es un conjunto de servidores que trabajan juntos

Kicker: «Backend-as-a-Service»

Título: «Un backend es un conjunto de servidores que trabajan juntos»

Pantalla:
- A la izquierda, «PC CLIENTE · quien pide».
- A la derecha, una caja grande «BACKEND» que contiene «SERVIDOR WEB / API · recibe la petición», «SERVIDOR DE AUTORIZACIÓN · ¿quién eres?» y «BASE DE DATOS · qué te corresponde».
- Del servidor web salen dos flechas teal: «valida» hacia autorización y «busca» hacia la base de datos.
- La petición dice «pides un DLC» y la respuesta «recibes el DLC».

Leyenda: «El cliente habla con un solo punto; adentro, varios servidores se comunican entre sí para armar la respuesta. Ejemplos: Nakama · LootLocker · Steamworks · Google Play Services · Apple Game Center»

Objetivo: 60 s · 159 palabras ≈ 66 s

```text
Un juego en línea suele hablar con varios servidores que trabajan juntos: el backend, la parte que está detrás, fuera de tu vista.

Sigue la petición. El cliente pide un DLC: contenido descargable, como niveles, personajes o música nuevos, con sus sonidos.

Entra por un solo punto: el servidor web, la puerta del backend. Lo que le puedes pedir, y cómo, se llama su API. Ese servidor no lo resuelve solo. Por las flechas turquesa consulta al servidor de autorización, que valida quién eres, y a la base de datos, que busca si ese DLC te corresponde, por ejemplo si lo compraste. Con eso arma la respuesta, y el cliente recibe el DLC.

El cliente vio una puerta. Adentro conversaron tres servidores. Hay empresas que venden ese backend ya armado: backend como servicio, Backend-as-a-Service. Nakama y LootLocker son backends completos. Steamworks, Google Play Games Services y Game Center cubren solo una parte: cuentas, logros y puntajes.
```

### s=4 · hardware de servidor · Una computadora servidor: hecha para servir todo el día

Kicker: «Hardware de servidor»

Título: «Una computadora servidor: hecha para servir todo el día»

Pantalla:
- Dos máquinas por dentro, lado a lado.
- Izquierda, «COMPUTADORA SERVIDOR»: CPU, RAM, DISCO; «TARJETA(S) DE RED · súper rápidas y robustas · 24/7» y «FUENTE DE PODER · súper robusta · encendida 24/7», las dos en ámbar; «TARJETA DE VIDEO · inexistente: nadie mira la pantalla», dibujada punteada.
- Por arriba del servidor entran «peticiones · día y noche» y salen «respuestas».
- Derecha, «PC DE DISEÑO GRÁFICO»: CPU, RAM, DISCO; «TARJETA DE RED · básica»; «FUENTE DE PODER · básica»; «TARJETA DE VIDEO · potente: todo se ve en pantalla», en ámbar.

Leyenda: «Mismas piezas, prioridades opuestas: el servidor responde todo el día; la PC de diseño muestra»

Objetivo: 55 s · 145 palabras ≈ 60 s

```text
Ese programa servidor corre en una máquina que también se llama servidor. Aquí la ves por dentro, a la izquierda, junto a una PC de diseño gráfico.

Las dos tienen CPU, RAM y disco. Cambian las prioridades.

En el servidor importan las piezas ámbar. Las tarjetas de red, por donde entran peticiones y salen respuestas día y noche: muy rápidas y robustas, a veces más de una. La fuente de poder, que reparte la electricidad a todas las piezas: muy robusta, porque está encendida las veinticuatro horas. La tarjeta de video va punteada: nadie mira su pantalla, así que basta un chip básico.

En la PC de diseño es al revés: red y fuente comunes, y una tarjeta de video potente, porque todo el trabajo se ve en pantalla.

Mismas piezas, otro uso: el hardware se elige según lo que la máquina va a hacer.
```

### s=5 · Instalar y abrir un programa (diapositiva con tres pasos)

#### s=5 p=0 · arranque

Kicker: «Instalar y abrir un programa»

Título: «Instalar un programa es copiarlo de un servidor al disco»

Pantalla:
- A la izquierda, fuera del celular, una caja «SERVIDOR · o disco de instalación» con el «JUEGO».
- A la derecha, el «CELULAR» por dentro, con dos cajas vacías: «DISCO» y «MEMORIA RAM».

Objetivo: 25 s · 54 palabras ≈ 22 s

```text
Veamos todo esto con algo que seguro has hecho: instalar y abrir un juego en tu celular.

A la izquierda, fuera del celular, un servidor con el juego, por ejemplo el de la tienda de aplicaciones. Dentro, el disco, que en un celular es su almacenamiento interno, y la memoria RAM. Los dos vacíos.
```

#### s=5 p=1 · instalas el juego

Pantalla:
- Aparece la flecha «instalas el juego» y una copia del «JUEGO» se desliza del servidor al disco del celular, donde queda con el rótulo «instalado».
- El original sigue en el servidor.

Objetivo: 20 s · 47 palabras ≈ 20 s

```text
Instalas el juego. {pausa} Tu celular es el cliente: pide el juego, y la respuesta es una copia que viaja del servidor al disco y queda ahí, instalada. El original sigue en el servidor.

Instalar es, en esencia, copiar el programa del servidor al disco. Todavía no corre.
```

#### s=5 p=2 · abres el juego

Título: cambia a «Abrir un programa es copiarlo del disco a la RAM»

Pantalla:
- Aparece la flecha «abres el juego» y otra copia del «JUEGO» se desliza del disco a la memoria RAM, donde queda con el rótulo «corriendo».
- El original sigue en el disco como «instalado».

Leyenda: «Instalar copia el programa del servidor al disco; abrirlo lo copia del disco a la RAM, donde corre»

Objetivo: 35 s · 78 palabras ≈ 32 s

```text
Abres el juego. {pausa} Otra copia viaja del disco a la RAM, al menos lo que necesita para empezar, y ahí queda corriendo: el procesador trabaja con lo que está en la RAM. Al cerrarlo, esa copia se borra de la RAM, pero el original sigue en el disco: por eso puedes abrirlo mañana.

En Wwise, los SoundBanks, los paquetes de sonido del juego, hacen el mismo viaje: pasan del disco a la RAM cuando el juego los necesita.
```

### s=6 · cierre · Para llevarse (PROPUESTA: la diapositiva no existe todavía)

Título propuesto: «Para llevarse»

Pantalla propuesta:
- Dos líneas: «Servidor: un programa que atiende peticiones», «Instalar copia del servidor al disco; abrir, del disco a la RAM».

Objetivo: 15 s · 26 palabras ≈ 11 s

```text
Un servidor es un programa que atiende peticiones. Instalar copia un programa del servidor al disco. Abrirlo lo copia del disco a la RAM, donde corre.
```

## Propuestas de cambio en las diapositivas de la clase 2 (pendientes de aprobación)

Salen de la revisión de veracidad y de pedagogía, de las reglas de revisión de la guía y de las acciones en pantalla escritas en el guion. Cada cambio en el diccionario `datos-programas-y-servidores.dict.tsx` debe hacerse en español y en inglés, con largos parecidos.

1. **Dividir el deck en dos clases.** «Datos, programas y servidores» pasa a ser «Datos y programas» (`guion_clase_1_datos_y_programas.md`) y «Servidores»: portada nueva, cliente-servidor, tipos de servidores, backend, hardware, instalar y abrir un juego, cierre. Cada clase con su ruta, su portada y su práctica; el registro de clases y las preguntas etiquetadas se reparten entre las dos.
2. **s=1 cliente-servidor.** Tilde en «cómo lo quieres». Las notas (tecla N) todavía cuentan la analogía del restaurante, que ya no es diapositiva: reemplazarlas por una nota corta sin restaurante, con los dos matices que la narración añade: el cliente también es un programa y la validación del usuario solo ocurre si hace falta. Opcional: «① valida al usuario · si hace falta».
3. **s=2 servidores.** Fila 4, ejemplos: «OAuth de Google · OAuth de Apple» → «Sign in with Google · Sign in with Apple» (OAuth es un protocolo, no un servicio; los productos se llaman así).
4. **s=3 backend.** Kicker «Backend-as-a-Service» → «Backend», y llevar «backend como servicio» a la leyenda, porque el kicker presenta el subtipo antes que el concepto. «SERVIDOR WEB / API» → «SERVIDOR WEB · ofrece la API» (la API es la interfaz, no el servidor). Leyenda: «Google Play Services» → «Google Play Games Services» y «Apple Game Center» → «Game Center» (nombres reales), separando «Backend como servicio: Nakama · LootLocker» de «Servicios de plataforma: Steamworks · Google Play Games Services · Game Center». Opcional: título «Un backend suele ser un conjunto de servidores que trabajan juntos».
5. **s=4 hardware.** «TARJETA DE VIDEO · inexistente» → «TARJETA DE VIDEO · mínima: nadie mira la pantalla» (los servidores traen un chip de video básico). «súper rápidas» → «superrápidas» y «súper robusta» → «superrobusta» (el prefijo va unido). En la PC de diseño, «FUENTE DE PODER · básica» → «común» (una PC con tarjeta de video potente necesita una fuente grande; la diferencia real es la robustez para funcionar 24/7). Decisión mayor, del verificador de pedagogía: es la diapositiva menos pertinente para estudiantes de sonido; reenfocar la PC de diseño gráfico como «PC DE AUDIO» (interfaz de audio de baja latencia, mucha RAM para librerías, SSD rápido, video básico) o eliminar la diapositiva y dejar en s=1 la frase «a la máquina donde corre también se le llama servidor».
6. **s=5 arranque.** «SERVIDOR · o disco de instalación» → «SERVIDOR · tienda de aplicaciones» (un celular no usa disco de instalación y «disco» tendría dos sentidos en la misma diapositiva).
7. **s=6 cierre, nueva.** Dos líneas, sin mención a otras clases (regla 3 de la guía): el servidor como programa que atiende peticiones, e instalar y abrir como copias del servidor al disco y del disco a la RAM.
8. **Movimiento de ojos (regla 6 de la guía).** Revisar cada diapositiva para que haya un cambio visual al menos cada 6 segundos de narración y en promedio cada 2,5 (pasos, resaltes, animaciones), y recortar texto donde haya pocas gráficas. Las acciones entre corchetes del guion son la lista concreta de cambios; las unidades de s=0 a s=3 ya las tienen.
9. **Fuera del deck.** La sección «Clase 1» de `lectura.es.md` está desactualizada (conserva el restaurante y no tiene el backend); conviene regenerarla desde estos guiones o retirarla. Una pregunta de práctica sigue etiquetada con la diapositiva «restaurante», que ya no existe: reetiquetarla a «cliente-servidor» o retirarla.
