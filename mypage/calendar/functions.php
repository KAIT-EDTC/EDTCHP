<?php
// require_once __DIR__ . '/common.php';
// 予定の取得
require __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

function getJson($maxResults, $orderBy, $isSingleEvents, $timeMin) {
    // envファイルで隠しとく
    $calendarId = $_ENV['CALENDAR_ID'];
    $api_key = $_ENV['API_KEY'];

    // 取得時の詳細設定
    $optParams = array(
        'maxResults' => $maxResults,
        'orderBy' => $orderBy,
        'singleEvents' => $isSingleEvents,
        'timeMin' => date('c', strtotime($timeMin))
    );

    $API_URL = 'https://www.googleapis.com/calendar/v3/calendars/'.$calendarId.'/events?key='.$api_key.'&singleEvents=true';

    // 予定の取得クエリを合体
    $url = $API_URL.'&'.implode('&', $optParams);

    // urlからjsonを取得
    $results = file_get_contents($url);
    return  json_decode($results, true);
}

function getSchedule($json) {
    foreach ($json['items'] as $item) {
        /*
        * 基本的なキーワード
        * created : 作成日
        * summary : イベント名
        * start : 開始日時
        * end : 終了日時
        * description : 詳細
        */
        // 新たに配列を作って良い感じに整形(項目はもっと増やせる)
        $schedule[] = array(
            'summary' => $item['summary'],
            'startTime' => $item['start'],
            'description' => $item['description']
        );
    }
    return $schedule;
}

// 指定されたIDを含む予定を返す
function getScheduleById($data, $Id) {
    foreach ($data as $d) {
        if (strpos($d['description'], $Id) !== false) {
            $filtered_data[] = $d;
        }
    }
    return $filtered_data;
}
?>
