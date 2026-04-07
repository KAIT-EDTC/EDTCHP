<?php

namespace KAMAGI\SootUseCases;

use KAMAGI\SootRepositories\UserRepository;

/**
 * サインアップユースケース
 * 
 * ユーザー登録処理のビジネスロジックを担当
 */
class signUpUseCase {
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository) {
        $this->userRepository = $userRepository;
    }

    /**
     * サインアップ処理を実行
     * 
     * @param string $userId
     * @param string $name
     * @param string $password
     * @return array{success: bool, message: string}
     */
    public function execute(string $userId, string $name, string $password, int $roleId = 1): array {
        if (empty($userId) || empty($name) || empty($password)) {
            return [
                'success' => false,
                'message' => '全てのフィールドを入力してください。'
            ];
        }

        if (strlen($userId) != 7 || !ctype_digit($userId)) {
            return [
                'success' => false,
                'message' => '入力形式が正しくありません。'
            ];
        }

        if ($this->userRepository->findByUserId($userId)) {
            return [
                'success' => false,
                'message' => 'この学籍番号は既に登録されています。'
            ];
        }

        $data = [
            'user_id' => $userId,
            'name' => $name,
            'password' => $password,
            'role_id' => $roleId,
        ];

        $created = $this->userRepository->create($data);

        if (!$created) {
            return [
                'success' => false,
                'message' => 'ユーザー登録に失敗しました。'
            ];
        }

        return [
            'success' => true,
            'message' => 'ユーザー登録に成功しました。'
        ];
    }
}
