'use strict';

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Health check ──────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ── Contact form proxy ────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { nombre, email, telefono, servicio, mensaje } = req.body || {};

  // Strip HTML tags and limit length — prevents XSS / oversized payloads
  const clean = (val, max = 300) =>
    String(val ?? '')
      .replace(/<[^>]*>/g, '')
      .replace(/[<>"'`]/g, '')
      .trim()
      .slice(0, max);

  // Basic email validation
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(email, 200));
  if (!nombre || !emailOk) {
    return res.status(400).json({ success: false, message: 'Datos inválidos' });
  }

  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) {
    console.error('WEB3FORMS_ACCESS_KEY not set');
    return res.status(500).json({ success: false, message: 'Configuración incompleta' });
  }

  const payload = {
    access_key:  key,
    subject:     `🚀 Nueva consulta HG Growth Lab — ${clean(servicio)}`,
    from_name:   'HG Growth Lab Web',
    replyto:     clean(email, 200),
    'Nombre':    clean(nombre),
    'Email':     clean(email, 200),
    'Telefono':  clean(telefono),
    'Servicio':  clean(servicio),
    'Mensaje':   clean(mensaje, 1000) || '(sin mensaje)',
  };

  try {
    const upstream = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify(payload),
    });
    const data = await upstream.json();

    if (data.success === true || data.success === 'true') {
      return res.json({ success: true });
    }
    return res.status(502).json({ success: false, message: data.message || 'Error del proveedor' });
  } catch (err) {
    console.error('Contact proxy error:', err.message);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`HG Growth Lab server listening on port ${PORT}`);
});
