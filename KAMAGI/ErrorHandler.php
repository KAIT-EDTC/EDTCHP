<?php

namespace KAMAGI;

use KAMAGI\Response;

class ErrorHandler
{
    /**
     * エラーハンドラーを登録する
     *
     * @return void
     */
    public static function register(): void
    {
        // エラーを例外として扱う
        set_error_handler(function ($severity, $message, $file, $line) {
            if (!(error_reporting() & $severity)) {
                return;
            }
            throw new \ErrorException($message, 0, $severity, $file, $line);
        });

        // 例外ハンドラー
        set_exception_handler(function (\Throwable $e) {
            // エラーログへの記録
            error_log(sprintf(
                "Uncaught Exception: %s in %s:%d\nStack trace:\n%s",
                $e->getMessage(),
                $e->getFile(),
                $e->getLine(),
                $e->getTraceAsString()
            ));

            // 認証エラーなどもセキュリティ的にユーザー側にあまり悟らせたくないので500エラーとして扱いたい
            $statusCode = 500;
            $message = 'サーバーエラーが発生しました。';

            if ($e instanceof \PDOException) {
                $message = 'データベース接続または操作に失敗しました。';
            }

            Response::json($statusCode, [
                'success' => false,
                'message' => $message,
            ]);
        });
    }
}
