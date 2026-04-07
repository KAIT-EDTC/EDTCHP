<?php

namespace KAMAGI\SootControllers;

use KAMAGI\SootUseCases\LoginUseCase;
use KAMAGI\SootUseCases\LogoutUseCase;
use KAMAGI\SootResources\Response;

/**
 * 認証コントローラー
 * 
 * HTTPリクエストを受け取り、UseCaseを実行してレスポンスを返す
 */
class AuthController extends BaseController
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
        $this->validateMethod('POST');

        $input = $this->getRequestInput();

        $userId = htmlspecialchars($input['user_id'] ?? '', ENT_QUOTES, 'UTF-8');
        $password = htmlspecialchars($input['password'] ?? '', ENT_QUOTES, 'UTF-8');

        $result = $this->loginUseCase->execute($userId, $password);

        $statusCode = $result['success'] ? Response::HTTP_OK : Response::HTTP_UNAUTHORIZED;
        Response::json($statusCode, $result);
    }

    /**
     * ログアウトAPI
     * 
     * @return void
     */
    public function logout(): void
    {
        $this->validateMethod('POST');

        $result = $this->logoutUseCase->execute();

        Response::json(Response::HTTP_OK, $result);
    }

    /**
     * ログイン状態確認API
     * 
     * @return void
     */
    public function check(): void
    {
        $this->validateMethod('GET');

        if (isset($_SESSION['userId'])) {
            Response::json(Response::HTTP_OK, [
                'success' => true,
                'isLoggedIn' => true,
                'user' => [
                    'id' => $_SESSION['userId'],
                    'name' => $_SESSION['name'],
                    'role' => $_SESSION['role'],
                ]
            ]);
        } else {
            Response::json(Response::HTTP_OK, [
                'success' => true,
                'isLoggedIn' => false,
            ]);
        }
    }
}
