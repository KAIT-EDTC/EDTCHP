<?php 

namespace KAMAGI\SootEntities;

/**
 * ユーザーエンティティ
 * 
 * ユーザーのデータ構造を表現するクラス
 */
class User {
    public string $userId;
    public string $name;
    public string $password;

    public function __construct(array $data) {
        $this->userId = $data['user_id'] ?? '';
        $this->name = $data['name'] ?? '';
        $this->password = $data['password'] ?? '';
    }

    /**
     * パスワードを検証
     * 
     * @param string $inputPassword 入力されたパスワード
     * @return bool パスワードが正しければtrue
     */
    public function verifyPassword(string $inputPassword): bool {
        return password_verify($inputPassword, $this->password);
    }

    /**
     * パスワードを除いたユーザー情報を配列で返す
     * 
     * @return array{id: string, name: string}
     */
    public function toArray(): array {
        return [
            'id' => $this->userId,
            'name' => $this->name,
        ];
    }

}
