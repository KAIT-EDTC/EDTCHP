<?php

namespace KAMAGI\SootControllers;

use KAMAGI\SootUseCases\FetchEventsWithFiltersUseCase;
use KAMAGI\SootServices\EventService;
use KAMAGI\SootResources\Response;

class EventController extends BaseController
{
    private FetchEventsWithFiltersUseCase $fetchEventsWithFiltersUseCase;

    private EventService $userEventService;

    public function __construct(
        FetchEventsWithFiltersUseCase $fetchEventsWithFiltersUseCase,
        EventService $userEventService
    ) {
        $this->fetchEventsWithFiltersUseCase = $fetchEventsWithFiltersUseCase;
        $this->userEventService = $userEventService;
    }

    /**
     * フィルター条件付きでイベントを取得
     * 
     * サポートするフィルター:
     * - user_id: ユーザーID（参加者またはpublic）
     * - title: タイトル（部分一致）
     * - description: 説明（部分一致）
     * - start_date: 開始日（以降）
     * - end_date: 終了日（以前）
     * - visibility: 公開範囲
     */
    public function fetchWithFilters(): void
    {
        $this->validateMethod('GET');

        // フィルター条件を取得
        $filters = [
            'user_id' => htmlspecialchars($_GET['user_id'] ?? '', ENT_QUOTES, 'UTF-8'),
            'title' => htmlspecialchars($_GET['title'] ?? '', ENT_QUOTES, 'UTF-8'),
            'description' => htmlspecialchars($_GET['description'] ?? '', ENT_QUOTES, 'UTF-8'),
            'start_date' => htmlspecialchars($_GET['start_date'] ?? '', ENT_QUOTES, 'UTF-8'),
            'end_date' => htmlspecialchars($_GET['end_date'] ?? '', ENT_QUOTES, 'UTF-8'),
            'visibility' => htmlspecialchars($_GET['visibility'] ?? '', ENT_QUOTES, 'UTF-8'),
        ];

        $result = $this->fetchEventsWithFiltersUseCase->execute($filters);

        $statusCode = $result['success'] ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST;
        Response::json($statusCode, $result);
    }

    /**
     * 新しいイベントを作成
     * 
     * リクエストボディ:
     * - title: イベントタイトル（必須）
     * - description: イベントの説明
     * - visibility: 公開範囲 (public[全体]/private[参加メンバーのみ])
     * - start_time: 開始日時（必須）
     * - end_time: 終了日時（必須）
     * - participant_ids: 参加者の学籍番号配列（ない場合は公開範囲を全体にしてもいいかも）
     */
    public function store(): void
    {
        $this->validateMethod('POST');

        $input = $this->getRequestInput();

        $title = htmlspecialchars($input['title'] ?? '', ENT_QUOTES, 'UTF-8');
        $desc = htmlspecialchars($input['description'] ?? '', ENT_QUOTES, 'UTF-8');
        $visibility = htmlspecialchars($input['visibility'] ?? 'private', ENT_QUOTES, 'UTF-8');
        $start = htmlspecialchars($input['start_time'] ?? '', ENT_QUOTES, 'UTF-8');
        $end = htmlspecialchars($input['end_time'] ?? '', ENT_QUOTES, 'UTF-8');
        
        // 参加者の学籍番号配列を取得
        $participantIds = [];
        if (isset($input['participant_ids']) && is_array($input['participant_ids'])) {
            $participantIds = array_map(function($id) {
                return htmlspecialchars((string)$id, ENT_QUOTES, 'UTF-8');
            }, $input['participant_ids']);
        }

        // バリデーション
        if (empty($title)) {
            Response::json(Response::HTTP_BAD_REQUEST, [
                'success' => false,
                'message' => 'title is required',
            ]);
            return;
        }
        if (empty($start) || empty($end)) {
            Response::json(Response::HTTP_BAD_REQUEST, [
                'success' => false,
                'message' => 'start_time and end_time are required',
            ]);
            return;
        }

        $data = [
            'title' => $title,
            'description' => $desc,
            'visibility' => $visibility,
            'start_time' => $start,
            'end_time' => $end,
        ];

        $result = $this->userEventService->createEvent($data, $participantIds);

        $statusCode = $result['success'] ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST;
        Response::json($statusCode, $result);
    }

    /**
     * イベントを更新
     * 
     * リクエストボディ:
     * - google_event_id: GoogleカレンダーのイベントID（必須）
     * - title: イベントタイトル（必須）
     * - description: イベントの説明
     * - visibility: 公開範囲 (public[全体]/private[参加メンバーのみ])
     * - start_time: 開始日時（必須）
     * - end_time: 終了日時（必須）
     * - participant_ids: 参加者の学籍番号配列（オプション）
     */
    public function update(): void
    {
        $this->validateMethod('PUT');

        $input = $this->getRequestInput();

        $googleEventId = htmlspecialchars($input['google_event_id'] ?? '', ENT_QUOTES, 'UTF-8');
        $title = htmlspecialchars($input['title'] ?? '', ENT_QUOTES, 'UTF-8');
        $desc = htmlspecialchars($input['description'] ?? '', ENT_QUOTES, 'UTF-8');
        $visibility = htmlspecialchars($input['visibility'] ?? 'private', ENT_QUOTES, 'UTF-8');
        $start = htmlspecialchars($input['start_time'] ?? '', ENT_QUOTES, 'UTF-8');
        $end = htmlspecialchars($input['end_time'] ?? '', ENT_QUOTES, 'UTF-8');
        
        // 参加者の学籍番号配列を取得
        $participantIds = [];
        if (isset($input['participant_ids']) && is_array($input['participant_ids'])) {
            $participantIds = array_map(function($id) {
                return htmlspecialchars((string)$id, ENT_QUOTES, 'UTF-8');
            }, $input['participant_ids']);
        }

        // バリデーション
        if (empty($googleEventId)) {
            Response::json(Response::HTTP_BAD_REQUEST, [
                'success' => false,
                'message' => 'google_event_id is required',
            ]);
            return;
        }
        if (empty($title)) {
            Response::json(Response::HTTP_BAD_REQUEST, [
                'success' => false,
                'message' => 'title is required',
            ]);
            return;
        }
        if (empty($start) || empty($end)) {
            Response::json(Response::HTTP_BAD_REQUEST, [
                'success' => false,
                'message' => 'start_time and end_time are required',
            ]);
            return;
        }

        $data = [
            'title' => $title,
            'description' => $desc,
            'visibility' => $visibility,
            'start_time' => $start,
            'end_time' => $end,
        ];

        $result = $this->userEventService->updateEvent($googleEventId, $data, $participantIds);

        $statusCode = $result['success'] ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST;
        Response::json($statusCode, $result);
    }

    /**
     * イベントを削除
     * 
     * リクエストボディ:
     * - google_event_id: GoogleカレンダーのイベントID（必須）
     */
    public function destroy(): void
    {
        $this->validateMethod('DELETE');

        $input = $this->getRequestInput();

        $googleEventId = htmlspecialchars($input['google_event_id'] ?? '', ENT_QUOTES, 'UTF-8');

        if (empty($googleEventId)) {
            Response::json(Response::HTTP_BAD_REQUEST, [
                'success' => false,
                'message' => 'google_event_id is required',
            ]);
            return;
        }

        $result = $this->userEventService->deleteEvent($googleEventId);

        $statusCode = $result['success'] ? Response::HTTP_OK : Response::HTTP_BAD_REQUEST;
        Response::json($statusCode, $result);
    }
}
