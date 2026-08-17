<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    // Mass assignable attributes
    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'tech_stack',
        'image_path',
        'image_public_id',
        'github_url',
        'demo_url',
        'status',
        'start_date',
        'end_date',
        'is_featured',
        'sort_order',
    ];

    // Attribute casting for JSON array, date, and boolean conversion
    protected $casts = [
        'tech_stack' => 'array',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
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
    static::saved(fn () => \Illuminate\Support\Facades\Cache::forget('projects'));
    static::deleted(fn () => \Illuminate\Support\Facades\Cache::forget('projects'));
}

}