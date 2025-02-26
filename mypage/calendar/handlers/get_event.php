<?php
require_once __DIR__ . '/../functions.php';
define('DSN', 'mysql:host=localhost;dbname=test');
define('DB_USERNAME', '');
define('DB_PASS', '');
$conn = new PDO(DSN, DB_USERNAME, DB_PASS);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    $sId = htmlspecialchars($_POST['studentId'], ENT_QUOTES, 'UTF-8');
    $data = getEventsById(getEvents(5), $sId);
    foreach ($data as $d) {
        $name = getMemberName($d['participants']);
        $table .= "<tr>
        <td>{$d['summary']}</td>
        <td>".RFC2Jap($d['startTime'])."</td>
        <td>".RFC2Jap($d['endTime'])."</td>
        <td>{$d['remark']}</td>
        <td>{$name}</td>
        </tr>";
    }
    $_SESSION['eventTable'] = $table;
    header('Location: ../calendar.php');
    $conn = null;
}

function getMemberName($part) {
    global $conn;
    $name = '';
    // 参加者欄ではカンマ区切りで入力されることを想定。
    $arr_member = explode(',', $part);
    // 参加者分のプレースホルダを作成
    $placeholders = rtrim(str_repeat('?,', count($arr_member)), ',');
    // 参加者の名前を取得
    $stmt = $conn->prepare('SELECT name FROM `login-data` WHERE SIDn IN ('.$placeholders.')');
    $stmt->execute($arr_member);
    $stmt = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // カンマ区切りで参加者の名前を表示させる
    foreach ($stmt as $s) {
        $name .= $s['name'].', ';
    }
    // ラストのカンマは要らないので削除
    return rtrim($name, ', ');
}
?>
