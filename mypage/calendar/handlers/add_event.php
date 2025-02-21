<?php
require_once __DIR__ . '/../functions.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = htmlspecialchars($_POST['title'], ENT_QUOTES, 'UTF-8');
    $remark = htmlspecialchars($_POST['remark'], ENT_QUOTES, 'UTF-8');
    $start = htmlspecialchars($_POST['start_time'], ENT_QUOTES, 'UTF-8');
    $end = htmlspecialchars($_POST['end_time'], ENT_QUOTES, 'UTF-8');
    $members = htmlspecialchars($_POST['members'], ENT_QUOTES, 'UTF-8');

    addEvents($title, $remark, $start, $end, $members);
    header('Location: ../calendar.php');
}
?>
