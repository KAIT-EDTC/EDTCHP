<?php 

namespace KAMAGI\SootRepositories;

use KAMAGI\SootEntities\User;
use PDO;

/**
 * ユーザーリポジトリ
 * 
 * ユーザーに関するDB操作を担当
 */
class UserRepository {
    private PDO $db;

    public function __construct(PDO $dbConnection) {
        $this->db = $dbConnection;
    }

    /**
     * ユーザーIDからユーザーを取得
     * 
     * @param string $userId
     * @return User|null
     */
    public function findByUserId(string $userId): ?User {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE user_id = ?');
        $stmt->execute([$userId]);
        $data = $stmt->fetch();

        return $data ? new User($data) : null;
    }

    /**
     * 新規ユーザーを作成
     * 
     * @param string $userId
     * @param string $name
     * @param string $password
     * @return bool 成功したらtrue
     */
    public function create(
        string $userId,
        string $name,
        string $password,
    ) : bool {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->db->prepare(
            'INSERT INTO users (user_id, password, name) VALUES (?, ?, ?)'
        );
        return $stmt->execute([
            $userId,
            $hashedPassword,
            $name,
        ]);
    }
}
