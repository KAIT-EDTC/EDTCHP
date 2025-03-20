<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/info.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/mypage/calendar/functions.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/mypage/calendar/handlers/get_event.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/mypage/calendar/google-calendar-sync.php';
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

    // mypage/calendar/handlers/get_event.phpのgetMembersName()でidに該当する名前を取得するため下記のコードは不要
    // 予定自体はカレンダーからデータを取得しているためDBにアクセス不要。
    // 一応予定追加時にmypage/calendar/handlers/add_event.phpでDBにデータを送信している。(用途はカレンダーからは見えない詳細を確認する用)
    // $schedules = $conn->prepare('SELECT * FROM `yotei-data` WHERE part = :id'); //行事や提出期限などのデータベース
    // $schedules->bindParam(':part', $id, PDO::PARAM_INT);
    // $schedules->execute();
    //memberには学籍番号ベースで参加者登録を行うので自分が行く予定もしくは参加者未定の予定を取得
    
    // ユーザー情報取得
    if ($user = $user->fetch(PDO::FETCH_ASSOC)) {
        $username = htmlspecialchars($user['name'], ENT_QUOTES, 'UTF-8');
    }
    
    // フォーム情報取得
    $form = $form->fetchAll(PDO::FETCH_ASSOC);
    foreach ($form as $f) {
        $formname = htmlspecialchars($f['name'], ENT_QUOTES, 'UTF-8');
        $formurl = htmlspecialchars($f['link'], ENT_QUOTES, 'UTF-8');
        $tableRows .= "<tr>
        <td>{$formname}</td>
        <td><a href='$formurl' target='_blank' rel='noopener noreferrer'>{$formurl}</a></td>
        </tr>";
    }
    
    // 予定取得
    // $schedules = $schedules->fetchAll(PDO::FETCH_ASSOC);
    // foreach ($schedules as $schedule) {
        //     $yoteiname = htmlspecialchars($schedule['name'], ENT_QUOTES, 'UTF-8');
        //     $yoteidate = htmlspecialchars($schedule['date'], ENT_QUOTES, 'UTF-8');
        //     $yoteimember = htmlspecialchars($schedule['member'], ENT_QUOTES, 'UTF-8');
        //     $yoteilist .= "<tr>
        //                     <td>{$yoteiname}</td>
        //                     <td>{$yoteidate}</td>
        //                     <td>{$yoteimember}</td>
        //                 </tr>";
        // }
        
    // GoogleCalendarSyncクラスのインスタンス化
    $calendarSync = new GoogleCalendarSync($conn);
    
    // DBからGoogle Calendarへの同期を実行
    $calendarSync->performBidirectionalSync();
    
    // idに該当するイベントを20件取得(この取得する個数などは仕様変更予定)
    $data = getEventsById(getEvents(20), $id);
    // 取得したデータからテーブルに表示するものを抽出
    foreach ($data as $d) {
        $name = getMemberName($d['participants']);
        $yoteilist .= "<tr>
        <td>{$d['summary']}</td>
        <td>".RFC2Jap($d['startTime'])."</td>
        <td>".RFC2Jap($d['endTime'])."</td>
        <td>{$d['remark']}</td>
        <td>{$name}</td>
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
            <p><a href='calendar/calendar.php'>カレンダー</a></p>
            <?php echo "<iframe src='{$_ENV['CALENDAR_URL']}' style='border:solid 1px #777' width='1500' height='600' frameborder='0' scrolling='no'></iframe>"; ?>
            <!-- むずい -->
        </div>
        <div class="remind">
            <h2><?php echo $username; ?>さんの予定</h2>
            <?php if (!empty($yoteilist)): ?>
            <table cellspacing="0" cellpadding="20" border="1">
                <thead>
                    <tr>
                        <th>イベント名</th>
                        <th>開始日時</th>
                        <th>終了日時</th>
                        <th>備考</th>
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
        <div class="form-link">
            <h2>現在公開されているフォーム一覧</h2>
            <?php if (!empty($tableRows)): ?>
            <table border="1" >
                <thead>
                    <tr>
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
            <!-- グーグルドライブのリンクを予定 -->
        </div>
        
    </div>

</body>
</html>
