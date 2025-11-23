<?php

session_start();

require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/meta.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/KAMAGI/database.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/KAMAGI/Response.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/KAMAGI/ErrorHandler.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/KAMAGI/SootEntities/User.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/KAMAGI/SootRepositories/UserRepository.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/KAMAGI/SootUseCases/signUpUseCase.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/KAMAGI/SootControllers/UserController.php';

use KAMAGI\ErrorHandler;
use KAMAGI\SootControllers\UserController;
use KAMAGI\SootUseCases\signUpUseCase;
use KAMAGI\SootRepositories\UserRepository;

ErrorHandler::register();
$db = Database::getInstance()->getConnection();
$userRepo = new UserRepository($db);
$signUpUseCase = new signUpUseCase($userRepo);
$userController = new UserController($signUpUseCase);

$userController->store();
