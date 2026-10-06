<?php

namespace App\Enums;

enum ProjectStatus: string
{
    case Completed = 'Completed';
    case InProgress = 'In Progress';
    case Archived = 'Archived';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
