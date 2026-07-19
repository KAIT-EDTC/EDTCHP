/**
   * カスタムマルチセレクトコンポーネント
   * (PC用ドロップダウン ＆ スマホ用全画面モーダル)
   */

// モバイル判定
const isMobileQuery = window.matchMedia('(max-width: 600px)');

// メンバーデータのキャッシュ (コンポーネント内管理)
let multiSelectMembers = [];

// モーダル関連の参照
let mobileModalEl = null;
let mobileModalCurrentPrefix = null;

/**
 * 外部からメンバーデータをセットし、セレクトボックスを初期構築する
 * @param {Array} members 
 */
function setMultiSelectMembers(members) {
    multiSelectMembers = members;
    populateMemberSelects();
}

/**
 * 参加者セレクトボックスにメンバー一覧を表示
 */
function populateMemberSelects() {
    const createList = document.getElementById('create-participants-list');
    const updateList = document.getElementById('update-participants-list');

    if (!createList || !updateList) return;

    // クリア
    createList.innerHTML = '';
    updateList.innerHTML = '';

    if (multiSelectMembers.length === 0) {
        const empty = '<li class="multi-select-empty">メンバーがいません</li>';
        createList.innerHTML = empty;
        updateList.innerHTML = empty;
        return;
    }

    multiSelectMembers.forEach(member => {
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

    // クリック/タップでトグル
    function toggleCheckbox(e) {
        if (e.target === cb) return; // checkbox直接クリックは自然に処理される
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change'));
    }
    li.addEventListener('click', toggleCheckbox);
    li.addEventListener('touchend', (e) => {
        e.preventDefault(); // ゴーストクリック防止
        toggleCheckbox(e);
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

    // コントロール全体クリック/タップで開閉トグル
    function handleControlToggle(e) {
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
    }

    // スマホ: タップでモーダルを開く / PC: mousedown でドロップダウン
    control.addEventListener('click', (e) => {
        if (isMobileQuery.matches) {
            e.preventDefault();
            e.stopPropagation();
            openMobileModal(prefix);
        }
    });
    control.addEventListener('mousedown', (e) => {
        if (!isMobileQuery.matches) handleControlToggle(e);
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
        } else if (emptyMsg) {
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

    if (!tagsDiv) return;

    // 既存タグと人数バッジを削除
    tagsDiv.querySelectorAll('.multi-select-tag').forEach(t => t.remove());
    tagsDiv.querySelectorAll('.multi-select-count').forEach(t => t.remove());

    const checked = list.querySelectorAll('input[type="checkbox"]:checked');

    // PC向け: 個別タグを表示
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
            e.preventDefault();
            cb.checked = false;
            cb.closest('.multi-select-item').classList.remove('checked');
            multiSelectRefreshTags(prefix);
        });

        tag.appendChild(removeBtn);
        tagsDiv.insertBefore(tag, search);
    });

    // スマホ向け: 人数バッジを表示（CSSでPC/スマホ切替）
    if (checked.length > 0) {
        const countBadge = document.createElement('span');
        countBadge.className = 'multi-select-count';
        countBadge.textContent = `${checked.length}名 選択中`;
        tagsDiv.insertBefore(countBadge, search);
    }

    widget.classList.toggle('has-value', checked.length > 0);
}

/**
 * すべてのカスタムマルチセレクトを閉じる (PCドロップダウン用)
 */
function closeAllMultiSelects() {
    document.querySelectorAll('.multi-select.open').forEach(el => el.classList.remove('open'));
}

// 外側クリック/タップで閉じる（PC用のドロップダウンのみ）
function handleOutsideClose(e) {
    if (e.target.closest('.mobile-modal-overlay')) return;
    if (!e.target.closest('.multi-select')) closeAllMultiSelects();
}
document.addEventListener('mousedown', handleOutsideClose);
document.addEventListener('touchstart', handleOutsideClose);


// ===== スマホ用 全画面モーダル =====

/**
 * モーダルDOM要素を1つだけ生成（初回呼び出し時）
 */
function ensureMobileModal() {
    if (mobileModalEl) return;

    mobileModalEl = document.createElement('div');
    mobileModalEl.className = 'mobile-modal-overlay';
    mobileModalEl.innerHTML = `
        <div class="mobile-modal-header">
            <button type="button" class="mobile-modal-cancel">
                キャンセル
            </button>
            <span class="mobile-modal-title">参加者を選択</span>
            <button type="button" class="mobile-modal-done">完了</button>
        </div>
        <div class="mobile-modal-search-wrap">
            <input type="text" class="mobile-modal-search-input" placeholder="メンバーを検索..." autocomplete="off">
        </div>
        <div class="mobile-modal-list-wrap">
            <ul class="mobile-modal-list"></ul>
        </div>
        <div class="mobile-modal-footer">
            <button type="button" class="mobile-modal-clear-btn">すべてクリア</button>
        </div>
    `;
    // body に transform (anim-fadein) がかかっているため、
    // fixed 配置がビューポート基準にならない問題を回避するため html 要素に追加
    document.documentElement.appendChild(mobileModalEl);

    // イベントバインド
    const cancelBtn = mobileModalEl.querySelector('.mobile-modal-cancel');
    const doneBtn = mobileModalEl.querySelector('.mobile-modal-done');
    const searchInput = mobileModalEl.querySelector('.mobile-modal-search-input');
    const clearBtn = mobileModalEl.querySelector('.mobile-modal-clear-btn');

    cancelBtn.addEventListener('click', () => closeMobileModal(false));
    doneBtn.addEventListener('click', () => closeMobileModal(true));

    // 検索フィルタ
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        const listEl = mobileModalEl.querySelector('.mobile-modal-list');
        let anyVisible = false;
        listEl.querySelectorAll('.mobile-modal-item').forEach(item => {
            const match = item.dataset.label.toLowerCase().includes(q);
            item.style.display = match ? '' : 'none';
            if (match) anyVisible = true;
        });
        // 結果なしメッセージ
        let emptyMsg = listEl.querySelector('.mobile-modal-empty');
        if (!anyVisible) {
            if (!emptyMsg) {
                emptyMsg = document.createElement('li');
                emptyMsg.className = 'mobile-modal-empty';
                emptyMsg.textContent = '一致するメンバーがいません';
                listEl.appendChild(emptyMsg);
            }
        } else if (emptyMsg) {
            emptyMsg.remove();
        }
    });

    // 全クリア
    clearBtn.addEventListener('click', () => {
        mobileModalEl.querySelectorAll('.mobile-modal-item.checked').forEach(item => {
            item.classList.remove('checked');
        });
        updateMobileModalDoneCount();
    });
}

/**
 * モーダルを開く
 * @param {string} prefix 'create' | 'update'
 */
function openMobileModal(prefix) {
    ensureMobileModal();
    mobileModalCurrentPrefix = prefix;

    // bodyスクロールロック
    document.body.classList.add('modal-open');

    // 既存widgetの選択状態を取得
    const selectedIds = getMultiSelectValues(prefix);

    // モーダルリストを構築
    const listEl = mobileModalEl.querySelector('.mobile-modal-list');
    listEl.innerHTML = '';

    if (multiSelectMembers.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'mobile-modal-empty';
        emptyLi.textContent = 'メンバーがいません';
        listEl.appendChild(emptyLi);
    } else {
        multiSelectMembers.forEach(member => {
            const label = `${member.name} (${member.id})`;
            const li = document.createElement('li');
            li.className = 'mobile-modal-item';
            li.dataset.value = member.id;
            li.dataset.label = label;

            if (selectedIds.includes(String(member.id))) {
                li.classList.add('checked');
            }

            const checkDiv = document.createElement('div');
            checkDiv.className = 'mobile-modal-item-checkbox';
            checkDiv.textContent = '✓';

            const labelSpan = document.createElement('span');
            labelSpan.className = 'mobile-modal-item-label';
            labelSpan.textContent = label;

            li.appendChild(checkDiv);
            li.appendChild(labelSpan);

            // タップでトグル
            li.addEventListener('click', () => {
                li.classList.toggle('checked');
                updateMobileModalDoneCount();
            });

            listEl.appendChild(li);
        });
    }

    // 検索リセット
    const searchInput = mobileModalEl.querySelector('.mobile-modal-search-input');
    searchInput.value = '';

    // 完了ボタンのカウント更新
    updateMobileModalDoneCount();

    // モーダル表示
    mobileModalEl.classList.add('active');
}

/**
 * モーダルを閉じて選択状態をwidgetに反映
 * @param {boolean} save
 */
function closeMobileModal(save = false) {
    if (!mobileModalEl || !mobileModalCurrentPrefix) return;

    if (save) {
        // モーダル内の選択状態を収集
        const selectedIds = [];
        mobileModalEl.querySelectorAll('.mobile-modal-item.checked').forEach(item => {
            selectedIds.push(item.dataset.value);
        });

        // widgetに反映
        setMultiSelectValues(mobileModalCurrentPrefix, selectedIds);
    }

    // モーダルを閉じる
    mobileModalEl.classList.remove('active');

    // bodyスクロール復帰
    document.body.classList.remove('modal-open');

    mobileModalCurrentPrefix = null;
}

/**
 * 完了ボタンの選択人数表示を更新
 */
function updateMobileModalDoneCount() {
    if (!mobileModalEl) return;
    const count = mobileModalEl.querySelectorAll('.mobile-modal-item.checked').length;
    const doneBtn = mobileModalEl.querySelector('.mobile-modal-done');
    doneBtn.textContent = count > 0 ? `完了 (${count}名)` : '完了';
}

/**
 * カスタムウィジェットから選択されたID一覧を取得
 * @param {string} prefix
 * @returns {string[]}
 */
function getMultiSelectValues(prefix) {
    const list = document.getElementById(`${prefix}-participants-list`);
    if (!list) return [];
    return Array.from(list.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
}

/**
 * カスタムウィジェットに選択状態を設定
 * @param {string} prefix
 * @param {string[]} ids  選択するメンバー ID の配列
 */
function setMultiSelectValues(prefix, ids) {
    const list = document.getElementById(`${prefix}-participants-list`);
    if (!list) return;
    list.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = ids.includes(String(cb.value));
        const item = cb.closest('.multi-select-item');
        if (item) {
            item.classList.toggle('checked', cb.checked);
        }
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
