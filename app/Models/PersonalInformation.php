<?php

namespace App\Models;

use App\Models\Concerns\ClearsResponseCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonalInformation extends Model
{
    use HasFactory, ClearsResponseCache;

    protected string $cacheKey = 'personal_information';

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
}