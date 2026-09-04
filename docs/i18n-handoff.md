# Localización (es / en) — propuesta y handoff

Estado (2026-09-04): **todas las fases hechas**, incluida `/courses`. Nada pendiente del plan; lo que sigue es que el usuario corrija el copy en español propuesto por Claude (una línea por texto en `src/i18n/` y en los `.dict.tsx`). Desviación respecto al plan: como los cuatro decks recibieron diccionario en el mismo paso, no existe el campo `locales` por clase ni la nota "esta clase está en español" (5.4/L2): el tipo `Dictionary` obliga a tener ambos idiomas, y el título de cada clase en el registro también es por idioma. Las reglas de los diccionarios de deck viven en `docs/learn-courses-and-slides.md` y en `reglas-de-estilo.md` del curso; este documento queda como registro de decisiones.

Quien retome esto: leer primero `CLAUDE.md`, `docs/css-and-nextjs-conventions.md` y `docs/learn-courses-and-slides.md`. Cada ítem de abajo se propone y se aprueba por separado antes de implementarse, y va en su propio commit (`<type>(<scope>): <summary>`, scope `I18n` para la infraestructura y el scope de la página para el copy).

## 1. Situación actual

- Sitio de marketing en **inglés** (`/`, `/courses`, `/nvc-game`, `/video-production`, `/contact`) con `<Html lang="en">` fijo en `src/pages/_document.tsx`.
- Sección de clases `/learn` en **español** (chrome y contenido de los slides).
- Páginas sueltas no enlazadas: `/fernandobarahonad_portfolio`, `/gameplay-largo`, `/icca-pitch-2026`.
- Sin ninguna infraestructura de idiomas: no hay `i18n` en `next.config.js`, no hay diccionarios, no hay `hreflang`.
- Textos en API: `src/pages/api/contact.ts` (mensajes de respuesta y correo). Revisar en qué idioma están antes de la fase 2.

## 2. Vocabulario

- **Chrome**: el marco de la interfaz que se repite en todas las páginas y no es contenido: header, nav, footer, botones, labels de formularios, mensajes de error, hints de navegación, títulos de pestaña. En `/learn` es el header con los dropdowns "Curso" / "Clase", el botón de pantalla completa, "Clase no encontrada", "Ir a la última clase", "Diapositiva anterior / siguiente", el hint "← → · espacio".
- **Copy de marketing**: el texto propio de cada página promocional (hero, beneficios, CTAs).
- **Contenido de clases**: los slides. Tienen el texto dentro de SVG con coordenadas ajustadas a mano al largo de la frase en español. Traducirlos no es trabajo de i18n sino de rehacer cada slide.

## 3. Cómo se elige el idioma (respuesta a "¿la gente de países hispanohablantes lo verá en español?")

Next.js 14 (Pages Router) trae enrutado de idiomas nativo. Con esto en `next.config.js`:

```js
i18n: {
  locales: ['en', 'es'],
  defaultLocale: 'en',
  // localeDetection: true es el valor por defecto
},
```

pasa lo siguiente:

1. **URLs por idioma.** El idioma por defecto queda sin prefijo (`/courses`) y el otro con prefijo (`/es/courses`). `next/link` y `router.push` añaden el prefijo solos según el idioma activo, y `useRouter().locale` dice cuál es. Mientras se navega por enlaces internos, la URL sostiene el idioma elegido sin necesidad de cookie.
2. **Detección automática, por idioma del navegador, no por país.** Next lee el header `Accept-Language` que envía el navegador. No mira la IP ni el país: alguien en Bogotá con el navegador en inglés ve inglés; alguien en Berlín con el navegador en español ve español. Decisión tomada: **nunca por país**.
3. **La detección solo actúa en `/`.** Una URL sin prefijo (`/courses`) se trata como elección explícita del inglés y no se redirige, igual que `/es/courses` es elección explícita del español. Decisión tomada (D8): **se acepta este comportamiento nativo, sin middleware**. Quien llegue por un enlace directo en inglés y quiera español usa el selector; y quien comparte un enlace normalmente ya lo comparte en el idioma en que lo está viendo. Casos, con el navegador en español:
   - Entra a `/` → Next lo manda a `/es`.
   - Entra a `/courses` por un enlace directo → ve inglés; cambia con el selector si quiere.
   - Está en `/es` y navega → todos los enlaces internos van con `/es/...`.
   - Elige inglés con el selector → va a `/courses` y sigue en inglés mientras navega.
4. **La elección explícita.** Dentro de una visita vive en la URL (punto 1). Entre visitas solo puede recordarse con la cookie `NEXT_LOCALE`, que el selector escribe al hacer clic (`document.cookie`, un año, `SameSite=Lax`, `path=/`); `next/link` no la escribe solo. Next la lee en la detección de `/` y la prefiere sobre `Accept-Language`. No existe alternativa sin cookie ni almacenamiento del navegador: el servidor no tiene otra memoria del visitante.
5. **Sin cookies.** Si el navegador las bloquea o un futuro aviso de cookies no se acepta, no hay error: escribir la cookie falla en silencio, cada entrada a `/` vuelve a detectar por navegador y la navegación interna sigue respetando la URL. `NEXT_LOCALE` es una cookie funcional, no de rastreo: bajo las normas de consentimiento cuenta como estrictamente necesaria y puede escribirse sin aceptación. Un aviso de cookies futuro no debe bloquearla.
6. **Buscadores.** Googlebot no suele mandar `Accept-Language`, así que ve el inglés en las URLs sin prefijo y el español en `/es/...`; los `hreflang` (ítem I3) le dicen que son la misma página en dos idiomas.

## 4. Decisiones (tomadas el 2026-09-04)

| # | Decisión | Resuelto | Nota |
|---|---|---|---|
| D1 | Idioma por defecto (sin prefijo) | `en` | Todas las URLs actuales siguen iguales; el español entra como `/es/...`. |
| D2 | Mecanismo de traducción | Diccionarios propios tipados, sin librería | Ver 5.1. |
| D3 | `/learn` en inglés | Queda para después, pero **no** como decks aparte: cada deck tendrá su propio diccionario y los textos de los SVG saldrán de él (ver 5.5). Mientras un deck no tenga diccionario, se muestra en español en ambos idiomas. | El usuario quiere además revisar las frases en español; se hace en el mismo paso de extracción. |
| D4 | Páginas sueltas (`portfolio`, `gameplay-largo`, `icca-pitch-2026`) | Un solo idioma, sin diccionario | One-offs no enlazados. |
| D5 | Quién escribe el copy en español | Claude propone, el usuario corrige | Voz de marca, no traducción literal. |
| D6 | Detección | Por navegador y por elección explícita; nunca por país | Ver sección 3. |
| D7 | Memoria de la elección | Cookie `NEXT_LOCALE` (no hay alternativa sin cookie) | Funcional, exenta de consentimiento. |
| D8 | Enlaces directos a páginas interiores sin prefijo | Comportamiento nativo de Next: abren en inglés, sin middleware | Quien quiera español usa el selector; los enlaces compartidos suelen ir ya en el idioma de quien los comparte. |

## 5. Diseño técnico

### 5.1 Diccionarios

Carpeta nueva `src/i18n/`:

```
src/i18n/
  locales.ts        // type Locale = 'en' | 'es'; DEFAULT_LOCALE; isLocale()
  useT.ts           // hook: useT(dict) → dict[router.locale]
  common.ts         // chrome compartido: header, footer, 404, selector
  learn.ts          // chrome de /learn
  pages/
    home.ts
    courses.ts
    contact.ts
    videoProduction.ts
    nvcGame.ts
```

Forma de cada diccionario (tipado por la versión `en`, así el compilador exige todas las claves en `es`):

```ts
const en = {
  navCourses: 'Courses',
  navContact: 'Contact',
} as const;

const es: Record<keyof typeof en, string> = {
  navCourses: 'Cursos',
  navContact: 'Contacto',
};

export const commonDict = { en, es };
```

Uso en un componente:

```tsx
const t = useT(commonDict);
<Link href="/courses">{t.navCourses}</Link>
```

`useT` lee `useRouter().locale`, cae a `DEFAULT_LOCALE` si viene indefinido (páginas sin i18n, tests) y devuelve el objeto del idioma. Sin interpolación ni plurales: si un texto necesita variables, se escribe como función en el diccionario (`greeting: (name: string) => ...`).

### 5.2 Selector de idioma

Componente `src/components/LanguageSwitch.tsx` con su CSS Module. Renderiza un `Link` a la misma ruta (`router.asPath`) con la prop `locale` del otro idioma, y en `onClick` escribe la cookie `NEXT_LOCALE` (`document.cookie = 'NEXT_LOCALE=<locale>; path=/; max-age=31536000; SameSite=Lax'`). Se coloca en `Header.tsx` y en `LearnLayout.tsx` (a la derecha, junto al botón de pantalla completa).

No hay middleware (D8): la detección es la nativa de Next, solo en `/`.

### 5.3 `<html lang>` y `hreflang`

- `_document.tsx` pasa a leer el idioma de la petición: `<Html lang={this.props.__NEXT_DATA__.locale ?? 'en'}>` (requiere `class Document extends NextDocument` para tener `props`, o el patrón funcional con `getInitialProps`).
- Componente `src/components/Alternates.tsx` que emite `<link rel="alternate" hreflang="en|es|x-default">` para la ruta actual, incluido en `Layout.tsx` dentro de `Head`. Sin esto Google trata `/es/...` como duplicado. Necesita la URL absoluta del sitio: constante `SITE_URL` en `src/i18n/locales.ts` (o env var).

### 5.4 Sección `/learn`

- `LearnClass` gana `locales: Locale[]` (los idiomas en los que el deck tiene diccionario; hoy `['es']` en todos). El registro no cambia de forma.
- `LearnLayout` y `Deck` usan `learnDict` para sus textos. `Deck` pone `lang` en su contenedor con el idioma en que se muestra el deck (el activo si está en `locales`, si no el primero de la lista), para que el `<html lang>` no mienta sobre el contenido.
- Cuando el idioma activo no está en `locales`, el header de `/learn` muestra una nota discreta ("Esta clase está en español" / "This class is in Spanish"). Pequeño, en `LearnLayout.module.css`.
- `src/pages/learn/index.tsx`: el redirect de `getServerSideProps` debe conservar el idioma: `destination: \`${locale === DEFAULT_LOCALE ? '' : '/' + locale}${classPath(...)}\``. Hoy no lo hace.
- El redirect `/incine/:path*` en `next.config.js`: con `i18n` activo Next lo aplica también a `/es/incine/...` por defecto. Verificarlo con curl en la fase 1; si no, añadir `locale: false` y una segunda regla con prefijo.

### 5.5 Diccionarios dentro de los decks (cómo se traduce un slide)

Un diccionario es un objeto con los textos por idioma; traducir es reemplazar cada literal por su clave. Dentro de un SVG funciona igual que en un párrafo, porque el SVG es JSX:

```tsx
// antes
<text x="615" y="46" fontSize="12" fill="#63b6a4">ESTANTERÍAS</text>
// después
<text x="615" y="46" fontSize="12" fill="#63b6a4">{t.estanterias}</text>
```

Reglas para los decks:

- Un diccionario por deck en un archivo hermano `<slug>.dict.ts` con la misma forma que en 5.1 (`es` es la versión que tipa, porque el contenido nace en español; `en: Record<keyof typeof es, string>`). El componente del deck hace `const t = useT(dict)` y lo pasa a las funciones de rótulos (`RotulosBiblioteca({ t })`, etc.). La geometría (`EscenaBiblioteca`, coordenadas, marcadores) no se toca.
- Van al diccionario: `h1`/`h2` (con la parte en ámbar como clave aparte, porque es un `span`), eyebrows, `figcaption`, `aria-label` de cada SVG, cada `<text>`, y los labels de la barra lateral (`label` del `Slide`). El `z` no.
- **Largo parecido**: elegir en el otro idioma palabras y frases con un número de caracteres similar (margen orientativo: 15 %). Cuando no se pueda, ajustar con `textAnchor` (`middle` o `end` absorben la diferencia hacia un lado) antes que mover coordenadas. Si un texto cambia de largo en más de eso, se revisa el slide en el navegador en ambos idiomas.
- Se hace deck por deck, y en el mismo paso se revisan las frases en español: al leerlas todas juntas en el diccionario es cuando se corrigen (D3, D5).
- `reglas-de-estilo.md` no se traduce, pero gana una sección corta con estas reglas cuando se haga el primer deck.

## 6. Fases e ítems

Cada ítem sigue el formato problema / fix / archivos. Un commit por ítem.

### Fase 1 — Infraestructura (scope `I18n`, ~medio día)

**I1. Activar el enrutado de idiomas.**
Problema: no existe noción de idioma. Fix: `i18n` en `next.config.js` (D1), `src/i18n/locales.ts` y `useT.ts`, `<Html lang>` dinámico. Archivos: `next.config.js`, `src/i18n/locales.ts`, `src/i18n/useT.ts`, `src/pages/_document.tsx`.
Verificación: `npm run build`; curl a `/` con `Accept-Language: es` devuelve 307 a `/es`; con `en` devuelve 200; `/es/courses` renderiza; `/incine/x` y `/es/incine/x` redirigen a `/learn`.

**I2. Selector de idioma en el header del sitio.**
Problema: sin selector, la única forma de cambiar de idioma es editar la URL. Fix: `LanguageSwitch` en `Header.tsx`, escribiendo la cookie en el clic. Archivos: `src/components/LanguageSwitch.tsx`, `LanguageSwitch.module.css`, `src/components/Header.tsx`.
Verificación: al cambiar, la cookie `NEXT_LOCALE` aparece y volver a `/` respeta la elección aunque el navegador esté en el otro idioma; con cookies bloqueadas, el cambio sigue funcionando mientras se navega y `/` vuelve a detectar por navegador en la siguiente visita (comportamiento esperado, sin errores en consola).

**I3. `hreflang` y alternates.**
Problema: dos URLs con el mismo contenido en distinto idioma sin declararse. Fix: `Alternates.tsx` en `Layout.tsx`, `SITE_URL`. Archivos: `src/components/Alternates.tsx`, `src/components/Layout.tsx`, `src/i18n/locales.ts`.

### Fase 2 — Chrome y copy de marketing (scope por página, 1–2 días; el tiempo es de redacción)

**M1. Chrome compartido**: `Header`, `Footer`, 404 (crear `src/pages/404.tsx` si se quiere traducido). Diccionario `common.ts`.
**M2. `/` (index)**: `pages/home.ts`. 72 líneas de JSX, poco texto.
**M3. `/courses`**: `pages/courses.ts`. Hero, tres pasos, dos CTAs. El `<title>` también.
**M4. `/video-production`**: `pages/videoProduction.ts`.
**M5. `/nvc-game`**: `pages/nvcGame.ts`. Es la página más larga (282 líneas) y tiene el modal de descarga: revisar sus textos de confirmación.
**M6. `/contact`**: `pages/contact.ts` para labels, placeholders y mensajes de validación; además revisar `src/pages/api/contact.ts` para que el correo y las respuestas de error salgan en el idioma del formulario (enviar `locale` en el body del POST).

Regla para todos: los `alt` de imágenes también van al diccionario; los `<title>` de `Head` también. Nada de textos sueltos en JSX.

### Fase 3 — Chrome de `/learn` (scope `Learn`, ~medio día)

**L1. Diccionario `learn.ts`** y uso en `LearnLayout` ("Curso", "Clase", pantalla completa, "Clase no encontrada", "Ir a la última clase"), `Deck` (aria-labels de los botones, hint "← → · espacio") y la nota de idioma de la clase.
**L2. `locales` por clase en el registro** y `lang` en el contenedor del deck; redirect de `/learn` conservando idioma. Archivos: `src/data/learn.ts`, `src/components/learn/Deck.tsx`, `src/pages/learn/index.tsx`, `docs/learn-courses-and-slides.md`.
**L3. Selector de idioma en `LearnLayout`** reutilizando `LanguageSwitch` (el módulo CSS del switch debe funcionar sobre el tema oscuro de learn; si no, variante por prop).

### Fase 4 — Diccionario por deck (después; un ítem por deck, ~1 día cada uno con revisión visual en ambos idiomas)

Mecanismo en 5.5. Por cada deck: **D-<slug>**. Problema: los textos del deck están en literales dentro del JSX y el SVG, solo en español, y varias frases quieren revisión. Fix: extraer todo a `<slug>.dict.ts` (revisando el español en el paso), añadir `en` con frases de largo parecido, pasar `t` a los rótulos, marcar `locales: ['es', 'en']` en el registro. Archivos: `src/presentations/wwise-unreal/<slug>.tsx`, `<slug>.dict.ts`, `src/data/learn.ts`, `reglas-de-estilo.md` (solo en el primero).
Verificación: abrir cada slide en `/learn/...` y `/es/learn/...` y comparar; ningún rótulo debe salirse de su caja ni pisar una flecha.

Orden sugerido: `datos-programas-y-servidores` primero (es el que más frases por revisar tiene y el primero del curso), luego `que-es-un-motor-de-audio`, `wwise-por-adentro`, `el-editor-wwise`.

## 7. Verificación global al terminar cada fase

- `npx tsc --noEmit` y `npm run build` (cambia config y rutas).
- Abrir en el navegador: `/`, `/es`, `/courses`, `/es/courses`, `/learn`, `/es/learn`, `/contact` con envío de prueba en ambos idiomas.
- Con el navegador en español, entrar a `/` en ventana privada y comprobar la redirección a `/es`; cambiar con el selector y recargar `/`.
- Ver el `<html lang>` en el inspector en una página de cada idioma y en `/learn`.

## 8. Gotchas conocidos

- Con `i18n` activo, **todo** `Link`/`router.push` interno se prefija solo. No concatenar el idioma a mano salvo en redirects de servidor (`getServerSideProps`, `next.config.js`).
- `localeDetection` de Next solo actúa en `/`. Las páginas interiores sin prefijo abren en inglés a propósito (D8); no añadir middleware para "arreglarlo".
- `/en/...` responde 200 con la misma página que `/...` (comprobado en Next 14.2): es una URL duplicada. No enlazar nunca con `/en`; los `hreflang` apuntan siempre a la versión sin prefijo.
- `next/font` y los CSS Modules no cambian nada.
- El `<title>` de `[clase].tsx` viene del registro (título de la clase en español); se mantiene así por D3.
- `Accept-Language` puede traer `es-CO`, `es-419`, etc.; Next lo resuelve a `es` mientras `es` esté en `locales`.
- Los `alt` y `aria-label` de los slides van al diccionario del deck (fase 4), no a los de chrome.

## 9. Fuera de alcance

- Detección por país / geolocalización (D6).
- Traducir las páginas sueltas (D4).
- Traducir `reglas-de-estilo.md` y la documentación de `docs/`.
- Sitemap multi-idioma (no hay sitemap hoy).
- Aviso de aceptación de cookies: si se hace, `NEXT_LOCALE` queda fuera del consentimiento por ser funcional.
