/**
 * ログインフォーム
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', async (e) => {
        // 画面遷移をキャンセル
        e.preventDefault();
        
        const userId = document.getElementById('student-id').value;
        const password = document.getElementById('passwd').value;
        
        try {
            await authService.login(userId, password);
            
            showToast('ログインに成功しました！', 'success');
            
            // 少し待ってからリダイレクト（トーストを見せるため）
            setTimeout(() => {
                window.location.href = '/EDTCHP/mypage-kamagi/pages/mypage/';
            }, 1500);
        } catch (error) {
            showToast(error.message || '通信エラーが発生しました。', 'error');
        }
    });
});
