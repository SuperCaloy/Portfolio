<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class SitemapAndRoutesTest extends TestCase
{
    use RefreshDatabase;
    public function test_sitemap_uses_configured_app_url(): void
    {
        Config::set('app.url', 'https://example.portfolio.test');

        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml');
        $this->assertStringContainsString('https://example.portfolio.test/projects', $response->getContent());
        $this->assertStringNotContainsString('https://ramonpacilona.site', $response->getContent());
    }

    public function test_all_section_routes_render_home_page(): void
    {
        $sections = ['projects', 'tech', 'experience', 'certificates', 'contact'];

        foreach ($sections as $section) {
            $response = $this->get("/{$section}");
            $response->assertStatus(200);
        }
    }
}
