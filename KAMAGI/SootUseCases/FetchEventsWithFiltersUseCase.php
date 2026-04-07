<?php

namespace KAMAGI\SootUseCases;

use KAMAGI\SootRepositories\EventRepository;

/**
 * フィルター付きイベント取得ユースケース
 * 
 * フィルター条件に基づいてイベントを取得
 */
class FetchEventsWithFiltersUseCase
{
    private EventRepository $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    /**
     * フィルター条件付きでイベントを取得
     * 
     * @param array $filters フィルター条件
     * @return array{success: bool, message?: string, events?: array}
     */
    public function execute(array $filters): array
    {
        // フィルターがない場合は全イベントを取得
        $results = $this->eventRepository->findWithFilters($filters);

        if (!$results) {
            return [
                'success' => true,
                'message' => 'No events found with the specified filters',
                'events' => [],
            ];
        }

        // 結果を整形（参加者をグループ化）
        $events = [];
        foreach ($results as $row) {
            $eid = $row['google_event_id'];
            
            if (!isset($events[$eid])) {
                $events[$eid] = [
                    'id' => $row['google_event_id'],
                    'title' => $row['title'],
                    'start' => $row['start_time'],
                    'end' => $row['end_time'],
                    'description' => $row['description'],
                    'visibility' => $row['visibility'],
                    'participants' => []
                ];
            }
            
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
