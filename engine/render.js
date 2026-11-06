// Motor de carruseles HG Growth Lab
// Uso: node engine/render.js queue/AAAA-MM-DD   (lee post.json, escribe slide1.jpg ... slideN.jpg)
// Requiere: playwright (preinstalado en el entorno de Claude).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ENGINE = __dirname;
const dir = path.resolve(process.argv[2] || '.');
const post = JSON.parse(fs.readFileSync(path.join(dir, 'post.json'), 'utf8'));
const slides = post.slides;
const N = slides.length;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Marcado: *palabra* = dorado · **texto** = negrita blanca · \n = salto de línea
const md = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<span class="gold">$1</span>')
  .replace(/\n/g, '<br>');

const font = (fam, w, file, style = 'normal') =>
  `@font-face{font-family:${fam};font-weight:${w};font-style:${style};src:url(file://${ENGINE}/fonts/${file})}`;

const CSS = `
${font('Sora', 400, 'sora-latin-400-normal.woff2')}${font('Sora', 600, 'sora-latin-600-normal.woff2')}
${font('Sora', 700, 'sora-latin-700-normal.woff2')}${font('Sora', 800, 'sora-latin-800-normal.woff2')}
${font('Inter', 400, 'inter-latin-400-normal.woff2')}${font('Inter', 500, 'inter-latin-500-normal.woff2')}
${font('Inter', 600, 'inter-latin-600-normal.woff2')}${font('Inter', 400, 'inter-latin-400-italic.woff2', 'italic')}
:root{--gold:#C9A84C;--gold2:#E3BC52;--w:#fff;--cream:#F4EEDF;--g:#9A9A9A;--red:#E25C5C}
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000}
.s{width:1080px;height:1350px;position:relative;overflow:hidden;background:#101010;color:var(--w);font-family:Inter;
 background-image:radial-gradient(520px 520px at 100% 0%, rgba(240,190,80,.50), rgba(201,168,76,.10) 45%, transparent 70%),
 radial-gradient(700px 600px at -10% 110%, rgba(201,168,76,.09), transparent 60%),
 linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
 background-size:auto,auto,60px 60px,60px 60px}
.s::after{content:'';position:absolute;right:-560px;bottom:-600px;width:860px;height:860px;border-radius:50%;
 border:3px solid rgba(232,190,90,.8);box-shadow:0 0 30px rgba(232,190,90,.3);outline:1.5px solid rgba(201,168,76,.3);outline-offset:40px;z-index:0}
.top{position:absolute;top:50px;left:90px;right:90px;display:flex;justify-content:space-between;align-items:center;font-family:Sora;font-size:24px;color:var(--g);z-index:2}
.top img{height:120px;display:block}
.in{position:absolute;inset:250px 90px 190px 90px;display:flex;flex-direction:column;z-index:1}
.bot{position:absolute;bottom:120px;left:90px;display:flex;align-items:center;gap:12px;font-family:Sora;font-weight:600;font-size:26px;color:var(--gold);z-index:2}
.gold{color:var(--gold2)}
strong{color:var(--w);font-weight:600}
.tag{align-self:flex-start;font-family:Sora;font-weight:800;font-size:30px;text-transform:uppercase;color:#111;background:linear-gradient(90deg,#E9C766,#C9A84C);padding:18px 34px;border-radius:100px;margin-bottom:44px}
h1{font-family:Sora;font-weight:800;font-size:132px;line-height:.98;letter-spacing:-5px}
h2{font-family:Sora;font-weight:800;font-size:82px;line-height:1.06;letter-spacing:-2px}
.swoosh{display:block;width:500px;height:30px;margin-top:26px}
.sub{font-style:italic;font-size:48px;line-height:1.3;color:#fff;margin-top:36px}
p{font-size:40px;line-height:1.42;color:#D6D6D6}
.big{font-family:Sora;font-weight:800;font-size:250px;line-height:.8;color:transparent;-webkit-text-stroke:3px var(--gold);margin-bottom:30px}
.big.red{-webkit-text-stroke-color:var(--red)}
.icon{width:150px;height:150px;border-radius:40px;border:2.5px solid var(--gold);display:grid;place-items:center;font-size:76px;margin-bottom:40px;background:rgba(201,168,76,.08);box-shadow:0 0 50px rgba(201,168,76,.2)}
.box{margin-top:auto;border:1.5px solid rgba(201,168,76,.45);background:rgba(201,168,76,.07);border-radius:24px;padding:34px 38px;font-size:34px;line-height:1.4;color:#EDEDED}
.box .k{font-family:Sora;font-weight:700;color:var(--gold);font-size:24px;letter-spacing:2px;text-transform:uppercase;display:block;margin-bottom:10px}
.box.warn{border-color:rgba(226,92,92,.55);background:rgba(226,92,92,.08)}.box.warn .k{color:var(--red)}
.code{margin-bottom:30px;margin-top:34px;border:1.5px solid #333;background:#0b0b0b;border-radius:22px;padding:34px 38px;font-size:36px;line-height:1.45;color:#EDE6D2;position:relative}
.code::before{content:'PROMPT · COPIA Y PEGA';display:block;font-family:Sora;font-weight:700;font-size:20px;letter-spacing:2px;color:var(--gold);margin-bottom:14px}
.list{list-style:none;display:flex;flex-direction:column;gap:30px;margin-top:50px}
.list li{display:flex;gap:26px;align-items:center;font-size:38px;font-weight:500;line-height:1.25}
.list li i{flex:none;width:58px;height:58px;border-radius:14px;border:2px solid var(--gold);display:grid;place-items:center;font-style:normal;color:var(--gold);font-family:Sora;font-weight:800;font-size:26px}
.vs{display:flex;flex-direction:column;gap:26px;margin-top:44px}
.vs div{border-radius:22px;padding:28px 34px;font-size:34px;line-height:1.38}
.vs .no{border:1.5px solid rgba(226,92,92,.5);background:rgba(226,92,92,.07);color:#cfcfcf}
.vs .si{border:1.5px solid rgba(201,168,76,.6);background:rgba(201,168,76,.09);color:#fff}
.vs b{display:block;font-family:Sora;font-size:22px;letter-spacing:2px;margin-bottom:8px}
.vs .no b{color:var(--red)}.vs .si b{color:var(--gold)}
.btns{margin-top:auto;display:flex;flex-direction:column;gap:22px}
.btn{font-family:Sora;font-weight:700;font-size:38px;padding:30px 36px;border-radius:22px;border:2px solid rgba(255,255,255,.25)}
.btn:first-child{background:var(--gold);color:#111;border-color:var(--gold);box-shadow:0 0 60px rgba(201,168,76,.35)}
.sign{margin-top:40px;font-family:Sora;font-size:28px;color:var(--g)}
`;

function slideHTML(s, i) {
  const n = `${i + 1}/${N}`;
  const top = `<div class="top"><img src="file://${ENGINE}/logo.png"><div>${n}</div></div>`;
  const swipe = i < N - 1 && (s.type === 'cover' || i === 1) ? `<div class="bot">Desliza <span style="font-size:38px">→</span></div>` : '';
  let body = '';
  switch (s.type) {
    case 'cover':
      body = `${s.tag ? `<div class="tag">${esc(s.tag)}</div>` : ''}<h1 style="font-size:${s.size || 132}px">${md(s.title)}</h1>
        <svg class="swoosh" viewBox="0 0 500 30"><path d="M6 22 C120 8 300 4 494 12" stroke="#E3BC52" stroke-width="9" fill="none" stroke-linecap="round"/></svg>
        ${s.sub ? `<div class="sub">${md(s.sub)}</div>` : ''}`;
      break;
    case 'point':
      body = `${s.num ? `<div class="big ${s.warn ? 'red' : ''}">${esc(s.num)}</div>` : ''}${s.icon ? `<div class="icon">${s.icon}</div>` : ''}
        <h2>${md(s.title)}</h2>${s.body ? `<p style="margin-top:36px">${md(s.body)}</p>` : ''}
        ${s.box ? `<div class="box ${s.warn ? 'warn' : ''}"><span class="k">${esc(s.box.k)}</span>${md(s.box.text)}</div>` : ''}`;
      break;
    case 'prompt':
      body = `${s.icon ? `<div class="icon" style="width:120px;height:120px;font-size:60px;margin-bottom:30px">${s.icon}</div>` : ''}
        <h2 style="font-size:70px">${md(s.title)}</h2>${s.body ? `<p style="margin-top:24px;font-size:36px">${md(s.body)}</p>` : ''}
        <div class="code">${md(s.prompt)}</div>${s.box ? `<div class="box"><span class="k">${esc(s.box.k)}</span>${md(s.box.text)}</div>` : ''}`;
      break;
    case 'vs':
      body = `<h2>${md(s.title)}</h2><div class="vs"><div class="no"><b>${esc(s.noLabel || 'ASÍ NO')}</b>${md(s.no)}</div>
        <div class="si"><b>${esc(s.siLabel || 'MEJOR ASÍ')}</b>${md(s.si)}</div></div>
        ${s.box ? `<div class="box"><span class="k">${esc(s.box.k)}</span>${md(s.box.text)}</div>` : ''}`;
      break;
    case 'checklist':
      body = `<div class="tag">${esc(s.tag || 'Checklist · Guárdalo')}</div><h2>${md(s.title)}</h2>
        <ul class="list">${s.items.map(t => `<li><i>✓</i>${md(t)}</li>`).join('')}</ul>`;
      break;
    case 'cta':
      body = `<h2>${md(s.title)}</h2>${s.body ? `<p style="margin-top:40px">${md(s.body)}</p>` : ''}
        <div class="btns">${(s.buttons || ['🔖 Guárdalo para aplicarlo', '📩 Mándaselo a alguien con local', '➕ Sígueme para más']).map(b => `<div class="btn">${esc(b)}</div>`).join('')}</div>
        <div class="sign">Hugo · <span class="gold">HG Growth Lab</span> · Automatiza tu futuro con IA</div>`;
      break;
    default: throw new Error('Tipo de slide desconocido: ' + s.type);
  }
  return `<section class="s" id="s${i + 1}">${top}<div class="in" ${s.type === 'cover' ? '' : ''}>${body}</div>${swipe}</section>`;
}

(async () => {
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${slides.map(slideHTML).join('')}</body></html>`;
  const tmp = path.join(dir, '_render.html');
  fs.writeFileSync(tmp, html);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  await p.goto('file://' + tmp);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  // Control de desborde: ningún bloque de contenido puede salirse de su zona
  const overflow = await p.evaluate(() => [...document.querySelectorAll('.in')].map((el, i) => el.scrollHeight > el.clientHeight + 2 ? i + 1 : 0).filter(Boolean));
  for (let i = 1; i <= N; i++) await p.locator('#s' + i).screenshot({ path: path.join(dir, `slide${i}.jpg`), type: 'jpeg', quality: 92 });
  await b.close();
  fs.unlinkSync(tmp);
  if (overflow.length) { console.error('ADVERTENCIA: texto desbordado en slide(s) ' + overflow.join(', ')); process.exitCode = 2; }
  console.log(`OK ${N} slides -> ${dir}`);
})();
