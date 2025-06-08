<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/meta.php';

    $errors = []; // エラーメッセージを格納する
    $id = htmlspecialchars($_POST['ID'], ENT_QUOTES, 'UTF-8');
    $pw = htmlspecialchars($_POST['pw'], ENT_QUOTES, 'UTF-8');
    // 使ってないから一旦コメントアウト
    // $categories_string = implode(', ', array_map(function ($category) {
    //     return htmlspecialchars($category, ENT_QUOTES, 'UTF-8');
    // }, $categories));

    try {
        session_start();
        $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $conn->prepare('SELECT * FROM `login-data` WHERE SIDn = :id AND pass = :pass');
                                                      // ここの書き方はSQLインジェクション防ぐ書き方だよ。
                                                      // 直接queryメソッドで実行してもいいけどセキュリティ的にこっちの方が安心。
        $stmt->bindParam(':id', $id, PDO::PARAM_INT); // :idを$idに置き換えてる。
        $stmt->bindParam(':pass', $pw, PDO::PARAM_STR);
        $stmt->execute(); // ここでprepare内のクエリを実行。

        // fetchAllはDBに該当データがない場合は何も配列が返ってこないので0つまりfalseだから認証の有無が確認できる。
        if ($stmt->fetchAll(PDO::FETCH_ASSOC)) {
            if ($id == 0) {
                header('Location: ' . REGISTER_FORM); //転送先
            } else{
                $_SESSION['userId'] = $id; // ユーザーIdはページ遷移後でも使いそうだからサーバー上で保存
                header('Location: ' . MYPAGE); //転送先
            }
        } else {
            $errors['nameOrpass'] = "学籍番号またはパスワードが正しくありません。";
            $_SESSION['errors'] = $errors;
            header('Location: ' . LOGIN_FORM);
        }

    } catch (PDOException $e) {
        $errorCode = $e->getCode();
        switch ($errorCode) {
            case '1045':
            $errors['db_notFound'] = "データベースが見つかりません。DB設定が不適切です。";
            break;
            case '2002':
            $errors['db_connect'] = "データベースサーバーに接続できません。<br>サーバーが切断された可能性があります。";
            break;
            default:
            $errors['unknown'] = "例外処理がスローされました。<br>" . $e->getMessage();
            break;
        }
        $_SESSION['errors'] = $errors;
        header('Location: ' . LOGIN_FORM);
    }
    $conn = null;
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
