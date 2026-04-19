/**
 * マイページのコンテンツ表示
 *
 * 認証・認可チェックは lib/auth.js が担当。
 * authReady 完了後に window.currentUser を利用してUIを構築する。
 */

document.addEventListener('DOMContentLoaded', async () => {
    await window.authReady;

    const user = window.currentUser;
    document.getElementById('user-name').textContent = user.name;

    const events = await fetchEvents(user.id);
    diplayEvents(events);
});


