<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/Pjinfo.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('Location: ' . LOGIN_FORM);
        exit;
    }
    $evname = htmlspecialchars($_POST['evid'], ENT_QUOTES, 'UTF-8');
    $date = htmlspecialchars($_POST['date'], ENT_QUOTES, 'UTF-8');
    $member = htmlspecialchars($_POST['member'], ENT_QUOTES, 'UTF-8');
    
    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare('INSERT INTO `yotei-data` (date, member, name) VALUES (:date, :member, :name)');
    $stmt->bindParam(':date', $date, PDO::PARAM_STR);
    $stmt->bindParam(':member', $member, PDO::PARAM_STR);
    $stmt->bindParam(':name', $evname, PDO::PARAM_STR);
    $stmt->execute();
    header('Location: ' . REGISTER_FORM);
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登録画面</title>
</head>
<body>
    <h1>登録画面</h1>
</body>
</html>
