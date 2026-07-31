<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectRequest;
use App\Models\Project;
use App\Models\Skill;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary)
    {
    }

    // List projects, most recent start date first, supports search and pagination
    public function index(Request $request)
    {
        $projects = Project::when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhereJsonContains('tech_stack', $search);
            })
            ->orderBy('start_date', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Projects', [
            'projects' => $projects,
            'filters' => $request->only('search'),
            'availableSkills' => Skill::pluck('name'),
        ]);
    }

    // Create a new project
    public function store(ProjectRequest $request)
    {
        $data = $request->safe()->except(['image']);

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
}