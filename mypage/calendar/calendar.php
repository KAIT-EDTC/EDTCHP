<?php
require_once __DIR__ . '/functions.php';
// どんな予定を取得するか
$json = getJson(10, 'startTime', true, '2024-01-01');
$summary = getSchedule($json);
// IDでフィルタリング
$filtered[] = getScheduleById($summary, '2424013');

// テスト用
echo '<pre>';
foreach ($filtered as $f) {
    var_dump($f);
}
echo '</pre>';
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
</body>

</html>
