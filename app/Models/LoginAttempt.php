<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;

class LoginAttempt extends Model
{
    use MassPrunable;

    protected $fillable = [
        'email',
        'ip_address',
        'city',
        'region',
        'country',
        'isp',
        'user_agent',
        'device',
        'platform',
        'browser',
        'stage',
        'status',
    ];

    public function prunable(): Builder
    {
        return static::where('created_at', '<=', now()->subDays(90));
    }
}