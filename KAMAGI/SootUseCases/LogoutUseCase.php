<?php 

namespace KAMAGI\SootUseCases;

/**
 * ログアウトユースケース
 * 
 * ログアウト処理のビジネスロジックを担当
 */
class LogoutUseCase {
    /**
     * ログアウト処理を実行
     * 
     * @return array{success: bool, message: string}
     */
    public function execute(): array {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params['path'], $params['domain'],
                $params['secure'], $params['httponly']
            );
        }

        session_destroy();

        return [
            'success' => true,
            'message' => 'ログアウトしました',
        ];
    }
}
