<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class PerformanceIndexesMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_performance_indexes_are_applied_to_portfolio_tables(): void
    {
        $this->assertTrue(Schema::hasIndex('projects', ['is_featured', 'sort_order']));
        $this->assertTrue(Schema::hasIndex('projects', ['status']));

        $this->assertTrue(Schema::hasIndex('skills', ['category', 'sort_order']));
        $this->assertTrue(Schema::hasIndex('skills', ['is_featured']));

        $this->assertTrue(Schema::hasIndex('experiences', ['is_current', 'start_date']));

        $this->assertTrue(Schema::hasIndex('certificates', ['status', 'issue_date']));

        $this->assertTrue(Schema::hasIndex('messages', ['is_read', 'created_at']));
    }

    public function test_performance_indexes_can_be_rolled_back(): void
    {
        $this->artisan('migrate:rollback', ['--step' => 1])->assertSuccessful();

        $this->assertFalse(Schema::hasIndex('projects', ['is_featured', 'sort_order']));
        $this->assertFalse(Schema::hasIndex('projects', ['status']));
        $this->assertFalse(Schema::hasIndex('skills', ['category', 'sort_order']));
        $this->assertFalse(Schema::hasIndex('skills', ['is_featured']));
        $this->assertFalse(Schema::hasIndex('experiences', ['is_current', 'start_date']));
        $this->assertFalse(Schema::hasIndex('certificates', ['status', 'issue_date']));
        $this->assertFalse(Schema::hasIndex('messages', ['is_read', 'created_at']));
    }
}
