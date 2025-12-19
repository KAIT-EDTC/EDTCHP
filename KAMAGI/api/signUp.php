<?php

session_start();

require_once __DIR__ . '/../vendor/autoload.php';

use KAMAGI\Database;
use KAMAGI\SootResources\ErrorHandler;
use KAMAGI\SootControllers\UserController;
use KAMAGI\SootUseCases\signUpUseCase;
use KAMAGI\SootRepositories\UserRepository;

ErrorHandler::register();
$db = Database::getInstance()->getConnection();
$userRepo = new UserRepository($db);
$signUpUseCase = new signUpUseCase($userRepo);
$userController = new UserController($signUpUseCase);

$userController->store();
