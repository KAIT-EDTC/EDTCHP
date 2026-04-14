/**
 * マイページにイベント一覧を表示する
 * auth.jsの読み込み後に呼び出される
 */

function diplayEvents(events) {
    const eventListTable = document.getElementById('event-list-table');
    const eventList = document.getElementById('event-list');
    const noEvents = document.getElementById('no-events');

    if (!events || events.length === 0) {
        // イベントデータが存在しないことを伝える。
        noEvents.style.display = 'block';
        eventListTable.style.display = 'none';
        return;
    }
    
    noEvents.style.display = 'none';
    eventListTable.style.display = 'block';
    eventList.innerHTML = '';
    events.forEach(event => {
        const row = document.createElement('tr');
        const formatedDate = formatEventDate(event.start, event.end);
        row.innerHTML = `
            <td>${event.title}</td>
            <td>${formatedDate}</td>
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
 * 単日の場合は 「YYYY/MM/DD(曜日): hh:mm 〜 hh:mm」 にフォーマットする。
 * 複数日の場合は 「YYYY/MM/DD 〜 YYYY/MM/DD」 にフォーマットする。(現状は時間表示なし)
 * @param {string} start 日時文字列
 * @param {string} end 日時文字列
 * @returns {string} フォーマットされた日時
 */
function formatEventDate(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (!startDate || !endDate) return '';
    const diffDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    if (diffDays >= 1) {
        return `${formatDate(startDate)} 〜 ${formatDate(endDate)}`;
    } else {
        const startTime = formatDateTime(startDate);
        const endTime = formatDateTime(endDate);
        return `${formatDate(startDate)}: ${startTime} 〜 ${endTime}`;
    }
}

/**
 * 日付を「YYYY/MM/DD(曜日)」の形式にフォーマットする
 * @param {Date} date 
 * @returns {string} フォーマットされた日付文字列
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${year}/${month}/${day} (${weekday})`;
}

/**
 * 時間を「hh:mm」の形式にフォーマットする
 * @param {Date} date 
 * @returns {string} フォーマットされた時間文字列「hh:mm」
 */
function formatDateTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
