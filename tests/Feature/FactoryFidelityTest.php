<?php

namespace Tests\Feature;

use App\Models\Experience;
use App\Models\PersonalInformation;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FactoryFidelityTest extends TestCase
{
    use RefreshDatabase;

    public function test_skill_factory_can_create_multiple_records_without_unique_collision(): void
    {
        $skills = Skill::factory(10)->create();

        $this->assertCount(10, $skills);
        $this->assertSame(10, Skill::count());
    }

    public function test_experience_factory_supports_past_and_current_states(): void
    {
        $current = Experience::factory()->current()->create();
        $this->assertTrue($current->is_current);
        $this->assertNull($current->end_date);

        $past = Experience::factory()->past()->create();
        $this->assertFalse($past->is_current);
        $this->assertNotNull($past->end_date);
    }

    public function test_project_factory_randomizes_status_and_provides_dates(): void
    {
        $project = Project::factory()->create();

        $this->assertContains($project->status->value, ['Completed', 'In Progress', 'Archived']);
        $this->assertNotNull($project->start_date);
    }

    public function test_personal_information_factory_provides_phone_and_avatar(): void
    {
        $info = PersonalInformation::factory()->create();

        $this->assertNotNull($info->phone);
        $this->assertNotNull($info->avatar_path);
    }
}
