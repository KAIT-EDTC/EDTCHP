<?php

namespace KAMAGI\SootControllers;

use KAMAGI\SootUseCases\FetchEventsByUserIdUseCase;
use KAMAGI\SootServices\CreateEventsService;
use KAMAGI\SootResources\Response;

class EventController extends BaseController
{
    private FetchEventsByUserIdUseCase $eventUseCase;

    private CreateEventsService $userEventService;

    public function __construct(
        FetchEventsByUserIdUseCase $fetchEventstUseCase, 
        CreateEventsService $userEventService
    ) {
        $this->eventUseCase = $fetchEventstUseCase;
        $this->userEventService = $userEventService;
    }

    public function index(): void
    {
        $this->validateMethod('POST');

        // 認可チェックあってもいいかも
        
        $input = $this->getRequestInput();

        $user_id = htmlspecialchars($input['user_id'] ?? '', ENT_QUOTES, 'UTF-8');

        $result = $this->eventUseCase->execute($user_id);

        $statusCode = $result['success'] ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST;
        Response::json($statusCode, $result);
    }

    public function store(): void
    {
        $this->validateMethod('POST');

        $input = $this->getRequestInput();

        $title = htmlspecialchars($input['title'] ?? '', ENT_QUOTES, 'UTF-8');
        $desc = htmlspecialchars($input['description'] ?? '', ENT_QUOTES, 'UTF-8');
        $visibility = htmlspecialchars($input['visibility'] ?? '', ENT_QUOTES, 'UTF-8');
        $start = htmlspecialchars($input['start_time'] ?? '', ENT_QUOTES, 'UTF-8');
        $end = htmlspecialchars($input['end_time'] ?? '', ENT_QUOTES, 'UTF-8');

        $data = [
            'title' => $title,
            'description' => $desc,
            'visibility' => $visibility,
            'start_time' => $start,
            'end_time' => $end,
        ];

        $eventId = $this->userEventService->createEventsAtGoogleCalendar($data);
        $result = $this->userEventService->createEventsAtDatabase($eventId, $data);

        $statusCode = $result['success'] ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST;
        Response::json($statusCode, $result);
    }
}