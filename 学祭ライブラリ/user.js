// ユーザー向けページ - 予約状況確認専用
let DATA_PATH = './reservations-day1.json';

function setDataPathByDate(date) {
  if (date === 'day1') {
    DATA_PATH = './reservations-day1.json';
  } else {
    DATA_PATH = './reservations-day2.json';
  }
}

let currentData = [];

const PLAN_NAMES = {
  '1800': '相撲ロボット (1800円)',
  '600': 'ぶるぶるロボット (600円)',
  'free': 'ライントレーサー (無料)'
};

async function loadData() {
  try {
    const res = await fetch(DATA_PATH, {cache: 'no-store'});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to load data', err);
    return [];
  }
}

function filterByPlan(slots, plan) {
  return slots.filter(s => s.plan === plan);
}

function renderUserTable(slots, mode = 'all', plan = null) {
  const container = document.getElementById('slots-container');
  container.innerHTML = '';

  if (mode === 'single' && plan) {
    // 単一プラン表示
    const filtered = filterByPlan(slots, plan);
    if (filtered.length === 0) {
      container.innerHTML = '<div class="muted">このプランの枠はありません</div>';
      return;
    }
    const table = createUserTable(filtered, plan);
    container.appendChild(table);
  } else {
    // 全プラン表示
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
  let userDate = 'day1';
  setDataPathByDate(userDate);

  const dateSelect = document.getElementById('user-date-select');
  const viewModeSelect = document.getElementById('user-view-mode');
  const planSelector = document.getElementById('user-plan-selector');
  const planSelect = document.getElementById('user-plan-select');

  async function renderFilteredTable() {
    setDataPathByDate(userDate);
    const data = await loadData();
    currentData = data;
    if (viewMode === 'single') {
      renderUserTable(currentData, 'single', selectedPlan);
    } else {
      renderUserTable(currentData, 'all');
    }
  }

  dateSelect.addEventListener('change', (e) => {
    userDate = e.target.value;
    renderFilteredTable();
  });

  viewModeSelect.addEventListener('change', (e) => {
    viewMode = e.target.value;
    if (viewMode === 'single') {
      planSelector.style.display = 'inline';
    } else {
      planSelector.style.display = 'none';
    }
    renderFilteredTable();
  });

  planSelect.addEventListener('change', (e) => {
    selectedPlan = e.target.value;
    if (viewMode === 'single') {
      renderFilteredTable();
    }
  });

  // 初期表示
  renderFilteredTable();

  // 自動更新（30秒ごと）
  setInterval(renderFilteredTable, 30000);
}

document.addEventListener('DOMContentLoaded', init);
