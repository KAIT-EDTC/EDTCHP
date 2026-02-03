<?php 

namespace KAMAGI\SootRepositories;

use Google\Service\Calendar as GSCalendar;
use Google\Service\Calendar\Event as CalendarEvent;
use Google\Service\Calendar\EventDateTime as EventDateTime;
use Google\Service\Calendar\EventExtendedProperties as ExtendedProperties;

/**
 * イベントリポジトリ
 * 
 * GoogleCalendarとの操作を担当する
 */
class GoogleCalendarRepository {
    private \Google_Client $client;
    private GSCalendar $service;

    public function __construct() {
        $this->client = new \Google_Client();
        $this->client->setAuthConfig(JSON_PATH);
        $this->client->addScope(GSCalendar::CALENDAR);
        $this->service = new GSCalendar($this->client);
    }

    /**
     * イベント一覧取得
     * 
     * @return array<int, array<string, mixed>>|null
     */
    public function getAllEvents(): ?array {
        $optParams = [
            'maxResults' => 100,
            'orderBy' => 'startTime',
            'singleEvents' => true,
            'timeMin' => date('c'),
        ];
        $results = $this->service->events->listEvents(CALENDAR_ID, $optParams);
        $items = $results->getItems();

        if (empty($items)) return null;
        
        $events = [];
        foreach ($items as $item) {
            $eventData = [
                'title' => $item->getSummary(),
                'description' => $item->getDescription(),
                'google_event_id' => $item->getId(),
                'start_time' => $item->getStart()->getDateTime(),
                'end_time' => $item->getEnd()->getDateTime(),
            ];
            
            // extendedPropertiesから参加者IDを取得
            $extProps = $item->getExtendedProperties();
            if ($extProps && $extProps->getShared()) {
                $shared = $extProps->getShared();
                if (isset($shared['participant_ids'])) {
                    $eventData['participant_ids'] = json_decode($shared['participant_ids'], true);
                }
            }
            
            $events[] = $eventData;
        }
        return $events;
    }

    /**
     * イベントIDからイベント取得
     * 
     * @param string $googleEventId
     * @return array<string, mixed>|null
     */
    public function findByEventId(string $googleEventId): ?array {
        $event = $this->service->events->get(CALENDAR_ID, $googleEventId);
        if (!$event) return null;
        
        $result = [
            'title' => $event->getSummary(),
            'description' => $event->getDescription(),
            'google_event_id' => $event->getId(),
            'start_time' => $event->getStart()->getDateTime(),
            'end_time' => $event->getEnd()->getDateTime(),
            'updated_at' => $event->getUpdated(),
            'created_at' => $event->getCreated(),
        ];
        
        // extendedPropertiesから参加者IDを取得
        $extProps = $event->getExtendedProperties();
        if ($extProps && $extProps->getShared()) {
            $shared = $extProps->getShared();
            if (isset($shared['participant_ids'])) {
                $result['participant_ids'] = json_decode($shared['participant_ids'], true);
            }
        }
        
        return $result;
    }

    /**
     * イベント作成（参加者情報をextendedPropertiesに格納）
     * 
     * @param array<string, mixed> $eventData イベントデータ
     * @param array<string> $participantIds 参加者の学籍番号配列
     * @param array<string> $participantNames 参加者名配列（description表示用）
     * @return string 作成したイベントId
     */
    public function create(array $eventData, array $participantIds = [], array $participantNames = []): string {
        $event = new CalendarEvent();
        $event->setSummary($eventData['title']);
        
        // 参加メンバーを詳細に記載
        $description = $eventData['description'] ?? '';
        if (!empty($participantNames)) {
            $description .= "\n\n---\n【参加メンバー】\n" . implode("\n", $participantNames);
        }
        $event->setDescription($description);
    
        $start = new EventDateTime();
        $start->setDateTime($this->ToRFC($eventData['start_time']));
        $event->setStart($start);

        $end = new EventDateTime();
        $end->setDateTime($this->ToRFC($eventData['end_time']));
        $event->setEnd($end);
        
        // extendedPropertiesに参加メンバーIdを設定
        if (!empty($participantIds)) {
            $extendedProps = new ExtendedProperties();
            $extendedProps->setShared([
                'system_source' => 'circle_manager_v1',
                'participant_ids' => json_encode($participantIds)
            ]);
            $event->setExtendedProperties($extendedProps);
        }
        
        $createdEvent = $this->service->events->insert(CALENDAR_ID, $event);

        return $createdEvent->getId();
    }

    /**
     * イベント更新（参加者情報をextendedPropertiesに格納）
     * 
     * @param string $googleEventId
     * @param array<string, mixed> $eventData
     * @param array<string> $participantIds 参加者の学籍番号配列
     * @param array<string> $participantNames 参加者名配列（description表示用）
     * @return bool 成功したらtrue
     */    
    public function update(string $googleEventId, array $eventData, array $participantIds = [], array $participantNames = []): bool {
        $event = $this->service->events->get(CALENDAR_ID, $googleEventId);
        $event->setSummary($eventData['title']);
        
        // 参加メンバーを詳細に記載
        $description = $eventData['description'] ?? '';
        if (!empty($participantNames)) {
            $description .= "\n\n---\n【参加メンバー】\n" . implode("\n", $participantNames);
        }
        $event->setDescription($description);

        $start = new EventDateTime();
        $start->setDateTime($this->ToRFC($eventData['start_time']));
        $event->setStart($start);

        $end = new EventDateTime();
        $end->setDateTime($this->ToRFC($eventData['end_time']));
        $event->setEnd($end);
        
        // extendedPropertiesに参加メンバーIdを設定
        if (!empty($participantIds)) {
            $extendedProps = new ExtendedProperties();
            $extendedProps->setShared([
                'system_source' => 'circle_manager_v1',
                'participant_ids' => json_encode($participantIds)
            ]);
            $event->setExtendedProperties($extendedProps);
        }

        $updatedEvent = $this->service->events->update(CALENDAR_ID, $googleEventId, $event);
        return $updatedEvent->getId();
    }

    /**
     * イベント削除
     * 
     * @param string $googleEventId
     * @return bool 成功したらtrue
     */
    public function delete(string $googleEventId): bool {
        $this->service->events->delete(CALENDAR_ID, $googleEventId);
        // ちゃんとした比較を実装する(serviceが空でないとか)
        return true;
    }

    public function ToRFC($date) {
        return (new \DateTime($date, new \DateTimeZone('Asia/Tokyo')))->format(\DateTime::RFC3339);
    }

}
