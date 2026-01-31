/**
 * サインアップフォーム
 */

document.addEventListener('DOMContentLoaded', async () => {
    const signupForm = document.getElementById('signup-form');

    const isAdmin = await checkIsAdmin();

    if (isAdmin) {
        // 管理者の場合のみ画面を表示
        document.body.style.display = 'block';
    } else {
        // ログインしていない、もしくは管理者でなければ、ログインページにリダイレクト
        window.location.href = '/mypage-kamagi/pages/login/'; 
    }

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

async function checkIsAdmin() {
    try {
        const data = await authService.checkStatus();
        return (data.isLoggedIn && data.user.role == 0);
    } catch (error) {
        const errorMessage = error.message || '通信エラーが発生しました。';
        showToast(errorMessage, 'error');
        return false;
    }
}
