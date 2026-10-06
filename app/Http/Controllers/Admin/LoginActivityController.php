<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\Searchable;
use App\Http\Controllers\Controller;
use App\Models\LoginAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoginActivityController extends Controller
{
    use Searchable;

    // Lists login attempts, newest first, supports search by IP or status and pagination
    public function index(Request $request): Response
    {
        $query = LoginAttempt::query();
        $this->applySearch($query, $request->search, ['ip_address', 'status']);

        $attempts = $query->latest()
            ->paginate(30)
            ->withQueryString();

        return Inertia::render('Admin/LoginActivity', [
            'attempts' => $attempts,
            'filters' => $request->only('search'),
        ]);
    }
}