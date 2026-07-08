// =========================================================
// PALLSTON — DECISION FIELDS v4
// Fine-line illustrations, one per subject. Each drawing is
// built from ruler-and-compass geometry — hairline strokes,
// no fills, restrained detail — and each carries exactly one
// emerald square: the brand, placed where the meaning lives.
//
//   hero            clarity — trajectories converge on one
//                   decision; a confident path continues
//   analyze         a lens over the data, the finding inside
//   execute         schedule bars, a milestone met on time
//   transform       an ascending stair, the top step reached
//   advisory        a compass — direction chosen
//   delivery        a program timeline — milestones aligned
//   modernization   one building, renewed wing by wing
//   federal         a portico — institution, order, proportion
//   state-local     a suspension bridge — public infrastructure
//   commercial      towers and a rising performance line
//   capabilities    concentric squares — built around what matters
//   industries      a skyline of sectors on one ground line
//   figure          an open report, one insight marked
//   contact         two panels of a conversation
//
// Conventions: strokes styled in CSS (.fl*), 0.75–1.25px,
// vector-effect keeps them hairline at any size; pathLength
// normalizes the draw-on animation; --fi staggers the draw
// (structure first, detail after; the emerald arrives last).
// =========================================================

const q = n => Math.round(n * 10) / 10;

function P(d, cls, fi) {
  const style = fi != null ? ` style="--fi:${fi}"` : '';
  return `<path class="${cls}" d="${d}" pathLength="100" vector-effect="non-scaling-stroke"${style}/>`;
}

function sq(cx, cy, s, cls) {
  return `<rect class="${cls}" x="${q(cx - s / 2)}" y="${q(cy - s / 2)}" width="${s}" height="${s}"/>`;
}

function line(x0, y0, x1, y1) {
  return `M${q(x0)},${q(y0)} L${q(x1)},${q(y1)}`;
}

function cubic(x0, y0, cx1, cy1, cx2, cy2, x1, y1) {
  return `M${q(x0)},${q(y0)} C${q(cx1)},${q(cy1)} ${q(cx2)},${q(cy2)} ${q(x1)},${q(y1)}`;
}

function circle(cx, cy, r) {
  return `M${q(cx - r)},${q(cy)} A${r},${r} 0 1 1 ${q(cx + r)},${q(cy)} A${r},${r} 0 1 1 ${q(cx - r)},${q(cy)}`;
}

function rect(x, y, w, h) {
  return `M${q(x)},${q(y)} L${q(x + w)},${q(y)} L${q(x + w)},${q(y + h)} L${q(x)},${q(y + h)} Z`;
}

function rrect(x0, y0, x1, y1, r) {
  return `M${q(x0 + r)},${q(y0)} L${q(x1 - r)},${q(y0)} A${r},${r} 0 0 1 ${q(x1)},${q(y0 + r)} L${q(x1)},${q(y1 - r)} A${r},${r} 0 0 1 ${q(x1 - r)},${q(y1)} L${q(x0 + r)},${q(y1)} A${r},${r} 0 0 1 ${q(x0)},${q(y1 - r)} L${q(x0)},${q(y0 + r)} A${r},${r} 0 0 1 ${q(x0 + r)},${q(y0)} Z`;
}

// polyline through points
function poly(pts) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${q(p[0])},${q(p[1])}`).join(' ');
}

// upper semicircle, drawn left → right over the top (a dome, a cupola)
function semi(cx, cy, r) {
  return `M${q(cx - r)},${q(cy)} A${r},${r} 0 0 1 ${q(cx + r)},${q(cy)}`;
}

// horizontal-tangent join: leaves (x0,y0) flat, arrives at (x1,y1) flat
function flow(x0, y0, x1, y1, k = 0.5) {
  const dx = (x1 - x0) * k;
  return `C${q(x0 + dx)},${q(y0)} ${q(x1 - dx)},${q(y1)} ${q(x1)},${q(y1)}`;
}

function svg(name, vb, inner, ratio) {
  const pra = ratio || 'xMidYMid meet';
  return `<svg class="field field--${name}" viewBox="${vb}" preserveAspectRatio="${pra}" aria-hidden="true" focusable="false">${inner}</svg>`;
}

// ---------------------------------------------------------
// HERO — clarity. Faint trajectories converge on one
// decision; a single confident path continues off the page.
// ---------------------------------------------------------
function hero() {
  const W = 980, H = 640;
  const D = { x: 598, y: 320 };
  const parts = [];

  // The whole brand in one drawing: many uncertain trajectories
  // enter from the left, gather smoothly, and resolve at a single
  // point of clarity — the emerald square. From it, a confident,
  // ordered set of parallel paths continues, unhurried, off the
  // page. Confidence begins where the noise becomes one clear line.
  const N = 17;
  for (let j = 0; j < N; j++) {
    const t = j - (N - 1) / 2;                       // -8 … 8
    const spread = t * 38 + 7 * Math.sin(j * 1.9);   // fanned, faintly irregular
    const y0 = D.y + spread;
    const d = cubic(
      -2, y0,
      D.x * 0.34, y0,                                // hold flat off the edge
      D.x - 172, D.y + spread * 0.12,                // then sweep toward the point
      D.x - 5, D.y + t * 0.22
    );
    parts.push(P(d, 'fl fl--faint', Math.min(6, Math.abs(t) + 1)));
  }

  // clarity: five confident, evenly-spaced paths leaving the point,
  // the middle one emerald — the decision carried forward
  const outs = [-30, -15, 0, 15, 30];
  outs.forEach((dy, i) => {
    const d = `M${q(D.x)},${q(D.y)} ${flow(D.x, D.y, D.x + 168, D.y + dy, 0.5)} L${W + 2},${q(D.y + dy)}`;
    parts.push(P(d, dy === 0 ? 'fl fl--em' : 'fl', 7 + Math.abs(i - 2)));
  });

  parts.push(sq(D.x, D.y, 17, 'fn fn--em fn--origin'));
  return svg('hero', `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// METHOD — three small instruments of the practice.
// ---------------------------------------------------------
function methodStep(kind) {
  const W = 240, H = 84;
  const parts = [];

  if (kind === 'analyze') {
    // a lens over the data; the finding sits inside it
    [[8, 28, 128], [8, 42, 112], [8, 56, 122]].forEach(([x0, y, x1], i) =>
      parts.push(P(line(x0, y, x1, y), 'fl fl--faint', i)));
    parts.push(P(circle(152, 42, 30), 'fl', 2));
    parts.push(P(line(173.5, 63.5, 196, 80), 'fl', 3));
    parts.push(sq(152, 42, 8, 'fn fn--em'));
  }

  if (kind === 'execute') {
    // schedule bars against a datum; the milestone met on time
    parts.push(P(rect(20, 12, 110, 11), 'fl', 0));
    parts.push(P(rect(20, 36, 150, 11), 'fl', 1));
    parts.push(P(rect(20, 60, 88, 11), 'fl', 2));
    parts.push(P(line(170, 4, 170, 80), 'fl fl--datum', 3));
    parts.push(sq(170, 41.5, 8, 'fn fn--em'));
  }

  if (kind === 'transform') {
    // an ascending stair; the top step reached
    parts.push(P(line(20, 74, 220, 74), 'fl fl--faint', 0));
    parts.push(P(poly([[20, 74], [70, 74], [70, 54], [120, 54], [120, 34], [170, 34], [170, 14], [222, 14]]), 'fl', 1));
    parts.push(sq(216, 14, 8, 'fn fn--em'));
  }

  return svg(`step step--${kind}`, `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// STRATEGIC ADVISORY — a compass. Every direction was
// considered; one was chosen.
// ---------------------------------------------------------
function advisory() {
  const W = 560, H = 520, cx = 280, cy = 260;
  const parts = [];

  parts.push(P(circle(cx, cy, 180), 'fl', 0));
  parts.push(P(circle(cx, cy, 132), 'fl fl--datum', 1));

  // cardinal and intercardinal bearings
  for (let k = 0; k < 8; k++) {
    const a = (k * 45 * Math.PI) / 180;
    const long = k % 2 === 0;
    const r0 = long ? 180 : 178, r1 = long ? 156 : 166;
    parts.push(P(line(cx + r0 * Math.cos(a), cy - r0 * Math.sin(a), cx + r1 * Math.cos(a), cy - r1 * Math.sin(a)), long ? 'fl' : 'fl fl--faint', 2));
  }

  // the needle: a long point north-east, a short counterweight
  const a = Math.PI / 4;
  const tip = [cx + 118 * Math.cos(a), cy - 118 * Math.sin(a)];
  const tail = [cx - 44 * Math.cos(a), cy + 44 * Math.sin(a)];
  const side = [11 * Math.cos(a + Math.PI / 2), -11 * Math.sin(a + Math.PI / 2)];
  parts.push(P(poly([tip, [cx + side[0], cy + side[1]], tail, [cx - side[0], cy - side[1]]]) + ' Z', 'fl', 3));
  parts.push(P(circle(cx, cy, 7), 'fl', 3));

  parts.push(sq(tip[0], tip[1], 11, 'fn fn--em'));
  return svg('advisory', `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// PROGRAM DELIVERY — the program plan itself: a timeline,
// cascading workstreams, and one milestone met on schedule.
// ---------------------------------------------------------
function delivery() {
  const W = 560, H = 520;
  const parts = [];

  // the timeline and its calendar ticks
  parts.push(P(line(60, 90, 500, 90), 'fl', 0));
  for (let x = 60; x <= 500; x += 55) parts.push(P(line(x, 84, x, 96), 'fl fl--faint', 1));

  // cascading workstreams
  const bars = [
    [60, 140, 170, 'fl'], [120, 205, 200, 'fl'], [230, 270, 150, 'fl'],
    [300, 335, 160, 'fl fl--faint'], [380, 400, 120, 'fl fl--faint']
  ];
  bars.forEach(([x, y, w, cls], i) => parts.push(P(rect(x, y, w, 26), cls, 1 + i)));

  // today: the report line every stream answers to
  parts.push(P(line(350, 68, 350, 452), 'fl fl--datum', 6));

  parts.push(sq(380, 283, 11, 'fn fn--em'));
  return svg('delivery', `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// MODERNIZATION — the operating model, brought to a modern
// standard. Three layers — the strategy that directs, the
// systems that run, and the workforce that carries it —
// integrated into one whole. Legacy parts (faint) are drawn
// into the model rather than torn out; nothing that works is
// disrupted. The emerald square is the modern standard, set
// where systems and people meet.
// ---------------------------------------------------------
function modernization() {
  const W = 560, H = 520;
  const parts = [];
  const cols = [214, 306, 398];          // the integrated columns of the model
  const yModel = 150, ySys = 258, yPeople = 360;
  const modR = 26;                        // system module half-size
  const seam = 176;

  // the three integrating columns (model → systems → workforce)
  cols.forEach((x, i) => parts.push(P(line(x, yModel, x, yPeople + 20), 'fl fl--faint', 4 + i)));

  // STRATEGY — the directing layer, one clean line across the model
  parts.push(P(line(seam, yModel, 470, yModel), 'fl', 2));

  // SYSTEMS — a row of modern modules
  cols.forEach((x, i) => parts.push(P(rect(x - modR, ySys - modR, modR * 2, modR * 2), 'fl', 2 + i)));

  // WORKFORCE — a row of people, enabled and aligned
  cols.forEach((x, i) => parts.push(P(circle(x, yPeople, 20), 'fl', 3 + i)));

  // LEGACY, drawn in (not torn out): faint older parts migrating into the model
  parts.push(P(rect(70, ySys - 20, 40, 40), 'fl fl--faint', 0));
  parts.push(P(`M110,${ySys} ${flow(110, ySys, cols[0] - modR, ySys, 0.6)}`, 'fl fl--faint', 1));
  parts.push(P(circle(84, yPeople, 15), 'fl fl--faint', 0));
  parts.push(P(`M99,${yPeople} ${flow(99, yPeople, cols[0] - 20, yPeople, 0.6)}`, 'fl fl--faint', 1));
  parts.push(P(`M70,${yModel} L${seam},${yModel}`, 'fl fl--faint', 1));

  // the modern standard, set where systems meet the strategy above
  parts.push(sq(cols[1], ySys, 15, 'fn fn--em'));
  return svg('modernization', `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// FEDERAL — a portico: steps, columns, entablature, pediment.
// Institution reduced to proportion.
// ---------------------------------------------------------
function federal() {
  const W = 560, H = 520;
  const parts = [];

  // steps
  parts.push(P(line(80, 430, 480, 430), 'fl', 0));
  parts.push(P(line(100, 410, 460, 410), 'fl', 1));
  parts.push(P(line(120, 390, 440, 390), 'fl', 2));

  // columns, drawn double like a section
  [160, 220, 280, 340, 400].forEach((x, i) => {
    parts.push(P(line(x - 6, 184, x - 6, 390), 'fl', 3 + (i % 3)));
    parts.push(P(line(x + 6, 184, x + 6, 390), 'fl', 3 + (i % 3)));
  });

  // entablature and pediment
  parts.push(P(line(120, 184, 440, 184), 'fl', 4));
  parts.push(P(line(112, 166, 448, 166), 'fl', 5));
  parts.push(P(line(112, 166, 280, 82), 'fl', 6));
  parts.push(P(line(448, 166, 280, 82), 'fl', 6));

  parts.push(sq(280, 132, 10, 'fn fn--em'));
  return svg('federal', `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// STATE & LOCAL — the town hall: a civic building with a
// central clock tower and two flanking wings. Municipal,
// approachable, accountable — and distinct in register from
// the federal portico.
// ---------------------------------------------------------
function stateLocal() {
  const W = 560, H = 520, cx = 280;
  const parts = [];
  const ground = 442;

  // steps
  parts.push(P(line(96, ground, 464, ground), 'fl', 0));
  parts.push(P(line(120, 424, 440, 424), 'fl', 1));
  parts.push(P(line(144, 406, 416, 406), 'fl fl--faint', 1));

  // flanking wings, low and even
  [[150, 240], [320, 410]].forEach(([x0, x1], w) => {
    parts.push(P(poly([[x0, 406], [x0, 300], [x1, 300], [x1, 406]]), 'fl', 2));
    const bays = w === 0 ? [172, 202] : [348, 378];
    bays.forEach((x) => parts.push(P(rect(x, 328, 18, 50), 'fl fl--faint', 3)));
    parts.push(P(line(x0, 300, x1, 300), 'fl', 2));
  });

  // the central tower
  parts.push(P(poly([[240, 300], [240, 150], [320, 150], [320, 300]]), 'fl', 3));
  parts.push(P(poly([[230, 150], [cx, 108], [330, 150]]), 'fl', 4));   // pediment
  parts.push(P(line(cx, 108, cx, 88), 'fl', 5));                        // finial mast
  parts.push(P(semi(cx, 88, 11), 'fl', 5));                             // cupola

  // the clock: the civic square is its face
  parts.push(P(circle(cx, 210, 24), 'fl', 5));
  parts.push(P(line(cx, 210, cx, 195), 'fl fl--faint', 6));
  parts.push(P(line(cx, 210, cx + 12, 214), 'fl fl--faint', 6));
  parts.push(sq(cx, 210, 12, 'fn fn--em'));

  // the door: an arched civic entrance
  parts.push(P(`M264,300 L264,268 A16,16 0 0 1 296,268 L296,300`, 'fl fl--faint', 4));
  return svg('state-local', `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// COMMERCIAL — a single, confident enterprise tower: a
// modern glass high-rise with a set-back crown and a marked
// floor. Performance drawn as architecture, not a chart.
// ---------------------------------------------------------
function commercial() {
  const W = 560, H = 520;
  const parts = [];
  const ground = 442, L = 202, R = 358;

  parts.push(P(line(70, ground, 490, ground), 'fl', 0));

  // shaft
  parts.push(P(poly([[L, ground], [L, 146], [R, 146], [R, ground]]), 'fl', 1));
  // set-back crown
  parts.push(P(poly([[228, 146], [228, 92], [332, 92], [332, 146]]), 'fl', 2));
  parts.push(P(line(280, 92, 280, 74), 'fl fl--faint', 3));            // mast

  // curtain-wall mullions and floor plates
  [230, 256, 280, 304, 330].forEach((x, i) => parts.push(P(line(x, 154, x, ground - 6), 'fl', 2 + (i % 2))));
  [252, 308].forEach((x) => parts.push(P(line(x, 100, x, 146), 'fl fl--faint', 3)));
  for (let y = 176; y < ground - 6; y += 26) parts.push(P(line(L + 6, y, R - 6, y), 'fl fl--faint', 4));

  // lobby
  parts.push(P(rrect(262, 402, 298, ground, 6), 'fl', 3));

  // one floor marked: the enterprise's high-water line
  parts.push(sq(304, 254, 13, 'fn fn--em'));
  return svg('commercial', `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// CAPABILITIES — built around what matters: concentric
// squares closing on the point of it.
// ---------------------------------------------------------
function capabilities() {
  const W = 760, H = 520, cx = 400, cy = 260;
  const parts = [];

  parts.push(P(line(-2, cy, cx - 160, cy), 'fl fl--faint', 0));
  parts.push(P(rect(cx - 160, cy - 160, 320, 320), 'fl fl--faint', 1));
  parts.push(P(rect(cx - 110, cy - 110, 220, 220), 'fl', 2));
  parts.push(P(rect(cx - 60, cy - 60, 120, 120), 'fl', 3));

  // registration ticks at the outer midpoints
  parts.push(P(line(cx, cy - 174, cx, cy - 160), 'fl fl--faint', 2));
  parts.push(P(line(cx, cy + 160, cx, cy + 174), 'fl fl--faint', 2));
  parts.push(P(line(cx + 160, cy, cx + 174, cy), 'fl fl--faint', 2));

  parts.push(sq(cx, cy, 12, 'fn fn--em'));
  return svg('capabilities', `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// INDUSTRIES — every sector we serve, drawn as one unbroken
// line: a single stroke rises over the domed institution, the
// town hall, the hospital, the enterprise tower, the works,
// the bridge, and the utility line — one firm, one standard,
// tracing them all. The emerald square crowns the tallest.
// ---------------------------------------------------------
function industries() {
  const W = 1040, H = 420;
  const parts = [];
  const eave = 338, base = 358;

  parts.push(P(line(-2, base, W + 2, base), 'fl fl--faint', 1));

  // the skyline, one continuous contour left → right, over every sector
  let d = `M-2,${eave}`;
  d += ` L40,${eave} L40,300 C40,254 150,254 150,300 L150,${eave}`;                                 // federal — a domed institution
  d += ` L176,${eave} L176,300 L186,300 L186,252 L200,236 L214,252 L214,300 L224,300 L224,${eave}`;  // state & local — town hall + clock
  d += ` L262,${eave} L262,296 L330,296 L330,${eave}`;                                               // healthcare — a hospital
  d += ` L356,${eave} L356,150 L372,150 L372,132 L394,132 L394,150 L408,150 L408,${eave}`;           // commercial — the enterprise tower
  d += ` L430,${eave} L430,320 L458,300 L458,320 L486,300 L486,320 L514,300 L514,${eave}`;           // manufacturing — a sawtooth works
  d += ` L544,${eave} L544,240 L708,240 L708,${eave}`;                                               // supply chain — a container gantry
  d += ` L740,${eave} C740,298 892,298 892,${eave}`;                                                 // transportation — a road bridge
  d += ` L912,${eave} L932,288 L952,${eave}`;                                                        // utilities — a transmission pylon
  d += ` L${W + 2},${eave}`;
  parts.push(P(d, 'fl', 2));

  // the quiet details that live within each silhouette
  parts.push(P(line(200, 236, 200, 228), 'fl', 3));               // town hall finial
  parts.push(P(circle(200, 276, 8), 'fl fl--faint', 3));          // clock
  parts.push(P(line(289, 314, 303, 314), 'fl fl--faint', 3));     // hospital cross
  parts.push(P(line(296, 307, 296, 321), 'fl fl--faint', 3));
  for (let y = 176; y < eave - 8; y += 28) parts.push(P(line(362, y, 402, y), 'fl fl--faint', 4)); // tower floors
  parts.push(P(line(440, 300, 440, 262), 'fl', 3));               // factory chimney

  // supply chain & logistics — the container yard beneath the gantry
  parts.push(P(line(626, 240, 626, 224), 'fl fl--faint', 3));                 // gantry trolley rail out
  parts.push(P(line(626, 224, 626, 268), 'fl', 4));                           // hoist
  const cont = (x, y) => parts.push(P(rect(x, y, 30, 16), 'fl fl--faint', 5));
  [556, 588, 620, 652, 684].forEach((x) => cont(x, 322));                     // bottom row
  [572, 604, 636, 668].forEach((x) => cont(x, 304));                          // second row
  [604, 636].forEach((x) => cont(x, 286));                                    // third row
  parts.push(P(rect(618, 268, 26, 16), 'fl', 4));                             // the container on the hook

  // transportation — the bridge deck, piers, and lane
  parts.push(P(line(740, eave, 892, eave), 'fl fl--faint', 3));
  [780, 852].forEach((x) => parts.push(P(line(x, 306, x, eave), 'fl fl--faint', 3)));
  for (let x = 748; x < 892; x += 22) parts.push(P(line(x, 348, x + 10, 348), 'fl fl--faint', 4)); // road dashes

  // utilities — pylon stem, arms, and the line carried off
  parts.push(P(line(932, 288, 932, eave), 'fl fl--faint', 3));
  parts.push(P(line(918, 304, 946, 304), 'fl fl--faint', 3));
  parts.push(P(line(922, 316, 942, 316), 'fl fl--faint', 3));
  parts.push(P(cubic(952, eave, 1000, 330, 1010, 326, 1042, 330), 'fl fl--faint', 4));

  // the emerald square crowns the tallest sector — the one standard held across them all
  parts.push(sq(383, 141, 12, 'fn fn--em'));
  return svg('industries', `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// PERSPECTIVES — ideas, drawn as perspective itself: many
// lines of sight receding to a single vanishing point on the
// horizon. Every viewpoint resolves to one clear idea.
// ---------------------------------------------------------
function figure() {
  const W = 560, H = 420;
  const VP = { x: 322, y: 196 };
  const parts = [];

  // the horizon — the level of understanding
  parts.push(P(line(40, VP.y, 520, VP.y), 'fl fl--datum', 1));

  // sight lines from the foreground converging on the idea
  [[36, 60], [204, 384], [402, 384], [524, 60], [36, 300], [524, 300]].forEach(([x, y], i) =>
    parts.push(P(line(x, y, VP.x, VP.y), 'fl', 2 + (i % 3))));

  // receding transversals — the plane of thought, foreshortened
  [372, 320, 280, 248, 224].forEach((y, i) => {
    const t = (y - VP.y) / (372 - VP.y);        // 1 at front → 0 at the point
    const hw = 150 * t + 8;
    parts.push(P(line(VP.x - hw, y, VP.x + hw, y), 'fl fl--faint', 3 + i));
  });

  // one considered line of sight, carried in emerald
  parts.push(P(line(204, 384, VP.x, VP.y), 'fl fl--em', 6));
  parts.push(sq(VP.x, VP.y, 12, 'fn fn--em'));
  return svg('figure', `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// CONTACT — the journey returns to where it began. Two
// parties' paths — yours and ours — arrive with confidence
// at one point, and continue forward together as a single
// clear line. The hero's clarity, now shared.
// ---------------------------------------------------------
function contact() {
  const W = 760, H = 520;
  const D = { x: 336, y: 260 };
  const parts = [];

  // two considered approaches, arriving assured (solid, not faint)
  const yours = [176, 214, 252];
  const ours = [268, 306, 344];
  yours.forEach((y, i) => parts.push(P(cubic(-2, y, 150, y, D.x - 150, D.y + (y - D.y) * 0.16, D.x - 5, D.y - 3), 'fl', 1 + i)));
  ours.forEach((y, i) => parts.push(P(cubic(-2, y, 150, y, D.x - 150, D.y + (y - D.y) * 0.16, D.x - 5, D.y + 3), 'fl', 1 + i)));

  // forward, together: one confident emerald line, off the page
  parts.push(P(`M${q(D.x)},${q(D.y)} ${flow(D.x, D.y, D.x + 180, D.y, 0.5)} L${W + 2},${q(D.y)}`, 'fl fl--em', 5));

  parts.push(sq(D.x, D.y, 15, 'fn fn--em fn--origin'));
  return svg('contact', `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// LAB — a concept on the drafting board: datums, a compass
// sweep, and registration brackets closing on the idea as it
// is realized. The emerald square is the concept, drawn true.
// ---------------------------------------------------------
function lab() {
  const W = 760, H = 520, cx = 400, cy = 260, half = 66, tick = 22;
  const parts = [];

  // datums
  parts.push(P(line(120, cy, 680, cy), 'fl fl--faint', 0));
  parts.push(P(line(cx, 72, cx, 448), 'fl fl--faint', 0));

  // a compass sweep and its radius — the concept being struck
  parts.push(P(`M${q(cx - 172)},${cy} A172,172 0 0 1 ${q(cx + 172)},${cy}`, 'fl fl--faint', 1));
  parts.push(P(line(cx, cy, cx + 172 * Math.cos(-Math.PI / 4), cy - 172 * Math.sin(Math.PI / 4)), 'fl fl--faint', 1));

  // registration brackets closing on the idea
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
    parts.push(P(line(cx + sx * half, cy + sy * half, cx + sx * half - sx * tick, cy + sy * half), 'fl', 2));
    parts.push(P(line(cx + sx * half, cy + sy * half, cx + sx * half, cy + sy * half - sy * tick), 'fl', 2));
  });

  // a dimension line — engineered, exact
  const dy = cy + half + 40;
  parts.push(P(line(cx - half, dy, cx + half, dy), 'fl fl--faint', 3));
  parts.push(P(line(cx - half, dy - 6, cx - half, dy + 6), 'fl fl--faint', 3));
  parts.push(P(line(cx + half, dy - 6, cx + half, dy + 6), 'fl fl--faint', 3));

  // the concept, drawn true
  parts.push(sq(cx, cy, 22, 'fn fn--em'));
  return svg('lab', `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// DIVIDER — the article-body rest: a pause, marked.
// ---------------------------------------------------------
function divider() {
  const parts = [
    P(line(0, 7, 50, 7), 'fl', 0),
    P(line(78, 7, 128, 7), 'fl', 0),
    sq(64, 7, 7, 'fn fn--em')
  ];
  return svg('divider', '0 0 128 14', parts.join(''));
}

// ---------------------------------------------------------
// NOT FOUND — an ordered field in which a single line has
// left the system.
// ---------------------------------------------------------
function notFound() {
  const W = 760, H = 400;
  const parts = [];
  const N = 7, gap = 44;
  for (let i = 0; i < N; i++) {
    const y = 68 + i * gap;
    if (i === 4) {
      parts.push(P(cubic(-2, y, 300, y, 420, y + 30, 470, 402), 'fl', i));
    } else {
      parts.push(P(line(-2, y, W + 2, y), 'fl', i));
    }
  }
  return svg('not-found', `0 0 ${W} ${H}`, parts.join(''));
}

// ---------------------------------------------------------
// MINIS — the same subjects at teaser size.
// ---------------------------------------------------------
function mini(kind) {
  const W = 240, H = 96;
  const parts = [];

  if (kind === 'advisory') {
    const cx = 120, cy = 48;
    parts.push(P(circle(cx, cy, 38), 'fl', 0));
    for (let k = 0; k < 4; k++) {
      const a = (k * 90 * Math.PI) / 180;
      parts.push(P(line(cx + 38 * Math.cos(a), cy - 38 * Math.sin(a), cx + 30 * Math.cos(a), cy - 30 * Math.sin(a)), 'fl fl--faint', 1));
    }
    const a = Math.PI / 4;
    const tip = [cx + 26 * Math.cos(a), cy - 26 * Math.sin(a)];
    parts.push(P(poly([tip, [cx + 3.5, cy + 3.5], [cx - 10 * Math.cos(a), cy + 10 * Math.sin(a)], [cx - 3.5, cy - 3.5]]) + ' Z', 'fl', 2));
    parts.push(sq(tip[0], tip[1], 7, 'fn fn--em'));
  }

  if (kind === 'delivery') {
    parts.push(P(line(28, 14, 212, 14), 'fl', 0));
    [64, 110, 156].forEach(x => parts.push(P(line(x, 10, x, 18), 'fl fl--faint', 0)));
    parts.push(P(rect(28, 28, 74, 11), 'fl', 1));
    parts.push(P(rect(64, 50, 96, 11), 'fl', 2));
    parts.push(P(rect(120, 72, 66, 11), 'fl fl--faint', 3));
    parts.push(P(line(160, 22, 160, 90), 'fl fl--datum', 3));
    parts.push(sq(160, 55.5, 7, 'fn fn--em'));
  }

  if (kind === 'modernization') {
    // the operating model: strategy over systems over workforce, integrated
    const cols = [96, 148, 200], yModel = 16, ySys = 48, yPeople = 80;
    cols.forEach((x) => parts.push(P(line(x, yModel, x, yPeople + 8), 'fl fl--faint', 3)));
    parts.push(P(line(70, yModel, 218, yModel), 'fl', 1));            // strategy
    cols.forEach((x) => parts.push(P(rect(x - 11, ySys - 11, 22, 22), 'fl', 2)));  // systems
    cols.forEach((x) => parts.push(P(circle(x, yPeople, 8), 'fl', 2)));            // workforce
    // legacy drawn in, faint
    parts.push(P(rect(26, ySys - 9, 18, 18), 'fl fl--faint', 0));
    parts.push(P(`M44,${ySys} ${flow(44, ySys, cols[0] - 11, ySys, 0.6)}`, 'fl fl--faint', 1));
    parts.push(sq(cols[1], ySys, 9, 'fn fn--em'));                    // modern standard
  }

  if (kind === 'federal') {
    parts.push(P(line(44, 84, 196, 84), 'fl', 0));
    parts.push(P(line(56, 74, 184, 74), 'fl', 1));
    [88, 120, 152].forEach((x, i) => {
      parts.push(P(line(x - 3, 38, x - 3, 74), 'fl', 2));
      parts.push(P(line(x + 3, 38, x + 3, 74), 'fl', 2));
    });
    parts.push(P(line(56, 38, 184, 38), 'fl', 3));
    parts.push(P(line(50, 30, 120, 8), 'fl', 4));
    parts.push(P(line(190, 30, 120, 8), 'fl', 4));
    parts.push(P(line(50, 30, 190, 30), 'fl fl--faint', 4));
    parts.push(sq(120, 21, 6, 'fn fn--em'));
  }

  if (kind === 'state-local') {
    const cx = 120;
    parts.push(P(line(40, 84, 200, 84), 'fl', 0));
    // wings
    [[64, 100], [140, 176]].forEach(([x0, x1]) => parts.push(P(poly([[x0, 78], [x0, 56], [x1, 56], [x1, 78]]), 'fl', 1)));
    // tower + pediment + cupola
    parts.push(P(poly([[100, 56], [100, 26], [140, 26], [140, 56]]), 'fl', 2));
    parts.push(P(poly([[94, 26], [cx, 12], [146, 26]]), 'fl', 3));
    // clock face
    parts.push(P(circle(cx, 42, 9), 'fl', 3));
    parts.push(sq(cx, 42, 6, 'fn fn--em'));
  }

  if (kind === 'commercial') {
    parts.push(P(line(28, 84, 212, 84), 'fl', 0));
    // single tower with set-back crown
    parts.push(P(poly([[92, 84], [92, 30], [148, 30], [148, 84]]), 'fl', 1));
    parts.push(P(poly([[104, 30], [104, 16], [136, 16], [136, 30]]), 'fl', 2));
    [108, 120, 132].forEach((x) => parts.push(P(line(x, 36, x, 80), 'fl fl--faint', 2)));
    for (let y = 44; y < 80; y += 12) parts.push(P(line(96, y, 144, y), 'fl fl--faint', 3));
    parts.push(sq(120, 54, 7, 'fn fn--em'));
  }

  return svg(`mini mini--${kind}`, `0 0 ${W} ${H}`, parts.join(''));
}

const FIELDS = {
  hero, advisory, delivery, modernization,
  federal, 'state-local': stateLocal, commercial,
  capabilities, industries, lab,
  figure, contact, divider, 'not-found': notFound,
  'step-analyze': () => methodStep('analyze'),
  'step-execute': () => methodStep('execute'),
  'step-transform': () => methodStep('transform'),
  'mini-advisory': () => mini('advisory'),
  'mini-delivery': () => mini('delivery'),
  'mini-modernization': () => mini('modernization'),
  'mini-federal': () => mini('federal'),
  'mini-state-local': () => mini('state-local'),
  'mini-commercial': () => mini('commercial')
};

function renderField(name) {
  const fn = FIELDS[name];
  if (!fn) throw new Error(`Unknown decision field: ${name}`);
  return `<!-- Decision Field "${name}" — generated by pallston-src/decision-fields.js; edit the generator, not this markup -->${fn()}`;
}

module.exports = { renderField, FIELDS };
