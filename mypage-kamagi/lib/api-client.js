/**
 * 汎用APIクライアント
 * 
 * fetch APIをラップして、共通の設定とエラーハンドリングを提供
 */
class ApiClient {
    /**
     * @param {string} baseUrl APIのベースURL
     */
    constructor(baseUrl) {
        if (baseUrl) {
            this.baseUrl = baseUrl;
        } else {
            this.baseUrl = `/KAMAGI/api`;
        }
    }

    /**
     * 汎用リクエストメソッド
     * 
     * @param {string} endpoint APIエンドポイント（例: '/login.php'）
     * @param {Object} options リクエストオプション
     * @param {string} options.method HTTPメソッド
     * @param {Object} options.body リクエストボディ
     * @param {Object} options.headers 追加のヘッダー
     * @param {boolean} options.throwOnError エラー時に例外を投げるか（デフォルト: true）
     * @returns {Promise<Object>} レスポンスのJSONデータ
     * @throws {Error} リクエスト失敗時、またはAPI側でsuccess=falseの場合
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;

        // デフォルト設定とユーザー指定のオプションをマージ
        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include', // セッションクッキーを送受信
            ...options,
        };

        // bodyがある場合はJSON文字列に変換
        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            // 既知のエラーでもview側でエラーを捕捉できるようにThrowする。
            // optionで無効に可能。
            if (!data.success && options.throwOnError !== false) {
                throw new Error(data.message || 'リクエストに失敗しました');
            }

            return data;

        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error.message);
            throw error;
        }
    }

    /**
     * GETリクエスト
     * 
     * @param {string} endpoint APIエンドポイント
     * @param {Object} options リクエストオプション
     * @returns {Promise<Object>}
     */
    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    /**
     * POSTリクエスト
     * 
     * @param {string} endpoint APIエンドポイント
     * @param {Object} body リクエストボディ
     * @param {Object} options リクエストオプション
     * @returns {Promise<Object>}
     */
    post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    }

    /**
     * PUTリクエスト
     * 
     * @param {string} endpoint APIエンドポイント
     * @param {Object} body リクエストボディ
     * @param {Object} options リクエストオプション
     * @returns {Promise<Object>}
     */
    put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    }

    /**
     * DELETEリクエスト
     * 
     * @param {string} endpoint APIエンドポイント
     * @param {Object} options リクエストオプション
     * @returns {Promise<Object>}
     */
    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

const apiClient = new ApiClient();
