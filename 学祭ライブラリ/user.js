// ユーザー向けページ - 予約状況確認専用（両日表示）
let currentData = { day1: [], day2: [] };

const PLAN_NAMES = {
  '1800': '相撲ロボット (1800円)',
  '600': 'ぶるぶるロボット (600円)',
  'free': 'ライントレーサー (無料)'
};

async function loadBothData() {
  try {
    const [r1, r2] = await Promise.all([
      fetch('./reservations-day1.json', { cache: 'no-store' }),
      fetch('./reservations-day2.json', { cache: 'no-store' })
    ]);
    const [d1, d2] = await Promise.all([
      r1.ok ? r1.json() : Promise.resolve([]),
      r2.ok ? r2.json() : Promise.resolve([])
    ]);
    return { day1: d1, day2: d2 };
  } catch (err) {
    console.error('Failed to load data', err);
    return { day1: [], day2: [] };
  }
}

function filterByPlan(slots, plan) {
  return slots.filter(s => s.plan === plan);
}

function renderUserTableInto(containerId, slots, mode = 'all', plan = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  if (mode === 'single' && plan) {
    const filtered = filterByPlan(slots, plan);
    if (filtered.length === 0) {
      container.innerHTML = '<div class="muted">このプランの枠はありません</div>';
      return;
    }
    const table = createUserTable(filtered, plan);
    container.appendChild(table);
  } else {
    ['1800', '600', 'free'].forEach(planKey => {
      const filtered = filterByPlan(slots, planKey);
      if (filtered.length === 0) return;

      const planSection = document.createElement('div');
      planSection.className = 'plan-section';

      const planTitle = document.createElement('h3');
      planTitle.textContent = PLAN_NAMES[planKey];
      planTitle.className = 'plan-title';
      planSection.appendChild(planTitle);

      const table = createUserTable(filtered, planKey);
      planSection.appendChild(table);

      container.appendChild(planSection);
    });
  }
}

function createUserTable(slots, planKey) {
  const table = document.createElement('table');
  table.className = 'user-table';
  
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>時間</th><th>定員</th><th>予約済</th><th>空き状況</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  slots.forEach(s => {
    const free = Math.max(0, s.capacity - s.reserved);
    const isFull = free === 0;
    const status = isFull ? 'full' : (free <= Math.ceil(s.capacity * 0.3) ? 'partial' : 'ok');
    const statusText = isFull ? '満席' : `残り ${free}席`;

    const tr = document.createElement('tr');
    tr.className = isFull ? 'row-full' : '';
    tr.innerHTML = `
      <td class="time-cell">${s.time}</td>
      <td class="center">${s.capacity}名</td>
      <td class="center">${s.reserved}名</td>
      <td><span class="status ${status}">${statusText}</span></td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

async function init() {
  let viewMode = 'all';
  let selectedPlan = '1800';

  const viewModeSelect = document.getElementById('user-view-mode');
  const planSelector = document.getElementById('user-plan-selector');
  const planSelect = document.getElementById('user-plan-select');

  async function renderBoth() {
    const data = await loadBothData();
    currentData = data;
    if (viewMode === 'single') {
      renderUserTableInto('day1-slots', currentData.day1, 'single', selectedPlan);
      renderUserTableInto('day2-slots', currentData.day2, 'single', selectedPlan);
    } else {
      renderUserTableInto('day1-slots', currentData.day1, 'all');
      renderUserTableInto('day2-slots', currentData.day2, 'all');
    }
  }

  viewModeSelect.addEventListener('change', (e) => {
    viewMode = e.target.value;
    if (viewMode === 'single') {
      planSelector.style.display = 'inline';
    } else {
      planSelector.style.display = 'none';
    }
    renderBoth();
  });

  planSelect.addEventListener('change', (e) => {
    selectedPlan = e.target.value;
    if (viewMode === 'single') {
      renderBoth();
    }
  });

  // 初期表示
  renderBoth();

  // 自動更新（30秒ごと）
  setInterval(renderBoth, 30000);
}

document.addEventListener('DOMContentLoaded', init);
