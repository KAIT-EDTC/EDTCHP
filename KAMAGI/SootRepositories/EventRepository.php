<?php

namespace KAMAGI\SootRepositories;

use KAMAGI\SootEntities\Event;
use PDO;

/**
 * イベントリポジトリ
 * 
 * イベントに関するDB操作を担当
 */
class EventRepository
{
    private PDO $db;

    public function __construct(PDO $dbConnection)
    {
        $this->db = $dbConnection;
    }

    /**
     * DBで新規イベントを作成
     * 
     * @param string $googleEventId GoogleカレンダーのイベントID
     * @param array $data イベントデータ
     * @return bool 成功したらtrue
     */
    public function create(string $googleEventId, array $data): bool
    {
        $stmt = $this->db->prepare(
            'INSERT INTO events (title, description, visibility, google_event_id, start_time, end_time) 
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        return $stmt->execute([
            $data['title'],
            $data['description'],
            $data['visibility'],
            $googleEventId,
            $data['start_time'],
            $data['end_time'],
        ]);
    }

    /**
     * イベントに参加者を紐付け
     * 
     * @param string $googleEventId GoogleカレンダーのイベントID
     * @param array $participantIds 参加者の学籍番号配列
     * @return bool 成功したらtrue
     */
    public function addParticipants(string $googleEventId, array $participantIds): bool
    {
        if (empty($participantIds)) {
            return true;
        }
        
        $placeholders = implode(',', array_fill(0, count($participantIds), '(?, ?)'));
        $params = [];
        foreach ($participantIds as $userId) {
            $params[] = $userId;
            $params[] = $googleEventId;
        }
        
        $stmt = $this->db->prepare(
            "INSERT INTO user_events (user_id, google_event_id) VALUES {$placeholders}"
        );
        return $stmt->execute($params);
    }

    /**
     * イベントの参加者を更新（既存を削除して新規追加）
     * 
     * @param string $googleEventId GoogleカレンダーのイベントID
     * @param array $participantIds 参加者の学籍番号配列
     * @return bool 成功したらtrue
     */
    public function updateParticipants(string $googleEventId, array $participantIds): bool
    {
        // 既存の参加者を削除
        $deleteStmt = $this->db->prepare('DELETE FROM user_events WHERE google_event_id = ?');
        $deleteStmt->execute([$googleEventId]);
        
        // 新しい参加者を追加
        return $this->addParticipants($googleEventId, $participantIds);
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

    /**
     * DBのイベント情報を更新
     * 
     * @param string $googleEventId 更新対象のGoogleイベントID
     * @param array $data 更新データ
     * @return bool 成功したらtrue
     */
    public function update(string $googleEventId, array $data): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE events 
             SET title = ?, 
                 description = ?, 
                 visibility = ?, 
                 start_time = ?, 
                 end_time = ? 
             WHERE google_event_id = ?'
        );
        return $stmt->execute([
            $data['title'],
            $data['description'],
            $data['visibility'],
            $data['start_time'],
            $data['end_time'],
            $googleEventId,
        ]);
    }

    /**
     * DBのイベントを削除
     * 
     * @param string $googleEventId 削除対象のGoogleイベントID
     * @return bool 成功したらtrue
     */
    public function delete(string $googleEventId): bool
    {
        // まず参加者情報を削除
        $deleteParticipants = $this->db->prepare('DELETE FROM user_events WHERE google_event_id = ?');
        $deleteParticipants->execute([$googleEventId]);
        
        // イベント本体を削除
        $stmt = $this->db->prepare('DELETE FROM events WHERE google_event_id = ?');
        return $stmt->execute([$googleEventId]);
    }

    /**
     * フィルター条件付きでイベントを取得
     * 
     * @param array $filters フィルター条件
     *   - user_id: ユーザーID（参加者またはpublic）
     *   - title: タイトル（部分一致）
     *   - description: 説明（部分一致）
     *   - start_date: 開始日（以降）
     *   - end_date: 終了日（以前）
     *   - visibility: 公開範囲
     * @return array
     */
    public function findWithFilters(array $filters): array
    {
        $conditions = [];
        $params = [];

        // ベースSQL
        $sql = "
            SELECT 
                e.google_event_id,
                e.title,
                e.start_time,
                e.end_time,
                e.description,
                e.visibility,
                ue.user_id as participant_id,
                u.name as participant_name
            FROM events e
            LEFT JOIN user_events ue ON e.google_event_id = ue.google_event_id
            LEFT JOIN users u ON ue.user_id = u.user_id
        ";

        // user_idフィルター：ユーザーが参加しているイベント または publicイベント
        if (!empty($filters['user_id'])) {
            $conditions[] = "(
                e.google_event_id IN (
                    SELECT google_event_id 
                    FROM user_events 
                    WHERE user_id = ?
                ) 
                OR e.visibility = 'public'
            )";
            $params[] = $filters['user_id'];
        }

        // titleフィルター（部分一致）
        if (!empty($filters['title'])) {
            $conditions[] = "e.title LIKE ?";
            $params[] = '%' . $filters['title'] . '%';
        }

        // descriptionフィルター（部分一致）
        if (!empty($filters['description'])) {
            $conditions[] = "e.description LIKE ?";
            $params[] = '%' . $filters['description'] . '%';
        }

        // start_dateフィルター（指定日以降のイベント）
        if (!empty($filters['start_date'])) {
            $conditions[] = "e.start_time >= ?";
            $params[] = $filters['start_date'];
        }

        // end_dateフィルター（指定日以前のイベント）
        if (!empty($filters['end_date'])) {
            $conditions[] = "e.end_time <= ?";
            $params[] = $filters['end_date'];
        }

        // visibilityフィルター
        if (!empty($filters['visibility'])) {
            $conditions[] = "e.visibility = ?";
            $params[] = $filters['visibility'];
        }

        // WHERE句を構築
        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(' AND ', $conditions);
        }

        $sql .= " ORDER BY e.start_time, e.google_event_id, u.name";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}
