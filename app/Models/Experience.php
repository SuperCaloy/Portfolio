<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    // Mass assignable attributes
    protected $fillable = [
        'company',
        'role',
        'location',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'achievements',
    ];

    // Attribute casting for JSON array, dates, and boolean
    protected $casts = [
        'achievements' => 'array',
        'is_current' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}