<?php
require_once __DIR__ . '/functions.php';
require_once __DIR__ . '/handlers/get_event.php';
?>

<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8">
    <title>イベントカレンダー</title>
</head>
<body>
    <h1>イベントカレンダー</h1>
    <?php echo "<iframe src=\"{$_ENV['CALENDAR_URL']}\" style='border: 0;' height=800 width=800 frameborder='0' scrolling='no'></iframe>"; ?>
    
    <form action="./handlers/add_event.php" method="post">
        <label for="title">タイトル:</label>
        <input type="text" id="title" name="title" required><br><br>
        
        <label for="description">参加する人:</label>
        <textarea id="description" name="description" required></textarea><br><br>
        
        <label for="start_time">開始日時:</label>
        <input type="datetime-local" id="start_time" name="start_time" required><br><br>
        
        <label for="end_time">終了日時:</label>
        <input type="datetime-local" id="end_time" name="end_time" required><br><br>
        
        <input type="submit" value="追加">
    </form>
    <form action="./handlers/get_event.php" method="post">
        <label for="id">指定したいID</label>
        <!-- カンマ区切りで複数検索実装 -->
        <input type="text" id="studentId" name="studentId" require>
        <input type="submit" value="取得">
        <table cellspacing="0" cellpadding="20" border="1">
            <thead>
                <tr>
                    <th>タイトル</th>
                    <th>開始日時</th>
                    <th>終了日時</th>
                    <th>参加者</th>
                </tr>
            </thead>
            <tbody>
                <?php
                session_start();
                 if (!empty($_SESSION['eventTable'])) echo $_SESSION['eventTable'];
                session_destroy();
                ?>
            </tbody>
        </table>
    </form>
</body>

</html>
