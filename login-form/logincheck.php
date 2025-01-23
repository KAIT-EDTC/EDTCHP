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
    session_start(); // セッション開始
    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
    // テーブルのカラムの要素を知らないので仮にidとpassで書いてるよ。
    // login-dataテーブルのカラムがどんな感じなのか教えてほしい。
    $stmt = $conn->prepare('SELECT * FROM login-data WHERE id = :id AND pass = :pass');
    // ここの書き方はSQLインジェクション防ぐ書き方だよ。
    // 直接queryメソッドで実行してもいいけどセキュリティ的にこっちの方が安心。
    $stmt->bindParam(':id', $id, PDO::PARAM_STR); // :idを$idに置き換えてる。
    $stmt->bindParam(':pass', $pw, PDO::PARAM_STR);
    $stmt->execute(); // ここでprepare内のクエリを実行。

    // fetchAllはDBに該当データがない場合は何も配列が返ってこないので0つまりfalseだから認証の有無が確認できる。
    if ($stmt->fetchAll(PDO::FETCH_ASSOC)) {
        $_SESSION['userId'] = $id; // ユーザーIdはページ遷移後でも使いそうだからサーバー上で保存
        header(Location:'https://kaitedtc.chew.jp/'+$id);//転送先
    } else {
        echo '認証失敗';
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
