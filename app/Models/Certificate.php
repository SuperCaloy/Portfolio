<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Certificate extends Model
{
    use HasFactory;

    // Mass assignable attributes
    protected $fillable = [
        'title',
        'issuer',
        'issue_date',
        'expiration_date',
        'credential_id',
        'credential_url',
        'image_path',
        'image_public_id',
        'status',
    ];

    // Attribute casting for date fields
    protected $casts = [
        'issue_date' => 'date',
        'expiration_date' => 'date',
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
        static::saved(function () {
            \Illuminate\Support\Facades\Cache::forget('certificates');
            if (class_exists(\Spatie\ResponseCache\Facades\ResponseCache::class)) {
                \Spatie\ResponseCache\Facades\ResponseCache::clear();
            }
        });
        static::deleted(function () {
            \Illuminate\Support\Facades\Cache::forget('certificates');
            if (class_exists(\Spatie\ResponseCache\Facades\ResponseCache::class)) {
                \Spatie\ResponseCache\Facades\ResponseCache::clear();
            }
        });
    }
}