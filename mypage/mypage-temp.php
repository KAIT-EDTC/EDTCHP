<?php
    define('DSN', 'mysql:host=localhost;dbname=kaitedtc_mamber-db');
    define('DB_USERNAME', 'test1');
    define('DB_PASS', 'test');
    session_start();
    $id = $_SESSION['userId'];
    $yoteilist = '';
    $tableRows = '';

    // $idがnullかどうか(null = ログインしないで不正にurlにアクセスしてる)
    if (! isset($id)) {
        header('Location: https://kaitedtc.com/login-from/login.html');
        exit;
    }

    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);

    $user = $conn->prepare('SELECT * FROM `login-data` WHERE SIDn = :id');//名前の引き出しに使用
    $user->bindParam(':id', $id, PDO::PARAM_INT);
    $user->execute();

    $form = $conn->query('SELECT * FROM `form-data`'); //グーグルフォーム等のリンクのデータベース
    $form = $form->fetchAll(PDO::FETCH_ASSOC);

    $yotei = $conn->prepare('SELECT * FROM `yotei-data` WHERE member = :id'); //行事や提出期限などのデータベース
    $yotei->bindParam(':id', $id, PDO::PARAM_INT);
    $yotei->execute();
    //memberには学籍番号ベースで参加者登録を行うので自分が行く予定もしくは参加者未定の予定を取得

    // データ取得
    $user = $user->fetchAll(PDO::FETCH_ASSOC);
    $username = htmlspecialchars($user['name'], ENT_QUOTES, 'UTF-8'); // 名前取得
    
    foreach ($form as $row) {
        // 各カラムの値をエスケープ処理して安全にHTMLに出力
        $formid = htmlspecialchars($row['id'], ENT_QUOTES, 'UTF-8');
        $formname = htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8');
        $formurl = htmlspecialchars($row['link'], ENT_QUOTES, 'UTF-8');
        // テーブル行を作成し、HTMLに組み込める形式で文字列を生成
        $tableRows .= "<tr>
        <td>{$formid}</td>
        <td>{$formname}</td>
        <td><a href='$formurl' target='_blank' rel='noopener noreferrer'>{$formurl}</a></td>
        </tr>";
        }
    // ユーザー1人分しか取らないからwhileでOK
    while ($yotei = $yotei->fetchAll(PDO::FETCH_ASSOC)) {
        $yoteiname = $yotei['name'];
        $yoteidate = $yotei['date'];
        $yoteimember = $yotei['member'];
        $yoteilist .= "<tr>
                        <td>{$yoteiname}</td>
                        <td>{$yoteidate}</td>
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
            <table>
            <thead>
                <tr>
                    <th>ID</th> <!-- ヘッダー: ID -->
                    <th>リンク名</th> <!-- ヘッダー: 名前 -->
                    <th>リンク</th> <!-- ヘッダー: 性別 -->
                </tr>
            </thead>
            <tbody>
                <?php echo $tableRows; ?> <!-- PHPで生成したテーブル行を挿入 -->
            </tbody>
        </table>
            </div>
        <div class="houkokusyo">
            <!-- グーグルドライブのリンクを予定 -->
        </div>
    </div>

</body>
</html>
