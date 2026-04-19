/**
 * ハンバーガーメニュー共通スクリプト
 * - DOM の動的生成（body 直下の先頭に挿入）
 * - ロールベースのリンク表示制御
 * - メニュー外クリックで閉じる
 * - ログアウト処理
 */

/**
 * メニューリンク定義
 * roles: 指定したロールのみ表示（省略で全ロール表示）
 * hideOn: 現在ページと一致したらリンクを生成しない
 * 
 * TODO: ロール管理はauth.jsのルート定義と統合したい。
 */
const MENU_LINKS = [
    {
        id: 'mypage-link',
        href: '/mypage-kamagi/pages/mypage/',
        icon: 'fa-home',
        label: 'マイページ',
        hideOn: ['/mypage-kamagi/pages/mypage/'],
    },
    {
        id: 'admin-link',
        href: '/mypage-kamagi/pages/admin/',
        icon: 'fa-cog',
        label: '管理者メニュー',
        roles: ['0'],
        hideOn: ['/mypage-kamagi/pages/admin/'],
    },
    {
        id: 'event-manage-link',
        href: '/mypage-kamagi/pages/event/',
        icon: 'fa-calendar',
        label: 'イベント管理',
        roles: ['0'],
        hideOn: ['/mypage-kamagi/pages/event/'],
    },
    {
        id: 'app-hub-link',
        href: '/mypage-kamagi/pages/app/',
        icon: 'fa-th',
        label: 'アプリハブ',
        hideOn: ['/mypage-kamagi/pages/app/'],
    },
    {
        id: 'logout-link',
        href: '#',
        icon: 'fa-sign-out',
        label: 'ログアウト',
        isLogout: true,
    },
];

/**
 * ハンバーガーメニューの DOM を生成して body 直下の先頭に挿入する
 */
function createHamburgerMenu() {
    const pathname = location.pathname;
    const wrapper = document.createElement('div');
    wrapper.className = 'hamburger-menu';

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = 'menu-toggle';
    wrapper.appendChild(toggle);

    const iconLabel = document.createElement('label');
    iconLabel.setAttribute('for', 'menu-toggle');
    iconLabel.className = 'menu-icon';
    for (let i = 0; i < 3; i++) {
        iconLabel.appendChild(document.createElement('span'));
    }
    wrapper.appendChild(iconLabel);

    const nav = document.createElement('nav');
    nav.className = 'menu-content';

    for (const link of MENU_LINKS) {
        if (link.hideOn && link.hideOn.some(p => pathname.startsWith(p))) continue;

        const a = document.createElement('a');
        a.href = link.href;
        a.id = link.id;

        const icon = document.createElement('i');
        icon.className = `fa ${link.icon}`;
        a.appendChild(icon);
        a.appendChild(document.createTextNode(` ${link.label}`));

        // ロール制限付きリンクは初期非表示
        if (link.roles) {
            a.style.display = 'none';
            a.dataset.roles = link.roles.join(',');
        }

        nav.appendChild(a);
    }

    wrapper.appendChild(nav);
    document.body.insertBefore(wrapper, document.body.firstChild);
    return { toggle, wrapper };
}

document.addEventListener('DOMContentLoaded', async () => {
    const { toggle, wrapper } = createHamburgerMenu();

    // authReady を待ってロール制限リンクの表示を制御
    if (window.authReady) {
        await window.authReady;
        if (window.currentUser) {
            const userRole = String(window.currentUser.role);
            wrapper.querySelectorAll('nav a[data-roles]').forEach(a => {
                const allowedRoles = a.dataset.roles.split(',');
                if (allowedRoles.includes(userRole)) {
                    a.style.display = '';
                }
            });
        }
    }

    // メニュー外クリックで閉じる
    document.addEventListener('click', (event) => {
        if (!toggle.checked) return;
        if (!wrapper.contains(event.target)) toggle.checked = false;
    });

    // ログアウトボタン
    const logoutBtn = document.getElementById('logout-link');
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
