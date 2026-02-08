<?php

namespace KAMAGI\SootUseCases;

use KAMAGI\SootRepositories\UserRepository;

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

        // UserRepositoryで更新する
        // やり方はEventRepositoryのfindWithFiltersを参考にするといいかも
        // パスワードはハッシュ化してから保存する

        return [
            'success' => true,
            'message' => 'ユーザー情報が更新されました。',
        ];
    }
    
}
