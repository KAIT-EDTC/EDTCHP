<?php
// require_once __DIR__ . '/common.php';

use Google\Client;
use Google\Service\Calendar as Google_Service_Calendar;
use Google\Service\Calendar\Event as Google_Service_Calendar_Event;

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/google/apiclient-services/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
// envファイルで隠しとく
$calendarId = $_ENV['CALENDAR_ID'];
$api_key = $_ENV['API_KEY'];
$jsonPath = __DIR__.'/key/push-event-test-451408-0f871f466586.json';

function getClient($isAdd) {
    global $jsonPath;
    $client = new Google_Client();
    if ($isAdd) $client->setScopes(\Google_Service_Calendar::CALENDAR_EVENTS);
    else $client->setScopes(\Google_Service_Calendar::CALENDAR_READONLY);
    $client->setAuthConfig($jsonPath);
    return $client;
}

function addEvents() {
    global $calendarId;
    $EVENT_START_DATE = '2025-02-18T10:00:00+09:00';
    $EVENT_END_DATE = '2025-02-18T11:00:00+09:00';

    $client = getClient(true);

    $service = new \Google_Service_Calendar($client);
    $event = new \Google_Service_Calendar_Event(array(
        'summary' => '遊行塾',
        'description' => '2424013',
        'start' => array(
            'dateTime' => $EVENT_START_DATE,
            'timeZone' => 'Asia/Tokyo',
        ),
        'end' => array(
            'dateTime' => $EVENT_END_DATE,
            'timeZone' => 'Asia/Tokyo',
        ),
    ));
    return $service->events->insert($calendarId, $event);
}

// getClientしないやつ
// function getJson($maxResults, $orderBy, $isSingleEvents, $timeMin) {
//     global $calendarId, $api_key;

//     // 取得時の詳細設定
//     $optParams = array(
//         'maxResults' => $maxResults,
//         'orderBy' => $orderBy,
//         'singleEvents' => $isSingleEvents,
//         'timeMin' => date('c', strtotime($timeMin))
//     );

//     $queryParams = http_build_query($optParams);
//     $API_URL = 'https://www.googleapis.com/calendar/v3/calendars/'.$calendarId.'/events?key='.$api_key;

//     // 予定の取得クエリを合体
//     $url = $API_URL.'&'.$queryParams;

//     // urlからjsonを取得
//     $results = file_get_contents($url);
//     return  json_decode($results, true);
// }

function getEvents($maxResults, $orderBy, $isSingleEvents, $timeMin) { 
    global $calendarId;
    $events = [];
    $optParams = array(
                'maxResults' => $maxResults,
                'orderBy' => $orderBy,
                'singleEvents' => $isSingleEvents,
                'timeMin' => date('c', strtotime($timeMin))
    );

    $client = getClient(false);
    $service = new Google_Service_Calendar($client);
    $results = $service->events->listEvents($calendarId, $optParams);
    $events = $results->getItems();
    foreach ($events as $item) {
        /*
        * 基本的なキーワード
        * created : 作成日
        * summary : イベント名
        * start : 開始日時
        * end : 終了日時
        * description : 詳細
        */
        // こんな感じで予定の取得が出来る
        $formatted_events[] = array(
            'summary' => $item['summary'],
            'startTime' => $item['start']['dateTime'],
            'endTime' => $item['end']['dateTime'],
            'description' => $item['description']
        );
    }
    return $formatted_events;
}

function getEventsById($data, $Id) {
    $filtered_data = [];
    foreach ($data as $d) {
        if (strpos($d['description'], $Id) !== false) {
            $filtered_data[] = $d;
        }
    }
    return $filtered_data;
}
?>
