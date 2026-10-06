<?php

namespace App\Models;

use App\Models\Concerns\ClearsResponseCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory, ClearsResponseCache;

    // Mass assignable attributes
    protected $fillable = [
        'sender_name',
        'sender_email',
        'subject',
        'message',
        'is_read',
        'admin_notes',
    ];

    // Attribute casting for boolean field
    protected $casts = [
        'is_read' => 'boolean',
    ];
}