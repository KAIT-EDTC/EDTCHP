<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/meta.php';
session_start();

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('Location: ' . LOGIN_FORM);
        exit;
    }
    $evname = htmlspecialchars($_POST['evtitle'], ENT_QUOTES, 'UTF-8');
    $description = htmlspecialchars($_POST['description'], ENT_QUOTES, 'UTF-8');
    $start_time = htmlspecialchars($_POST['start_time'], ENT_QUOTES, 'UTF-8');
    $end_time = htmlspecialchars($_POST['end_time'], ENT_QUOTES, 'UTF-8');
    $member = htmlspecialchars($_POST['member'], ENT_QUOTES, 'UTF-8');
    
    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare('INSERT INTO events 
                            (title, description, start_time, end_time, participants) 
                            VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([
        $evname,
        $description,
        $start_time,
        $end_time,
        $member
    ]);
    $_SESSION['result'] = "登録が完了しました。";
} catch (Exception $e) {
    $_SESSION['result'] = $e->getMessage();
} finally {
    $conn = null;
    header('Location: ' . REGISTER_FORM);
}
