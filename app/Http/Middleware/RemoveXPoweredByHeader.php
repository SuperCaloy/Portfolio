<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RemoveXPoweredByHeader
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        $response->headers->remove('X-Powered-By');

        return $response;
    }
}
