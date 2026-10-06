<?php

namespace App\Services\CacheProfiles;

use Illuminate\Http\Request;
use Spatie\ResponseCache\CacheProfiles\CacheAllSuccessfulGetRequests;

class CacheAllSuccessfulGetRequestsExceptAdmin extends CacheAllSuccessfulGetRequests
{
    public function shouldCacheRequest(Request $request): bool
    {
        if ($this->isAdminRequest($request)) {
            return false;
        }

        return parent::shouldCacheRequest($request);
    }

    protected function isAdminRequest(Request $request): bool
    {
        $adminSlug = (string) config('app.admin_slug');

        if ($adminSlug !== '' && ($request->is("{$adminSlug}*") || $request->is("*/{$adminSlug}*"))) {
            return true;
        }

        if ($request->is('admin*')) {
            return true;
        }

        return false;
    }
}
