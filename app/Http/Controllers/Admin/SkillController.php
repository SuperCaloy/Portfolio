<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SkillRequest;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkillController extends Controller
{
    // Fixed category order, matches the enum and the public Tech section grouping
    protected const CATEGORY_ORDER = ['Backend', 'Frontend', 'Database', 'DevOps', 'Tools'];

    // List skills, grouped by fixed category order then alphabetically, supports search and pagination
    public function index(Request $request)
    {
        $categoryOrder = implode(',', array_map(fn ($c) => "'{$c}'", self::CATEGORY_ORDER));

        $skills = Skill::when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderByRaw("FIELD(category, {$categoryOrder})")
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Skills', [
            'skills' => $skills,
            'filters' => $request->only('search'),
        ]);
    }

    // Create a new skill
    public function store(SkillRequest $request)
    {
        Skill::create($request->validated());

        return redirect()->back()->with('success', 'Skill added.');
    }

    // Update an existing skill
    public function update(SkillRequest $request, Skill $skill)
    {
        $skill->update($request->validated());

        return redirect()->back()->with('success', 'Skill updated.');
    }

    // Delete a skill
    public function destroy(Skill $skill)
    {
        $skill->delete();

        return redirect()->back()->with('success', 'Skill deleted.');
    }

    // Create a skill inline from the Projects tech stack input, minimal fields only
    public function quickAdd(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', 'unique:skills,name'],
        ]);

        $skill = Skill::create([
            'name' => $validated['name'],
            'category' => 'Tools',
        ]);

        return response()->json(['name' => $skill->name]);
    }
}