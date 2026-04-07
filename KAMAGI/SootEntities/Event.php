<?php

namespace KAMAGI\SootEntities;
date_default_timezone_set('Asia/Tokyo');

/**
 * イベントエンティティ
 * 
 * イベントのデータ構造を表現するクラス
 */
class Event
{
    public string $title;
    public string $description;
    public string $eventId;
    public string $visibility;
    public string $start_time;
    public string $end_time;
    public string $updated_at;
    public string $created_at;


    public function __construct(array $data)
    {
        $this->title = $data['title'] ?? 'No title';
        $this->description = $data['description'] ?? 'No description';
        $this->eventId = $data['event_id'];
        $this->visibility = $data['visibility'] ?? 'private';
        $this->start_time = $data['start_time'];
        $this->end_time = $data['end_time'];
        $this->updated_at = $data['updated_at'];
        $this->created_at = $data['created_at'];
    }

    /**
     * イベント情報を配列で返す
     * 
     * @return array {
     *      title: string, 
     *      description: string, 
     *      event_id: string, 
     *      visibility: string, 
     *      start_time: string, 
     *      end_time: string, 
     *      updated_at: string, 
     *      created_at: string
     *  }
     */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'event_id' => $this->eventId,
            'visibility' => $this->visibility,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'updated_at' => $this->updated_at,
            'created_at' => $this->created_at,
        ];
    }
}
