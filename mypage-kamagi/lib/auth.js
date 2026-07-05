/**
 * 認可ガード
 *
 * パスベースのルート定義に基づき、ページ読み込み時に自動で認証・認可チェックを行う。
 * 認可通過後、window.currentUser にユーザー情報をセットし、
 * window.authReady (Promise) を resolve する。
 *
 * 後続スクリプトでユーザー情報が必要な場合:
 *   await window.authReady;
 *   console.log(window.currentUser); // { id, name, role }
 */

/**
 * ルートごとの認可要件
 *
 * auth: true  → ログイン必須
 * auth: false → 認証不要
 * roles: 許可するロール値の配列（省略時はログイン済みなら全ロール許可）
 * redirect: 認可失敗時のリダイレクト先（省略時はログインページ）
 */
const AUTH_ROUTES = [
    { path: '/mypage-kamagi/pages/login/',  auth: false },
    { path: '/mypage-kamagi/pages/app/',    auth: true },
    { path: '/mypage-kamagi/pages/mypage/', auth: true },
    { path: '/mypage-kamagi/pages/admin/',  auth: true,  roles: ['0'] },
    { path: '/mypage-kamagi/pages/event/',  auth: true,  roles: ['0'] },
];

const LOGIN_URL = '/mypage-kamagi/pages/login/';
const MYPAGE_URL = '/mypage-kamagi/pages/mypage/';

/**
 * 現在のパスに一致するルート定義を返す
 */
function matchRoute(pathname) {
    return AUTH_ROUTES.find(route => pathname.startsWith(route.path)) || null;
}

// --- グローバル公開 ---
// ベストプラクティスではない気がするが、mypageのgreetingでユーザー名とかを使うので開発コスト優先で実装
window.currentUser = null;

let _resolveAuthReady;
window.authReady = new Promise(resolve => {
    _resolveAuthReady = resolve;
});

/**
 * 認可ガード本体
 */
async function authGuard() {
    const route = matchRoute(location.pathname);

    // ルート定義なし
    if (!route) {
        document.body.style.display = '';
        _resolveAuthReady();
        return;
    }

    // 認証不要ページ(今はログインページのみ)
    if (!route.auth) {
        // ログイン済みならログインページからmypageへリダイレクト
        if (route.path === '/mypage-kamagi/pages/login/') {
            try {
                const data = await authService.checkStatus();
                if (data.isLoggedIn) {
                    window.location.href = MYPAGE_URL;
                    return;
                }
            } catch (error) {
                console.error('認証状態の確認に失敗:', error);
                showToast('認証に失敗しました。', 'error');
                setTimeout(() => {
                    window.location.href = LOGIN_URL;
                }, 3000);
            }
        }
        _resolveAuthReady();
        return;
    }

    // --- 認証必須ページ ---
    try {
        const data = await authService.checkStatus();

        if (!data.isLoggedIn) {
            window.location.href = route.redirect || LOGIN_URL;
            return;
        }

        // ロールチェック
        if (route.roles && !route.roles.includes(String(data.user.role))) {
            window.location.href = route.redirect || LOGIN_URL;
            return;
        }

        // 認可OK
        window.currentUser = data.user;
        document.body.style.display = '';
        _resolveAuthReady();
    } catch (error) {
        console.error('認可チェックに失敗:', error);
        showToast('認可チェックに失敗しました。ログインページにリダイレクトします。', 'error');
        setTimeout(() => {
            window.location.href = LOGIN_URL;
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', authGuard);
