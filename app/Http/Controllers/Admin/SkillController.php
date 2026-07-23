<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SkillRequest;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkillController extends Controller
{
    // List all skills ordered for display
    public function index()
    {
        return Inertia::render('Admin/Skills', [
            'skills' => Skill::orderBy('sort_order')->get(),
        ]);
    }

    // Create a new skill, appended to the end of the current order
    public function store(SkillRequest $request)
    {
        $data = $request->validated();
        $data['sort_order'] = Skill::max('sort_order') + 1;

        Skill::create($data);

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

    // Persist new display order after a drag and drop reorder
    public function reorder(Request $request)
    {
        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:skills,id'],
        ]);

        foreach ($request->order as $index => $id) {
            Skill::where('id', $id)->update(['sort_order' => $index]);
        }

        return redirect()->back()->with('success', 'Order updated.');
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
            'sort_order' => Skill::max('sort_order') + 1,
        ]);

        return response()->json(['name' => $skill->name]);
    }
}