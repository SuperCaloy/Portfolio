<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(\Cloudinary\Cloudinary::class, function () {
            return new \Cloudinary\Cloudinary([
                'cloud' => [
                    'cloud_name' => config('services.cloudinary.cloud_name'),
                    'api_key' => config('services.cloudinary.api_key'),
                    'api_secret' => config('services.cloudinary.api_secret'),
                ],
            ]);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Global unwrapped JSON resources for public API and Inertia responses
        JsonResource::withoutWrapping();
    }
}
