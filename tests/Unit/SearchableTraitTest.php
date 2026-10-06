<?php

namespace Tests\Unit;

use App\Http\Controllers\Admin\Concerns\Searchable;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchableTraitTest extends TestCase
{
    use RefreshDatabase;

    private object $consumer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->consumer = new class {
            use Searchable;

            public function search($query, ?string $search, array $columns, ?callable $callback = null)
            {
                return $this->applySearch($query, $search, $columns, $callback);
            }
        };
    }

    public function test_it_does_not_modify_query_when_search_is_blank(): void
    {
        Project::factory()->create(['title' => 'Alpha']);
        Project::factory()->create(['title' => 'Beta']);

        $query = Project::query();
        $this->consumer->search($query, null, ['title']);
        $this->assertCount(2, $query->get());

        $queryBlank = Project::query();
        $this->consumer->search($queryBlank, '   ', ['title']);
        $this->assertCount(2, $queryBlank->get());
    }

    public function test_it_filters_by_specified_columns(): void
    {
        Project::factory()->create(['title' => 'Laravel Portal', 'subtitle' => 'Backend']);
        Project::factory()->create(['title' => 'React Dashboard', 'subtitle' => 'Frontend']);

        $query = Project::query();
        $this->consumer->search($query, 'Portal', ['title', 'subtitle']);
        $results = $query->get();

        $this->assertCount(1, $results);
        $this->assertSame('Laravel Portal', $results->first()->title);
    }

    public function test_it_supports_custom_callback_for_json_or_extra_columns(): void
    {
        Project::factory()->create(['title' => 'First', 'tech_stack' => ['Vue', 'Express']]);
        Project::factory()->create(['title' => 'Second', 'tech_stack' => ['Tailwind']]);

        $query = Project::query();
        $this->consumer->search($query, 'Vue', ['title'], function ($builder, $search) {
            $builder->orWhereJsonContains('tech_stack', $search);
        });

        $results = $query->get();
        $this->assertCount(1, $results);
        $this->assertSame('First', $results->first()->title);
    }
}
