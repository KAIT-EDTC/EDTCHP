// 管理者向けページ - 予約管理と編集
let DATA_PATH = './reservations-day1.json';

function setDataPathByDate(date) {
  if (date === 'day1') {
    DATA_PATH = './reservations-day1.json';
  } else {
    DATA_PATH = './reservations-day2.json';
  }
}

let currentData = [];
let originalData = [];
let isEditMode = false;

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

// 日付でフィルタ（id末尾の番号で判定）
function filterByDate(slots, date) {
  if (date === 'day1') {
    // 1日目: id末尾が1~6（ぶるぶる/相撲/ライン）
    return slots.filter(s => {
      const num = parseInt((s.id.match(/-(\d+)$/) || [])[1]);
      return num && num <= 6;
    });
  } else {
    // 2日目: id末尾が7以上
    return slots.filter(s => {
      const num = parseInt((s.id.match(/-(\d+)$/) || [])[1]);
      return num && num >= 7;
    });
  }
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
  table.className = 'admin-table';
  
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>ID</th><th>時間</th><th>定員</th><th>予約済</th><th>空き</th><th>ステータス</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  slots.forEach(s => {
    const free = Math.max(0, s.capacity - s.reserved);
    const isFull = free === 0;
    if (isFull && !showFull) return;

    const statusText = isFull ? '満席' : (free <= Math.ceil(s.capacity * 0.3) ? '残りわずか' : '空きあり');
    const status = isFull ? 'full' : (free <= Math.ceil(s.capacity * 0.3) ? 'partial' : 'ok');

    const tr = document.createElement('tr');
    tr.className = isFull ? 'row-full' : '';
    tr.innerHTML = `
      <td class="id-cell">${s.id}</td>
      <td class="time-cell">${s.time}</td>
      <td class="center">${s.capacity}</td>
      <td class="center">${s.reserved}</td>
      <td class="center">${free}</td>
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
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="muted">このプランの枠はまだありません。新しい枠を追加してください。</div>';
    updateJsonPreview(data);
    return;
  }
  
  filtered.forEach((slot, index) => {
    const div = document.createElement('div');
    div.className = 'slot-edit-item';
    div.innerHTML = `
      <div class="slot-header">
        <h4>枠 ${index + 1} <span class="slot-id">(ID: ${slot.id})</span></h4>
        <button class="remove-slot-btn btn-danger" data-id="${slot.id}">🗑️ 削除</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>時間:</label>
          <input type="text" class="edit-time" data-id="${slot.id}" value="${slot.time}" placeholder="10:00 - 10:30" />
        </div>
        <div class="form-group">
          <label>定員:</label>
          <input type="number" class="edit-capacity" data-id="${slot.id}" value="${slot.capacity}" min="1" />
        </div>
        <div class="form-group">
          <label>予約済:</label>
          <input type="number" class="edit-reserved" data-id="${slot.id}" value="${slot.reserved}" min="0" />
        </div>
      </div>
    `;
    container.appendChild(div);
  });

  updateJsonPreview(data);
  attachEditorListeners();
}

function attachEditorListeners() {
  // 入力変更時にプレビュー更新
  document.querySelectorAll('.edit-time, .edit-capacity, .edit-reserved').forEach(input => {
    input.addEventListener('input', () => updateDataFromInputs());
  });

  // 削除ボタン
  document.querySelectorAll('.remove-slot-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const idx = currentData.findIndex(s => s.id === id);
      if (idx !== -1) {
        if (confirm(`ID: ${id} の枠を削除しますか?`)) {
          currentData.splice(idx, 1);
          const plan = document.getElementById('editor-plan-select').value;
          renderJsonEditor(currentData, plan);
        }
      }
    });
  });
}

function updateDataFromInputs() {
  const times = document.querySelectorAll('.edit-time');
  const capacities = document.querySelectorAll('.edit-capacity');
  const reserveds = document.querySelectorAll('.edit-reserved');

  times.forEach((input, i) => {
    const id = input.dataset.id;
    const slot = currentData.find(s => s.id === id);
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
  // 新しいIDを生成（プラン名-番号形式）
  const planSlots = filterByPlan(currentData, plan);
  const maxNum = planSlots.length > 0 
    ? Math.max(...planSlots.map(s => {
        const match = s.id.match(/-(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      }))
    : 0;
  
  const newId = `${plan}-${maxNum + 1}`;
  const newSlot = {
    id: newId,
    plan: plan,
    time: "00:00 - 00:00",
    capacity: 2,
    reserved: 0
  };
  currentData.push(newSlot);
  renderJsonEditor(currentData, plan);
}

async function saveJson() {
  const messageDiv = document.getElementById('save-message');
  messageDiv.style.display = 'block';
  messageDiv.textContent = '保存中...';
  messageDiv.className = '';

  // 日付選択UIから現在のdate値を取得
  const dateSelect = document.getElementById('date-select');
  const date = dateSelect ? dateSelect.value : (DATA_PATH.includes('day2') ? 'day2' : 'day1');

  try {
    const response = await fetch('save-reservations.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: date,
        data: currentData
      })
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status} ${response.statusText} ${text}`);
    }
    let result;
    try {
      result = await response.json();
    } catch (e) {
      const text = await response.text().catch(() => '');
      throw new Error(`サーバーからの応答をJSONとして解析できませんでした。${text}`);
    }

    if (result.success) {
      const targetFile = result.file ? ` (${result.file})` : '';
      messageDiv.textContent = `✓ 保存に成功しました！${targetFile}`;
      messageDiv.className = 'success';
      originalData = JSON.parse(JSON.stringify(currentData));
      // 保存直後に再読み込みして正しく保存された内容を反映
      await refreshData();
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 3000);
    } else {
      messageDiv.textContent = '✗ 保存に失敗しました: ' + result.error;
      messageDiv.className = 'error';
    }
  } catch (err) {
    messageDiv.textContent = '✗ 保存エラー: ' + err.message;
    messageDiv.className = 'error';
  }
}

function enterEditMode(plan) {
  isEditMode = true;
  document.getElementById('admin-view').style.display = 'none';
  document.getElementById('json-editor').style.display = 'block';
  
  // ナビゲーションボタンの状態を変更
  document.getElementById('view-reservations-btn').classList.remove('active');
  document.getElementById('edit-json-btn').classList.add('active');
  
  originalData = JSON.parse(JSON.stringify(currentData));
  renderJsonEditor(currentData, plan);
}

function exitEditMode() {
  isEditMode = false;
  document.getElementById('json-editor').style.display = 'none';
  document.getElementById('admin-view').style.display = 'block';
  document.getElementById('save-message').style.display = 'none';
  
  // ナビゲーションボタンの状態を変更
  document.getElementById('edit-json-btn').classList.remove('active');
  document.getElementById('view-reservations-btn').classList.add('active');
}

async function refreshData() {
  const data = await loadData();
  currentData = data;
  originalData = JSON.parse(JSON.stringify(data));
  
  const adminViewMode = document.getElementById('admin-view-mode').value;
  const adminPlan = document.getElementById('admin-plan-select').value;
  const showFull = document.getElementById('show-full').checked;
  
  renderAdminTable(currentData, showFull, adminViewMode, adminPlan);
}

async function init() {
  const data = await loadData();
  currentData = data;
  originalData = JSON.parse(JSON.stringify(data));

  // 表示モードの初期値
  let adminViewMode = 'all';
  let adminPlan = '1800';
  let editorPlan = '1800';
  let adminDate = 'day1';
  setDataPathByDate(adminDate);

  // 管理者向け表示モード切替
  const adminDateSelect = document.getElementById('date-select');
  const adminViewModeSelect = document.getElementById('admin-view-mode');
  const adminPlanSelector = document.getElementById('admin-plan-selector');
  const adminPlanSelect = document.getElementById('admin-plan-select');

  async function renderFilteredTable() {
    setDataPathByDate(adminDate);
    const data = await loadData();
    currentData = data;
    const showFull = document.getElementById('show-full').checked;
    if (adminViewMode === 'single') {
      renderAdminTable(currentData, showFull, 'single', adminPlan);
    } else {
      renderAdminTable(currentData, showFull, 'all');
    }
  }

  adminDateSelect.addEventListener('change', (e) => {
    adminDate = e.target.value;
    setDataPathByDate(adminDate);
    renderFilteredTable();
  });

  adminViewModeSelect.addEventListener('change', (e) => {
    adminViewMode = e.target.value;
    if (adminViewMode === 'single') {
      adminPlanSelector.style.display = 'inline';
    } else {
      adminPlanSelector.style.display = 'none';
    }
    renderFilteredTable();
  });

  adminPlanSelect.addEventListener('change', (e) => {
    adminPlan = e.target.value;
    if (adminViewMode === 'single') {
      renderFilteredTable();
    }
  });

  // 編集画面プラン切替
  const editorPlanSelect = document.getElementById('editor-plan-select');
  editorPlanSelect.addEventListener('change', (e) => {
    editorPlan = e.target.value;
    renderJsonEditor(currentData, editorPlan);
  });

  // 初期表示
  renderFilteredTable();

  const showFullCheckbox = document.getElementById('show-full');
  showFullCheckbox.addEventListener('change', renderFilteredTable);

  // ナビゲーションボタン
  document.getElementById('view-reservations-btn').addEventListener('click', () => {
    if (isEditMode) {
      if (confirm('編集中の内容は破棄されます。よろしいですか？')) {
        currentData = JSON.parse(JSON.stringify(originalData));
        exitEditMode();
      }
    }
  });

  document.getElementById('edit-json-btn').addEventListener('click', () => {
    if (!isEditMode) {
      enterEditMode(editorPlan);
    }
  });

  // 更新ボタン
  document.getElementById('refresh-btn').addEventListener('click', refreshData);

  // 新しい枠を追加
  document.getElementById('add-slot-btn').addEventListener('click', () => {
    const plan = editorPlanSelect.value;
    addNewSlot(plan);
  });

  // 保存ボタン
  document.getElementById('save-json-btn').addEventListener('click', saveJson);

  // キャンセルボタン
  document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    if (confirm('編集内容を破棄してよろしいですか？')) {
      currentData = JSON.parse(JSON.stringify(originalData));
      exitEditMode();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
