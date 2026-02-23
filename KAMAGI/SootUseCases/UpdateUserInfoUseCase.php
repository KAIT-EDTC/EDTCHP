<?php

namespace KAMAGI\SootUseCases;

use KAMAGI\SootRepositories\UserRepository;
use Google\Service\SQLAdmin\User;

/**
 * ユーザー情報更新ユースケース
 * 
 * ユーザー情報更新のビジネスロジック
 */
class UpdateUserInfoUseCase
{
    private UserRepository $userRepo;

    public function __construct(UserRepository $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    /**
     * ユーザー情報更新処理を実行
     * 
     * @param array $user
     * @return array{success: bool, message: string}
     */
    public function execute(array $user): array
    {
        // userIdは主キーなので必須
        if (empty($user["user_id"])) {
            return [
                'success' => false,
                'message' => '学籍番号ないよー',
            ];
        }
        // UserRepositoryで更新する
        // やり方はEventRepositoryのfindWithFiltersを参考にするといいかも
        // パスワードはハッシュ化してから保存する
        if (!empty($user["password"])) {
            $user["hashed_password"] = password_hash($user["password"], PASSWORD_DEFAULT);
            unset($user["password"]);
        }
        $result = $this->userRepo->update($user);

        return [
            'success' => $result,
            'message' => $result
            ? 'ユーザー情報が更新されました。'
            : 'ユーザー情報が更新されませんでした。',

        ];

    }


}
