<?php

namespace App\Models;

use App\Enums\CertificateStatus;
use App\Models\Concerns\ClearsResponseCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Certificate extends Model
{
    use HasFactory, ClearsResponseCache;

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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->public_id)) {
                $model->public_id = Str::random(20);
            }
        });
    }
}