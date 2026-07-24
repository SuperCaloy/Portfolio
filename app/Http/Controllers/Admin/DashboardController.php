<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Experience;
use App\Models\Certificate;
use App\Models\Message;
use App\Models\Skill;
use Inertia\Inertia;

class DashboardController extends Controller
{
    // Gather summary stats and recent unread messages for the admin overview
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'projects' => Project::count(),
                'experience' => Experience::count(),
                'certificates' => Certificate::count(),
                'unread_messages' => Message::where('is_read', false)->count(),
            ],
            'recentMessages' => Message::orderBy('created_at', 'desc')
                ->limit(5)
                ->get(['id', 'sender_name', 'subject', 'is_read', 'created_at']),
            'recentProject' => Project::latest()->first(),
            'recentExperience' => Experience::latest()->first(),
            'recentCertificate' => Certificate::latest()->first(),
            'availableSkills' => Skill::pluck('name'),
        ]);
    }
}