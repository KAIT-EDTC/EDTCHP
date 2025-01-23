<?php
$servername = "mysql3105.db.sakura.ne.jp";
$username = "kaitedtc_mamber-db";
$password = "GU8-2bPQKYWP9m-";
$dbname = "kaitedtc_mamber-db";
$id = htmlspecialchars($_POST['ID']ENT_QUOTES, 'UTF-8');
$pw = htmlspecialchars($_POST['pw']ENT_QUOTES, 'UTF-8');
$categories_string = implode(', ', array_map(function ($category) {
    return htmlspecialchars($category, ENT_QUOTES, 'UTF-8');
}, $categories));

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
    $sql = "SELECT * FROM login-data";
    $stmt = $conn->pquery($sql);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC); 
    $i = 0;
    while($i < $sum){
        if($id == $name[$i]){
            if($pw == $pass[$i]){
                header(Location:'https://kaitedtc.chew.jp/'+$id)//転送先
            }
        }
    }

} catch (PDOException $e) {
    $message = "エラー: " . $e->getMessage();
    header('Location:https://kaitedtc.com/login-from/login.html')
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
    <title>確認画面</title>
</head>
<body>
    <h1>確認中</h1>
</body>
</html>