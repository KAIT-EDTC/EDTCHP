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

    const authData = await authService.checkStatus();

    if (authData.isLoggedIn && authData.user.role == '0') {
        document.body.style.display = 'block';
        // 管理者の場合はハンバーガーメニューの管理者リンクを表示
        const adminLink = document.getElementById('admin-link');
        if (adminLink) adminLink.style.display = 'block';
    } else {
        window.location.href = '/mypage-kamagi/pages/login/';
    }

    // 初期化: メンバー一覧とイベント一覧を取得
    await Promise.all([
        loadMembers(),
        loadEvents()
    ]);
    
    // フォームイベントの設定（各ファイルから読み込まれた関数を呼び出す）
    setupCreateForm();
    setupUpdateForm();
    setupDeleteForm();
});

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
    const createParticipants = document.getElementById('create-participants');
    const updateParticipants = document.getElementById('update-participants');
    
    // クリア
    createParticipants.innerHTML = '';
    updateParticipants.innerHTML = '';
    
    // メンバーをオプションとして追加
    membersCache.forEach(member => {
        const optionText = `${member.name} (${member.id})`;
        
        const createOption = document.createElement('option');
        createOption.value = member.id;
        createOption.textContent = optionText;
        createParticipants.appendChild(createOption);
        
        const updateOption = document.createElement('option');
        updateOption.value = member.id;
        updateOption.textContent = optionText;
        updateParticipants.appendChild(updateOption);
    });
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
