<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreContactRequest;
use App\Services\ContactService;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function __construct(private ContactService $contactService) {}

    public function send(StoreContactRequest $request): JsonResponse
    {
        // 1. Anti-Bot Honeypot Check
        if ($request->filled('website')) {
            return response()->json([
                'success' => true,
                'message' => 'Your message has been sent successfully.',
            ], 200);
        }

        // 2. Delegate persistence and mail sending to service
        $this->contactService->handle($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Your message has been sent successfully.',
        ], 200);
    }
}