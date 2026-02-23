<?php

require_once __DIR__ . '/../session_start.php';
require_once __DIR__ . '/../vendor/autoload.php';

use KAMAGI\Database;
use KAMAGI\SootResources\ErrorHandler;
use KAMAGI\SootResources\Response;
use KAMAGI\SootUseCases\signUpUseCase;
use KAMAGI\SootUseCases\UpdateUserInfoUseCase;
use KAMAGI\SootRepositories\UserRepository;
use KAMAGI\SootControllers\UserController;

ErrorHandler::register();

$db = Database::getInstance()->getConnection();
$userRepo = new UserRepository($db);
$signupUseCase = new signUpUseCase($userRepo);
$updateUserInfoUseCase = new UpdateUserInfoUseCase($userRepo);
$userController = new UserController($signupUseCase, $userRepo, $updateUserInfoUseCase);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // メンバー一覧を取得
        $userController->index();
        break;
    case 'POST':
        // メンバー情報更新
        $userController->update();
        break;
    default:
        Response::json(Response::HTTP_METHOD_NOT_ALLOWED, [
            'success' => false,
            'message' => 'METHOD_NOT_ALLOWED',
        ]);
        break;
}