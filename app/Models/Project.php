<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use App\Models\Concerns\ClearsResponseCache;
use App\Models\Concerns\HasPublicId;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory, ClearsResponseCache, HasPublicId;

    protected string $cacheKey = 'projects';

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

    // Attribute casting for JSON array, date, enum, and boolean conversion
    protected $casts = [
        'status' => ProjectStatus::class,
        'tech_stack' => 'array',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}