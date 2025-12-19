<?php
$env = "local";
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$url = '';
if ($env == "local") {
    $url = 'http://localhost/EDTCHP';
    define('DSN', 'mysql:host=localhost;dbname=test');
    define('DB_USERNAME', 'root');
    define('DB_PASS', '');
    define('TOP_PAGE', $url . '/base.html');
    define('LOGIN_FORM', $url . '/mypage-kamagi/login.html');
    define('REGISTER_FORM', $url . '/mypage-kamagi/signUp.html');
    define('MYPAGE', $url . '/mypage-kamagi/mypage.html');
    define('CALENDAR_ID', $_ENV['CALENDAR_ID']);
    define('JSON_PATH', __DIR__ . '/key/test-edtc-event_credentials.json');
} else {
    define('DSN', 'mysql:host=mysql3105.db.sakura.ne.jp;dbname=kaitedtc_mamber-db');
    define('DB_USERNAME', 'kaitedtc_mamber-db');
    define('DB_PASS', 'GU8-2bPQKYWP9m-');
    define('TOP_PAGE', 'https://kaitedtc.com/');
    // define('LOGIN_FORM', 'https://kaitedtc.chew.jp/login-form/login.html'); // エラーログのためにhtml -> phpにした。
    define('LOGIN_FORM', 'https://kaitedtc.com/login-form/login.php');
    define('REGISTER_FORM', 'https://kaitedtc.com/register-form/touroku.php');
    define('MYPAGE', 'https://kaitedtc.com/mypage/mypage-temp.php');
}

// このファイルをrequireすれば使える->require_once $_SERVER['DOCUMENT_ROOT'] . "/meta.php";
// アラートを出す
function ErrorAlert($str)
{
    echo "<script>";
    echo "alert(" . json_encode($str) . ");";
    echo "</script>";
}
