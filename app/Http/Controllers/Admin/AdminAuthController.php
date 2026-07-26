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
                'errors' => ['email' => ['Too many attempts, try again later.']],
            ], 429);
        }

        RateLimiter::hit($key, 600);

        $success = $this->authService->initiateLogin(
            $request->string('email'),
            $request->string('password'),
        );

        $this->logAttempt($request, 'otp_sent', $success ? 'success' : 'failed');

        if (! $success) {
            return response()->json([
                'errors' => ['email' => ['Invalid credentials.']],
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
            $request->string('email'),
            $request->string('otp_code'),
        );

        $this->logAttempt($request, 'otp_verified', $user ? 'success' : 'failed');

        if (! $user) {
            return response()->json([
                'errors' => ['otp_code' => ['Invalid or expired code.']],
            ], 422);
        }

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

    // Records every login stage attempt with parsed device info for the
    // admin activity log. Failures never block the response, logging must
    // not interrupt the actual login flow.
    private function logAttempt(Request $request, string $stage, string $status): void
    {
        $agent = new Agent();
        $agent->setUserAgent($request->userAgent());

        LoginAttempt::create([
            'email' => $request->string('email'),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'device' => $agent->device() ?: null,
            'platform' => $agent->platform() ?: null,
            'browser' => $agent->browser() ?: null,
            'stage' => $stage,
            'status' => $status,
        ]);
    }
}