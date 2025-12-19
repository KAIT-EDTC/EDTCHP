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
     * ユーザーIDから参加者を含めたイベントを取得
     * 
     * @param {string} userId 
     * @returns {Promise<Object>} {success: bool, message?: string, events?: array}
     */
    async getEventsByUserId(userId) {
        return this.api.post('/user-events.php', {
            user_id: userId
        });
    }

    /**
     * イベント作成
     * 
     * @param {string} title イベントタイトル
     * @param {string} description イベント説明
     * @param {string} visibility イベント公開範囲(private:指定されたユーザーのみ, public:公開)
     * @param {string} start_time イベント開始日時
     * @param {string} end_time イベント終了日時
     * @returns {Promise<Object>} {success: bool, message?: string, event?: object}
     */
    async createEvent(title, description, visibility, start_time, end_time) {
        return this.api.post('/create-event.php', {
            title,
            description,
            visibility,
            start_time,
            end_time
        });
    }
}

// インスタンス化しなくても使えるようにする
// ex. eventService.method(...);
const eventService = new EventService(apiClient);