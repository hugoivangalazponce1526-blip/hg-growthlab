/*!
 * LABI · mascota de HG Growth Lab · versión estática para el motor de carruseles.
 * Copia fiel del dibujo de claude/labi.js (kit v1.3) sin la parte de animación (GSAP).
 * Uso: require('./labi').svg({ pose: 'saludo', expresion: 'feliz', espejo: false })
 * POSES: neutral, saludo, apuntar, arriba, explicar, celebrar, pensar, sorpresa, preocupado
 * EXPRESIONES: feliz, celebrando, sorprendido, pensando, guino, preocupado, hablando, encantado
 */
'use strict';
var C = { negro: '#1A1A1A', oro: '#C9A84C', oroOsc: '#7A5F1C', crema: '#FFFDF7' };
var CUERPO = 'M170 70 L170 160 L88 300 Q76 330 108 334 L292 334 Q324 330 312 300 L230 160 L230 70 Z';
var SEG = 34;
var VB = '-30 -70 460 480';
var contador = 0;

var POSES = {
  neutral:    { L: [165, -50], R: [165, -50] },
  saludo:     { L: [195, 55], R: [165, -50] },
  apuntar:    { L: [165, -50], R: [190, 10, true], lean: 3, mirada: [5, 0] },
  arriba:     { L: [165, -50], R: [235, 20, true], lean: 2, mirada: [3, -5] },
  explicar:   { L: [150, 50], R: [155, 43] },
  celebrar:   { L: [215, 30], R: [211, 37], salto: -16, brote: -5, extra: 'confeti' },
  pensar:     { L: [165, -50], R: [90, -115], lean: -3, mirada: [4, -2], extra: 'pensamiento' },
  sorpresa:   { L: [200, 80], R: [204, 73], extra: 'sorpresa' },
  preocupado: { L: [140, -45], R: [144, -41], brote: 38, extra: 'gota' }
};
var EXPRESIONES = {
  feliz:       ['normal', 'sonrisa'],
  celebrando:  ['arcos', 'grande'],
  sorprendido: ['grandes', 'o'],
  pensando:    ['arriba', 'plana'],
  guino:       ['guino', 'sonrisa'],
  preocupado:  ['tristes', 'mueca'],
  hablando:    ['normal', 'abierta'],
  encantado:   ['corazones', 'grande']
};
var EXPRESION_DE_POSE = {
  neutral: 'feliz', saludo: 'feliz', apuntar: 'feliz', arriba: 'feliz', explicar: 'hablando',
  celebrar: 'celebrando', pensar: 'pensando', sorpresa: 'sorprendido', preocupado: 'preocupado'
};

function corazon(cx, cy) {
  return '<path d="M' + cx + ' ' + (cy + 9) + ' C' + (cx - 13) + ' ' + (cy - 1) + ' ' + (cx - 7) + ' ' + (cy - 11) + ' ' + cx + ' ' + (cy - 3) +
    ' C' + (cx + 7) + ' ' + (cy - 11) + ' ' + (cx + 13) + ' ' + (cy - 1) + ' ' + cx + ' ' + (cy + 9) + ' Z" fill="' + C.oro + '"/>';
}
var trazo = ' fill="none" stroke="' + C.oro + '" stroke-linecap="round" stroke-linejoin="round"';
var OJOS = {
  normal: '<rect x="172" y="242" width="14" height="22" rx="7" fill="' + C.oro + '"/><rect x="214" y="242" width="14" height="22" rx="7" fill="' + C.oro + '"/>',
  arcos: '<path d="M171 258 Q179 242 187 258"' + trazo + ' stroke-width="5.5"/><path d="M213 258 Q221 242 229 258"' + trazo + ' stroke-width="5.5"/>',
  grandes: '<circle cx="179" cy="253" r="9.5" fill="' + C.oro + '"/><circle cx="221" cy="253" r="9.5" fill="' + C.oro + '"/>',
  arriba: '<rect x="177" y="238" width="14" height="18" rx="7" fill="' + C.oro + '"/><rect x="219" y="238" width="14" height="18" rx="7" fill="' + C.oro + '"/>',
  guino: '<rect x="172" y="242" width="14" height="22" rx="7" fill="' + C.oro + '"/><path d="M213 257 Q221 246 229 257"' + trazo + ' stroke-width="5.5"/>',
  tristes: '<rect x="172" y="247" width="14" height="17" rx="7" fill="' + C.oro + '"/><rect x="214" y="247" width="14" height="17" rx="7" fill="' + C.oro + '"/>' +
    '<path d="M170 243 L187 237"' + trazo + ' stroke-width="4"/><path d="M213 237 L230 243"' + trazo + ' stroke-width="4"/>',
  corazones: corazon(179, 253) + corazon(221, 253)
};
var BOCAS = {
  sonrisa: '<path d="M188 276 Q200 285 212 276"' + trazo + ' stroke-width="5"/>',
  grande: '<path d="M186 272 L214 272 Q200 290 186 272 Z" fill="' + C.oro + '" stroke="' + C.oro + '" stroke-width="3" stroke-linejoin="round"/>',
  o: '<ellipse cx="200" cy="279" rx="5.5" ry="6.5"' + trazo + ' stroke-width="4.5"/>',
  plana: '<path d="M192 279 L210 276"' + trazo + ' stroke-width="5"/>',
  mueca: '<path d="M189 283 Q200 274 211 283"' + trazo + ' stroke-width="5"/>',
  abierta: '<ellipse cx="200" cy="279" rx="8" ry="6" fill="' + C.oro + '"/>',
  media: '<ellipse cx="200" cy="279" rx="6" ry="3.5" fill="' + C.oro + '"/>'
};
var CONFETI = [
  [58, 118, 'e', C.oro, 0], [344, 128, 'e', C.oro, 0], [96, 36, 'r', C.negro, 20], [312, 30, 'r', C.oro, -25],
  [30, 196, 'c', C.negro, 0], [372, 204, 'c', C.oro, 0], [100, -30, 'e', C.negro, 0], [304, -34, 'c', C.negro, 0],
  [12, 84, 'r', C.oro, -15], [388, 74, 'r', C.negro, 30], [140, -52, 'c', C.oro, 0], [262, -50, 'r', C.oro, 12]
];
var PENSAMIENTO = [[272, 150, 5], [290, 124, 7.5], [314, 92, 11]];

function pieza(p) {
  if (p[2] === 'e') return '<path d="M0 -11 L3.2 -3.2 L11 0 L3.2 3.2 L0 11 L-3.2 3.2 L-11 0 L-3.2 -3.2 Z" fill="' + p[3] + '"/>';
  if (p[2] === 'r') return '<rect x="-8" y="-4" width="16" height="8" rx="2" fill="' + p[3] + '"/>';
  return '<circle cx="0" cy="0" r="5" fill="' + p[3] + '"/>';
}

function brazo(lado, ang) {
  var base = lado === 'L' ? 'translate(104,268)' : 'translate(296,268) scale(-1,1)';
  var linea = '<path d="M0 0 L' + SEG + ' 0" fill="none" stroke="' + C.negro + '" stroke-width="10" stroke-linecap="round"/>';
  var dedo = ang[2]
    ? '<path d="M' + SEG + ' 0 L' + (SEG + 21) + ' 0" fill="none" stroke="' + C.negro + '" stroke-width="8" stroke-linecap="round"/>'
    : '';
  return '<g transform="' + base + '"><g transform="rotate(' + ang[0] + ')">' + linea +
    '<g transform="translate(' + SEG + ',0)"><g transform="rotate(' + ang[1] + ')">' + linea + dedo +
    '<circle cx="' + SEG + '" cy="0" r="11" fill="' + C.oro + '" stroke="' + C.negro + '" stroke-width="4"/></g></g>' +
    '<circle cx="' + SEG + '" cy="0" r="7" fill="' + C.oro + '" stroke="' + C.negro + '" stroke-width="3.5"/></g></g>';
}

function extras(nombre) {
  if (nombre === 'pensamiento') return PENSAMIENTO.map(function (d) {
    return '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="' + d[2] + '" fill="' + C.crema + '" stroke="' + C.negro + '" stroke-width="4"/>';
  }).join('');
  if (nombre === 'sorpresa') return ['M124 146 L104 132', 'M116 178 L92 172', 'M276 146 L296 132', 'M284 178 L308 172'].map(function (d) {
    return '<path d="' + d + '" fill="none" stroke="' + C.negro + '" stroke-width="6" stroke-linecap="round"/>';
  }).join('');
  if (nombre === 'gota') return '<path d="M266 166 Q253 188 266 195 Q279 188 266 166 Z" fill="' + C.crema + '" stroke="' + C.negro + '" stroke-width="4" stroke-linejoin="round"/>';
  return '';
}

function svg(o) {
  o = o || {};
  var pose = POSES[o.pose] ? o.pose : 'neutral';
  var P = POSES[pose];
  var exp = EXPRESIONES[o.expresion] ? o.expresion : EXPRESION_DE_POSE[pose];
  var E = EXPRESIONES[exp];
  var conExtras = o.extras !== false;
  var id = 'labi-clip-' + (o.id || ++contador);
  var k = C.negro, oro = C.oro;
  var tChar = !P.salto ? '' : ' transform="translate(0,' + P.salto + ')"';
  var tLean = !P.lean ? '' : ' transform="rotate(' + P.lean + ' 200 334)"';
  var tBrote = ' transform="rotate(' + (P.brote || 0) + ' 200 58)"';
  var tMirada = !P.mirada ? '' : ' transform="translate(' + P.mirada[0] + ',' + P.mirada[1] + ')"';
  var s = '';

  s += '<svg xmlns="http://www.w3.org/2000/svg" class="labi" viewBox="' + VB + '" width="100%" height="100%" role="img" aria-label="Labi, la mascota de HG Growth Lab">';
  s += '<defs><clipPath id="' + id + '"><path d="' + CUERPO + '"/></clipPath></defs>';
  s += '<g' + (o.espejo ? ' transform="translate(400,0) scale(-1,1)"' : '') + '>';
  if (o.sombra !== false) {
    var sx = P.salto ? 0.8 : 1;
    s += '<ellipse cx="200" cy="386" rx="' + (118 * sx) + '" ry="11" fill="' + k + '" opacity="0.10"/>';
  }
  s += '<g' + tChar + '>';
  s += '<g><path d="M164 330 L160 366" stroke="' + k + '" stroke-width="10" stroke-linecap="round" fill="none"/>';
  s += '<rect x="136" y="362" width="42" height="16" rx="8" fill="' + oro + '" stroke="' + k + '" stroke-width="4"/></g>';
  s += '<g><path d="M236 330 L240 366" stroke="' + k + '" stroke-width="10" stroke-linecap="round" fill="none"/>';
  s += '<rect x="222" y="362" width="42" height="16" rx="8" fill="' + oro + '" stroke="' + k + '" stroke-width="4"/></g>';
  s += '<g' + tLean + '><g>';
  s += '<path d="' + CUERPO + '" fill="' + C.crema + '"/>';
  s += '<g clip-path="url(#' + id + ')">';
  s += '<path d="M50 212 Q80 205 110 212 T170 212 T230 212 T290 212 T350 212 L350 344 L50 344 Z" fill="' + oro + '"/>';
  s += '<path d="M110 296 L132 258" stroke="' + C.crema + '" stroke-width="8" stroke-linecap="round" opacity="0.65" fill="none"/>';
  s += '<path d="M112 320 L150 320 L164 306 L164 292" stroke="' + C.oroOsc + '" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
  s += '<path d="M288 320 L250 320 L236 306 L236 292" stroke="' + C.oroOsc + '" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
  s += '<path d="M200 292 L200 314" stroke="' + C.oroOsc + '" stroke-width="3.5" stroke-linecap="round" fill="none"/>';
  [[112, 320], [200, 318], [288, 320]].forEach(function (n) {
    s += '<circle cx="' + n[0] + '" cy="' + n[1] + '" r="5" fill="' + C.crema + '" stroke="' + C.oroOsc + '" stroke-width="3"/>';
  });
  s += '</g>';
  s += '<rect x="186" y="184" width="11" height="11" rx="2.5" fill="none" stroke="' + oro + '" stroke-width="3.5"/>';
  s += '<rect x="206" y="170" width="9" height="9" rx="2" fill="' + oro + '"/>';
  s += '<rect x="194" y="156" width="10" height="10" rx="2.5" fill="none" stroke="' + oro + '" stroke-width="3.5"/>';
  s += '<rect x="150" y="230" width="100" height="62" rx="20" fill="' + k + '"/>';
  s += '<g' + tMirada + '>' + OJOS[E[0]] + '</g>';
  s += BOCAS[E[1]];
  s += '<path d="' + CUERPO + '" fill="none" stroke="' + k + '" stroke-width="10" stroke-linejoin="round"/>';
  s += '<rect x="156" y="58" width="88" height="22" rx="11" fill="' + k + '"/>';
  [182, 200, 218].forEach(function (x) { s += '<circle cx="' + x + '" cy="69" r="3.5" fill="' + oro + '"/>'; });
  s += '<g' + tBrote + '>';
  s += '<path d="M200 58 Q196 30 204 6" stroke="' + k + '" stroke-width="8" stroke-linecap="round" fill="none"/>';
  s += '<path d="M203 14 Q168 16 152 -14 Q190 -18 203 14 Z" fill="' + oro + '" stroke="' + k + '" stroke-width="6" stroke-linejoin="round"/>';
  s += '<path d="M204 4 Q236 2 250 -26 Q214 -30 204 4 Z" fill="' + oro + '" stroke="' + k + '" stroke-width="6" stroke-linejoin="round"/>';
  s += '<path d="M194 7 L170 -6" stroke="' + k + '" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="168" cy="-7" r="3.5" fill="' + k + '"/>';
  s += '<path d="M213 -3 L236 -17" stroke="' + k + '" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="238" cy="-18" r="3.5" fill="' + k + '"/>';
  s += '</g>';
  s += brazo('L', P.L) + brazo('R', P.R);
  s += '</g>';
  if (conExtras && P.extra !== 'confeti') s += extras(P.extra);
  s += '</g></g>';
  if (conExtras && P.extra === 'confeti') {
    s += '<g>';
    CONFETI.forEach(function (p) {
      s += '<g transform="translate(' + p[0] + ',' + p[1] + ') rotate(' + p[4] + ')">' + pieza(p) + '</g>';
    });
    s += '</g>';
  }
  s += '</g></svg>';
  return s;
}

module.exports = { svg: svg, POSES: Object.keys(POSES), EXPRESIONES: Object.keys(EXPRESIONES) };
