<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class IconControllerTest extends TestCase
{
    public function test_simple_icon_rejects_invalid_slug(): void
    {
        $response = $this->get('/api/icons/simple/invalid_slug!!');
        $response->assertStatus(404);
    }

    public function test_devicon_fetches_with_http_client_and_caches(): void
    {
        Http::fake([
            'cdn.jsdelivr.net/*' => Http::response('<svg>laravel</svg>', 200),
        ]);

        $response = $this->get('/api/icons/devicon/laravel');

        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'image/svg+xml')
            ->assertSee('<svg>laravel</svg>', false);
    }

    public function test_devicon_handles_upstream_failure_safely(): void
    {
        Http::fake([
            'cdn.jsdelivr.net/*' => Http::response(null, 404),
        ]);

        $response = $this->get('/api/icons/devicon/nonexistent-tech');

        $response->assertStatus(404);
    }
}
