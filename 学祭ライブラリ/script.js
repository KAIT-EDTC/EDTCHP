const DATA_PATH = './reservations.json';

let currentData = [];
let isEditMode = false;

const PLAN_NAMES = {
  '1800': '1800円プラン',
  '600': '600円プラン',
  'free': '無料プラン'
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
    const table = createUserTable(filtered);
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
      
      const table = createUserTable(filtered);
      planSection.appendChild(table);
      
      container.appendChild(planSection);
    });
  }
}

function createUserTable(slots) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>時間</th><th>定員</th><th>予約済</th><th>空き</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  slots.forEach(s => {
    const free = Math.max(0, s.capacity - s.reserved);
    const status = free === 0 ? 'full' : (free <= Math.ceil(s.capacity * 0.3) ? 'partial' : 'ok');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.time}</td>
      <td>${s.capacity}</td>
      <td>${s.reserved}</td>
      <td><span class="status ${status}">${free}席</span></td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

function renderAdminTable(slots, showFull = false, mode = 'all', plan = null) {
  const container = document.getElementById('admin-container');
  container.innerHTML = '';

  if (mode === 'single' && plan) {
    // 単一プラン表示
    const filtered = filterByPlan(slots, plan);
    if (filtered.length === 0) {
      container.innerHTML = '<div class="muted">このプランの枠はありません</div>';
      return;
    }
    const table = createAdminTable(filtered, showFull);
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
      
      const table = createAdminTable(filtered, showFull);
      planSection.appendChild(table);
      
      container.appendChild(planSection);
    });
  }
}

function createAdminTable(slots, showFull) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>時間</th><th>定員</th><th>予約済</th><th>空き</th><th>ステータス</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  slots.forEach(s => {
    const free = Math.max(0, s.capacity - s.reserved);
    const isFull = free === 0;
    if (isFull && !showFull) return;

    const statusText = isFull ? '満席' : (free <= Math.ceil(s.capacity * 0.3) ? '残りわずか' : '空きあり');
    const status = isFull ? 'full' : (free <= Math.ceil(s.capacity * 0.3) ? 'partial' : 'ok');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.time}</td>
      <td>${s.capacity}</td>
      <td>${s.reserved}</td>
      <td>${free}</td>
      <td><span class="status ${status}">${statusText}</span></td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

// JSON編集機能
function renderJsonEditor(data, plan) {
  const container = document.getElementById('editor-container');
  container.innerHTML = '';
  const filtered = filterByPlan(data, plan);
  
  filtered.forEach((slot, index) => {
    const div = document.createElement('div');
    div.className = 'slot-edit-item';
    div.innerHTML = `
      <h4>枠 ${index + 1}</h4>
      <div class="form-group">
        <label>時間:</label>
        <input type="text" class="edit-time" data-id="${slot.id}" value="${slot.time}" />
      </div>
      <div class="form-group">
        <label>定員:</label>
        <input type="number" class="edit-capacity" data-id="${slot.id}" value="${slot.capacity}" min="1" />
      </div>
      <div class="form-group">
        <label>予約済:</label>
        <input type="number" class="edit-reserved" data-id="${slot.id}" value="${slot.reserved}" min="0" />
      </div>
      <button class="remove-slot-btn" data-id="${slot.id}">この枠を削除</button>
    `;
    container.appendChild(div);
  });

  updateJsonPreview(data);
  attachEditorListeners(plan);
}

function attachEditorListeners(plan) {
  // 入力変更時にプレビュー更新
  document.querySelectorAll('.edit-time, .edit-capacity, .edit-reserved').forEach(input => {
    input.addEventListener('input', () => updateDataFromInputs(plan));
  });

  // 削除ボタン
  document.querySelectorAll('.remove-slot-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      const idx = currentData.findIndex(s => s.id === id && s.plan === plan);
      if (idx !== -1) {
        currentData.splice(idx, 1);
        renderJsonEditor(currentData, plan);
      }
    });
  });
}

function updateDataFromInputs(plan) {
  const times = document.querySelectorAll('.edit-time');
  const capacities = document.querySelectorAll('.edit-capacity');
  const reserveds = document.querySelectorAll('.edit-reserved');

  times.forEach((input, i) => {
    const id = parseInt(input.dataset.id);
    const slot = currentData.find(s => s.id === id && s.plan === plan);
    if (slot) {
      slot.time = input.value;
      slot.capacity = parseInt(capacities[i].value) || 0;
      slot.reserved = parseInt(reserveds[i].value) || 0;
    }
  });

  updateJsonPreview(currentData);
}

function updateJsonPreview(data) {
  const preview = document.getElementById('json-preview');
  preview.value = JSON.stringify(data, null, 2);
}

function addNewSlot(plan) {
  const newId = currentData.length > 0 ? Math.max(...currentData.map(s => s.id)) + 1 : 1;
  const newSlot = {
    id: newId,
    plan: plan,
    time: "00:00 - 00:00",
    capacity: 10,
    reserved: 0
  };
  currentData.push(newSlot);
  renderJsonEditor(currentData, plan);
}

async function saveJson() {
  const messageDiv = document.getElementById('save-message');
  
  try {
    const response = await fetch('save-reservations.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentData)
    });

    const result = await response.json();

    if (result.success) {
      messageDiv.textContent = '保存に成功しました！';
      messageDiv.className = 'success';
      
      // データを再読み込み
      setTimeout(async () => {
        const data = await loadData();
        currentData = data;
        exitEditMode();
      }, 1000);
    } else {
      messageDiv.textContent = '保存に失敗しました: ' + result.error;
      messageDiv.className = 'error';
    }
  } catch (err) {
    messageDiv.textContent = '保存エラー: ' + err.message;
    messageDiv.className = 'error';
  }

  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

function enterEditMode(plan) {
  isEditMode = true;
  document.getElementById('admin-view').style.display = 'none';
  document.getElementById('json-editor').style.display = 'block';
  renderJsonEditor([...currentData], plan);
}

function exitEditMode() {
  isEditMode = false;
  document.getElementById('json-editor').style.display = 'none';
  document.getElementById('admin-view').style.display = 'block';
  document.getElementById('save-message').style.display = 'none';
}

async function init() {
  const data = await loadData();
  currentData = data;

  // 表示モードの初期値
  let userViewMode = 'all';
  let adminViewMode = 'all';
  let userPlan = '1800';
  let adminPlan = '1800';
  let editorPlan = '1800';

  // ユーザー向け表示モード切替
  const userViewModeSelect = document.getElementById('user-view-mode');
  const userPlanSelector = document.getElementById('user-plan-selector');
  const userPlanSelect = document.getElementById('user-plan-select');
  
  userViewModeSelect.addEventListener('change', (e) => {
    userViewMode = e.target.value;
    if (userViewMode === 'single') {
      userPlanSelector.style.display = 'inline';
      renderUserTable(currentData, 'single', userPlan);
    } else {
      userPlanSelector.style.display = 'none';
      renderUserTable(currentData, 'all');
    }
  });

  userPlanSelect.addEventListener('change', (e) => {
    userPlan = e.target.value;
    if (userViewMode === 'single') {
      renderUserTable(currentData, 'single', userPlan);
    }
  });

  // 管理者向け表示モード切替
  const adminViewModeSelect = document.getElementById('admin-view-mode');
  const adminPlanSelector = document.getElementById('admin-plan-selector');
  const adminPlanSelect = document.getElementById('admin-plan-select');
  
  adminViewModeSelect.addEventListener('change', (e) => {
    adminViewMode = e.target.value;
    const showFull = document.getElementById('show-full').checked;
    if (adminViewMode === 'single') {
      adminPlanSelector.style.display = 'inline';
      renderAdminTable(currentData, showFull, 'single', adminPlan);
    } else {
      adminPlanSelector.style.display = 'none';
      renderAdminTable(currentData, showFull, 'all');
    }
  });

  adminPlanSelect.addEventListener('change', (e) => {
    adminPlan = e.target.value;
    const showFull = document.getElementById('show-full').checked;
    if (adminViewMode === 'single') {
      renderAdminTable(currentData, showFull, 'single', adminPlan);
    }
  });

  // 編集画面プラン切替
  const editorPlanSelect = document.getElementById('editor-plan-select');
  editorPlanSelect.addEventListener('change', (e) => {
    editorPlan = e.target.value;
    renderJsonEditor(currentData, editorPlan);
  });

  // 初期表示
  renderUserTable(currentData, userViewMode, userPlan);
  renderAdminTable(currentData, false, adminViewMode, adminPlan);

  const showFullCheckbox = document.getElementById('show-full');
  showFullCheckbox.addEventListener('change', (e) => {
    renderAdminTable(currentData, e.target.checked, adminViewMode, adminPlan);
  });

  // JSON編集ボタン
  document.getElementById('edit-json-btn').addEventListener('click', () => enterEditMode(editorPlan));

  // 新しい枠を追加
  document.getElementById('add-slot-btn').addEventListener('click', () => addNewSlot(editorPlan));

  // 保存ボタン
  document.getElementById('save-json-btn').addEventListener('click', () => {
    saveJson().then(() => {
      // 保存後、現在の表示モードを維持して再描画
      userViewMode = userViewModeSelect.value;
      adminViewMode = adminViewModeSelect.value;
      renderUserTable(currentData, userViewMode, userPlan);
      renderAdminTable(currentData, showFullCheckbox.checked, adminViewMode, adminPlan);
    });
  });

  // キャンセルボタン
  document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    currentData = [...data]; // 元のデータに戻す
    exitEditMode();
  });
}

document.addEventListener('DOMContentLoaded', init);
