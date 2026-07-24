<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ExperienceRequest;
use App\Models\Experience;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    // List all experiences ordered by most recent start date
    public function index()
    {
        return Inertia::render('Admin/Experience', [
            'experiences' => Experience::orderBy('start_date', 'desc')->get(),
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