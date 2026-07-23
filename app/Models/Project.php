<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    // Mass assignable attributes
        protected $fillable = [
        'title',
        'slug',
        'summary',
        'description',
        'tech_stack',
        'featured_image',
        'github_url',
        'live_demo_url',
        'status',
        'is_featured',
        'sort_order',
    ];

    // Attribute casting for JSON array and boolean conversion
    protected $casts = [
        'tech_stack' => 'array',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
    ];
    public function skills()
    {
    return $this->belongsToMany(Skill::class);
    }
}