<?php

namespace App\Models\Concerns;

use Illuminate\Support\Facades\Cache;
use Spatie\ResponseCache\Facades\ResponseCache;

trait ClearsResponseCache
{
    /**
     * Boot the trait and register Eloquent saved/deleted callbacks to flush
     * both domain cache keys and the Spatie HTTP response cache.
     */
    public static function bootClearsResponseCache(): void
    {
        static::saved(function ($model) {
            static::clearModelCaches($model);
        });

        static::deleted(function ($model) {
            static::clearModelCaches($model);
        });
    }

    /**
     * Clear caches associated with this model.
     */
    protected static function clearModelCaches(mixed $model): void
    {
        if (property_exists($model, 'cacheKey') && !empty($model->cacheKey)) {
            Cache::forget($model->cacheKey);
        }

        if (class_exists(ResponseCache::class)) {
            ResponseCache::clear();
        }
    }
}
