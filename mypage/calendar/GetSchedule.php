<?php
// require_once __DIR__ . '/common.php';
// 予定の取得
require __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// envファイルで隠しとく
$calendarId = $_ENV['CALENDAR_ID'];
$api_key = $_ENV['API_KEY'];

// 取得時の詳細設定
$optParams = array(
    'maxResults' => 10,
    'orderBy' => 'startTime',
    'singleEvents' => true,
    'timeMin' => date('c', strtotime('2024-01-01'))
);

$API_URL = 'https://www.googleapis.com/calendar/v3/calendars/'.$calendarId.'/events?key='.$api_key.'&singleEvents=true';

// 予定の取得クエリを合体
$url = $API_URL.'&'.implode('&', $optParams);

// urlからjsonを取得
$results = file_get_contents($url);
$json = json_decode($results, true);
 
foreach ($json['items'] as $item) {
    /*
    * 基本的なキーワード
    * created : 作成日
    * summary : イベント名
    * start : 開始日時
    * end : 終了日時
    * description : 詳細
    */
    // こんな感じで予定の種痘が出来る
    // 後日DBに挿入するコーディングをする
    echo '開催日:'.$item['created'].'| イベント名:'.$item['summary'].'<br>';
}
?>
