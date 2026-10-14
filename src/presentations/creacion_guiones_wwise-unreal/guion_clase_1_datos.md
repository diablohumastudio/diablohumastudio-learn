# Guion · Clase 1 · Datos, programas y servidores

Narración hablada de cada diapositiva de la clase, para que un estudiante la vea solo, sin profesor, con la diapositiva en pantalla. Estado: borrador revisado por un verificador de veracidad y uno de pedagogía, corregido, ajustado a las reglas de revisión de la guía y con la primera revisión del docente aplicada hasta la analogía de la biblioteca (2026-10-14). Al final hay una lista de cambios propuestos para las diapositivas, pendientes de aprobación.

Numeración: sigue la estructura propuesta, que incluye diapositivas nuevas marcadas PROPUESTA. Mientras no existan, los índices actuales en la plataforma son: portada 0, biblioteca 1, lenguajes 2, cliente-servidor 3, servidores 4, backend 5, hardware 6, arranque 7.

Formato, proceso, convenciones y reglas de revisión: `../screenplay_creation_guide.md`. Estado del proyecto y archivos de las demás clases: `handoff.md`.

## Clase 1 · Datos, programas y servidores

`/course/wwise-unreal/class/datos-programas-y-servidores`

### s=0 · intro · Portada

Pantalla: portada con una foto de computador de fondo. Kicker: «Intro a Wwise · Bases Teoricas. Título: «Datos, programas y servidores». Pista: «Navega con ← → · espacio».

Objetivo: 12 s · 23 palabras ≈ 10 s

```text
[El kiker ya esta en pantalla]
Bienvenidos a la clase Intro a Wwise. [Aparece el titulo con animacion de entrada por escala]

Avanza con la flecha derecha o la barra espaciadora. Retrocede con la flecha izquierda. [Aparece la pista con animacion de entrada por escala]
```

### s=1 · Tres ideas (PROPUESTA: diapositiva nueva, con dos pasos)

Pantalla propuesta: tres recuadros en fila: «Los datos dentro del computador», «Qué es un programa» y «Qué es un servidor». Kicker : "Tres temas introductorios" 

#### s=1 p=0 · ideas

Objetivo: 20 s · 44 palabras ≈ 18 s

```text
[ya esta el kiker]
Veremos tres ideas que te servirán como bases teóricas: los datos dentro del computador, qué es un programa y qué es un servidor. [cada recuadro aparece cuando se lo mensiona]
```

#### s=1 p=1 · datos

Objetivo: 5 s · 7 palabras ≈ 3 s

```text
Ahora veamos los datos dentro del computador. [el primer recuadro se resalta en ámbar y los otros dos se atenúan. El mismo esquema se hace pequeño y queda en una esquina de la diapositiva quedara para las siguientes tambien]
```

### s=2 · dato · Qué es un dato (PROPUESTA: diapositiva nueva)

Pantalla propuesta: título «Un dato es información guardada» y tres ejemplos dibujados: un texto, una imagen y un sonido.

Objetivo: 8 s · 12 palabras ≈ 5 s

```text
[El titulo ya esta]
Un dato es cualquier información guardada: un texto, una imagen, un sonido. [Aparecen cada uno de los dibujos cuando se los mensiona]
```

### s=3 · Analogía de un PC a una biblioteca (diapositiva con dos pasos)

#### s=3 p=0 · biblioteca

Pantalla: kicker «Los datos tienen que llegar al procesador». Título: «Analogía de un PC a una biblioteca». Dibujo de una biblioteca vista desde arriba: arriba, tres estanterías con el rótulo «todas las materias» y la nota «levantarse · lento»; abajo, dos mesas laterales con libros cerrados, rótulo «la mesa», nota «alcanzar · rápido»; en el centro, una mesa con cuatro personas leyendo libros abiertos, rótulo «la materia actual», nota «leer · al instante».

Objetivo: 35 s · 92 palabras ≈ 38 s

```text
Ahora entendamos los datos dentro de una computadora a través de esta analogía con una biblioteca.

En las estanterías cabe de todo, pero buscar un libro ahí es lento: hay que levantarse.

En las mesas de los lados hay libros cerrados de las materias en uso. Cabe menos, pero alcanzar uno es rápido.

En la mesa del centro, tú y tres compañeros leen los libros abiertos de la materia en que trabajan ahora mismo. Caben muy pocos, pero leerlos es instantáneo.

La regla: cuanto más cerca de las manos, más rápido, pero menos cabe.
```

#### s=3 p=1 · computador

Pantalla: la misma escena, pero cada pieza cruza a su equivalente en un computador, con animación: las estanterías se vuelven discos duros («todos los datos», «cargar del disco · lento»), las mesas laterales se vuelven módulos de memoria RAM («traer de RAM · rápido») y la mesa central se vuelve una CPU de cuatro núcleos con su caché («lo que usas ya mismo», «leer la caché · al instante»). Leyenda: «Mientras más cerca está la información, más rápido se procesa cuando se necesita».

Objetivo: 35 s · 94 palabras ≈ 39 s

```text
Ahora veamos las piezas del computador análogas a la biblioteca. [pausa]

Las estanterías son el disco duro. Guarda de todo permanentemente, pero es el más lento de los tres y su comunicacion es mas lenta porque tambien esta mas lejos. La coneccion suele ser mediante cables o pistas largas en la mainboard.

Las mesas son la memoria RAM: es mucho más pequeña pero mucho más rápida y esta mas cercana. La coneccion suele ser con pistas mas pequenas en la mainboard, osea esta mas cerca. En algunas computadoras incluso, los pines de la ram estan directamente conectadas a los del CPU.

Tú y tus compañeros son la CPU, el procesador: cada persona es un núcleo, que trabaja solo con lo que tiene enfrente. Los libros abiertos son la caché: una memoria diminuta pegada al procesador, con lo que se usa en este instante. La coneccion es todavia mas pequena pues son pistas del mismo chip.

Cuando un programa dice «cargando», son datos copiándose del disco a la RAM.
```

### s=4 · ideas · Qué es un programa (PROPUESTA: transición con el esquema de las tres ideas)

Pantalla propuesta: el esquema de las tres ideas a pantalla completa, con «Qué es un programa» resaltado en ámbar.

Objetivo: 5 s · 6 palabras ≈ 2 s

```text
Ahora veamos qué es un programa.
```

### s=5 · lenguajes · Más abstracto significa menos detalle

Pantalla: kicker «Los niveles de abstracción de los lenguajes de programación». Título: «Más abstracto significa menos detalle». Una pila de cuatro cajas, de arriba hacia abajo: «Python / JavaScript / GDScript / Blueprints» (líneas: «se lee casi como inglés», «la memoria la maneja el lenguaje por ti»); «C++ / Rust» («control total del hardware y la memoria», «se compila antes de correr»); «Ensamblador (assembly)» («instrucciones directas al procesador», «difícil de leer para un humano»); «Código máquina · 1s y 0s» («el único lenguaje que la CPU entiende», «pulsos eléctricos: 1 = encendido · 0 = apagado»). Solo la caja de código máquina es ámbar. A la izquierda, «MÁS ABSTRACTO» arriba y «MENOS ABSTRACTO» abajo; a la derecha, los rótulos «tú escribes aquí» (teal, arriba) y «la CPU lee aquí» (ámbar, abajo), más «más cerca del humano · más fácil para ti» y «más cerca de la máquina · más rápido para la CPU». Leyenda: «Mientras más abstracto es un lenguaje, menos detalle tienes que escribir y más fácil es de entender».

Objetivo: 70 s · 179 palabras ≈ 75 s

```text
Un programa es una lista de instrucciones para la computadora, escrita en un lenguaje de programación. Aquí hay cuatro niveles de lenguajes. Abstracto quiere decir que esconde detalles: cuanto más arriba, menos detalle escribes tú.

Abajo, en la caja ámbar, el código máquina: unos y ceros, señales eléctricas dentro del procesador. Es el único lenguaje que la CPU entiende: por eso dice «la CPU lee aquí».

Encima, el ensamblador: las mismas instrucciones con palabras cortas en vez de unos y ceros. Cuesta mucho leerlo.

Más arriba, C++ y Rust: mucho control sobre el hardware, las piezas físicas, y la memoria. Se compilan: se traducen a código máquina antes de correr.

Arriba de todo, Python, JavaScript, GDScript y Blueprints: se leen casi como inglés y, casi siempre, el lenguaje maneja la memoria por ti. Blueprints, el de Unreal, ni siquiera es texto: son cajas conectadas.

Escribas donde escribas, todo termina en unos y ceros. Arriba es más fácil para ti. Abajo, por lo general, corre más rápido. Por eso Unreal y Wwise están escritos en C++: un juego necesita velocidad.
```

### s=6 · ideas · Qué es un servidor (PROPUESTA: transición con el esquema de las tres ideas)

Pantalla propuesta: el esquema de las tres ideas a pantalla completa, con «Qué es un servidor» resaltado en ámbar.

Objetivo: 5 s · 6 palabras ≈ 2 s

```text
Ahora veamos qué es un servidor.
```

### s=7 · cliente-servidor · Un servidor es un programa que atiende peticiones

Pantalla: kicker «Modelo cliente-servidor». Título: «Un servidor es un programa que atiende peticiones». A la izquierda, una caja «PC CLIENTE · quien pide»; a la derecha, una caja grande «PC SERVIDOR» con tres pasos numerados adentro: «valida al usuario», «busca los recursos», «arma la respuesta». Dos flechas entre las cajas: la de ida, «petición · lo que quieres, como lo quieres»; la de vuelta, «respuesta · …o un error si no se puede». Leyenda: «Flujo: el cliente envía una petición; el servidor valida al usuario, busca los recursos y arma la respuesta; y devuelve la respuesta al cliente, o un error si no se pudo».

Objetivo: 60 s · 145 palabras ≈ 60 s

```text
Hasta aquí todo pasaba dentro de una computadora. Ahora son dos, conectadas por una red, como internet.

A la izquierda, la PC cliente: la que pide. Puede ser un navegador o un juego, en tu computadora, tu celular o tu consola. A la derecha, la PC servidor: la que responde.

La flecha que va hacia el servidor es la petición: qué quieres y cómo lo quieres. La que vuelve es la respuesta, o un error si no se pudo.

Dentro del servidor, tres pasos. Uno: si hace falta, valida al usuario: quién eres y si tienes permiso. Dos: busca los datos o archivos necesarios. Tres: arma la respuesta y la envía.

Un servidor es, ante todo, un programa que atiende peticiones. El cliente también es un programa, y los dos pueden estar en la misma computadora: así conversan Wwise y Unreal en tu propia máquina.
```

### s=8 · tipos y ejemplos de servidores · Cada servidor sirve lo suyo

Pantalla: kicker «Tipos y ejemplos de servidores». Título: «Cada servidor sirve lo suyo». Cuatro filas iguales; en cada una, la petición entra por la izquierda y la respuesta regresa por el mismo lado, y a la derecha hay ejemplos reales. Fila 1: «SERVIDOR WEB» · «pides una página» · «sirve páginas web» · «ej.: Apache · Nginx». Fila 2: «SERVIDOR DE BASE DE DATOS» · «pides unos datos» · «sirve datos» · «ej.: PostgreSQL · MySQL». Fila 3: «SERVIDOR DE GIT» · «pides el código de un repositorio» · «sirve repositorios de código» · «ej.: GitHub · GitLab». Fila 4: «SERVIDOR DE AUTORIZACIÓN» · «pides entrar con tu cuenta» · «sirve un permiso de acceso (token)» · «ej.: OAuth de Google · OAuth de Apple». Leyenda: «Por eso se llama servidor: sirve páginas, archivos o datos, siempre a quien los pide».

Objetivo: 60 s · 163 palabras ≈ 68 s

```text
Se llama servidor porque sirve: entrega algo a quien lo pide. Cuatro tipos. En cada fila, la flecha de ida es la petición y la de vuelta, la respuesta.

Servidor web: pides una página y te la devuelve. Apache y Nginx son dos de los más usados.

Servidor de base de datos. Una base de datos es una colección ordenada de datos, como los usuarios de un juego. Pides unos datos, por ejemplo tu puntaje, y te los devuelve. PostgreSQL y MySQL son dos ejemplos.

Servidor de Git. Git guarda cada versión de un proyecto. El proyecto con su historial se llama repositorio. GitHub y GitLab lo ofrecen en línea. Así comparten su trabajo los equipos de videojuegos.

Servidor de autorización: pides entrar con tu cuenta y, si eres quien dices ser, te devuelve un permiso de acceso, un token. Es lo que pasa cuando entras con tu cuenta de Google o de Apple.

Cuatro servicios, un patrón: petición, trabajo del servidor, respuesta.
```

### s=9 · backend · Un backend es un conjunto de servidores que trabajan juntos

Pantalla: kicker «Backend-as-a-Service». Título: «Un backend es un conjunto de servidores que trabajan juntos». A la izquierda, «PC CLIENTE · quien pide». A la derecha, una caja grande «BACKEND» que contiene «SERVIDOR WEB / API · recibe la petición», «SERVIDOR DE AUTORIZACIÓN · ¿quién eres?» y «BASE DE DATOS · qué te corresponde». Del servidor web salen dos flechas teal: «valida» hacia autorización y «busca» hacia la base de datos. La petición dice «pides un DLC» y la respuesta «recibes el DLC». Leyenda: «El cliente habla con un solo punto; adentro, varios servidores se comunican entre sí para armar la respuesta. Ejemplos: Nakama · LootLocker · Steamworks · Google Play Services · Apple Game Center».

Objetivo: 60 s · 159 palabras ≈ 66 s

```text
Un juego en línea suele hablar con varios servidores que trabajan juntos: el backend, la parte que está detrás, fuera de tu vista.

Sigue la petición. El cliente pide un DLC: contenido descargable, como niveles, personajes o música nuevos, con sus sonidos.

Entra por un solo punto: el servidor web, la puerta del backend. Lo que le puedes pedir, y cómo, se llama su API. Ese servidor no lo resuelve solo. Por las flechas turquesa consulta al servidor de autorización, que valida quién eres, y a la base de datos, que busca si ese DLC te corresponde, por ejemplo si lo compraste. Con eso arma la respuesta, y el cliente recibe el DLC.

El cliente vio una puerta. Adentro conversaron tres servidores. Hay empresas que venden ese backend ya armado: backend como servicio, Backend-as-a-Service. Nakama y LootLocker son backends completos. Steamworks, Google Play Games Services y Game Center cubren solo una parte: cuentas, logros y puntajes.
```

### s=10 · hardware de servidor · Una computadora servidor: hecha para servir todo el día

Pantalla: kicker «Hardware de servidor». Título: «Una computadora servidor: hecha para servir todo el día». Dos máquinas por dentro, lado a lado. Izquierda, «COMPUTADORA SERVIDOR»: CPU, RAM, DISCO; «TARJETA(S) DE RED · súper rápidas y robustas · 24/7» y «FUENTE DE PODER · súper robusta · encendida 24/7», las dos en ámbar; «TARJETA DE VIDEO · inexistente: nadie mira la pantalla», dibujada punteada. Por arriba del servidor entran «peticiones · día y noche» y salen «respuestas». Derecha, «PC DE DISEÑO GRÁFICO»: CPU, RAM, DISCO; «TARJETA DE RED · básica»; «FUENTE DE PODER · básica»; «TARJETA DE VIDEO · potente: todo se ve en pantalla», en ámbar. Leyenda: «Mismas piezas, prioridades opuestas: el servidor responde todo el día; la PC de diseño muestra».

Objetivo: 55 s · 145 palabras ≈ 60 s

```text
Ese programa servidor corre en una máquina que también se llama servidor. Aquí la ves por dentro, a la izquierda, junto a una PC de diseño gráfico.

Las dos tienen CPU, RAM y disco. Cambian las prioridades.

En el servidor importan las piezas ámbar. Las tarjetas de red, por donde entran peticiones y salen respuestas día y noche: muy rápidas y robustas, a veces más de una. La fuente de poder, que reparte la electricidad a todas las piezas: muy robusta, porque está encendida las veinticuatro horas. La tarjeta de video va punteada: nadie mira su pantalla, así que basta un chip básico.

En la PC de diseño es al revés: red y fuente comunes, y una tarjeta de video potente, porque todo el trabajo se ve en pantalla.

Mismas piezas, otro uso: el hardware se elige según lo que la máquina va a hacer.
```

### s=11 · Instalar y abrir un programa (diapositiva con tres pasos)

#### s=11 p=0 · arranque

Pantalla: kicker «Instalar y abrir un programa». Título: «Instalar un programa es copiarlo de un servidor al disco». A la izquierda, fuera del celular, una caja «SERVIDOR · o disco de instalación» con el «JUEGO». A la derecha, el «CELULAR» por dentro, con dos cajas vacías: «DISCO» y «MEMORIA RAM».

Objetivo: 25 s · 55 palabras ≈ 23 s

```text
Juntemos las tres ideas con algo que seguro has hecho: instalar y abrir un juego en tu celular.

A la izquierda, fuera del celular, un servidor con el juego, por ejemplo el de la tienda de aplicaciones. Dentro, el disco, que en un celular es su almacenamiento interno, y la memoria RAM. Los dos vacíos.
```

#### s=11 p=1 · instalas el juego

Pantalla: aparece la flecha «instalas el juego» y una copia del «JUEGO» se desliza del servidor al disco del celular, donde queda con el rótulo «instalado». El original sigue en el servidor.

Objetivo: 20 s · 47 palabras ≈ 20 s

```text
Instalas el juego. [pausa] Tu celular es el cliente: pide el juego, y la respuesta es una copia que viaja del servidor al disco y queda ahí, instalada. El original sigue en el servidor.

Instalar es, en esencia, copiar el programa del servidor al disco. Todavía no corre.
```

#### s=11 p=2 · abres el juego

Pantalla: el título cambia a «Abrir un programa es copiarlo del disco a la RAM». Aparece la flecha «abres el juego» y otra copia del «JUEGO» se desliza del disco a la memoria RAM, donde queda con el rótulo «corriendo». El original sigue en el disco como «instalado». Leyenda: «Instalar copia el programa del servidor al disco; abrirlo lo copia del disco a la RAM, donde corre».

Objetivo: 35 s · 78 palabras ≈ 32 s

```text
Abres el juego. [pausa] Otra copia viaja del disco a la RAM, al menos lo que necesita para empezar, y ahí queda corriendo: el procesador trabaja con lo que está en la RAM. Al cerrarlo, esa copia se borra de la RAM, pero el original sigue en el disco: por eso puedes abrirlo mañana.

En Wwise, los SoundBanks, los paquetes de sonido del juego, hacen el mismo viaje: pasan del disco a la RAM cuando el juego los necesita.
```

### s=12 · cierre · Las tres ideas (PROPUESTA: la diapositiva no existe todavía)

Pantalla propuesta: título «Tres ideas para llevarse» y tres líneas: «Datos: del disco a la RAM, y de ahí al procesador», «Programa: instrucciones que terminan en unos y ceros», «Servidor: un programa que atiende peticiones».

Objetivo: 25 s · 55 palabras ≈ 23 s

```text
Las tres ideas. Los datos viajan del disco a la RAM y de ahí al procesador: cuanto más cerca, más rápido. Un programa es una lista de instrucciones que termina en unos y ceros. Un servidor es un programa que atiende peticiones. Instalar copia del servidor al disco. Abrir copia del disco a la RAM.
```

## Propuestas de cambio en las diapositivas de la clase 1 (pendientes de aprobación)

Salen de la revisión de veracidad y de pedagogía y de las reglas de revisión de la guía. Cada cambio en el diccionario `datos-programas-y-servidores.dict.tsx` debe hacerse en español y en inglés, con largos parecidos.

1. **s=5 lenguajes.** «CÓDIGO MÁQUINA · 1s y 0s» → «CÓDIGO MÁQUINA · unos y ceros» (el plural «1s» es un anglicismo). «pulsos eléctricos» → «señales eléctricas». «control total del hardware y la memoria» → «mucho control del hardware y la memoria» (Rust no deja manejar la memoria a mano como C++). «la memoria la maneja el lenguaje por ti» → «casi siempre la memoria la maneja el lenguaje por ti» (en GDScript los Node se liberan a mano). «más rápido para la CPU» → «suele ser más rápido para la CPU».
2. **s=7 cliente-servidor.** Tilde en «cómo lo quieres». Las notas (tecla N) todavía cuentan la analogía del restaurante, que ya no es diapositiva: reemplazarlas por una nota corta sin restaurante, con los dos matices que la narración añade: el cliente también es un programa y la validación del usuario solo ocurre si hace falta. Opcional: «① valida al usuario · si hace falta».
3. **s=8 servidores.** Fila 4, ejemplos: «OAuth de Google · OAuth de Apple» → «Sign in with Google · Sign in with Apple» (OAuth es un protocolo, no un servicio; los productos se llaman así).
4. **s=9 backend.** Kicker «Backend-as-a-Service» → «Backend», y llevar «backend como servicio» a la leyenda, porque el kicker presenta el subtipo antes que el concepto. «SERVIDOR WEB / API» → «SERVIDOR WEB · ofrece la API» (la API es la interfaz, no el servidor). Leyenda: «Google Play Services» → «Google Play Games Services» y «Apple Game Center» → «Game Center» (nombres reales), separando «Backend como servicio: Nakama · LootLocker» de «Servicios de plataforma: Steamworks · Google Play Games Services · Game Center». Opcional: título «Un backend suele ser un conjunto de servidores que trabajan juntos».
5. **s=10 hardware.** «TARJETA DE VIDEO · inexistente» → «TARJETA DE VIDEO · mínima: nadie mira la pantalla» (los servidores traen un chip de video básico). «súper rápidas» → «superrápidas» y «súper robusta» → «superrobusta» (el prefijo va unido). En la PC de diseño, «FUENTE DE PODER · básica» → «común» (una PC con tarjeta de video potente necesita una fuente grande; la diferencia real es la robustez para funcionar 24/7). Decisión mayor, del verificador de pedagogía: es la diapositiva menos pertinente para estudiantes de sonido; reenfocar la PC de diseño gráfico como «PC DE AUDIO» (interfaz de audio de baja latencia, mucha RAM para librerías, SSD rápido, video básico) o eliminar la diapositiva y dejar en s=7 la frase «a la máquina donde corre también se le llama servidor».
6. **s=11 arranque.** «SERVIDOR · o disco de instalación» → «SERVIDOR · tienda de aplicaciones» (un celular no usa disco de instalación y «disco» tendría dos sentidos en la misma diapositiva).
7. **s=12 cierre, nueva.** Las tres ideas en tres líneas, sin mención a otras clases (regla 3 de la guía). La clase anuncia tres ideas en la portada y hoy termina sin recapitular.
8. **Fuera del deck.** La sección «Clase 1» de `lectura.es.md` está desactualizada (conserva el restaurante y no tiene el backend); conviene regenerarla desde estos guiones o retirarla. Una pregunta de práctica sigue etiquetada con la diapositiva «restaurante», que ya no existe: reetiquetarla a «cliente-servidor» o retirarla.
9. **Ideas guía (regla 1 de la guía).** Diapositiva nueva s=1 con dos pasos: tres recuadros, «Los datos dentro del computador», «Qué es un programa» y «Qué es un servidor», y en el segundo paso el primero resaltado. El mismo esquema en pequeño en una esquina de todas las diapositivas siguientes, con la idea actual resaltada en ámbar, como el minimapa de la clase Wwise Objects, y a pantalla completa como transición antes de cada idea (s=4 y s=6), donde solo se lee «Ahora veamos…». La numeración del guion ya sigue esta estructura.
10. **Movimiento de ojos (regla 6 de la guía).** Revisar cada diapositiva para que haya un cambio visual al menos cada 6 segundos de narración y en promedio cada 2,5 (pasos, resaltes, animaciones), y recortar texto donde haya pocas gráficas. Pendiente de diseño; por ahora solo se minimizó el texto narrado.
11. **s=2 Qué es un dato, nueva.** Una diapositiva propia para la definición de dato, con tres ejemplos dibujados (texto, imagen, sonido), antes de la analogía de la biblioteca.
