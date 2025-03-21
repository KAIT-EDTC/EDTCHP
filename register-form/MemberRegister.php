<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/Pjinfo.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('Location: ' . LOGIN_FORM);
        exit;
    }
    $id = htmlspecialchars($_POST['ID'], ENT_QUOTES, 'UTF-8');
    $pw = htmlspecialchars($_POST['pw'], ENT_QUOTES, 'UTF-8');
    
    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare('INSERT INTO `login-data` (pass,SIDn) VALUES (:pass,:id)');
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':pass', $pw, PDO::PARAM_STR);
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
