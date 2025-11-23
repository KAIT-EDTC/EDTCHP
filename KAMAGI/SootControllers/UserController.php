<?php

namespace KAMAGI\SootControllers;

use KAMAGI\SootUseCases\signUpUseCase;
use KAMAGI\Response;

/**
 * ユーザーコントローラー
 * 
 * ユーザー関連のリクエストを処理
 */
class UserController
{
    private signUpUseCase $signUpUseCase;

    public function __construct(signUpUseCase $signUpUseCase)
    {
        $this->signUpUseCase = $signUpUseCase;
    }

    /**
     * サインアップ処理を実行
     * 
     * @return void
     */
    public function store(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        $userId = htmlspecialchars($input['user_id'] ?? '', ENT_QUOTES, 'UTF-8');
        $name = htmlspecialchars($input['name'] ?? '', ENT_QUOTES, 'UTF-8');
        $password = htmlspecialchars($input['password'] ?? '', ENT_QUOTES, 'UTF-8');

        $result = $this->signUpUseCase->execute($userId, $name, $password);

        $statusCode = $result['success'] ? 200 : 400;
        Response::json($statusCode, $result);
    }
}
