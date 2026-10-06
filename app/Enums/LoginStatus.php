<?php

namespace App\Enums;

enum LoginStatus: string
{
    case Success = 'success';
    case Failed = 'failed';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
