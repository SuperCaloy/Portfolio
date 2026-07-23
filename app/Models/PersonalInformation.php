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
        'email',
        'phone',
        'github_url',
        'linkedin_url',
        'resume_path',
        'avatar_path',
    ];
}