<?php
// 必要なライブラリをインポート
require_once 'functions.php';
use Google\Service\Calendar as Google_Service_Calendar;
use Google\Service\Calendar\EventDateTime as Google_Service_Calendar_EventDateTime;
use Google\Service\Calendar\Event as Google_Service_Calendar_Event;
use Google\Service\Calendar\EventExtendedProperties as Google_Service_Calendar_EventExtendedProperties;

class GoogleCalendarSync {
    private $client;
    private $service;
    private $db;
    
    public function __construct($dbConnection) {
        $this->db = $dbConnection;
        $this->initializeClient();
    }
    
    // Google APIクライアントの初期化
    private function initializeClient() {
        $this->client = new Google_Client();
        $this->client->setApplicationName('Calendar Sync Application');
        $this->client->setScopes(Google_Service_Calendar::CALENDAR_EVENTS);
        $this->client->setAuthConfig(JSON_PATH);
        
        $this->service = new Google_Service_Calendar($this->client);
    }
    
    // データベースからイベントデータを取得
    public function getEventsFromDB() {
        $stmt = $this->db->prepare("SELECT event_id, title, description, start_time, end_time, calendar_event_id, updated_at, participants FROM events");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // カレンダーとDBの双方向の同期をする
    public function performBidirectionalSync() {
        // カレンダーからDBへの同期
        $this->syncFromCalendarToDB();
        
        // DBからカレンダーへの同期
        $this->syncFromDBToCalendar();
    }
    // Google Calendarからイベントデータを取得
    public function getEventsFromCalendar() {
        $events = [];
        $optParams = [
            'maxResults' => 100,
            'orderBy' => 'startTime',
            'singleEvents' => true,
            'timeMin' => date('c', strtotime('-2 month')), // 直近2ヶ月のイベントを取得
        ];
        
        $results = $this->service->events->listEvents(CALENDAR_ID, $optParams);
        
        foreach ($results->getItems() as $event) {
            $startDateTime = $event->getStart()->getDateTime();
            if (empty($startDateTime)) {
                $startDateTime = $event->getStart()->getDate();
            }
            
            $endDateTime = $event->getEnd()->getDateTime();
            if (empty($endDateTime)) {
                $endDateTime = $event->getEnd()->getDate();
            }

            $updatedAt = $event->getUpdated();
            
            // イベントIdによる連想配列を作っている
            // ex: $event->getId()が12345abcだとして、12345abcというキーに情報を入れている。
            $events[$event->getId()] = [
                'id' => $event->getId(),
                'title' => $event->getSummary(),
                'description' => $event->getDescription(),
                'start_time' => $startDateTime,
                'end_time' => $endDateTime,
                'updated_at' => $updatedAt,
                'participants' => $event['extendedProperties']['private']['participants'] ?? null
            ];
        }
        
        return $events;
    }

    // 更新日時による比較で変更があるイベントを抽出
    public function compareEvents($dbEvents, $calendarEvents) {
        $updates = []; // DB側の更新があったイベント
        $calendarUpdates = []; // カレンダー側の更新があったイベント
        $missingInCalendar = []; // DBにはあるがカレンダーにはないイベント
        $missingInDb = []; // カレンダーにはあるがDBにないイベント

        // DBイベントをキーとした配列を作成し、
        $dbEventsById = [];
        foreach ($dbEvents as $dbEvent) {
            if (!empty($dbEvent['calendar_event_id'])) {
                $dbEventsById[$dbEvent['calendar_event_id']] = $dbEvent;
            } else {
                // イベントIdがないのはDBで追加した時なので、カレンダーには該当のイベントは存在しない
                $missingInCalendar[] = $dbEvent;
            }
        }

        // TODO: ネストがきもいので最適化をする
        foreach ($calendarEvents as $calendarEvent) {
            $calendarEventId = $calendarEvent['id'];

            if (isset($dbEventsById[$calendarEventId])) {
                $dbEvent = $dbEventsById[$calendarEventId];
                // カレンダーイベントIDがある場合、DBに存在するか確認

                // DB側とカレンダー側の更新日時を比較
                $dbUpdated = new DateTime($dbEvent['updated_at']);
                $calUpdated = new DateTime($calendarEvent['updated_at']);

                // 内容が異なる場合
                if ($dbEvent['title'] != $calendarEvent['title'] ||
                    $dbEvent['description'] != $calendarEvent['description'] ||
                    $dbEvent['start_time'] != $calendarEvent['start_time'] ||
                    $dbEvent['end_time'] != $calendarEvent['end_time'] ||
                    $dbEvent['participants'] != $calendarEvent['participants']) {

                    // DB側の更新が新しい場合のみ更新対象とする
                    if ($dbUpdated > $calUpdated) {
                        $updates[] = [
                            'db_event' => $dbEvent,
                            'calendar_event' => $calendarEvent,
                        ];
                    } else {
                        // カレンダー側の更新が新しい場合は、別のリストに追加
                        // （後でカレンダー→DBの同期で使用）
                        $calendarUpdates[] = [
                            'db_event' => $dbEvent,
                            'calendar_event' => $calendarEvent,
                        ];
                    }
                }
            } else {
                // DBに存在しない場合
                $missingInDb[] = $calendarEvent;
            }
        }

        return [
            'updates' => $updates,
            'calendar_updates' => $calendarUpdates,
            'missing_in_calendar' => $missingInCalendar,
            'missing_in_db' => $missingInDb
        ];
    }

    /* MARK: カレンダー->DBの更新 */
    
    public function syncFromCalendarToDB() {
        $dbEvents = $this->getEventsFromDB();
        $calendarEvents = $this->getEventsFromCalendar();

        $comparison = $this->compareEvents($dbEvents, $calendarEvents);
        
        // カレンダー側で更新があった場合
        if (isset($comparison['calendar_updates'])) {
            foreach ($comparison['calendar_updates'] as $update) {
                $dbEvent = $update['db_event'];
                $calEvent = $update['calendar_event'];
                
                // DBを更新
                $stmt = $this->db->prepare("
                    UPDATE events 
                    SET title = ?, 
                        description = ?, 
                        start_time = ?, 
                        end_time = ?,
                        participants = ?
                    WHERE event_id = ?
                ");
                
                // Google Calendarの日時形式をDBの形式に変換
                $startTime = new DateTime($calEvent['start_time']);
                $endTime = new DateTime($calEvent['end_time']);
                
                $stmt->execute([
                    $calEvent['title'],
                    $calEvent['description'],
                    $startTime->format('Y-m-d H:i:s'),
                    $endTime->format('Y-m-d H:i:s'),
                    $calEvent['participants'],
                    $dbEvent['event_id']
                ]);
            }
        }
        
        // カレンダーにあってDBにないイベントの場合
        if (isset($comparison['missing_in_db'])) {
            foreach ($comparison['missing_in_db'] as $missingInDb) {
                // FIXME:こいつはparticipantsを持っていないため、NULLで許可してDB側で設定してあげる必要がある。

                $stmt = $this->db->prepare("
                    INSERT INTO events (title, description, start_time, end_time, calendar_event_id, participants) 
                    VALUES (?, ?, ?, ?, ?, ?)
                ");
                
                // カレンダーのISO8601形式をMySQLのDateTime形式に変換
                $startTime = new DateTime($missingInDb['start_time']);
                $endTime = new DateTime($missingInDb['end_time']);
                
                $stmt->execute([
                    $missingInDb['title'],
                    $missingInDb['description'],
                    $startTime->format('Y-m-d H:i:s'),
                    $endTime->format('Y-m-d H:i:s'),
                    $missingInDb['id'],
                    $missingInDb['participants'] ?? null
                ]);
            }
        }
    }

    /* MARK: DB->カレンダーの更新 */
    
    public function syncFromDBToCalendar() {
        $dbEvents = $this->getEventsFromDB();
        $calendarEvents = $this->getEventsFromCalendar();
        
        $comparison = $this->compareEvents($dbEvents, $calendarEvents);
        
        // DB側で更新があった場合
        if (isset($comparison['updates'])) {
            foreach ($comparison['updates'] as $update) {
                $this->updateCalendarEvent($update['db_event']);
            }
        }
        
        // DBにあってカレンダーにないイベントの場合
        if (isset($comparison['missing_in_calendar'])) {
            foreach ($comparison['missing_in_calendar'] as $missing) {
                $this->createCalendarEvent($missing);
            }
        }
    }

    
    // Google Calendarのイベントを更新
    public function updateCalendarEvent($dbEvent) {
        $event = $this->service->events->get(CALENDAR_ID, $dbEvent['calendar_event_id']);
        
        $event->setSummary($dbEvent['title']);
        $event->setDescription($dbEvent['description']);
        
        // 時刻のフォーマットはRFC3339にしないと400が返ってくる
        $startDateTime = new Google_Service_Calendar_EventDateTime();
        $startDateTime->setDateTime(ToRFC($dbEvent['start_time']));
        $event->setStart($startDateTime);
        
        $endDateTime = new Google_Service_Calendar_EventDateTime();
        $endDateTime->setDateTime(ToRFC($dbEvent['end_time']));
        $event->setEnd($endDateTime);
        
        $extendedProperties = new Google_Service_Calendar_EventExtendedProperties();
        $extendedProperties->setPrivate(['participants' => $dbEvent['participants']]);
        $event->setExtendedProperties($extendedProperties);
        
        $this->service->events->update(CALENDAR_ID, $event->getId(), $event);
    }
    
    // Google Calendarに新しいイベントを作成
    public function createCalendarEvent($dbEvent) {
        $event = new Google_Service_Calendar_Event();
        $event->setSummary($dbEvent['title']);
        $event->setDescription($dbEvent['description']);
        
        // 時刻のフォーマットはRFC3339にしないと400が返ってくる
        $startDateTime = new Google_Service_Calendar_EventDateTime();
        $startDateTime->setDateTime(ToRFC($dbEvent['start_time']));
        $event->setStart($startDateTime);
        
        $endDateTime = new Google_Service_Calendar_EventDateTime();
        $endDateTime->setDateTime(ToRFC($dbEvent['end_time']));
        $event->setEnd($endDateTime);

        $extendedProperties = new Google_Service_Calendar_EventExtendedProperties();
        $extendedProperties->setPrivate(['participants' => $dbEvent['participants']]);
        $event->setExtendedProperties($extendedProperties);
        
        $createdEvent = $this->service->events->insert(CALENDAR_ID, $event);
        
        // DBで追加したイベントはイベントId(calendar_event_id)がNullであるため、カレンダーに追加した際に生成されるイベントIdを付与する。
        $stmt = $this->db->prepare("UPDATE events SET calendar_event_id = ? WHERE event_id = ?");
        $stmt->execute([$createdEvent->getId(), $dbEvent['event_id']]);
    }
}
?>
