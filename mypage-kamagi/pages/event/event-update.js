/**
 * イベント更新機能
 */

/**
 * 更新フォームをクリア
 */
function clearUpdateForm() {
    document.getElementById('update-event-id').value = '';
    document.getElementById('update-title').value = '';
    document.getElementById('update-description').value = '';
    document.getElementById('update-start-time').value = '';
    document.getElementById('update-end-time').value = '';
    document.getElementById('update-visibility').value = 'public';
    resetMultiSelect('update');
}

/**
 * イベントデータを更新フォームに設定
 * @param {Object} event イベントデータ
 */
function populateUpdateForm(event) {
    document.getElementById('update-event-id').value = event.id;
    document.getElementById('update-title').value = event.title || '';
    document.getElementById('update-description').value = event.description || '';
    document.getElementById('update-start-time').value = formatForDateTimeLocal(event.start);
    document.getElementById('update-end-time').value = formatForDateTimeLocal(event.end);
    document.getElementById('update-visibility').value = event.visibility || 'public';
    
    // 参加者を選択状態にする
    const participantIds = (event.participants || []).map(p => String(p.id));
    setMultiSelectValues('update', participantIds);
}

/**
 * 更新フォームから値を取得
 * @returns {Object} フォームの値
 */
function getUpdateFormValues() {
    return {
        googleEventId: document.getElementById('update-event-id').value,
        title: document.getElementById('update-title').value,
        description: document.getElementById('update-description').value,
        visibility: document.getElementById('update-visibility').value,
        startTime: document.getElementById('update-start-time').value,
        endTime: document.getElementById('update-end-time').value,
        participantIds: getMultiSelectValues('update')
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
    const updateForm = document.getElementById('update-event-form');
    const selectedId = updateSelect.value;
    
    // 何も選択していない場合はクリア＆非表示
    if (!selectedId) {
        clearUpdateForm();
        updateForm.classList.remove('visible');
        return;
    }
    
    const event = eventsCache.find(e => e.id === selectedId);
    if (event) {
        populateUpdateForm(event);
        updateForm.classList.add('visible');
    }
}

/**
 * 更新フォームのセットアップ
 */
function setupUpdateForm() {
    const updateSelect = document.getElementById('update-event-select');
    const updateForm   = document.getElementById('update-event-form');
    
    if (!updateSelect || !updateForm) {
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
            updateForm.classList.remove('visible');
            
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '変更を保存';
        }
    });
}
