<?php

namespace KAMAGI\SootServices;

use KAMAGI\SootRepositories\GoogleCalendarRepository;
use KAMAGI\SootRepositories\EventRepository;
use KAMAGI\SootRepositories\UserRepository;

class EventService {
    private GoogleCalendarRepository $GCRepository;
    private EventRepository $eventRepository;
    private UserRepository $userRepository;
    
    public function __construct(GoogleCalendarRepository $GCRepository, EventRepository $eventRepository, UserRepository $userRepository) {
        $this->GCRepository = $GCRepository;
        $this->eventRepository = $eventRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * イベントを作成（GoogleカレンダーとDBの両方に登録）
     * 
     * @param array $data イベントデータ
     * @param array $participantIds 参加者の学籍番号配列
     * @return array 作成結果
     */
    public function createEvent(array $data, array $participantIds = []): array {
        // 1. DBから参加者の名前を取得
        $nameMap = $this->userRepository->getNamesByIds($participantIds);
        $participantNames = [];
        foreach ($participantIds as $userId) {
            $participantNames[] = $nameMap[$userId] ?? "不明なメンバー ({$userId})";
        }
        
        // 2. Googleカレンダーにイベント作成（extendedPropertiesに学籍番号、descriptionに名前）
        $googleEventId = $this->GCRepository->create($data, $participantIds, $participantNames);
        
        // 3. DBにイベント作成
        $this->eventRepository->create($googleEventId, $data);
        
        // 4. DBに参加者情報を登録
        if (!empty($participantIds)) {
            $this->eventRepository->addParticipants($googleEventId, $participantIds);
        }
        
        return [
            'success' => true,
            'message' => 'Event created successfully',
            'google_event_id' => $googleEventId,
            'participants' => array_map(function($id) use ($nameMap) {
                return [
                    'id' => $id,
                    'name' => $nameMap[$id] ?? "不明なメンバー"
                ];
            }, $participantIds)
        ];
    }

    /**
     * イベントを更新（GoogleカレンダーとDBの両方を更新）
     * 
     * @param string $googleEventId GoogleカレンダーのイベントID
     * @param array $data イベントデータ
     * @param array $participantIds 参加者の学籍番号配列
     * @return array 更新結果
     */
    public function updateEvent(string $googleEventId, array $data, array $participantIds = []): array {
        // 1. DBから参加者の名前を取得
        $nameMap = $this->userRepository->getNamesByIds($participantIds);
        $participantNames = [];
        foreach ($participantIds as $userId) {
            $participantNames[] = $nameMap[$userId] ?? "不明なメンバー ({$userId})";
        }
        
        // 2. Googleカレンダーのイベント更新
        $this->GCRepository->update($googleEventId, $data, $participantIds, $participantNames);
        
        // 3. DBのイベント更新
        $this->eventRepository->update($googleEventId, $data);
        
        // 4. DB参加者情報を更新
        $this->eventRepository->updateParticipants($googleEventId, $participantIds);
        
        return [
            'success' => true,
            'message' => 'Event updated successfully',
            'google_event_id' => $googleEventId,
            'participants' => array_map(function($id) use ($nameMap) {
                return [
                    'id' => $id,
                    'name' => $nameMap[$id] ?? "不明なメンバー"
                ];
            }, $participantIds)
        ];
    }

    /**
     * イベントを削除（GoogleカレンダーとDBの両方から削除）
     * 
     * @param string $googleEventId GoogleカレンダーのイベントID
     * @return array 削除結果
     */
    public function deleteEvent(string $googleEventId): array {
        // 1. Googleカレンダーからイベント削除
        $this->GCRepository->delete($googleEventId);
        
        // 2. DBからイベント削除（参加者情報も含む）
        $this->eventRepository->delete($googleEventId);
        
        return [
            'success' => true,
            'message' => 'Event deleted successfully',
        ];
    }
}
