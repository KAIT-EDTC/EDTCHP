<?php 

session_start();

require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/meta.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/database.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/KAMAGI/SootEntities/User.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/KAMAGI/SootRepositories/UserRepository.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/KAMAGI/SootUseCases/LoginUseCase.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/KAMAGI/SootUseCases/LogoutUseCase.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/KAMAGI/SootControllers/AuthController.php';

use KAMAGI\SootControllers\AuthController;
use KAMAGI\SootUseCases\LoginUseCase;
use KAMAGI\SootUseCases\LogoutUseCase;
use KAMAGI\SootRepositories\UserRepository;

$db = Database::getInstance()->getConnection();
$userRepo = new UserRepository($db);
$loginUseCase = new LoginUseCase($userRepo);
// $logoutUseCase = new LogoutUseCase();
$authController = new AuthController($loginUseCase);

$authController->login();
