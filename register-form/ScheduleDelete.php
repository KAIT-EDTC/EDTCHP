<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/meta.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/mypage/calendar/google-calendar-sync.php';
    session_start();

    try {
        $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
        $gcs = new GoogleCalendarSync($conn);
        $gcs->deleteEvent(htmlspecialchars($_POST['calendar_event_id'], ENT_QUOTES, 'UTF-8'));
        $_SESSION['result'] = "予定の削除が完了しました。";
    } catch (Exception $e) {
        $_SESSION['result'] = $e->getMessage();
    } finally {
        $conn = null;
        header('Location: ' . REGISTER_FORM);
    }
?>
