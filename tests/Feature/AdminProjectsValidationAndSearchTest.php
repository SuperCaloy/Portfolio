<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminProjectsValidationAndSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_request_validates_remove_image_boolean(): void
    {
        $user = User::factory()->create();
        $adminSlug = config('app.admin_slug');

        $response = $this->actingAs($user)->postJson("/{$adminSlug}/dashboard/projects", [
            'title' => 'Sample Project',
            'description' => 'Sample Description',
            'tech_stack' => ['PHP', 'Laravel'],
            'status' => 'Completed',
            'remove_image' => 'not-a-boolean',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['remove_image']);
    }

    public function test_project_search_properly_groups_or_condition(): void
    {
        $user = User::factory()->create();
        $adminSlug = config('app.admin_slug');

        // Project A: matching title, status Completed
        Project::factory()->create([
            'title' => 'Target Match',
            'tech_stack' => ['PHP'],
            'status' => 'Completed',
        ]);

        // Project B: matching tech_stack, status Completed
        Project::factory()->create([
            'title' => 'Other Title',
            'tech_stack' => ['Target'],
            'status' => 'Completed',
        ]);

        // Non-matching project
        Project::factory()->create([
            'title' => 'Unrelated',
            'tech_stack' => ['Python'],
            'status' => 'Archived',
        ]);

        $response = $this->actingAs($user)->get("/{$adminSlug}/dashboard/projects?search=Target");

        $response->assertStatus(200);
        $pageProjects = $response->viewData('page')['props']['projects']['data'];
        $this->assertCount(2, $pageProjects);
    }
}
