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
assert.strictEqual(parseEntry('100g pizza', FOODS), null);
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
console.log('OK');
