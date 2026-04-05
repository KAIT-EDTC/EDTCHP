document.addEventListener('DOMContentLoaded', async () => {
    const updateForm = document.getElementById('update-form');
    
    updateForm.addEventListener('submit', async (e) => {
        // 画面遷移をキャンセル
        e.preventDefault();

        const userId = document.getElementById('update-user-id').value;
        const password = document.getElementById('update-password').value;
        const name = document.getElementById('update-name').value;

        const roleSelect = document.getElementById('update-role');

        try {
            await authService.updateUser(userId, password, name, roleSelect.selectedIndex);
            updateForm.reset();
            showToast('ユーザー情報を更新しました。', 'success');
        } catch (error) {
            showToast(error.message || '通信エラーが発生しました。', 'error');
        }
    })
});
