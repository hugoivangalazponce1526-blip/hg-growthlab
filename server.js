'use strict';

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '16kb' }));
app.use(express.static(path.join(__dirname)));

// Strip HTML tags and dangerous characters from user input
function sanitize(value) {
    if (typeof value !== 'string') return '';
    return value
        .replace(/<[^>]*>/g, '')          // remove HTML tags
        .replace(/[<>"'`;\\]/g, '')       // remove XSS-risky chars
        .trim()
        .slice(0, 2000);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/contact', async (req, res) => {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
        return res.status(503).json({ success: false, message: 'Servicio no configurado' });
    }

    const name    = sanitize(req.body.name);
    const email   = sanitize(req.body.email);
    const phone   = sanitize(req.body.phone);
    const service = sanitize(req.body.service);
    const message = sanitize(req.body.message);

    if (!name || !email || !phone || !service) {
        return res.status(400).json({ success: false, message: 'Campos requeridos faltantes' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Email inválido' });
    }

    try {
        const upstream = await fetch('https://api.web3forms.com/submit', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                access_key: accessKey,
                subject:    `Nueva consulta HG Growth Lab — ${service}`,
                from_name:  'HG Growth Lab Web',
                replyto:    email,
                Nombre:     name,
                Email:      email,
                Telefono:   phone,
                Servicio:   service,
                Mensaje:    message || '(sin mensaje)',
            }),
        });

        const data = await upstream.json();

        if (data.success === 'true' || data.success === true) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false, message: 'Error al enviar' });
        }
    } catch {
        res.status(500).json({ success: false, message: 'Error interno' });
    }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
