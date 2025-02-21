<?php
require_once __DIR__ . '/../functions.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    $sId = htmlspecialchars($_POST['studentId'], ENT_QUOTES, 'UTF-8');
    $data = getEventsById(getEvents(5), $sId);
    foreach ($data as $d) {
        $table .= "<tr>
        <td>{$d['summary']}</td>
        <td>".RFC2Jap($d['startTime'])."</td>
        <td>".RFC2Jap($d['endTime'])."</td>
        <td>{$d['remark']}</td>
        <td>{$d['members']}</td>
        </tr>";
    }
    $_SESSION['eventTable'] = $table;
    header('Location: ../calendar.php');
}
?>
