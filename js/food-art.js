/* ===========================================================
   JeedFood — Food Art
   วาดรูปอาหารสไตล์การ์ตูน (คล้ายเกม Overcooked)
   ทุกชิ้นวาดโดยมีจุดกึ่งกลางที่ (0,0) ขนาดประมาณ 70x60
   =========================================================== */

const OUT = '#4A3427';

const st = (w = 4.5) =>
  `stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const C = (x, y, r, f, w) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${st(w)}/>`;
const E = (x, y, rx, ry, f, rot = 0, w) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${st(w)} transform="rotate(${rot} ${x} ${y})"/>`;
const R = (x, y, ww, h, rd, f, rot = 0, w) =>
  `<rect x="${x}" y="${y}" width="${ww}" height="${h}" rx="${rd}" fill="${f}" ${st(w)} transform="rotate(${rot} ${x + ww / 2} ${y + h / 2})"/>`;
const P = (d, f, w) => `<path d="${d}" fill="${f}" ${st(w)}/>`;
const L = (d, c = OUT, w = 3.5) =>
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const SHINE = (x, y, rx, ry, rot = -20, o = 0.75) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${o}" transform="rotate(${rot} ${x} ${y})"/>`;

/* ---------- ไล่เฉดสี (ทำให้อาหารดูมีแสงเงาแบบภาพวาด) ---------- */
const GRADS = [
  ['gWhite', '#FFFFFF', '#F0E3CE'],
  ['gBread', '#F8CB7C', '#CE8C38'],
  ['gBreadDark', '#DC9A4C', '#AC6A2C'],
  ['gBreadIn', '#FFEFC9', '#F5D89B'],
  ['gCheese', '#FFE07A', '#F2A81E'],
  ['gMeat', '#EE9070', '#C4553C'],
  ['gMeatDark', '#D4674A', '#A33C28'],
  ['gHam', '#FFB6BE', '#E97F8E'],
  ['gChicken', '#F0B173', '#D3823C'],
  ['gFried', '#F5BC66', '#DA9033'],
  ['gGreen', '#96D492', '#4E9A56'],
  ['gGreenDark', '#6FB076', '#2F6B3A'],
  ['gGreenLite', '#C2E9B6', '#8FCB88'],
  ['gRed', '#F2706A', '#C3312F'],
  ['gPink', '#FF9FC0', '#E4638F'],
  ['gRice', '#FFFFFF', '#EADCC2'],
  ['gNoodle', '#FAE2A2', '#E2B455'],
  ['gMilk', '#FFFFFF', '#E4EEF7'],
  ['gPb', '#D9A063', '#A96F3A'],
  ['gTomato', '#F26F58', '#C43A2C'],
  ['gCarrot', '#F8AE5E', '#DE7A25'],
  ['gPlate', '#FFFFFF', '#DFD2BE'],
  ['gPlateIn', '#FFF9EC', '#F0E2C9'],
  ['gBowl', '#9BDCF2', '#4E9EC4'],
  ['gBox', '#FFC7DA', '#F084AA'],
  ['gWood', '#F0D2A0', '#C99A5C'],
  ['gWoodIn', '#FDF4DE', '#EDDCB6'],
  ['gLettuce', '#A9DC96', '#5FA45C'],
  ['gCurry', '#E5A04A', '#B26A1E'],
];

const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
${GRADS.map(([id, a, b]) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0.25" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`
).join('\n')}
<radialGradient id="gYolkR" cx="0.38" cy="0.32" r="0.78"><stop offset="0" stop-color="#FFE88C"/><stop offset="1" stop-color="#EF9E1C"/></radialGradient>
<radialGradient id="gTileBg" cx="0.5" cy="0.42" r="0.72"><stop offset="0" stop-color="#FBEBCB"/><stop offset="1" stop-color="#EAD3A6"/></radialGradient>
</defs></svg>`;

const U = (id) => `url(#${id})`;

/* ---------- สี ---------- */
const CL = {
  eggWhite: U('gWhite'), yolk: U('gYolkR'), yolkDeep: '#E08C10',
  bread: U('gBread'), breadDark: U('gBreadDark'), breadIn: U('gBreadIn'),
  cheese: U('gCheese'), cheeseDeep: '#E09A16',
  meat: U('gMeat'), meatDark: U('gMeatDark'), ham: U('gHam'),
  chicken: U('gChicken'), fried: U('gFried'),
  green: U('gGreen'), greenDark: U('gGreenDark'), greenLite: U('gGreenLite'),
  red: U('gRed'), pink: U('gPink'), purple: '#9B6FD1',
  rice: U('gRice'), riceDark: '#E3D3B4', noodle: U('gNoodle'),
  milk: U('gMilk'), choco: '#A9714B', pb: U('gPb'),
  orange: U('gCarrot'), tomato: U('gTomato'), carrot: U('gCarrot'),
  plate: U('gPlate'), plateIn: U('gPlateIn'), box: U('gBox'), boxIn: '#FFF8E8',
  bowl: U('gBowl'), bowlIn: '#FFF3DE', soup: '#F6D9A0', curry: U('gCurry'),
};

/* ===========================================================
   หน้าตาน่ารักบนอาหาร (วาดในกรอบกว้างประมาณ 34 หน่วย)
   =========================================================== */
const EYE = '#4A3427';
const eyeOpen = (x) => `<ellipse cx="${x}" cy="-1" rx="3.1" ry="3.8" fill="${EYE}"/>` +
  `<circle cx="${x - 1}" cy="-2.6" r="1.1" fill="#fff"/>`;
const eyeHappy = (x, dir = 1) =>
  `<path d="M${x - 4},0.5 C${x - 2},-4 ${x + 2},-4 ${x + 4},0.5" fill="none" stroke="${EYE}" stroke-width="2.6" stroke-linecap="round" transform="scale(${dir} 1)"/>`;
const blush = (x) => `<ellipse cx="${x}" cy="6" rx="5" ry="3.1" fill="#FF8FA8" opacity=".55"/>`;

const FACE_KINDS = {
  smile: () => eyeOpen(-8.5) + eyeOpen(8.5) +
    `<path d="M-4,7 C-2,10.5 2,10.5 4,7" fill="none" stroke="${EYE}" stroke-width="2.4" stroke-linecap="round"/>`,
  wink: () => eyeOpen(-8.5) + `<path d="M5,0 C7,-3.6 10.6,-3.6 12.4,0" fill="none" stroke="${EYE}" stroke-width="2.6" stroke-linecap="round"/>` +
    `<path d="M-4,7 C-2,10.5 2,10.5 4,7" fill="none" stroke="${EYE}" stroke-width="2.4" stroke-linecap="round"/>`,
  happy: () => `<path d="M-12.5,0.5 C-10.5,-4 -6.5,-4 -4.5,0.5" fill="none" stroke="${EYE}" stroke-width="2.6" stroke-linecap="round"/>` +
    `<path d="M4.5,0.5 C6.5,-4 10.5,-4 12.5,0.5" fill="none" stroke="${EYE}" stroke-width="2.6" stroke-linecap="round"/>` +
    `<path d="M-3.5,7 C-1.5,10 1.5,10 3.5,7" fill="none" stroke="${EYE}" stroke-width="2.4" stroke-linecap="round"/>`,
  open: () => eyeOpen(-9) + eyeOpen(9) +
    `<path d="M-4.5,6 C-4.5,11.5 4.5,11.5 4.5,6 Z" fill="#8C4A3C" stroke="${EYE}" stroke-width="1.6" stroke-linejoin="round"/>`,
};
const FACE_LIST = ['smile', 'wink', 'happy', 'open'];

/* ชิ้นที่สีเข้ม ไม่เหมาะวางหน้า (ถ้ามีตัวเลือกอื่น) */
const FACE_DARK = new Set([
  'toast_avocado', 'curry', 'meatball', 'broccoli', 'tomato', 'strawberry',
  'mushroom', 'avocado_half', 'sausage', 'bacon', 'blueberry',
]);

function face(kind) {
  const f = FACE_KINDS[kind] || FACE_KINDS.smile;
  return blush(-15.5) + blush(15.5) + f();
}

/* จุดวางหน้าบนชิ้นอาหารแต่ละแบบ: [x, y, ขนาด] */
const FACE_ON = {
  egg_fried: [2, -3, 0.56], egg_scrambled: [-2, -1, 0.85], egg_boiled: [-14, 2, 0.5],
  omelette: [0, -1, 0.95], egg_roll: [-2, 0, 0.72], egg_in_hole: [0, 2, 0.56],
  muffin_egg: [0, -7, 0.58],
  toast: [0, 4, 0.85], toast_avocado: [0, 4, 0.8], toast_pb: [0, 4, 0.8],
  french_toast: [0, 3, 0.85], sandwich: [0, 7, 0.78], burger: [0, -14, 0.66],
  wrap: [-10, 2, 0.62], pinwheel: [-16, 4, 0.55], cracker: [1, 6, 0.6],
  pancake: [0, 2, 0.85], waffle: [0, 1, 0.85], cereal: [-1, 0, 0.6],
  yogurt_cup: [0, 5, 0.7], oat_blob: [0, -1, 0.8], smoothie: [0, 3, 0.66],
  milk_glass: [0, 4, 0.6],
  rice_mound: [0, -2, 0.85], rice_ball: [0, -8, 0.62], fried_rice: [0, -2, 0.85],
  noodles: [0, 2, 0.85], pasta_shell: [14, 8, 0.5], curry: [0, -1, 0.8],
  nugget: [-4, -4, 0.52], meatball: [-14, 4, 0.55], sausage: [0, 0, 0.55],
  fish_fillet: [-2, 0, 0.7], chicken_drum: [10, -4, 0.55], shrimp: [-2, -2, 0.55],
  tofu: [-14, 0, 0.45], salmon: [-12, -1, 0.5], tuna_scoop: [-2, -1, 0.7],
  bacon: [0, -4, 0.5], ham_roll: [-14, 2, 0.5], sausage_slices: [-16, 2, 0.5],
  broccoli: [-2, -4, 0.55], tomato: [-12, 4, 0.55], strawberry: [0, 3, 0.62],
  corn: [-2, -2, 0.5], mushroom: [0, 6, 0.55], avocado_half: [1, 1, 0.5],
  potato_wedge: [-16, 4, 0.45], cheese_cube: [-14, 4, 0.42], banana: [4, 6, 0.5],
};

/* ===========================================================
   ชิ้นส่วนอาหาร
   =========================================================== */
const ART = {};

/* จุดเครื่องเทศ/ต้นหอมโรยหน้า */
const specks = (pts, color = '#7A5B3F', r = 1.4) =>
  pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity=".75"/>`).join('');
const chives = (pts) =>
  pts.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.7" fill="#5FA45C" transform="rotate(${(x * 7) % 60} ${x} ${y})"/>`).join('');

/* --- ไข่ --- */
ART.egg_fried = () =>
  P('M-32,2 C-42,-14 -24,-30 -6,-24 C4,-36 24,-32 29,-17 C43,-10 39,12 22,17 C8,27 -20,24 -32,2 Z', CL.eggWhite) +
  specks([[-20, -6], [-14, 6], [20, 8], [24, -14]]) +
  C(2, -3, 13, CL.yolk) + SHINE(-2, -8, 4.5, 3) +
  chives([[-24, -14], [18, 14]]);

ART.egg_scrambled = () =>
  P('M-30,10 C-34,-6 -18,-16 -8,-10 C-4,-22 14,-22 16,-10 C30,-14 36,4 26,14 C10,24 -18,22 -30,10 Z', CL.yolk) +
  L('M-14,2 C-8,-4 -2,4 4,-2') + L('M10,8 C14,2 20,6 22,2') + SHINE(-14, -6, 5, 3.5) +
  chives([[-20, -6], [8, -14], [20, 8]]);

ART.egg_boiled = () =>
  E(-14, 2, 18, 20, CL.eggWhite, -6) + C(-14, 2, 8, CL.yolk) +
  E(18, 6, 16, 18, CL.eggWhite, 8) + C(18, 6, 7, CL.yolk) + SHINE(-19, -6, 4, 3);

ART.omelette = () =>
  P('M-34,12 C-30,-16 -6,-26 10,-22 C30,-18 36,0 32,12 C18,22 -20,22 -34,12 Z', CL.yolk) +
  L('M-18,-4 C-4,-14 14,-14 24,-4', CL.yolkDeep, 4) + SHINE(-14, 0, 6, 3.5) +
  chives([[-22, 6], [4, -14], [22, 4]]);

ART.egg_roll = () =>
  R(-30, -14, 60, 30, 9, CL.yolk, -6) +
  L('M-12,-12 C-4,-2 -4,4 -12,14', CL.yolkDeep, 3.5) +
  L('M8,-14 C16,-4 16,2 8,12', CL.yolkDeep, 3.5) + SHINE(-18, -6, 6, 3);

ART.egg_in_hole = () =>
  R(-32, -24, 64, 52, 12, CL.bread) +
  C(0, 2, 19, CL.eggWhite) + C(0, 2, 9, CL.yolk) + SHINE(-20, -14, 6, 3.5);

ART.muffin_egg = () =>
  E(0, 8, 30, 16, CL.bread) + E(0, -6, 29, 15, CL.eggWhite) +
  C(0, -8, 9, CL.yolk) + SHINE(-14, -12, 5, 3);

/* --- ขนมปัง & แซนด์วิช --- */
ART.toast = () =>
  P('M-30,-12 C-30,-26 -12,-32 -2,-25 C10,-32 30,-25 30,-10 L30,20 C30,26 25,29 19,29 L-19,29 C-25,29 -30,26 -30,20 Z', CL.bread) +
  P('M-22,-8 C-22,-19 -10,-23 -2,-18 C6,-23 22,-19 22,-7 L22,15 C22,19 19,21 15,21 L-15,21 C-19,21 -22,19 -22,15 Z', CL.breadIn, 3.5) +
  SHINE(-14, -8, 5, 3);

ART.toast_avocado = () =>
  ART.toast() +
  P('M-20,-6 C-14,-16 12,-16 20,-4 C22,8 12,17 0,17 C-12,17 -22,8 -20,-6 Z', CL.green, 4) +
  C(4, 2, 5, CL.greenLite, 3) + SHINE(-10, -4, 5, 3, -20, 0.4);

ART.toast_pb = () =>
  ART.toast() +
  P('M-21,-7 C-14,-15 12,-15 21,-5 C22,9 12,17 0,17 C-12,17 -22,8 -21,-7 Z', CL.pb, 4) +
  SHINE(-10, -4, 5, 3, -20, 0.3);

ART.french_toast = () =>
  R(-30, -18, 60, 42, 10, CL.breadDark) + R(-24, -12, 48, 30, 8, CL.bread, 0, 3.5) +
  L('M-20,-4 C-8,-12 8,4 20,-4', '#8A5A2B', 4) + C(14, -14, 5, '#FFF3C4', 3);

ART.sandwich = () =>
  P('M-32,24 L0,-26 L32,24 Z', CL.bread) +
  L('M-18,4 L18,4', CL.green, 5) + L('M-24,14 L24,14', CL.ham, 5) +
  L('M-12,-6 L12,-6', CL.cheese, 5) + SHINE(-5, -13, 3, 4.5, 0, 0.3);

ART.pinwheel = () =>
  C(-16, 4, 20, CL.breadIn) + C(-16, 4, 11, CL.ham, 3.5) + C(-16, 4, 4, CL.green, 3) +
  C(18, 10, 17, CL.breadIn) + C(18, 10, 9, CL.ham, 3.5) + C(18, 10, 3.5, CL.green, 3);

ART.wrap = () =>
  R(-32, -16, 56, 33, 14, CL.breadIn, -10) +
  E(22, -9, 11, 14, '#FFF6E2', -10) +
  E(22, -9, 6, 8.5, CL.green, -10, 3) + C(23, -11, 2.6, CL.tomato, 2.5) +
  L('M-16,-10 C-10,-2 -10,4 -16,12', '#E3C48C', 3.5);

ART.burger = () =>
  P('M-28,-6 C-28,-26 28,-26 28,-6 Z', CL.bread) +
  R(-30, -6, 60, 9, 4, CL.green) + R(-28, 3, 56, 10, 4, CL.meat) +
  R(-30, 13, 60, 12, 6, CL.bread) + SHINE(-14, -16, 6, 3.5);

ART.cracker = () =>
  R(-30, -16, 34, 34, 6, CL.bread, -8) + R(0, -6, 32, 32, 6, CL.breadIn, 10) +
  C(-14, 0, 2.5, OUT, 0) + C(-2, -8, 2.5, OUT, 0) + C(14, 12, 2.5, OUT, 0);

/* --- เนื้อสัตว์ --- */
ART.sausage = () =>
  R(-32, -12, 64, 24, 12, CL.meat, -12) +
  L('M-16,-8 L-10,4', CL.meatDark, 3) + L('M2,-12 L8,0', CL.meatDark, 3) + SHINE(-16, -8, 8, 3);

ART.sausage_slices = () =>
  C(-16, 2, 14, CL.meat) + C(-16, 2, 7, CL.ham, 3) +
  C(14, 8, 12, CL.meat) + C(14, 8, 6, CL.ham, 3) + SHINE(-20, -4, 4, 2.5);

ART.bacon = () =>
  P('M-32,-12 C-14,-22 10,0 30,-10 L30,4 C10,14 -14,-8 -32,2 Z', CL.meatDark) +
  L('M-28,-6 C-10,-16 8,4 26,-6', '#FFD9CC', 4);

ART.ham_roll = () =>
  C(-14, 2, 17, CL.ham) + C(-14, 2, 8, '#FFD3D8', 3) +
  C(16, 8, 14, CL.ham) + C(16, 8, 6, '#FFD3D8', 3);

ART.chicken_drum = () =>
  P('M-6,-20 C14,-26 30,-10 24,8 C18,24 -4,26 -12,14 Z', CL.chicken) +
  R(-34, 6, 30, 13, 6, CL.eggWhite, -18) + SHINE(6, -8, 6, 4);

ART.nugget = () =>
  P('M-30,-4 C-32,-18 -12,-24 -2,-16 C10,-24 26,-16 24,-2 C22,12 -26,14 -30,-4 Z', CL.fried) +
  P('M6,4 C6,-8 22,-12 28,-2 C32,10 12,16 6,4 Z', CL.fried, 4) + SHINE(-16, -8, 6, 3);

ART.meatball = () =>
  C(-14, 4, 15, CL.meatDark) + C(16, 10, 12, CL.meatDark) + C(6, -12, 11, CL.meatDark) +
  SHINE(-18, -2, 4.5, 3, -20, 0.4);

ART.fish_fillet = () =>
  R(-30, -14, 58, 28, 10, CL.fried, -6) +
  L('M-18,-6 L-12,4', '#C98436', 3) + L('M0,-8 L6,2', '#C98436', 3) + SHINE(-16, -8, 7, 3);

ART.salmon = () =>
  R(-28, -16, 32, 30, 8, '#FF9878', -8) + L('M-24,-6 L-2,-10', '#FFD3C0', 4) +
  R(2, -4, 28, 26, 8, '#FF9878', 8) + L('M6,6 L26,2', '#FFD3C0', 4);

ART.shrimp = () =>
  P('M-24,10 C-30,-10 -10,-24 8,-18 C24,-12 26,6 14,14 C4,20 -10,20 -24,10 Z', '#FF9575') +
  L('M-12,-8 C-4,0 4,2 12,-2', '#FFD0BE', 4) + C(10, -14, 3, OUT, 0);

ART.tofu = () =>
  R(-28, -14, 28, 28, 5, '#FFF3D0', -6) + R(2, -4, 26, 26, 5, '#FFF3D0', 8) +
  SHINE(-20, -8, 5, 3, 0, 0.6);

ART.tuna_scoop = () =>
  P('M-24,10 C-26,-8 -8,-20 6,-16 C22,-12 26,6 16,14 C4,20 -14,20 -24,10 Z', '#F0C9A0') +
  C(-8, -2, 3.5, '#D9A47A', 0) + C(8, 4, 3, '#D9A47A', 0) + C(2, -10, 2.5, CL.green, 0);

/* --- เช้า/ของหวานสุขภาพ --- */
ART.pancake = () =>
  E(0, 14, 30, 11, CL.breadDark) + E(0, 2, 30, 11, CL.bread) + E(0, -10, 29, 11, CL.bread) +
  P('M-16,-14 C-6,-20 8,-18 14,-12 C10,-6 -10,-6 -16,-14 Z', '#FFE9A8', 3.5) +
  C(0, -18, 6, CL.red, 3.5);

ART.waffle = () =>
  R(-28, -22, 56, 46, 10, CL.bread) +
  L('M-28,-8 L28,-8', CL.breadDark, 4) + L('M-28,8 L28,8', CL.breadDark, 4) +
  L('M-10,-22 L-10,24', CL.breadDark, 4) + L('M8,-22 L8,24', CL.breadDark, 4);

ART.cereal = () =>
  C(-18, 2, 10, '#D9A05B') + C(2, -8, 9, '#E8B36A') + C(16, 6, 10, '#D9A05B') +
  C(-4, 10, 8, '#E8B36A') + SHINE(-20, -2, 3.5, 2.5);

ART.yogurt_cup = () =>
  P('M-22,-14 L22,-14 L16,24 L-16,24 Z', CL.milk) +
  E(0, -14, 22, 8, '#FFFFFF') + C(-6, -16, 5, CL.pink, 3) + C(8, -14, 4, CL.red, 3);

ART.oat_blob = () =>
  P('M-28,4 C-32,-12 -10,-20 4,-16 C22,-20 32,-4 24,10 C10,20 -16,20 -28,4 Z', '#EFDCB8') +
  C(-10, -2, 3, '#C9A972', 0) + C(8, 2, 3, '#C9A972', 0) + C(0, -10, 3, '#C9A972', 0);

ART.milk_glass = () =>
  P('M-18,-24 L18,-24 L13,24 L-13,24 Z', CL.milk) +
  P('M-15,-6 L15,-6 L13,24 L-13,24 Z', '#EAF4FF', 3.5) + SHINE(-9, -10, 3, 9, 0, 0.9);

ART.smoothie = () =>
  P('M-18,-20 L18,-20 L14,26 L-14,26 Z', CL.pink) +
  E(0, -20, 18, 6, '#FFB3CD') + L('M8,-34 L14,-18', OUT, 5) + C(-6, 0, 4, '#fff', 0);

/* --- ผลไม้ --- */
ART.banana = () =>
  P('M-28,-14 C-14,16 16,22 30,4 C22,4 4,0 -6,-20 Z', '#FFD95C') +
  L('M-22,-10 C-8,12 10,16 22,6', '#E8B93C', 3.5);

ART.banana_slice = () =>
  C(-16, 2, 12, '#FFE07A') + C(-16, 2, 5, '#FFF3C4', 3) +
  C(12, 8, 11, '#FFE07A') + C(12, 8, 4, '#FFF3C4', 3) +
  C(4, -12, 10, '#FFE07A') + C(4, -12, 4, '#FFF3C4', 3);

ART.strawberry = () =>
  P('M0,22 C-18,14 -22,-6 -10,-14 C-2,-19 6,-19 12,-14 C24,-6 18,14 0,22 Z', CL.red) +
  P('M-12,-14 L0,-24 L12,-14 C6,-10 -6,-10 -12,-14 Z', CL.greenDark, 3.5) +
  C(-6, 0, 2, '#FFE9A8', 0) + C(6, 6, 2, '#FFE9A8', 0) + C(2, -4, 2, '#FFE9A8', 0);

ART.blueberry = () =>
  C(-14, 4, 11, '#6E7FD1') + C(12, 8, 9, '#5A6CC4') + C(4, -10, 10, '#6E7FD1') +
  C(-14, 2, 3, '#3E4A96', 0) + SHINE(-18, -1, 3, 2, -20, 0.5);

ART.apple_slice = () =>
  P('M-26,14 C-20,-8 -4,-16 4,-14 L-4,16 Z', '#FFF6E0') + L('M-24,10 C-18,-6 -8,-12 2,-12', CL.red, 5) +
  P('M2,16 C8,-6 20,-14 28,-12 L20,18 Z', '#FFF6E0') + L('M4,12 C10,-4 18,-10 26,-10', CL.red, 5);

ART.avocado_half = () =>
  P('M0,-22 C16,-22 26,-6 22,10 C18,22 4,24 -2,22 C-16,18 -24,2 -18,-10 C-14,-18 -8,-22 0,-22 Z', CL.greenDark) +
  P('M0,-16 C12,-16 20,-4 17,8 C13,18 2,19 -2,17 C-13,13 -18,1 -13,-8 C-10,-14 -6,-16 0,-16 Z', CL.greenLite, 3.5) +
  C(1, 1, 9, '#B07A45');

/* --- ผัก --- */
ART.tomato = () =>
  C(-12, 4, 15, CL.tomato) + C(16, 10, 12, CL.tomato) +
  L('M-12,-11 L-12,-16', CL.greenDark, 4) + P('M-20,-12 L-4,-12 L-12,-6 Z', CL.greenDark, 3) +
  SHINE(-17, -2, 4, 3);

ART.cucumber = () =>
  C(-16, 2, 13, '#BFE3A8') + C(-16, 2, 8, '#E6F5D8', 3) +
  C(12, 8, 12, '#BFE3A8') + C(12, 8, 7, '#E6F5D8', 3) +
  C(2, -12, 11, '#BFE3A8') + C(2, -12, 6, '#E6F5D8', 3);

ART.carrot_stick = () =>
  R(-26, -10, 16, 40, 6, CL.carrot, -8) + R(-4, -14, 15, 42, 6, CL.carrot, 4) +
  R(16, -8, 14, 38, 6, CL.carrot, 12);

ART.broccoli = () =>
  C(-12, -6, 14, CL.green) + C(10, -10, 12, CL.green) + C(2, 4, 13, CL.green) +
  R(-6, 8, 12, 20, 5, CL.greenLite) + SHINE(-16, -10, 4, 3, -20, 0.4);

ART.corn = () =>
  P('M-10,-24 C6,-26 16,-12 14,6 C12,20 2,26 -6,22 C-18,16 -20,-16 -10,-24 Z', CL.cheese) +
  C(-4, -12, 3, CL.yolkDeep, 0) + C(4, -2, 3, CL.yolkDeep, 0) + C(-4, 8, 3, CL.yolkDeep, 0) +
  P('M14,0 C26,-6 30,6 22,14 Z', CL.green, 3.5);

ART.spinach = () =>
  P('M-26,10 C-24,-10 -6,-20 8,-14 C0,-4 -6,10 -26,10 Z', CL.greenDark) +
  P('M28,14 C26,-4 10,-14 -2,-8 C6,0 10,14 28,14 Z', CL.green) + L('M20,10 C10,4 4,-2 0,-6', '#2F6B3A', 3);

ART.mushroom = () =>
  P('M-24,0 C-24,-18 24,-18 24,0 Z', '#C98F6B') + R(-9, 0, 18, 20, 6, '#F3E2CE') +
  C(-10, -8, 4, '#F3E2CE', 0) + C(8, -6, 3, '#F3E2CE', 0);

ART.potato_wedge = () =>
  P('M-30,16 L-16,-16 L-2,16 Z', CL.cheese) + P('M-2,18 L14,-12 L28,18 Z', CL.cheese) +
  L('M-16,-8 L-16,8', CL.yolkDeep, 3);

/* --- ชีส --- */
ART.cheese_cube = () =>
  R(-26, -8, 24, 24, 4, CL.cheese, -6) + R(0, -14, 22, 22, 4, CL.cheese, 8) +
  C(-16, 2, 3, CL.cheeseDeep, 0) + C(10, -4, 3, CL.cheeseDeep, 0);

ART.cheese_slice = () =>
  P('M-28,-14 L28,-14 L20,18 L-20,18 Z', CL.cheese) +
  C(-8, -2, 4, CL.cheeseDeep, 0) + C(10, 6, 3.5, CL.cheeseDeep, 0);

/* --- ข้าว & เส้น --- */
ART.rice_mound = () =>
  P('M-32,16 C-30,-12 -12,-24 0,-24 C12,-24 30,-12 32,16 Z', CL.rice) +
  C(-12, -2, 3, CL.riceDark, 0) + C(6, -8, 3, CL.riceDark, 0) + C(14, 4, 3, CL.riceDark, 0) +
  SHINE(-12, -12, 6, 3.5, -20, 0.8);

ART.rice_ball = () =>
  P('M0,-26 C10,-24 24,6 26,18 C10,22 -10,22 -26,18 C-24,6 -10,-24 0,-26 Z', CL.rice) +
  R(-12, 0, 24, 20, 4, '#3E5B4A') + SHINE(-6, -10, 5, 3, -20, 0.8);

ART.fried_rice = () =>
  P('M-32,16 C-30,-12 -12,-24 0,-24 C12,-24 30,-12 32,16 Z', '#F5E3B8') +
  C(-14, 0, 3.5, CL.green, 0) + C(6, -10, 3.5, CL.tomato, 0) + C(14, 6, 3.5, CL.cheese, 0) +
  C(-4, 8, 3.5, CL.green, 0) + C(2, -2, 3.5, CL.carrot, 0);

ART.noodles = () =>
  E(0, 4, 32, 22, CL.noodle) +
  L('M-22,-4 C-10,-14 10,6 22,-6', '#E0B95C', 4) +
  L('M-22,8 C-10,-2 10,16 22,6', '#E0B95C', 4) +
  L('M-14,-14 C-2,-20 8,-12 18,-16', '#E0B95C', 4);

ART.pasta_shell = () =>
  P('M-26,6 C-26,-10 -6,-16 2,-6 C8,2 0,14 -12,14 C-20,14 -26,12 -26,6 Z', CL.noodle) +
  P('M2,12 C0,-4 20,-12 28,-2 C34,8 24,20 12,20 C4,20 2,18 2,12 Z', CL.noodle, 4) +
  L('M-20,0 L-8,4', '#E0B95C', 3);

ART.curry = () =>
  P('M-30,8 C-28,-10 -10,-18 2,-14 C20,-18 32,-2 26,10 C12,20 -16,20 -30,8 Z', CL.curry) +
  C(-10, -2, 4, CL.carrot, 0) + C(10, 2, 4, '#F3E2CE', 0) + C(0, 8, 4, CL.green, 0);

ART.dip_cup = () =>
  P('M-20,-12 L20,-12 L15,16 L-15,16 Z', '#FFFFFF') + E(0, -12, 20, 7, '#FFE9A8');

/* ===========================================================
   ฐาน (จาน / ชาม / กล่องข้าว)
   =========================================================== */
const SHADOW = (cx, cy, rx, ry) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#8A6A45" opacity=".22"/>`;

const BASE = {
  plate: {
    back:
      SHADOW(104, 148, 82, 21) +
      E(100, 118, 88, 42, CL.plate, 0, 5) +
      E(100, 116, 68, 30, CL.plateIn, 0, 4) +
      `<path d="M-73,-11 C-64,-28 -31,-36 -4,-35" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6" transform="translate(100 118)"/>`,
    front: '',
  },
  bowl: {
    back: SHADOW(104, 158, 66, 15) + E(100, 106, 76, 27, CL.bowlIn, 0, 5),
    front:
      P('M-76,0 C-72,44 -40,64 0,64 C40,64 72,44 76,0 C50,16 -50,16 -76,0 Z', CL.bowl, 5)
        .replace('<path', '<path transform="translate(100 106)"') +
      L('M-57,24 C-40,40 -18,46 2,46', '#D3F0FB', 6).replace('<path', '<path transform="translate(100 106)"') +
      L('M-64,6 C-62,20 -56,30 -48,38', '#D3F0FB', 4).replace('<path', '<path transform="translate(100 106)"'),
  },
  box: {
    // กล่องเบนโตะไม้ — จัดอาหารเต็มกล่องด้วย drawBento()
    back:
      SHADOW(104, 178, 80, 13) +
      R(14, 42, 172, 134, 24, U('gWood'), 0, 5) +
      R(26, 54, 148, 110, 16, U('gWoodIn'), 0, 4) +
      `<path d="M34,62 L34,156" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55" fill="none"/>` +
      `<path d="M20,168 C60,176 140,176 180,168" stroke="#B98846" stroke-width="4" stroke-linecap="round" fill="none" opacity=".5"/>`,
    front: '',
  },
};

/* ---------- ของแต่งในกล่องข้าว ---------- */
const SAUCES = [
  ['#E8452F', '#F5836E'],   // ซอสมะเขือเทศ
  ['#FFD86B', '#FFF0B8'],   // มายองเนส/มัสตาร์ด
  ['#7A4A22', '#A9713B'],   // ซอสญี่ปุ่น
];

function sauceCup(x, y, idx) {
  const [c, hi] = SAUCES[idx % SAUCES.length];
  return `<ellipse cx="${x}" cy="${y + 15}" rx="17" ry="5" fill="#8A6A45" opacity=".18"/>` +
    C(x, y, 16, '#FFFFFF', 4.5) + C(x, y, 11, c, 3) +
    `<path d="M${x - 5},${y + 2} C${x - 5},${y - 5} ${x + 4},${y - 6} ${x + 4},${y + 1}" fill="none" stroke="${hi}" stroke-width="3" stroke-linecap="round"/>`;
}

/* ผักสลัดรองก้นกล่อง */
function lettuce(x, y, w) {
  const bumps = [];
  for (let i = 0; i <= w; i += 13) bumps.push(`q6,-9 13,0`);
  return `<path d="M${x},${y} ${bumps.join(' ')} l0,14 l-${Math.ceil(w / 13) * 13},0 Z" fill="${U('gLettuce')}" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>`;
}

/* ตำแหน่งวางอาหารบนฐาน */
function layout(baseName, n) {
  if (baseName === 'box') {
    const sets = {
      1: [[92, 108, 1.15]],
      2: [[72, 108, 1.0], [146, 108, 0.68]],
      3: [[70, 108, 1.0], [146, 84, 0.6], [146, 134, 0.6]],
      4: [[68, 88, 0.72], [68, 136, 0.72], [146, 84, 0.58], [146, 134, 0.58]],
    };
    return sets[Math.min(n, 4)];
  }
  // ในชามต้องวางอาหารสูงขึ้น ไม่งั้นตัวชามจะบังชิ้นล่าง
  const sets = baseName === 'bowl'
    ? {
        1: [[100, 88, 1.45]],
        2: [[74, 84, 1.2], [130, 90, 1.08]],
        3: [[68, 76, 1.0], [132, 74, 0.94], [100, 100, 0.98]],
        4: [[66, 72, 0.86], [134, 70, 0.8], [76, 100, 0.84], [132, 98, 0.78]],
      }
    : {
        1: [[100, 102, 1.5]],
        2: [[72, 100, 1.24], [131, 108, 1.14]],
        3: [[68, 88, 1.06], [130, 84, 0.98], [100, 124, 1.02]],
        4: [[66, 84, 0.9], [132, 82, 0.85], [70, 122, 0.9], [134, 120, 0.85]],
      };
  return sets[Math.min(n, 4)];
}

/* หมุนเล็กน้อยให้ดูมีชีวิตชีวา (คงที่ตามชื่อเมนู) */
function jitterPos(seedStr) {
  let h = 0;
  for (let k = 0; k < seedStr.length; k++) h = (h * 31 + seedStr.charCodeAt(k)) % 9973;
  return h;
}
function jitter(seedStr, i) {
  return ((jitterPos(seedStr) + i * 137) % 17) - 8;
}

/* ===========================================================
   วาดรูปเมนู
   =========================================================== */
/* ===========================================================
   กล่องข้าวกลางวัน — จัดอาหารหลายชิ้นให้เต็มกล่อง
   =========================================================== */
const BENTO_SLOTS = [
  [58, 88, 0.80], [104, 84, 0.78], [58, 132, 0.80], [104, 130, 0.78], [146, 86, 0.68],
];
/* ชิ้นเล็ก ๆ ต้องขยายเป็นพิเศษ ไม่งั้นกล่องจะดูโหวง */
const BENTO_BOOST = {
  cheese_cube: 1.4, cheese_slice: 1.2, tomato: 1.32, blueberry: 1.4, corn: 1.3,
  apple_slice: 1.25, cucumber: 1.22, carrot_stick: 1.18, strawberry: 1.28,
  broccoli: 1.22, egg_boiled: 1.22, mushroom: 1.28, banana_slice: 1.22,
  sausage_slices: 1.28, ham_roll: 1.28, cracker: 1.15, shrimp: 1.15, tofu: 1.15,
  spinach: 1.25, potato_wedge: 1.12, meatball: 1.12, nugget: 1.1,
};

/* ชิ้นไหนได้กี่ช่อง ตามจำนวนวัตถุดิบในเมนู */
const BENTO_MIX = {
  1: [0, 0, 0, 0, 0],
  2: [0, 0, 0, 1, 1],
  3: [0, 0, 0, 1, 2],
  4: [0, 0, 1, 2, 3],
};

/* ย่อเนื้อหาลงเล็กน้อยให้มีระยะห่างจากขอบกรอบ (พื้นหลังยังเต็มกรอบ) */
const CONTENT_SCALE = 0.84;
const TILE_BG = `<rect x="0" y="0" width="200" height="200" fill="url(#gTileBg)"/>`;
const frame = (body, size) =>
  `<svg class="food-svg" viewBox="0 0 200 200" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
  TILE_BG +
  `<g transform="translate(100 104) scale(${CONTENT_SCALE}) translate(-100 -104)">${body}</g>` +
  `</svg>`;

function drawBento(recipe, size) {
  const types = (recipe.art || []).filter((n) => ART[n] && n !== 'dip_cup').slice(0, 4);
  if (!types.length) types.push('rice_ball');
  const mix = BENTO_MIX[Math.min(types.length, 4)];
  const seed = jitterPos(recipe.id);

  let inner = BASE.box.back;
  inner += lettuce(32, 150, 88);
  let faces = '';

  BENTO_SLOTS.forEach((slot, i) => {
    const name = types[Math.min(mix[i], types.length - 1)];
    const [x, y, base] = slot;
    const s = base * (BENTO_BOOST[name] || 1) * (1 + (((seed + i * 37) % 7) - 3) / 100);
    const rot = ((seed + i * 53) % 15) - 7;
    const tf = `translate(${x} ${y}) scale(${s.toFixed(2)}) rotate(${rot})`;

    inner += `<ellipse cx="${x}" cy="${(y + 26 * s).toFixed(1)}" rx="${(30 * s).toFixed(1)}" ry="${(7 * s).toFixed(1)}" fill="#8A6A45" opacity=".16"/>`;
    inner += `<g transform="${tf}">${ART[name]()}</g>`;

    if (FACE_ON[name] && !FACE_DARK.has(name)) {
      const [fx, fy, fs] = FACE_ON[name];
      const kind = FACE_LIST[(seed + i * 3) % FACE_LIST.length];
      const fscale = Math.min(fs * 1.35, 0.95);
      faces += `<g transform="${tf} translate(${fx} ${fy}) rotate(${-rot}) scale(${fscale.toFixed(2)})">${face(kind)}</g>`;
    }
  });

  inner += sauceCup(147, 137, seed) + faces;
  return frame(inner, size);
}

function drawFood(recipe, size = 200) {
  if (recipe.base === 'box') return drawBento(recipe, size);
  const baseName = BASE[recipe.base] ? recipe.base : 'plate';
  const base = BASE[baseName];
  const items = (recipe.art || []).filter((n) => ART[n]).slice(0, 4);
  const pos = layout(baseName, Math.max(items.length, 1));

  // เลือกวางหน้าบนอาหารสีอ่อนก่อน (สีเข้มจะมองไม่เห็นตา)
  let heroIdx = items.findIndex((n) => FACE_ON[n] && !FACE_DARK.has(n));
  if (heroIdx < 0) heroIdx = items.findIndex((n) => FACE_ON[n]);
  const kind = FACE_LIST[jitterPos(recipe.id) % FACE_LIST.length];

  let inner = base.back;
  let faceLayer = '';

  items.forEach((name, i) => {
    const [x, y, s] = pos[i];
    const rot = jitter(recipe.id + name, i);
    const tf = `translate(${x} ${y}) scale(${s.toFixed(2)}) rotate(${rot})`;
    // เงาสัมผัสใต้อาหาร ทำให้ดูวางอยู่บนจานจริง ๆ
    inner += `<ellipse cx="${x}" cy="${(y + 30 * s).toFixed(1)}" rx="${(31 * s).toFixed(1)}" ry="${(7.5 * s).toFixed(1)}" fill="#8A6A45" opacity=".16"/>`;
    inner += `<g transform="${tf}">${ART[name]()}</g>`;

    if (i === heroIdx) {
      const [fx, fy, fs] = FACE_ON[name];
      // หมุนกลับให้หน้าตั้งตรงเสมอ
      faceLayer = `<g transform="${tf} translate(${fx} ${fy}) rotate(${-rot}) scale(${(fs * 1.12).toFixed(2)})">${face(kind)}</g>`;
    }
  });

  inner += base.front + faceLayer;
  return frame(inner, size);
}

/* ไอคอนวัตถุดิบเดี่ยว ๆ (ใช้ในหน้าตั้งค่า) */
function drawIcon(artName, size = 44) {
  const fn = ART[artName] || ART.egg_fried;
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g transform="translate(50 52) scale(0.78)">${fn()}</g></svg>`;
}

/* ใส่ชุดไล่เฉดสีลงในหน้าเว็บครั้งเดียว ทุกรูปเรียกใช้ร่วมกันได้ */
function mountDefs() {
  if (document.getElementById('food-defs')) return;
  const holder = document.createElement('div');
  holder.id = 'food-defs';
  holder.setAttribute('aria-hidden', 'true');
  holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  holder.innerHTML = DEFS;
  document.body.appendChild(holder);
}
if (document.body) mountDefs();
else document.addEventListener('DOMContentLoaded', mountDefs);

window.FoodArt = { drawFood, drawIcon, ART, mountDefs };
