<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectRequest;
use App\Models\Project;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Skill;
class ProjectController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary)
    {
    }

    // List all projects ordered for display
    public function index()
    {
        return Inertia::render('Admin/Projects', [
            'projects' => Project::orderBy('sort_order')->get(),
            'availableSkills' => Skill::pluck('name'),
        ]);
    }

    // Create a new project, appended to the end of the current order
    public function store(ProjectRequest $request)
    {
        $data = $request->safe()->except(['image']);
        $data['sort_order'] = Project::max('sort_order') + 1;

        if ($request->hasFile('image')) {
            $uploaded = $this->cloudinary->upload($request->file('image'), 'portfolio/projects');
            $data['image_path'] = $uploaded['url'];
            $data['image_public_id'] = $uploaded['public_id'];
        }

        Project::create($data);

        return redirect()->back()->with('success', 'Project added.');
    }

    // Update an existing project, replaces cover image only if a new one is provided
    public function update(ProjectRequest $request, Project $project)
    {
        $data = $request->safe()->except(['image', 'remove_image']);

        if ($request->boolean('remove_image')) {
            if ($project->image_public_id) {
                try {
                    $this->cloudinary->delete($project->image_public_id);
                } catch (\Throwable $e) {
                    // Cloud asset may already be gone, do not block the database update
                }
            }
            $data['image_path'] = null;
            $data['image_public_id'] = null;
        } elseif ($request->hasFile('image')) {
            if ($project->image_public_id) {
                try {
                    $this->cloudinary->delete($project->image_public_id);
                } catch (\Throwable $e) {
                    // Old asset delete failed, proceed with new upload regardless
                }
            }
            $uploaded = $this->cloudinary->upload($request->file('image'), 'portfolio/projects');
            $data['image_path'] = $uploaded['url'];
            $data['image_public_id'] = $uploaded['public_id'];
        }

        $project->update($data);

        return redirect()->back()->with('success', 'Project updated.');
    }

    // Delete a project and its Cloudinary image
    public function destroy(Project $project)
    {
        if ($project->image_public_id) {
            $this->cloudinary->delete($project->image_public_id);
        }
        $project->delete();

        return redirect()->back()->with('success', 'Project deleted.');
    }

    // Persist new display order after reorder
    public function reorder(Request $request)
    {
        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:projects,id'],
        ]);

        foreach ($request->order as $index => $id) {
            Project::where('id', $id)->update(['sort_order' => $index]);
        }

        return redirect()->back()->with('success', 'Order updated.');
    }
}