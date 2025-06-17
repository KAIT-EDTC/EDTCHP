<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/meta.php';

try {
    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // eventUpdate.jsで?calendar_event_id=XXXでGETリクエストを飛ばしてる。
    if (isset($_GET['calendar_event_id'])) {
        $CalendarEventId = $_GET['calendar_event_id']; // クエリから受け取る
        $stmt = $conn->prepare("SELECT title, description, start_time, end_time, participants FROM events WHERE calendar_event_id = ? LIMIT 1");
        $stmt->execute([$CalendarEventId]);
        $eventData = $stmt->fetch(PDO::FETCH_ASSOC);
    
        // ?calendar_event_id=XXXに['title', 'description', 'start_time', 'end_time', 'participants']を送る。
        header('Content-Type: application/json');
        echo json_encode($eventData);
        exit;
    }
} catch (Exception $e) {
    ErrorAlert($e->getMessage());
} finally {
    $conn = null;
}
?>
