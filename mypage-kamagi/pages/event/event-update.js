/**
 * イベント更新機能
 */

/**
 * 更新フォームをクリア
 */
function clearUpdateForm() {
    const updateParticipants = document.getElementById('update-participants');
    
    document.getElementById('update-event-id').value = '';
    document.getElementById('update-title').value = '';
    document.getElementById('update-description').value = '';
    document.getElementById('update-start-time').value = '';
    document.getElementById('update-end-time').value = '';
    document.getElementById('update-visibility').value = 'public';
    Array.from(updateParticipants.options).forEach(opt => opt.selected = false);
}

/**
 * イベントデータを更新フォームに設定
 * @param {Object} event イベントデータ
 */
function populateUpdateForm(event) {
    const updateParticipants = document.getElementById('update-participants');
    
    document.getElementById('update-event-id').value = event.id;
    document.getElementById('update-title').value = event.title || '';
    document.getElementById('update-description').value = event.description || '';
    document.getElementById('update-start-time').value = formatForDateTimeLocal(event.start);
    document.getElementById('update-end-time').value = formatForDateTimeLocal(event.end);
    document.getElementById('update-visibility').value = event.visibility || 'public';
    
    // 参加者を選択状態にする
    const participantIds = (event.participants || []).map(p => String(p.id));
    Array.from(updateParticipants.options).forEach(opt => {
        opt.selected = participantIds.includes(opt.value);
    });
}

/**
 * 更新フォームから値を取得
 * @returns {Object} フォームの値
 */
function getUpdateFormValues() {
    const updateParticipants = document.getElementById('update-participants');
    
    return {
        googleEventId: document.getElementById('update-event-id').value,
        title: document.getElementById('update-title').value,
        description: document.getElementById('update-description').value,
        visibility: document.getElementById('update-visibility').value,
        startTime: document.getElementById('update-start-time').value,
        endTime: document.getElementById('update-end-time').value,
        participantIds: Array.from(updateParticipants.selectedOptions).map(opt => opt.value)
    };
}

/**
 * イベント更新処理
 * @param {Object} formValues フォームの値
 */
async function updateEvent(formValues) {
    const { googleEventId, title, description, visibility, startTime, endTime, participantIds } = formValues;
    
    await eventService.updateEvent(
        googleEventId,
        title, 
        description, 
        visibility, 
        startTime, 
        endTime,
        participantIds
    );
    
    showToast('イベントを更新しました', 'success');
}

/**
 * イベント選択時の処理
 */
function handleUpdateEventSelect() {
    const updateSelect = document.getElementById('update-event-select');
    const selectedId = updateSelect.value;
    
    // 何も選択していない場合はクリア
    if (!selectedId) {
        clearUpdateForm();
        return;
    }
    
    const event = eventsCache.find(e => e.id === selectedId);
    if (event) {
        populateUpdateForm(event);
    }
}

/**
 * 更新フォームのセットアップ
 */
function setupUpdateForm() {
    const updateSelect = document.getElementById('update-event-select');
    const updateForm = document.getElementById('update-event-form');
    const updateParticipants = document.getElementById('update-participants');
    
    if (!updateSelect || !updateForm || !updateParticipants) {
        console.error('event-update: DOM要素が見つかりません。');
        return;
    }
    
    // イベント選択時にフォームに値を設定
    updateSelect.addEventListener('change', handleUpdateEventSelect);
    
    // 更新フォーム送信
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formValues = getUpdateFormValues();
        
        if (!formValues.googleEventId) {
            showToast('更新するイベントを選択してください', 'error');
            return;
        }
        
        const submitBtn = updateForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = '更新中...';

        try {
            // バリデーション
            if (!validateEventDateTime(formValues.startTime, formValues.endTime)) {
                return;
            }

            await updateEvent(formValues);
            await loadEvents();
            
            // セレクトをリセット
            updateSelect.value = '';
            clearUpdateForm();
            
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '変更を保存';
        }
    });
}
