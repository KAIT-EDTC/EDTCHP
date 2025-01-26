<?php
define('DSN', 'mysql:host=mysql3105.db.sakura.ne.jp;dbname=kaitedtc_mamber-db');
define('DB_USERNAME', 'kaitedtc_mamber-db');
define('DB_PASS', 'GU8-2bPQKYWP9m-');
$id = $_SESSION['userId'] 
$user = $conn->prepare('SELECT * FROM login-data WHERE name = $id');//名前の引き出しに使用
$form = $conn->prepare('SELECT * FROM form-data ');//グーグルフォーム等のリンクのデータベース
$yotei = $conn->prepare('SELECT * FROM yotei-data');//行事や提出期限などのデータベース

$conn = null;
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>マイページ</title>
    <!-- phpからnameをとってつけてもいい -->
</head>
<body>
    <div class="sp-only"></div>
    <div class="pc-only"></div>
    <!-- 完全すみわけ前提で機能を分けてもいいと思う -->
    <!-- <h1></h1>ここに$userから名前を拾いたいが直接中にPHPを書いていいのか？取得した文字列を何かに格納してすべてをjsで上書き？ -->
    <div class="panel">
        <div class="calender"></div>
        <div class="task-list"></div>
        <div class="remind"></div>
        <div class="form-link"></div>
        <div class="houkokusyo"></div>
    </div>
    
</body>
</html>