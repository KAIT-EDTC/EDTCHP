<?php

namespace KAMAGI\SootEntities;

/**
 * ユーザーエンティティ
 * 
 * ユーザーのデータ構造を表現するクラス
 */
class User
{
    public const ROLE_ADMIN = 0;
    public const ROLE_MEMBER = 1;

    public string $userId;
    public string $name;
    public string $password;
    public int $role;

    public function __construct(array $data)
    {
        $this->userId = $data['user_id'] ?? '';
        $this->name = $data['name'] ?? '';
        $this->password = $data['pass'] ?? '';
        $this->role = isset($data['role_id']) ? (int) $data['role_id'] : self::ROLE_MEMBER;
    }

    /**
     * パスワードを検証
     * 
     * @param string $inputPassword 入力されたパスワード
     * @return bool パスワードが正しければtrue
     */
    public function verifyPassword(string $inputPassword): bool
    {
        return password_verify($inputPassword, $this->password);
    }

    /**
     * 管理者かどうかを判定
     * 
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * パスワードを除いたユーザー情報を配列で返す
     * 
     * @return array{id: string, name: string, role: int}
     */
    public function toArray(): array
    {
        return [
            'id' => $this->userId,
            'name' => $this->name,
            'role' => $this->role,
        ];
    }

}
