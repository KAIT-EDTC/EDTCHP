/**
 * イベント作成機能
 */

/**
 * 作成フォームのセットアップ
 */
function setupCreateForm() {
    const createForm = document.getElementById('create-event-form');
    
    if (!createForm) {
        console.error('event-create: DOM要素が見つかりません。');
        return;
    }
    
    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = createForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = '作成中...';

        try {
            const formValues = getCreateFormValues();
            
            // バリデーション
            if (!validateEventDateTime(formValues.startTime, formValues.endTime)) {
                return;
            }

            await createEvent(formValues);
            createForm.reset();
            await loadEvents();
            
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'イベントを作成';
        }
    });
}

/**
 * 作成フォームから値を取得
 * @returns {Object} フォームの値
 */
function getCreateFormValues() {
    const participantsSelect = document.getElementById('create-participants');
    
    return {
        title: document.getElementById('create-title').value,
        description: document.getElementById('create-description').value,
        visibility: document.getElementById('create-visibility').value,
        startTime: document.getElementById('create-start-time').value,
        endTime: document.getElementById('create-end-time').value,
        participantIds: Array.from(participantsSelect.selectedOptions).map(opt => opt.value)
    };
}

/**
 * イベント作成処理
 * @param {Object} formValues フォームの値
 */
async function createEvent(formValues) {
    const { title, description, visibility, startTime, endTime, participantIds } = formValues;
    
    await eventService.createEvent(
        title, 
        description, 
        visibility, 
        startTime, 
        endTime,
        participantIds
    );
    
    showToast('イベントを作成しました', 'success');
}
