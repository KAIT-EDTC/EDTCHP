<?php

require_once __DIR__ . '/../vendor/autoload.php';

use KAMAGI\Database;
use KAMAGI\SootResources\ErrorHandler;
use KAMAGI\SootControllers\EventController;
use KAMAGI\SootRepositories\EventRepository;
use KAMAGI\SootRepositories\GoogleCalendarRepository;
use KAMAGI\SootUseCases\FetchEventsByUserIdUseCase;
use KAMAGI\SootServices\CreateEventsService;

ErrorHandler::register();
// DI
$db = Database::getInstance()->getConnection();
$eventRepo = new EventRepository($db);
$fetchEventsUseCase = new FetchEventsByUserIdUseCase($eventRepo);
$gcRepo = new GoogleCalendarRepository();
$userEventService = new CreateEventsService($gcRepo, $eventRepo);
$eventController = new EventController($fetchEventsUseCase, $userEventService);

// ユーザーのイベント一覧を取得
$eventController->index();
