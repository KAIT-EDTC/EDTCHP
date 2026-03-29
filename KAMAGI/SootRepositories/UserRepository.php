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
            'INSERT INTO users (user_id, pass, name, role_id) VALUES (?, ?, ?, ?)'
        );
        return $stmt->execute([
            $data['user_id'],
            $hashedPassword,
            $data['name'],
            $data['role_id'] ?? 1,
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

        return array_map(function ($row) {
            return [
                'id' => $row['user_id'],
                'name' => $row['name'],
                'role' => (int)$row['role_id']
            ];
        }, $results);
    }

    /**
     * 学籍番号のリストから名前を取得
     * 
     * @param array $userIds 学籍番号の配列
     * @return array<string, string> 学籍番号 => 名前 のマッピング
     */
    public function getNamesByIds(array $userIds): array
    {
        if (empty($userIds)) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($userIds), '?'));
        $stmt = $this->db->prepare(
            "SELECT user_id, name FROM users WHERE user_id IN ({$placeholders})"
        );
        $stmt->execute($userIds);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $nameMap = [];
        foreach ($results as $row) {
            $nameMap[$row['user_id']] = $row['name'];
        }
        return $nameMap;
    }

    public function update(array $user)
    {

        $params = [];
        $fields = [];

        if (!empty($user['name'])) {
            $fields[] = "name=?";
            $params[] = $user['name'];
        }
        if (!empty($user['role_id'])) {
            $fields[] = "role_id=?";
            $params[] = $user['role_id'];
        }
        if (!empty($user['hashed_password'])) {
            $fields[] = "pass=?";
            $params[] = $user['hashed_password'];
        }
        $params[] = $user['user_id'];

        $sql = "UPDATE users SET " . implode(",", $fields) . "WHERE user_id=?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);

    }

}
