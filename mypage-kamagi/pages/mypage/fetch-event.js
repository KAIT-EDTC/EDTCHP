/**
 * マイページにイベント一覧を表示する
 * auth.jsの読み込み後に呼び出される
 */

function diplayEvents(events) {
    const eventListTable = document.getElementById('event-list-table');
    const eventList = document.getElementById('event-list');
    const noEvents = document.getElementById('no-events');

    if (!events) {
        // イベントデータが存在しないことを伝える。
        noEvents.style.display = 'block';
        return;
    }
    
    eventListTable.style.display = 'block';
    eventList.innerHTML = '';
    events.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.title}</td>
            <td>${formatEventDate(event.start)} ~ ${formatEventDate(event.end)}</td>
            <td>${event.description}</td>
            <td>${composeParticipants(event.participants)}</td>
        `;
        eventList.appendChild(row);
    });
}

/**
 * APIからユーザーに紐づくイベント一覧を取得して表示する
 * 
 * @param {string} userId 
 */
async function fetchEvents(userId) {
    try {
        const response = await eventService.getEvents({ userId: userId });
        if (!response.events) return null;
        return response.events;
    } catch (error) {
        console.error('Error fetching events:', error);
        return null;
    }
}

function composeParticipants(participants) {
    if (!participants || participants.length === 0) return '全員';
    return participants.map(participant => participant.name).join(', ');
}

/**
 * 日時をyyyy/mm/dd (曜日)形式にフォーマット
 * @param {string} dateStr 日時文字列
 * @returns {string} フォーマットされた日時
 */
function formatEventDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${year}/${month}/${day} (${weekday})`;
}
