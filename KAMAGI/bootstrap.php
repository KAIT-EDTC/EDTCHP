<?php

// vendor/autoload.php と .env のパスを環境に応じて解決する
// .envはDocker環境では直接パス指定できないのでgetenv()で取得する。

$autoloadPaths = [
    __DIR__ . '/vendor/autoload.php', // ローカル / Docker
    __DIR__ . '/../../../vendor/autoload.php', // 本番環境
];

$autoloadLoaded = false;
foreach ($autoloadPaths as $path) {
    if (file_exists($path)) {
        require_once $path;
        $autoloadLoaded = true;
        break;
    }
}

if (!$autoloadLoaded) {
    http_response_code(500);
    die('設定ファイルの読み込みに失敗しました。');
}

if (class_exists('Dotenv\Dotenv')) {
    // rootにある.envを読み込む
    // safeLoadを使うことで、.envが存在しない場合（本番サーバー環境変数使用時など）もエラーにしない
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
    $dotenv->safeLoad();
}

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
define('GOOGLE_CREDENTIALS_JSON', kamagi_env('GOOGLE_CREDENTIALS_JSON'));
