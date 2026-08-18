<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    // Mass assignable attributes
    protected $fillable = [
        'name',
        'category',
        'icon_name',
        'is_featured',
        'sort_order',
    ];

    // Attribute casting for boolean and integer fields
    protected $casts = [
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saved(function () {
            \Illuminate\Support\Facades\Cache::forget('skills');
            if (class_exists(\Spatie\ResponseCache\Facades\ResponseCache::class)) {
                \Spatie\ResponseCache\Facades\ResponseCache::clear();
            }
        });
        static::deleted(function () {
            \Illuminate\Support\Facades\Cache::forget('skills');
            if (class_exists(\Spatie\ResponseCache\Facades\ResponseCache::class)) {
                \Spatie\ResponseCache\Facades\ResponseCache::clear();
            }
        });
    }
}