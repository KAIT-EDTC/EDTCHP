<?php
header('Content-Type: application/json; charset=utf-8');

// CORSヘッダー（必要に応じて設定）
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// POSTリクエストのみ許可
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

try {
    // JSONデータを取得
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON: ' . json_last_error_msg());
    }

    // データのバリデーション
    if (!is_array($data)) {
        throw new Exception('Data must be an array');
    }

    foreach ($data as $slot) {
        if (!isset($slot['id']) || !isset($slot['time']) || !isset($slot['capacity']) || !isset($slot['reserved'])) {
            throw new Exception('Invalid slot data structure');
        }
        
        if (!is_numeric($slot['capacity']) || !is_numeric($slot['reserved'])) {
            throw new Exception('Capacity and reserved must be numbers');
        }

        if ($slot['capacity'] < 0 || $slot['reserved'] < 0) {
            throw new Exception('Capacity and reserved cannot be negative');
        }
    }

    // バックアップを作成
    $backupFile = 'reservations_backup_' . date('YmdHis') . '.json';
    if (file_exists('reservations.json')) {
        copy('reservations.json', $backupFile);
    }

    // JSONファイルに保存
    $jsonString = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    if ($jsonString === false) {
        throw new Exception('Failed to encode JSON');
    }

    $result = file_put_contents('reservations.json', $jsonString);

    if ($result === false) {
        throw new Exception('Failed to write file');
    }

    echo json_encode([
        'success' => true,
        'message' => 'Data saved successfully',
        'backup' => $backupFile
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
