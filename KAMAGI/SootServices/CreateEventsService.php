<?php

namespace KAMAGI\SootServices;

use KAMAGI\SootRepositories\GoogleCalendarRepository;
use KAMAGI\SootRepositories\EventRepository;

class CreateEventsService {
    private GoogleCalendarRepository $GCRepository;
    private EventRepository $eventRepository;
    public function __construct(GoogleCalendarRepository $GCRepository, EventRepository $eventRepository) {
        $this->GCRepository = $GCRepository;
        $this->eventRepository = $eventRepository;
    }

    /**
     * Google Calendarにイベントを登録する
     */
    public function createEventsAtGoogleCalendar(array $data): string {
        return $this->GCRepository->create($data);
    }
    /**
     * DBにイベントを登録する
     */
    public function createEventsAtDatabase(string $eventId, array $data): array {
        $this->eventRepository->create($eventId, $data);
        return [
            'success' => true,
            'message' => 'Event created successfully',
        ];
    }
}