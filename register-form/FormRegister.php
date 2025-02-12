<?php
define('DSN', 'mysql:host=localhost;dbname=kaitedtc_mamber-db');
define('DB_USERNAME', 'root');
define('DB_PASS', '');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('Location: https://kaitedtc.com/login-from/login.html');
        exit;
    }
    $link = htmlspecialchars($_POST['link'], ENT_QUOTES, 'UTF-8');
    $name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8');
    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare('INSERT INTO `form-data` (link,name) VALUES (:link,:name)');
    $stmt->bindParam(':link', $link, PDO::PARAM_STR);
    $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    $stmt->execute();
    header('Location: http://localhost/EDTCHP/register-form/newmember%20copy.html');
    exit;

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
