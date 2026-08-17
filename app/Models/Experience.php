<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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



    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->public_id)) {
                $model->public_id = Str::random(20);
            }
        });
    }

    protected static function booted(): void
    {
        static::saved(fn () => \Illuminate\Support\Facades\Cache::forget('experiences'));
        static::deleted(fn () => \Illuminate\Support\Facades\Cache::forget('experiences'));
    }
}