<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/meta.php";
    session_start();

    try {
        $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    
        $remark = htmlspecialchars($_POST['remark'], ENT_QUOTES, 'UTF-8');
        $start = htmlspecialchars($_POST['start'], ENT_QUOTES, 'UTF-8');
        $end = htmlspecialchars($_POST['end'], ENT_QUOTES, 'UTF-8');
        $member = htmlspecialchars($_POST['member'], ENT_QUOTES, 'UTF-8');
        $cei = htmlspecialchars($_POST['calendar_event_id'], ENT_QUOTES, 'UTF-8');
    
        $stmt = $conn->prepare("UPDATE events 
                                SET description = ?, 
                                    start_time = ?, 
                                    end_time = ?, 
                                    participants = ?
                                WHERE calendar_event_id = ?");
        $stmt->execute([
            $remark,
            $start,
            $end,
            $member,
            $cei
        ]);
        $_SESSION['result'] = "更新が完了しました。";
        header('Location: ' . REGISTER_FORM);
        $conn = null;
    } catch (PDOException $e) {
        $_SESSION['result'] = $e->getMessage();
    }
?>
