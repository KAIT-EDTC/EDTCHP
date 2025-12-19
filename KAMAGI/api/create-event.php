
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
$db = Database::getInstance()->getConnection();
$eventRepo = new EventRepository($db);
$gcRepo = new GoogleCalendarRepository();
$fetchEventsByUserIdUseCase = new FetchEventsByUserIdUseCase($eventRepo);
$userEventService = new CreateEventsService($gcRepo, $eventRepo);
$eventController = new EventController($fetchEventsByUserIdUseCase, $userEventService);

$eventController->store();