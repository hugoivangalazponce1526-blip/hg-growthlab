// Formatos nuevos del motor (semana del 17-nov-2026): historia, chat, red flag, planes, mito/realidad, ruta.
// Semana del 23-nov-2026: test (sí/no) + score, capa (publicación capa por capa) + igpost, semana (cuenta regresiva), guion (así… o así).
// Se usa desde render.js:  const X = require('./extra')({ esc, md, N });
//   X.css            -> estilos extra
//   X.render(s, i)   -> { body, full, cls } para los tipos nuevos (o null si no es un tipo nuevo)
//   X.deco(s, i)     -> { html, cls } capas decorativas que sirven en CUALQUIER tipo: sticker(s), labi, bubble, route
const Labi = require('./labi');
const ENGINE = __dirname;

module.exports = ({ esc, md, N }) => {
  const font = (fam, w, file, style = 'normal') =>
    `@font-face{font-family:'${fam}';font-weight:${w};font-style:${style};src:url(file://${ENGINE}/fonts/${file})}`;

  const css = `
${font('Caveat', 700, 'caveat-latin-700-normal.woff2')}${font('Caveat', 400, 'caveat-latin-400-normal.woff2')}
${font('Instrument Serif', 400, 'instrument-serif-latin-400-normal.woff2')}${font('Instrument Serif', 400, 'instrument-serif-latin-400-italic.woff2', 'italic')}
/* fondos alternativos: post.fondo = "liso" | "puntos" (por defecto, cuadrícula) */
body.claro.f-liso .s:not(.dark){background-image:none}
body.claro.f-puntos .s:not(.dark){background-image:radial-gradient(rgba(0,0,0,.11) 2px,transparent 2.6px);background-size:44px 44px}
h1.serif,h2.serif{font-family:'Instrument Serif';font-weight:400;letter-spacing:-2px}
h1.serif{line-height:.93}
h1.serif .gold,h2.serif .gold{font-style:italic}
.hand{font-family:Caveat;font-weight:700}
/* capas decorativas */
.sticker{position:absolute;z-index:1;line-height:1;filter:drop-shadow(7px 0 0 #fff) drop-shadow(-7px 0 0 #fff) drop-shadow(0 7px 0 #fff) drop-shadow(0 -7px 0 #fff) drop-shadow(0 16px 20px rgba(0,0,0,.18))}
.lb{position:absolute;z-index:1}
.s.nobot .bot{display:none}
/* ---- historia ---- */
.st-k{display:flex;align-items:center;gap:20px;font-family:Sora;font-weight:700;font-size:26px;letter-spacing:3px;text-transform:uppercase;color:#8a8a8a;margin-bottom:36px}
.st-k b{background:#1A1A1A;color:#E3BC52;border-radius:100px;padding:10px 24px;letter-spacing:1px}
.s.dark .st-k b{background:#C9A84C;color:#1A1A1A}
.st-t{font-size:128px;line-height:.96}
.st-p{font-size:44px;line-height:1.42;margin-top:44px}
/* ---- pasos / lecciones ---- */
.sp-t{font-size:66px}
.sp{list-style:none;margin-top:46px;display:flex;flex-direction:column;gap:36px}
.sp li{display:flex;gap:28px;align-items:flex-start}
.sp li i{flex:none;width:72px;height:72px;border-radius:50%;background:#C9A84C;color:#1A1A1A;font:800 34px Sora;display:grid;place-items:center;font-style:normal}
.sp li b{display:block;font:700 40px/1.2 Sora}
.sp li span{display:block;font-size:33px;line-height:1.38;margin-top:8px;color:#4a4a4a}
.s.dark .sp li span{color:#d8d2c4}
.sp.simple{gap:24px;margin-top:34px}.sp.simple li{align-items:center}.sp.simple li b{font:600 36px/1.3 Inter}
/* ---- chat ---- */
.ch-l{align-self:flex-start;font:800 26px Sora;letter-spacing:2px;padding:14px 26px;border-radius:100px;margin-bottom:24px}
.ch-l.no{background:#C7443F;color:#fff}.ch-l.ok{background:#1A1A1A;color:#E3BC52}
.ch-t{font-size:64px;line-height:1.06}
.ch{margin-top:34px;background:#fff;border-radius:36px;box-shadow:0 24px 50px rgba(0,0,0,.10);border:1.5px solid rgba(26,26,26,.08);overflow:hidden;flex:none}
.ch-h{display:flex;align-items:center;gap:20px;padding:22px 30px;border-bottom:1.5px solid #eee}
.ch-a{width:68px;height:68px;border-radius:50%;background:#EBDDB5;display:grid;place-items:center;font:700 28px Sora;color:#1A1A1A}
.ch-h b{display:block;font:700 31px Sora;color:#1A1A1A}.ch-h span{font-size:24px;color:#8a8a8a}
.ch-b{padding:28px 30px 30px;display:flex;flex-direction:column;gap:16px}
.m{max-width:82%;padding:24px 30px;border-radius:34px;font-size:37px;line-height:1.32}
.m.c{align-self:flex-start;background:#EFEDE8;color:#1A1A1A;border-bottom-left-radius:10px}
.m.me{align-self:flex-end;background:#1A1A1A;color:#F5F1E8;border-bottom-right-radius:10px}
.ch-seen{align-self:flex-end;font-size:24px;color:#8a8a8a;margin-top:-4px}
.ch-n{font-family:Caveat;font-weight:700;font-size:62px;line-height:1.04;color:#C7443F;margin-top:34px;transform:rotate(-1.5deg);padding-left:16px}
.ch-n.ok{color:#8F6F22}
.cv-bub{position:absolute;left:90px;right:90px;bottom:100px;z-index:1;display:flex;flex-direction:column;gap:22px}
.cv-bub .m{font-size:84px;font-family:Sora;font-weight:700;padding:34px 54px;border-radius:70px;letter-spacing:-2px;max-width:none}
.cv-bub .m.c{border-bottom-left-radius:18px;background:#fff;box-shadow:0 20px 40px rgba(0,0,0,.10)}
.cv-bub .m.me{border-bottom-right-radius:18px}
.cv-bub .ch-seen{font-family:Caveat;font-weight:700;font-size:62px;color:#C7443F;transform:rotate(-2deg);margin-top:6px}
/* ---- red flag ---- */
.fl-k{font:800 28px Sora;letter-spacing:3px;color:#C7443F;margin-bottom:44px}
.fl-note{background:#fff;padding:56px 50px 50px;box-shadow:0 22px 40px rgba(0,0,0,.12);position:relative;border-radius:4px}
.tape{position:absolute;top:-26px;left:50%;width:210px;height:54px;margin-left:-105px;background:rgba(201,168,76,.6);transform:rotate(2deg)}
.fl-t{font-family:Caveat;font-weight:700;font-size:108px;line-height:.96;color:#1A1A1A}
.fl-p{margin-top:46px;font-size:38px}
/* ---- elegir / planes ---- */
.cz{display:flex;flex-direction:column;gap:30px;margin-top:54px}
.cz>div{display:flex;align-items:center;gap:30px;background:#fff;border-radius:28px;padding:32px 36px;border:2.5px solid #1A1A1A;box-shadow:9px 9px 0 #1A1A1A}
.cz i{flex:none;width:100px;height:100px;border-radius:24px;background:#1A1A1A;color:#E3BC52;font:800 56px Sora;display:grid;place-items:center;font-style:normal}
.cz b{display:block;font:700 40px/1.15 Sora;color:#1A1A1A}.cz span{display:block;font-size:30px;color:#555;margin-top:6px}
.cz em{margin-left:auto;font:800 46px Sora;font-style:normal;color:#1A1A1A}
.pl-h{display:flex;align-items:center;gap:28px;margin-bottom:34px}
.pl-L{flex:none;width:136px;height:136px;border-radius:30px;background:#C9A84C;color:#1A1A1A;font:800 88px Sora;display:grid;place-items:center;box-shadow:9px 9px 0 #1A1A1A;border:2.5px solid #1A1A1A}
.pl-h span{display:block;font:700 24px Sora;letter-spacing:3px;color:#8a8a8a}.pl-h b{font:700 40px Sora;color:#1A1A1A}
.pl-tabs{margin-left:auto;display:flex;gap:10px}
.pl-tabs i{width:56px;height:56px;border-radius:50%;border:2.5px solid #1A1A1A;display:grid;place-items:center;font:700 24px Sora;font-style:normal;opacity:.28;color:#1A1A1A}
.pl-tabs i.on{background:#1A1A1A;color:#E3BC52;opacity:1}
.pl-t{font-size:64px}
/* ---- mito / realidad (pantalla partida) ---- */
.mt-top{position:absolute;left:0;right:0;top:0;height:700px;background:#DCD6C8;padding:262px 90px 0;z-index:0}
.mt-bot{position:absolute;left:0;right:0;top:620px;bottom:0;background:#1A1A1A;color:#F5F1E8;padding:130px 90px 0;z-index:1;clip-path:polygon(0 70px,100% 0,100% 100%,0 100%)}
.mt-st{display:inline-block;font:800 30px Sora;letter-spacing:4px;border:4px solid #C7443F;color:#C7443F;padding:8px 22px;border-radius:10px;transform:rotate(-4deg);margin-bottom:30px}
.mt-st.r{border-color:#E3BC52;color:#E3BC52;transform:rotate(-3deg)}
.mt-q{font-family:'Instrument Serif';font-style:italic;font-size:104px;line-height:1.02;color:#6b665c;text-decoration:line-through;text-decoration-color:#C7443F;text-decoration-thickness:6px}
.mt-r{font:800 70px/1.06 Sora;letter-spacing:-2px;color:#F5F1E8}
.mt-r .gold{color:#E3BC52}
body.claro .mt-bot p{color:#d8d2c4;font-size:39px;line-height:1.42;margin-top:32px}
body.claro .mt-r .gold{color:#E3BC52}
.mt-n{position:absolute;right:90px;bottom:70px;font:700 24px Sora;letter-spacing:2px;color:#8a8a8a;z-index:2}
/* ---- ruta (sigue la línea) ---- */
.rt{position:absolute;inset:0;z-index:0}
.s.ruta .in{bottom:430px}
.rt-k{font:700 26px Sora;letter-spacing:3px;text-transform:uppercase;color:#8a8a8a;margin-bottom:26px}
.rt-k b{color:#1A1A1A}
.rt-t{font-size:88px;line-height:1.02}
.rt-p{font-size:40px;line-height:1.4;margin-top:28px}
  .s.ruta.end .in{bottom:290px}
.s.chat .in{top:205px;bottom:100px;justify-content:center}
.s.nosw .swoosh{display:none}
.lb.card{background:#F5F1E8;border-radius:50%;box-shadow:0 0 0 10px rgba(201,168,76,.35)}
.s.steps .in{justify-content:center}
.s.ruta .box{margin-top:36px;padding:30px 36px;font-size:36px}
.s.ruta.end .rt-t{font-size:76px}.s.ruta.end .box{margin-top:30px;padding:24px 34px;font-size:33px}
.s.ruta .list{margin-top:34px;gap:20px}.s.ruta .list li{font-size:34px}.s.ruta .list li i{width:52px;height:52px}
/* ---- test (sí / no) ---- */
.ts-k{display:flex;align-items:center;gap:18px;font:700 26px Sora;letter-spacing:3px;color:#8a8a8a;margin-bottom:40px}
.ts-dots{display:flex;gap:10px}.ts-dots i{width:44px;height:12px;border-radius:10px;background:rgba(26,26,26,.15)}.ts-dots i.on{background:#C9A84C}
.ts-q{font:800 78px/1.06 Sora;letter-spacing:-2px;color:#1A1A1A}
.ts-yn{display:flex;gap:28px;margin-top:60px}
.ts-yn div{flex:1;text-align:center;font:800 54px Sora;padding:34px 0;border-radius:100px;border:3px solid #1A1A1A;color:#1A1A1A}
.ts-yn div:first-child{background:#1A1A1A;color:#E3BC52}
.ts-h{font-family:Caveat;font-weight:700;font-size:58px;line-height:1.08;color:#8F6F22;margin-top:56px;transform:rotate(-1.5deg)}
.s.test .in{justify-content:center}
.sc{display:flex;flex-direction:column;gap:28px;margin-top:50px}
.sc>div{display:flex;gap:30px;align-items:center;background:#fff;border-radius:28px;padding:30px 34px;border:1.5px solid rgba(26,26,26,.1);box-shadow:0 14px 30px rgba(0,0,0,.05)}
.sc i{flex:none;min-width:150px;height:120px;padding:0 18px;border-radius:24px;background:#1A1A1A;color:#E3BC52;font:800 50px Sora;display:grid;place-items:center;font-style:normal}
.sc b{display:block;font:700 38px/1.15 Sora;color:#1A1A1A}.sc span{display:block;font-size:30px;line-height:1.35;color:#555;margin-top:8px}
.s.score .in{justify-content:center}
/* ---- capa por capa (publicación de Instagram) ---- */
.cp-k{display:flex;align-items:center;gap:16px;font:700 26px Sora;letter-spacing:3px;color:#8a8a8a;margin-bottom:22px;text-transform:uppercase}
.cp-k b{background:#C9A84C;color:#1A1A1A;border-radius:100px;padding:10px 24px;letter-spacing:1px}
.cp-t{font-size:60px;line-height:1.06}
.ig{background:#fff;border-radius:30px;box-shadow:0 24px 50px rgba(0,0,0,.10);border:1.5px solid rgba(26,26,26,.08);overflow:hidden;flex:none;margin-top:34px}
.ig-h{display:flex;align-items:center;gap:18px;padding:20px 28px}
.ig-a{width:60px;height:60px;border-radius:50%;background:#1A1A1A;color:#E3BC52;display:grid;place-items:center;font:800 26px Sora;box-shadow:0 0 0 4px #fff,0 0 0 7px #C9A84C}
.ig-h b{font:700 29px Sora;color:#1A1A1A}.ig-h span{display:block;font-size:22px;color:#8a8a8a}
.ig-img{height:300px;background:#EBDDB5;display:grid;place-items:center;font-size:170px}
.ig-ac{display:flex;gap:26px;padding:18px 28px 4px;font-size:36px;color:#1A1A1A}.ig-ac em{margin-left:auto;font-style:normal}
.ig-c{padding:8px 28px 28px;font-size:31px;line-height:1.36;color:#1A1A1A}
.ig-c b{font-weight:700}
.ig-c mark{background:#EBDDB5;color:#1A1A1A;padding:0 4px;border-radius:4px;box-shadow:inset 0 -4px 0 #C9A84C}
.cp-n{font-family:Caveat;font-weight:700;font-size:56px;line-height:1.05;color:#8F6F22;margin-top:26px;transform:rotate(-1.5deg);padding-left:12px}
.cp-n.no{color:#C7443F}
.s.capa .in{top:215px;bottom:90px;justify-content:center}
.igx{position:absolute;z-index:1}
/* ---- cuenta regresiva (semana) ---- */
.wk{display:flex;gap:40px;align-items:center;margin-bottom:40px}
.wk-cal{flex:none;width:230px;border-radius:26px;overflow:hidden;background:#fff;box-shadow:0 18px 36px rgba(0,0,0,.10);border:2px solid #1A1A1A;text-align:center}
.wk-cal span{display:block;background:#1A1A1A;color:#E3BC52;font:700 24px Sora;letter-spacing:3px;padding:14px 0}
.wk-cal b{display:block;font:800 140px/1.1 Sora;color:#1A1A1A;padding-top:6px}
.wk-cal em{display:block;font-style:normal;font:600 22px Sora;color:#8a8a8a;padding-bottom:18px;letter-spacing:1px}
.wk-r{font:700 28px Sora;letter-spacing:2px;color:#8a8a8a;text-transform:uppercase}
.wk-r b{display:block;color:#1A1A1A;font-size:40px;letter-spacing:0;text-transform:none;margin-top:8px}
.wk-t{font-size:74px;line-height:1.04}
.s.semana .list{margin-top:50px;gap:34px}
.s.semana .in{justify-content:center}
.s.semana .list li{font-size:42px}
.s.semana .wk-t{font-size:84px}
/* ---- guion (así… o así) ---- */
.gn-k{font:700 26px Sora;letter-spacing:3px;color:#8a8a8a;text-transform:uppercase;margin-bottom:20px}
.gn-k b{color:#1A1A1A}
.gn-t{font-size:66px;line-height:1.05}
.gn{margin-top:40px;display:flex;flex-direction:column;gap:30px}
.gn>div{border-radius:30px;padding:30px 38px 36px;position:relative}
.gn .no{background:#E6E1D5;color:#77716a}
.gn .si{background:#fff;color:#1A1A1A;border:3px solid #C9A84C;box-shadow:0 18px 36px rgba(0,0,0,.08)}
.gn label{display:block;font-family:Caveat;font-weight:700;font-size:62px;line-height:1;margin-bottom:10px}
.gn .no label{color:#8a8378;text-decoration:line-through;text-decoration-color:#C7443F;text-decoration-thickness:4px}
.gn .si label{color:#8F6F22}
.gn p{font-size:40px;line-height:1.35;color:inherit}
.gn .si p{font-weight:600;color:#1A1A1A}
.gn-n{font:600 30px Inter;color:#3d3d3d;margin-top:34px;display:flex;gap:14px;align-items:flex-start}
.gn-n i{font-style:normal;flex:none;background:#1A1A1A;color:#E3BC52;font:800 22px Sora;letter-spacing:2px;padding:8px 16px;border-radius:100px}
.s.guion .in{justify-content:center}
.s.guion .gn-t{font-size:88px}.s.guion .gn p{font-size:46px}.s.guion .gn label{font-size:72px}.s.guion .gn>div{padding:36px 42px 42px}.s.guion .gn-n{font-size:34px}.s.guion .gn-k{font-size:30px}
body.claro .code{font-size:40px}

`;

  const list = (items, cls = '') => `<ol class="sp ${cls}">${items.map((it, k) => typeof it === 'string'
    ? `<li><i>${k + 1}</i><div><b>${md(it)}</b></div></li>`
    : `<li><i>${k + 1}</i><div><b>${md(it.t)}</b>${it.d ? `<span>${md(it.d)}</span>` : ''}</div></li>`).join('')}</ol>`;


  const mk = t => md(t).replace(/\[\[([\s\S]+?)\]\]/g, '<mark>$1</mark>');
  const igpost = (p) => `<div class="ig"><div class="ig-h"><div class="ig-a">${esc(p.avatar || 'L')}</div><div><b>${esc(p.name || 'tulocal')}</b><span>${esc(p.place || '')}</span></div></div>
    <div class="ig-img"${p.imgh ? ` style="height:${p.imgh}px;font-size:${Math.round(p.imgh * .56)}px"` : ''}>${p.emoji || '🥧'}</div><div class="ig-ac"><span>♡</span><span>💬</span><span>➤</span><em>🔖</em></div>
    <div class="ig-c"${p.csize ? ` style="font-size:${p.csize}px"` : ''}><b>${esc(p.name || 'tulocal')}</b> ${mk(p.caption)}</div></div>`;

  // Línea punteada que cruza la lámina y pasa por el pin de la parada.
  function route(r) {
    const { px = 540, py = 1130, label = '' } = r;
    const yin = r.yin, yout = r.yout;
    let d = '';
    if (yin !== undefined) d += `M -30 ${yin} C ${px * 0.45} ${yin}, ${px - 240} ${py + 120}, ${px} ${py}`;
    else d += `M ${px} ${py}`;
    if (yout !== undefined) d += ` C ${px + 240} ${py - 120}, ${1080 - (1080 - px) * 0.45} ${yout}, 1110 ${yout}`;
    const pin = r.pin === false ? '' : `<g transform="translate(${px},${py})">
      <ellipse cx="0" cy="4" rx="34" ry="9" fill="#1A1A1A" opacity=".14"/>
      <path d="M0 0 C-22 -44 -58 -68 -58 -108 A58 58 0 1 1 58 -108 C58 -68 22 -44 0 0 Z" fill="#1A1A1A"/>
      <circle cx="0" cy="-108" r="36" fill="#C9A84C"/>
      <text x="0" y="-93" text-anchor="middle" font-family="Sora" font-weight="800" font-size="42" fill="#1A1A1A">${esc(label)}</text></g>`;
    return `<svg class="rt" viewBox="0 0 1080 1350"><path d="${d}" fill="none" stroke="#C9A84C" stroke-width="13" stroke-linecap="round" stroke-dasharray="1 30"/>${pin}</svg>`;
  }

  function render(s, i) {
    switch (s.type) {
      case 'story':
        return { body: `${s.kicker ? `<div class="st-k">${s.num ? `<b>${esc(s.num)}</b>` : ''}<span>${esc(s.kicker)}</span></div>` : ''}
          <h2 class="serif st-t"${s.size ? ` style="font-size:${s.size}px"` : ''}>${md(s.title)}</h2>${s.body ? `<p class="st-p">${md(s.body)}</p>` : ''}` };
      case 'steps':
        return { cls: 'steps', body: `${s.tag ? `<div class="tag">${esc(s.tag)}</div>` : ''}<h2 class="sp-t">${md(s.title)}</h2>${list(s.items, s.simple ? 'simple' : '')}
          ${s.box ? `<div class="box"><span class="k">${esc(s.box.k)}</span>${md(s.box.text)}</div>` : ''}` };
      case 'chat':
        return { cls: 'chat', body: `<div class="ch-l ${s.ok ? 'ok' : 'no'}">${esc(s.label || (s.ok ? '✓ MEJOR ASÍ' : '✕ ASÍ NO'))}</div><h2 class="ch-t">${md(s.title)}</h2>
          <div class="ch"><div class="ch-h"><div class="ch-a">${esc(s.avatar || 'C')}</div><div><b>${esc(s.name || 'Cliente')}</b><span>${esc(s.via || 'Mensaje directo')}</span></div></div>
          <div class="ch-b">${s.msgs.map(m => m.seen ? `<div class="ch-seen">${esc(m.seen)}</div>` : `<div class="m ${m.me ? 'me' : 'c'}">${md(m.text)}</div>`).join('')}</div></div>
          ${s.note ? `<div class="ch-n ${s.ok ? 'ok' : ''}">${md(s.note)}</div>` : ''}` };
      case 'flag':
        return { body: `<div class="fl-k">🚩 RED FLAG <b>${s.n}</b> DE ${s.total || 5}</div>
          <div class="fl-note" style="transform:rotate(${s.n % 2 ? -1.6 : 1.4}deg)"><div class="tape"></div><div class="fl-t">${md(s.title)}</div></div>
          ${s.body ? `<p class="fl-p">${md(s.body)}</p>` : ''}
          ${s.fix ? `<div class="box"><span class="k">${esc(s.fixLabel || '✅ Se arregla así')}</span>${md(s.fix)}</div>` : ''}` };
      case 'choose':
        return { body: `${s.tag ? `<div class="tag">${esc(s.tag)}</div>` : ''}<h2>${md(s.title)}</h2>${s.body ? `<p style="margin-top:26px">${md(s.body)}</p>` : ''}
          <div class="cz">${s.options.map(o => `<div><i>${esc(o.k)}</i><div><b>${md(o.t)}</b><span>${md(o.d)}</span></div><em>→</em></div>`).join('')}</div>` };
      case 'plan':
        return { body: `<div class="pl-h"><div class="pl-L">${esc(s.letter)}</div><div><span>PLAN ${esc(s.letter)}</span><b>${esc(s.time)}</b></div>
          <div class="pl-tabs">${['A', 'B', 'C'].map(l => `<i class="${l === s.letter ? 'on' : ''}">${l}</i>`).join('')}</div></div>
          <h2 class="pl-t">${md(s.title)}</h2>${list(s.items, 'simple')}
          ${s.box ? `<div class="box"><span class="k">${esc(s.box.k)}</span>${md(s.box.text)}</div>` : ''}` };
      case 'mito':
        return { cls: 'nobot mito', full: `<div class="mt-top"><div class="mt-st">MITO ${s.n}</div><div class="mt-q"${s.qsize ? ` style="font-size:${s.qsize}px"` : ''}>${md(s.mito)}</div></div>
          <div class="mt-bot"><div class="mt-st r">REALIDAD</div><div class="mt-r"${s.rsize ? ` style="font-size:${s.rsize}px"` : ''}>${md(s.real)}</div>${s.extra ? `<p>${md(s.extra)}</p>` : ''}</div>` };
      case 'ruta':
        return { cls: 'nobot ruta' + (s.end ? ' end' : ''), full: route(s.route || {}), body: `<div class="rt-k"><b>${esc(s.stop)}</b>${s.place ? ' · ' + esc(s.place) : ''}</div>
          <h2 class="rt-t">${md(s.title)}</h2>${s.body ? `<p class="rt-p">${md(s.body)}</p>` : ''}
          ${s.items ? `<ul class="list">${s.items.map(t => `<li><i>✓</i>${md(t)}</li>`).join('')}</ul>` : ''}
          ${s.box ? `<div class="box"><span class="k">${esc(s.box.k)}</span>${md(s.box.text)}</div>` : ''}` };

      case 'test':
        return { cls: 'test', body: `<div class="ts-k"><span>PREGUNTA ${s.n} DE ${s.total || 5}</span><div class="ts-dots">${Array.from({ length: s.total || 5 }, (_, k) => `<i class="${k < s.n ? 'on' : ''}"></i>`).join('')}</div></div>
          <h2 class="ts-q"${s.size ? ` style="font-size:${s.size}px"` : ''}>${md(s.q)}</h2><div class="ts-yn"><div>SÍ</div><div>NO</div></div>
          ${s.hint ? `<div class="ts-h">${md(s.hint)}</div>` : ''}` };
      case 'score':
        return { cls: 'score', body: `${s.tag ? `<div class="tag">${esc(s.tag)}</div>` : ''}<h2>${md(s.title)}</h2>
          <div class="sc">${s.rows.map(r => `<div><i>${esc(r.k)}</i><div><b>${md(r.t)}</b>${r.d ? `<span>${md(r.d)}</span>` : ''}</div></div>`).join('')}</div>` };
      case 'capa':
        return { cls: 'capa nobot', body: `<div class="cp-k">${s.num ? `<b>${esc(s.num)}</b>` : ''}<span>${esc(s.kicker || '')}</span></div>
          <h2 class="cp-t">${md(s.title)}</h2>${igpost(s.post)}${s.note ? `<div class="cp-n ${s.bad ? 'no' : ''}">${md(s.note)}</div>` : ''}` };
      case 'semana':
        return { cls: 'semana', body: `<div class="wk"><div class="wk-cal"><span>FALTAN</span><b>${esc(s.left)}</b><em>${esc(s.unit || 'SEMANAS')}</em></div>
          <div class="wk-r">${esc(s.kicker || '')}<b>${esc(s.range)}</b></div></div>
          <h2 class="wk-t">${md(s.title)}</h2><ul class="list">${s.items.map(t => `<li><i>✓</i>${md(t)}</li>`).join('')}</ul>
          ${s.box ? `<div class="box"><span class="k">${esc(s.box.k)}</span>${md(s.box.text)}</div>` : ''}` };
      case 'guion':
        return { cls: 'guion', body: `<div class="gn-k"><b>${esc(s.scene)}</b>${s.place ? ' · ' + esc(s.place) : ''}</div><h2 class="gn-t">${md(s.title)}</h2>
          <div class="gn"><div class="no"><label>${esc(s.noLabel || 'Así…')}</label>${s.no.map(l => `<p>${md(l)}</p>`).join('')}</div>
          <div class="si"><label>${esc(s.siLabel || '…o así')}</label>${s.si.map(l => `<p>${md(l)}</p>`).join('')}</div></div>
          ${s.note ? `<div class="gn-n"><i>TIP</i><span>${md(s.note)}</span></div>` : ''}` };
    }
    return null;
  }

  function deco(s) {
    let html = '', cls = '';
    const st = s.stickers || (s.sticker ? [s.sticker] : []);
    for (const k of st) {
      const o = typeof k === 'string' ? { e: k } : k;
      const pos = (o.x !== undefined ? `left:${o.x}px;` : `right:${o.right ?? 80}px;`) + (o.y !== undefined ? `top:${o.y}px;` : `bottom:${o.bottom ?? 150}px;`);
      html += `<div class="sticker" style="${pos}font-size:${o.size || 220}px;transform:rotate(${o.r ?? -8}deg)">${o.e}</div>`;
    }
    for (const n of s.notes || []) {
      html += `<div class="hand" style="position:absolute;z-index:1;left:${n.x}px;top:${n.y}px;font-size:${n.size || 60}px;line-height:1.02;color:${n.color || '#1A1A1A'};transform:rotate(${n.r ?? -3}deg)">${md(n.text)}</div>`;
    }
    if (s.labi) {
      const o = s.labi, w = o.w || 520, h = Math.round(w * 480 / 460);
      const pos = (o.x !== undefined ? `left:${o.x}px;` : `right:${o.right ?? 50}px;`) + (o.y !== undefined ? `top:${o.y}px;` : `bottom:${o.bottom ?? 90}px;`);
      html += `<div class="lb${o.card ? ' card' : ''}" style="${pos}width:${w}px;height:${o.card ? w : h}px${o.card ? ';padding:' + Math.round(w * .08) + 'px' : ''}">${Labi.svg(o)}</div>`;
      cls += ' nobot';
    }
    if (s.igpost) {
      const o = s.igpost;
      html += `<div class="igx" style="left:${o.x ?? 150}px;top:${o.y ?? 620}px;width:${o.w || 780}px;transform:rotate(${o.r ?? -2}deg)">${igpost(o)}</div>`;
      cls += ' nobot';
    }
    if (s.bubble) {
      html += `<div class="cv-bub">${s.bubble.map(m => m.seen ? `<div class="ch-seen">${esc(m.seen)}</div>` : `<div class="m ${m.me ? 'me' : 'c'}">${md(m.text)}</div>`).join('')}</div>`;
      cls += ' nobot nosw';
    }
    if (s.type !== 'ruta' && s.route) { html += route(s.route); cls += ' nobot'; }
    return { html, cls };
  }

  return { css, render, deco };
};
