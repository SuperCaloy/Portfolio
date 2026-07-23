public function sendOtp(SendOtpRequest $request): \Illuminate\Http\JsonResponse
{
    $key = 'send-otp:' . $request->ip();

    if (RateLimiter::tooManyAttempts($key, 3)) {
        return response()->json(['errors' => ['email' => ['Too many attempts, try again later.']]], 429);
    }

    RateLimiter::hit($key, 600);

    $success = $this->authService->initiateLogin(
        $request->string('email'),
        $request->string('password'),
    );

    if (! $success) {
        return response()->json(['errors' => ['email' => ['Invalid credentials.']]], 422);
    }

    return response()->json(['message' => 'Code sent']);
}

public function verifyOtp(VerifyOtpRequest $request): \Illuminate\Http\JsonResponse
{
    $key = 'verify-otp:' . $request->ip();

    if (RateLimiter::tooManyAttempts($key, 5)) {
        return response()->json(['errors' => ['otp_code' => ['Too many attempts, try again later.']]], 429);
    }

    RateLimiter::hit($key, 600);

    $user = $this->authService->verifyOtp(
        $request->string('email'),
        $request->string('otp_code'),
    );

    if (! $user) {
        return response()->json(['errors' => ['otp_code' => ['Invalid or expired code.']]], 422);
    }

    Auth::login($user);
    $request->session()->regenerate();

    return response()->json(['redirect' => '/' . config('app.admin_slug') . '/dashboard']);
}