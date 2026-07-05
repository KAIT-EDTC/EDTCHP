/**
 * マイページのコンテンツ表示
 *
 * 認証・認可チェックは lib/auth.js が担当。
 * authReady 完了後に window.currentUser を利用してUIを構築する。
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 認可チェックを待つ(window.currentUser がセットされるのを待つ)
    await window.authReady;

    const user = window.currentUser;
    document.getElementById('user-name').textContent = user.name;

    const events = await fetchEvents(user.id);
    displayEvents(events);
});


/**
 * APIからユーザーに紐づくイベント一覧を取得して表示する
 * 
 * @param {string} userId 
 */
async function fetchEvents(userId) {
    try {
        const todayStart = getToday();
        const response = await eventService.getEvents({ userId: userId, startDate: todayStart });
        if (!response.events) return null;
        return response.events;
    } catch (error) {
        console.error('Error fetching events:', error);
        return null;
    }
}

/**
 * イベントデータを受け取り、イベントカードを生成して表示する
 * 
 * @param {Object[]} events イベントデータの配列
 * @param {string} events[].id イベントID
 * @param {string} events[].title イベントタイトル
 * @param {string} events[].start イベント開始日時
 * @param {string} events[].end イベント終了日時
 * @param {string} events[].description イベント説明（任意）
 * @param {string} events[].visibility イベントの公開範囲（"public", "private"）
 * @param {Object[]} events[].participants 参加者情報の配列
 * @param {string} events[].participants[].id 参加者ID
 * @param {string} events[].participants[].name 参加者名
 */
function displayEvents(events) {
    const eventList = document.getElementById('event-list');
    const noEvents = document.getElementById('no-events');

    if (!events || events.length === 0) {
        noEvents.style.display = 'block';
        eventList.style.display = 'none';
        return;
    }
    
    noEvents.style.display = 'none';
    eventList.style.display = 'grid';
    const fragment = document.createDocumentFragment();
    events.forEach(event => {
        fragment.appendChild(createEventCard(event));
    });
    eventList.replaceChildren(fragment);
}
