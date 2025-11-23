/**
 * ログインフォームのクライアント側ロジック（Service Layer使用）
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');
    
    loginForm.addEventListener('submit', async (e) => {
        // フォームのデフォルト動作（ページ遷移）を止める
        e.preventDefault();
        
        // エラーメッセージをクリア
        errorMessageDiv.style.display = 'none';
        errorMessageDiv.textContent = '';
        
        // フォームデータを取得
        const userId = document.getElementById('student-id').value;
        const password = document.getElementById('passwd').value;
        
        try {
            // AuthServiceを使ってログイン処理
            await authService.login(userId, password);
            
            // ログイン成功
            alert('ログインに成功しました！');
            window.location.href = '/EDTCHP/mypage-kamagi/pages/mypage/';
            
        } catch (error) {
            errorMessageDiv.textContent = error.message || '通信エラーが発生しました。もう一度お試しください。';
            errorMessageDiv.style.display = 'block';
        }
    });
});
