<?php

namespace KAMAGI\SootUseCases;

use KAMAGI\SootRepositories\EventRepository;

/**
 * イベントユースケース
 * 
 * イベントに関するビジネスロジックを担当
 */
class FetchEventsByUserIdUseCase
{
    private EventRepository $showEventRepository;

    public function __construct(EventRepository $showEventRepository)
    {
        $this->showEventRepository = $showEventRepository;
    }

    /**
     * ユーザーIDからDBのイベントを取得
     * 
     * @param string $userId
     * @return array{success: bool, message?: string, events?: array}
     */
    public function execute(string $userId): array
    {
        if (empty($userId)) {
            return [
                'success' => false,
                'message' => 'Invalid User ID',
            ];
        }

        $results = $this->showEventRepository->findByUserId($userId);

        if (!$results) {
            return [
                'success' => false,
                'message' => 'No events found for user ID: ' . $userId,
            ];
        }

        $events = [];
        foreach ($results as $row) {
            $eid = $row['event_id'];
            
            // 初期化
            if (!isset($events[$eid])) {
                $events[$eid] = [
                    'id' => $row['event_id'],
                    'title' => $row['title'],
                    'start' => $row['start_time'],
                    'end' => $row['end_time'],
                    'description' => $row['description'],
                    'participants' => [] // Null => emptyに変更 
                ];
            }
            
            // よく見てくれこれはparticipant_idだよ
            if ($row['participant_id']) {
                $events[$eid]['participants'][] = [
                    'id' => $row['participant_id'],
                    'name' => $row['participant_name']
                ];
            }
        }

        $events = array_values($events);

        return [
            'success' => true,
            'events' => $events,
        ];
    }
}