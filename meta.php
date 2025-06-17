<?php
$env = "dev";
$url = '';
if ($env == "local") {
    $url = 'http://localhost/EDTCHP';
    define('DSN', 'mysql:host=localhost;dbname=test');
    define('DB_USERNAME', 'root');
    define('DB_PASS', '');
    define('LOGIN_FORM', $url .'/login-form/login.html');
    define('REGISTER_FORM', $url .'/register-form/newmember copy.html');
    define('MYPAGE', $url .'/mypage/mypage-temp.php');
    define('CALENDAR_TOP', $url .'/mypage/calendar/calendar.php');
} else {
    define('DSN', 'mysql:host=mysql3105.db.sakura.ne.jp;dbname=kaitedtc_mamber-db');
    define('DB_USERNAME', 'kaitedtc_mamber-db');
    define('DB_PASS', 'GU8-2bPQKYWP9m-');
    // define('LOGIN_FORM', 'https://kaitedtc.com/login-form/login.html'); // エラーログのためにhtml -> phpにした。
    define('LOGIN_FORM', 'https://kaitedtc.com/login-form/login.php');
    define('REGISTER_FORM', 'https://kaitedtc.com/register-form/touroku.php');
    define('MYPAGE', 'https://kaitedtc.com/mypage/mypage-temp.php');
}

// このファイルをrequireすれば使える->require_once $_SERVER['DOCUMENT_ROOT'] . "/meta.php";
// Dev Toolのコンソールに表示
function DebugConsole($str) {
    echo "<script>";
    echo "console.log(". json_encode($str) .");";
    echo "</script>";
}

// アラートを出す
function DebugAlert($str) {
    echo "<script>";
    echo "alert(". json_encode($str) .");";
    echo "</script>";
}
?>
