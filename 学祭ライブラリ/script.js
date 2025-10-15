const DATA_PATH = './reservations.json';

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

function renderUserTable(slots) {
  const container = document.getElementById('slots-container');
  container.innerHTML = '';

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
  container.appendChild(table);
}

function renderAdminTable(slots, showFull=false) {
  const container = document.getElementById('admin-container');
  container.innerHTML = '';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>時間</th><th>定員</th><th>予約済</th><th>空き</th><th>ステータス</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  slots.forEach(s => {
    const free = Math.max(0, s.capacity - s.reserved);
    const isFull = free === 0;
    if (isFull && !showFull) return; // skip full slots unless requested

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
  container.appendChild(table);
}

async function init() {
  const data = await loadData();
  renderUserTable(data);
  renderAdminTable(data, false);

  const showFullCheckbox = document.getElementById('show-full');
  showFullCheckbox.addEventListener('change', (e) => {
    renderAdminTable(data, e.target.checked);
  });
}

document.addEventListener('DOMContentLoaded', init);
