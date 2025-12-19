/**
 * イベントフォーム
 */
document.addEventListener('DOMContentLoaded', () => {
    const createForm = document.getElementById('create-event-form');
    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('create-title').value;
        const description = document.getElementById('create-description').value;
        const visibility = document.getElementById('create-visibility').value;
        const start_time = document.getElementById('create-start-time').value;
        const end_time = document.getElementById('create-end-time').value;

        try {
            await eventService.createEvent(title, description, visibility, start_time, end_time);
            showToast('イベントを作成しました', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
});