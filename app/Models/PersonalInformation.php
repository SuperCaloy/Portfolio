<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonalInformation extends Model
{
    use HasFactory;

    // Explicitly define table name
    protected $table = 'personal_informations';

    // Mass assignable attributes
    protected $fillable = [
    'full_name',
    'professional_title',
    'bio',
    'about_me',
    'email',
    'phone',
    'github_url',
    'linkedin_url',
    'resume_path',
    'resume_public_id',
    'avatar_path',
    'avatar_public_id',
    ];

    protected static function booted(): void
    {
        static::saved(fn () => \Illuminate\Support\Facades\Cache::forget('personal_information'));
        static::deleted(fn () => \Illuminate\Support\Facades\Cache::forget('personal_information'));
    }
}