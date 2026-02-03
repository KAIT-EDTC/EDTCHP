<?php

require_once __DIR__ . '/../vendor/autoload.php';

use KAMAGI\Database;
use KAMAGI\SootResources\ErrorHandler;
use KAMAGI\SootResources\Response;
use KAMAGI\SootRepositories\UserRepository;

ErrorHandler::register();

$db = Database::getInstance()->getConnection();
$userRepo = new UserRepository($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // メンバー一覧を取得
        $members = $userRepo->findAll();
        
        Response::json(Response::HTTP_OK, [
            'success' => true,
            'members' => $members
        ]);
        break;
    
    default:
        Response::json(Response::HTTP_METHOD_NOT_ALLOWED, [
            'success' => false,
            'message' => 'METHOD_NOT_ALLOWED',
        ]);
        break;
}
