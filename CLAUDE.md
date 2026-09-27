# Contexto para el agente

Sitio web de **MG Ingeniería · Cálculo Estructural** (Curicó, Región del Maule, Chile).
Publicado en **https://mgingenieria.cl**.

Este archivo existe para que cualquier agente que tome el proyecto entienda en un minuto
cómo está hecho y qué no conviene romper. Si vas a cambiar algo, lee primero la sección
"Reglas que importan".

## Qué es

Una sola página estática. **HTML, CSS y JavaScript a mano, sin frameworks y sin paso de
compilación.** Se abre `index.html` en el navegador y funciona. No hay `package.json`, no
hay `npm install`, no hay servidor.

Esto es una decisión, no una carencia: el sitio lo mantiene una oficina de ingeniería, no
un equipo de desarrollo. Cualquier cosa que agregue una cadena de herramientas (build,
bundler, framework) hace el proyecto más frágil para quien lo hereda. Si algo parece pedir
React, casi siempre la respuesta correcta es que no.

## Mapa de archivos

```
index.html              Toda la página: portada, valores, servicios, proceso,
                        cotizador, formulario, preguntas frecuentes, contacto
assets/css/styles.css   Estilos. Los colores y medidas son variables CSS en :root
assets/js/main.js       Comportamiento. El bloque CONFIG del inicio manda sobre todo
assets/img/logo-mg.png          Monograma MG, fondo transparente (cabecera)
assets/img/logo-mg-lockup.png   Logo completo con texto (pie de página)
assets/img/favicon.png          Ícono de pestaña
assets/img/og.jpg               Imagen para redes sociales, 1200×630
CNAME                   El dominio, para GitHub Pages. No borrar
construir.py            Arma mg-ingenieria.html (versión de un solo archivo)
mg-ingenieria.html      Generado. No se edita a mano: se regenera con construir.py
README.md               Explicación para el dueño del sitio, no para el agente
```

## Cómo trabajar

Ver el sitio: abrir `index.html` con doble clic, o `python3 -m http.server` en la raíz.

Después de tocar `index.html`, `styles.css`, `main.js` o cualquier imagen, regenerar la
versión de un solo archivo:

```bash
python3 construir.py
```

`construir.py` incrusta CSS, JS e imágenes como data URI. Falla a propósito si queda
alguna ruta local sin incrustar, así que si revienta es porque agregaste un asset nuevo
y hay que revisar.

Commits en español, en imperativo, describiendo el cambio de cara al negocio
("Cotizador con las tarifas reales") y no el detalle técnico ("fix main.js").

## Lo configurable

Casi todo lo que el dueño querría cambiar está en el bloque `CONFIG` al inicio de
`assets/js/main.js`: WhatsApp, correo, tablas de precios del cotizador, adicionales y la
holgura del rango. Si te piden cambiar un precio o un dato de contacto, ese es el lugar.

Ojo: el correo y el WhatsApp **también** están escritos en `index.html` (tarjetas de
contacto, pie de página, botón flotante y el bloque JSON-LD del final). Cambiar solo
`CONFIG` deja el sitio inconsistente. Son cuatro o cinco lugares; búscalos con grep antes
de dar por hecho el cambio.

Los colores viven en `:root` de `styles.css` (`--navy-*`, `--gold*`). La tipografía es
Montserrat desde Google Fonts, con respaldo de sistema si no carga.

## Reglas que importan

**1. Nada de uso interno en el repositorio.**
La oficina tiene un documento interno de tarifas con su estructura de márgenes: factores
de ajuste, criterios de recargo y precios objetivo. **Ese documento no está en el
repositorio y no debe subirse, ni siquiera en un comentario.** En el sitio van únicamente
los precios base que ya se le muestran al cliente.

Esto no es paranoia: `assets/js/main.js` lo descarga cualquiera que abra la página. Todo
lo que escribas ahí es público, no solo lo que se ve en pantalla. Si te piden "hacer el
cotizador más exacto" usando esos factores, la respuesta es no, y hay que decirlo: el
cotizador entrega un **rango referencial** a propósito, y el ajuste fino se hace en la
conversación con el cliente.

Por la misma razón el cotizador cubre solo proyectos habitacionales y ampliaciones. Las
consultas de estructura industrial, torres de acero y acceso vehicular se canalizan por el
formulario.

**2. La animación del sketch de la portada es delicada.**
El sketch estructural se dibuja solo, por etapas, siguiendo el orden real de obra: terreno,
zapatas, pilares, vigas y losa, segundo nivel, cubierta y al final las cotas. Los 112
trazos son elementos `.sk` con un atributo `data-p` que dice en qué etapa entran.

El truco está en `main.js`: para que el navegador anime, hay que fijar el estado inicial
**sin transición**, forzar un reflujo leyendo `getBoundingClientRect()`, y recién entonces
aplicar la transición y el valor final. Si quitas esa lectura "inútil" del medio, el
navegador junta los dos estados y la animación no ocurre: el sketch aparece ya dibujado.
Ya pasó una vez. No la borres pensando que es código muerto.

El grosor de los trazos usa `vector-effect: non-scaling-stroke`, así que el patrón de
guiones se mide en píxeles de pantalla y no en unidades del viewBox. Por eso existe
`escalaSketch()`.

Si el sistema pide reducir animaciones (`prefers-reduced-motion`), el sketch se muestra
completo de inmediato. Eso es correcto. Si estás probando con un navegador sin interfaz,
ese es el modo por omisión y vas a creer que la animación está rota: hay que pedir
explícitamente `reducedMotion: 'no-preference'`.

**3. El formulario no tiene servidor.**
Al enviarlo, arma un mensaje ordenado y ofrece tres caminos: abrir WhatsApp con el texto
escrito, abrir el correo del visitante, o copiar el resumen. No hay backend, no hay base de
datos, no se guarda nada. Valida los campos obligatorios y frena robots con un campo oculto.

Si algún día se quiere recibir las solicitudes por correo automáticamente, eso sí necesita
un servicio externo (Formspree, Netlify Forms o similar) y hay que conversarlo con el
dueño, no resolverlo por cuenta propia.

**4. La UF se consulta sola.**
El cotizador pide la UF del día a `mindicador.cl` (API pública chilena, sin registro ni
llave). El valor se guarda en el navegador por el resto del día. Si la consulta falla, usa
`CONFIG.ufValor` como respaldo y la etiqueta avisa que es un valor de referencia. Conviene
refrescar ese número de vez en cuando para que el respaldo no quede muy viejo.

**5. Probar en anchos reales.**
El sitio está verificado sin desborde horizontal de 320 a 1920 px. Hay puntos de quiebre
pensados: 1080 px para el menú móvil y 430 px para la grilla de valores. Si cambias la
maquetación, revisa esos anchos antes de dar por buena la modificación.

## Dónde está publicado

GitHub Pages, sirviendo la rama principal desde la raíz. El archivo `CNAME` con el dominio
tiene que seguir existiendo en la raíz: si se borra, Pages vuelve a la dirección
`*.github.io` y el dominio deja de funcionar.

El DNS está en Cloudflare: registros A del ápice hacia las direcciones de GitHub Pages y un
CNAME para `www`. El certificado HTTPS lo emite GitHub.

Detalle conocido: GitHub emite certificado para el dominio a secas, no para `www`, así que
`https://www.mgingenieria.cl` muestra advertencia de certificado. La dirección que hay que
compartir es **https://mgingenieria.cl** sin `www`.

## Cosas pendientes o abiertas

- **Correo con el dominio.** Quedó conversado pero no implementado. Hoy el contacto es una
  cuenta de Gmail. Pasar a `contacto@mgingenieria.cl` requiere elegir proveedor (Google
  Workspace, Zoho gratis o reenvío de Cloudflare) y agregar registros MX, SPF, DKIM y DMARC
  en Cloudflare. Hoy el dominio no tiene ningún registro MX ni TXT.
- **Ampliaciones sobre 99 m².** Hoy muestran "A convenir" porque la tabla de ampliaciones
  llega hasta ahí. Falta decidir si deberían caer en la tabla habitacional.
- **Logo para fondos claros.** El logo actual es claro sobre oscuro y desaparece en blanco.
  Si alguna sección nueva tiene fondo claro, hace falta una variante.
