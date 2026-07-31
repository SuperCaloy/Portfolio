<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoginAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoginActivityController extends Controller
{
    // Lists login attempts, newest first, supports search by IP or status and pagination
    public function index(Request $request): Response
    {
        $attempts = LoginAttempt::query()
            ->when($request->search, function ($query, $search) {
                $query->where('ip_address', 'like', "%{$search}%")
                      ->orWhere('status', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(30)
            ->withQueryString();

        return Inertia::render('Admin/LoginActivity', [
            'attempts' => $attempts,
            'filters' => $request->only('search'),
        ]);
    }
}