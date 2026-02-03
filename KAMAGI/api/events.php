<?php

require_once __DIR__ . '/../vendor/autoload.php';

use KAMAGI\Database;
use KAMAGI\SootResources\ErrorHandler;
use KAMAGI\SootResources\Response;
use KAMAGI\SootControllers\EventController;
use KAMAGI\SootRepositories\EventRepository;
use KAMAGI\SootRepositories\GoogleCalendarRepository;
use KAMAGI\SootUseCases\FetchEventsWithFiltersUseCase;
use KAMAGI\SootServices\EventService;

ErrorHandler::register();

$db = Database::getInstance()->getConnection();
$eventRepo = new EventRepository($db);
$gcRepo = new GoogleCalendarRepository();
$fetchEventsWithFiltersUseCase = new FetchEventsWithFiltersUseCase($eventRepo);
$userEventService = new EventService($gcRepo, $eventRepo);
$eventController = new EventController($fetchEventsWithFiltersUseCase, $userEventService);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // すべてのGETリクエストはfetchWithFiltersで処理
        // user_idのみ : 当人のイベントと全体イベントを取得。参加者には同イベントに出席しているメンバーも含まれる
        // フィルター無し : 全イベントを取得する(コンボボックス用)
        $eventController->fetchWithFilters();
        break;
    
    case 'POST':
        // イベント作成（参加者情報を含む）
        $eventController->store();
        break;
    
    case 'PUT':
        // イベント更新（参加者情報を含む）
        $eventController->update();
        break;
    
    case 'DELETE':
        // イベント削除
        $eventController->destroy();
        break;
    
    default:
        Response::json(Response::HTTP_METHOD_NOT_ALLOWED, [
            'success' => false,
            'message' => 'METHOD_NOT_ALLOWED',
        ]);
        break;
}
