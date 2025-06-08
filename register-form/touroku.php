<?php 
    require_once $_SERVER['DOCUMENT_ROOT'] . '/meta.php';

    $conn = new PDO(DSN, DB_USERNAME, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $users = $conn->query("SELECT * FROM `login-data` ORDER BY SIDn ASC");
?>

<!doctype html>
<html>
    
    <head>
        <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="touroku.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <title>予定登録フォーム</title>
</head>

<body>
    <h1>登録フォーム</h1>
    <h2>予定登録</h2>
    <form action="ScheduleRegister.php" method="post">
        <table cellspacing="0" cellpadding="20" border="1">
            <tr>
                <th>イベント名</th>
                <td>
                    <input type="text" name="evid"required>
                </td>
            </tr>
            <tr>
                <th>日時</th>
                <td>
                    <input type="text" name="date"required>
                </td>
            </tr>
            <tr>
                <th>メンバー(学籍番号でお願いします)</th>
                <td>
                    <div class="dropdown-container">
                        <input type="text" name="member" id="memberbox" required>
                        <div class="dropdown">
                            <button type="button" class="dropdown-button" onclick="toggleDropdown()"><i class="fa fa-chevron-down" aria-hidden="true"></i></button>
                            <div class="dropdown-content" id="dropdownMenu">
                                <input type="text" id="filterInput" placeholder="検索..." onfocus="keepDropdownOpen()">
                                <div id="checkboxList">
                                    <?php 
                                        foreach ($users as $user) {
                                            echo "<label><input type='checkbox' value='{$user['SIDn']}'> {$user['name']}:({$user['SIDn']})</label><br>";
                                        }
                                    ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
        <p><input type="submit" value="登録"></p>
    </form>
    <h2>フォーム登録</h2>
    <form action="FormRegister.php" method="post">
        <table cellspacing="0" cellpadding="20" border="1">
            <tr>
                <th>フォームのリンク</th>
                <td>
                    <input type="text" name="link"required>
                </td> <th>フォームの名前</th>
                <td>
                    <input type="text" name="name"required>
                </td>
            </tr>
        </table>
        <p><input type="submit" value="登録"></p>
    </form>
    <h2>メンバー登録</h2>
    <form action="MemberRegister.php" method="post">
        <table cellspacing="0" cellpadding="20" border="1">
            <tr>
                <th>学籍番号</th>
                <td>
                    <input type="text" name="ID"required>
                </td>
            </tr>
            <tr>
                <th>パスワード</th>
                <td>
                    <input type="text" name="pw"required>
                </td>
            </tr>
            <tr>
                <th>名前</th>
                <td>
                    <input type="text" name="name" required>
                </td>
            </tr>
        </table>
        <p><input type="submit" value="登録"></p>
    </form>
</body>
<script type="text/javascript" src="../js/dropdown.js"></script>
</html>
