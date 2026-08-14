/* ===========================================================
   JeedFood — คลังวัตถุดิบหลัก
   key ใช้จับคู่กับเมนู, syn = คำที่ผู้ใช้อาจพิมพ์
   =========================================================== */

const INGREDIENTS = [
  // หมวด: โปรตีน
  { key: 'egg',        th: 'ไข่',            en: 'Egg',          cat: 'protein', art: 'egg_fried',     syn: ['ไข่', 'ไข่ไก่', 'egg', 'eggs'] },
  { key: 'chicken',    th: 'ไก่',            en: 'Chicken',      cat: 'protein', art: 'chicken_drum',  syn: ['ไก่', 'อกไก่', 'สะโพกไก่', 'chicken'] },
  { key: 'pork',       th: 'หมู',            en: 'Pork',         cat: 'protein', art: 'meatball',      syn: ['หมู', 'หมูสับ', 'หมูบด', 'pork'] },
  { key: 'sausage',    th: 'ไส้กรอก',        en: 'Sausage',      cat: 'protein', art: 'sausage',       syn: ['ไส้กรอก', 'sausage', 'hotdog', 'ฮอทดอก'] },
  { key: 'ham',        th: 'แฮม',            en: 'Ham',          cat: 'protein', art: 'ham_roll',      syn: ['แฮม', 'ham'] },
  { key: 'bacon',      th: 'เบคอน',          en: 'Bacon',        cat: 'protein', art: 'bacon',         syn: ['เบคอน', 'bacon'] },
  { key: 'tuna',       th: 'ทูน่า',          en: 'Tuna',         cat: 'protein', art: 'tuna_scoop',    syn: ['ทูน่า', 'tuna', 'ปลากระป๋อง'] },
  { key: 'fish',       th: 'ปลา',            en: 'Fish',         cat: 'protein', art: 'fish_fillet',   syn: ['ปลา', 'เนื้อปลา', 'fish', 'ปลาดอรี่'] },
  { key: 'salmon',     th: 'แซลมอน',         en: 'Salmon',       cat: 'protein', art: 'salmon',        syn: ['แซลมอน', 'salmon', 'ปลาแซลมอน'] },
  { key: 'shrimp',     th: 'กุ้ง',           en: 'Shrimp',       cat: 'protein', art: 'shrimp',        syn: ['กุ้ง', 'shrimp', 'prawn'] },
  { key: 'tofu',       th: 'เต้าหู้',        en: 'Tofu',         cat: 'protein', art: 'tofu',          syn: ['เต้าหู้', 'tofu'] },

  // หมวด: แป้ง / ธัญพืช
  { key: 'bread',      th: 'ขนมปัง',         en: 'Bread',        cat: 'carb',    art: 'toast',         syn: ['ขนมปัง', 'bread', 'toast', 'ขนมปังแผ่น'] },
  { key: 'rice',       th: 'ข้าวสวย',        en: 'Rice',         cat: 'carb',    art: 'rice_mound',    syn: ['ข้าว', 'ข้าวสวย', 'rice', 'ข้าวกล้อง'] },
  { key: 'noodle',     th: 'เส้นก๋วยเตี๋ยว', en: 'Noodle',       cat: 'carb',    art: 'noodles',       syn: ['เส้น', 'ก๋วยเตี๋ยว', 'บะหมี่', 'noodle', 'udon', 'อุด้ง'] },
  { key: 'pasta',      th: 'พาสต้า',         en: 'Pasta',        cat: 'carb',    art: 'pasta_shell',   syn: ['พาสต้า', 'สปาเกตตี', 'มักกะโรนี', 'pasta', 'spaghetti'] },
  { key: 'flour',      th: 'แป้งแพนเค้ก',    en: 'Pancake mix',  cat: 'carb',    art: 'pancake',       syn: ['แป้ง', 'แพนเค้ก', 'แป้งแพนเค้ก', 'flour', 'pancake'] },
  { key: 'oat',        th: 'ข้าวโอ๊ต',       en: 'Oats',         cat: 'carb',    art: 'oat_blob',      syn: ['โอ๊ต', 'ข้าวโอ๊ต', 'oat', 'oats'] },
  { key: 'cereal',     th: 'ซีเรียล',        en: 'Cereal',       cat: 'carb',    art: 'cereal',        syn: ['ซีเรียล', 'cereal', 'คอร์นเฟลก'] },
  { key: 'cracker',    th: 'แครกเกอร์',      en: 'Cracker',      cat: 'carb',    art: 'cracker',       syn: ['แครกเกอร์', 'cracker', 'บิสกิต'] },
  { key: 'potato',     th: 'มันฝรั่ง',       en: 'Potato',       cat: 'carb',    art: 'potato_wedge',  syn: ['มันฝรั่ง', 'potato'] },

  // หมวด: นม / ชีส
  { key: 'milk',       th: 'นม',             en: 'Milk',         cat: 'dairy',   art: 'milk_glass',    syn: ['นม', 'milk', 'นมสด'] },
  { key: 'cheese',     th: 'ชีส',            en: 'Cheese',       cat: 'dairy',   art: 'cheese_cube',   syn: ['ชีส', 'cheese', 'เชดดาร์'] },
  { key: 'yogurt',     th: 'โยเกิร์ต',       en: 'Yogurt',       cat: 'dairy',   art: 'yogurt_cup',    syn: ['โยเกิร์ต', 'yogurt', 'yoghurt'] },

  // หมวด: ผัก
  { key: 'avocado',    th: 'อโวคาโด',        en: 'Avocado',      cat: 'veg',     art: 'avocado_half',  syn: ['อโวคาโด', 'อะโวคาโด', 'avocado'] },
  { key: 'tomato',     th: 'มะเขือเทศ',      en: 'Tomato',       cat: 'veg',     art: 'tomato',        syn: ['มะเขือเทศ', 'tomato'] },
  { key: 'cucumber',   th: 'แตงกวา',         en: 'Cucumber',     cat: 'veg',     art: 'cucumber',      syn: ['แตงกวา', 'cucumber'] },
  { key: 'carrot',     th: 'แครอท',          en: 'Carrot',       cat: 'veg',     art: 'carrot_stick',  syn: ['แครอท', 'carrot'] },
  { key: 'broccoli',   th: 'บรอกโคลี',       en: 'Broccoli',     cat: 'veg',     art: 'broccoli',      syn: ['บรอกโคลี', 'บล็อคโคลี่', 'broccoli'] },
  { key: 'corn',       th: 'ข้าวโพด',        en: 'Corn',         cat: 'veg',     art: 'corn',          syn: ['ข้าวโพด', 'corn'] },
  { key: 'spinach',    th: 'ผักโขม',         en: 'Spinach',      cat: 'veg',     art: 'spinach',       syn: ['ผักโขม', 'spinach', 'ผักใบเขียว'] },
  { key: 'mushroom',   th: 'เห็ด',           en: 'Mushroom',     cat: 'veg',     art: 'mushroom',      syn: ['เห็ด', 'mushroom'] },

  // หมวด: ผลไม้ & อื่น ๆ
  { key: 'banana',     th: 'กล้วย',          en: 'Banana',       cat: 'fruit',   art: 'banana',        syn: ['กล้วย', 'banana'] },
  { key: 'strawberry', th: 'สตรอว์เบอร์รี',  en: 'Strawberry',   cat: 'fruit',   art: 'strawberry',    syn: ['สตรอ', 'สตรอว์เบอร์รี', 'strawberry'] },
  { key: 'blueberry',  th: 'บลูเบอร์รี',     en: 'Blueberry',    cat: 'fruit',   art: 'blueberry',     syn: ['บลูเบอร์รี', 'blueberry', 'เบอร์รี'] },
  { key: 'apple',      th: 'แอปเปิล',        en: 'Apple',        cat: 'fruit',   art: 'apple_slice',   syn: ['แอปเปิล', 'แอปเปิ้ล', 'apple'] },
  { key: 'peanut',     th: 'เนยถั่ว',        en: 'Peanut butter', cat: 'fruit',  art: 'toast_pb',      syn: ['เนยถั่ว', 'peanut', 'peanut butter'] },
];

const CATEGORIES = [
  { key: 'protein', th: 'โปรตีน' },
  { key: 'carb',    th: 'แป้ง / ธัญพืช' },
  { key: 'dairy',   th: 'นม / ชีส' },
  { key: 'veg',     th: 'ผัก' },
  { key: 'fruit',   th: 'ผลไม้ / อื่น ๆ' },
];

const ING_BY_KEY = Object.fromEntries(INGREDIENTS.map((i) => [i.key, i]));

/* คำขยายที่ต่อท้ายชื่อวัตถุดิบได้ เช่น "ขนมปังโฮลวีต" -> ขนมปัง
   (ไม่ใส่คำที่เปลี่ยนความหมาย เช่น "นมข้น" หรือ "ปลาหมึก") */
const MODIFIERS = [
  'โฮลวีต', 'โฮลเกรน', 'ขาว', 'สด', 'จืด', 'หวาน', 'ปิ้ง', 'กรอบ', 'แผ่น', 'ก้อน', 'ชิ้น',
  'ลูก', 'ฟอง', 'สับ', 'บด', 'ต้ม', 'ทอด', 'ย่าง', 'นึ่ง', 'แช่แข็ง', 'กระป๋อง', 'ขูด',
  'ฝอย', 'ซอย', 'หั่น', 'อบ', 'แท่ง', 'ถ้วย', 'ไก่', 'หมู', 'สุก', 'ใหญ่', 'เล็ก', 'สาร',
  'หอม', 'แข็ง', 'อุ่น', 'เย็น', 'เชอร์รี', 'slice', 'slices', 'fillet', 'breast',
];

const norm = (s) => String(s).trim().toLowerCase().replace(/\s+/g, '');

/** แปลงข้อความที่ผู้ใช้พิมพ์ -> key วัตถุดิบ (ถ้าเจอ) */
function matchIngredient(text) {
  const t = norm(text);
  if (!t) return null;

  // 1) ตรงเป๊ะ
  for (const ing of INGREDIENTS) {
    if (ing.syn.some((s) => norm(s) === t)) return ing.key;
  }
  // 2) ผู้ใช้พิมพ์ไม่จบคำ เช่น "อโว" -> อโวคาโด
  if (t.length >= 2) {
    for (const ing of INGREDIENTS) {
      if (ing.syn.some((s) => norm(s).startsWith(t))) return ing.key;
    }
  }
  // 3) ชื่อวัตถุดิบ + คำขยาย เช่น "ขนมปังโฮลวีต", "ไข่ต้ม"
  for (const ing of INGREDIENTS) {
    for (const s of ing.syn) {
      const sl = norm(s);
      if (sl.length >= 2 && t.startsWith(sl)) {
        const rest = t.slice(sl.length);
        if (MODIFIERS.includes(rest)) return ing.key;
      }
    }
  }
  return null;
}

/* รายการคำพ้องเรียงจากยาวไปสั้น เพื่อให้จับคำที่เจาะจงที่สุดก่อน
   (เช่น "ข้าวโพด" ต้องมาก่อน "ข้าว") */
const SYN_INDEX = INGREDIENTS
  .flatMap((ing) => ing.syn.map((s) => ({ s: norm(s), ing })))
  .sort((a, b) => b.s.length - a.s.length);

/* ชื่ออังกฤษของวัตถุดิบ/เครื่องปรุงที่ไม่ได้อยู่ในคลังหลัก (ใช้แสดงผลอย่างเดียว) */
const EXTRA_EN = {
  'กุ้งปอกเปลือก': 'Peeled shrimp',
  'ก้อนแกงกะหรี่ญี่ปุ่น': 'Japanese curry roux',
  'ขนมปังกลมหรือขนมปัง': 'Bun or bread',
  'ขนมปังกลมเล็ก': 'Small buns',
  'ขิงซอยและต้นหอม': 'Sliced ginger & spring onion',
  'ขิงและกระเทียม': 'Ginger & garlic',
  'ข้าวโพดหวานและผักโขม': 'Sweet corn & spinach',
  'ข้าวโพดและแครอทหั่นเต๋า': 'Diced corn & carrot',
  'ครีมชีส': 'Cream cheese',
  'ครีมชีสหรือชีสแผ่น': 'Cream cheese or sliced cheese',
  'คะน้าหรือบรอกโคลี': 'Chinese kale or broccoli',
  'งาขาว': 'White sesame',
  'งาขาวสำหรับโรย': 'White sesame for topping',
  'ชีสพาร์เมซานสำหรับโรย': 'Parmesan for topping',
  'ชีสเชดดาร์ขูด': 'Grated cheddar',
  'ชีสแท่งหรือชีสก้อน': 'Cheese sticks or cubes',
  'ชีสแผ่นหรือชีสขูด': 'Sliced or grated cheese',
  'ซอสมะเขือเทศ': 'Ketchup',
  'ซอสมะเขือเทศสำหรับจิ้ม': 'Ketchup for dipping',
  'ซีอิ๊วขาว': 'Light soy sauce',
  'ซีอิ๊วดำหวานและซีอิ๊วขาว': 'Sweet dark & light soy sauce',
  'ซีเรียลหรือกราโนล่า': 'Cereal or granola',
  'ซีเรียลไม่หวานจัด': 'Low-sugar cereal',
  'ต้นหอม': 'Spring onion',
  'ต้นหอมและกระเทียมเจียว': 'Spring onion & fried garlic',
  'ทูน่าในน้ำแร่': 'Tuna in spring water',
  'น้ำ': 'Water',
  'น้ำจิ้มซีฟู้ดอ่อน': 'Mild seafood sauce',
  'น้ำซุป': 'Broth',
  'น้ำซุปกระดูกไก่': 'Chicken bone broth',
  'น้ำซุปจากการต้มไก่': 'Broth from boiling the chicken',
  'น้ำซุปไก่': 'Chicken broth',
  'น้ำผึ้ง': 'Honey',
  'น้ำมะนาว': 'Lime juice',
  'น้ำมะนาวและเกลือนิดหน่อย': 'Lime juice & a pinch of salt',
  'น้ำมัน': 'Oil',
  'น้ำมันมะกอก': 'Olive oil',
  'บรอกโคลีหรือผักโขม': 'Broccoli or spinach',
  'บรอกโคลีและแครอท': 'Broccoli & carrot',
  'บลูเบอร์รีหรือองุ่น': 'Blueberry or grapes',
  'ผลไม้': 'Fruit',
  'ผลไม้ตามชอบ': 'Any fruit',
  'ผลไม้สำหรับโรยหน้า': 'Fruit for topping',
  'ผลไม้หั่นชิ้น': 'Sliced fruit',
  'ผลไม้อื่นตามชอบ': 'Other fruit',
  'ผักสลัด': 'Lettuce',
  'ผักสลัดและมะเขือเทศ': 'Lettuce & tomato',
  'ผักหั่นเล็ก': 'Finely chopped vegetables',
  'ผักโขมหรือผักกาด': 'Spinach or lettuce',
  'ผักโขมหรือผักบุ้ง': 'Spinach or morning glory',
  'ผักโขมหรือผักใบเขียว': 'Spinach or leafy greens',
  'พริกไทยเล็กน้อย': 'A little pepper',
  'พาสต้าเกลียว': 'Fusilli pasta',
  'มะนาวครึ่งลูก': 'Half a lime',
  'มายองเนส': 'Mayonnaise',
  'สาหร่ายแผ่น': 'Nori sheets',
  'สาหร่ายและต้นหอม': 'Nori & spring onion',
  'หมูหรือเนื้อสับ': 'Minced pork or beef',
  'หมูหรือไก่สไลซ์': 'Sliced pork or chicken',
  'หอมใหญ่': 'Onion',
  'หอมใหญ่และแครอทสับ': 'Onion & chopped carrot',
  'หอมใหญ่และแครอทหั่นเต๋า': 'Onion & diced carrot',
  'อกไก่ฉีก': 'Shredded chicken breast',
  'อกไก่หรือสะโพกไก่': 'Chicken breast or thigh',
  'อกไก่หั่นชิ้น': 'Sliced chicken breast',
  'อกไก่หั่นเต๋า': 'Diced chicken breast',
  'อบเชยนิดหน่อย': 'A little cinnamon',
  'ออริกาโน': 'Oregano',
  'เกลือ': 'Salt',
  'เกลือนิดเดียว': 'A pinch of salt',
  'เกล็ดขนมปัง': 'Breadcrumbs',
  'เนย': 'Butter',
  'เนยทาพิมพ์': 'Butter for the tin',
  'เนยบาง': 'A thin layer of butter',
  'เนื้อปลาดอรี่': 'Dory fillet',
  'เส้นราเมน': 'Ramen noodles',
  'เห็ดแชมปิญอง': 'Button mushrooms',
  'แครอทและถั่วลันเตา': 'Carrot & green peas',
  'แครอทและผักกาดขาว': 'Carrot & napa cabbage',
  'แป้งข้าวโพด': 'Cornstarch',
  'แป้งวาฟเฟิลหรือแป้งแพนเค้ก': 'Waffle or pancake mix',
  'แผ่นแป้งตอร์ตียาหรือขนมปังรีดบาง': 'Tortilla or flattened bread',
  'โยเกิร์ตถ้วยเล็ก': 'Small yogurt cup',
  'โยเกิร์ตรสธรรมชาติ': 'Plain yogurt',
  'ไก่หรือหมูสับ': 'Minced chicken or pork',
  'ไก่หรือแฮมหั่นเต๋า': 'Diced chicken or ham',
  'ไข่ต้มยางมะตูม': 'Soft-boiled eggs',
  'ไข่แดง': 'Egg yolk',
};

/** หาชื่ออังกฤษของบรรทัดส่วนผสม เช่น "ขนมปังโฮลวีต 1 แผ่น" -> "Bread"
 *  จับเฉพาะกรณีที่คำแรกของบรรทัดคือชื่อวัตถุดิบ (+ คำขยาย) เท่านั้น
 *  จึงไม่ตีความผิด เช่น "ซอสมะเขือเทศ" หรือ "แป้งข้าวโพด" จะไม่ถูกติดป้าย */
function englishForToken(token) {
  if (EXTRA_EN[token]) return EXTRA_EN[token];

  const t = norm(token);
  if (!t) return '';
  for (const { s, ing } of SYN_INDEX) {
    if (!t.startsWith(s)) continue;
    const rest = t.slice(s.length);
    if (!rest) return ing.en;
    if (MODIFIERS.includes(rest)) return ing.en;
    if (ing.syn.some((x) => norm(x) === rest)) return ing.en; // เช่น "เส้นก๋วยเตี๋ยว"
    return '';
  }
  return '';
}

function englishFor(line) {
  const out = [];
  for (const token of String(line).split(/[\s,]+/)) {
    const en = englishForToken(token);
    if (en && !out.includes(en)) out.push(en);
  }
  return out.slice(0, 3).join(' · ');
}

window.Ingredients = { INGREDIENTS, CATEGORIES, ING_BY_KEY, matchIngredient, englishFor };
