# Wwise Objects

*Explicación del diagrama de clasificación*

Wwise por adentro funciona con una base de datos de los elementos que el usuario crea para configurar su proyecto. Cada ítem enlistado en esta base de datos es un **Wwise Object**. Ese es el término usado para los objetos que el usuario puede crear en Wwise Authoring Tool (el editor).

Los Wwise Objects principalmente son los objetos que se encuentran en el view Project Explorer. Cada vez que creas algo dentro del Project Explorer, estás creando un Wwise Object. Por ejemplo: sonidos, buses, property containers, work units, etc.

Algunos tipos de objetos no van a ser encontrados dentro del Project Explorer, sino dentro de otros views especializados. Pero de esos no hablaremos ahora.

Todos los objetos tienen un nombre, tipo, id, hijos, propiedades y referencias. Dependiendo del tipo de objeto, tienen distintas propiedades. Estas propiedades pueden ser editadas desde distintos views específicos para cada tipo de objeto. Pero también todos los objetos pueden ser editados desde el view Property Editor.

En el Project Explorer, los distintos tipos de Wwise Object están agrupados en pestañas. Pero la clasificación que se abstrae de las distintas pestañas, a pesar de ser útil, a mi criterio puede ser mejorada para facilitar el aprendizaje.

La finalidad del diagrama mostrado en la diapositiva de la clase de Wwise Objects es clasificar los diferentes Wwise Objects de una manera que nos facilite el aprendizaje. La explico a continuación.

> Diapositiva del diagrama | https://www.diablohumastudio.com/es/learn/wwise-unreal/wwise-objects?s=2&p=5

## SoundBanks

Al finalizar nuestro proyecto y querer usarlo en el juego, tendremos que exportarlo. Lo exportamos para poder integrarlo al entregable del juego (el proyecto exportado al que “damos doble clic”, se abre y jugamos).

Al entregable del juego se le integra el motor que se encargará de procesar el audio en función de toda la configuración del proyecto (nuestro proyecto exportado).

Este “proyecto exportado” son los **SoundBanks**. Son como una lista de otros Wwise Objects y archivos de audio.

SoundBanks está en plural porque podemos exportar solo lo que queramos y por partes. Podemos tener uno o varios SoundBanks con los Wwise Objects que queramos.

Esto nos permite, desde el juego, cargar cada SoundBank a memoria cuando lo queramos. Por ejemplo, al abrir el juego podemos cargar solo la música y efectos de sonido que corresponden a los menús, dejando la música y efectos de sonido del juego en sí para cargarlos cuando ya demos clic en “Jugar”.

En el editor de Wwise, para configurar los SoundBanks está el view SoundBank Manager. Ahí vamos a configurar qué Wwise Objects va a contener tal SoundBank, y para qué plataforma y en qué idioma queremos exportar. Entonces le vamos a dar clic en Generar y se crearán los SoundBanks donde nosotros lo hayamos configurado.

## Game Inputs

Este grupo lo hago para representar los Wwise Objects que sirven para comunicarse con el juego.

Al momento de instalar un plugin, el plugin lee todos los Wwise Objects de este tipo y los “expone” en la interfaz del editor del motor del juego. Por “exponer” me refiero a que añade elementos que nos permiten, desde el juego, “llamarlos”. Por ejemplo, puede ser que cree un asset de Unreal que podamos usar para configurar un bloque de un Blueprint.

Cuando este tipo de Wwise Objects son “llamados”, estos hacen que el motor Wwise haga “algo”. Por ejemplo, si añadimos un bloque de Blueprint en Unreal de tipo PostEvent y lo configuramos con un Evento que hemos creado para hacer sonar una canción, dicha canción sonará.

Los Game Inputs pueden ser **Eventos** o **Game Syncs**.

Los Eventos, al ser llamados, ejecutan una lista de acciones que hayamos configurado en dicho Evento. Hay muchos tipos de acciones, como Play, Stop, Pause, etc. Y estas acciones tienen que tener un Wwise Object sobre el que se ejecutan.

Por ejemplo, podemos crear un Evento que se llame ReproducirCancionEstridenteEvent y tener una acción de tipo Play apuntando a un Wwise Object de tipo Music Segment que tiene adentro una canción estridente.

Son usados principalmente para activar cosas que pueden ser definidas por Sí o No. O sea: reproducir, parar, aplicar filtro. Estas acciones no tienen muchos valores, solo “está activada” o “no está activada”.

Los Game Syncs, por otro lado, se usan para manipular propiedades de Wwise Objects que tienen muchos valores. Unos ejemplos de esto serían: cambiar la canción que se está reproduciendo a la tercera canción de la lista, o subir el volumen a 85/100.

## Contenido

Este grupo lo hago para representar los objetos “que se reproducen”. Sobre estos objetos es que se aplican los Game Syncs y las acciones de los Eventos.

Todos los elementos de Contenido tienen que tener configurado un bus al que van a ser direccionados para ser reproducidos.

Y estos a su vez tienen dos clasificaciones. La primera divide los elementos que contienen directamente los archivos de audio, y los elementos que agrupan a varios de estos. A los que contienen directamente el audio los llamé **Sonido**. A los que contienen varios Wwise Objects de Sonido los llamé de **Estructura**. Esta nomenclatura también la utiliza la documentación oficial de Wwise.

La segunda clasificación interna de Contenido es según si su uso es para **Música** o **SFX**.

Y fuera de estas clasificaciones también están los que sirven para voces, y los que agrupan independientemente de música o SFX (carpetas virtuales o property containers).

## Mixing y Routing

Este grupo lo hago para representar a los **buses**.

Los buses son elementos que simbolizan una consola de mezcla de audio. O sea, a esta se le conectan elementos de Contenido. Y está conectada al equipo físico que reproduce la información, como parlantes o controles que vibran.

Al momento de reproducirse los elementos de Contenido que están conectados a un bus, dicho bus les manipula el volumen y efectos, y pasa esta señal de audio manipulada a los equipos físicos.

Los buses pueden, en vez de llegar directamente a los equipos físicos, entrar a su vez a otro bus. Pero eventualmente esos buses llegarán al bus principal (o a los buses que sirven para parlantes secundarios o controles vibratorios) y sonarán.

## Procesamiento

Por último, en este grupo he puesto los Wwise Objects que sirven para manipular la señal de audio. O sea, aplicar efectos haciendo que el sonido cambie.

Estos se pueden aplicar directamente a los Wwise Objects de Contenido o a los buses.

Aplicar a los buses es útil cuando queremos modificar el sonido de varias cosas a la vez. Por ejemplo, si entramos al agua queremos que la música esté filtrada, pero los SFX también.

Aplicar directamente al Contenido es útil cuando queremos que un sonido concreto cambie.
