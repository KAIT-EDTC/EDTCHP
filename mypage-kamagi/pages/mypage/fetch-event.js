/**
 * イベント表示に関するユーティリティ関数
 */

/** イベントカードを作成する */
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'event-card-header';

    const title = document.createElement('span');
    title.className = 'event-title';
    title.textContent = event.title || '';
    cardHeader.appendChild(title);

    const cardBody = document.createElement('div');
    cardBody.className = 'event-card-body';

    const formattedDate = formatEventDate(event.start, event.end);
    const participants = composeParticipants(event.participants);
    cardBody.appendChild(createEventMeta(formattedDate, participants));

    if (event.description) {
        cardBody.appendChild(createDescriptionElement(event.description));
    }

    card.append(cardHeader, cardBody);
    return card;
}

/** イベントのメタ情報（日時と参加者）を作成する */
function createEventMeta(formattedDate, participants) {
    const meta = document.createElement('div');
    meta.className = 'event-meta';

    const dateLabel = createIconText('event-date', 'fa fa-calendar', formattedDate);
    const participantsLabel = createIconText('event-participants', 'fa fa-users', participants);

    meta.append(dateLabel, participantsLabel);
    return meta;
}

/** イベントの日時と参加者情報をアイコン付きで表示する要素を作成する */
function createIconText(labelClassName, iconClassName, text) {
    const label = document.createElement('span');
    label.className = labelClassName;

    const icon = document.createElement('i');
    icon.className = iconClassName;

    label.append(icon, document.createTextNode(` ${text || ''}`));
    return label;
}


/**
 * 参加者情報の配列を受け取り、参加者名をカンマ区切りで連結した文字列を返す
 * 
 * @param {Object[]} participants 
 * @param {string} participants[].id 参加者ID
 * @param {string} participants[].name 参加者名
 * @returns {string} 参加者名の文字列
 */
function composeParticipants(participants) {
    // participants:[]のときは全員とする
    if (!participants || participants.length === 0) return '全員';
    const names = participants
        .map(participant => (participant && participant.name ? String(participant.name) : ''))
        .filter(name => name.length > 0);
    // participants:[{id: '11111111, name: ''}]みたいなときは不正
    return names.length > 0 ? names.join(', ') : '正しく参加者情報が取得できませんでした';
}

function createDescriptionElement(description) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'イベント詳細を確認する';
    details.appendChild(summary);

    const lines = String(description).split(/\r?\n/);
    lines.forEach((line, index) => {
        if (index > 0) details.appendChild(document.createElement('br'));
        details.appendChild(document.createTextNode(line));
    });

    return details;
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
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return '';
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
