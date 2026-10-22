<?php

namespace App\Models;

use App\Enums\CertificateStatus;
use App\Models\Concerns\ClearsResponseCache;
use App\Models\Concerns\HasPublicId;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory, ClearsResponseCache, HasPublicId;

    protected string $cacheKey = 'certificates';

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

    // Attribute casting for date and enum fields
    protected $casts = [
        'status' => CertificateStatus::class,
        'issue_date' => 'date',
        'expiration_date' => 'date',
    ];
}