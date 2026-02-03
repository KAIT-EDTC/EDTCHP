<?php

// .envファイルの読み込み
if (class_exists('Dotenv\Dotenv')) {
    // rootにある.envを読み込む
    // safeLoadを使うことで、.envが存在しない場合（本番サーバー環境変数使用時など）もエラーにしない
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->safeLoad();
}

/**
 * 環境変数を優先順位に従って取得する
 * 1. $_ENV (phpdotenvでロードされたもの)
 * 2. $_SERVER
 * 3. getenv() (Docker環境変数など)
 */
if (!function_exists('kamagi_env')) {
    function kamagi_env($key, $default = false) {
        if (array_key_exists($key, $_ENV)) {
            return $_ENV[$key];
        }
        if (array_key_exists($key, $_SERVER)) {
            return $_SERVER[$key];
        }
        $val = getenv($key);
        return $val !== false ? $val : $default;
    }
}

define('CURRENT_ENV', kamagi_env('CURRENT_ENV'));
define('DSN', kamagi_env('DB_DSN'));
define('DB_USERNAME', kamagi_env('DB_USERNAME'));
define('DB_PASS', kamagi_env('DB_PASSWORD'));
define('CALENDAR_ID', kamagi_env('CALENDAR_ID', ''));
define('CALENDAR_URL', kamagi_env('CALENDAR_URL', ''));
define('JSON_PATH', kamagi_env('JSON_CREDENTIALS_PATH'));
