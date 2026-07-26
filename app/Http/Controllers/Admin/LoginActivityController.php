<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoginAttempt;
use Inertia\Inertia;
use Inertia\Response;

class LoginActivityController extends Controller
{
    public function index(): Response
    {
        $attempts = LoginAttempt::query()
            ->latest()
            ->limit(200)
            ->get();

        return Inertia::render('Admin/LoginActivity', [
            'attempts' => $attempts,
        ]);
    }
}