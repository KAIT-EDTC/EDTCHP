<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/meta.php';
    require_once __DIR__ . '/calendar/functions.php';
    // require_once __DIR__ . '/calendar/google-calendar-sync.php';
    session_start();
    $id = $_SESSION['userId'];
    $yoteilist = '';
    $tableRows = '';
    
    // $idがnullかどうか(null = ログインしないで不正にurlにアクセスしてる)
    if (!isset($id)) {
        header('Location: ' . LOGIN_FORM);
        exit;
    }
    
    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    
    // $gcs = new GoogleCalendarSync($conn);
    // $gcs->performBidirectionalSync();

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
        $adc = htmlspecialchars($user['adomin'], ENT_QUOTES, 'UTF-8');
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
        $yoteimember = htmlspecialchars(getMemberName($conn, $schedule['member']), ENT_QUOTES, 'UTF-8');
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
    <!-- <link rel="stylesheet" href="./../css/reset.css"> -->
    <link rel="stylesheet" href="mypage.css">
    <link rel="stylesheet" href="./../css/global.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
</head>
<body>
    <div class="breadcrumbs">
        <a href="./../base.html">ホーム</a>
        <i class="fa fa-angle-right"></i>
        <a href="./mypage-temp.php">マイページ</a>
    </div>
    <div class="sp-only"></div>
    <div class="pc-only"></div>
    <!-- 完全すみわけ前提で機能を分けてもいいと思う -->
    <h1><?php echo $username; ?>さんこんにちは！</h1>
    <div class="panel">
        <div class="remind">
            <h2><?php echo $username; ?>さんの予定</h2>
            <?php if (!empty($yoteilist)): ?>
                <table cellspacing="0" cellpadding="20" border="1">
                <thead>
                    <tr>
                        <th>イベント名</th>
                        <th>日付</th>
                        <th>メンバー</th>
                    </tr>
                </thead>
                <tbody>
                    <?php echo $yoteilist; ?> <!-- PHPで生成したテーブル行を挿入 -->
                </tbody>
            </table>
            <?php else: ?>
                <p>今は予定がありません。</p>
            <?php endif ?>
        </div>
        <div class="calender">
            <?php echo "<iframe src='https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FTokyo&showPrint=0&showTitle=0&showCalendars=0&showTz=0&src=YWQ4YmZjOGU4ZjIxN2E2ZjNlMjM2NzkxOTg0YTU5MWUyMzM3OTA1ZTY4Njk1MmQ1YTVkZDg4NTcwMTU2ZDY2YUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23A79B8E&color=%2333B679&hl=ja' 
            style='border:solid 4px var(--main-color)' width='1500' height='600' frameborder='0' scrolling='no' class='calendar'></iframe>"; ?>
            <!-- むずい -->
        </div>
        <div class="form-link">
            <h2>現在公開されているフォーム一覧</h2>
            <?php if (!empty($tableRows)): ?>
                <table border="1" >
                    <thead>
                    <tr>
                        <th class="linkid">id</th>
                        <th class="linkname">リンク名</th>
                        <th class="link">リンク</th>
                    </tr>
                </thead>
                <tbody>
                    <?php echo $tableRows; ?> <!-- PHPで生成したテーブル行を挿入 -->
                </tbody>
            </table>
            <?php else: ?>
                <p>公開されている予定はありません。</p>
                <?php endif; ?>
            </div>
        <div class="houkokusyo">
            
        </div>
        
        <div>
            <?php if(($adc) == 1): ?>
            <a href="./../register-form/touroku.html">登録ページ</a>
            <?php endif; ?>
        </div>

        <div>
            <a href="./../base.html">ホームに戻る</a>
        </div>
        
    </div>

</body>
</html>
