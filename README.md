# MG Ingeniería — Sitio web

Sitio web de una sola página para **MG Ingeniería · Cálculo Estructural** (Curicó, Chile).
Es un sitio **estático**: solo HTML, CSS y JavaScript. No necesita servidor, base de datos ni
instalar nada. Funciona abriendo `index.html` en cualquier navegador.

## Contenido

```
index.html              Toda la página
assets/css/styles.css   Estilos (colores, tipografías, diseño responsivo)
assets/js/main.js       Interacción: formulario, cotizador, menú, animaciones
assets/img/logo.svg     Logo MG reconstruido en vectores (se ve nítido a cualquier tamaño)
assets/img/favicon.svg  Ícono de la pestaña del navegador
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

## Qué debes ajustar antes de publicar

Todo lo configurable está al inicio de `assets/js/main.js`, en el bloque `CONFIG`:

```js
whatsapp: '56996761602',              // sin "+" ni espacios
email:    'ingenieria.mg25@gmail.com',
ufValor:  40844.79,                   // solo respaldo: la UF se consulta sola
tarifaBase: { vivienda: 0.20, ... },  // UF por m² de cada tipo de proyecto
factorMaterial: { hormigon: 1.15, ... },
minimoUF: 12,                         // cobro mínimo referencial
ufApi: 'https://mindicador.cl/api/uf'
```

### El valor de la UF se actualiza solo

El cotizador consulta la UF del día a **mindicador.cl**, una API pública chilena
gratuita y sin registro. Bajo el resultado aparece una etiqueta con el valor y la fecha
usados, para que el visitante sepa con qué se calculó.

El valor se guarda en el navegador por el resto del día, así una segunda visita no vuelve
a pedirlo. Si la consulta falla —sin internet o servicio caído— se usa el número de
`ufValor` y la etiqueta avisa que es un valor de referencia. Conviene refrescar ese número
de vez en cuando para que el respaldo no quede muy viejo.

> **Importante:** las tarifas del cotizador son valores de ejemplo. **Reemplázalas por tus tarifas
> reales antes de publicar el sitio.** El resultado siempre se muestra como un rango y con el aviso
> de que no constituye una cotización formal, pero aun así conviene que los números sean tuyos.

Otros datos que quizás quieras cambiar:

| Qué | Dónde |
|---|---|
| Textos, servicios, preguntas frecuentes | `index.html` |
| Horario de atención | `index.html`, sección Contacto y bloque de datos estructurados al final |
| Colores | `assets/css/styles.css`, variables `--navy-*` y `--gold*` al inicio |
| Dirección web real | etiqueta `<link rel="canonical">` en `index.html` |

## Cómo publicarlo

**Opción 1 — GitHub Pages (gratis).** En el repositorio: *Settings → Pages → Source: Deploy from a
branch*, elige la rama `main` y la carpeta `/ (root)`. En unos minutos queda en línea.

**Opción 2 — Netlify o Vercel (gratis).** Arrastra la carpeta del proyecto a netlify.com/drop.
Permiten conectar un dominio propio (por ejemplo `mgingenieria.cl`).

**Opción 3 — Hosting propio.** Sube los archivos por FTP a la carpeta pública del servidor.

Para ver el sitio en tu computador antes de publicarlo, basta con abrir `index.html` con doble clic.

## Detalles técnicos

- Diseño responsivo: se adapta a celular, tablet y escritorio.
- Accesibilidad: navegación por teclado, textos alternativos, contraste alto y respeto por la
  preferencia del sistema de *reducir animaciones*.
- SEO: metaetiquetas, Open Graph para redes sociales y datos estructurados `ProfessionalService`
  para que Google entienda el negocio, la ubicación y los servicios.
- Sin dependencias ni frameworks. Lo único externo es la tipografía Montserrat de Google Fonts;
  si no carga, el sitio usa una tipografía de sistema equivalente.
