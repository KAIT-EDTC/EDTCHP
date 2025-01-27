<?php
define('DSN', 'mysql:host=mysql3105.db.sakura.ne.jp;dbname=kaitedtc_mamber-db');
define('DB_USERNAME', 'kaitedtc_mamber-db');
define('DB_PASS', 'GU8-2bPQKYWP9m-');
$id = $_SESSION['userId'];

// $idがnullかどうか(null = ログインしないで不正にurlにアクセスしてる)
if (!isset($id)) {
    header('Location: https://kaitedtc.com/login-from/login.html');
    exit;
}

$conn = new PDO(DSN, DB_USERNAME, DB_PASS);

// login-dataに名前のカラムがあるの？
// 学籍番号使うだけだったらこのクエリはいらないかも
$user = $conn->prepare('SELECT login-data.名前のカラム名 FROM login-data WHERE name = :id');//名前の引き出しに使用
$user->bindParam(':id', $id, PDO::PARAM_INT);
$user->execute();
// ユーザーの入力内容を使わないクエリは直接実行してもOK
$form = $conn->query('SELECT * FROM form-data');//グーグルフォーム等のリンクのデータベース
$yotei = $conn->query('SELECT * FROM yotei-data');//行事や提出期限などのデータベース

// データ取得
$user = $user->fetchAll(PDO::FETCH_ASSOC);
$username = $user['名前のカラム名']; // 名前取得
$form = $form->fetchAll(PDO::FETCH_ASSOC);
$yotei = $yotei->fetchAll(PDO::FETCH_ASSOC);

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
    <!-- とりまphpで直書きで良い気がする(不都合が生まれたら直そう笑) -->
    <h1><?php echo $user; ?></h1>
    <div class="panel">
        <div class="calender"></div>
        <div class="task-list"></div>
        <div class="remind"></div>
        <div class="form-link"></div>
        <div class="houkokusyo"></div>
    </div>
    
</body>
</html>
