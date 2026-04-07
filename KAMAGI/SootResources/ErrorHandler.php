<?php

namespace KAMAGI\SootResources;

use KAMAGI\SootResources\Response;

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
            $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR;
            $message = 'サーバーエラーが発生しました。';

            if ($e instanceof \PDOException) {
                $message = 'データベース接続または操作に失敗しました。';
            }

            if (CURRENT_ENV === 'dev') {
                Response::json($statusCode, [
                    'success' => false,
                    'message' => $message,
                    'debug_line' => $e->getLine(),
                    'debug_file' => $e->getFile(),
                    'debug_message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            } else {
                Response::json($statusCode, [
                    'success' => false,
                    'message' => $message,
                ]);
            }
        });
    }
}
