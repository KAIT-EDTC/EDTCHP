<?php include 'GetSchedule.php'; ?>

<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8">
    <title>イベントカレンダー</title>
</head>
<body>
    <h1>イベントカレンダー</h1>
    <?php echo "<iframe src=\"{$_ENV['CALENDAR_URL']}\" style='border: 0;' height=800 width=800 frameborder='0' scrolling='no'></iframe>"; ?>
    <?php foreach ($events as $event) : ?>
        <h2><?php echo $event->getSummary(); ?></h2>
        <p><?php echo $event->getDescription(); ?></p>
        <p><?php echo $event->getStart()->dateTime; ?></p>
        <p><?php echo $event->getEnd()->dateTime; ?></p>
    <?php endforeach; ?>
</body>

</html>
