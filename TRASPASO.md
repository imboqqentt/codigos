# Traspaso del sitio a MG Ingeniería

Guía para entregar el sitio completo, de modo que MG Ingeniería quede como dueña de todo y
pueda seguir trabajándolo con su propio asistente, sin depender de quien lo construyó.

## Lo que se traspasa son tres cosas separadas

Es fácil pensar que "el sitio" es una sola cosa. En realidad son tres, cada una con su
propio dueño y su propio trámite:

| | Qué es | Dónde vive hoy | Cómo se traspasa |
|---|---|---|---|
| **El código** | Los archivos de la página | Repositorio de GitHub | Repositorio nuevo, transferido a la cuenta del cliente |
| **El hosting** | Quién sirve la página en internet | GitHub Pages, gratis | Se activa en el repositorio nuevo |
| **El dominio** | `mgingenieria.cl` | Registrado en NIC Chile, DNS en Cloudflare | Cambio de titular en NIC Chile + zona propia en Cloudflare |

Las tres son gratis o casi (el dominio cuesta lo que cobra NIC Chile al año, alrededor de
$10.000). No hay suscripciones escondidas.

## Antes de empezar, el cliente necesita

1. Una **cuenta de GitHub** (gratis, en github.com). Anota el nombre de usuario exacto.
2. Una **cuenta de Cloudflare** (gratis, en cloudflare.com).
3. Acceso a la **cuenta de NIC Chile** donde está inscrito el dominio, o disposición para
   hacer el cambio de titular.

Mientras se organiza todo eso, se le puede enviar de inmediato el archivo
`mg-ingenieria.html`: es el sitio completo en un solo archivo, se abre con doble clic y
funciona sin internet. Sirve para que vea exactamente qué está recibiendo.

---

## Parte 1 — El código

### Por qué no se transfiere el repositorio actual

El sitio vive hoy en el repositorio `imboqqentt/codigos`, que es un repositorio personal y
contiene además cosas que no tienen nada que ver (por ejemplo un programa de Arduino).
Transferirlo entero significaría entregarle al cliente material ajeno al encargo, y dejar a
quien lo construyó sin sus propios archivos.

Lo correcto es **crear un repositorio nuevo solo con el sitio** y transferir ese.

### Pasos

**1. Crear el repositorio nuevo** en github.com → New repository:

- Nombre: `mg-ingenieria-web`
- Visibilidad: público (GitHub Pages gratis requiere repositorio público)
- **Sin** README, sin .gitignore, sin licencia: tiene que quedar vacío

**2. Subir el sitio.** En la carpeta limpia que acompaña esta entrega:

```bash
git init
git add .
git commit -m "Sitio web MG Ingeniería"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/mg-ingenieria-web.git
git push -u origin main
```

**3. Transferir el repositorio al cliente.** En el repositorio nuevo:
*Settings → General → abajo del todo, Danger Zone → Transfer ownership*.
Se escribe el nombre de usuario de GitHub del cliente y se confirma.

El cliente recibe un correo y tiene que **aceptar la transferencia**. Hasta que la acepte,
no pasa nada.

> Alternativa: si el cliente prefiere crear él mismo el repositorio, que lo haga vacío y
> agregue a quien está haciendo la entrega como colaborador para subir los archivos. El
> resultado es el mismo.

---

## Parte 2 — El hosting

El dominio solo puede estar activo en **un** sitio de GitHub Pages a la vez. Por eso hay un
orden obligatorio: primero se suelta, después se toma.

**1. Soltar el dominio en el repositorio antiguo.**
En `imboqqentt/codigos` → *Settings → Pages* → borrar el contenido del campo *Custom
domain* y guardar. (Conviene además desactivar Pages ahí, ya que el sitio se va a servir
desde el repositorio nuevo.)

**2. Activar Pages en el repositorio del cliente.**
En `mg-ingenieria-web` → *Settings → Pages* → *Source: Deploy from a branch* → rama `main`,
carpeta `/ (root)` → Save.

**3. Poner el dominio.**
En la misma pantalla, *Custom domain*: `mgingenieria.cl` → Save.

El archivo `CNAME` de la raíz ya trae el dominio escrito, así que lo más probable es que
GitHub lo reconozca solo. Ese archivo **no se borra nunca**: si desaparece, el sitio vuelve
a la dirección `*.github.io`.

**4. Esperar el certificado.**
GitHub emite el certificado HTTPS solo, pero se demora: desde unos minutos hasta una hora.
Mientras tanto la casilla *Enforce HTTPS* aparece gris y el navegador puede mostrar
advertencia de seguridad. Es normal y se arregla solo. Cuando la casilla se active, hay que
marcarla.

---

## Parte 3 — El dominio

### 3a. Cambio de titular en NIC Chile

El dominio `mgingenieria.cl` está inscrito a nombre de quien lo compró. Para que quede a
nombre de MG Ingeniería hay que hacer el **cambio de titularidad** en nic.cl, con la sesión
iniciada en la cuenta que hoy tiene el dominio. Es un trámite del registrador, no algo que
se resuelva por DNS.

Si el cliente prefiere no hacer el trámite por ahora, el sitio **igual funciona**: el
dominio queda a nombre de un tercero. No es lo ideal —quien figura como titular es quien
puede renovarlo o transferirlo— pero no es urgente para que la página esté en línea.

**Lo que sí hay que dejar claro es la fecha de renovación.** Un dominio `.cl` vencido baja
el sitio completo, y recuperarlo es engorroso. Conviene que el cliente lo tenga anotado y,
mejor aún, con renovación automática.

### 3b. La zona de Cloudflare

Hoy el DNS del dominio lo maneja Cloudflare, en la cuenta de quien lo configuró. Para que
el cliente sea dueño también de esto:

**1.** El cliente entra a su cuenta de Cloudflare → *Add a site* → escribe `mgingenieria.cl`
→ plan **Free**.

**2.** Cloudflare le va a asignar **dos servidores de nombres propios** (parecidos a los
actuales pero con otros nombres). Los tiene que anotar.

**3.** Crea estos registros en su zona nueva. Son exactamente los que están funcionando hoy:

| Tipo | Nombre | Valor | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153` | DNS only (nube gris) |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `USUARIO-DEL-CLIENTE.github.io` | DNS only |

> **Atención con el último.** Hoy ese registro apunta a `imboqqentt.github.io`, que es la
> cuenta actual. Cuando el repositorio cambie de dueño, hay que cambiarlo por el usuario de
> GitHub del cliente, o `www` deja de funcionar.

> Las cuatro direcciones A son de GitHub Pages y son las mismas para todos los sitios: no
> cambian con el traspaso. El proxy tiene que quedar **desactivado** (nube gris), porque si
> Cloudflare se pone en medio, GitHub no puede emitir el certificado.

**4.** En nic.cl, cambiar los servidores de nombres del dominio por los dos nuevos que
asignó Cloudflare.

**5.** Esperar la propagación. Cloudflare avisa por correo cuando la zona queda activa.
Suele ser menos de una hora, aunque formalmente puede tardar hasta 24.

---

## Orden recomendado y tiempos muertos

El traspaso implica una ventana en que el sitio puede quedar caído o con advertencia de
certificado. No es evitable: el dominio no puede estar en dos sitios de Pages a la vez. Es
corta, pero conviene hacerlo un día de poco movimiento y no un viernes a las 18:00.

1. Crear el repositorio nuevo y subir el sitio *(el sitio actual sigue funcionando)*
2. Transferirlo y que el cliente acepte *(sigue funcionando)*
3. El cliente arma su zona en Cloudflare, sin tocar todavía los servidores de nombres *(sigue funcionando)*
4. **Soltar el dominio en el repositorio antiguo y tomarlo en el nuevo** ← acá parte la ventana
5. Ajustar el CNAME de `www` al usuario nuevo
6. Cambiar los servidores de nombres en nic.cl
7. Esperar el certificado y marcar *Enforce HTTPS*

Del paso 4 al 7 pueden pasar entre quince minutos y un par de horas. Después queda igual
que antes.

## Cómo verificar que quedó bien

- `https://mgingenieria.cl` abre el sitio, con candado y sin advertencias
- `http://mgingenieria.cl` redirige solo a `https://`
- El cotizador muestra la UF del día, no el valor de respaldo
- El botón de WhatsApp abre una conversación con el número correcto
- El formulario arma el mensaje y ofrece WhatsApp, correo y copiar

En *Settings → Pages* del repositorio nuevo debe decir, en verde, que el sitio está
publicado en `https://mgingenieria.cl`.

## Para el asistente del cliente

El repositorio incluye un archivo **`CLAUDE.md`** escrito específicamente para esto: le
explica a cualquier asistente de IA cómo está hecho el sitio, qué es configurable, qué
partes son frágiles y qué no debe publicarse nunca. Basta con que el cliente abra el
repositorio con su asistente; no hay que explicarle nada más.

Vale la pena que el cliente lo lea también, aunque no sea técnico: la sección
"Reglas que importan" es la que evita los errores caros.

## Lo que no se traspasa

- **La estructura interna de costos.** El documento de tarifas con márgenes, factores de
  ajuste y precios objetivo **nunca estuvo en el repositorio y no debe subirse**. El sitio
  publica solo los precios base que ya se le muestran al cliente, y entrega rangos, no
  cifras exactas. Esto es intencional: todo lo que está en el repositorio lo puede
  descargar cualquier visitante.
- **Cuentas ni contraseñas.** No hay credenciales en el proyecto, y no hace falta compartir
  ninguna: cada parte se traspasa creando cuentas propias del cliente.

## Lo que queda abierto

- **Correo con el dominio.** Hoy el contacto del sitio es una cuenta de Gmail. Pasar a
  `contacto@mgingenieria.cl` requiere elegir proveedor (Google Workspace pagado, Zoho
  gratis, o reenvío de Cloudflare) y agregar registros MX, SPF, DKIM y DMARC. El dominio
  hoy no tiene ninguno, así que es partir de cero. Conviene decidirlo **después** del
  traspaso, para que se configure directamente en la cuenta del cliente.
- **`www` sin certificado propio.** GitHub emite el certificado para `mgingenieria.cl` a
  secas, no para `www.mgingenieria.cl`. La dirección que conviene poner en tarjetas, firmas
  y redes sociales es `https://mgingenieria.cl`, sin `www`.
- **Ampliaciones sobre 99 m².** El cotizador muestra "A convenir" porque la tabla llega
  hasta ahí. Falta definir si deberían calcularse con la tabla habitacional.
