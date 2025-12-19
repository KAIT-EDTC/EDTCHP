/**
 * サインアップフォーム
 */

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');

    checkAdminUser();

    signupForm.addEventListener('submit', async (e) => {
        // 画面遷移をキャンセル
        e.preventDefault();

        const userId = document.getElementById('user-id').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;

        try {
            const data = await authService.signUp(userId, password, name);

            showToast(data.message + '3秒後にログインページにリダイレクトします。', 'success');

            // フォームをクリア
            signupForm.reset();

            // 3秒後にログインページにリダイレクト
            setTimeout(() => {
                window.location.href = '/EDTCHP/mypage-kamagi/pages/login/';
            }, 3000);

        } catch (error) {
            // サインアップ失敗
            console.error('サインアップエラー:', error);
            const errorMessage = error.message || '通信エラーが発生しました。';
            showToast(errorMessage, 'error');
        }
    });
});

async function checkAdminUser() {
    try {
        const data = await authService.checkStatus();
        // ログインしていない、もしくは管理者でなければ、ログインページにリダイレクト
        if (!data.isLoggedIn || data.user.role == 1) {
            window.location.href = '/EDTCHP/mypage-kamagi/pages/login/';
        } else {
            // 管理者の場合のみ画面を表示
            document.body.style.display = 'block';
        }
    } catch (error) {
        const errorMessage = error.message || '通信エラーが発生しました。';
        showToast(errorMessage, 'error');
    }
}
