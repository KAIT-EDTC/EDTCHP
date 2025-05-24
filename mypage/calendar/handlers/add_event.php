<?php
require_once __DIR__ . '/../functions.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/meta.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    $title = htmlspecialchars($_POST['title'], ENT_QUOTES, 'UTF-8');
    $description = htmlspecialchars($_POST['description'], ENT_QUOTES, 'UTF-8');
    $start_time = htmlspecialchars($_POST['start_time'], ENT_QUOTES, 'UTF-8');
    $end_time = htmlspecialchars($_POST['end_time'], ENT_QUOTES, 'UTF-8');
    $participants = htmlspecialchars($_POST['participants'], ENT_QUOTES, 'UTF-8');

    addEvents($title, $description, $start_time, $end_time, $participants);
    $stmt = $conn->prepare('INSERT INTO `events` (title, description, start_time, end_time, participants, updated_at) VALUES (:title, :description, :start_time, :end_time, :participants, :updated_at)');
    $stmt->execute([
        ':title'    => $title,
        ':description'   => $description,
        ':start_time'    => $start_time,
        ':end_time'      => $end_time,
        ':participants'     => $participants,
        ':updated_at'    => date('Y-m-d H:i:s')
    ]);

    header('Location: ' . CALENDAR_TOP);
    $conn = null;
}
?>
