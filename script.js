(() => {
  const form = document.getElementById('signup-form');
  const message = document.getElementById('form-message');
  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = form.querySelector('.submit-label');
  const menuToggle = document.querySelector('.menu-toggle');
  const header = document.querySelector('.site-header');

  menuToggle.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  document.querySelectorAll('.desktop-nav a').forEach(link => link.addEventListener('click', () => {
    header.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `form-message visible ${type}`;
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.className = 'form-message';
    const data = new FormData(form);
    const nombre = String(data.get('nombre') || '').trim();
    const correo = String(data.get('correo') || '').trim().toLowerCase();
    const perfil = String(data.get('perfil_empresa') || '').trim();
    const necesidad = String(data.get('necesidad') || '').trim();
    const interes = String(data.get('interes') || '').trim();
    const consentimiento = document.getElementById('consentimiento').checked;

    if (nombre.length < 2) { showMessage('Escribe tu nombre completo (mínimo 2 caracteres).', 'error'); document.getElementById('nombre').focus(); return; }
    if (!validEmail(correo)) { showMessage('Revisa el correo electrónico e inténtalo nuevamente.', 'error'); document.getElementById('correo').focus(); return; }
    if (!perfil || !necesidad || !interes) { showMessage('Completa todos los campos obligatorios.', 'error'); return; }
    if (!consentimiento) { showMessage('Necesitamos tu consentimiento para registrar la inscripción.', 'error'); document.getElementById('consentimiento').focus(); return; }

    const config = window.BIOGESTION_CONFIG || {};
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      showMessage('El formulario está diseñado, pero todavía falta conectar Supabase. Configura supabaseUrl y supabaseAnonKey en config.js para guardar inscripciones.', 'info');
      return;
    }

    const url = config.supabaseUrl.replace(/\/+$/, '');
    submitButton.disabled = true;
    submitLabel.textContent = 'Enviando…';
    try {
      const response = await fetch(`${url}/rest/v1/beta_signups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.supabaseAnonKey,
          'Authorization': `Bearer ${config.supabaseAnonKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          nombre, correo, perfil_empresa: perfil, necesidad, interes, consentimiento
        })
      });
      if (!response.ok) {
        let detail = '';
        try { const body = await response.json(); detail = body.message || body.error || ''; } catch (_) {}
        throw new Error(detail || `Respuesta del servidor (${response.status})`);
      }
      form.reset();
      showMessage('¡Gracias por tu interés! Tu inscripción se guardó correctamente. Te contactaremos cuando haya novedades sobre la beta.', 'success');
    } catch (error) {
      console.error('Error al registrar inscripción:', error);
      showMessage('No pudimos guardar tu inscripción en este momento. Verifica tu conexión e inténtalo más tarde.', 'error');
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = 'Solicitar acceso a la beta';
    }
  });
})();
