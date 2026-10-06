<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class OtpSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_model_hides_otp_code_and_expiry_on_serialization(): void
    {
        $user = User::factory()->create([
            'otp_code' => Hash::make('123456'),
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        $serialized = $user->toArray();

        $this->assertArrayNotHasKey('otp_code', $serialized, 'otp_code must be hidden from serialization.');
        $this->assertArrayNotHasKey('otp_expires_at', $serialized, 'otp_expires_at must be hidden from serialization.');
        $this->assertFalse($user->isFillable('otp_code'), 'otp_code must not be mass assignable.');
        $this->assertFalse($user->isFillable('otp_expires_at'), 'otp_expires_at must not be mass assignable.');
    }

    public function test_send_otp_is_rate_limited_after_three_attempts(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('correct-password'),
        ]);

        $adminSlug = config('app.admin_slug');

        for ($i = 0; $i < 3; $i++) {
            $response = $this->postJson("/{$adminSlug}/login", [
                'password' => 'wrong-password',
            ]);
            $response->assertStatus(422);
        }

        $fourthResponse = $this->postJson("/{$adminSlug}/login", [
            'password' => 'wrong-password',
        ]);

        $fourthResponse->assertStatus(429);
    }

    public function test_rate_limit_cannot_be_bypassed_via_spoofed_forwarded_ip(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('correct-password'),
        ]);

        $adminSlug = config('app.admin_slug');

        for ($i = 0; $i < 3; $i++) {
            $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.1'])
                ->postJson("/{$adminSlug}/login", [
                    'password' => 'wrong-password',
                ]);
        }

        // An attacker from the same REMOTE_ADDR sends a spoofed X-Forwarded-For header
        $spoofedResponse = $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.1'])
            ->withHeaders(['X-Forwarded-For' => '203.0.113.199'])
            ->postJson("/{$adminSlug}/login", [
                'password' => 'wrong-password',
            ]);

        $spoofedResponse->assertStatus(429);
    }
}
