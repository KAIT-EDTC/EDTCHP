<?php
require_once __DIR__ . '/../functions.php';
define('DSN', 'mysql:host=localhost;dbname=test');
define('DB_USERNAME', '');
define('DB_PASS', '');
$conn = new PDO(DSN, DB_USERNAME, DB_PASS);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = htmlspecialchars($_POST['title'], ENT_QUOTES, 'UTF-8');
    $remark = htmlspecialchars($_POST['remark'], ENT_QUOTES, 'UTF-8');
    $start = htmlspecialchars($_POST['start_time'], ENT_QUOTES, 'UTF-8');
    $end = htmlspecialchars($_POST['end_time'], ENT_QUOTES, 'UTF-8');
    $participants = htmlspecialchars($_POST['participants'], ENT_QUOTES, 'UTF-8');

    addEvents($title, $remark, $start, $end, $participants);
    $stmt = $conn->prepare('INSERT INTO `yotei-data` (title, remark, start, end, part) VALUES (:title, :remark, :start, :end, :part)');
    $stmt->execute([
        ':title'    => $title,
        ':remark'   => $remark,
        ':start'    => $start,
        ':end'      => $end,
        ':part'     => $participants
    ]);

    header('Location: ../calendar.php');
    $conn = null;
}
?>
