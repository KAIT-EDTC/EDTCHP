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
     * イベントIDからDBのイベントを取得
     * 
     * @param string $eventId
     * @return Event|null
     */
    public function findByEventId(string $eventId): ?Event
    {
        $stmt = $this->db->prepare('SELECT * FROM events WHERE event_id = ?');
        $stmt->execute([$eventId]);
        $data = $stmt->fetch();

        return $data ? new Event($data) : null;
    }

    /**
     * ユーザーIDからDBのイベントを取得
     * 
     * @param string $userId
     * @return array
     */
    public function findByUserId(string $userId): array
    {
        // sqlの意図を書く 
        $sql = "
                SELECT 
                    e.event_id,
                    e.title,
                    e.start_time,
                    e.end_time,
                    e.description,
                    ue.user_id as participant_id,
                    u.name as participant_name
                FROM events e
                LEFT JOIN user_events ue ON e.event_id = ue.event_id
                LEFT JOIN users u ON ue.user_id = u.user_id
                WHERE e.event_id IN (
                    SELECT event_id 
                    FROM user_events 
                    WHERE user_id = ?
                ) 
                OR e.visibility = 'public'
                ORDER BY e.event_id, u.name
            ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $results;
    }

    /**
     * DBで新規イベントを作成
     * 
     * @param string $eventId イベントID
     * @param array $data イベントデータ
     * @return bool 成功したらtrue
     */
    public function create(string $eventId, array $data): bool
    {
        $stmt = $this->db->prepare(
            'INSERT INTO events (title, description, visibility, event_id, start_time, end_time) 
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        return $stmt->execute([
            $data['title'],
            $data['description'],
            $data['visibility'],
            $eventId,
            $data['start_time'],
            $data['end_time'],
        ]);
    }

    /**
     * DBのイベント情報を更新
     * 
     * @param string $eventId 更新対象のイベントID
     * @param array $data 更新データ
     * @return bool 成功したらtrue
     */
    public function update(string $eventId, array $data): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE events 
             SET title = ?, 
                 description = ?, 
                 visibility = ?, 
                 start_time = ?, 
                 end_time = ? 
             WHERE event_id = ?'
        );
        return $stmt->execute([
            $data['title'],
            $data['description'],
            $data['visibility'],
            $data['start_time'],
            $data['end_time'],
            $eventId,
        ]);
    }

    /**
     * DBのイベントを削除
     * 
     * @param string $eventId 削除対象のイベントID
     * @return bool 成功したらtrue
     */
    public function delete(string $eventId): bool
    {
        $stmt = $this->db->prepare('DELETE FROM events WHERE event_id = ?');
        return $stmt->execute([$eventId]);
    }

}
