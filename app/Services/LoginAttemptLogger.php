<?php

namespace App\Services;

use App\Models\LoginAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Jenssegers\Agent\Agent;

class LoginAttemptLogger
{
    public function __construct(private ?Agent $agent = null)
    {
        $this->agent = $agent ?? new Agent();
    }

    // Records login attempt stage and status with parsed agent and location.
    public function log(Request $request, string $stage, string $status): void
    {
        $this->agent->setUserAgent($request->userAgent());

        $location = $this->lookupLocation($request->ip());

        LoginAttempt::create([
            'email' => 'admin',
            'ip_address' => $request->ip(),
            'city' => $location['city'] ?? null,
            'region' => $location['region'] ?? null,
            'country' => $location['country'] ?? null,
            'isp' => $location['isp'] ?? null,
            'user_agent' => $request->userAgent(),
            'device' => $this->agent->device() ?: null,
            'platform' => $this->agent->platform() ?: null,
            'browser' => $this->agent->browser() ?: null,
            'stage' => $stage,
            'status' => $status,
        ]);
    }

    // Looks up rough geolocation for the given IP using ipapi.co free tier.
    // Returns an empty array on any failure so login logging never breaks
    // because of a third party outage.
    private function lookupLocation(?string $ip): array
    {
        if (empty($ip)) {
            return [];
        }

        try {
            $response = Http::timeout(3)->get("https://ipapi.co/{$ip}/json/");

            if (! $response->successful() || $response->json('error')) {
                return [];
            }

            return [
                'country' => $response->json('country_name'),
                'region' => $response->json('region'),
                'city' => $response->json('city'),
                'isp' => $response->json('org'),
            ];
        } catch (\Throwable $e) {
            Log::warning('IP location lookup failed', ['ip' => $ip, 'error' => $e->getMessage()]);
            return [];
        }
    }
}
