<?php
$env = "local";
if ($env == "local") {
    define('DSN', 'mysql:host=localhost;dbname=test');
    define('DB_USERNAME', 'root');
    define('DB_PASS', '');
    define('LOGIN_FORM', 'http://localhost/EDTCHP/login-form/login.html');
    define('REGISTER_FORM', 'http://localhost/EDTCHP/register-form/MemberRegister.html');
    define('MYPAGE', 'http://localhost/EDTCHP/mypage/mypage-temp.php');
    define('CALENDAR_TOP', 'http://localhost/EDTCHP/mypage/calendar/calendar.php');
} else {
    define('DSN', 'mysql:host=mysql3105.db.sakura.ne.jp;dbname=kaitedtc_mamber-db');
    define('DB_USERNAME', 'kaitedtc_mamber-db');
    define('DB_PASS', 'GU8-2bPQKYWP9m-');
    define('LOGIN_FORM', 'https://kaitedtc.chew.jp/login-from/login.html');
    define('REGISTER_FORM', 'https://kaitedtc.chew.jp/register-form/touroku.html');
    define('MYPAGE', 'https://kaitedtc.chew.jp/mypage/mypage-temp.php');
    define('CALENDAR_TOP', 'https://kaitedtc.chew.jp/mypage/calendar/calendar.php');
}
?>
