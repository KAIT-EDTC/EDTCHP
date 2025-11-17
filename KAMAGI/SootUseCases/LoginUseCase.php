<?php 

namespace KAMAGI\SootUseCases;

use KAMAGI\SootRepositories\UserRepository;

/**
 * ログインユースケース
 * 
 * ログイン処理のビジネスロジック
 */
class LoginUseCase {
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository) {
        $this->userRepository = $userRepository;
    }

    /**
     * ログイン処理を実行
     * 
     * @param string $userId
     * @param string $password
     * @return array{success: bool, message: string, user?: array}
     */
    public function execute(string $userId, string $password): array {
        if (empty($userId) || empty($password)) {
            return [
                'success' => false,
                'message' => '学籍番号とパスワードを入力してください。'
            ];
        }

        $user = $this->userRepository->findByUserId($userId);

        if (!$user || !$user->verifyPassword($password)) {
            return [
                'success' => false,
                'message' => '学籍番号またはパスワードが正しくありません。'
            ];
        }

        $_SESSION['userId'] = $user->userId;
        $_SESSION['name'] = $user->name;

        session_regenerate_id(true);

        return [
            'success' => true,
            'message' => 'ログインに成功しました。',
            'user' => $user->toArray()
        ];
    }
}
