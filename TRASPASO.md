# Traspaso del sitio a MG Ingeniería

Guía para que MG Ingeniería quede como dueña del sitio y pueda seguir trabajándolo con su
propio asistente, sin depender de quien lo construyó.

**No hace falta instalar nada ni usar la consola.** Todo se hace desde el navegador.

---

## Primero, el panorama

"El sitio" no es una cosa: son tres, cada una con su propio dueño.

| | Qué es | Dónde está hoy | Hacia dónde va |
|---|---|---|---|
| **El código** | Los archivos de la página | Repositorio personal de quien lo construyó | Repositorio propio de MG Ingeniería |
| **El hosting** | Quién publica la página en internet | GitHub Pages, gratis | El mismo servicio, desde el repositorio nuevo |
| **El dominio** | `mgingenieria.cl` | NIC Chile, con DNS en Cloudflare | Sigue igual; solo cambia a dónde apunta |

Todo es gratis salvo el dominio, que cuesta lo que cobre NIC Chile al año (del orden de
$10.000). No hay suscripciones escondidas.

Hay **dos personas** en esta guía. Cada paso dice quién lo hace:

- **ENCARGADA** — quien queda a cargo del sitio en MG Ingeniería
- **ENTREGA** — quien construyó el sitio y lo está entregando

---

## Lo que hay que tener a mano antes de partir

**ENCARGADA:**

- La cuenta de GitHub de MG Ingeniería: **`ingenieriamg25-create`**. Ya está creada.
  Hay que entrar a github.com y confirmar que se puede iniciar sesión.
- **El correo de esa cuenta tiene que estar verificado.** GitHub no deja publicar un sitio
  si no lo está. Si al entrar aparece un aviso amarillo pidiendo verificar el correo, hay
  que hacerlo ahora: es un clic en un enlace que GitHub manda por correo. Dejar esto para
  después es la forma más típica de quedarse pegado a mitad de camino.
- Usar **Chrome o Edge**. El paso de subir archivos arrastrándolos no funciona bien en
  otros navegadores.

**ENTREGA:**

- El archivo `mg-ingenieria-web.zip` con el sitio, para enviárselo a la encargada.
- Acceso a la cuenta de Cloudflare donde está el DNS del dominio.
- Acceso al repositorio antiguo `imboqqentt/codigos`.

> Si ya se creó un repositorio `mg-ingenieria-web` en la cuenta personal en un intento
> anterior, conviene **borrarlo** antes de empezar, para no confundirse después. Se borra en
> *Settings → Danger Zone → Delete this repository*.

---

## Parte 1 — El repositorio

### Paso 1 · ENTREGA: enviar el sitio

Enviarle a la encargada el archivo `mg-ingenieria-web.zip` por correo o WhatsApp.

### Paso 2 · ENCARGADA: descomprimir

Guardar el `.zip` en el escritorio, hacer clic derecho → *Extraer todo*.

Queda una carpeta llamada `mg-ingenieria-web`. **Hay que abrirla y mirar qué tiene adentro.**
Debe verse así:

```
index.html          assets  (carpeta)      CNAME
README.md           CLAUDE.md              TRASPASO.md
construir.py        mg-ingenieria.html
```

Si en vez de eso aparece *otra* carpeta llamada `mg-ingenieria-web`, hay que entrar en esa.
Lo que importa es llegar al nivel donde se ve `index.html`.

> De paso: `mg-ingenieria.html` se puede abrir con doble clic ahora mismo. Es el sitio
> completo en un solo archivo y funciona sin internet. Sirve para ver qué se está recibiendo.

### Paso 3 · ENCARGADA: crear el repositorio

En github.com, con la sesión de `ingenieriamg25-create` iniciada, ir a
**github.com/new** y llenar:

- **Repository name:** `mg-ingenieria-web`
- **Public** ← tiene que ser público. GitHub Pages gratis no publica repositorios privados.
- **No marcar nada más.** Ni *Add a README file*, ni *.gitignore*, ni *license*.

Botón **Create repository**.

> Lo de no marcar nada es importante. Si se marca el README, el repositorio nace con un
> archivo adentro y el paso siguiente se complica. Si ya pasó, se borra el repositorio y se
> crea de nuevo.

### Paso 4 · ENCARGADA: subir los archivos

Queda una pantalla con instrucciones y comandos. **Hay que ignorar todos esos comandos.**

Buscar el enlace que dice **uploading an existing file** y hacer clic. (También se llega
desde *Add file → Upload files*.)

Ahora, abrir la carpeta `mg-ingenieria-web` en el explorador de archivos, **seleccionar todo
lo que está adentro** (Ctrl+E, o Ctrl+A dentro de la carpeta) y arrastrarlo a la zona de
GitHub que dice *Drag files here*.

Lo que se arrastra es el **contenido** de la carpeta, no la carpeta misma. GitHub va a
mostrar la lista de archivos, incluida la carpeta `assets` con sus subcarpetas.

Antes de confirmar, verificar que en la lista aparezcan:

- `index.html`
- `CNAME` ← el más fácil de olvidar y sin él el dominio no funciona
- `assets/css/styles.css`
- `assets/js/main.js`
- las cuatro imágenes de `assets/img/`

Abajo, en el cuadro de mensaje, escribir: `Sitio web MG Ingenieria`

Botón verde **Commit changes**.

Con eso el repositorio ya es de MG Ingeniería y tiene el sitio completo. La parte que podía
fallar quedó atrás.

---

## Parte 2 — Publicar el sitio

Acá hay un orden que **no se puede alterar**: el dominio solo puede estar activo en un sitio
de GitHub Pages a la vez. Primero hay que soltarlo, después tomarlo.

Entre el paso 5 y el 8 el sitio puede quedar caído o mostrando advertencia de seguridad.
Suele ser entre quince minutos y un par de horas. **Conviene hacer esta parte un día de poca
actividad, y con las dos personas disponibles al mismo tiempo**, no cada una por su lado.

### Paso 5 · ENTREGA: soltar el dominio

En `github.com/imboqqentt/codigos` → *Settings* → *Pages*.

En el campo **Custom domain** borrar `mgingenieria.cl` y guardar.

*(Acá parte la ventana en que el sitio está abajo. Avisarle a la encargada que ya puede
seguir.)*

### Paso 6 · ENCARGADA: activar Pages

En el repositorio nuevo → *Settings* → en el menú de la izquierda, *Pages*.

- **Source:** *Deploy from a branch*
- **Branch:** `main`, carpeta `/ (root)`
- **Save**

### Paso 7 · ENCARGADA: poner el dominio

En la misma pantalla, en **Custom domain**, escribir `mgingenieria.cl` y guardar.

GitHub va a revisar el DNS. Puede aparecer un aviso naranja de *DNS check in progress* o
similar: es normal, se resuelve solo en unos minutos.

### Paso 8 · ENTREGA: corregir el registro de `www`

Este es el paso que se olvida y después nadie entiende por qué `www` no funciona.

En Cloudflare → el dominio `mgingenieria.cl` → *DNS*.

Buscar el registro **CNAME** llamado `www`. Hoy apunta a `imboqqentt.github.io`, que es la
cuenta antigua. Hay que editarlo y dejarlo apuntando a:

```
ingenieriamg25-create.github.io
```

El resto de los registros **no se tocan**. Las cuatro direcciones A son de GitHub y son las
mismas para todos los sitios:

| Tipo | Nombre | Valor | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153` | DNS only (nube gris) |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `ingenieriamg25-create.github.io` | DNS only |

> El proxy tiene que quedar **desactivado** (nube gris, no naranja). Si Cloudflare se pone en
> medio, GitHub no logra emitir el certificado de seguridad.

### Paso 9 · ENCARGADA: esperar el candado

GitHub emite solo el certificado de seguridad, pero se demora: desde unos minutos hasta
alrededor de una hora. Mientras tanto el navegador puede mostrar advertencia. Es normal.

Cuando en *Settings → Pages* la casilla **Enforce HTTPS** deje de estar gris, hay que
marcarla. Ahí termina esta parte.

---

## Cómo saber que quedó bien

Con el navegador, en una ventana de incógnito para no ver versiones guardadas:

- `https://mgingenieria.cl` abre el sitio, con candado y sin advertencias
- `http://mgingenieria.cl` (sin la *s*) redirige solo a la versión con candado
- El cotizador muestra la UF del día de hoy, no un valor de respaldo
- El botón verde de WhatsApp abre una conversación con el número correcto
- El formulario de solicitud arma el mensaje y ofrece WhatsApp, correo y copiar

En *Settings → Pages* del repositorio nuevo tiene que decir, en verde, que el sitio está
publicado en `https://mgingenieria.cl`.

---

## Parte 3 — El dominio (se puede dejar para después)

Las partes 1 y 2 dejan el sitio funcionando y en manos de MG Ingeniería. Lo que sigue es
ordenar la propiedad del dominio. **No es urgente y no afecta que la página esté en línea**,
pero conviene no dejarlo pendiente para siempre.

### El titular en NIC Chile

`mgingenieria.cl` está inscrito a nombre de quien lo compró. Para que quede a nombre de MG
Ingeniería hay que hacer el **cambio de titularidad** en nic.cl, con la sesión iniciada en la
cuenta que hoy tiene el dominio. Es un trámite del registrador, no algo que se arregle por DNS.

Mientras no se haga, quien figura como titular es quien puede renovarlo o transferirlo.

**Lo que sí hay que resolver ya es la renovación.** Un dominio `.cl` vencido baja el sitio
completo y recuperarlo es engorroso. Hay que dejar anotada la fecha de vencimiento y, mejor
todavía, activar la renovación automática.

### El DNS en Cloudflare

Hoy el DNS lo maneja Cloudflare desde la cuenta de quien lo configuró. Para pasarlo a una
cuenta de MG Ingeniería:

1. Crear una cuenta en cloudflare.com (gratis).
2. *Add a site* → `mgingenieria.cl` → plan **Free**.
3. Cloudflare asigna **dos servidores de nombres propios**. Anotarlos.
4. Crear los cinco registros de la tabla del paso 8, tal cual, todos en *DNS only*.
5. En nic.cl, reemplazar los servidores de nombres del dominio por los dos nuevos.
6. Esperar. Cloudflare avisa por correo cuando la zona queda activa; suele ser menos de una
   hora, aunque formalmente puede tardar hasta 24.

Mientras tanto el sitio sigue funcionando con la configuración actual.

---

## Para el asistente de IA de la encargada

El repositorio incluye un archivo **`CLAUDE.md`**. Cualquier asistente lo lee solo al abrir
el proyecto y queda con el contexto completo: cómo está hecho el sitio, qué se puede cambiar
sin riesgo, qué partes son frágiles y qué no debe publicarse nunca.

No hay que explicarle nada más: basta con abrir el repositorio y pedirle lo que se necesite.

Vale la pena que la encargada lea ese archivo también, aunque no sea del área técnica. La
sección "Reglas que importan" es la que evita los errores caros.

---

## Lo que no se traspasa

- **La estructura interna de costos.** El documento de tarifas con márgenes, factores de
  ajuste y precios objetivo **nunca estuvo en el repositorio y no debe subirse**. El sitio
  publica solo los precios base que ya se le muestran al cliente, y entrega rangos, no cifras
  exactas. Es intencional: todo lo que está en el repositorio lo puede descargar cualquier
  visitante de la página.
- **Cuentas ni contraseñas.** No hay credenciales en el proyecto y no hace falta compartir
  ninguna: cada parte se traspasa creando cuentas propias.

## Lo que queda abierto

- **Correo con el dominio.** Hoy el contacto del sitio es una cuenta de Gmail. Pasar a algo
  como `contacto@mgingenieria.cl` requiere elegir proveedor (Google Workspace pagado, Zoho
  gratis, o reenvío de Cloudflare) y agregar registros MX, SPF, DKIM y DMARC. El dominio hoy
  no tiene ninguno. Conviene decidirlo **después** del traspaso, para configurarlo
  directamente en la cuenta de MG Ingeniería y no tener que migrarlo dos veces.
- **`www` sin certificado propio.** GitHub emite el certificado para `mgingenieria.cl` a
  secas, no para `www.mgingenieria.cl`. La dirección que conviene poner en tarjetas, firmas y
  redes sociales es `https://mgingenieria.cl`, **sin `www`**.
- **Ampliaciones sobre 99 m².** El cotizador muestra "A convenir" porque la tabla llega hasta
  ahí. Falta definir si deberían calcularse con la tabla habitacional.
