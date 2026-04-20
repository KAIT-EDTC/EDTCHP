/**
 * サインアップフォーム
 */

document.addEventListener('DOMContentLoaded', async () => {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', async (e) => {
        // 画面遷移をキャンセル
        e.preventDefault();

        const userId = document.getElementById('user-id').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;

        try {
            const data = await authService.signUp(userId, password, name);
            showToast(data.message + '3秒後にログインページにリダイレクトします。', 'success');
            signupForm.reset(); // フォームをクリア
            // 3秒後にログインページにリダイレクト
            setTimeout(() => {
                window.location.href = `/mypage-kamagi/pages/login/`;
            }, 3000);

        } catch (error) {
            // サインアップ失敗
            console.error('サインアップエラー:', error);
            const errorMessage = error.message || '通信エラーが発生しました。';
            showToast(errorMessage, 'error');
        }
    });
});
