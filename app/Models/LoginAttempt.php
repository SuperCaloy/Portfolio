<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoginAttempt extends Model
{
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
}