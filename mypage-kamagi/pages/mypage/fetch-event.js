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
            <td>${event.start} ~ ${event.end}</td>
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
        const response = await eventService.getEventsByUserId(userId);
        if (response.events) {
            return response.events;
        }
        return null;
    } catch (error) {
        console.error('Error fetching events:', error);
        return null;
    }
}

function composeParticipants(participants) {
    if (!participants || participants.length === 0) return '全員';
    return participants.map(participant => participant.name).join(', ');
}