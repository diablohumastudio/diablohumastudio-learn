# Guion · Clase 1 · Datos, programas y servidores

Narración hablada de cada diapositiva de la clase, para que un estudiante la vea solo, sin profesor, con la diapositiva en pantalla. Estado: borrador revisado por un verificador de veracidad y uno de pedagogía y corregido según sus observaciones (2026-10-13); pendiente de revisión del docente. Al final hay una lista de cambios propuestos para las diapositivas, pendientes de aprobación.

Formato, proceso y convenciones de escritura: `../screenplay_creation_guide.md`. Estado del proyecto y archivos de las demás clases: `handoff.md`.

## Clase 1 · Datos, programas y servidores

`/course/wwise-unreal/class/datos-programas-y-servidores`

### s=0 · intro · Portada

Pantalla: portada con una foto de computador de fondo. Kicker: «Intro a Wwise · del disco al servidor». Título: «Datos, programas y servidores». Pista: «Navega con ← → · espacio».

Objetivo: 35 s · 87 palabras ≈ 36 s

Te doy la bienvenida al curso de Wwise con Unreal. Esta es la primera clase de Intro a Wwise, y todavía no vamos a abrir Wwise. Antes necesitas tres ideas que valen para cualquier computadora: cómo se mueven los datos, qué es un programa y qué es un servidor. Con ellas vas a entender, más adelante, por qué un juego carga sus sonidos en memoria y cómo se comunica con Wwise.

Avanza con la flecha derecha o con la barra espaciadora, y retrocede con la flecha izquierda.

### s=1 · Analogía de un PC a una biblioteca (diapositiva con dos pasos)

#### s=1 p=0 · biblioteca

Pantalla: kicker «Los datos tienen que llegar al procesador». Título: «Analogía de un PC a una biblioteca». Dibujo de una biblioteca vista desde arriba: arriba, tres estanterías con el rótulo «todas las materias» y la nota «levantarse · lento»; abajo, dos mesas laterales con libros cerrados, rótulo «la mesa», nota «alcanzar · rápido»; en el centro, una mesa con cuatro personas leyendo libros abiertos, rótulo «la materia actual», nota «leer · al instante».

Objetivo: 55 s · 144 palabras ≈ 60 s

Primera idea: cómo se mueven los datos. Un dato es cualquier información guardada: un texto, una imagen, un sonido. Para usarlo, la computadora tiene que llevarlo hasta el procesador, la pieza que hace los cálculos. Para verlo, imagina esta biblioteca vista desde arriba.

Arriba están las estanterías, con los libros de todas las materias. Ahí cabe todo, pero ir a buscar un libro es lo más lento: tienes que levantarte y caminar.

Abajo, a los lados, hay dos mesas con libros cerrados de las materias que estás usando. Cabe mucho menos, pero alcanzar uno es rápido: basta estirar el brazo.

En el centro, tú y tres compañeros leen los libros abiertos de la materia de ahora mismo. Caben muy pocos, pero leerlos es instantáneo.

Esa es la regla: cuanto más cerca de las manos está la información, más rápido la usas, pero menos cabe.

#### s=1 p=1 · computador

Pantalla: la misma escena, pero cada pieza cruza a su equivalente en un computador, con animación: las estanterías se vuelven discos duros («todos los datos», «cargar del disco · lento»), las mesas laterales se vuelven módulos de memoria RAM («traer de RAM · rápido») y la mesa central se vuelve una CPU de cuatro núcleos con su caché («lo que usas ya mismo», «leer la caché · al instante»). Leyenda: «Mientras más cerca está la información, más rápido se procesa cuando se necesita».

Objetivo: 50 s · 136 palabras ≈ 57 s

Ahora mira cómo cada pieza de la biblioteca se convierte en una pieza de tu computadora. [pausa]

Las estanterías son el disco: el almacenamiento de la máquina, sea un disco duro, un SSD o la memoria interna de un celular. Ahí vive todo: tus programas y tus archivos, incluidos tus audios. Pero es el más lento de los tres lugares.

Las mesas laterales son la memoria RAM: más pequeña que el disco, pero mucho más rápida.

Tú y tus compañeros son la CPU, el procesador: cada persona es un núcleo, que trabaja por su cuenta y solo con lo que tiene enfrente. Los libros abiertos son la caché: una memoria diminuta, pegada al procesador, con lo que se usa en este instante.

Cuando un programa dice «cargando», casi siempre son datos copiándose del disco a la RAM.

### s=2 · lenguajes · Más abstracto significa menos detalle

Pantalla: kicker «Los niveles de abstracción de los lenguajes de programación». Título: «Más abstracto significa menos detalle». Una pila de cuatro cajas, de arriba hacia abajo: «Python / JavaScript / GDScript / Blueprints» (líneas: «se lee casi como inglés», «la memoria la maneja el lenguaje por ti»); «C++ / Rust» («control total del hardware y la memoria», «se compila antes de correr»); «Ensamblador (assembly)» («instrucciones directas al procesador», «difícil de leer para un humano»); «Código máquina · 1s y 0s» («el único lenguaje que la CPU entiende», «pulsos eléctricos: 1 = encendido · 0 = apagado»). Solo la caja de código máquina es ámbar. A la izquierda, «MÁS ABSTRACTO» arriba y «MENOS ABSTRACTO» abajo; a la derecha, los rótulos «tú escribes aquí» (teal, arriba) y «la CPU lee aquí» (ámbar, abajo), más «más cerca del humano · más fácil para ti» y «más cerca de la máquina · más rápido para la CPU». Leyenda: «Mientras más abstracto es un lenguaje, menos detalle tienes que escribir y más fácil es de entender».

Objetivo: 90 s · 242 palabras ≈ 101 s

Segunda idea: qué es un programa. Es una lista de instrucciones para la computadora, escrita en un lenguaje de programación. Aquí tienes cuatro niveles de lenguajes. A la izquierda dice «más abstracto» arriba y «menos abstracto» abajo. Abstracto quiere decir que esconde detalles: cuanto más arriba, menos detalle tienes que escribir tú.

Abajo, en la única caja ámbar, está el código máquina: unos y ceros, que dentro del procesador son señales eléctricas, uno es encendido y cero es apagado. Es el único lenguaje que la CPU entiende. Por eso, a la derecha, dice «la CPU lee aquí».

Encima está el ensamblador: las mismas instrucciones, pero con palabras cortas en vez de unos y ceros. Cuesta mucho leerlo.

Más arriba, C++ y Rust: dan mucho control sobre el hardware, las piezas físicas, y sobre la memoria. Y se compilan: se traducen a código máquina antes de correr. Guarda esa palabra: compilar.

Arriba de todo, Python, JavaScript, GDScript, el de Godot, y Blueprints, el de Unreal. Se leen casi como inglés y, casi siempre, el lenguaje se encarga de la memoria por ti. Blueprints ni siquiera es texto: son cajas conectadas con líneas.

Escribas donde escribas, todo termina traducido a unos y ceros. Arriba escribes más fácil. Abajo, por lo general, el programa corre más rápido. Cuando hace falta velocidad, se baja de nivel. Por eso Unreal y Wwise están escritos en C++: un juego no puede trabar la imagen ni cortar el sonido.

### s=3 · cliente-servidor · Un servidor es un programa que atiende peticiones

Pantalla: kicker «Modelo cliente-servidor». Título: «Un servidor es un programa que atiende peticiones». A la izquierda, una caja «PC CLIENTE · quien pide»; a la derecha, una caja grande «PC SERVIDOR» con tres pasos numerados adentro: «valida al usuario», «busca los recursos», «arma la respuesta». Dos flechas entre las cajas: la de ida, «petición · lo que quieres, como lo quieres»; la de vuelta, «respuesta · …o un error si no se puede». Leyenda: «Flujo: el cliente envía una petición; el servidor valida al usuario, busca los recursos y arma la respuesta; y devuelve la respuesta al cliente, o un error si no se pudo».

Objetivo: 80 s · 196 palabras ≈ 82 s

Tercera idea: qué es un servidor. Hasta aquí todo pasaba dentro de una sola computadora. Ahora, normalmente, son dos, conectadas por una red, como internet.

A la izquierda está la PC cliente: la que pide. El cliente puede ser un navegador o un juego, en tu computadora, tu celular o tu consola. A la derecha, más grande, la PC servidor: la que responde.

Entre las dos van dos flechas. La que va hacia el servidor es la petición: un mensaje con lo que quieres y cómo lo quieres. La que vuelve es la respuesta, o un error, si lo que pediste no se pudo cumplir.

Fíjate en los tres pasos numerados dentro del servidor. Uno: si hace falta, valida al usuario, es decir, comprueba quién eres y si tienes permiso. Dos: busca los datos o archivos que hacen falta. Tres: arma la respuesta y la envía.

Eso es un servidor: ante todo, un programa que recibe peticiones, las revisa, las prepara y las responde. El cliente también es un programa, y los dos pueden estar incluso en la misma computadora. Más adelante vas a ver a Wwise y a Unreal conversar así, en tu propia máquina.

### s=4 · tipos y ejemplos de servidores · Cada servidor sirve lo suyo

Pantalla: kicker «Tipos y ejemplos de servidores». Título: «Cada servidor sirve lo suyo». Cuatro filas iguales; en cada una, la petición entra por la izquierda y la respuesta regresa por el mismo lado, y a la derecha hay ejemplos reales. Fila 1: «SERVIDOR WEB» · «pides una página» · «sirve páginas web» · «ej.: Apache · Nginx». Fila 2: «SERVIDOR DE BASE DE DATOS» · «pides unos datos» · «sirve datos» · «ej.: PostgreSQL · MySQL». Fila 3: «SERVIDOR DE GIT» · «pides el código de un repositorio» · «sirve repositorios de código» · «ej.: GitHub · GitLab». Fila 4: «SERVIDOR DE AUTORIZACIÓN» · «pides entrar con tu cuenta» · «sirve un permiso de acceso (token)» · «ej.: OAuth de Google · OAuth de Apple». Leyenda: «Por eso se llama servidor: sirve páginas, archivos o datos, siempre a quien los pide».

Objetivo: 80 s · 215 palabras ≈ 90 s

Se llama servidor porque sirve: entrega algo a quien se lo pide. Lo que cambia es qué entrega. Aquí tienes cuatro tipos. En cada fila, la flecha de ida es la petición y la de vuelta, la respuesta.

Primera fila: el servidor web. Le pides una página y te la devuelve. Apache y Nginx son dos de los programas más usados para esto.

Segunda: el servidor de base de datos. Una base de datos es una colección ordenada de datos, como los usuarios de un juego. Le pides unos datos, por ejemplo tu puntaje, y te los devuelve. PostgreSQL y MySQL son dos ejemplos.

Tercera: el servidor de Git. Git es un programa que guarda cada versión de un proyecto. El proyecto, con todo su historial de cambios, se llama repositorio. GitHub y GitLab lo ofrecen en línea. Así comparten su trabajo los equipos de videojuegos, y así lo vas a hacer en este curso.

Cuarta: el servidor de autorización. Le pides entrar con tu cuenta y, si eres quien dices ser, te devuelve un permiso de acceso: un token. Es lo que pasa cuando entras a una aplicación con tu cuenta de Google o de Apple.

Cuatro servicios distintos, un mismo patrón: llega una petición, el servidor hace su trabajo y devuelve una respuesta.

### s=5 · backend · Un backend es un conjunto de servidores que trabajan juntos

Pantalla: kicker «Backend-as-a-Service». Título: «Un backend es un conjunto de servidores que trabajan juntos». A la izquierda, «PC CLIENTE · quien pide». A la derecha, una caja grande «BACKEND» que contiene «SERVIDOR WEB / API · recibe la petición», «SERVIDOR DE AUTORIZACIÓN · ¿quién eres?» y «BASE DE DATOS · qué te corresponde». Del servidor web salen dos flechas teal: «valida» hacia autorización y «busca» hacia la base de datos. La petición dice «pides un DLC» y la respuesta «recibes el DLC». Leyenda: «El cliente habla con un solo punto; adentro, varios servidores se comunican entre sí para armar la respuesta. Ejemplos: Nakama · LootLocker · Steamworks · Google Play Services · Apple Game Center».

Objetivo: 80 s · 197 palabras ≈ 82 s

En la práctica, un juego en línea suele hablar con varios servidores que trabajan juntos. A ese conjunto se le llama backend: la parte del sistema que está detrás, fuera de tu vista.

Sigue la petición. El cliente, a la izquierda, pide un DLC, es decir, contenido descargable: niveles, personajes o música nuevos, con los sonidos que necesitan.

La petición entra por un solo punto: el servidor web, la puerta de entrada del backend. La lista de cosas que le puedes pedir, y cómo pedirlas, se llama su API. Ese servidor no lo resuelve todo solo. Mira las dos flechas turquesa: consulta al servidor de autorización, que valida quién eres, y a la base de datos, que busca si ese DLC te corresponde, por ejemplo, si lo compraste. Con eso arma la respuesta, y el cliente recibe el DLC.

El cliente solo vio una puerta. Adentro conversaron tres servidores. Hay empresas que venden ese backend ya armado, y por eso arriba dice Backend-as-a-Service: backend como servicio. Abajo tienes ejemplos. Nakama y LootLocker son backends completos. Steamworks, Google Play Games Services y Game Center cubren solo una parte, como cuentas de jugador, logros y puntajes.

### s=6 · hardware de servidor · Una computadora servidor: hecha para servir todo el día

Pantalla: kicker «Hardware de servidor». Título: «Una computadora servidor: hecha para servir todo el día». Dos máquinas por dentro, lado a lado. Izquierda, «COMPUTADORA SERVIDOR»: CPU, RAM, DISCO; «TARJETA(S) DE RED · súper rápidas y robustas · 24/7» y «FUENTE DE PODER · súper robusta · encendida 24/7», las dos en ámbar; «TARJETA DE VIDEO · inexistente: nadie mira la pantalla», dibujada punteada. Por arriba del servidor entran «peticiones · día y noche» y salen «respuestas». Derecha, «PC DE DISEÑO GRÁFICO»: CPU, RAM, DISCO; «TARJETA DE RED · básica»; «FUENTE DE PODER · básica»; «TARJETA DE VIDEO · potente: todo se ve en pantalla», en ámbar. Leyenda: «Mismas piezas, prioridades opuestas: el servidor responde todo el día; la PC de diseño muestra».

Objetivo: 75 s · 194 palabras ≈ 81 s

Dijimos que un servidor es, ante todo, un programa. Pero ese programa corre en una máquina, y a esa máquina también se le llama servidor. Aquí la ves por dentro, a la izquierda, junto a una PC de diseño gráfico, a la derecha.

Las dos tienen las mismas piezas básicas: CPU, RAM y disco. La diferencia está en las prioridades.

En el servidor, las piezas en ámbar son las que importan. Las tarjetas de red, por donde entran las peticiones y salen las respuestas día y noche, son muy rápidas y robustas, y a veces hay más de una. La fuente de poder, la pieza que reparte la electricidad a todas las demás, es muy robusta, porque la máquina está encendida las veinticuatro horas. Y la tarjeta de video aparece punteada: no necesita una potente, porque nadie mira su pantalla. Trae, a lo sumo, un chip de video básico.

En la PC de diseño es al revés: tarjeta de red común, fuente común y una tarjeta de video potente, porque ahí todo el trabajo se ve en pantalla.

Mismas piezas, otro uso: el hardware se elige según lo que la máquina va a hacer.

### s=7 · Instalar y abrir un programa (diapositiva con tres pasos)

#### s=7 p=0 · arranque

Pantalla: kicker «Instalar y abrir un programa». Título: «Instalar un programa es copiarlo de un servidor al disco». A la izquierda, fuera del celular, una caja «SERVIDOR · o disco de instalación» con el «JUEGO». A la derecha, el «CELULAR» por dentro, con dos cajas vacías: «DISCO» y «MEMORIA RAM».

Objetivo: 30 s · 70 palabras ≈ 29 s

Juntemos las tres ideas con algo que seguro has hecho: instalar y abrir un juego en tu celular.

A la izquierda, fuera del celular, hay un servidor con el juego, por ejemplo, el de la tienda de aplicaciones. Dentro del celular ves dos lugares que ya conoces de la biblioteca: el disco, que en un celular es su almacenamiento interno, y la memoria RAM. Por ahora, los dos están vacíos.

#### s=7 p=1 · instalas el juego

Pantalla: aparece la flecha «instalas el juego» y una copia del «JUEGO» se desliza del servidor al disco del celular, donde queda con el rótulo «instalado». El original sigue en el servidor.

Objetivo: 30 s · 65 palabras ≈ 27 s

Instalas el juego. [pausa] Tu celular hace de cliente: le pide el juego al servidor, y la respuesta es una copia. Fíjate en la flecha: la copia viaja del servidor al disco del celular y queda ahí, instalada. El original no se mueve: sigue en el servidor, listo para otras personas.

Instalar es, en esencia, eso: copiar el programa del servidor al disco. Todavía no corre.

#### s=7 p=2 · abres el juego

Pantalla: el título cambia a «Abrir un programa es copiarlo del disco a la RAM». Aparece la flecha «abres el juego» y otra copia del «JUEGO» se desliza del disco a la memoria RAM, donde queda con el rótulo «corriendo». El original sigue en el disco como «instalado». Leyenda: «Instalar copia el programa del servidor al disco; abrirlo lo copia del disco a la RAM, donde corre».

Objetivo: 50 s · 126 palabras ≈ 52 s

Ahora abres el juego. [pausa] Otra copia viaja, esta vez del disco a la memoria RAM, al menos la parte que el juego necesita para empezar, y ahí queda corriendo. Mientras juegas, el procesador trabaja con lo que está en la RAM, no con lo que está en el disco. Al cerrar el juego, esa copia se borra de la RAM, pero el original sigue instalado en el disco: por eso puedes volver a abrirlo mañana.

Con Wwise vas a ver este mismo viaje: los SoundBanks, los paquetes de sonido del juego, pasan del disco a la RAM cuando el juego los necesita.

En la siguiente clase vas a ver qué pasa con un programa cuando ya está corriendo, y qué significan las palabras compilar y motor.

### s=8 · cierre · Las tres ideas (PROPUESTA: la diapositiva no existe todavía)

Pantalla propuesta: título «Tres ideas para llevarse» y tres líneas: «Datos: del disco a la RAM, y de ahí al procesador», «Programa: instrucciones que terminan en unos y ceros», «Servidor: un programa que atiende peticiones». Al pie: «Próxima clase: compilar y motor».

Objetivo: 35 s · 86 palabras ≈ 36 s

Repasemos las tres ideas. Los datos viajan del disco a la RAM, y de ahí al procesador: cuanto más cerca, más rápido. Un programa es una lista de instrucciones que siempre termina traducida a unos y ceros. Y un servidor es un programa que atiende peticiones.

Instalar copia un programa del servidor al disco. Abrirlo lo copia del disco a la RAM, donde corre.

En la siguiente clase vas a ver qué pasa con un programa cuando ya está corriendo, y qué significan compilar y motor.

Si se aprueba esta diapositiva, el último párrafo de s=7 p=2 se elimina, porque pasa aquí.

## Propuestas de cambio en las diapositivas de la clase 1 (pendientes de aprobación)

Salen de la revisión de veracidad y de pedagogía. Cada cambio en el diccionario `datos-programas-y-servidores.dict.tsx` debe hacerse en español y en inglés, con largos parecidos.

1. **s=2 lenguajes.** «CÓDIGO MÁQUINA · 1s y 0s» → «CÓDIGO MÁQUINA · unos y ceros» (el plural «1s» es un anglicismo). «pulsos eléctricos» → «señales eléctricas». «control total del hardware y la memoria» → «mucho control del hardware y la memoria» (Rust no deja manejar la memoria a mano como C++). «la memoria la maneja el lenguaje por ti» → «casi siempre la memoria la maneja el lenguaje por ti» (en GDScript los Node se liberan a mano). «más rápido para la CPU» → «suele ser más rápido para la CPU».
2. **s=3 cliente-servidor.** Tilde en «cómo lo quieres». Las notas (tecla N) todavía cuentan la analogía del restaurante, que ya no es diapositiva: reemplazarlas por una nota corta sin restaurante, con los dos matices que la narración añade: el cliente también es un programa y la validación del usuario solo ocurre si hace falta. Opcional: «① valida al usuario · si hace falta».
3. **s=4 servidores.** Fila 4, ejemplos: «OAuth de Google · OAuth de Apple» → «Sign in with Google · Sign in with Apple» (OAuth es un protocolo, no un servicio; los productos se llaman así).
4. **s=5 backend.** Kicker «Backend-as-a-Service» → «Backend», y llevar «backend como servicio» a la leyenda, porque el kicker presenta el subtipo antes que el concepto. «SERVIDOR WEB / API» → «SERVIDOR WEB · ofrece la API» (la API es la interfaz, no el servidor). Leyenda: «Google Play Services» → «Google Play Games Services» y «Apple Game Center» → «Game Center» (nombres reales), separando «Backend como servicio: Nakama · LootLocker» de «Servicios de plataforma: Steamworks · Google Play Games Services · Game Center». Opcional: título «Un backend suele ser un conjunto de servidores que trabajan juntos».
5. **s=6 hardware.** «TARJETA DE VIDEO · inexistente» → «TARJETA DE VIDEO · mínima: nadie mira la pantalla» (los servidores traen un chip de video básico). «súper rápidas» → «superrápidas» y «súper robusta» → «superrobusta» (el prefijo va unido). En la PC de diseño, «FUENTE DE PODER · básica» → «común» (una PC con tarjeta de video potente necesita una fuente grande; la diferencia real es la robustez para funcionar 24/7). Decisión mayor, del verificador de pedagogía: es la diapositiva menos pertinente para estudiantes de sonido; reenfocar la PC de diseño gráfico como «PC DE AUDIO» (interfaz de audio de baja latencia, mucha RAM para librerías, SSD rápido, video básico) o eliminar la diapositiva y dejar en s=3 la frase «a la máquina donde corre también se le llama servidor».
6. **s=7 arranque.** «SERVIDOR · o disco de instalación» → «SERVIDOR · tienda de aplicaciones» (un celular no usa disco de instalación y «disco» tendría dos sentidos en la misma diapositiva).
7. **s=8 cierre, nueva.** Las tres ideas en tres líneas y «Próxima clase: compilar y motor». La clase anuncia tres ideas en la portada y hoy termina sin recapitular.
8. **Fuera del deck.** La sección «Clase 1» de `lectura.es.md` está desactualizada (conserva el restaurante y no tiene el backend); conviene regenerarla desde estos guiones o retirarla. Una pregunta de práctica sigue etiquetada con la diapositiva «restaurante», que ya no existe: reetiquetarla a «cliente-servidor» o retirarla.
