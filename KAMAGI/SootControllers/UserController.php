<?php

namespace KAMAGI\SootControllers;

use KAMAGI\SootUseCases\signUpUseCase;
use KAMAGI\SootResources\Response;

/**
 * ユーザーコントローラー
 * 
 * ユーザー関連のリクエストを処理
 */
class UserController extends BaseController
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
        $this->validateMethod('POST');
        $input = $this->getRequestInput();

        // userIdとnameは本質のロジックではないため、ここは管理者かどうかのみを判断したい。
        // ログイン認可については汎用メソッドを作った方が良さそうなので後で実装する。(基底クラスに実装予定)
        if (!isset($_SESSION['userId']) || !isset($_SESSION['role']) || $_SESSION['role'] !== 0) {
            Response::json(Response::HTTP_UNAUTHORIZED, [
                'success' => false,
                'message' => 'Unauthorized access.'
            ]);
            return;
        }

        $userId = htmlspecialchars($input['user_id'], ENT_QUOTES, 'UTF-8');
        $name = htmlspecialchars($input['name'], ENT_QUOTES, 'UTF-8');
        $password = htmlspecialchars($input['password'], ENT_QUOTES, 'UTF-8');

        $result = $this->signUpUseCase->execute($userId, $name, $password);

        $statusCode = $result['success'] ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST;
        Response::json($statusCode, $result);
    }
}
