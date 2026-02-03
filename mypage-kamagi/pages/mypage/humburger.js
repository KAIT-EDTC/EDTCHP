/**
 * ハンバーガーメニューを外側クリックで閉じる
 */
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    document.addEventListener('click', (event) => {
        // メニューが開いている場合のみ処理
        if (!menuToggle.checked) return;
        
        // クリックされた要素がハンバーガーメニュー内かチェック
        if (!hamburgerMenu.contains(event.target)) {
            menuToggle.checked = false;
        }
    });
});
