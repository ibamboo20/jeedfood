/* ===========================================================
   JeedFood — ตรรกะแอป
   =========================================================== */

(function () {
'use strict';

const { INGREDIENTS, CATEGORIES, ING_BY_KEY, englishFor } = window.Ingredients;
const { BREAKFAST, LUNCH, DINNER } = window.Recipes;
const { drawFood, drawIcon, drawFoodStandalone } = window.FoodArt;

const STORE_PANTRY = 'jeedfood.pantry.v1';
const STORE_SALT = 'jeedfood.salt.v1';
const STORE_PICKED = 'jeedfood.picked.v1';   // รูปแบบเก่า เก็บชุดเดียวไม่แยกวัน
const STORE_PLANS = 'jeedfood.plans.v1';     // รูปแบบใหม่ แยกตามวันที่

const DEFAULT_PANTRY = ['egg', 'bread', 'sausage', 'milk', 'cheese', 'banana', 'rice', 'chicken', 'carrot', 'tomato'];

const TH_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

/* ---------------- วันที่ ---------------- */
const keyOf = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const todayKey = () => keyOf(new Date());
const parseKey = (k) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const shiftKey = (k, days) => {
  const d = parseKey(k);
  d.setDate(d.getDate() + days);
  return keyOf(d);
};
function dateLabel(key) {
  const d = parseKey(key);
  return `วัน${TH_DAYS[d.getDay()]}ที่ ${d.getDate()} ${TH_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}
/* ป้ายบอกว่าใกล้วันนี้แค่ไหน เช่น วันนี้ / พรุ่งนี้ / อีก 3 วัน */
function relativeLabel(key) {
  const diff = Math.round((parseKey(key) - parseKey(todayKey())) / 86400000);
  if (diff === 0) return 'วันนี้';
  if (diff === 1) return 'พรุ่งนี้';
  if (diff === 2) return 'มะรืนนี้';
  if (diff === -1) return 'เมื่อวาน';
  return diff > 0 ? `อีก ${diff} วัน` : `${-diff} วันก่อน`;
}

/* ---------------- state ---------------- */
const state = {
  pantry: load(STORE_PANTRY, DEFAULT_PANTRY),
  salt: load(STORE_SALT, {}),
  // แผนมื้ออาหารแยกตามวัน { 'YYYY-MM-DD': { breakfast, lunch, dinner } } มื้อละไม่เกิน 1 เมนู
  plans: load(STORE_PLANS, {}),
  date: todayKey(),
  meal: 'breakfast',
  query: '',
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
/* เลือกเมนูประจำวัน 9 รายการ (ยึดตามวันที่ผู้ใช้เลือก) */
function pickDaily(pool, mealName, n = 9) {
  const pantry = state.pantry;
  const salt = state.salt[state.date] || 0;
  const rng = mulberry32(hashStr(`${state.date}|${mealName}|${salt}`));

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

/* ตัดช่องว่างและแปลงเป็นตัวพิมพ์เล็ก เพื่อให้ค้นหาไม่สนใจรูปแบบการพิมพ์ */
const normSearch = (s) => String(s).toLowerCase().replace(/\s+/g, '');

/* ดัชนีค้นหาชื่ออาหารจากทุกเมนูในคลัง (คำนวณครั้งเดียวตอนเปิดแอป) */
const MEAL_LABEL = { bf: '🌅 เช้า', ln: '🎒 กลางวัน', dn: '🌙 เย็น' };
const MEAL_KEY = { bf: 'breakfast', ln: 'lunch', dn: 'dinner' };
const MEALS = [
  { key: 'breakfast', th: 'เช้า', en: 'Breakfast', emoji: '🌅' },
  { key: 'lunch', th: 'กลางวัน', en: 'Lunch', emoji: '🎒' },
  { key: 'dinner', th: 'เย็น', en: 'Dinner', emoji: '🌙' },
];
const ALL_RECIPES = [...BREAKFAST, ...LUNCH, ...DINNER].map((r) => Object.assign({}, r, {
  searchKey: normSearch(`${r.name}|${r.th}`),
  mealLabel: MEAL_LABEL[r.id.slice(0, 2)],
  mealKey: MEAL_KEY[r.id.slice(0, 2)],
}));

const EMPTY_PLAN = { breakfast: null, lunch: null, dinner: null };
const mealOf = (id) => MEAL_KEY[id.slice(0, 2)];
const planOf = (dateKey) => state.plans[dateKey] || EMPTY_PLAN;
const isPicked = (id) => planOf(state.date)[mealOf(id)] === id;

/* เลือก/ยกเลิกเมนูของวันที่กำลังดูอยู่ — มื้อหนึ่งเก็บได้รายการเดียว เลือกใหม่ทับของเดิม */
function togglePick(id) {
  const meal = mealOf(id);
  const p = Object.assign({}, EMPTY_PLAN, state.plans[state.date]);
  p[meal] = p[meal] === id ? null : id;
  if (!p.breakfast && !p.lunch && !p.dinner) delete state.plans[state.date];
  else state.plans[state.date] = p;
  save(STORE_PLANS, state.plans);
}
const pickedList = (dateKey = state.date) => {
  const p = planOf(dateKey);
  return MEALS
    .map((m) => ({ meal: m, recipe: p[m.key] ? findRecipe(p[m.key]) : null }))
    .filter((x) => x.recipe);
};

/* ย้ายข้อมูลจากรูปแบบเก่า (ไม่แยกวัน) มาเป็นแผนของวันนี้ */
(function migratePicked() {
  const old = load(STORE_PICKED, null);
  if (!old) return;
  if ((old.breakfast || old.lunch || old.dinner) && !state.plans[todayKey()]) {
    state.plans[todayKey()] = Object.assign({}, EMPTY_PLAN, old);
    save(STORE_PLANS, state.plans);
  }
  try { localStorage.removeItem(STORE_PICKED); } catch (e) { /* โหมดส่วนตัว */ }
})();

const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const escapeAttr = escapeHtml;

function currentPool() {
  return state.meal === 'breakfast' ? BREAKFAST : state.meal === 'lunch' ? LUNCH : DINNER;
}
function findRecipe(id) {
  return [...BREAKFAST, ...LUNCH, ...DINNER].find((r) => r.id === id);
}

/* ---------------- render: หน้าหลัก ---------------- */
const app = document.getElementById('app');

function renderHome() {
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
      <div class="date-line">
        <button class="date-nav" id="date-prev" aria-label="วันก่อนหน้า">‹</button>
        <input type="date" id="date-input" value="${state.date}" aria-label="เลือกวันที่">
        <button class="date-nav" id="date-next" aria-label="วันถัดไป">›</button>
        <span class="date-badge">${relativeLabel(state.date)}</span>
      </div>
      <div class="date-line">
        <span class="date-text">${dateLabel(state.date)}</span>
        <span class="spacer"></span>
        ${state.date !== todayKey() ? '<button class="ghost-btn" id="btn-today">↩︎ วันนี้</button>' : ''}
        <button class="ghost-btn" id="btn-reroll">🎲 สุ่มใหม่</button>
      </div>
    </div>

    <div class="search-row">
      <span class="search-icon">🔍</span>
      <input id="home-search" type="search" value="${escapeAttr(state.query)}"
             placeholder="ค้นหาชื่ออาหารจากทั้งหมด ${ALL_RECIPES.length} เมนู" autocomplete="off">
      <button id="home-search-clear" class="search-clear" aria-label="ล้างคำค้นหา" ${state.query ? '' : 'hidden'}>×</button>
    </div>

    <div id="home-body"></div>
  `;

  document.getElementById('btn-settings').onclick = () => go('settings');
  document.getElementById('btn-reroll').onclick = () => {
    state.salt[state.date] = (state.salt[state.date] || 0) + 1;
    save(STORE_SALT, state.salt);
    renderHomeBody();
  };

  /* ---- เลือกวันที่ ---- */
  const goToDate = (key) => { state.date = key; renderHome(); };
  document.getElementById('date-prev').onclick = () => goToDate(shiftKey(state.date, -1));
  document.getElementById('date-next').onclick = () => goToDate(shiftKey(state.date, 1));
  document.getElementById('date-input').onchange = (e) => {
    if (e.target.value) goToDate(e.target.value);
  };
  const todayBtn = document.getElementById('btn-today');
  if (todayBtn) todayBtn.onclick = () => goToDate(todayKey());

  const search = document.getElementById('home-search');
  const clearBtn = document.getElementById('home-search-clear');
  search.oninput = () => {
    state.query = search.value;
    clearBtn.hidden = !state.query;
    renderHomeBody();
  };
  clearBtn.onclick = () => {
    state.query = '';
    search.value = '';
    clearBtn.hidden = true;
    renderHomeBody();
    search.focus();
  };

  renderHomeBody();
}

/* ส่วนที่เปลี่ยนตามแท็บ/คำค้นหา แยกออกมาเพื่อไม่ให้ช่องค้นหาเสียโฟกัสตอนพิมพ์ */
function renderHomeBody() {
  const body = document.getElementById('home-body');
  if (!body) return;

  const q = normSearch(state.query);
  body.innerHTML = pickedBar() + (q ? searchView(q) : dailyView());

  body.querySelectorAll('.tab').forEach((t) => {
    t.onclick = () => { state.meal = t.dataset.meal; renderHomeBody(); window.scrollTo({ top: 0 }); };
  });
  const strip = body.querySelector('#pantry-strip');
  if (strip) strip.onclick = () => go('settings');

  body.querySelectorAll('.card').forEach((c) => {
    c.onclick = () => go('recipe', c.dataset.id);
    c.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go('recipe', c.dataset.id); }
    };
  });
  body.querySelectorAll('.card-pick').forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();          // ไม่ให้ทะลุไปเปิดหน้ารายละเอียด
      togglePick(b.dataset.pick);
      renderHomeBody();
    };
  });
  const bar = document.getElementById('picked-bar');
  if (bar) bar.onclick = () => go('save');
}

/* แถบสรุปเมนูที่เลือกไว้ กดแล้วไปหน้าบันทึก */
function pickedBar() {
  const picks = pickedList();
  if (!picks.length) return '';
  const chips = picks.map((p) =>
    `<span class="pick-chip">${p.meal.emoji} ${p.recipe.th}</span>`).join('');
  return `
    <button class="picked-bar" id="picked-bar">
      <span class="picked-count">แผนมื้ออาหาร${relativeLabel(state.date)} ${picks.length}/3 มื้อ</span>
      <span class="picked-chips">${chips}</span>
      <span class="picked-go">💾 บันทึกเมนู ›</span>
    </button>`;
}

/* มุมมองปกติ: เมนูประจำวันแยกตามมื้อ */
function dailyView() {
  const meals = MEALS;
  const note = {
    breakfast: 'อาหารเช้าสไตล์ฝรั่งง่าย ๆ จากวัตถุดิบที่บ้านมี',
    lunch: 'กล่องข้าวกลางวัน หยิบทานง่าย รวดเร็ว',
    dinner: 'มื้อหนัก เน้นข้าวหรือเส้น ให้พลังงานครบ',
  }[state.meal];
  const items = pickDaily(currentPool(), state.meal);

  return `
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

    <div class="grid">${items.map((s) => card(s)).join('')}</div>

    <footer class="foot">รายการเมนูจะเปลี่ยนใหม่ทุกวันโดยอัตโนมัติ 🌈</footer>
  `;
}

/* มุมมองค้นหา: หาจากทุกเมนูในคลัง ไม่ใช่แค่ 9 เมนูของวันนี้ */
const SEARCH_LIMIT = 48;

function searchView(q) {
  const hits = ALL_RECIPES.filter((r) => r.searchKey.includes(q));
  if (!hits.length) {
    return `<p class="search-empty">ไม่พบเมนูชื่อ "${escapeHtml(state.query)}" ลองพิมพ์คำอื่นดูนะ</p>`;
  }
  const shown = hits.slice(0, SEARCH_LIMIT);
  const more = hits.length > SEARCH_LIMIT
    ? `<span class="muted"> (แสดง ${SEARCH_LIMIT} รายการแรก)</span>` : '';

  return `
    <p class="search-count">พบ <b>${hits.length}</b> เมนู${more}</p>
    <div class="grid">
      ${shown.map((r) => card({
        r,
        missing: (r.needs || []).filter((k) => !state.pantry.includes(k)),
        meal: r.mealLabel,
      })).join('')}
    </div>
    <footer class="foot">แตะที่เมนูเพื่อดูส่วนผสมและวิธีทำ 🍳</footer>
  `;
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
  const meal = s.meal ? `<span class="card-meal">${s.meal}</span>` : '';
  const on = isPicked(r.id);
  return `
    <div class="card ${on ? 'picked' : ''}" data-id="${r.id}" role="button" tabindex="0">
      <div class="card-art">
        ${drawFood(r, 150)}
        <button class="card-pick" data-pick="${r.id}" aria-pressed="${on}"
                title="${on ? 'เอาออกจากที่เลือก' : 'เลือกเมนูนี้'}">${on ? '✓' : '+'}</button>
      </div>
      <div class="card-body">
        <div class="card-name">${r.name}</div>
        <div class="card-th">${r.th}</div>
        <div class="card-meta">${meal}<span class="time">⏱ ${r.time} นาที</span>${miss}</div>
      </div>
    </div>`;
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
      <button class="pick-btn ${isPicked(r.id) ? 'on' : ''}" id="btn-pick">
        ${isPicked(r.id) ? '✓ เลือกไว้แล้ว — แตะเพื่อเอาออก' : '＋ เลือกเมนูนี้'}
      </button>
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
  document.getElementById('btn-pick').onclick = () => { togglePick(r.id); renderRecipe(id); };
}

function mealLabel(id) {
  if (id.startsWith('bf')) return '🌅 อาหารเช้า';
  if (id.startsWith('ln')) return '🎒 อาหารกลางวัน';
  return '🌙 อาหารเย็น';
}

/* ---------------- render: หน้าบันทึกเมนูที่เลือก ---------------- */
function renderSave() {
  const picks = pickedList();

  app.innerHTML = `
    <header class="topbar sub no-print">
      <button class="icon-btn" id="btn-back" aria-label="ย้อนกลับ">←</button>
      <h2 class="sub-title">เมนูที่เลือกไว้</h2>
      <span class="spacer"></span>
    </header>

    ${!picks.length ? `
      <p class="search-empty">ยังไม่ได้เลือกเมนูเลย<br>
        <span class="muted small">กลับไปหน้าหลักแล้วกดปุ่ม ＋ ที่มุมรูปอาหาร เพื่อเลือกมื้อละ 1 เมนู</span>
      </p>` : `
      <div class="save-actions no-print">
        <button class="save-btn primary" id="btn-png">🖼️ บันทึกเป็นรูป</button>
        <button class="save-btn" id="btn-pdf">📄 บันทึกเป็น PDF</button>
        <button class="ghost-btn" id="btn-clear-picks">ล้างที่เลือก</button>
      </div>
      <p class="save-hint no-print" id="save-hint">
        เลือกไว้ ${picks.length} มื้อ — “บันทึกเป็นรูป” จะได้ไฟล์ PNG ส่วน “บันทึกเป็น PDF” จะเปิดหน้าต่างพิมพ์ ให้เลือกปลายทางเป็น <b>Save as PDF</b>
      </p>

      <div id="print-area">
        <div class="sheet-head">
          <h1 class="sheet-title">🍳 เมนูของหนู</h1>
          <p class="sheet-date">${relativeLabel(state.date)} · ${dateLabel(state.date)}</p>
        </div>
        ${picks.map(({ meal, recipe: r }) => `
          <section class="sheet-card">
            <div class="sheet-meal">${meal.emoji} ${meal.en} · ${meal.th}</div>
            <div class="sheet-top">
              <div class="sheet-art">${drawFood(r, 150)}</div>
              <div>
                <h2 class="sheet-name">${r.name}</h2>
                <p class="sheet-th">${r.th}</p>
                <p class="sheet-time">⏱ ${r.time} นาที</p>
                <p class="sheet-good">${r.good}</p>
              </div>
            </div>
            <div class="sheet-cols">
              <div>
                <h3>🧺 ส่วนผสม</h3>
                <ul>${r.ing.map((i) => {
                  const en = englishFor(i);
                  return `<li>${i}${en ? ` <em>(${en})</em>` : ''}</li>`;
                }).join('')}</ul>
              </div>
              <div>
                <h3>👩‍🍳 วิธีทำ</h3>
                <ol>${r.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
              </div>
            </div>
          </section>`).join('')}
        <p class="sheet-foot">สร้างจากแอป JeedFood 🌈</p>
      </div>
    `}
    <div class="pad no-print"></div>
  `;

  document.getElementById('btn-back').onclick = () => go('home');
  if (!picks.length) return;

  document.getElementById('btn-clear-picks').onclick = () => {
    delete state.plans[state.date];
    save(STORE_PLANS, state.plans);
    renderSave();
  };
  document.getElementById('btn-pdf').onclick = () => window.print();
  document.getElementById('btn-png').onclick = () => exportPng(picks);
}

/* ---------------- ส่งออกเป็นไฟล์ PNG (วาดเองด้วย canvas) ---------------- */
const PNG_W = 900;
const FONT = '"Noto Sans Thai", "Sukhumvit Set", -apple-system, system-ui, sans-serif';

/* ตัดบรรทัดข้อความ — ภาษาไทยไม่มีช่องว่าง จึงต้องตัดทีละอักขระเมื่อคำยาวเกิน */
function wrapText(ctx, text, maxW) {
  const lines = [];
  let line = '';
  for (const word of String(text).split(' ')) {
    const trial = line ? line + ' ' + word : word;
    if (ctx.measureText(trial).width <= maxW) { line = trial; continue; }
    if (line) { lines.push(line); line = ''; }
    let chunk = '';
    for (const ch of word) {
      if (ctx.measureText(chunk + ch).width > maxW && chunk) { lines.push(chunk); chunk = ''; }
      chunk += ch;
    }
    line = chunk;
  }
  if (line) lines.push(line);
  return lines;
}

function svgToImage(svg) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
}

async function exportPng(picks) {
  const hint = document.getElementById('save-hint');
  const btn = document.getElementById('btn-png');
  btn.disabled = true;
  const oldHint = hint.innerHTML;
  hint.textContent = 'กำลังสร้างรูป…';

  try {
    const images = await Promise.all(picks.map((p) => svgToImage(drawFoodStandalone(p.recipe, 300))));

    const scale = 2;                       // ความละเอียด 2 เท่า ให้ภาพคมบนจอมือถือ
    const measure = document.createElement('canvas').getContext('2d');
    const pad = 34, artW = 170, gap = 22;
    const textW = PNG_W - pad * 2 - artW - gap;

    // รอบแรก: คำนวณความสูงที่ต้องใช้
    const blocks = picks.map((p) => {
      const r = p.recipe;
      measure.font = `400 17px ${FONT}`;
      const good = wrapText(measure, r.good, textW);
      const ing = r.ing.map((i) => {
        const en = englishFor(i);
        return wrapText(measure, '•  ' + i + (en ? ` (${en})` : ''), textW + artW + gap - 20);
      });
      const steps = r.steps.map((s, i) => wrapText(measure, `${i + 1}. ${s}`, textW + artW + gap - 20));
      const topH = Math.max(artW, 34 + 26 + 24 + good.length * 24) + 10;
      const listH = 34 + ing.flat().length * 26 + 22 + 34 + steps.flat().length * 26;
      return { p, good, ing, steps, h: topH + listH + 40 };
    });

    const headH = 110;
    const total = headH + blocks.reduce((s, b) => s + b.h + 18, 0) + 50;

    const cv = document.createElement('canvas');
    cv.width = PNG_W * scale;
    cv.height = total * scale;
    const ctx = cv.getContext('2d');
    ctx.scale(scale, scale);

    ctx.fillStyle = '#FEFBFB'; ctx.fillRect(0, 0, PNG_W, total);
    ctx.fillStyle = '#FDEDF6'; ctx.fillRect(0, 0, PNG_W, headH);

    ctx.fillStyle = '#4A342A';
    ctx.font = `800 34px ${FONT}`;
    ctx.fillText('🍳 เมนูของหนู', pad, 52);
    ctx.font = `400 18px ${FONT}`;
    ctx.fillStyle = '#8A6A5E';
    ctx.fillText(`${relativeLabel(state.date)} · ${dateLabel(state.date)}`, pad, 84);

    let y = headH + 24;
    blocks.forEach((b, idx) => {
      const r = b.p.recipe;
      const top = y;

      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, pad - 14, top - 14, PNG_W - (pad - 14) * 2, b.h, 20);
      ctx.fill();
      ctx.strokeStyle = '#4A342A'; ctx.lineWidth = 3; ctx.stroke();

      ctx.drawImage(images[idx], pad, top, artW, artW);

      const tx = pad + artW + gap;
      ctx.fillStyle = '#A05CA0';
      ctx.font = `700 16px ${FONT}`;
      ctx.fillText(`${b.p.meal.emoji} ${b.p.meal.en} · ${b.p.meal.th}`, tx, top + 18);

      ctx.fillStyle = '#4A342A';
      ctx.font = `800 24px ${FONT}`;
      ctx.fillText(r.name, tx, top + 50);
      ctx.font = `400 19px ${FONT}`;
      ctx.fillStyle = '#8A6A5E';
      ctx.fillText(`${r.th}  ·  ⏱ ${r.time} นาที`, tx, top + 78);

      ctx.font = `400 17px ${FONT}`;
      let ty = top + 106;
      b.good.forEach((l) => { ctx.fillText(l, tx, ty); ty += 24; });

      let ly = top + Math.max(artW, ty - top) + 26;
      ctx.fillStyle = '#4A342A';
      ctx.font = `800 19px ${FONT}`;
      ctx.fillText('🧺 ส่วนผสม', pad, ly);
      ly += 30;
      ctx.font = `400 17px ${FONT}`;
      b.ing.flat().forEach((l) => { ctx.fillText(l, pad, ly); ly += 26; });

      ly += 18;
      ctx.font = `800 19px ${FONT}`;
      ctx.fillText('👩‍🍳 วิธีทำ', pad, ly);
      ly += 30;
      ctx.font = `400 17px ${FONT}`;
      b.steps.flat().forEach((l) => { ctx.fillText(l, pad, ly); ly += 26; });

      y += b.h + 18;
    });

    ctx.fillStyle = '#8A6A5E';
    ctx.font = `400 16px ${FONT}`;
    ctx.fillText('สร้างจากแอป JeedFood 🌈', pad, total - 22);

    const blob = await new Promise((res) => cv.toBlob(res, 'image/png'));
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jeedfood-${state.date}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    hint.innerHTML = 'บันทึกรูปเรียบร้อย ✓ (ดูในโฟลเดอร์ดาวน์โหลด)';
  } catch (err) {
    hint.innerHTML = 'สร้างรูปไม่สำเร็จ: ' + err.message + ' — ลองใช้ปุ่ม PDF แทนได้';
  } finally {
    btn.disabled = false;
    setTimeout(() => { if (hint.isConnected) hint.innerHTML = oldHint; }, 6000);
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
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
      แตะเลือกวัตถุดิบที่บ้านมีตอนนี้ แอปจะคิดเมนู <b>อาหารเช้า</b> และ <b>อาหารกลางวัน</b> อย่างละ 9 รายการจากของเหล่านี้ให้อัตโนมัติ
      <br><span class="muted">(อาหารเย็นจะเป็นเมนูข้าว/เส้นที่มีสารอาหารครบ ไม่ขึ้นกับรายการนี้)</span>
    </p>

    <div class="search-row">
      <span class="search-icon">🔍</span>
      <input id="ing-search" type="search" placeholder="ค้นหาส่วนผสม เช่น ไข่ หรือ egg" autocomplete="off">
      <button id="search-clear" class="search-clear" aria-label="ล้างคำค้นหา" hidden>×</button>
    </div>
    <p id="search-empty" class="search-empty" hidden>ไม่พบส่วนผสมที่ค้นหา ลองพิมพ์คำอื่นดูนะ</p>

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
            <button class="ing ${state.pantry.includes(i.key) ? 'on' : ''}" data-key="${i.key}"
                    data-search="${searchKey(i)}">
              <span class="ing-art">${drawIcon(i.art, 40)}</span>
              <span class="ing-th">${i.th}</span>
              <span class="ing-en">${i.en}</span>
              <span class="ing-check">✓</span>
            </button>`).join('')}
        </div>
      </section>`).join('')}

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

  /* ---- ค้นหาส่วนผสม ---- */
  const search = document.getElementById('ing-search');
  const clearBtn = document.getElementById('search-clear');
  const emptyMsg = document.getElementById('search-empty');

  const applyFilter = () => {
    const q = normSearch(search.value);
    let found = 0;
    app.querySelectorAll('.cat').forEach((cat) => {
      let shown = 0;
      cat.querySelectorAll('.ing').forEach((b) => {
        const hit = !q || b.dataset.search.includes(q);
        b.hidden = !hit;
        if (hit) shown++;
      });
      cat.hidden = shown === 0;
      found += shown;
    });
    emptyMsg.hidden = found > 0;
    clearBtn.hidden = !search.value;
  };

  search.oninput = applyFilter;
  clearBtn.onclick = () => { search.value = ''; applyFilter(); search.focus(); };
  applyFilter();
}

/* คำที่ใช้ค้นหาของวัตถุดิบแต่ละตัว (ไทย + อังกฤษ + คำพ้อง) */
function searchKey(ing) {
  return normSearch([ing.th, ing.en, ...ing.syn].join('|'));
}

/* ---------------- router ---------------- */
function go(view, id) {
  const hash = view === 'home' ? '#/'
    : view === 'settings' ? '#/settings'
    : view === 'save' ? '#/save'
    : `#/r/${id}`;
  if (location.hash !== hash) location.hash = hash;
  else route();
}

function route() {
  const h = location.hash || '#/';
  window.scrollTo({ top: 0 });
  if (h.startsWith('#/r/')) return renderRecipe(h.slice(4));
  if (h === '#/settings') return renderSettings();
  if (h === '#/save') return renderSave();
  return renderHome();
}

window.addEventListener('hashchange', route);
route();

})();
