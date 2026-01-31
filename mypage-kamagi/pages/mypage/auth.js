/**
 * マイページの認証とコンテンツ表示
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
    const breadcrumbsDiv = document.getElementById('breadcrumbs');
    
    try {
        const data = await authService.checkStatus();
        
        // ローディング非表示
        loadingDiv.style.display = 'none';
        
        if (data.isLoggedIn) {
            // ログイン済み
            displayLoggedInContent(data.user);
        } else {
            // 未ログイン
            breadcrumbsDiv.style.display = 'none';
            notLoggedInDiv.style.display = 'block';
        }
        
    } catch (error) {
        console.error('ログイン状態の確認に失敗:', error);
        loadingDiv.style.display = 'none';
        breadcrumbsDiv.style.display = 'none';
        notLoggedInDiv.style.display = 'block';
    }
}

/**
 * ログイン済みコンテンツを表示
 * 
 * @param {Object} user ユーザー情報
 * @param {string} user.id ユーザーID
 * @param {string} user.name ユーザー名
 * @param {string} user.role ユーザー権限
 */
async function displayLoggedInContent(user) {
    const loggedInDiv = document.getElementById('logged-in-content');
    const userNameSpan = document.getElementById('user-name');

    if (user.role == '0') {
        document.getElementById('admin-menu').style.display = 'block';
    }
    
    // ユーザー名を表示
    userNameSpan.textContent = user.name;
    
    // コンテンツを表示
    loggedInDiv.style.display = 'block';

    // イベント一覧表示
    const events = await fetchEvents(user.id);
    diplayEvents(events);
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
            
            showToast('ログアウトしました', 'success');
            window.location.href = `/mypage-kamagi/pages/login/`;
            
        } catch (error) {
            console.error('ログアウトエラー:', error);
            showToast('ログアウト中にエラーが発生しました', 'error');
        }
    });
}
