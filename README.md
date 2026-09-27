# MG Ingeniería — Sitio web

Sitio web de una sola página para **MG Ingeniería · Cálculo Estructural** (Curicó, Chile).
En línea en **https://mgingenieria.cl**.

Es un sitio **estático**: solo HTML, CSS y JavaScript. No necesita servidor, base de datos ni
instalar nada. Funciona abriendo `index.html` en cualquier navegador.

## Contenido

```
index.html                       Toda la página
assets/css/styles.css            Estilos (colores, tipografías, diseño responsivo)
assets/js/main.js                Interacción: formulario, cotizador, menú, animaciones
assets/img/logo-mg.png           Monograma MG de la cabecera
assets/img/logo-mg-lockup.png    Logo completo del pie de página
assets/img/favicon.png           Ícono de la pestaña del navegador
assets/img/og.jpg                Imagen que se ve al compartir el sitio en redes
CNAME                            El dominio, para GitHub Pages. No borrar
construir.py                     Arma la versión de un solo archivo
mg-ingenieria.html               Versión de un solo archivo, para abrir sin internet
```

## Secciones

1. **Portada** — "Ingeniería que sostiene tus ideas", con un sketch estructural que se
   dibuja solo siguiendo el orden real de obra: terreno, zapatas, pilares, vigas y losa,
   segundo nivel, cubierta y por último las cotas
2. **Valores** — Precisión · Seguridad · Experiencia · Compromiso
3. **Servicios** — Cálculos estructurales, Planos estructurales, Supervisión técnica,
   Asesoría profesional, Optimización de recursos
4. **Proceso** — las 4 etapas del trabajo
5. **Cotizador estimativo** — entrega un rango referencial al instante
6. **Solicitud de servicio** — formulario que se envía por WhatsApp o correo
7. **Preguntas frecuentes**
8. **Contacto** — WhatsApp, correo, ubicación y horario
9. **Botón flotante de WhatsApp** siempre visible

## Cómo llegan las solicitudes

El formulario **no usa servidor**. Al enviarlo, arma un mensaje ordenado con todos los datos y ofrece
tres caminos:

- **Enviar por WhatsApp** — abre WhatsApp (Web o la app) con el mensaje escrito. El cliente solo
  presiona enviar y a ti te llega como una conversación normal.
- **Enviar por correo** — abre el programa de correo del visitante con el mensaje listo.
- **Copiar resumen** — copia el texto al portapapeles.

Antes de enviar, el formulario valida los campos obligatorios y bloquea envíos automáticos de robots
mediante un campo oculto (*honeypot*).

## Qué se puede ajustar

Todo lo configurable está al inicio de `assets/js/main.js`, en el bloque `CONFIG`:

```js
whatsapp: '56996761602',        // sin "+" ni espacios
email:    'ingenieria.mg25@gmail.com',
ufValor:  40844.79,             // solo respaldo: la UF se consulta sola
habitacional: [ ... ],          // tabla de precios por tramo y materialidad
ampliacion:   [ ... ],          // tabla propia, bajo 100 m²
adicionales:  { eett: {...}, cubicacion: {...} },
holgura: 0.25                   // cuánto se abre el rango hacia arriba
```

> El correo y el WhatsApp también aparecen escritos dentro de `index.html`: en las tarjetas de
> contacto, en el pie de página, en el botón flotante y en el bloque de datos estructurados del
> final. Si cambias uno, cámbialos todos.

Otros datos que quizás quieras cambiar:

| Qué | Dónde |
|---|---|
| Textos, servicios, preguntas frecuentes | `index.html` |
| Horario de atención | `index.html`, sección Contacto y bloque de datos estructurados al final |
| Colores | `assets/css/styles.css`, variables `--navy-*` y `--gold*` al inicio |

Después de cualquier cambio, regenera la versión de un solo archivo con `python3 construir.py`.

### Qué precios están publicados y cuáles no

El cotizador usa los **precios base** de la tabla de tarifas 2026 para proyectos
habitacionales y ampliaciones, más dos adicionales (especificaciones técnicas y cubicación
de materiales).

**Deliberadamente no incluye nada de uso interno**: ni factores de ajuste, ni criterios de
recargo, ni precios objetivo. Este archivo lo puede abrir cualquiera desde el navegador,
así que todo lo que se ponga en él queda público, no solo lo que se ve en pantalla.

Tampoco están las tablas de estructura industrial, torres de acero ni acceso vehicular:
esas consultas se canalizan por el formulario.

El resultado se muestra como **un rango que parte en el precio de tabla y se abre un 25%
hacia arriba** (`holgura`), nunca por debajo, para dejar espacio a alcance, antecedentes y
condiciones de cada obra. Fuera de tabla —sobre 500 m², o ampliaciones sobre 99 m²— muestra
"A convenir" e invita a escribir.

Las tarifas publicadas se revisaron una por una contra la tabla 2026. Cuando cambien los
precios, hay que actualizarlas en `CONFIG` y volver a publicar.

### El valor de la UF se actualiza solo

El cotizador consulta la UF del día a **mindicador.cl**, una API pública chilena
gratuita y sin registro. Bajo el resultado aparece una etiqueta con el valor y la fecha
usados, para que el visitante sepa con qué se calculó.

El valor se guarda en el navegador por el resto del día, así una segunda visita no vuelve
a pedirlo. Si la consulta falla —sin internet o servicio caído— se usa el número de
`ufValor` y la etiqueta avisa que es un valor de referencia. Conviene refrescar ese número
de vez en cuando para que el respaldo no quede muy viejo.

## Cómo está publicado

**GitHub Pages**, sirviendo la rama principal desde la raíz (*Settings → Pages → Deploy from a
branch*). El archivo `CNAME` de la raíz es el que le dice a Pages cuál es el dominio: si se
borra, el sitio vuelve a la dirección `*.github.io`.

El **DNS está en Cloudflare**, con los registros A del dominio apuntando a GitHub Pages y un
CNAME para `www`. El certificado HTTPS lo emite GitHub automáticamente.

> GitHub emite el certificado para `mgingenieria.cl` a secas, no para `www`. La dirección que
> conviene compartir en tarjetas, firmas y redes es **https://mgingenieria.cl**, sin `www`.

Para ver el sitio en tu computador antes de publicar un cambio, abre `index.html` con doble clic.

## Detalles técnicos

- Diseño responsivo: se adapta a celular, tablet y escritorio. Verificado de 320 a 1920 px.
- Accesibilidad: navegación por teclado, textos alternativos, contraste alto y respeto por la
  preferencia del sistema de *reducir animaciones*.
- SEO: metaetiquetas, Open Graph para redes sociales y datos estructurados `ProfessionalService`
  para que Google entienda el negocio, la ubicación y los servicios.
- Sin dependencias ni frameworks. Lo único externo es la tipografía Montserrat de Google Fonts;
  si no carga, el sitio usa una tipografía de sistema equivalente.

Si vas a trabajar el sitio con un asistente de IA, `CLAUDE.md` tiene el contexto técnico y las
advertencias de lo que conviene no romper.
