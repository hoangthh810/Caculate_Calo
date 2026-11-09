// Chạy: node test.js
const assert = require('assert');
const { tdee, plan, buildMenu, shoppingList, parseEntry, burn, addDays, FOODS } = require('./app.js');

// mục tiêu calo
const p = { sex: 'm', weight: 80, height: 170, age: 30, activity: 1.2, loseKg: 5, days: 70, start: '2026-01-01' };
assert.strictEqual(tdee(p), Math.round((800 + 1062.5 - 150 + 5) * 1.2));
let r = plan(p, { '2026-01-01': 80 }, '2026-01-01');
assert.strictEqual(r.deficit, 550);
assert.strictEqual(r.target, r.tdee - 550);
assert.strictEqual(r.protein, 128);
assert.ok(plan({ ...p, days: 5 }, {}, '2026-01-01').tooFast);
assert.strictEqual(plan({ ...p, days: 5 }, {}, '2026-01-01').target, 1500);
// cân nặng mới -> tính lại theo cân mới và số ngày còn lại
r = plan(p, { '2026-01-01': 80, '2026-01-20': 78.5, '2026-02-05': 77 }, '2026-02-05');
assert.strictEqual(r.cur, 77); assert.strictEqual(r.kgLeft, 2); assert.strictEqual(r.daysLeft, 35);
assert.strictEqual(r.deficit, Math.round((2 * 7700) / 35));
assert.strictEqual(plan(p, { '2026-02-01': 74 }, '2026-02-01').deficit, 0); // đã đạt mục tiêu
assert.strictEqual(addDays('2026-01-01', 70), '2026-03-12');

// nhập món
const e = parseEntry('100g cơm', FOODS);
assert.strictEqual(e.food.n, 'Cơm trắng'); assert.strictEqual(e.g, 100);
assert.strictEqual(parseEntry('ức gà 150', FOODS).food.n, 'Ức gà');
assert.strictEqual(parseEntry('200 g khoai lang', FOODS).g, 200);
assert.strictEqual(parseEntry('com trang 50', FOODS).food.n, 'Cơm trắng');
assert.strictEqual(parseEntry('100g abcxyz', FOODS), null);
assert.strictEqual(parseEntry('200 cải xanh', FOODS).food.n, 'Cải xanh'); // "cải" không bị hiểu là đơn vị "cái"
assert.strictEqual(parseEntry('200 cải xanh', FOODS).g, 200);
assert.strictEqual(parseEntry('2 gỏi cuốn', FOODS).g, 200);
assert.strictEqual(parseEntry('1 lon bia', FOODS).g, 330);
assert.strictEqual(parseEntry('2 cái bánh bao', FOODS).g, 300);
assert.strictEqual(parseEntry('1 tô bún riêu', FOODS).food.n, 'Bún riêu');
assert.strictEqual(parseEntry('1 ly trà', FOODS).food.n, 'Trà đá');
assert.strictEqual(parseEntry('1 hộp sữa', FOODS).food.n, 'Sữa tươi không đường');
assert.strictEqual(parseEntry('1 đĩa bò né', FOODS), null); // không khớp nhầm "Bơ" -> để AI xử lý
assert.strictEqual(parseEntry('2 chén cơm', FOODS).g, 300);
assert.strictEqual(parseEntry('1 bát cơm', FOODS).g, 150);
assert.strictEqual(parseEntry('trứng 2 quả', FOODS).g, 100);
assert.strictEqual(parseEntry('2 trứng', FOODS).g, 100);
const pho = parseEntry('1 tô phở', FOODS);
assert.strictEqual(pho.food.n, 'Phở bò'); assert.strictEqual(pho.g, 500); assert.strictEqual(pho.label, '1 tô');
assert.strictEqual(parseEntry('1 ổ bánh mì thịt', FOODS).g, 200);
assert.strictEqual(parseEntry('1,5 chén cơm', FOODS).g, 225);
assert.ok(parseEntry('1 tô ức gà', FOODS).err);

// thực đơn + đi chợ + tập
const menu = buildMenu(1800, FOODS.filter((f) => ['Cơm trắng', 'Ức gà'].includes(f.n)));
assert.strictEqual(menu.length, 7);
for (const day of menu) {
  const total = day.reduce((s, m) => s + m.kcal, 0);
  assert.ok(Math.abs(total - 1800) < 120, `ngày lệch quá nhiều: ${total}`);
}
const shop = shoppingList(menu);
const totalG = menu.flat().flatMap((m) => m.items).reduce((s, x) => s + x.g, 0);
assert.strictEqual(shop.reduce((s, [, g]) => s + g, 0), totalG);
assert.strictEqual(burn(8, 75, 30), 300);

// danh sách món: không trùng tên, số liệu hợp lý, đơn vị hợp lệ
const { aiToFood } = require('./app.js');
const names = FOODS.map((f) => f.n.toLowerCase());
assert.strictEqual(new Set(names).size, names.length, 'trùng tên món');
const UNITS = ['chen', 'to', 'qua', 'o', 'ly', 'hop', 'mieng', 'dia', 'cu', 'cai', 'goi', 'lon', 'chai', 'cuon', 'phan', 'lat', 'muong', 'thanh', 'mui'];
for (const f of FOODS) {
  assert.ok(f.k >= 0 && f.k <= 900 && f.p >= 0 && f.p < 100, f.n);
  assert.ok(['carb', 'protein', 'veg', 'fruit', 'other'].includes(f.c), f.n);
  for (const u of Object.keys(f.u || {})) assert.ok(UNITS.includes(u), `${f.n}: đơn vị ${u}`);
}

// AI: chỉ nhận số liệu hợp lý
const okAI = { is_food: true, name: 'Bò né', kcal_per_100g: 210, protein_per_100g: 15, category: 'other', grams_eaten: 350, unit: 'dia', unit_grams: 350 };
const a = aiToFood(okAI);
assert.deepStrictEqual(a.food, { n: 'Bò né', k: 210, p: 15, c: 'other', ai: 1, u: { dia: 350 } });
assert.strictEqual(a.g, 350); assert.strictEqual(a.label, '1 đĩa');
assert.strictEqual(aiToFood({ ...okAI, unit: 'g', unit_grams: 100 }).food.u, undefined);
assert.ok(aiToFood({ ...okAI, is_food: false }).err);
assert.ok(aiToFood({ ...okAI, kcal_per_100g: 5000 }).err);
assert.ok(aiToFood({ ...okAI, grams_eaten: -1 }).err);
assert.ok(aiToFood({ ...okAI, category: 'hack' }).err);
assert.ok(aiToFood(null).err);
console.log('OK');
