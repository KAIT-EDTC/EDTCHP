/**
 * マイページのクライアント側ロジック（Service Layer使用）
 */

// ページ読み込み時にログイン状態をチェック
document.addEventListener('DOMContentLoaded', async () => {
    await checkLoginStatus();
    setupLogoutButton();
});

/**
 * ログイン状態をAPIで確認
 */
async function checkLoginStatus() {
    const loadingDiv = document.getElementById('loading');
    const notLoggedInDiv = document.getElementById('not-logged-in');
    const loggedInDiv = document.getElementById('logged-in-content');
    
    try {
        const data = await authService.checkStatus();
        
        // ローディング非表示
        loadingDiv.style.display = 'none';
        
        if (data.isLoggedIn) {
            // ログイン済み
            displayLoggedInContent(data.user);
        } else {
            // 未ログイン
            notLoggedInDiv.style.display = 'block';
        }
        
    } catch (error) {
        console.error('ログイン状態の確認に失敗:', error);
        loadingDiv.style.display = 'none';
        notLoggedInDiv.style.display = 'block';
    }
}

/**
 * ログイン済みコンテンツを表示
 * 
 * @param {Object} user - ユーザー情報
 * @param {string} user.id - ユーザーID
 * @param {string} user.name - ユーザー名
 */
function displayLoggedInContent(user) {
    const loggedInDiv = document.getElementById('logged-in-content');
    const userNameSpan = document.getElementById('user-name');
    
    // ユーザー名を表示
    userNameSpan.textContent = user.name;
    
    // コンテンツを表示
    loggedInDiv.style.display = 'block';
}

/**
 * ログアウトボタンのイベント設定
 */
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    
    logoutBtn.addEventListener('click', async () => {
        if (!confirm('ログアウトしますか？')) {
            return;
        }
        
        try {
            await authService.logout();
            
            alert('ログアウトしました');
            window.location.href = '/EDTCHP/mypage-kamagi/pages/login/';
            
        } catch (error) {
            console.error('ログアウトエラー:', error);
            alert('ログアウト中にエラーが発生しました');
        }
    });
}
