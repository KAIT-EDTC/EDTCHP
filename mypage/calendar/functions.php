<?php
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

/**
 * google calendarのインスタンスを取得する
 * 
 * @return array google calendarの色んなデータ
 */
function getClient() {
    global $jsonPath;
    $client = new Google_Client();
    $client->setScopes(Google_Service_Calendar::CALENDAR_EVENTS);
    $client->setAuthConfig($jsonPath);
    return $client;
}

/**
 * イベントを追加する
 * 
 * @param string $title イベントのタイトル
 * @param string $desc 参加者やイベントの詳細
 * @param string $start 開始日時
 * @param string $end 終了日時
 */
function addEvents($title, $remark, $start, $end, $participants) {
    global $calendarId;

    $client = getClient();

    $service = new Google_Service_Calendar($client);
    $event = new Google_Service_Calendar_Event(array(
        'summary' => $title,
        'description' => $remark,
        'start' => array(
            'dateTime' => ToRFC($start),
            'timeZone' => 'Asia/Tokyo',
        ),
        'end' => array(
            'dateTime' => ToRFC($end),
            'timeZone' => 'Asia/Tokyo',
        ),
        'extendedProperties' => array(
            'private' => array(
                'participants' => $participants,
            ),
        ),
    ));
    $service->events->insert($calendarId, $event);
}

/**
 * 2025月1月1日から今までのイベントデータを指定された個数だけ抽出する
 * 
 * @param int $maxResults 取り出したい個数
 * @return array フォーマットされたイベントデータが返される
 */
function getEvents($maxResults) { 
    global $calendarId;
    $events = [];
    $optParams = array(
        'maxResults' => $maxResults,
        'orderBy' => 'startTime',
        'singleEvents' => true,
        'timeMin' => date('c', strtotime('2025-01-01'))
    );
    
    $client = getClient();
    $service = new Google_Service_Calendar($client);
    $results = $service->events->listEvents($calendarId, $optParams);
    $events = $results->getItems();
    foreach ($events as $item) {
        /*
        * 基本的なキー
        * created : 作成日
        * summary : イベント名
        * description : 詳細
        * extendedProperties : 自作のキーを格納できる
            private : 当該のアカウントしか取得できない
                participants : 自作のキー。参加者情報が入ってる
            public : 全体に共有される
        * start : 開始日時
            startの中のdateTimeというキーにデータが入ってるため、例えば開始時間を取り出したいときは
            data['start']['dateTime']という風に取り出す(終了日時も同じ)
        * end : 終了日時
        */
        // データを扱いやすいようにフォーマット
        $formatted_events[] = array(
            'summary' => $item['summary'],
            'remark' => $item['description'],
            'startTime' => $item['start']['dateTime'],
            'endTime' => $item['end']['dateTime'],
            'participants' => $item['extendedProperties']['private']['participants'],
        );
    }
    return $formatted_events;
}

/**
 * 特定の生徒番号からイベントデータを抽出する
 * 
 * @param array $data 大本のイベントデータ
 * @param string $Id 生徒番号
 */
function getEventsById($data, $Id) {
    $filtered_data = [];
    foreach ($data as $d) {
        if (strpos($d['participants'], $Id) !== false) {
            $filtered_data[] = $d;
        }
    }
    return $filtered_data;
}

/**
 * 文字列をRFC3339形式に変換する
 * 文字列 -> yyyy-mm-ddThh:mm:ss+時差
 * 
 * @param string $date RFCにしたい文字列
 */
function ToRFC($date) {
    return (new DateTime($date, new DateTimeZone('Asia/Tokyo')))->format(DateTime::RFC3339);
}

/**
 * RFC3339形式から日本の年月月日に変換する  
 * yyyy-mm-ddThh:mm:ss+時差 -> mm月dd日hh時mm分
 * 
 * @param string $rfc 変換したいRFC形式の文字列
 */
function RFC2Jap($rfc) {
    $date = new DateTime($rfc);
    return $date->format('m月d日H時i分');
}
?>
