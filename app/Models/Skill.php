<?php

namespace App\Models;

use App\Enums\SkillCategory;
use App\Models\Concerns\ClearsResponseCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory, ClearsResponseCache;

    protected string $cacheKey = 'skills';

    // Mass assignable attributes
    protected $fillable = [
        'name',
        'category',
        'icon_name',
        'is_featured',
        'sort_order',
    ];

    // Attribute casting for boolean, integer, and enum fields
    protected $casts = [
        'category' => SkillCategory::class,
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
    ];
}