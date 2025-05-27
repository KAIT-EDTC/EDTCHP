<?php
require_once __DIR__ . '/../functions.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/meta.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    $sId = htmlspecialchars($_POST['studentId'], ENT_QUOTES, 'UTF-8');
    $data = getEventsById(getEvents(), $sId);
    foreach ($data as $d) {
        $name = getMemberName($conn, $d['participants']);
        $table .= "<tr>
        <td>{$d['title']}</td>
        <td>".RFC2Jap($d['start_time'])."</td>
        <td>".RFC2Jap($d['end_time'])."</td>
        <td>{$d['description']}</td>
        <td>{$name}</td>
        </tr>";
    }
    $_SESSION['eventTable'] = $table;
    header('Location: ' . CALENDAR_TOP);
    $conn = null;
}
?>
