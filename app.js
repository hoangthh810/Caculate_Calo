// Calo trên 100g. e=1: món dễ mua, dùng để gợi ý / bù khi thiếu nhóm.
// shortcut: số liệu calo là giá trị trung bình tham khảo, muốn chính xác hơn thì sửa tay trong danh sách này.
const FOODS = [
  { n: 'Cơm trắng', k: 130, c: 'carb', e: 1 },
  { n: 'Cơm gạo lứt', k: 111, c: 'carb', e: 1 },
  { n: 'Bún tươi', k: 110, c: 'carb', e: 1 },
  { n: 'Bánh phở', k: 140, c: 'carb' },
  { n: 'Khoai lang luộc', k: 86, c: 'carb', e: 1 },
  { n: 'Bắp (ngô) luộc', k: 96, c: 'carb', e: 1 },
  { n: 'Yến mạch', k: 389, c: 'carb' },
  { n: 'Bánh mì', k: 265, c: 'carb', e: 1 },
  { n: 'Ức gà', k: 165, c: 'protein', e: 1 },
  { n: 'Trứng gà', k: 155, c: 'protein', e: 1 },
  { n: 'Đậu phụ', k: 76, c: 'protein', e: 1 },
  { n: 'Thịt heo nạc', k: 143, c: 'protein', e: 1 },
  { n: 'Thịt bò nạc', k: 187, c: 'protein' },
  { n: 'Cá basa', k: 100, c: 'protein', e: 1 },
  { n: 'Tôm', k: 99, c: 'protein' },
  { n: 'Cá hồi', k: 208, c: 'protein' },
  { n: 'Rau muống', k: 19, c: 'veg', e: 1 },
  { n: 'Cải xanh', k: 15, c: 'veg', e: 1 },
  { n: 'Bông cải xanh', k: 34, c: 'veg' },
  { n: 'Bắp cải', k: 25, c: 'veg', e: 1 },
  { n: 'Dưa leo', k: 15, c: 'veg', e: 1 },
  { n: 'Cà chua', k: 18, c: 'veg', e: 1 },
  { n: 'Chuối', k: 89, c: 'fruit', e: 1 },
  { n: 'Táo', k: 52, c: 'fruit' },
  { n: 'Cam', k: 47, c: 'fruit', e: 1 },
  { n: 'Ổi', k: 68, c: 'fruit', e: 1 },
  { n: 'Dưa hấu', k: 30, c: 'fruit' },
  { n: 'Sữa chua không đường', k: 60, c: 'fruit', e: 1 },
  { n: 'Sữa tươi không đường', k: 42, c: 'other' },
  { n: 'Hạt điều', k: 553, c: 'other' },
  { n: 'Phở bò', k: 75, c: 'other' },
  { n: 'Bún bò', k: 80, c: 'other' },
  { n: 'Cơm tấm sườn', k: 200, c: 'other' },
  { n: 'Bánh mì thịt', k: 250, c: 'other' },
  { n: 'Trà sữa', k: 70, c: 'other' },
];
const CATS = { carb: 'Tinh bột', protein: 'Đạm', veg: 'Rau', fruit: 'Trái cây / bữa phụ', other: 'Món khác (chỉ để ghi nhật ký)' };
const MEALS = [['Sáng', 0.25, ['protein', 'carb']], ['Trưa', 0.35, ['veg', 'protein', 'carb']], ['Phụ', 0.1, ['fruit']], ['Tối', 0.3, ['veg', 'protein', 'carb']]];

function tdee({ sex, weight, height, age, activity }) {
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'm' ? 5 : -161); // Mifflin-St Jeor
  return Math.round(bmr * activity);
}

function dailyTarget(p) {
  const t = tdee(p);
  const deficit = Math.round((p.loseKg * 7700) / p.days); // ~7700 kcal ≈ 1kg mỡ
  const min = p.sex === 'm' ? 1500 : 1200;
  return { tdee: t, deficit, target: Math.max(t - deficit, min), tooFast: t - deficit < min };
}

const grams = (kcal, per100) => Math.max(10, Math.round((kcal / per100) * 10) * 10);
const item = (f, g) => ({ n: f.n, g, k: Math.round((f.k * g) / 100) });

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
        const g = cat === 'veg' ? 150 : grams(isLast ? left : left * 0.5, f.k);
        const it = item(f, g);
        left -= it.k;
        return it;
      });
      return { name, items, kcal: items.reduce((s, x) => s + x.k, 0) };
    })
  );
}

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').trim();

// "100g cơm", "cơm 100g", "100 cơm" -> { food, g }
function parseEntry(text, foods) {
  const m = text.match(/^\s*(\d+(?:[.,]\d+)?)\s*g?\s+(.+)$/i) || text.match(/^\s*(.+?)\s+(\d+(?:[.,]\d+)?)\s*g?\s*$/i);
  if (!m) return null;
  const [num, name] = /^\d/.test(m[1].trim()) ? [m[1], m[2]] : [m[2], m[1]];
  const q = norm(name);
  const food = foods.find((f) => norm(f.n) === q) || foods.find((f) => norm(f.n).includes(q)) || foods.find((f) => q.includes(norm(f.n)));
  const g = parseFloat(num.replace(',', '.'));
  return food && g > 0 ? { food, g } : null;
}

if (typeof module !== 'undefined') module.exports = { tdee, dailyTarget, buildMenu, parseEntry, FOODS };

// ---------------- UI ----------------
if (typeof document !== 'undefined') {
  const KEY = 'calo-app-v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const state = Object.assign({ profile: null, selected: [], custom: [], log: {} }, load());
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { alert('Không lưu được dữ liệu vào trình duyệt.'); } };
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const today = () => new Date().toLocaleDateString('sv');
  const allFoods = () => FOODS.concat(state.custom);
  const myFoods = () => allFoods().filter((f) => state.selected.includes(f.n));
  const target = () => (state.profile ? dailyTarget(state.profile).target : 0);

  function renderProfile() {
    const p = state.profile;
    if (p) for (const k of ['sex', 'weight', 'height', 'age', 'activity', 'loseKg', 'days']) $(k).value = p[k];
    if (!p) { $('goalOut').innerHTML = '<p class="muted">Nhập thông tin để tính lượng calo mỗi ngày.</p>'; return; }
    const r = dailyTarget(p);
    $('goalOut').innerHTML = `
      <div class="stats">
        <div><b>${r.tdee}</b><span>kcal tiêu hao/ngày</span></div>
        <div><b>-${r.deficit}</b><span>kcal cần thâm hụt</span></div>
        <div class="hl"><b>${r.target}</b><span>kcal nên ăn/ngày</span></div>
      </div>
      ${r.tooFast ? `<p class="warn">⚠️ Giảm ${p.loseKg}kg trong ${p.days} ngày là quá nhanh. Đã giữ mức tối thiểu an toàn ${r.target} kcal — thực tế sẽ cần khoảng ${Math.ceil((p.loseKg * 7700) / (r.tdee - r.target || 1))} ngày.</p>` : ''}`;
  }

  function renderLog() {
    const list = state.log[today()] || [];
    const eaten = list.reduce((s, x) => s + x.k, 0);
    const t = target();
    const left = t - eaten;
    $('logSummary').innerHTML = t
      ? `<div class="stats"><div><b>${eaten}</b><span>đã ăn</span></div><div class="${left < 0 ? 'bad' : 'hl'}"><b>${left}</b><span>${left < 0 ? 'kcal vượt mức' : 'kcal còn được ăn'}</span></div></div>
         <div class="bar"><i style="width:${Math.min(100, (eaten / t) * 100)}%" class="${left < 0 ? 'over' : ''}"></i></div>`
      : '<p class="muted">Nhập mục tiêu ở trên trước nhé.</p>';
    $('logList').innerHTML = list.map((x, i) => `<li><span>${esc(x.n)} — ${x.g}g</span><span>${x.k} kcal <button class="x" data-i="${i}" aria-label="Xoá">✕</button></span></li>`).join('') || '<li class="muted">Hôm nay chưa ghi món nào.</li>';
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
    const t = target();
    if (!t) { $('menu').innerHTML = '<p class="muted">Nhập mục tiêu ở trên để tạo thực đơn.</p>'; $('suggest').innerHTML = ''; return; }
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    $('menu').innerHTML = buildMenu(t, myFoods()).map((meals, d) => `
      <div class="day"><h3>${days[d]} <small>${meals.reduce((s, m) => s + m.kcal, 0)} kcal</small></h3>
        ${meals.map((m) => `<p><b>${m.name}:</b> ${m.items.map((x) => `${esc(x.n)} ${x.g}g`).join(', ')} <small>(${m.kcal})</small></p>`).join('')}
      </div>`).join('');
    const sel = new Set(state.selected);
    const sug = FOODS.filter((f) => f.e && !sel.has(f.n));
    const off = new Date().getDate() % Math.max(1, sug.length);
    $('suggest').innerHTML = sug.length
      ? '<h3>Gợi ý thêm vài món dễ mua</h3>' + sug.concat(sug).slice(off, off + 5).map((f) => `<button class="chip add" data-n="${esc(f.n)}">+ ${esc(f.n)} <small>${f.k} kcal/100g</small></button>`).join('')
      : '';
  }

  const renderAll = () => { renderProfile(); renderLog(); renderFoods(); renderMenu(); };

  $('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = (k) => parseFloat($(k).value);
    state.profile = { sex: $('sex').value, weight: v('weight'), height: v('height'), age: v('age'), activity: v('activity'), loseKg: v('loseKg'), days: v('days') };
    save(); renderAll();
  });

  $('logForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const r = parseEntry($('entry').value, allFoods());
    if (!r) { $('entryErr').textContent = 'Không hiểu. Ví dụ: "100g cơm" hoặc "ức gà 150". Món chưa có thì thêm ở mục "Món của tôi".'; return; }
    $('entryErr').textContent = '';
    (state.log[today()] ||= []).push(item(r.food, r.g));
    $('entry').value = '';
    save(); renderLog();
  });

  $('logList').addEventListener('click', (e) => {
    if (!e.target.dataset.i) return;
    state.log[today()].splice(+e.target.dataset.i, 1);
    save(); renderLog();
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
    if (!n || !(k >= 0)) return;
    if (allFoods().some((f) => norm(f.n) === norm(n))) { alert('Món này đã có rồi.'); return; }
    state.custom.push({ n, k, c: $('cCat').value });
    if ($('cCat').value !== 'other') state.selected.push(n);
    e.target.reset();
    save(); renderFoods(); renderMenu();
  });

  $('regen').addEventListener('click', () => {
    state.selected.sort(() => Math.random() - 0.5); // xáo thứ tự để ra thực đơn khác
    save(); renderMenu();
  });

  renderAll();
}
