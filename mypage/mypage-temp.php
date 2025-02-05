<?php
define('DSN', 'mysql:host=localhost;dbname=kaitedtc_mamber-db');
define('DB_USERNAME', 'root');
define('DB_PASS', '');
$id = $_SESSION['userId'];
$yoteilist = '';

// $idがnullかどうか(null = ログインしないで不正にurlにアクセスしてる)
if (!isset($id)) {
    header('Location: https://kaitedtc.com/login-from/login.html');
    exit;
}

$conn = new PDO(DSN, DB_USERNAME, DB_PASS);

$user = $conn->prepare('SELECT `login-data`.name FROM `login-data` WHERE SIDn = :id');//名前の引き出しに使用
$user->bindParam(':id', $id, PDO::PARAM_INT);
$user->execute();
$form = $conn->query('SELECT * FROM `form-data`');//グーグルフォーム等のリンクのデータベース
$yotei = $conn->query('SELECT * FROM `yotei-data` WHERE member = :id OR member IS NULL');//行事や提出期限などのデータベース
//memberには学籍番号ベースで参加者登録を行うので自分が行く予定もしくは参加者未定の予定を取得

// データ取得
$user = $user->fetchAll(PDO::FETCH_ASSOC);
$username = $user['name']; // 名前取得
$form = $form->fetchAll(PDO::FETCH_ASSOC);

// ユーザー1人分しか取らないからwhileでOK
while ($yotei = $yotei->fetchAll(PDO::FETCH_ASSOC)) {
    $yoteiname = htmlspecialchars($yotei['name'], ENT_QUOTES, 'UTF-8');
    $yoteidate = htmlspecialchars($yotei['date'], ENT_QUOTES, 'UTF-8');
    $yoteimember = htmlspecialchars($yotei['member'], ENT_QUOTES, 'UTF-8');
    $yoteilist .= "<tr>
                    <td>{$yoteiname}</td>
                    <td>{$$yoteidate}</td>
                    <td>{$yoteimember}</td>
                </tr>";
}
$conn = null;
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>マイページ</title>
</head>
<body>
    <div class="sp-only"></div>
    <div class="pc-only"></div>
    <!-- 完全すみわけ前提で機能を分けてもいいと思う -->
    <!-- <h1></h1>ここに$userから名前を拾いたいが直接中にPHPを書いていいのか？取得した文字列を何かに格納してすべてをjsで上書き？ -->
    <!-- とりまphpで直書きで良い気がする(不都合が生まれたら直そう笑) -->
    <h1><?php echo $username; ?>さんこんにちは！</h1>
    <div class="panel">
        <div class="calender">
            <!-- むずい -->
        </div>
        <div class="remind">
            <p><?php echo $username; ?>さんの予定</p>
            <?php echo $yoteilist; ?>
        </div>
        <div class="form-link">
            <p>現在公開されているフォーム一覧</p>
            <?php echo $form['link'];?>
        </div>
        <div class="houkokusyo">
            <!-- グーグルドライブのリンクを予定 -->
        </div>
    </div>
    
</body>
</html>
