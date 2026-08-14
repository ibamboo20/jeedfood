/* ===========================================================
   JeedFood — ตรรกะแอป
   =========================================================== */

(function () {
'use strict';

const { INGREDIENTS, CATEGORIES, ING_BY_KEY, matchIngredient, englishFor } = window.Ingredients;
const { BREAKFAST, LUNCH, DINNER } = window.Recipes;
const { drawFood, drawIcon } = window.FoodArt;

const STORE_PANTRY = 'jeedfood.pantry.v1';
const STORE_CUSTOM = 'jeedfood.custom.v1';
const STORE_SALT = 'jeedfood.salt.v1';

const DEFAULT_PANTRY = ['egg', 'bread', 'sausage', 'milk', 'cheese', 'banana', 'rice', 'chicken', 'carrot', 'tomato'];

const TH_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

/* ---------------- state ---------------- */
const state = {
  pantry: load(STORE_PANTRY, DEFAULT_PANTRY),
  custom: load(STORE_CUSTOM, []),
  salt: load(STORE_SALT, {}),
  meal: 'breakfast',
  view: 'home',
  recipeId: null,
};

function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v === null || v === undefined ? fallback : v;
  } catch (e) {
    return fallback;
  }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* โหมดส่วนตัว */ }
}

/* ---------------- สุ่มแบบคงที่ตามวัน ---------------- */
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function todayLabel() {
  const d = new Date();
  return `วัน${TH_DAYS[d.getDay()]}ที่ ${d.getDate()} ${TH_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}

/* เลือกเมนูประจำวัน 9 รายการ */
function pickDaily(pool, mealName, n = 9) {
  const pantry = state.pantry;
  const salt = state.salt[todayKey()] || 0;
  const rng = mulberry32(hashStr(`${todayKey()}|${mealName}|${salt}`));

  const scored = pool.map((r) => ({
    r,
    missing: (r.needs || []).filter((k) => !pantry.includes(k)),
  }));

  // เมนูที่ทำได้ทันที → สุ่มลำดับตามวัน
  const ready = scored.filter((s) => s.missing.length === 0);
  ready.forEach((s) => { s.sort = rng(); });
  ready.sort((a, b) => a.sort - b.sort);

  const out = ready.slice(0, n);

  // ถ้ายังไม่ครบ 9 → เติมเมนูที่ขาดวัตถุดิบน้อยที่สุด
  if (out.length < n) {
    const partial = scored.filter((s) => s.missing.length > 0);
    partial.forEach((s) => { s.sort = s.missing.length + rng() * 0.8; });
    partial.sort((a, b) => a.sort - b.sort);
    out.push(...partial.slice(0, n - out.length));
  }
  return out;
}

function currentPool() {
  return state.meal === 'breakfast' ? BREAKFAST : state.meal === 'lunch' ? LUNCH : DINNER;
}
function findRecipe(id) {
  return [...BREAKFAST, ...LUNCH, ...DINNER].find((r) => r.id === id);
}

/* ---------------- render: หน้าหลัก ---------------- */
const app = document.getElementById('app');

function renderHome() {
  const items = pickDaily(currentPool(), state.meal);
  const meals = [
    { key: 'breakfast', th: 'เช้า', en: 'Breakfast', emoji: '🌅' },
    { key: 'lunch', th: 'กลางวัน', en: 'Lunch', emoji: '🎒' },
    { key: 'dinner', th: 'เย็น', en: 'Dinner', emoji: '🌙' },
  ];
  const note = {
    breakfast: 'อาหารเช้าสไตล์ฝรั่งง่าย ๆ จากวัตถุดิบที่บ้านมี',
    lunch: 'กล่องข้าวกลางวัน หยิบทานง่าย รวดเร็ว',
    dinner: 'มื้อหนัก เน้นข้าวหรือเส้น ให้พลังงานครบ',
  }[state.meal];

  app.innerHTML = `
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark">🍳</span>
        <div>
          <h1>JeedFood</h1>
          <p class="brand-sub">เมนูสุขภาพสำหรับหนูน้อย 7 ขวบ</p>
        </div>
      </div>
      <button class="icon-btn" id="btn-settings" aria-label="ตั้งค่าส่วนผสม" title="ตั้งค่าส่วนผสม">⚙️</button>
    </header>

    <div class="datebar">
      <div>
        <span class="date-badge">เมนูวันนี้</span>
        <span class="date-text">${todayLabel()}</span>
      </div>
      <button class="ghost-btn" id="btn-reroll">🎲 สุ่มใหม่</button>
    </div>

    <nav class="tabs" role="tablist">
      ${meals.map((m) => `
        <button class="tab ${state.meal === m.key ? 'active' : ''}" data-meal="${m.key}" role="tab" aria-selected="${state.meal === m.key}">
          <span class="tab-emoji">${m.emoji}</span>
          <span class="tab-en">${m.en}</span>
          <span class="tab-th">${m.th}</span>
        </button>`).join('')}
    </nav>

    <p class="meal-note">${note}</p>
    ${state.meal !== 'dinner' ? pantrySummary() : ''}

    <div class="grid">
      ${items.map((s) => card(s)).join('')}
    </div>

    <footer class="foot">รายการเมนูจะเปลี่ยนใหม่ทุกวันโดยอัตโนมัติ 🌈</footer>
  `;

  document.getElementById('btn-settings').onclick = () => go('settings');
  const strip = document.getElementById('pantry-strip');
  if (strip) strip.onclick = () => go('settings');
  document.getElementById('btn-reroll').onclick = () => {
    const k = todayKey();
    state.salt[k] = (state.salt[k] || 0) + 1;
    save(STORE_SALT, state.salt);
    renderHome();
  };
  app.querySelectorAll('.tab').forEach((t) => {
    t.onclick = () => { state.meal = t.dataset.meal; renderHome(); window.scrollTo({ top: 0 }); };
  });
  app.querySelectorAll('.card').forEach((c) => {
    c.onclick = () => go('recipe', c.dataset.id);
  });
}

function pantrySummary() {
  const names = state.pantry.map((k) => ING_BY_KEY[k] && ING_BY_KEY[k].th).filter(Boolean);
  if (!names.length) {
    return `<button class="pantry-strip empty" id="pantry-strip">ยังไม่ได้เลือกส่วนผสม — แตะเพื่อใส่ของที่บ้านมี</button>`;
  }
  const shown = names.slice(0, 6).join(' · ');
  const more = names.length > 6 ? ` +${names.length - 6}` : '';
  return `<button class="pantry-strip" id="pantry-strip">คิดจากส่วนผสมที่มี: <b>${shown}${more}</b> <span class="edit-hint">แก้ไข ›</span></button>`;
}

function card(s) {
  const r = s.r;
  const miss = s.missing.length
    ? `<span class="miss">ขาด ${s.missing.map((k) => ING_BY_KEY[k].th).join(', ')}</span>`
    : '';
  return `
    <button class="card" data-id="${r.id}">
      <div class="card-art">${drawFood(r, 150)}</div>
      <div class="card-body">
        <div class="card-name">${r.name}</div>
        <div class="card-th">${r.th}</div>
        <div class="card-meta"><span class="time">⏱ ${r.time} นาที</span>${miss}</div>
      </div>
    </button>`;
}

/* ---------------- render: หน้ารายละเอียดเมนู ---------------- */
function renderRecipe(id) {
  const r = findRecipe(id);
  if (!r) return go('home');
  const missing = (r.needs || []).filter((k) => !state.pantry.includes(k));

  app.innerHTML = `
    <header class="topbar sub">
      <button class="icon-btn" id="btn-back" aria-label="ย้อนกลับ">←</button>
      <h2 class="sub-title">รายละเอียดเมนู</h2>
      <span class="spacer"></span>
    </header>

    <div class="hero">
      <div class="hero-art">${drawFood(r, 220)}</div>
      <h2 class="hero-name">${r.name}</h2>
      <p class="hero-th">${r.th}</p>
      <div class="chips-row">
        <span class="chip-info">⏱ ${r.time} นาที</span>
        <span class="chip-info">${mealLabel(r.id)}</span>
      </div>
    </div>

    <section class="panel good">
      <h3>💪 ดีต่อร่างกายยังไง</h3>
      <p>${r.good}</p>
    </section>

    ${missing.length ? `
    <section class="panel warn">
      <h3>🛒 ต้องซื้อเพิ่ม</h3>
      <p>${missing.map((k) => `${ING_BY_KEY[k].th} (${ING_BY_KEY[k].en})`).join(', ')}</p>
    </section>` : ''}

    <section class="panel">
      <h3>🧺 ส่วนผสมทั้งหมด</h3>
      <ul class="ing-list">
        ${r.ing.map((i) => {
          const en = englishFor(i);
          return `<li><span class="dot"></span><span>${i}${en ? ` <em class="ing-en-inline">${en}</em>` : ''}</span></li>`;
        }).join('')}
      </ul>
    </section>

    <section class="panel">
      <h3>👩‍🍳 วิธีทำ</h3>
      <ol class="step-list">
        ${r.steps.map((s, i) => `<li><span class="step-no">${i + 1}</span><span>${s}</span></li>`).join('')}
      </ol>
    </section>

    <div class="pad"></div>
  `;
  document.getElementById('btn-back').onclick = () => go('home');
}

function mealLabel(id) {
  if (id.startsWith('bf')) return '🌅 อาหารเช้า';
  if (id.startsWith('ln')) return '🎒 อาหารกลางวัน';
  return '🌙 อาหารเย็น';
}

/* ---------------- render: หน้าตั้งค่า ---------------- */
function renderSettings() {
  app.innerHTML = `
    <header class="topbar sub">
      <button class="icon-btn" id="btn-back" aria-label="ย้อนกลับ">←</button>
      <h2 class="sub-title">ตั้งค่าส่วนผสม</h2>
      <span class="spacer"></span>
    </header>

    <p class="settings-lead">
      เลือกวัตถุดิบหลักที่บ้านมีตอนนี้ แอปจะคิดเมนู <b>อาหารเช้า</b> และ <b>อาหารกลางวัน</b> อย่างละ 9 รายการจากของเหล่านี้ให้อัตโนมัติ
      <br><span class="muted">(อาหารเย็นจะเป็นเมนูข้าว/เส้นที่มีสารอาหารครบ ไม่ขึ้นกับรายการนี้)</span>
    </p>

    <div class="add-row">
      <input id="ing-input" type="text" placeholder="พิมพ์ส่วนผสม เช่น ไข่, ขนมปัง, อโวคาโด" autocomplete="off">
      <button id="ing-add" class="add-btn">เพิ่ม</button>
    </div>
    <div id="toast" class="toast"></div>

    <div class="bulk-row">
      <span class="count">เลือกแล้ว <b id="cnt">${state.pantry.length}</b> อย่าง</span>
      <div>
        <button class="ghost-btn" id="btn-all">เลือกทั้งหมด</button>
        <button class="ghost-btn" id="btn-none">ล้างทั้งหมด</button>
      </div>
    </div>

    ${CATEGORIES.map((c) => `
      <section class="cat">
        <h3 class="cat-title">${c.th}</h3>
        <div class="ing-grid">
          ${INGREDIENTS.filter((i) => i.cat === c.key).map((i) => `
            <button class="ing ${state.pantry.includes(i.key) ? 'on' : ''}" data-key="${i.key}">
              <span class="ing-art">${drawIcon(i.art, 40)}</span>
              <span class="ing-th">${i.th}</span>
              <span class="ing-en">${i.en}</span>
              <span class="ing-check">✓</span>
            </button>`).join('')}
        </div>
      </section>`).join('')}

    ${state.custom.length ? `
      <section class="cat">
        <h3 class="cat-title">ส่วนผสมที่จดไว้เอง</h3>
        <div class="custom-row">
          ${state.custom.map((t, i) => `<span class="custom-chip">${t}<button data-i="${i}" class="x">×</button></span>`).join('')}
        </div>
        <p class="muted small">รายการนี้จดไว้เตือนความจำ ยังไม่มีสูตรอาหารรองรับโดยตรง</p>
      </section>` : ''}

    <div class="pad"></div>
  `;

  document.getElementById('btn-back').onclick = () => go('home');

  app.querySelectorAll('.ing').forEach((b) => {
    b.onclick = () => {
      const k = b.dataset.key;
      const i = state.pantry.indexOf(k);
      if (i >= 0) state.pantry.splice(i, 1); else state.pantry.push(k);
      save(STORE_PANTRY, state.pantry);
      b.classList.toggle('on');
      document.getElementById('cnt').textContent = state.pantry.length;
    };
  });

  document.getElementById('btn-all').onclick = () => {
    state.pantry = INGREDIENTS.map((i) => i.key);
    save(STORE_PANTRY, state.pantry);
    renderSettings();
  };
  document.getElementById('btn-none').onclick = () => {
    state.pantry = [];
    save(STORE_PANTRY, state.pantry);
    renderSettings();
  };

  const input = document.getElementById('ing-input');
  const addIng = () => {
    const raw = input.value.trim();
    if (!raw) return;
    raw.split(/[,،\n]+/).map((t) => t.trim()).filter(Boolean).forEach((t) => {
      const key = matchIngredient(t);
      if (key) {
        if (!state.pantry.includes(key)) state.pantry.push(key);
        toast(`เพิ่ม "${ING_BY_KEY[key].th}" แล้ว ✓`);
      } else {
        if (!state.custom.includes(t)) state.custom.push(t);
        toast(`จด "${t}" ไว้แล้ว (ยังไม่มีสูตรรองรับ)`);
      }
    });
    save(STORE_PANTRY, state.pantry);
    save(STORE_CUSTOM, state.custom);
    input.value = '';
    const scroll = window.scrollY;
    renderSettings();
    window.scrollTo({ top: scroll });
  };
  document.getElementById('ing-add').onclick = addIng;
  input.onkeydown = (e) => { if (e.key === 'Enter') addIng(); };

  app.querySelectorAll('.custom-chip .x').forEach((b) => {
    b.onclick = () => {
      state.custom.splice(+b.dataset.i, 1);
      save(STORE_CUSTOM, state.custom);
      renderSettings();
    };
  });
}

let toastTimer = null;
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------------- router ---------------- */
function go(view, id) {
  const hash = view === 'home' ? '#/' : view === 'settings' ? '#/settings' : `#/r/${id}`;
  if (location.hash !== hash) location.hash = hash;
  else route();
}

function route() {
  const h = location.hash || '#/';
  window.scrollTo({ top: 0 });
  if (h.startsWith('#/r/')) return renderRecipe(h.slice(4));
  if (h === '#/settings') return renderSettings();
  return renderHome();
}

window.addEventListener('hashchange', route);
route();

})();
