/**
 * 認証状態の初期化
 * ログイン状態を確認し、未ログインならログインページにリダイレクトする。
 * 管理者ロールの場合は管理者リンクを表示する。
 */
async function initializeAuthState() {
    try {
        const authData = await authService.checkStatus();
        if (!authData.isLoggedIn) {
            window.location.href = "/mypage-kamagi/pages/login/";
            return;
        }

        if (authData.user && String(authData.user.role) === "0") {
            const adminLink = document.getElementById("admin-link");
            if (adminLink) {
                adminLink.style.display = "block";
            }
        }

        document.body.style.display = "block";
    } catch (error) {
        console.error("認証確認エラー:", error);
        showToast("認証確認に失敗しました。ログインし直してください。", "error");
        window.location.href = "/mypage-kamagi/pages/login/";
    }
}
