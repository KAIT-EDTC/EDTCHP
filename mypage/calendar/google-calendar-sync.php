<?php
require_once __DIR__ . '/functions.php';
require_once __DIR__ . '/vendor/autoload.php';
use Google\Service\Calendar as Google_Service_Calendar;
use Google\Service\Calendar\EventDateTime as Google_Service_Calendar_EventDateTime;
use Google\Service\Calendar\Event as Google_Service_Calendar_Event;
use Google\Service\Calendar\EventExtendedProperties as Google_Service_Calendar_EventExtendedProperties;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
define('CALENDAR_ID', $_ENV['CALENDAR_ID']);
define('JSON_PATH', __DIR__.'/key/push-event-test-451408-0f871f466586.json');

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
            'timeMin' => date('c'),
            'timeZone' => 'Asia/Tokyo'
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
        $DBUpdates = []; // DB側の更新があったイベント
        $calendarUpdates = []; // カレンダー側の更新があったイベント
        $missingInCalendar = []; // DBにはあるがカレンダーにはないイベント
        $missingInDb = []; // カレンダーにはあるがDBにないイベント

        // calendar_event_idをキーとする連想配列を作成
        $dbEventsById = [];
        foreach ($dbEvents as $dbEvent) {
            if (!empty($dbEvent['calendar_event_id'])) {
                $dbEventsById[$dbEvent['calendar_event_id']] = $dbEvent;
            } else {
                // イベントIdがないのはDBで追加した時なので、カレンダーには該当のイベントは存在しない
                $missingInCalendar[] = $dbEvent;
            }
        }

        // created_atが現在の日時より前のイベントを削除
        $now = (new DateTime('now', new DateTimeZone('Asia/Tokyo')))->format('Y-m-d H:i:s');
        $stmt = $this->db->prepare("DELETE FROM events WHERE end_time < ?");
        $stmt->execute([$now]);

        // DBにはあるがカレンダーにはないイベント
        $calendarEventIds = array_column($calendarEvents, 'id'); // カレンダーイベントのID一覧を取得
        foreach ($dbEventsById as $dbEvent) {
        if (!in_array($dbEvent['calendar_event_id'], $calendarEventIds)) {
                $missingInCalendar[] = $dbEvent; //削除されたイベントを追加
            }
        }

        foreach ($calendarEvents as $calendarEvent) {
            $calendarEventId = $calendarEvent['id'];

            // DBにカレンダーのイベントが存在しない場合
            if (empty($dbEventsById[$calendarEventId])) {
                $missingInDb[] = $calendarEvent;
                continue;
            }

            // DBにカレンダーのイベントが存在する
            $dbEvent = $dbEventsById[$calendarEventId];
            
            // 内容が異なる場合
            $isEventUpdated = $dbEvent['title'] !== $calendarEvent['title'] ||
                              $dbEvent['description'] !== $calendarEvent['description'] ||
                              ToRFC($dbEvent['start_time']) !== ToRFC($calendarEvent['start_time']) ||
                              ToRFC($dbEvent['end_time']) !== ToRFC($calendarEvent['end_time']) ||
                              $dbEvent['participants'] !== $calendarEvent['participants'];
            
            if (!$isEventUpdated) continue;

            // DB側とカレンダー側の更新日時を比較
            $dbUpdated = new DateTime($dbEvent['updated_at'], new DateTimeZone('Asia/Tokyo')); // DBはタイムゾーンを指定できないためここで指定
            $calUpdated = new DateTime($calendarEvent['updated_at']);

            // 更新日時が新しい方の変更を優先する
            if ($dbUpdated > $calUpdated) { // DB側の更新を優先
                $DBUpdates[] = [
                    'db_event' => $dbEvent,
                    'calendar_event' => $calendarEvent,
                ];
            } else { // カレンダー側の更新を優先
                $calendarUpdates[] = [
                    'db_event' => $dbEvent,
                    'calendar_event' => $calendarEvent,
                ];
            }
        }

        return [
            'DB_updates' => $DBUpdates,
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
        if (!empty($comparison['calendar_updates'])) {
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
                $startTime = new DateTime($calEvent['start_time'], new DateTimeZone('Asia/Tokyo'));
                $endTime = new DateTime($calEvent['end_time'], new DateTimeZone('Asia/Tokyo'));
                
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
        if (!empty($comparison['missing_in_db'])) {
            foreach ($comparison['missing_in_db'] as $missingInDb) {
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
        if (!empty($comparison['DB_updates'])) {
            foreach ($comparison['DB_updates'] as $update) {
                $this->updateCalendarEvent($update['db_event']);
            }
        }
        
        // DBにあってカレンダーにないイベントの場合
        if (!empty($comparison['missing_in_calendar'])) {
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

    public function deleteEvent($calendar_event_id)
    {
        try {
            // カレンダーから削除
            $this->service->events->delete(CALENDAR_ID, $calendar_event_id);
        } catch (Exception $e) {
            // カレンダー側で既に削除済みなどのケースもあるので、エラーは握りつぶす
            ErrorAlert($e->getMessage());
        }
        
        try {
            // DBから削除
            $stmt = $this->db->prepare("DELETE FROM events WHERE calendar_event_id = ?");
            $stmt->execute([$calendar_event_id]);
        } catch (Exception $e) {
            ErrorAlert($e->getMessage());
        }
    }
}
?>
