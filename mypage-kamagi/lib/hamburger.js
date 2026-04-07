/**
 * ハンバーガーメニュー共通スクリプト
 * - メニュー外クリックで閉じる
 * - ログアウト処理
 */
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const hamburgerMenu = document.querySelector('.hamburger-menu');

    // メニュー外クリックで閉じる
    document.addEventListener('click', (event) => {
        if (!menuToggle.checked) return;

        if (!hamburgerMenu.contains(event.target)) {
            menuToggle.checked = false;
        }
    });

    // ログアウトボタン
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (!confirm('ログアウトしますか？')) return;

            try {
                await authService.logout();
                showToast('ログアウトしました。', 'success');
                setTimeout(() => {
                    window.location.href = '/mypage-kamagi/pages/login/';
                }, 1500);
            } catch (error) {
                console.error('ログアウトエラー:', error);
                showToast('ログアウト中にエラーが発生しました', 'error');
            }
        });
    }
});
