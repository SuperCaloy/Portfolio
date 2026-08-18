<?php

namespace App\Services;

use App\Mail\OtpCodeMail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AdminAuthService
{
    // Verify password, then generate and email OTP
    public function initiateLogin(string $password): bool
    {
        $user = User::first();

        if (! $user || ! Hash::check($password, $user->password)) {
            return false;
        }

        $otp = random_int(100000, 999999);

        $user->update([
            'otp_code' => Hash::make((string) $otp),
            'otp_expires_at' => now()->addMinutes(5),
        ]);

        Mail::to($user->email)->send(new OtpCodeMail($otp));

        return true;
    }

    // Verify OTP and expiry, clear code after use
    public function verifyOtp(string $otpCode): ?User
    {
        $user = User::where('otp_expires_at', '>', now())
            ->first();

        if (! $user || ! Hash::check($otpCode, $user->otp_code)) {
            return null;
        }

        $user->update([
            'otp_code' => null,
            'otp_expires_at' => null,
        ]);

        return $user;
    }
}