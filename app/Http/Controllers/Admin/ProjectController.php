<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\Searchable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectRequest;
use App\Models\Project;
use App\Models\Skill;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    use Searchable;

    public function __construct(protected MediaService $media)
    {
    }

    // List projects, most recent start date first, supports search and pagination
    public function index(Request $request)
    {
        $query = Project::query();
        $this->applySearch($query, $request->search, ['title'], function ($builder, $search) {
            $builder->orWhereJsonContains('tech_stack', $search);
        });

        $projects = $query->orderBy('start_date', 'desc')
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
            $uploaded = $this->media->upload($request->file('image'), 'portfolio/projects');
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
            $this->media->deleteSafely($project->image_public_id);
            $data['image_path'] = null;
            $data['image_public_id'] = null;
        } elseif ($request->hasFile('image')) {
            $this->media->deleteSafely($project->image_public_id);
            $uploaded = $this->media->upload($request->file('image'), 'portfolio/projects');
            $data['image_path'] = $uploaded['url'];
            $data['image_public_id'] = $uploaded['public_id'];
        }

        $project->update($data);

        return redirect()->back()->with('success', 'Project updated.');
    }

    // Delete a project and its Cloudinary image
    public function destroy(Project $project)
    {
        $this->media->deleteSafely($project->image_public_id);
        $project->delete();

        return redirect()->back()->with('success', 'Project deleted.');
    }
}