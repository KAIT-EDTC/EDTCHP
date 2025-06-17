<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/meta.php';

    $errors = []; // エラーメッセージを格納する
    $id = htmlspecialchars($_POST['ID'], ENT_QUOTES, 'UTF-8');
    $pw = htmlspecialchars($_POST['pw'], ENT_QUOTES, 'UTF-8');

    try {
        session_start();
        $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // ここの書き方はSQLインジェクション防ぐ書き方。
        // 直接queryメソッドで実行してもいいけどセキュリティ的にこっちの方が安心。
        $stmt = $conn->prepare('SELECT * FROM `login-data` WHERE SIDn = ? AND pass = ?');
        $stmt->execute([$id, $pw]); // ここでprepare内のクエリを実行。

        // fetchAllはDBに該当データがない場合は何も配列が返ってこないので0つまりfalseだから認証の有無が確認できる。
        if ($stmt->fetchAll(PDO::FETCH_ASSOC)) {
            if ($id == 0) { // アドミン
                header('Location: ' . REGISTER_FORM); //転送先
            } else{ // 一般生徒
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
    } finally {
        $conn = null;
    }
?>
