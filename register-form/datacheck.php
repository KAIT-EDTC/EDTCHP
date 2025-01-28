<?php
define('DSN', 'mysql:host=mysql3105.db.sakura.ne.jp;dbname=kaitedtc_mamber-db');
define('DB_USERNAME', 'kaitedtc_mamber-db');
define('DB_PASS', 'GU8-2bPQKYWP9m-');
$id = htmlspecialchars($_POST['ID'], ENT_QUOTES, 'UTF-8');
$pw = htmlspecialchars($_POST['pw'], ENT_QUOTES, 'UTF-8');
$categories_string = implode(', ', array_map(function ($category) {
    return htmlspecialchars($category, ENT_QUOTES, 'UTF-8');
}, $categories));

try {
    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

    $sql = "INSERT INTO login-data (SIDn, pass) VALUES (:id, :pw)";
    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':pw', $pw, PDO::PARAM_STR);

    $stmt->execute();

    $message = "データが正常に登録されました。";
} catch (PDOException $e) {
    $message = "エラー: " . $e->getMessage();

}
$conn = null;
?>
<?php
if()
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
