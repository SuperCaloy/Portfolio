<?php

namespace Tests\Unit;

use App\Models\LoginAttempt;
use App\Services\LoginAttemptLogger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class LoginAttemptLoggerTest extends TestCase
{
    use RefreshDatabase;

    public function test_logs_login_attempt_with_successful_geo_lookup(): void
    {
        Http::fake([
            'https://ipapi.co/127.0.0.1/json/' => Http::response([
                'country_name' => 'United States',
                'region' => 'California',
                'city' => 'San Francisco',
                'org' => 'Cloudflare, Inc.',
            ], 200),
        ]);

        $request = Request::create('/admin/login', 'POST', [], [], [], [
            'REMOTE_ADDR' => '127.0.0.1',
            'HTTP_USER_AGENT' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ]);

        $logger = app(LoginAttemptLogger::class);
        $logger->log($request, 'otp_sent', 'success');

        $this->assertDatabaseHas('login_attempts', [
            'ip_address' => '127.0.0.1',
            'city' => 'San Francisco',
            'region' => 'California',
            'country' => 'United States',
            'isp' => 'Cloudflare, Inc.',
            'stage' => 'otp_sent',
            'status' => 'success',
            'browser' => 'Chrome',
            'platform' => 'Windows',
        ]);
    }

    public function test_logs_login_attempt_gracefully_when_geo_lookup_fails(): void
    {
        Http::fake([
            'https://ipapi.co/*' => Http::response('Service Unavailable', 503),
        ]);

        $request = Request::create('/admin/login', 'POST', [], [], [], [
            'REMOTE_ADDR' => '192.168.1.1',
            'HTTP_USER_AGENT' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        ]);

        $logger = app(LoginAttemptLogger::class);
        $logger->log($request, 'otp_sent', 'failed');

        $this->assertDatabaseHas('login_attempts', [
            'ip_address' => '192.168.1.1',
            'city' => null,
            'country' => null,
            'stage' => 'otp_sent',
            'status' => 'failed',
        ]);
    }
}
