<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SendOtpRequest;
use App\Http\Requests\Admin\VerifyOtpRequest;
use App\Services\AdminAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;

class AdminAuthController extends Controller
{
    public function __construct(private AdminAuthService $authService) {}

    public function sendOtp(SendOtpRequest $request): RedirectResponse
    {
        $key = 'send-otp:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            return back()->withErrors(['email' => 'Too many attempts, try again later.']);
        }

        RateLimiter::hit($key, 600);

        $success = $this->authService->initiateLogin(
            $request->string('email'),
            $request->string('password'),
        );

        if (! $success) {
            return back()->withErrors(['email' => 'Invalid credentials.']);
        }

        return back()->with('otp_sent', true);
    }

    public function verifyOtp(VerifyOtpRequest $request): RedirectResponse
    {
        $key = 'verify-otp:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            return back()->withErrors(['otp_code' => 'Too many attempts, try again later.']);
        }

        RateLimiter::hit($key, 600);

        $user = $this->authService->verifyOtp(
            $request->string('email'),
            $request->string('otp_code'),
        );

        if (! $user) {
            return back()->withErrors(['otp_code' => 'Invalid or expired code.']);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended('/' . config('app.admin_slug') . '/dashboard');
    }

    public function logout(): RedirectResponse
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect('/');
    }
}