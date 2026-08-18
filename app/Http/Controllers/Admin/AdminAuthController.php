<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SendOtpRequest;
use App\Http\Requests\Admin\VerifyOtpRequest;
use App\Models\LoginAttempt;
use App\Services\AdminAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Jenssegers\Agent\Agent;

class AdminAuthController extends Controller
{
    public function __construct(private AdminAuthService $authService) {}

    public function sendOtp(SendOtpRequest $request): JsonResponse
    {
        $key = 'send-otp:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            return response()->json([
                'errors' => ['password' => ['Too many attempts, try again later.']],
            ], 429);
        }

        RateLimiter::hit($key, 600);

        $success = $this->authService->initiateLogin(
            $request->string('password'),
        );

        $this->logAttempt($request, 'otp_sent', $success ? 'success' : 'failed');

        if (! $success) {
            return response()->json([
                'errors' => ['password' => ['Invalid credentials.']],
            ], 422);
        }

        return response()->json(['message' => 'OTP sent.']);
    }

    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $key = 'verify-otp:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json([
                'errors' => ['otp_code' => ['Too many attempts, try again later.']],
            ], 429);
        }

        RateLimiter::hit($key, 600);

        $user = $this->authService->verifyOtp(
            $request->string('otp_code'),
        );

        $this->logAttempt($request, 'otp_verified', $user ? 'success' : 'failed');

        if (! $user) {
            return response()->json([
                'errors' => ['otp_code' => ['Invalid or expired code.']],
            ], 422);
        }

        RateLimiter::clear($key);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'redirect' => '/' . config('app.admin_slug') . '/dashboard',
        ]);
    }

    public function logout(): \Illuminate\Http\RedirectResponse
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect('/');
    }

    // Records every login stage attempt with parsed device info and rough
    // IP based location for the admin activity log. Failures never block
    // the response, logging must not interrupt the actual login flow.
    private function logAttempt(Request $request, string $stage, string $status): void
    {
        $agent = new Agent();
        $agent->setUserAgent($request->userAgent());

        $location = $this->lookupLocation($request->ip());

        LoginAttempt::create([
            'email' => 'admin', // Placeholder since email is removed from login flow
            'ip_address' => $request->ip(),
            'city' => $location['city'] ?? null,
            'region' => $location['region'] ?? null,
            'country' => $location['country'] ?? null,
            'isp' => $location['isp'] ?? null,
            'user_agent' => $request->userAgent(),
            'device' => $agent->device() ?: null,
            'platform' => $agent->platform() ?: null,
            'browser' => $agent->browser() ?: null,
            'stage' => $stage,
            'status' => $status,
        ]);
    }

    // Looks up rough geolocation for the given IP using ip-api.com free
    // tier. Returns an empty array on any failure so login logging never
    // breaks because of a third party outage.
    private function lookupLocation(string $ip): array
    {
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