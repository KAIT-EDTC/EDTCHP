<?php

namespace KAMAGI\SootRepositories;

use KAMAGI\SootEntities\User;
use PDO;

/**
 * ユーザーリポジトリ
 * 
 * ユーザーに関するDB操作を担当
 */
class UserRepository
{
    private PDO $db;

    public function __construct(PDO $dbConnection)
    {
        $this->db = $dbConnection;
    }

    /**
     * ユーザーIDからユーザーを取得
     * 
     * @param string $userId
     * @return User|null
     */
    public function findByUserId(string $userId): ?User
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE user_id = ?');
        $stmt->execute([$userId]);
        $data = $stmt->fetch();

        return $data ? new User($data) : null;
    }

    /**
     * 新規ユーザーを作成
     * 
     * @param array $data ユーザーデータ
     * @return bool 成功したらtrue
     */
    public function create(array $data): bool
    {
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt = $this->db->prepare(
            'INSERT INTO users (user_id, pass, name) VALUES (?, ?, ?)'
        );
        return $stmt->execute([
            $data['user_id'],
            $hashedPassword,
            $data['name'],
        ]);
    }

    /**
     * 全メンバー一覧を取得（パスワード除く）
     * 
     * @return array メンバー一覧
     */
    public function findAll(): array
    {
        $stmt = $this->db->query('SELECT user_id, name, role_id FROM users ORDER BY user_id');
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map(function($row) {
            return [
                'id' => $row['user_id'],
                'name' => $row['name'],
                'role' => (int)$row['role_id']
            ];
        }, $results);
    }
}
