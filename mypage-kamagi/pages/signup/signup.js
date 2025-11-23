/**
 * サインアップフォームのクライアント側ロジック（Service Layer使用）
 */

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const successMessageDiv = document.getElementById('success-message');
    const errorMessageDiv = document.getElementById('error-message');

    checkAdminUser(errorMessageDiv);

    signupForm.addEventListener('submit', async (e) => {
        // フォームのデフォルト動作を止める
        e.preventDefault();

        // メッセージをクリア
        successMessageDiv.style.display = 'none';
        successMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
        errorMessageDiv.textContent = '';

        // フォームデータを取得
        const userId = document.getElementById('user-id').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;

        try {
            const data = await authService.signUp(userId, password, name);

            successMessageDiv.textContent = data.message;
            successMessageDiv.style.display = 'block';

            // フォームをクリア
            signupForm.reset();

            // 3秒後にログインページにリダイレクト
            setTimeout(() => {
                window.location.href = '/EDTCHP/mypage-kamagi/pages/login/';
            }, 3000);

        } catch (error) {
            // サインアップ失敗
            console.error('サインアップエラー:', error);
            errorMessageDiv.textContent = error.message || '通信エラーが発生しました。もう一度お試しください。';
            errorMessageDiv.style.display = 'block';
        }
    });
});

async function checkAdminUser(dom) {
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
        dom.textContent = error.message || '通信エラーが発生しました。もう一度お試しください。';
        dom.style.display = 'block';
    }
}
