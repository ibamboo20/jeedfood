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
  { key: 'beef',       th: 'เนื้อวัว',       en: 'Beef',         cat: 'protein', art: 'beef_slice',    syn: ['เนื้อวัว', 'เนื้อบด', 'beef'] },
  { key: 'crab_stick', th: 'ปูอัด',          en: 'Crab stick',   cat: 'protein', art: 'crab_stick',    syn: ['ปูอัด', 'crab stick', 'crab'] },
  { key: 'squid',      th: 'ปลาหมึก',        en: 'Squid',        cat: 'protein', art: 'squid_ring',    syn: ['ปลาหมึก', 'หมึก', 'squid'] },
  { key: 'quail_egg',  th: 'ไข่นกกระทา',     en: 'Quail egg',    cat: 'protein', art: 'quail_egg',     syn: ['ไข่นกกระทา', 'นกกระทา', 'quail egg'] },
  { key: 'edamame',    th: 'ถั่วแระ',        en: 'Edamame',      cat: 'protein', art: 'edamame',       syn: ['ถั่วแระ', 'edamame'] },
  { key: 'mackerel',   th: 'ปลาทู',          en: 'Mackerel',     cat: 'protein', art: 'mackerel',      syn: ['ปลาทู', 'mackerel'] },
  { key: 'liver',      th: 'ตับไก่',         en: 'Chicken liver', cat: 'protein', art: 'liver',        syn: ['ตับไก่', 'ตับ', 'liver'] },
  { key: 'fish_ball',  th: 'ลูกชิ้นปลา',     en: 'Fish ball',    cat: 'protein', art: 'fish_ball',     syn: ['ลูกชิ้นปลา', 'ลูกชิ้น', 'fish ball'] },
  { key: 'redbean',    th: 'ถั่วแดง',        en: 'Red bean',     cat: 'protein', art: 'beans',         syn: ['ถั่วแดง', 'red bean'] },
  { key: 'cashew',     th: 'เม็ดมะม่วงหิมพานต์', en: 'Cashew',   cat: 'protein', art: 'cashew',        syn: ['เม็ดมะม่วงหิมพานต์', 'มะม่วงหิมพานต์', 'cashew'] },

  // หมวด: แป้ง / ธัญพืช
  { key: 'bread',      th: 'ขนมปัง',         en: 'Bread',        cat: 'carb',    art: 'toast',         syn: ['ขนมปัง', 'bread', 'toast', 'ขนมปังแผ่น'] },
  { key: 'rice',       th: 'ข้าวสวย',        en: 'Rice',         cat: 'carb',    art: 'rice_mound',    syn: ['ข้าว', 'ข้าวสวย', 'rice'] },
  { key: 'noodle',     th: 'เส้นก๋วยเตี๋ยว', en: 'Noodle',       cat: 'carb',    art: 'noodles',       syn: ['เส้น', 'ก๋วยเตี๋ยว', 'บะหมี่', 'noodle', 'udon', 'อุด้ง'] },
  { key: 'pasta',      th: 'พาสต้า',         en: 'Pasta',        cat: 'carb',    art: 'pasta_shell',   syn: ['พาสต้า', 'สปาเกตตี', 'มักกะโรนี', 'pasta', 'spaghetti'] },
  { key: 'flour',      th: 'แป้งแพนเค้ก',    en: 'Pancake mix',  cat: 'carb',    art: 'pancake',       syn: ['แป้ง', 'แพนเค้ก', 'แป้งแพนเค้ก', 'flour', 'pancake'] },
  { key: 'oat',        th: 'ข้าวโอ๊ต',       en: 'Oats',         cat: 'carb',    art: 'oat_blob',      syn: ['โอ๊ต', 'ข้าวโอ๊ต', 'oat', 'oats'] },
  { key: 'cereal',     th: 'ซีเรียล',        en: 'Cereal',       cat: 'carb',    art: 'cereal',        syn: ['ซีเรียล', 'cereal', 'คอร์นเฟลก'] },
  { key: 'cracker',    th: 'แครกเกอร์',      en: 'Cracker',      cat: 'carb',    art: 'cracker',       syn: ['แครกเกอร์', 'cracker', 'บิสกิต'] },
  { key: 'potato',     th: 'มันฝรั่ง',       en: 'Potato',       cat: 'carb',    art: 'potato_wedge',  syn: ['มันฝรั่ง', 'potato'] },
  { key: 'brown_rice', th: 'ข้าวกล้อง',      en: 'Brown rice',   cat: 'carb',    art: 'brown_rice',    syn: ['ข้าวกล้อง', 'brown rice'] },
  { key: 'sticky_rice', th: 'ข้าวเหนียว',    en: 'Sticky rice',  cat: 'carb',    art: 'rice_ball',     syn: ['ข้าวเหนียว', 'sticky rice'] },
  { key: 'vermicelli', th: 'วุ้นเส้น',       en: 'Glass noodle', cat: 'carb',    art: 'noodles',       syn: ['วุ้นเส้น', 'glass noodle'] },
  { key: 'sweet_potato', th: 'มันหวาน',      en: 'Sweet potato', cat: 'carb',    art: 'sweet_potato',  syn: ['มันหวาน', 'มันเทศ', 'sweet potato'] },
  { key: 'taro',       th: 'เผือก',          en: 'Taro',         cat: 'carb',    art: 'taro',          syn: ['เผือก', 'taro'] },
  { key: 'tortilla',   th: 'แผ่นแป้งตอร์ตียา', en: 'Tortilla',   cat: 'carb',    art: 'wrap',          syn: ['ตอร์ตียา', 'แผ่นแป้ง', 'tortilla'] },
  { key: 'quinoa',     th: 'คีนัว',          en: 'Quinoa',       cat: 'carb',    art: 'cereal',        syn: ['คีนัว', 'quinoa'] },
  { key: 'barley',     th: 'ลูกเดือย',       en: 'Barley',       cat: 'carb',    art: 'oat_blob',      syn: ['ลูกเดือย', 'barley'] },
  { key: 'soba',       th: 'โซบะ',           en: 'Soba noodle',  cat: 'carb',    art: 'noodles',       syn: ['โซบะ', 'soba'] },
  { key: 'rice_paper', th: 'แผ่นเปาะเปี๊ยะ',  en: 'Rice paper',   cat: 'carb',    art: 'rice_paper',    syn: ['แผ่นเปาะเปี๊ยะ', 'เปาะเปี๊ยะ', 'rice paper'] },

  // หมวด: นม / ชีส
  { key: 'milk',       th: 'นม',             en: 'Milk',         cat: 'dairy',   art: 'milk_glass',    syn: ['นม', 'milk', 'นมสด'] },
  { key: 'cheese',     th: 'ชีส',            en: 'Cheese',       cat: 'dairy',   art: 'cheese_cube',   syn: ['ชีส', 'cheese'] },
  { key: 'yogurt',     th: 'โยเกิร์ต',       en: 'Yogurt',       cat: 'dairy',   art: 'yogurt_cup',    syn: ['โยเกิร์ต', 'yogurt', 'yoghurt'] },
  { key: 'butter',     th: 'เนย',            en: 'Butter',       cat: 'dairy',   art: 'butter',        syn: ['เนย', 'เนยสด', 'butter'] },
  { key: 'cream_cheese', th: 'ครีมชีส',      en: 'Cream cheese', cat: 'dairy',   art: 'cream_cup',     syn: ['ครีมชีส', 'cream cheese'] },
  { key: 'mozzarella', th: 'มอสซาเรลลา',     en: 'Mozzarella',   cat: 'dairy',   art: 'cheese_cube',   syn: ['มอสซาเรลลา', 'มอสซาเรลล่า', 'mozzarella'] },
  { key: 'cheddar',    th: 'เชดดาร์',        en: 'Cheddar',      cat: 'dairy',   art: 'cheese_slice',  syn: ['เชดดาร์', 'cheddar'] },
  { key: 'parmesan',   th: 'พาร์เมซาน',      en: 'Parmesan',     cat: 'dairy',   art: 'cheese_cube',   syn: ['พาร์เมซาน', 'parmesan'] },
  { key: 'soy_milk',   th: 'นมถั่วเหลือง',   en: 'Soy milk',     cat: 'dairy',   art: 'milk_carton',   syn: ['นมถั่วเหลือง', 'soy milk'] },
  { key: 'almond_milk', th: 'นมอัลมอนด์',    en: 'Almond milk',  cat: 'dairy',   art: 'milk_carton',   syn: ['นมอัลมอนด์', 'almond milk'] },
  { key: 'greek_yogurt', th: 'กรีกโยเกิร์ต', en: 'Greek yogurt', cat: 'dairy',   art: 'yogurt_cup',    syn: ['กรีกโยเกิร์ต', 'greek yogurt'] },
  { key: 'cream',      th: 'ครีมสด',         en: 'Cream',        cat: 'dairy',   art: 'cream_cup',     syn: ['ครีมสด', 'วิปปิ้งครีม', 'cream'] },
  { key: 'evap_milk',  th: 'นมข้นจืด',       en: 'Evaporated milk', cat: 'dairy', art: 'milk_carton',  syn: ['นมข้นจืด', 'evaporated milk'] },

  // หมวด: ผัก
  { key: 'avocado',    th: 'อโวคาโด',        en: 'Avocado',      cat: 'veg',     art: 'avocado_half',  syn: ['อโวคาโด', 'อะโวคาโด', 'avocado'] },
  { key: 'tomato',     th: 'มะเขือเทศ',      en: 'Tomato',       cat: 'veg',     art: 'tomato',        syn: ['มะเขือเทศ', 'tomato'] },
  { key: 'cucumber',   th: 'แตงกวา',         en: 'Cucumber',     cat: 'veg',     art: 'cucumber',      syn: ['แตงกวา', 'cucumber'] },
  { key: 'carrot',     th: 'แครอท',          en: 'Carrot',       cat: 'veg',     art: 'carrot_stick',  syn: ['แครอท', 'carrot'] },
  { key: 'broccoli',   th: 'บรอกโคลี',       en: 'Broccoli',     cat: 'veg',     art: 'broccoli',      syn: ['บรอกโคลี', 'บล็อคโคลี่', 'broccoli'] },
  { key: 'corn',       th: 'ข้าวโพด',        en: 'Corn',         cat: 'veg',     art: 'corn',          syn: ['ข้าวโพด', 'corn'] },
  { key: 'spinach',    th: 'ผักโขม',         en: 'Spinach',      cat: 'veg',     art: 'spinach',       syn: ['ผักโขม', 'spinach', 'ผักใบเขียว'] },
  { key: 'mushroom',   th: 'เห็ด',           en: 'Mushroom',     cat: 'veg',     art: 'mushroom',      syn: ['เห็ด', 'mushroom'] },
  { key: 'pumpkin',    th: 'ฟักทอง',         en: 'Pumpkin',      cat: 'veg',     art: 'pumpkin',       syn: ['ฟักทอง', 'pumpkin'] },
  { key: 'bell_pepper', th: 'พริกหวาน',      en: 'Bell pepper',  cat: 'veg',     art: 'bell_pepper',   syn: ['พริกหวาน', 'พริกหยวก', 'bell pepper'] },
  { key: 'cabbage',    th: 'กะหล่ำปลี',      en: 'Cabbage',      cat: 'veg',     art: 'cabbage',       syn: ['กะหล่ำปลี', 'cabbage'] },
  { key: 'cauliflower', th: 'ดอกกะหล่ำ',     en: 'Cauliflower',  cat: 'veg',     art: 'cauliflower',   syn: ['ดอกกะหล่ำ', 'cauliflower'] },
  { key: 'green_bean', th: 'ถั่วฝักยาว',     en: 'Green bean',   cat: 'veg',     art: 'green_bean',    syn: ['ถั่วฝักยาว', 'ถั่วแขก', 'green bean'] },
  { key: 'pea',        th: 'ถั่วลันเตา',     en: 'Green peas',   cat: 'veg',     art: 'peas',          syn: ['ถั่วลันเตา', 'peas', 'green peas'] },
  { key: 'onion',      th: 'หอมใหญ่',        en: 'Onion',        cat: 'veg',     art: 'onion',         syn: ['หอมใหญ่', 'หัวหอม', 'onion'] },
  { key: 'zucchini',   th: 'ซูกินี',         en: 'Zucchini',     cat: 'veg',     art: 'cucumber',      syn: ['ซูกินี', 'zucchini'] },
  { key: 'lettuce',    th: 'ผักกาดหอม',      en: 'Lettuce',      cat: 'veg',     art: 'lettuce_leaf',  syn: ['ผักกาดหอม', 'ผักสลัด', 'lettuce'] },
  { key: 'bok_choy',   th: 'ผักกวางตุ้ง',    en: 'Bok choy',     cat: 'veg',     art: 'spinach',       syn: ['ผักกวางตุ้ง', 'กวางตุ้ง', 'bok choy'] },

  // หมวด: ผลไม้ & อื่น ๆ
  { key: 'banana',     th: 'กล้วย',          en: 'Banana',       cat: 'fruit',   art: 'banana',        syn: ['กล้วย', 'banana'] },
  { key: 'strawberry', th: 'สตรอว์เบอร์รี',  en: 'Strawberry',   cat: 'fruit',   art: 'strawberry',    syn: ['สตรอ', 'สตรอว์เบอร์รี', 'strawberry'] },
  { key: 'blueberry',  th: 'บลูเบอร์รี',     en: 'Blueberry',    cat: 'fruit',   art: 'blueberry',     syn: ['บลูเบอร์รี', 'blueberry', 'เบอร์รี'] },
  { key: 'apple',      th: 'แอปเปิล',        en: 'Apple',        cat: 'fruit',   art: 'apple_slice',   syn: ['แอปเปิล', 'แอปเปิ้ล', 'apple'] },
  { key: 'peanut',     th: 'เนยถั่ว',        en: 'Peanut butter', cat: 'fruit',  art: 'toast_pb',      syn: ['เนยถั่ว', 'peanut', 'peanut butter'] },
  { key: 'orange',     th: 'ส้ม',            en: 'Orange',       cat: 'fruit',   art: 'orange_fruit',  syn: ['ส้ม', 'orange'] },
  { key: 'mango',      th: 'มะม่วง',         en: 'Mango',        cat: 'fruit',   art: 'mango',         syn: ['มะม่วง', 'mango'] },
  { key: 'papaya',     th: 'มะละกอ',         en: 'Papaya',       cat: 'fruit',   art: 'papaya',        syn: ['มะละกอ', 'papaya'] },
  { key: 'watermelon', th: 'แตงโม',          en: 'Watermelon',   cat: 'fruit',   art: 'watermelon',    syn: ['แตงโม', 'watermelon'] },
  { key: 'grape',      th: 'องุ่น',          en: 'Grapes',       cat: 'fruit',   art: 'grapes',        syn: ['องุ่น', 'grape', 'grapes'] },
  { key: 'pineapple',  th: 'สับปะรด',        en: 'Pineapple',    cat: 'fruit',   art: 'pineapple',     syn: ['สับปะรด', 'pineapple'] },
  { key: 'kiwi',       th: 'กีวี',           en: 'Kiwi',         cat: 'fruit',   art: 'kiwi',          syn: ['กีวี', 'kiwi'] },
  { key: 'dragonfruit', th: 'แก้วมังกร',     en: 'Dragon fruit', cat: 'fruit',   art: 'dragonfruit',   syn: ['แก้วมังกร', 'dragon fruit'] },
  { key: 'guava',      th: 'ฝรั่ง',          en: 'Guava',        cat: 'fruit',   art: 'guava',         syn: ['ฝรั่ง', 'guava'] },
  { key: 'raisin',     th: 'ลูกเกด',         en: 'Raisin',       cat: 'fruit',   art: 'raisin',        syn: ['ลูกเกด', 'raisin'] },
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

  /* --- เครื่องปรุงและวัตถุดิบชุดที่สอง --- */
  'กระเทียม': 'Garlic',
  'กระเทียมสับ': 'Chopped garlic',
  'กระเทียมเจียว': 'Fried garlic',
  'กระเทียมเจียวและต้นหอม': 'Fried garlic & spring onion',
  'กระเทียมเจียวและผักชี': 'Fried garlic & coriander',
  'กระเทียมและซีอิ๊วขาว': 'Garlic & light soy sauce',
  'กราโนล่า': 'Granola',
  'กะทิ': 'Coconut milk',
  'กุ้งลวก': 'Boiled shrimp',
  'กุ้งหรือไก่': 'Shrimp or chicken',
  'ขนมปังหนา': 'Thick-cut bread',
  'ขิงซอย': 'Sliced ginger',
  'ขึ้นฉ่ายและต้นหอม': 'Celery & spring onion',
  'ข่า': 'Galangal',
  'ข้าวกล้องหุงสุก': 'Cooked brown rice',
  'ข้าวโอ๊ตปั่นละเอียด': 'Ground oats',
  'คะน้า': 'Chinese kale',
  'คะน้าหรือผักกวางตุ้ง': 'Chinese kale or bok choy',
  'คีนัวหุงสุก': 'Cooked quinoa',
  'ชีสก้อนเล็ก': 'Small cheese cubes',
  'ซอสผัดไทย': 'Pad thai sauce',
  'ซอสหอยนางรม': 'Oyster sauce',
  'ซอสเย็นตาโฟ': 'Yentafo sauce',
  'ซอสโชยุอ่อน': 'Mild shoyu sauce',
  'ซีอิ๊วขาวสำหรับจิ้ม': 'Light soy sauce for dipping',
  'ซีอิ๊วขาวและกระเทียม': 'Light soy sauce & garlic',
  'ซีอิ๊วขาวและน้ำตาลทราย': 'Light soy sauce & sugar',
  'ซีอิ๊วขาวและน้ำมันหอย': 'Light soy & oyster sauce',
  'ต้นหอมและกระเทียม': 'Spring onion & garlic',
  'ต้นหอมและซีอิ๊วขาว': 'Spring onion & light soy sauce',
  'ถั่วงอกและถั่วลิสงป่น': 'Bean sprouts & ground peanuts',
  'ถั่วลันเตาและแครอท': 'Green peas & carrot',
  'ถั่วแดงต้มสุก': 'Cooked red beans',
  'ถั่วแระแกะเปลือก': 'Shelled edamame',
  'น่องไก่': 'Chicken drumstick',
  'น่องไก่หรืออกไก่': 'Chicken drumstick or breast',
  'น้ำซุปกระดูกหมู': 'Pork bone broth',
  'น้ำตาลทราย': 'Sugar',
  'น้ำมะนาวและซีอิ๊วขาว': 'Lime juice & light soy sauce',
  'น้ำมันสำหรับทอด': 'Oil for frying',
  'น้ำมันหอย': 'Oyster sauce',
  'น้ำราดหมูแดง': 'Red pork sauce',
  'น้ำแข็ง': 'Ice',
  'บรอกโคลีลวกสับ': 'Blanched chopped broccoli',
  'บะหมี่ไข่': 'Egg noodles',
  'ปลาหมึกหั่นวง': 'Squid rings',
  'ผงกะหรี่': 'Curry powder',
  'ผงพะโล้': 'Five-spice powder',
  'ผักกวางตุ้งและต้นหอม': 'Bok choy & spring onion',
  'ผักกวางตุ้งและถั่วงอก': 'Bok choy & bean sprouts',
  'ผักกาดขาว': 'Napa cabbage',
  'ผักกาดขาวและต้นหอม': 'Napa cabbage & spring onion',
  'ผักกาดขาวและผักกวางตุ้ง': 'Napa cabbage & bok choy',
  'ผักกาดดองหั่นฝอย': 'Shredded pickled greens',
  'ผักบุ้งหรือผักกวางตุ้ง': 'Morning glory or bok choy',
  'พริกหวานสีแดงเหลือง': 'Red & yellow bell pepper',
  'พริกหวานสีแดงและเหลือง': 'Red & yellow bell pepper',
  'ฟักทองนึ่งบด': 'Mashed steamed pumpkin',
  'ฟักทองหั่นบาง': 'Thinly sliced pumpkin',
  'มอสซาเรลลาลูกเล็ก': 'Bocconcini mozzarella',
  'ยอดตำลึง': 'Ivy gourd leaves',
  'ลูกเดือยต้มสุก': 'Cooked barley',
  'วุ้นเส้นลวก': 'Blanched glass noodles',
  'วุ้นเส้นแช่น้ำ': 'Soaked glass noodles',
  'สับปะรดหั่นชิ้น': 'Sliced pineapple',
  'สับปะรดหั่นเต๋า': 'Diced pineapple',
  'หมูสันในหั่นชิ้น': 'Sliced pork tenderloin',
  'หมูสามชั้นต้ม': 'Boiled pork belly',
  'หมูสามชั้นหรือสันคอ': 'Pork belly or collar',
  'หมูสไลซ์': 'Sliced pork',
  'หมูแดง': 'Thai red pork',
  'องุ่นไร้เมล็ด': 'Seedless grapes',
  'เต้าหู้แข็งหั่นเต๋า': 'Diced firm tofu',
  'เต้าหู้ไข่': 'Egg tofu',
  'เนื้อปลากะพง': 'Sea bass fillet',
  'เนื้อวัวสไลซ์': 'Sliced beef',
  'เนื้อวัวหั่นชิ้น': 'Diced beef',
  'เผือกหั่นเต๋า': 'Diced taro',
  'เส้นก๋วยจั๊บ': 'Rolled rice noodles',
  'เส้นก๋วยเตี๋ยวลวก': 'Blanched rice noodles',
  'เส้นจันท์ลวก': 'Blanched thin rice noodles',
  'เส้นหมี่ลวก': 'Blanched rice vermicelli',
  'เส้นโซบะ': 'Soba noodles',
  'เห็ดนางฟ้า': 'Oyster mushrooms',
  'เห็ดหอมสด': 'Fresh shiitake',
  'เห็ดหูหนู': 'Wood ear mushrooms',
  'แครอทหั่นเต๋า': 'Diced carrot',
  'แครอทและกะหล่ำปลีซอย': 'Carrot & shredded cabbage',
  'แครอทและต้นหอมหั่นเล็ก': 'Diced carrot & spring onion',
  'แครอทและถั่วงอก': 'Carrot & bean sprouts',
  'แครอทและมันฝรั่ง': 'Carrot & potato',
  'แซลมอนย่างหรือรมควัน': 'Grilled or smoked salmon',
  'แตงกวาและมะเขือเทศ': 'Cucumber & tomato',
  'แป้งมันละลายน้ำ': 'Tapioca starch slurry',
  'แป้งอเนกประสงค์': 'All-purpose flour',
  'แผ่นเกี๊ยว': 'Wonton wrappers',
  'โยเกิร์ตสำหรับจิ้ม': 'Yogurt for dipping',
  'ใบกะหล่ำปลี': 'Cabbage leaves',
  'ใบกะเพรา': 'Thai holy basil',
  'ใบโหระพาหรือออริกาโน': 'Thai basil or oregano',
  'ไม้เสียบ': 'Skewers',
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

window.Ingredients = { INGREDIENTS, CATEGORIES, ING_BY_KEY, englishFor };
