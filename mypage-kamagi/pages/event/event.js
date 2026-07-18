/**
 * イベント管理ページ
 * 
 * 共通機能と初期化を担当
 * 各機能は event-create.js, event-update.js, event-delete.js に分離
 */

// イベントデータのキャッシュ
let eventsCache = [];
// メンバーデータのキャッシュ
let membersCache = [];

document.addEventListener('DOMContentLoaded', async () => {
    // タブ切り替えのセットアップ
    setupTabs();

    // 初期化: メンバー一覧とイベント一覧を取得
    await Promise.all([
        loadMembers(),
        loadEvents()
    ]);

    // カスタムマルチセレクトの初期化
    initMultiSelect('create');
    initMultiSelect('update');
    
    // フォームイベントの設定（各ファイルから読み込まれた関数を呼び出す）
    setupCreateForm();
    setupUpdateForm();
    setupDeleteForm();
});

/**
 * タブ切り替え機能のセットアップ
 */
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // ボタンのアクティブ状態を切り替え
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // パネルの表示を切り替え
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `${targetTab}-section`) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

/**
 * メンバー一覧を取得して参加者セレクトボックスに表示
 */
async function loadMembers() {
    try {
        const result = await apiClient.get('/users.php');
        
        if (result.success && result.members) {
            membersCache = result.members;
            populateMemberSelects();
        }
    } catch (error) {
        console.error('メンバー一覧の取得に失敗:', error.message);
        showToast('メンバー一覧の取得に失敗しました', 'error');
    }
}

/**
 * 参加者セレクトボックスにメンバー一覧を表示
 */
function populateMemberSelects() {
    const createList = document.getElementById('create-participants-list');
    const updateList = document.getElementById('update-participants-list');

    // クリア
    createList.innerHTML = '';
    updateList.innerHTML = '';

    if (membersCache.length === 0) {
        const empty = '<li class="multi-select-empty">メンバーがいません</li>';
        createList.innerHTML = empty;
        updateList.innerHTML = empty;
        return;
    }

    membersCache.forEach(member => {
        const label = `${member.name} (${member.id})`;
        createList.appendChild(buildMultiSelectItem('create', member.id, label));
        updateList.appendChild(buildMultiSelectItem('update', member.id, label));
    });
}

/**
 * チェックボックスリストアイテムの生成
 * @param {string} prefix  'create' | 'update'
 * @param {string} value   メンバー ID
 * @param {string} label   表示テキスト
 * @returns {HTMLElement}
 */
function buildMultiSelectItem(prefix, value, label) {
    const li = document.createElement('li');
    li.className = 'multi-select-item';
    li.dataset.value = value;
    li.dataset.label = label;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = value;
    cb.id = `${prefix}-member-${value}`;

    const span = document.createElement('span');
    span.className = 'multi-select-item-label';
    span.textContent = label;

    li.appendChild(cb);
    li.appendChild(span);

    // クリックでトグル
    li.addEventListener('click', (e) => {
        if (e.target === cb) return; // checkbox直接クリックは自然に処理される
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change'));
    });

    cb.addEventListener('change', () => {
        li.classList.toggle('checked', cb.checked);
        multiSelectRefreshTags(prefix);
    });

    return li;
}

/**
 * カスタムマルチセレクトの初期化（開閉、検索、クリア）
 * @param {string} prefix  'create' | 'update'
 */
function initMultiSelect(prefix) {
    const widget   = document.getElementById(`${prefix}-participants-widget`);
    const control  = document.getElementById(`${prefix}-participants-control`);
    const dropdown = document.getElementById(`${prefix}-participants-dropdown`);
    const search   = document.getElementById(`${prefix}-participants-search`);
    const clearBtn = document.getElementById(`${prefix}-participants-clear`);
    const list     = document.getElementById(`${prefix}-participants-list`);

    if (!widget || !control || !dropdown || !search || !clearBtn || !list) return;

    // コントロール全体クリックで開閉トグル
    control.addEventListener('mousedown', (e) => {
        // タグのクリアボタンのみ除外（search と widget 内はすべて開く）
        if (e.target.classList.contains('multi-select-tag-remove') ||
            e.target === clearBtn) return;
        // search インプット以外は focus 移動を防ぎドロップダウンを操作
        if (e.target !== search) e.preventDefault();
        const isOpen = widget.classList.contains('open');
        closeAllMultiSelects();
        if (!isOpen) {
            widget.classList.add('open');
            search.focus();
        }
    });

    // 検索欄フォーカス時も必ず開く
    search.addEventListener('focus', () => {
        widget.classList.add('open');
    });

    // 検索テキスト入力でフィルタリング
    search.addEventListener('input', () => {
        const q = search.value.trim().toLowerCase();
        let anyVisible = false;
        list.querySelectorAll('.multi-select-item').forEach(item => {
            const match = item.dataset.label.toLowerCase().includes(q);
            item.style.display = match ? '' : 'none';
            if (match) anyVisible = true;
        });
        // 結果なしメッセージ
        let emptyMsg = list.querySelector('.multi-select-empty');
        if (!anyVisible) {
            if (!emptyMsg) {
                emptyMsg = document.createElement('li');
                emptyMsg.className = 'multi-select-empty';
                emptyMsg.textContent = '一致するメンバーがいません';
                list.appendChild(emptyMsg);
            }
        } else if (emptyMsg && emptyMsg.dataset.dynamic) {
            emptyMsg.remove();
        }
        // ドロップダウンを開く
        widget.classList.add('open');
    });

    // 検索ボックスでアローキー
    search.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllMultiSelects();
    });

    // 全クリア
    clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        list.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            cb.checked = false;
            cb.closest('.multi-select-item').classList.remove('checked');
        });
        multiSelectRefreshTags(prefix);
        search.value = '';
        list.querySelectorAll('.multi-select-item').forEach(item => item.style.display = '');
    });
}

/**
 * タグ山を再描画
 * @param {string} prefix
 */
function multiSelectRefreshTags(prefix) {
    const tagsDiv = document.getElementById(`${prefix}-participants-tags`);
    const search  = document.getElementById(`${prefix}-participants-search`);
    const widget  = document.getElementById(`${prefix}-participants-widget`);
    const list    = document.getElementById(`${prefix}-participants-list`);

    // 既存タグを削除
    tagsDiv.querySelectorAll('.multi-select-tag').forEach(t => t.remove());

    const checked = list.querySelectorAll('input[type="checkbox"]:checked');
    checked.forEach(cb => {
        const tag = document.createElement('span');
        tag.className = 'multi-select-tag';
        tag.textContent = cb.closest('.multi-select-item').dataset.label;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'multi-select-tag-remove';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cb.checked = false;
            cb.closest('.multi-select-item').classList.remove('checked');
            multiSelectRefreshTags(prefix);
        });

        tag.appendChild(removeBtn);
        tagsDiv.insertBefore(tag, search);
    });

    widget.classList.toggle('has-value', checked.length > 0);
}

/**
 * すべてのカスタムマルチセレクトを閉じる
 */
function closeAllMultiSelects() {
    document.querySelectorAll('.multi-select.open').forEach(el => el.classList.remove('open'));
}

// 外側クリックで閉じる
document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.multi-select')) closeAllMultiSelects();
});

/**
 * カスタムウィジェットから選択されたID一覧を取得
 * @param {string} prefix
 * @returns {string[]}
 */
function getMultiSelectValues(prefix) {
    const list = document.getElementById(`${prefix}-participants-list`);
    return Array.from(list.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
}

/**
 * カスタムウィジェットに選択状態を設定
 * @param {string} prefix
 * @param {string[]} ids  選択するメンバー ID の配列
 */
function setMultiSelectValues(prefix, ids) {
    const list = document.getElementById(`${prefix}-participants-list`);
    list.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = ids.includes(String(cb.value));
        cb.closest('.multi-select-item').classList.toggle('checked', cb.checked);
    });
    multiSelectRefreshTags(prefix);
}

/**
 * カスタムウィジェットをリセット
 * @param {string} prefix
 */
function resetMultiSelect(prefix) {
    setMultiSelectValues(prefix, []);
}

/**
 * イベント一覧を取得してセレクトボックスに表示
 */
async function loadEvents() {
    try {
        // すべてのイベントを取得（フィルターなし）
        const result = await eventService.getEvents();
        
        if (result.success && result.events) {
            eventsCache = result.events;
            populateEventSelects();
        }
    } catch (error) {
        console.error('イベント一覧の取得に失敗:', error.message);
        showToast('イベント一覧の取得に失敗しました', 'error');
    }
}

/**
 * セレクトボックスにイベント一覧を表示
 */
function populateEventSelects() {
    const updateSelect = document.getElementById('update-event-select');
    const deleteSelect = document.getElementById('delete-event-select');
    
    // 既存のオプションをクリア（最初のプレースホルダー以外）
    updateSelect.innerHTML = '<option value="">イベントを選択してください</option>';
    deleteSelect.innerHTML = '<option value="">イベントを選択してください</option>';
    
    // イベントをオプションとして追加
    eventsCache.forEach(event => {
        const startDate = formatDateTime(event.start);
        const optionText = `${event.title} (${startDate})`;
        
        const updateOption = document.createElement('option');
        updateOption.value = event.id;
        updateOption.textContent = optionText;
        updateSelect.appendChild(updateOption);
        
        const deleteOption = document.createElement('option');
        deleteOption.value = event.id;
        deleteOption.textContent = optionText;
        deleteSelect.appendChild(deleteOption);
    });
}

/**
 * 日時をフォーマット
 * @param {string} dateStr 日時文字列
 * @returns {string} フォーマットされた日時
 */
function formatDateTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * datetime-local用にフォーマット
 * @param {string} dateStr 日時文字列
 * @returns {string} datetime-local形式
 */
function formatForDateTimeLocal(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    // YYYY-MM-DDTHH:mm 形式に変換
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * 日時のバリデーション
 * @param {string} startTime 開始日時
 * @param {string} endTime 終了日時
 * @returns {boolean} バリデーション結果
 */
function validateEventDateTime(startTime, endTime) {
    if (new Date(endTime) <= new Date(startTime)) {
        showToast('終了日時は開始日時より後に設定してください', 'error');
        return false;
    }
    return true;
}
