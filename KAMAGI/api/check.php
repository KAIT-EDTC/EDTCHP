<?php

require_once __DIR__ . '/../session_start.php';
require_once __DIR__ . '/../../../../vendor/autoload.php';

use KAMAGI\Database;
use KAMAGI\SootResources\ErrorHandler;
use KAMAGI\SootControllers\AuthController;
use KAMAGI\SootUseCases\LoginUseCase;
use KAMAGI\SootUseCases\LogoutUseCase;
use KAMAGI\SootRepositories\UserRepository;

ErrorHandler::register();
$db = Database::getInstance()->getConnection();
$userRepo = new UserRepository($db);
$loginUseCase = new LoginUseCase($userRepo);
$logoutUseCase = new LogoutUseCase();
$authController = new AuthController($loginUseCase, $logoutUseCase);

// ログイン状態確認
$authController->check();
