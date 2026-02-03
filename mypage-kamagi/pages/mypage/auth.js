/**
 * マイページの認証とコンテンツ表示
 */

// ページ読み込み時にログイン状態をチェック
document.addEventListener('DOMContentLoaded', async () => {
    await initializePage();
    setupLogoutButton();
});

/**
 * ページの初期化処理
 */
async function initializePage() {
    const loadingDiv = document.getElementById('loading');
    
    try {
        const authData = await checkLoginStatus();
        loadingDiv.style.display = 'none';
        
        if (authData.isLoggedIn) {
            displayLoggedInContent(authData.user);
        } else {
            displayNotLoggedInContent();
        }
    } catch (error) {
        console.error('ログイン状態の確認に失敗:', error);
        loadingDiv.style.display = 'none';
        displayNotLoggedInContent();
    }
}

/**
 * ログイン状態をAPIで確認
 * 
 * @returns {Promise<{isLoggedIn: boolean, user?: Object}>} 認証状態
 */
async function checkLoginStatus() {
    return await authService.checkStatus();
}

/**
 * 未ログイン状態のUIを表示
 */
function displayNotLoggedInContent() {
    const notLoggedInDiv = document.getElementById('not-logged-in');
    const breadcrumbsDiv = document.getElementById('breadcrumbs');
    
    breadcrumbsDiv.style.display = 'none';
    notLoggedInDiv.style.display = 'block';
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

    // 管理者権限の場合、管理者メニューとイベント管理を表示
    if (user.role == '0') {
        document.getElementById('admin-link').style.display = 'block';
        document.getElementById('event-manage-link').style.display = 'block';
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
        if (!confirm('ログアウトしますか？')) return;
        
        try {
            await authService.logout();
            
            showToast('ログアウトしました。', 'success');
            setTimeout(() => {
                window.location.href = `/mypage-kamagi/pages/login/`;
            }, 1500);
            
        } catch (error) {
            console.error('ログアウトエラー:', error);
            showToast('ログアウト中にエラーが発生しました', 'error');
        }
    });
}
