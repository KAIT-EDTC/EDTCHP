<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/info.php';
    session_start();
    $id = $_SESSION['userId'];
    $yoteilist = '';
    $tableRows = '';

    // $idがnullかどうか(null = ログインしないで不正にurlにアクセスしてる)
    if (! isset($id)) {
        header('Location: ' . LOGIN_FORM);
        exit;
    }

    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);

    $user = $conn->prepare('SELECT * FROM `login-data` WHERE SIDn = :id');//名前の引き出しに使用
    $user->bindParam(':id', $id, PDO::PARAM_INT);
    $user->execute();

    $form = $conn->query('SELECT * FROM `form-data`'); //グーグルフォーム等のリンクのデータベース
    
    $schedules = $conn->prepare('SELECT * FROM `yotei-data` WHERE member = :id'); //行事や提出期限などのデータベース
    $schedules->bindParam(':id', $id, PDO::PARAM_INT);
    $schedules->execute();
    //memberには学籍番号ベースで参加者登録を行うので自分が行く予定もしくは参加者未定の予定を取得
    
    // ユーザー情報取得
    if ($user = $user->fetch(PDO::FETCH_ASSOC)) {
        $username = htmlspecialchars($user['name'], ENT_QUOTES, 'UTF-8');
    }

    // フォーム情報取得
    $form = $form->fetchAll(PDO::FETCH_ASSOC);
    foreach ($form as $f) {
        $formid = htmlspecialchars($f['id'], ENT_QUOTES, 'UTF-8');
        $formname = htmlspecialchars($f['name'], ENT_QUOTES, 'UTF-8');
        $formurl = htmlspecialchars($f['link'], ENT_QUOTES, 'UTF-8');
        $tableRows .= "<tr>
        <td>{$formid}</td>
        <td>{$formname}</td>
        <td><a href='$formurl' target='_blank' rel='noopener noreferrer'>{$formurl}</a></td>
        </tr>";
    }

    // 予定取得
    $schedules = $schedules->fetchAll(PDO::FETCH_ASSOC);
    foreach ($schedules as $schedule) {
        $yoteiname = htmlspecialchars($schedule['name'], ENT_QUOTES, 'UTF-8');
        $yoteidate = htmlspecialchars($schedule['date'], ENT_QUOTES, 'UTF-8');
        $yoteimember = htmlspecialchars($schedule['member'], ENT_QUOTES, 'UTF-8');
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
    <link rel="stylesheet" href="mypage.css">
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
            <?php if (!empty($yoteilist)): ?>
            <p><?php echo $username; ?>さんの予定</p>
            <table cellspacing="0" cellpadding="20" border="1">
                <thead>
                    <tr>
                        <th>イベント名</th> <!-- ヘッダー: ID -->
                        <th>日付</th> <!-- ヘッダー: 名前 -->
                        <th>メンバー</th> <!-- ヘッダー: 性別 -->
                    </tr>
                </thead>
                <tbody>
                    <?php echo $yoteilist; ?> <!-- PHPで生成したテーブル行を挿入 -->
                </tbody>
            </table>
            <?php endif; ?>
        </div>
        <div class="form-link">
            <?php if (!empty($tableRows)): ?>
            <p style="font-size: 15px"><p><h2>現在公開されているフォーム一覧</h2>
            <table border="1" >
                <thead>
                    <tr>
                        <th class="linkid">ID</th> <!-- ヘッダー: ID -->
                        <th class="linkname">リンク名</th> <!-- ヘッダー: 名前 -->
                        <th class="link">リンク</th> <!-- ヘッダー: 性別 -->
                    </tr>
                </thead>
                <tbody>
                    <?php echo $tableRows; ?> <!-- PHPで生成したテーブル行を挿入 -->
                </tbody>
            </table>
            <?php endif; ?>
        </div>
        <div class="houkokusyo">
            <!-- グーグルドライブのリンクを予定 -->
        </div>
        
    </div>

</body>
</html>
