<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/meta.php';
session_start();

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('Location: ' . LOGIN_FORM);
        exit;
    }
    $link = htmlspecialchars($_POST['link'], ENT_QUOTES, 'UTF-8');
    $name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8');
    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare('INSERT INTO `form-data` (link, name) VALUES (?, ?)');
    $stmt->execute([$link, $name]);
    $_SESSION['result'] = "フォームの登録が完了しました。";
} catch (Exception $e) {
    $_SESSION['result'] = $e->getMessage();
} finally {
    $conn = null;
    header('Location: ' . REGISTER_FORM);
}
?>
