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
     Valores REFERENCIALES en UF por m² para el cálculo estructural.
     ⚠️ AJUSTA estos números a tus tarifas reales antes de publicar.
     El resultado se muestra siempre como un rango (±25%) y con el
     aviso de que no constituye una cotización formal.
  ------------------------------------------------------------- */
  ufValor: 39500,          // Valor de la UF en pesos (actualízalo cuando quieras)
  tarifaBase: {            // UF por m² — cálculo estructural
    vivienda:   0.20,
    ampliacion: 0.26,
    edificio:   0.15,
    industrial: 0.13,
    otro:       0.20
  },
  factorMaterial: {        // Multiplicador según material principal
    albanileria: 1.00,
    hormigon:    1.15,
    acero:       1.20,
    madera:      0.95,
    mixto:       1.10
  },
  minimoUF: 12             // Cobro mínimo referencial del servicio (UF)
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
const qChips = document.querySelectorAll('#cotizador .chip input');

const clp = n => '$' + Math.round(n).toLocaleString('es-CL');

function pintarSlider() {
  if (!qM2) return;
  const pct = ((qM2.value - qM2.min) / (qM2.max - qM2.min)) * 100;
  qM2.style.setProperty('--pct', pct + '%');
}

function serviciosCotizador() {
  return [...qChips].filter(c => c.checked);
}

function calcular() {
  if (!qTipo) return;

  const m2       = Number(qM2.value);
  const base     = CONFIG.tarifaBase[qTipo.value] ?? 0.2;
  const material = CONFIG.factorMaterial[qMat.value] ?? 1;
  const factorServicios = serviciosCotizador()
    .reduce((sum, c) => sum + Number(c.dataset.f), 0);

  if (qOut) qOut.textContent = m2.toLocaleString('es-CL');
  pintarSlider();

  if (factorServicios === 0) {
    qMin.textContent = '—';
    qMax.textContent = '';
    qUf.textContent  = 'Selecciona al menos un servicio.';
    return;
  }

  // Economía de escala: el valor por m² baja en proyectos grandes.
  const escala = m2 > 300 ? Math.pow(300 / m2, 0.18) : 1;

  let uf = m2 * base * material * factorServicios * escala;
  uf = Math.max(uf, CONFIG.minimoUF);

  const ufMin = uf * 0.85;
  const ufMax = uf * 1.25;

  qMin.textContent = clp(ufMin * CONFIG.ufValor);
  qMax.textContent = clp(ufMax * CONFIG.ufValor);
  qUf.textContent  = `Equivalente a ${ufMin.toFixed(1)} – ${ufMax.toFixed(1)} UF aprox.`;
}

[qTipo, qMat, qM2, ...qChips].forEach(el => {
  el?.addEventListener('input', calcular);
  el?.addEventListener('change', calcular);
});
calcular();

/* Botón del cotizador: precarga el formulario con lo seleccionado */
document.getElementById('q-send')?.addEventListener('click', () => {
  const m2Field = document.getElementById('f-m2');
  if (m2Field && qM2) m2Field.value = qM2.value;

  const mapaTipo = {
    vivienda: 'Vivienda unifamiliar',
    ampliacion: 'Ampliación o remodelación',
    edificio: 'Edificio / multifamiliar',
    industrial: 'Nave industrial / bodega',
    otro: 'Otro'
  };
  const tipoField = document.getElementById('f-tipo');
  if (tipoField && qTipo) tipoField.value = mapaTipo[qTipo.value] ?? '';

  const elegidos = serviciosCotizador().map(c => c.value);
  document.querySelectorAll('#requestForm input[name="servicio"]').forEach(chk => {
    // "Cálculo estructural" del cotizador ↔ "Cálculos estructurales" del formulario
    chk.checked = elegidos.some(v => chk.value.startsWith(v.replace(/s$/, '')));
  });
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
