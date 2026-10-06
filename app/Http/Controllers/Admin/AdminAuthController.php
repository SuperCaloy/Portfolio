<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SendOtpRequest;
use App\Http\Requests\Admin\VerifyOtpRequest;
use App\Services\AdminAuthService;
use App\Services\LoginAttemptLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;

class AdminAuthController extends Controller
{
    public function __construct(
        private AdminAuthService $authService,
        private LoginAttemptLogger $logger
    ) {}

    public function sendOtp(SendOtpRequest $request): JsonResponse
    {
        $key = 'send-otp:' . $request->ip();

        if ($response = $this->checkRateLimit($key, 3, 'password')) {
            return $response;
        }

        $success = $this->authService->initiateLogin(
            $request->validated()['password'],
        );

        $this->logger->log($request, 'otp_sent', $success ? 'success' : 'failed');

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

        if ($response = $this->checkRateLimit($key, 5, 'otp_code')) {
            return $response;
        }

        $user = $this->authService->verifyOtp(
            $request->validated()['otp_code'],
        );

        $this->logger->log($request, 'otp_verified', $user ? 'success' : 'failed');

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

    private function checkRateLimit(string $key, int $max, string $field): ?JsonResponse
    {
        if (RateLimiter::tooManyAttempts($key, $max)) {
            return response()->json([
                'errors' => [$field => ['Too many attempts, try again later.']],
            ], 429);
        }

        RateLimiter::hit($key, 600);

        return null;
    }
}