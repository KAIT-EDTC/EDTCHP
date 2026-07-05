/**
 * 共通のユーティリティ関数（ヘルパー関数）
 */

/**
 * トースト通知を表示する関数
 * @param {string} message 表示するメッセージ
 * @param {string} type 通知のタイプ ('success' | 'error' | 'info')
 */
function showToast(message, type = 'info') {
    // 既存のトーストがあれば削除（重ならないように）
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // アニメーション用に少し遅らせてクラスを追加
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // 3秒後に消える
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 3000);
}
