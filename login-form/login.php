<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>メンバー用ログインフォーム</title>
    <link rel="stylesheet" href="./../css/global.css">
    <link rel="stylesheet" href="./login.css">
</head>

<body>
    <?php session_start() ?>
    <main>
        <div class="front-contents">
            <img src="./../img/EDTC-icon.webp" alt="" width="100" height="100">
            <h1>ログイン</h1>
        </div>
    
        <div class="form-container">
            <form action="logincheck.php" method="post">
                <div class="form-group">
                    <label for="student-id">学籍番号</label>
                    <input type="text" id="student-id" name="ID" autocomplete="off" required>
                </div>
                <div class="form-group">
                    <label for="password">パスワード</label>
                    <input type="text" id="password" name="pw" autocomplete="off" required>
                </div>
                <div class="form-group">
                    <input type="submit" value="ログイン" class="btn-login">
                    <?php if (isset($_SESSION['errors']['nameOrpass'])): ?>
                        <p class="error-log"><?php echo $_SESSION['errors']['nameOrpass']; ?></p>
                    <?php endif; ?>
                    <?php if (isset($_SESSION['errors']['db_auth'])): ?>
                        <p class="error-log"><?php echo $_SESSION['errors']['db_auth']; ?></p>
                    <?php endif; ?>
                    <?php if (isset($_SESSION['errors']['db_notFound'])): ?>
                        <p class="error-log"><?php echo $_SESSION['errors']['db_notFound']; ?></p>
                    <?php endif; ?>
                    <?php if (isset($_SESSION['errors']['db_connect'])): ?>
                        <p class="error-log"><?php echo $_SESSION['errors']['db_connect']; ?></p>
                    <?php endif; ?>
                    <?php if (isset($_SESSION['errors']['unknown'])): ?>
                        <p class="error-log"><?php echo $_SESSION['errors']['unknown']; ?></p>
                    <?php endif; ?>
                </div>
            </form>
            <a href="https://kaitedtc.com/">HPトップに戻る</a>
        </div>
    </main>
    <?php session_destroy() ?>
</body>

</html>
