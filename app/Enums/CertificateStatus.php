<?php

namespace App\Enums;

enum CertificateStatus: string
{
    case Completed = 'Completed';
    case InProgress = 'In Progress';
    case Expired = 'Expired';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
