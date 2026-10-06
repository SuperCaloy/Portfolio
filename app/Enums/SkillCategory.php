<?php

namespace App\Enums;

enum SkillCategory: string
{
    case Backend = 'Backend';
    case Frontend = 'Frontend';
    case Database = 'Database';
    case DevOps = 'DevOps';
    case Tools = 'Tools';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
