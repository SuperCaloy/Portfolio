<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait HasPublicId
{
    public static function bootHasPublicId(): void
    {
        static::creating(function ($model) {
            if (empty($model->public_id)) {
                do {
                    $candidate = Str::random(20);
                } while (static::where('public_id', $candidate)->exists());

                $model->public_id = $candidate;
            }
        });
    }
}
