<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/EDTCHP/meta.php';

class Database
{
    private static $instance = null;
    private $connection;

    private function __construct()
    {
        try {
            $this->connection = new PDO(DSN, DB_USERNAME, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            error_log('DB Connection Error: ' . $e->getMessage());
            // 例外を再スローして、呼び出し元（Controller）でキャッチできるようにする
            // エンドポイント層の時点でDIしてるから、そこでハンドリングしないとだめかも
            // すべてコントローラ(もしくはDTO)でレスポンス処理をしたい 
            // FYI. Responsableインターフェース
            throw $e;
        }
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection()
    {
        return $this->connection;
    }
}
