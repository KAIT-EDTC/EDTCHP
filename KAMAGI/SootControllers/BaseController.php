<?php

namespace KAMAGI\SootControllers;

use KAMAGI\SootResources\Response;

class BaseController
{
    /**
     * リクエストメソッドを検証する
     * 不正なメソッドの場合はエラーレスポンスを返して終了する
     *
     * @param string $expectedMethod 期待するHTTPメソッド
     * @return void
     */
    protected function validateMethod(string $expectedMethod): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== $expectedMethod) {
            Response::json(Response::HTTP_BAD_REQUEST, [
                'success' => false,
                'message' => 'BAD_REQUEST',
            ]);
        }
    }

    /**
     * JSONリクエストボディを取得する
     *
     * @return array
     */
    protected function getRequestInput(): array
    {
        $input = json_decode(file_get_contents('php://input'), true);
        return $input;
    }
}
