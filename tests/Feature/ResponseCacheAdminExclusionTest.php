<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Spatie\ResponseCache\Facades\ResponseCache;
use Tests\TestCase;

class ResponseCacheAdminExclusionTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_routes_are_not_cached_by_responsecache(): void
    {
        $user = User::factory()->create();
        $adminSlug = config('app.admin_slug');

        $request = \Illuminate\Http\Request::create("/{$adminSlug}/dashboard", 'GET');
        $request->setUserResolver(fn () => $user);

        /** @var \Spatie\ResponseCache\CacheProfiles\CacheProfile $profile */
        $profile = app(config('responsecache.cache_profile'));
        $shouldCache = $profile->shouldCacheRequest($request);

        $this->assertFalse(
            $shouldCache,
            'Admin dashboard requests must NOT be cached by ResponseCache to prevent stale admin stats or session leaks.'
        );
    }
}
