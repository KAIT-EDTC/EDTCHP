<?php
// 共通の記述

// ライブラリの読み込み
require __DIR__ . '/vendor/autoload.php';

// .envファイルの読み込み用
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// サービスアカウントのjsonのパス
$JsonPath = __DIR__ . '/key/event-calendar-450506-0421fefd94f1.json';

$client = new Google_Client();

// アプリケーション名
$client->setApplicationName('EDTC-Event-Calendar');

// 権限の指定
// 予定の取得をするための権限 : Google_Service_Calendar::CALENDAR_READONLY
// 予定の追加をするための権限 : Google_Service_Calendar::CALENDAR_EVENTS
$client->setScopes(Google_Service_Calendar::CALENDAR_READONLY);

// 使用するアカウントのjsonファイル
$client->setAuthConfig($JsonPath);

$service = new Google_Service_Calendar($client);
?>
