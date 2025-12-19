<?php 

namespace KAMAGI\SootRepositories;

use Google\Service\Calendar as GSCalendar;
use Google\Service\Calendar\Event as CalendarEvent;
use Google\Service\Calendar\EventDateTime as EventDateTime;

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
                'event_id' => $item->getId(),
                'start_time' => $item->getStart()->getDateTime(),
                'end_time' => $item->getEnd()->getDateTime(),
            ];
            $events[] = $eventData;
        }
        return $events;
    }

    /**
     * イベントIDからイベント取得
     * 
     * @param string $eventId
     * @return array<string, mixed>|null
     */
    public function findByEventId(string $eventId): ?array {
        $event = $this->service->events->get(CALENDAR_ID, $eventId);
        if (!$event) return null;
        return [
            'title' => $event->getSummary(),
            'description' => $event->getDescription(),
            'event_id' => $event->getId(),
            'start_time' => $event->getStart()->getDateTime(),
            'end_time' => $event->getEnd()->getDateTime(),
            'updated_at' => $event->getUpdated(),
            'created_at' => $event->getCreated(),
        ];
    }

    /**
     * イベント作成
     * 
     * @param array<string, mixed> $eventData
     * @return string 作成したイベントId
     */
    public function create(array $eventData): string {
        $event = new CalendarEvent();
        $event->setSummary($eventData['title']);
        $event->setDescription($eventData['description']);
    
        $start = new EventDateTime();
        $start->setDateTime($this->ToRFC($eventData['start_time']));
        $event->setStart($start);

        $end = new EventDateTime();
        $end->setDateTime($this->ToRFC($eventData['end_time']));
        $event->setEnd($end);
        $createdEvent = $this->service->events->insert(CALENDAR_ID, $event);

        return $createdEvent->getId();
    }

    /**
     * イベント更新
     * 
     * @param string $eventId
     * @param array<string, mixed> $eventData
     * @return bool 成功したらtrue
     */    
    public function update(string $eventId, array $eventData): bool {
        $event = $this->service->events->get(CALENDAR_ID, $eventId);
        $event->setSummary($eventData['title']);
        $event->setDescription($eventData['description']);

        $start = new EventDateTime();
        $start->setDateTime($this->ToRFC($eventData['start_time']));
        $event->setStart($start);

        $end = new EventDateTime();
        $end->setDateTime($this->ToRFC($eventData['end_time']));
        $event->setEnd($end);

        $updatedEvent = $this->service->events->update(CALENDAR_ID, $eventId, $event);
        return $updatedEvent->getId();
    }

    /**
     * イベント削除
     * 
     * @param string $eventId
     * @return bool 成功したらtrue
     */
    public function delete(string $eventId): bool {
        $this->service->events->delete(CALENDAR_ID, $eventId);
        // ちゃんとした比較を実装する(serviceが空でないとか)
        return true;
    }

    public function ToRFC($date) {
        return (new \DateTime($date, new \DateTimeZone('Asia/Tokyo')))->format(\DateTime::RFC3339);
    }

}
