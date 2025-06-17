<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/meta.php';

$days = [
    'Sun' => '日曜日',
    'Mon' => '月曜日',
    'Tue' => '火曜日',
    'Wed' => '水曜日',
    'Thu' => '木曜日',
    'Fri' => '金曜日',
    'Sat' => '土曜日'
];

/**
 * 文字列をRFC3339形式に変換する
 * 文字列 -> yyyy-mm-ddThh:mm:ss+時差
 * 
 * @param string $date RFCにしたい文字列
 */
function ToRFC($date) {
    return (new DateTime($date, new DateTimeZone('Asia/Tokyo')))->format(DateTime::RFC3339);
}

/**
 * RFC3339形式から日本の年月月日に変換する  
 * yyyy-mm-ddThh:mm:ss+時差 -> mm月dd日hh時mm分(D曜日)
 * 
 * @param string $rfc 変換したいRFC形式の文字列
 */
function RFC2Jap($rfc) {
    global $days;
    $date = new DateTime($rfc);
    $day = '(' . $days[$date->format('D')] . ')';
    return $date->format('m月d日H時i分') . $day;
    // 途中にはさんでもOK
    // return $date->format('m月d日' . $day . 'H時i分');
}

/**
 * 学籍番号に紐づけられている名前を抽出する。  
 * 複数メンバーがいる場合はカンマで区切る
 * 
 * @param string $part 学籍番号
 * @param object $conn PDOインスタンス
 * 
 * @return string 名前
 */
function getMemberName($conn, $part) {
    $name = '';
    // 参加者欄ではカンマ区切りで入力されることを想定。
    $arr_member = explode(',', $part);
    // 参加者分のプレースホルダを作成
    $placeholders = rtrim(str_repeat('?,', count($arr_member)), ',');
    // 参加者の名前を取得
    $stmt = $conn->prepare('SELECT name FROM `login-data` WHERE SIDn IN ('.$placeholders.')');
    $stmt->execute($arr_member);
    $stmt = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // カンマ区切りで参加者の名前を表示させる
    foreach ($stmt as $s) {
        $name .= $s['name'].', ';
    }
    // ラストのカンマは要らないので削除
    return rtrim($name, ', ');
}
?>
