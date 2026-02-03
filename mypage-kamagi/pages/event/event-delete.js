/**
 * イベント削除機能
 */

/**
 * 削除警告の表示/非表示
 * @param {boolean} show 表示するか
 */
function toggleDeleteWarning(show) {
    const deleteWarning = document.getElementById('delete-warning');
    deleteWarning.style.display = show ? 'block' : 'none';
}

/**
 * 削除確認ダイアログ
 * @param {string} googleEventId イベントID
 * @returns {boolean} 削除を確認したか
 */
function confirmDeleteEvent(googleEventId) {
    const selectedEvent = eventsCache.find(ev => ev.id === googleEventId);
    // タイトルは必須なのでフォールバックしなくてもいいかも
    const eventTitle = selectedEvent ? selectedEvent.title : 'このイベント';
    
    return confirm(`「${eventTitle}」を削除してもよろしいですか？\nこの操作は取り消せません。`);
}

/**
 * イベント削除処理
 * @param {string} googleEventId イベントID
 */
async function deleteEvent(googleEventId) {
    await eventService.deleteEvent(googleEventId);
    showToast('イベントを削除しました', 'success');
}

/**
 * 削除フォームのセットアップ
 */
function setupDeleteForm() {
    const deleteSelect = document.getElementById('delete-event-select');
    const deleteForm = document.getElementById('delete-event-form');
    const deleteWarning = document.getElementById('delete-warning');
    
    if (!deleteSelect || !deleteForm || !deleteWarning) {
        console.error('event-delete: DOM要素が見つかりません。');
        return;
    }
    
    // イベント選択時に警告を表示
    deleteSelect.addEventListener('change', () => {
        toggleDeleteWarning(!!deleteSelect.value);
    });
    
    // 削除フォーム送信
    deleteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const googleEventId = deleteSelect.value;
        
        if (!googleEventId) {
            showToast('削除するイベントを選択してください', 'error');
            return;
        }
        
        // 確認ダイアログ
        if (!confirmDeleteEvent(googleEventId)) {
            return;
        }
        
        const submitBtn = deleteForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = '削除中...';

        try {
            await deleteEvent(googleEventId);
            await loadEvents();
            
            // セレクトをリセット
            deleteSelect.value = '';
            toggleDeleteWarning(false);
            
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'イベントを削除';
        }
    });
}
