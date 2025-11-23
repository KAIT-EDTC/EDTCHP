<?php

namespace KAMAGI\SootControllers;

use KAMAGI\SootUseCases\LoginUseCase;
use KAMAGI\SootUseCases\LogoutUseCase;
use KAMAGI\Response;

// TODO: まったくDRYではないので、エラーハンドリングの共通化を検討する
/**
 * 認証コントローラー
 * 
 * HTTPリクエストを受け取り、UseCaseを実行してレスポンスを返す
 */
class AuthController
{
    private LoginUseCase $loginUseCase;
    private LogoutUseCase $logoutUseCase;

    public function __construct(
        LoginUseCase $loginUseCase,
        LogoutUseCase $logoutUseCase
    ) {
        $this->loginUseCase = $loginUseCase;
        $this->logoutUseCase = $logoutUseCase;
    }

    /**
     * ログインAPI
     * 
     * @return void
     */
    public function login(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::json(405, [
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
        Response::json($statusCode, $result);
    }

    /**
     * ログアウトAPI
     * 
     * @return void
     */
    public function logout(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::json(405, [
                'success' => false,
                'message' => 'Method Not Allowed',
            ]);
            return;
        }

        $result = $this->logoutUseCase->execute();

        Response::json(200, $result);
    }

    /**
     * ログイン状態確認API
     * 
     * @return void
     */
    public function check(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            Response::json(405, [
                'success' => false,
                'message' => 'Method Not Allowed',
            ]);
            return;
        }

        if (isset($_SESSION['userId'])) {
            Response::json(200, [
                'success' => true,
                'isLoggedIn' => true,
                'user' => [
                    'id' => $_SESSION['userId'],
                    'name' => $_SESSION['name'],
                    'role' => $_SESSION['role'],
                ]
            ]);
        } else {
            Response::json(200, [
                'success' => true,
                'isLoggedIn' => false,
            ]);
        }
    }
}
