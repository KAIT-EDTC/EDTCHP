<?php
include 'common.php';
// 予定の取得

// カレンダーID (晒すのは怖いからenvファイルに書いておく)
$calendarId = $_ENV['CALENDAR_ID'];

// 取得時の詳細設定
$optParams = array(
    'maxResults' => 10,
    'orderBy' => 'startTime',
    'singleEvents' => true,
    'timeMin' => date('c', strtotime('2024-01-01')),
);

$results = $service->events->listEvents($calendarId, $optParams);
$events = $results->getItems();
?>
