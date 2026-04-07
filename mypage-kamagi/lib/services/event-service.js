/**
 * イベントサービス
 * 
 * イベント関連のAPI呼び出しをカプセル化
 */

class EventService {
    /**
     * @param {ApiClient} apiClient APIクライアントインスタンス
     */
    constructor(apiClient) {
        this.api = apiClient;
    }

    /**
     * フィルター条件付きでイベントを取得
     * 
     * @param {Object} filters フィルター条件
     * @param {string} [filters.userId] ユーザーID（参加者またはpublic）
     * @param {string} [filters.title] タイトル（部分一致）
     * @param {string} [filters.description] 説明（部分一致）
     * @param {string} [filters.startDate] 開始日（以降）
     * @param {string} [filters.endDate] 終了日（以前）
     * @param {string} [filters.visibility] 公開範囲（'private' | 'public'）
     * @returns {Promise<Object>} {success: bool, message?: string, events?: array}
     */
    async getEvents(filters = {}) {
        const params = new URLSearchParams();

        if (filters.userId) {
            params.append('user_id', filters.userId);
        }
        if (filters.title) {
            params.append('title', filters.title);
        }
        if (filters.description) {
            params.append('description', filters.description);
        }
        if (filters.startDate) {
            params.append('start_date', filters.startDate);
        }
        if (filters.endDate) {
            params.append('end_date', filters.endDate);
        }
        if (filters.visibility) {
            params.append('visibility', filters.visibility);
        }

        const queryString = params.toString();
        return this.api.get('/events.php' + (queryString ? '?' + queryString : ''));
    }

    /**
     * イベント作成
     * 
     * @param {string} title イベントタイトル
     * @param {string} description イベント説明
     * @param {string} visibility イベント公開範囲(private:指定されたユーザーのみ, public:公開)
     * @param {string} startTime イベント開始日時
     * @param {string} endTime イベント終了日時
     * @param {string[]} [participantIds] 参加者の学籍番号配列（オプション）
     * @returns {Promise<Object>} {success: bool, message?: string, google_event_id?: string, participants?: array}
     * 
     * @example
     * // 参加者なしで作成
     * const result = await eventService.createEvent(
     *   '定例ミーティング', 'チーム会議', 'public',
     *   '2025-12-22 10:00:00', '2025-12-22 11:00:00'
     * );
     * 
     * @example
     * // 参加者ありで作成
     * const result = await eventService.createEvent(
     *   '定例ミーティング', 'チーム会議', 'public',
     *   '2025-12-22 10:00:00', '2025-12-22 11:00:00',
     *   ['2424013', '2424000']
     * );
     */
    async createEvent(title, description, visibility, startTime, endTime, participantIds = []) {
        const body = {
            title,
            description,
            visibility,
            start_time: startTime,
            end_time: endTime
        };

        if (participantIds && participantIds.length > 0) {
            body.participant_ids = participantIds;
        }

        return this.api.post('/events.php', body);
    }

    /**
     * イベント更新
     * 
     * @param {string} googleEventId GoogleカレンダーのイベントID
     * @param {string} title イベントタイトル
     * @param {string} description イベント説明
     * @param {string} visibility イベント公開範囲(private:指定されたユーザーのみ, public:公開)
     * @param {string} startTime イベント開始日時
     * @param {string} endTime イベント終了日時
     * @param {string[]} [participantIds] 参加者の学籍番号配列（オプション、空配列で参加者クリア）
     * @returns {Promise<Object>} {success: bool, message?: string, google_event_id?: string, participants?: array}
     * 
     * @example
     * const result = await eventService.updateEvent(
     *   'abc123xyz',
     *   '更新後のタイトル', '更新後の説明', 'public',
     *   '2025-12-22 14:00:00', '2025-12-22 15:00:00',
     *   ['2424013']
     * );
     */
    async updateEvent(googleEventId, title, description, visibility, startTime, endTime, participantIds = []) {
        return this.api.put('/events.php', {
            google_event_id: googleEventId,
            title,
            description,
            visibility,
            start_time: startTime,
            end_time: endTime,
            participant_ids: participantIds
        });
    }

    /**
     * イベント削除
     * 
     * @param {string} googleEventId GoogleカレンダーのイベントID
     * @returns {Promise<Object>} {success: bool, message?: string}
     * 
     * @example
     * const result = await eventService.deleteEvent('abc123xyz');
     * if (result.success) {
     *   console.log('イベントを削除しました');
     * }
     */
    async deleteEvent(googleEventId) {
        return this.api.request('/events.php', {
            method: 'DELETE',
            body: { google_event_id: googleEventId }
        });
    }
}

// インスタンス化しなくても使えるようにする
// ex. eventService.method(...);
const eventService = new EventService(apiClient);
