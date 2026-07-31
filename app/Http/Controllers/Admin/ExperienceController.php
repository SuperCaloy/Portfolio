<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ExperienceRequest;
use App\Models\Experience;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    // List experiences, most recent start date first, supports search and pagination
    public function index(Request $request)
    {
        $experiences = Experience::when($request->search, function ($query, $search) {
                $query->where('role', 'like', "%{$search}%")
                      ->orWhere('company', 'like', "%{$search}%");
            })
            ->orderBy('start_date', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Experience', [
            'experiences' => $experiences,
            'filters' => $request->only('search'),
        ]);
    }

    // Create a new experience entry
    public function store(ExperienceRequest $request)
    {
        Experience::create($request->validated());

        return redirect()->back()->with('success', 'Experience added.');
    }

    // Update an existing experience entry
    public function update(ExperienceRequest $request, Experience $experience)
    {
        $experience->update($request->validated());

        return redirect()->back()->with('success', 'Experience updated.');
    }

    // Delete an experience entry
    public function destroy(Experience $experience)
    {
        $experience->delete();

        return redirect()->back()->with('success', 'Experience deleted.');
    }
}