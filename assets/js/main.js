/* ============================================================
   MG INGENIERÍA — Interacción del sitio
   ------------------------------------------------------------
   ⚙️  CONFIGURACIÓN: edita este bloque y todo el sitio se ajusta.
   ============================================================ */

const CONFIG = {
  // Número de WhatsApp en formato internacional, SIN "+" ni espacios.
  whatsapp: '56996761602',
  email: 'ingenieria.mg25@gmail.com',

  /* ---- Cotizador estimativo ----------------------------------
     Precios base en pesos, tomados de la tabla de tarifas 2026.
     Cada fila es un tramo de superficie; el orden de los precios
     sigue al de MATERIALES.

     Este archivo lo puede abrir cualquiera desde el navegador, así
     que aquí van solo los precios base que ya se le cotizan al
     cliente. Nada de uso interno.
  ------------------------------------------------------------- */

  // La UF se consulta sola a mindicador.cl (API pública, sin registro).
  // Este número solo se usa si la consulta falla; conviene refrescarlo
  // de vez en cuando para que el respaldo no quede muy viejo.
  ufValor: 40844.79,
  ufApi: 'https://mindicador.cl/api/uf',

  materiales: ['sip', 'metalcon', 'albanileria', 'piedra', 'hormigon', 'acero', 'mixto'],

  // Proyectos habitacionales y similares
  habitacional: [
    { hasta:  30, precios: [ 450000,  500000,  560000,  560000,  650000,  620000,  700000] },
    { hasta:  60, precios: [ 580000,  650000,  720000,  720000,  850000,  820000,  950000] },
    { hasta:  99, precios: [ 700000,  780000,  860000,  860000, 1000000,  960000, 1150000] },
    { hasta: 120, precios: [ 780000,  850000,  920000,  920000, 1100000, 1050000, 1250000] },
    { hasta: 160, precios: [ 900000,  990000, 1080000, 1080000, 1300000, 1250000, 1500000] },
    { hasta: 220, precios: [1100000, 1200000, 1320000, 1320000, 1600000, 1550000, 1850000] },
    { hasta: 300, precios: [1350000, 1480000, 1620000, 1620000, 1950000, 1900000, 2250000] },
    { hasta: 400, precios: [1650000, 1800000, 1950000, 1950000, 2350000, 2350000, 2700000] },
    { hasta: 500, precios: [1950000, 2100000, 2300000, 2300000, 2750000, 2800000, 3200000] }
  ],

  // Ampliaciones de vivienda (tabla propia, solo bajo 100 m²)
  ampliacion: [
    { hasta:  30, precios: [ 450000,  500000,  560000,  560000,  650000,  620000,  700000] },
    { hasta:  60, precios: [ 650000,  720000,  800000,  800000,  950000,  900000, 1050000] },
    { hasta:  99, precios: [ 820000,  920000, 1020000, 1020000, 1200000, 1150000, 1350000] }
  ],

  // Adicionales que se calculan como porcentaje del proyecto, con mínimo
  adicionales: {
    eett:       { pct: 0.08, minimo: 120000 },
    cubicacion: { pct: 0.12, minimo: 180000 }
  },

  // El precio de tabla es el piso; el rango mostrado se abre hacia arriba
  // para dejar espacio a alcance, antecedentes y condiciones de cada obra.
  holgura: 0.25
};

/* ============================================================
   1. Navegación móvil
   ============================================================ */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle?.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});

navMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

/* Sombra del header + enlace activo según la sección visible */
const header   = document.querySelector('.site-header');
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];

const onScroll = () => {
  header?.classList.toggle('scrolled', window.scrollY > 20);

  let current = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ============================================================
   2. Animación de aparición al hacer scroll
   ============================================================ */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

/* ============================================================
   2b. El sketch estructural se dibuja solo
   ------------------------------------------------------------
   Cada trazo lleva data-p con su etapa de obra. Se dibuja en el
   orden real de construcción: terreno, zapatas, pilares del 1er
   nivel, vigas y losa, pilares del 2º, losa, cubierta, vanos y
   por último las cotas.
   ============================================================ */
const sketch = document.querySelector('.sketch');

// Segundo en que arranca cada etapa
const ETAPAS = [0, 0.5, 1.2, 2.0, 2.8, 3.5, 4.2, 4.8, 5.3];

/* Los trazos usan vector-effect:non-scaling-stroke, así que el patrón de
   guiones se mide en píxeles de pantalla, mientras que getTotalLength()
   devuelve unidades del viewBox. Esta es la razón entre ambos. */
function escalaSketch() {
  const vb = sketch?.viewBox?.baseVal;
  const ancho = sketch?.getBoundingClientRect().width;
  return (vb?.width && ancho) ? ancho / vb.width : 1;
}

function dibujarSketch() {
  if (!sketch) return;

  const trazos = [...sketch.querySelectorAll('.sk')];
  const textos = [...sketch.querySelectorAll('.sk-txt')];
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (quieto) {
    trazos.forEach(t => { t.style.strokeDasharray = ''; t.style.strokeDashoffset = ''; });
    textos.forEach(t => { t.style.opacity = '1'; });
    return;
  }

  // 1. Estado inicial: cada trazo oculto, todavía sin transición
  const cuenta = {};
  const espera = new Map();

  trazos.forEach(el => {
    const etapa = Number(el.dataset.p) || 0;
    cuenta[etapa] = (cuenta[etapa] || 0) + 1;

    // Pequeño desfase dentro de la etapa: se siente trazado a mano
    espera.set(el, ETAPAS[etapa] + cuenta[etapa] * 0.022);

    let largo = 0;
    try { largo = el.getTotalLength(); } catch { largo = 0; }

    el.style.transition = 'none';
    if (largo) {
      // El trazo se escala con el SVG, así que el patrón de guiones se mide
      // en píxeles de pantalla: hay que llevar el largo a esa misma escala.
      const l = largo * escalaSketch() + 1;
      el.style.strokeDasharray  = l;
      el.style.strokeDashoffset = l;
    } else {
      el.style.opacity = '0';           // navegador sin getTotalLength
    }
  });

  textos.forEach(t => { t.style.transition = 'none'; t.style.opacity = '0'; });

  // 2. Forzar el recálculo para que el navegador registre ese estado inicial.
  //    Sin esto, el salto al valor final ocurre sin animación.
  void sketch.getBoundingClientRect();

  // 3. Estado final: ahora sí, con transición y su retardo por etapa
  trazos.forEach(el => {
    const d = espera.get(el);
    if (el.style.strokeDasharray) {
      el.style.transition = `stroke-dashoffset .8s cubic-bezier(.45,.05,.35,1) ${d}s`;
      el.style.strokeDashoffset = '0';
    } else {
      el.style.transition = `opacity .5s ease ${d}s`;
      el.style.opacity = '1';
    }
  });

  textos.forEach((t, i) => {
    t.style.transition = `opacity .7s ease ${ETAPAS[8] + 0.3 + i * 0.14}s`;
    t.style.opacity = '1';
  });
}

// Se dibuja al cargar y se vuelve a dibujar si el visitante regresa arriba
if (sketch && 'IntersectionObserver' in window) {
  let dentro = false;
  new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (e.isIntersecting && !dentro) { dentro = true; dibujarSketch(); }
      else if (!e.isIntersecting) { dentro = false; }
    });
  }, { threshold: 0.3 }).observe(sketch);
} else {
  dibujarSketch();
}

/* ============================================================
   3. Año dinámico en el footer
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   4. Cotizador estimativo
   ============================================================ */
const qTipo = document.getElementById('q-tipo');
const qMat  = document.getElementById('q-material');
const qM2   = document.getElementById('q-m2');
const qOut  = document.getElementById('q-m2-out');
const qMin  = document.getElementById('q-min');
const qMax  = document.getElementById('q-max');
const qUf   = document.getElementById('q-uf');
const qEett = document.getElementById('q-eett');
const qCub  = document.getElementById('q-cub');
const qSep  = document.querySelector('.quoter-value .sep');

const clp = n => '$' + Math.round(n).toLocaleString('es-CL');
const aDecena = n => Math.ceil(n / 10000) * 10000;   // redondeo a la decena de mil

function pintarSlider() {
  if (!qM2) return;
  const pct = ((qM2.value - qM2.min) / (qM2.max - qM2.min)) * 100;
  qM2.style.setProperty('--pct', pct + '%');
}

/* Precio base de tabla: primer tramo cuyo tope cubre la superficie.
   Devuelve null si la obra queda fuera de tabla (se cotiza caso a caso). */
function precioBase(tipo, m2, material) {
  const tabla = CONFIG[tipo];
  const col = CONFIG.materiales.indexOf(material);
  if (!tabla || col < 0) return null;

  const tramo = tabla.find(t => m2 <= t.hasta);
  return tramo ? tramo.precios[col] : null;
}

function fueraDeTabla(mensaje) {
  qMin.textContent = 'A convenir';
  qMax.textContent = '';
  if (qSep) qSep.style.display = 'none';
  qUf.textContent = mensaje;
}

function calcular() {
  if (!qTipo) return;

  const m2 = Number(qM2.value);
  if (qOut) qOut.textContent = m2.toLocaleString('es-CL');
  pintarSlider();

  const base = precioBase(qTipo.value, m2, qMat.value);

  if (base === null) {
    fueraDeTabla(qTipo.value === 'ampliacion'
      ? 'Las ampliaciones sobre 99 m² las cotizamos caso a caso. Escríbenos y te respondemos con un valor cerrado.'
      : 'Sobre 500 m² el valor depende mucho del proyecto. Cuéntanos los detalles y te cotizamos.');
    return;
  }

  if (qSep) qSep.style.display = '';

  // Adicionales: porcentaje del proyecto, respetando su mínimo
  let total = base;
  const { eett, cubicacion } = CONFIG.adicionales;
  if (qEett?.checked) total += Math.max(base * eett.pct, eett.minimo);
  if (qCub?.checked)  total += Math.max(base * cubicacion.pct, cubicacion.minimo);

  const min = total;
  const max = aDecena(total * (1 + CONFIG.holgura));

  const enUf = v => (v / CONFIG.ufValor)
    .toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  qMin.textContent = clp(min);
  qMax.textContent = clp(max);
  qUf.textContent  = `Equivalente a ${enUf(min)} – ${enUf(max)} UF aprox.`;
}

[qTipo, qMat, qM2, qEett, qCub].forEach(el => {
  el?.addEventListener('input', calcular);
  el?.addEventListener('change', calcular);
});
calcular();

/* ============================================================
   4b. Valor de la UF, al día
   ------------------------------------------------------------
   Se consulta mindicador.cl (API pública chilena, sin registro).
   El resultado se guarda para el resto del día, así una segunda
   visita no vuelve a pedirlo. Si la consulta falla —sin internet,
   servicio caído— se usa CONFIG.ufValor y se avisa en pantalla.
   ============================================================ */
const qFuente = document.getElementById('q-fuente');

const soloFecha = d => d.toISOString().slice(0, 10);

function mostrarUF(valor, fecha, enVivo) {
  CONFIG.ufValor = valor;
  calcular();
  if (!qFuente) return;

  const monto = valor.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  qFuente.classList.toggle('en-vivo', Boolean(enVivo));
  qFuente.textContent = enVivo
    ? `UF de hoy: $${monto} · ${fecha}`
    : `UF de referencia: $${monto} (no se pudo consultar el valor de hoy)`;
}

function leerCache() {
  try {
    const c = JSON.parse(localStorage.getItem('mg_uf') || 'null');
    return c && c.dia === soloFecha(new Date()) ? c : null;
  } catch { return null; }
}

async function cargarUF() {
  const cache = leerCache();
  if (cache) { mostrarUF(cache.valor, cache.fecha, true); return; }

  try {
    const r = await fetch(CONFIG.ufApi, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);

    const dato = (await r.json())?.serie?.[0];
    if (!dato || !Number.isFinite(dato.valor)) throw new Error('respuesta inesperada');

    const fecha = new Date(dato.fecha).toLocaleDateString('es-CL');
    try {
      localStorage.setItem('mg_uf',
        JSON.stringify({ dia: soloFecha(new Date()), valor: dato.valor, fecha }));
    } catch { /* modo privado: seguimos igual, solo sin recordar */ }

    mostrarUF(dato.valor, fecha, true);
  } catch {
    mostrarUF(CONFIG.ufValor, null, false);
  }
}
cargarUF();

/* Botón del cotizador: precarga el formulario con lo seleccionado */
document.getElementById('q-send')?.addEventListener('click', () => {
  const m2Field = document.getElementById('f-m2');
  if (m2Field && qM2) m2Field.value = qM2.value;

  const mapaTipo = {
    habitacional: 'Vivienda unifamiliar',
    ampliacion: 'Ampliación o remodelación'
  };
  const tipoField = document.getElementById('f-tipo');
  if (tipoField && qTipo) tipoField.value = mapaTipo[qTipo.value] ?? '';

  // El proyecto estructural del cotizador cubre cálculo y planos
  document.querySelectorAll('#requestForm input[name="servicio"]').forEach(chk => {
    if (chk.value === 'Cálculos estructurales' || chk.value === 'Planos estructurales') {
      chk.checked = true;
    }
  });

  // Materialidad y adicionales elegidos viajan en la descripción
  const msg = document.getElementById('f-msg');
  if (msg && !msg.value.trim()) {
    const extras = [qEett?.checked && 'especificaciones técnicas',
                    qCub?.checked && 'cubicación de materiales'].filter(Boolean);
    msg.value = `Proyecto de ${qM2.value} m² en ${qMat.options[qMat.selectedIndex].text.toLowerCase()}.`
      + (extras.length ? ` Necesito además ${extras.join(' y ')}.` : '');
  }
});

/* Enlaces "Solicitar este servicio" de las tarjetas */
document.querySelectorAll('.card-cta[data-servicio]').forEach(link => {
  link.addEventListener('click', () => {
    const nombre = link.dataset.servicio;
    document.querySelectorAll('#requestForm input[name="servicio"]').forEach(chk => {
      if (chk.value === nombre) chk.checked = true;
    });
  });
});

/* ============================================================
   5. Formulario de solicitud
   ============================================================ */
const form   = document.getElementById('requestForm');
const status = document.getElementById('formStatus');

const setError = (key, msg) => {
  const p = document.querySelector(`.error[data-for="${key}"]`);
  if (p) p.textContent = msg || '';
  const input = document.getElementById(key);
  if (input) input.classList.toggle('invalid', Boolean(msg));
};

function serviciosElegidos() {
  return [...document.querySelectorAll('#requestForm input[name="servicio"]:checked')]
    .map(c => c.value);
}

function validar() {
  let ok = true;
  ['f-nombre', 'f-fono', 'f-email', 'f-msg', 'f-ok', 'servicio'].forEach(k => setError(k, ''));

  const nombre = document.getElementById('f-nombre').value.trim();
  const fono   = document.getElementById('f-fono').value.trim();
  const email  = document.getElementById('f-email').value.trim();
  const msg    = document.getElementById('f-msg').value.trim();
  const acepta = document.getElementById('f-ok').checked;

  if (nombre.length < 3) { setError('f-nombre', 'Escribe tu nombre completo.'); ok = false; }

  const digitos = fono.replace(/\D/g, '');
  if (digitos.length < 8) { setError('f-fono', 'Ingresa un teléfono válido.'); ok = false; }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    setError('f-email', 'Revisa el formato del correo.'); ok = false;
  }

  if (serviciosElegidos().length === 0) {
    setError('servicio', 'Selecciona al menos un servicio.'); ok = false;
  }

  if (msg.length < 15) { setError('f-msg', 'Cuéntanos un poco más (mínimo 15 caracteres).'); ok = false; }
  if (!acepta) { setError('f-ok', 'Necesitamos tu autorización para responderte.'); ok = false; }

  // Trampa anti-spam: si un bot rellena el campo oculto, no enviamos nada.
  if (document.getElementById('f-web').value !== '') ok = false;

  if (!ok) {
    status.className = 'form-status err';
    status.textContent = 'Revisa los campos marcados para continuar.';
    document.querySelector('#requestForm .invalid, #requestForm .error:not(:empty)')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return ok;
}

function resumen() {
  const val = id => document.getElementById(id).value.trim();
  const partes = [
    '*NUEVA SOLICITUD DE SERVICIO — MG Ingeniería*',
    '',
    `*Nombre:* ${val('f-nombre')}`,
    `*Teléfono:* ${val('f-fono')}`,
    val('f-email')  ? `*Correo:* ${val('f-email')}`     : null,
    val('f-comuna') ? `*Comuna:* ${val('f-comuna')}`    : null,
    '',
    `*Servicios:* ${serviciosElegidos().join(', ')}`,
    val('f-tipo')   ? `*Tipo de obra:* ${val('f-tipo')}` : null,
    val('f-m2')     ? `*Superficie:* ${val('f-m2')} m²`  : null,
    val('f-plazo')  ? `*Plazo:* ${val('f-plazo')}`       : null,
    val('f-planos') ? `*Planos de arquitectura:* ${val('f-planos')}` : null,
    '',
    '*Descripción del proyecto:*',
    val('f-msg'),
    '',
    `_Enviado desde el sitio web · ${new Date().toLocaleString('es-CL')}_`
  ];
  return partes.filter(p => p !== null).join('\n');
}

/* --- Enviar por WhatsApp --- */
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validar()) return;

  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(resumen())}`;
  window.open(url, '_blank', 'noopener');

  status.className = 'form-status ok';
  status.textContent = '✓ Abrimos WhatsApp con tu solicitud lista. Solo presiona enviar en la conversación.';
});

/* --- Enviar por correo --- */
document.getElementById('btnMail')?.addEventListener('click', () => {
  if (!validar()) return;

  const asunto = `Solicitud de servicio — ${document.getElementById('f-nombre').value.trim()}`;
  const cuerpo = resumen().replace(/\*/g, '').replace(/_/g, '');
  window.location.href =
    `mailto:${CONFIG.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

  status.className = 'form-status ok';
  status.textContent = '✓ Abrimos tu programa de correo con la solicitud lista para enviar.';
});

/* --- Copiar resumen al portapapeles --- */
document.getElementById('btnCopy')?.addEventListener('click', async () => {
  if (!validar()) return;

  const texto = resumen().replace(/\*/g, '');
  try {
    await navigator.clipboard.writeText(texto);
    status.className = 'form-status ok';
    status.textContent = '✓ Resumen copiado. Ya puedes pegarlo donde lo necesites.';
  } catch {
    status.className = 'form-status err';
    status.textContent = 'No se pudo copiar automáticamente. Selecciona el texto manualmente.';
  }
});

/* Limpia el error de "servicios" apenas el visitante marca uno */
document.querySelectorAll('#requestForm input[name="servicio"]').forEach(chk => {
  chk.addEventListener('change', () => {
    if (serviciosElegidos().length) setError('servicio', '');
  });
});
