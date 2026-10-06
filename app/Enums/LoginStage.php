<?php

namespace App\Enums;

enum LoginStage: string
{
    case OtpSent = 'otp_sent';
    case OtpVerified = 'otp_verified';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
