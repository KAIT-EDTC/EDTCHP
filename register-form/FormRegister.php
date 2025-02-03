<?php
define('DSN', 'mysql:host=mysql3105.db.sakura.ne.jp;dbname=kaitedtc_mamber-db');
define('DB_USERNAME', 'kaitedtc_mamber-db');
define('DB_PASS', 'GU8-2bPQKYWP9m-');
$link = htmlspecialchars($_POST['link'], ENT_QUOTES, 'UTF-8');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('Location: https://kaitedtc.com/login-from/login.html');
        exit;
    }
    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare('INSERT INTO `form-data` (link) VALUES (:link)');
    $stmt->bindParam(':link', $link, PDO::PARAM_STR);
    $stmt->execute();
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>
