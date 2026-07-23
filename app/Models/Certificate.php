<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'status',
    ];

    // Attribute casting for date fields
    protected $casts = [
        'issue_date' => 'date',
        'expiration_date' => 'date',
    ];
}