/**
 * ログインフォーム
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('btn-login');
    
    loginForm.addEventListener('submit', async (e) => {
        // 画面遷移をキャンセル
        e.preventDefault();

        // ボタンをローディング状態に変更
        loginBtn.disabled = true;
        loginBtn.value = 'ログイン中...';
        loginBtn.style.opacity = '0.7';
        loginBtn.style.cursor = 'wait';

        const userId = document.getElementById('student-id').value;
        const password = document.getElementById('passwd').value;
        
        try {
            await authService.login(userId, password);

            showToast('ログインに成功しました！', 'success');
            
            // 少し待ってからリダイレクト（トーストを見せるため）
            setTimeout(() => {
                window.location.href = `/mypage-kamagi/pages/mypage/`;
            }, 1500);
        } catch (error) {
            showToast(error.message || '通信エラーが発生しました。', 'error');
        } finally {
            loginBtn.disabled = false;
            loginBtn.value = 'ログイン';
            loginBtn.style.opacity = '1';
            loginBtn.style.cursor = 'pointer';
        }
    });
});
