<?php 
    require_once $_SERVER['DOCUMENT_ROOT'] . '/meta.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/mypage/calendar/google-calendar-sync.php';
    session_start();

    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $users = $conn->query("SELECT * FROM `login-data` ORDER BY SIDn ASC");

    $schedules = $conn->query("SELECT title, description, start_time, end_time, participants, calendar_event_id FROM events ORDER BY start_time DESC");

    $gcs = new GoogleCalendarSync($conn);
    $gcs->performBidirectionalSync();

    $conn = null;
?>

<!DOCTYPE html>
<html>
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="touroku.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <title>予定登録フォーム</title>
</head>

<body>
    <?php if (isset($_SESSION['result'])): ?>
    <?php ErrorAlert($_SESSION['result']); ?>
    <?php unset($_SESSION['result']); ?>
    <?php endif; ?>
    <h1>登録フォーム</h1>
    <h2>予定登録</h2>
    <form action="ScheduleRegister.php" method="post">
        <table cellspacing="0" cellpadding="20" border="1">
            <tr>
                <th>イベント名</th>
                <td><input type="text" name="evtitle" required></td>
            </tr>
            <tr>
                <th>備考</th>
                <td><input type="text" name="description" required></td>
            </tr>
            <tr>
                <th>開始日時</th>
                <td><input type="datetime-local" name="start_time" required></td>
            </tr>
            <tr>
                <th>終了日時</th>
                <td><input type="datetime-local" name="end_time" required></td>
            </tr>
            <tr>
                <th>メンバー(学籍番号でお願いします)</th>
                <td>
                    <div class="dropdown-container">
                        <input type="text" name="member" id="memberbox" required>
                        <div class="dropdown">
                            <button type="button" class="dropdown-button"><i class="fa fa-chevron-down" aria-hidden="true"></i></button>
                            <div class="dropdown-content" id="dropdownMenu">
                                <input type="text" id="filterInput" placeholder="検索...">
                                <div id="checkboxList">
                                    <?php 
                                        foreach ($users as $user) {
                                            echo "<label id='{$user['SIDn']}'><input type='checkbox' value='{$user['SIDn']}'> {$user['name']}:({$user['SIDn']})</label><br>";
                                        }
                                    ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
        <p><input type="submit" value="登録"></p>
    </form>
    <h2>予定更新</h2>
    <form action="ScheduleUpdate.php" method="post">
        <table cellspacing="0" cellpadding="20" border="1">
            <tr>
                <th>更新する予定</th>
                <td>
                    <select id="schedule-pulldown" name="calendar_event_id">
                        <option></option>
                    <?php
                        foreach ($schedules as $schedule) {
                            echo "<option value='{$schedule["calendar_event_id"]}'>" . $schedule['title'] . "</option>";
                        }
                    ?>
                    </select>
                </td>
            </tr>
            <tr>
                <th>備考</th>
                <td><input type="text" id="event-description" name="remark"></td>
            </tr>
            <tr>
                <th>開始日時</th>
                <td><input type="datetime-local" id="event-start" name="start"></td>
            </tr>
            <tr>
                <th>終了日時</th>
                <td><input type="datetime-local" id="event-end" name="end"></td>
            </tr>
            <tr>
                <th>メンバー</th>
                <td><input type="text" id="event-participants" name="member"></td>
            </tr>
        </table>
        <p><input type="submit" value="更新"></p>
        <p><input type="submit" formaction="ScheduleDelete.php" value="削除"></p>
    </form>
    <h2>フォーム登録</h2>
    <form action="FormRegister.php" method="post">
        <table cellspacing="0" cellpadding="20" border="1">
            <tr>
                <th>フォームのリンク</th>
                <td>
                    <input type="text" name="link"required>
                </td>
                <th>フォームの名前</th>
                <td>
                    <input type="text" name="name"required>
                </td>
            </tr>
        </table>
        <p><input type="submit" value="登録"></p>
    </form>
    <h2>メンバー登録</h2>
    <form action="MemberRegister.php" method="post">
        <table cellspacing="0" cellpadding="20" border="1">
            <tr>
                <th>学籍番号</th>
                <td>
                    <input type="text" name="ID"required>
                </td>
            </tr>
            <tr>
                <th>パスワード</th>
                <td>
                    <input type="text" name="pw"required>
                </td>
            </tr>
            <tr>
                <th>名前</th>
                <td>
                    <input type="text" name="name" required>
                </td>
            </tr>
        </table>
        <p><input type="submit" value="登録"></p>
    </form>
    <a href=<?php echo MYPAGE ?>>マイページへ戻る</a>
</body>
<script type="text/javascript" src="../js/dropdown.js"></script>
<script type="text/javascript" src="../js/eventUpdate.js"></script>
</html>
