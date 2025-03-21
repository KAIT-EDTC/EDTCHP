<?php
$env = "local";
$sever_port = $_SERVER['SERVER_PORT'];
$url = '';
if ($env == "local") {
    $url = $sever_port == '8000' ? 'http://localhost:8000' : 'http://localhost/EDTCHP';
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
    define('LOGIN_FORM', 'https://kaitedtc.chew.jp/login-from/login.html');
    define('REGISTER_FORM', 'https://kaitedtc.chew.jp/register-form/touroku.html');
    define('MYPAGE', 'https://kaitedtc.chew.jp/mypage/mypage-temp.php');
    define('CALENDAR_TOP', 'https://kaitedtc.chew.jp/mypage/calendar/calendar.php');
}

// このファイルをrequireすれば使える->require_once "function.php";
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
