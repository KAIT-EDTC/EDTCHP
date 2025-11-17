<?php 

namespace KAMAGI\SootControllers;

use KAMAGI\SootUseCases\LoginUseCase;


// TODO: LogoutUseCaseの実装が完了したら下記のコメントアウト部分を解除

/**
 * 認証コントローラー
 * 
 * HTTPリクエストを受け取り、UseCaseを実行してレスポンスを返す
 */
class AuthController {
    private LoginUseCase $loginUseCase;
    // private LogoutUseCase $logoutUseCase;

    public function __construct(
        LoginUseCase $loginUseCase,
        // LogoutUseCase $logoutUseCase
    ) {
        $this->loginUseCase = $loginUseCase;
        // $this->logoutUseCase = $logoutUseCase;
    }

    /**
     * ログインAPI
     * 
     * @return void
     */
    public function login(): void {
        if ($_SERVER['REQEST_METHOD'] !== 'POST') {
            $this->sendResponse(405, [
                'success' => false,
                'message' => 'Method Not Allowed',
            ]);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        // laravelで言うリクエスト
        $userId = htmlspecialchars($input['user_id'] ?? '', ENT_QUOTES, 'UTF-8');
        $password = htmlspecialchars($input['password'] ?? '', ENT_QUOTES, 'UTF-8');

        $result = $this->loginUseCase->execute($userId, $password);

        $statusCode = $result['success'] ? 200 : 401;
        $this->sendResponse($statusCode, $result);
    }

    /**
     * ログアウトAPI
     * 
     * @return void
     */
    public function logout(): void {
        if ($_SERVER['REQEST_METHOD'] !== 'POST') {
            $this->sendResponse(405, [
                'success' => false,
                'message' => 'Method Not Allowed',
            ]);
            return;
        }

        // $result = $this->logoutUseCase->execute();

        // $this->sendResponse(200, $result);
    }

    /**
     * ログイン状態確認API
     * 
     * @return void
     */
    public function check(): void {
        if (isset($_SESSION['userId'])) {
            $this->sendResponse(200, [
                'success' => true,
                'isLoggedIn' => true,
                'user' => [
                    'id' => $_SESSION['userId'],
                    'name' => $_SESSION['name'],
                ]
            ]);
        } else {
            $this->sendResponse(200, [
                'success' => true,
                'isLoggedIn' => false,
            ]);
        }
    }

    /**
     * JSONレスポンスを送信
     * 
     * @param int $statusCode
     * @param array $data
     * @return void
     */
    private function sendResponse(
        int $statusCode,
        array $data,
    ): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
}
