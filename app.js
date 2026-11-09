// k = kcal/100g, p = protein g/100g, e=1: món dễ mua (dùng để gợi ý / bù khi thiếu nhóm), u = gram cho 1 đơn vị.
// shortcut: số liệu là giá trị trung bình tham khảo, muốn chính xác hơn thì sửa tay trong danh sách này.
const FOODS = [
  { n: 'Cơm trắng', k: 130, p: 2.7, c: 'carb', e: 1, u: { chen: 150 } },
  { n: 'Cơm gạo lứt', k: 111, p: 2.6, c: 'carb', e: 1, u: { chen: 150 } },
  { n: 'Bún tươi', k: 110, p: 1.7, c: 'carb', e: 1 },
  { n: 'Bánh phở', k: 140, p: 2.5, c: 'carb' },
  { n: 'Khoai lang luộc', k: 86, p: 1.6, c: 'carb', e: 1, u: { cu: 150 } },
  { n: 'Bắp (ngô) luộc', k: 96, p: 3.4, c: 'carb', e: 1, u: { qua: 150 } },
  { n: 'Yến mạch', k: 389, p: 13, c: 'carb' },
  { n: 'Bánh mì', k: 265, p: 9, c: 'carb', e: 1, u: { o: 80 } },
  { n: 'Ức gà', k: 165, p: 31, c: 'protein', e: 1 },
  { n: 'Trứng gà', k: 155, p: 13, c: 'protein', e: 1, u: { qua: 50 } },
  { n: 'Đậu phụ', k: 76, p: 8, c: 'protein', e: 1, u: { mieng: 100 } },
  { n: 'Thịt heo nạc', k: 143, p: 21, c: 'protein', e: 1 },
  { n: 'Thịt bò nạc', k: 187, p: 26, c: 'protein' },
  { n: 'Cá basa', k: 100, p: 15, c: 'protein', e: 1 },
  { n: 'Tôm', k: 99, p: 24, c: 'protein' },
  { n: 'Cá hồi', k: 208, p: 20, c: 'protein' },
  { n: 'Rau muống', k: 19, p: 3, c: 'veg', e: 1 },
  { n: 'Cải xanh', k: 15, p: 2.6, c: 'veg', e: 1 },
  { n: 'Bông cải xanh', k: 34, p: 2.8, c: 'veg' },
  { n: 'Bắp cải', k: 25, p: 1.3, c: 'veg', e: 1 },
  { n: 'Dưa leo', k: 15, p: 0.7, c: 'veg', e: 1, u: { qua: 200 } },
  { n: 'Cà chua', k: 18, p: 0.9, c: 'veg', e: 1, u: { qua: 100 } },
  { n: 'Chuối', k: 89, p: 1.1, c: 'fruit', e: 1, u: { qua: 120 } },
  { n: 'Táo', k: 52, p: 0.3, c: 'fruit', u: { qua: 180 } },
  { n: 'Cam', k: 47, p: 0.9, c: 'fruit', e: 1, u: { qua: 200 } },
  { n: 'Ổi', k: 68, p: 2.6, c: 'fruit', e: 1, u: { qua: 200 } },
  { n: 'Dưa hấu', k: 30, p: 0.6, c: 'fruit', u: { mieng: 250 } },
  { n: 'Sữa chua không đường', k: 60, p: 3.5, c: 'fruit', e: 1, u: { hop: 100 } },
  { n: 'Sữa tươi không đường', k: 42, p: 3.2, c: 'other', u: { hop: 180, ly: 240 } },
  { n: 'Hạt điều', k: 553, p: 18, c: 'other' },
  { n: 'Phở bò', k: 75, p: 5, c: 'other', u: { to: 500 } },
  { n: 'Bún bò', k: 80, p: 5, c: 'other', u: { to: 550 } },
  { n: 'Cơm tấm sườn', k: 200, p: 10, c: 'other', u: { dia: 400 } },
  { n: 'Bánh mì thịt', k: 250, p: 10, c: 'other', u: { o: 200 } },
  { n: 'Trà sữa', k: 70, p: 0.5, c: 'other', u: { ly: 500 } },
];
const CATS = { carb: 'Tinh bột', protein: 'Đạm', veg: 'Rau', fruit: 'Trái cây / bữa phụ', other: 'Món khác (chỉ để ghi nhật ký)' };
const MEALS = [['Sáng', 0.25, ['protein', 'carb']], ['Trưa', 0.35, ['veg', 'protein', 'carb']], ['Phụ', 0.1, ['fruit']], ['Tối', 0.3, ['veg', 'protein', 'carb']]];
const UNIT_NAMES = { chen: 'chén', to: 'tô', qua: 'quả', o: 'ổ', ly: 'ly', hop: 'hộp', mieng: 'miếng', dia: 'đĩa', cu: 'củ' };
const UNIT_ALIAS = { bat: 'chen', trai: 'qua', coc: 'ly' };
const GRAM = ['g', 'gr', 'gram'];
const UNIT_WORDS = [...GRAM, ...Object.keys(UNIT_NAMES), ...Object.keys(UNIT_ALIAS)];
const EXERCISES = [['Đi bộ', 3.5], ['Đi bộ nhanh', 4.3], ['Chạy bộ', 8], ['Đạp xe', 6], ['Bơi', 6], ['Tập gym', 5], ['Nhảy dây', 11], ['Yoga', 2.5], ['Đá bóng', 7], ['Cầu lông', 5.5]]; // [tên, MET]

const addDays = (d, n) => new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10);
const diffDays = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);

function tdee({ sex, weight, height, age, activity }) {
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'm' ? 5 : -161); // Mifflin-St Jeor
  return Math.round(bmr * activity);
}

// Mục tiêu tính lại theo cân nặng mới nhất và số ngày còn lại tới hạn.
function plan(p, weights, today) {
  const dates = Object.keys(weights).sort();
  const cur = dates.length ? weights[dates[dates.length - 1]] : p.weight;
  const goal = Math.round((p.weight - p.loseKg) * 10) / 10;
  const end = addDays(p.start || today, p.days);
  const daysLeft = Math.max(1, diffDays(today, end));
  const kgLeft = Math.max(0, Math.round((cur - goal) * 10) / 10);
  const t = tdee({ ...p, weight: cur });
  const deficit = Math.round((kgLeft * 7700) / daysLeft); // ~7700 kcal ≈ 1kg mỡ
  const min = p.sex === 'm' ? 1500 : 1200;
  return { tdee: t, deficit, target: Math.max(t - deficit, min), min, tooFast: t - deficit < min, cur, goal, end, daysLeft, kgLeft, protein: Math.round(cur * 1.6) };
}

const burn = (met, kg, min) => Math.round((met * kg * min) / 60);
const grams = (kcal, per100) => Math.max(10, Math.round((kcal / per100) * 10) * 10);
const item = (f, g, label) => ({ n: f.n, g, k: Math.round((f.k * g) / 100), p: Math.round(((f.p || 0) * g) / 10) / 10, ...(label && { label }) });

function pick(foods, cat, i) {
  const own = foods.filter((f) => f.c === cat);
  const src = own.length ? own : FOODS.filter((f) => f.c === cat && f.e);
  return src[i % src.length];
}

function buildMenu(target, foods) {
  return Array.from({ length: 7 }, (_, d) =>
    MEALS.map(([name, share, cats], m) => {
      let left = target * share;
      const items = cats.map((cat, j) => {
        const f = pick(foods, cat, d * 3 + m + j);
        const isLast = j === cats.length - 1;
        const it = item(f, cat === 'veg' ? 150 : grams(isLast ? left : left * 0.5, f.k));
        left -= it.k;
        return it;
      });
      return { name, items, kcal: items.reduce((s, x) => s + x.k, 0), p: items.reduce((s, x) => s + x.p, 0) };
    })
  );
}

function shoppingList(menu) {
  const tot = {};
  for (const day of menu) for (const m of day) for (const x of m.items) tot[x.n] = (tot[x.n] || 0) + x.g;
  return Object.entries(tot).sort((a, b) => b[1] - a[1]);
}

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').trim();

function findFood(q, foods) {
  if (!q) return null;
  const by = (fn) => foods.find((f) => fn(norm(f.n)));
  return by((n) => n === q) || by((n) => n.startsWith(q)) || by((n) => n.includes(q)) ||
    foods.filter((f) => q.includes(norm(f.n))).sort((a, b) => b.n.length - a.n.length)[0] || null;
}

// "100g cơm", "2 chén cơm", "trứng 2 quả", "1 tô phở" -> { food, g, label } | { food, err } | null
function parseEntry(text, foods) {
  const w = norm(text).replace(/(\d),(\d)/g, '$1.$2').replace(/(\d)([a-z])/g, '$1 $2').split(/\s+/).filter(Boolean);
  const i = w.findIndex((x) => /^\d+(\.\d+)?$/.test(x));
  if (i < 0) return null;
  const qty = parseFloat(w.splice(i, 1)[0]);
  let unit = UNIT_WORDS.includes(w[i]) ? w.splice(i, 1)[0] : null;
  const food = findFood(w.join(' '), foods);
  if (!food || !(qty > 0)) return null;
  if (!unit && qty < 10 && food.u) unit = Object.keys(food.u)[0]; // "2 trứng" = 2 quả, không phải 2g
  if (!unit || GRAM.includes(unit)) return { food, g: Math.round(qty) };
  const key = UNIT_ALIAS[unit] || unit;
  const per = food.u && food.u[key];
  if (!per) return { food, err: `"${food.n}" chưa có đơn vị "${UNIT_NAMES[key]}", hãy nhập theo gram (vd: 200g ${food.n.toLowerCase()}).` };
  return { food, g: Math.round(qty * per), label: `${qty} ${UNIT_NAMES[key]}` };
}

if (typeof module !== 'undefined') module.exports = { tdee, plan, buildMenu, shoppingList, parseEntry, burn, addDays, FOODS };

// ---------------- UI ----------------
if (typeof document !== 'undefined') {
  const KEY = 'calo-app-v1';
  const DEFAULTS = () => ({ profile: null, selected: [], custom: [], log: {}, weights: {}, exercise: {} });
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  let state = Object.assign(DEFAULTS(), load());
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { alert('Không lưu được dữ liệu vào trình duyệt.'); } };
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const today = () => new Date().toLocaleDateString('sv');
  const fmt = (d) => `${d.slice(8)}/${d.slice(5, 7)}`;
  const allFoods = () => FOODS.concat(state.custom);
  const myFoods = () => allFoods().filter((f) => state.selected.includes(f.n));
  const P = () => (state.profile ? plan(state.profile, state.weights, today()) : null);
  const sum = (list, f) => Math.round((list || []).reduce((s, x) => s + (x[f] || 0), 0) * 10) / 10;
  let view = today();

  // dữ liệu bản cũ chưa có ngày bắt đầu kế hoạch
  if (state.profile && !state.profile.start) {
    state.profile.start = today();
    if (!Object.keys(state.weights).length) state.weights[today()] = state.profile.weight;
    save();
  }

  function renderProfile() {
    const p = state.profile;
    if (p) for (const k of ['sex', 'weight', 'height', 'age', 'activity', 'loseKg', 'days']) $(k).value = p[k];
    const r = P();
    if (!r) { $('goalOut').innerHTML = '<p class="muted">Nhập thông tin để tính lượng calo mỗi ngày.</p>'; return; }
    const need = r.tdee > r.min ? Math.ceil((r.kgLeft * 7700) / (r.tdee - r.min)) : null;
    $('goalOut').innerHTML = `
      <div class="stats">
        <div><b>${r.tdee}</b><span>kcal tiêu hao/ngày</span></div>
        <div><b>-${r.deficit}</b><span>kcal cần thâm hụt</span></div>
        <div class="hl"><b>${r.target}</b><span>kcal nên ăn/ngày</span></div>
        <div><b>${r.protein}g</b><span>protein nên ăn/ngày</span></div>
      </div>
      <p class="muted">Hiện tại ${r.cur}kg → mục tiêu ${r.goal}kg · còn ${r.kgLeft}kg trong ${r.daysLeft} ngày (hạn ${fmt(r.end)}/${r.end.slice(0, 4)}). Calo tự tính lại khi bạn cập nhật cân nặng.</p>
      ${r.kgLeft === 0 ? '<p class="ok">🎉 Đã đạt cân nặng mục tiêu! Giờ chỉ cần ăn khoảng mức tiêu hao để giữ cân.</p>' : ''}
      ${r.tooFast && r.kgLeft > 0 ? `<p class="warn">⚠️ Giảm ${r.kgLeft}kg trong ${r.daysLeft} ngày là quá nhanh. Đã giữ mức tối thiểu an toàn ${r.target} kcal${need ? ` — thực tế cần khoảng ${need} ngày` : ''}.</p>` : ''}`;
  }

  function chart(p) {
    const pts = Object.entries(state.weights).sort();
    const start = p.start, end = addDays(start, p.days), goal = p.weight - p.loseKg;
    const dates = [start, end, ...pts.map((x) => x[0])].sort();
    const d0 = dates[0], d1 = dates[dates.length - 1];
    const ws = [p.weight, goal, ...pts.map((x) => x[1])];
    const lo = Math.floor(Math.min(...ws) - 1), hi = Math.ceil(Math.max(...ws) + 1);
    const W = 600, H = 220, L = 36, R = 12, T = 10, B = 24;
    const X = (d) => (L + ((W - L - R) * diffDays(d0, d)) / Math.max(1, diffDays(d0, d1))).toFixed(1);
    const Y = (w) => (T + ((H - T - B) * (hi - w)) / (hi - lo)).toFixed(1);
    const grid = [hi, (hi + lo) / 2, lo].map((v) => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="grid"/><text x="${L - 6}" y="${+Y(v) + 4}" text-anchor="end">${v}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Biểu đồ cân nặng thực tế so với kế hoạch">
      ${grid}
      <line x1="${X(start)}" y1="${Y(p.weight)}" x2="${X(end)}" y2="${Y(goal)}" class="plan"/>
      <polyline points="${pts.map(([d, w]) => `${X(d)},${Y(w)}`).join(' ')}" class="real"/>
      ${pts.map(([d, w]) => `<circle cx="${X(d)}" cy="${Y(w)}" r="4" class="dot"><title>${fmt(d)}: ${w}kg</title></circle>`).join('')}
      <text x="${L}" y="${H - 6}">${fmt(d0)}</text><text x="${W - R}" y="${H - 6}" text-anchor="end">${fmt(d1)}</text>
    </svg>
    <p class="legend"><span class="sw real"></span> thực tế <span class="sw plan"></span> kế hoạch</p>`;
  }

  function renderWeight() {
    const r = P();
    if (!r) { $('weightOut').innerHTML = '<p class="muted">Nhập mục tiêu ở trên trước nhé.</p>'; return; }
    $('wInput').value = state.weights[today()] || r.cur;
    const pts = Object.entries(state.weights).sort().reverse();
    $('weightOut').innerHTML = `
      <p>Đã giảm <b>${Math.round((state.profile.weight - r.cur) * 10) / 10}kg</b>, còn <b>${r.kgLeft}kg</b>.</p>
      ${chart(state.profile)}
      <ul class="compact">${pts.slice(0, 7).map(([d, w]) => `<li><span>${fmt(d)}</span><span>${w}kg <button class="x" data-wd="${d}" aria-label="Xoá lần cân ${fmt(d)}">✕</button></span></li>`).join('')}</ul>`;
  }

  function renderLog() {
    $('logDate').value = view;
    $('logDate').max = today();
    $('dayLabel').textContent = view === today() ? 'hôm nay' : `ngày ${fmt(view)}`;
    const list = state.log[view] || [];
    const ex = state.exercise[view] || [];
    const eaten = sum(list, 'k'), burned = sum(ex, 'k'), prot = sum(list, 'p');
    const r = P();
    if (!r) { $('logSummary').innerHTML = '<p class="muted">Nhập mục tiêu ở trên trước nhé.</p>'; }
    else {
      const left = Math.round(r.target - eaten + burned);
      $('logSummary').innerHTML = `
        <div class="stats">
          <div><b>${eaten}</b><span>kcal đã ăn</span></div>
          <div><b>+${burned}</b><span>kcal đốt khi tập</span></div>
          <div class="${left < 0 ? 'bad' : 'hl'}"><b>${left}</b><span>${left < 0 ? 'kcal vượt mức' : 'kcal còn được ăn'}</span></div>
          <div class="${prot >= r.protein ? 'hl' : ''}"><b>${prot}/${r.protein}g</b><span>protein</span></div>
        </div>
        <div class="bar"><i style="width:${Math.min(100, (eaten / (r.target + burned)) * 100)}%" class="${left < 0 ? 'over' : ''}"></i></div>`;
    }
    const groups = [...MEALS.map((m) => m[0]), 'Khác'];
    $('logList').innerHTML = groups.map((g) => {
      const rows = list.map((x, i) => [x, i]).filter(([x]) => (x.meal || 'Khác') === g);
      return rows.length ? `<li class="meal"><b>${g}</b><span>${rows.reduce((s, [x]) => s + x.k, 0)} kcal</span></li>` +
        rows.map(([x, i]) => `<li><span>${esc(x.n)} — ${x.label ? `${esc(x.label)} (${x.g}g)` : `${x.g}g`}</span><span>${x.k} kcal <button class="x" data-i="${i}" aria-label="Xoá">✕</button></span></li>`).join('') : '';
    }).join('') || '<li class="muted">Chưa ghi món nào.</li>';
    $('exList').innerHTML = ex.map((x, i) => `<li><span>${esc(x.n)} — ${x.min} phút</span><span>+${x.k} kcal <button class="x" data-ei="${i}" aria-label="Xoá">✕</button></span></li>`).join('');
  }

  function renderHistory() {
    const r = P();
    const days = [...new Set([...Object.keys(state.log), ...Object.keys(state.exercise)])]
      .filter((d) => (state.log[d] || []).length || (state.exercise[d] || []).length).sort().reverse().slice(0, 14);
    if (!days.length) { $('history').innerHTML = '<p class="muted">Chưa có dữ liệu.</p>'; return; }
    // shortcut: so với mục tiêu hiện tại, không lưu mục tiêu của từng ngày; cần chính xác thì lưu target vào log mỗi ngày.
    $('history').innerHTML = `<table><thead><tr><th>Ngày</th><th>Ăn</th><th>Tập</th><th>Còn lại</th><th></th></tr></thead><tbody>${days.map((d) => {
      const eaten = sum(state.log[d], 'k'), burned = sum(state.exercise[d], 'k');
      const left = r ? Math.round(r.target - eaten + burned) : null;
      return `<tr><td>${fmt(d)}</td><td>${eaten}</td><td>+${burned}</td><td class="${left < 0 ? 'warn' : 'ok'}">${left ?? '—'}</td><td><button data-d="${d}">Xem</button></td></tr>`;
    }).join('')}</tbody></table>`;
  }

  function renderFoods() {
    const sel = new Set(state.selected);
    $('foodGrid').innerHTML = Object.entries(CATS).filter(([c]) => c !== 'other').map(([c, label]) => `
      <fieldset><legend>${label}</legend>
        ${allFoods().filter((f) => f.c === c).map((f) => `<label class="chip"><input type="checkbox" value="${esc(f.n)}" ${sel.has(f.n) ? 'checked' : ''}> ${esc(f.n)} <small>${f.k}</small></label>`).join('')}
      </fieldset>`).join('');
    $('foodNames').innerHTML = allFoods().map((f) => `<option value="${esc(f.n)}">`).join('');
  }

  function renderMenu() {
    const r = P();
    if (!r) { $('menu').innerHTML = '<p class="muted">Nhập mục tiêu ở trên để tạo thực đơn.</p>'; $('suggest').innerHTML = $('shopping').innerHTML = ''; return; }
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    const menu = buildMenu(r.target, myFoods());
    $('menu').innerHTML = menu.map((meals, d) => `
      <div class="day"><h3>${days[d]} <small>${meals.reduce((s, m) => s + m.kcal, 0)} kcal · ${Math.round(meals.reduce((s, m) => s + m.p, 0))}g protein</small></h3>
        ${meals.map((m) => `<p><b>${m.name}:</b> ${m.items.map((x) => `${esc(x.n)} ${x.g}g`).join(', ')} <small>(${m.kcal})</small></p>`).join('')}
      </div>`).join('');
    $('shopping').innerHTML = '<h3>🛒 Danh sách đi chợ cho cả tuần</h3><ul class="compact cols">' +
      shoppingList(menu).map(([n, g]) => `<li><span>${esc(n)}</span><b>${g >= 1000 ? `${Math.round(g / 100) / 10} kg` : `${g} g`}</b></li>`).join('') + '</ul>';
    const sel = new Set(state.selected);
    const sug = FOODS.filter((f) => f.e && !sel.has(f.n));
    const off = new Date().getDate() % Math.max(1, sug.length);
    $('suggest').innerHTML = sug.length
      ? '<h3>Gợi ý thêm vài món dễ mua</h3>' + sug.concat(sug).slice(off, off + 5).map((f) => `<button class="chip add" data-n="${esc(f.n)}">+ ${esc(f.n)} <small>${f.k} kcal/100g</small></button>`).join('')
      : '';
  }

  const renderAll = () => { renderProfile(); renderWeight(); renderLog(); renderHistory(); renderFoods(); renderMenu(); };
  const refresh = () => { save(); renderAll(); };

  $('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = (k) => parseFloat($(k).value);
    state.profile = { sex: $('sex').value, weight: v('weight'), height: v('height'), age: v('age'), activity: v('activity'), loseKg: v('loseKg'), days: v('days'), start: today() };
    state.weights[today()] = state.profile.weight;
    refresh();
  });

  $('weightForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const w = parseFloat($('wInput').value);
    if (!(w > 20 && w < 400)) return;
    state.weights[today()] = w;
    refresh();
  });
  $('weightOut').addEventListener('click', (e) => {
    const d = e.target.dataset.wd;
    if (!d || Object.keys(state.weights).length < 2) return; // giữ ít nhất 1 lần cân
    delete state.weights[d];
    refresh();
  });

  const h = new Date().getHours();
  $('meal').value = h < 10 ? 'Sáng' : h < 14 ? 'Trưa' : h < 17 ? 'Phụ' : 'Tối';
  $('logDate').addEventListener('change', (e) => { if (e.target.value) { view = e.target.value; renderLog(); } });

  $('logForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const r = parseEntry($('entry').value, allFoods());
    if (!r || r.err) { $('entryErr').textContent = r ? r.err : 'Không hiểu. Ví dụ: "100g cơm", "2 chén cơm", "1 tô phở". Món chưa có thì thêm ở mục "Món của tôi".'; return; }
    $('entryErr').textContent = '';
    (state.log[view] ||= []).push({ ...item(r.food, r.g, r.label), meal: $('meal').value });
    $('entry').value = '';
    refresh();
  });

  $('copyMeal').addEventListener('click', () => {
    const meal = $('meal').value, prev = addDays(view, -1);
    const rows = (state.log[prev] || []).filter((x) => x.meal === meal);
    if (!rows.length) { $('entryErr').textContent = `Ngày ${fmt(prev)} không có bữa ${meal} để chép.`; return; }
    $('entryErr').textContent = '';
    (state.log[view] ||= []).push(...rows.map((x) => ({ ...x })));
    refresh();
  });

  $('logList').addEventListener('click', (e) => {
    if (!e.target.dataset.i) return;
    state.log[view].splice(+e.target.dataset.i, 1);
    refresh();
  });

  $('exType').innerHTML = EXERCISES.map(([n], i) => `<option value="${i}">${n}</option>`).join('');
  $('exForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const r = P();
    const min = parseFloat($('exMin').value);
    if (!r || !(min > 0)) return;
    const [n, met] = EXERCISES[$('exType').value];
    (state.exercise[view] ||= []).push({ n, min, k: burn(met, r.cur, min) });
    $('exMin').value = '';
    refresh();
  });
  $('exList').addEventListener('click', (e) => {
    if (!e.target.dataset.ei) return;
    state.exercise[view].splice(+e.target.dataset.ei, 1);
    refresh();
  });

  $('history').addEventListener('click', (e) => {
    if (!e.target.dataset.d) return;
    view = e.target.dataset.d;
    renderLog();
    $('logSection').scrollIntoView({ behavior: 'smooth' });
  });

  $('foodGrid').addEventListener('change', (e) => {
    const n = e.target.value;
    state.selected = e.target.checked ? [...state.selected, n] : state.selected.filter((x) => x !== n);
    save(); renderMenu();
  });

  $('suggest').addEventListener('click', (e) => {
    const b = e.target.closest('[data-n]');
    if (!b) return;
    state.selected.push(b.dataset.n);
    save(); renderFoods(); renderMenu();
  });

  $('customForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const n = $('cName').value.trim();
    const k = parseFloat($('cKcal').value);
    const p = parseFloat($('cProt').value) || 0;
    if (!n || !(k >= 0)) return;
    if (allFoods().some((f) => norm(f.n) === norm(n))) { alert('Món này đã có rồi.'); return; }
    state.custom.push({ n, k, p, c: $('cCat').value });
    if ($('cCat').value !== 'other') state.selected.push(n);
    e.target.reset();
    save(); renderFoods(); renderMenu();
  });

  $('regen').addEventListener('click', () => {
    state.selected.sort(() => Math.random() - 0.5); // xáo thứ tự để ra thực đơn khác
    save(); renderMenu();
  });

  $('exportBtn').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 1)], { type: 'application/json' }));
    a.download = `calo-backup-${today()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $('importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const d = JSON.parse(await file.text());
      const okObj = (x) => x === undefined || (x && typeof x === 'object' && !Array.isArray(x));
      if (!d || typeof d !== 'object' || !okObj(d.log) || !okObj(d.weights) || !okObj(d.exercise) ||
        (d.selected !== undefined && !Array.isArray(d.selected)) || (d.custom !== undefined && !Array.isArray(d.custom))) throw new Error();
      if (!confirm('Dữ liệu hiện tại sẽ bị thay bằng file sao lưu. Tiếp tục?')) return;
      state = Object.assign(DEFAULTS(), d);
      refresh();
      alert('Đã khôi phục dữ liệu.');
    } catch {
      alert('File không hợp lệ, không phải file sao lưu của trang này.');
    }
  });

  renderAll();
}
