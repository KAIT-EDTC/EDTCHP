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
            showToast('ユーザー情報を更新しました。', 'success');
            updateForm.reset();
        } catch (error) {
            showToast('ユーザー情報の更新に失敗しました。', 'error');
        }
    })
});
