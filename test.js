// Chạy: node test.js
const assert = require('assert');
const { tdee, dailyTarget, buildMenu, parseEntry, FOODS } = require('./app.js');

const p = { sex: 'm', weight: 80, height: 170, age: 30, activity: 1.2, loseKg: 5, days: 70 };
assert.strictEqual(tdee(p), Math.round((800 + 1062.5 - 150 + 5) * 1.2));
const r = dailyTarget(p);
assert.strictEqual(r.deficit, 550);
assert.strictEqual(r.target, r.tdee - 550);
assert.ok(dailyTarget({ ...p, days: 5 }).tooFast);
assert.strictEqual(dailyTarget({ ...p, days: 5 }).target, 1500);

const e = parseEntry('100g cơm', FOODS);
assert.strictEqual(e.food.n, 'Cơm trắng'); assert.strictEqual(e.g, 100);
assert.strictEqual(parseEntry('ức gà 150', FOODS).food.n, 'Ức gà');
assert.strictEqual(parseEntry('200 g khoai lang', FOODS).g, 200);
assert.strictEqual(parseEntry('com trang 50', FOODS).food.n, 'Cơm trắng');
assert.strictEqual(parseEntry('100g pizza', FOODS), null);

const menu = buildMenu(1800, FOODS.filter((f) => ['Cơm trắng', 'Ức gà'].includes(f.n)));
assert.strictEqual(menu.length, 7);
for (const day of menu) {
  const total = day.reduce((s, m) => s + m.kcal, 0);
  assert.ok(Math.abs(total - 1800) < 120, `ngày lệch quá nhiều: ${total}`);
}
console.log('OK');
