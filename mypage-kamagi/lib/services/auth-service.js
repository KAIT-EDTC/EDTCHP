/**
 * 認証サービス
 * 
 * 認証関連のAPI呼び出しをカプセル化
 */
class AuthService {
    /**
     * @param {ApiClient} apiClient APIクライアントインスタンス
     */
    constructor(apiClient) {
        this.api = apiClient;
    }

    /**
     * ログイン処理
     * 
     * @param {string} userId 学籍番号
     * @param {string} password パスワード
     * @returns {Promise<Object>} { success: boolean, message: string }
     * 
     * @example
     * const result = await authService.login('2424xxx', 'password123');
     * console.log(result.success); // true
     * console.log(result.message); // "ログインに成功しました。"
     */
    async login(userId, password) {
        return this.api.post('/login.php', {
            user_id: userId,
            password: password
        });
    }

    /**
     * サインアップ処理
     * 
     * @param {string} userId ユーザーID
     * @param {string} password パスワード
     * @param {string} name ユーザー名
     * @returns {Promise<Object>} { success: boolean, message: string }
     */
    async signUp(userId, password, name) {
        return this.api.post('/signUp.php', {
            user_id: userId,
            name: name,
            password: password,
        });
    }

    /**
     * ログイン状態チェック
     * 
     * @returns {Promise<Object>} { success: boolean, isLoggedIn: boolean, user?: Object }
     */
    async checkStatus() {
        return this.api.get('/check.php');
    }

    /**
     * ログアウト処理
     * 
     * @returns {Promise<Object>} { success: boolean, message: string }
     */
    async logout() {
        return this.api.post('/logout.php');
    }
}

// インスタンス化しなくても使えるようにする
// ex. authService.method(...);
const authService = new AuthService(apiClient);
