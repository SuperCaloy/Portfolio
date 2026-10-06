<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $trustedProxies = env('TRUSTED_PROXIES');
        if (!empty($trustedProxies)) {
            $middleware->trustProxies(at: array_map('trim', explode(',', $trustedProxies)));
        } elseif (env('APP_ENV') === 'production') {
            $middleware->trustProxies(at: '*');
        }

        $middleware->web(prepend: [
            \Spatie\ResponseCache\Middlewares\CacheResponse::class,
        ]);
        
        // Appends Inertia middleware to handle page state across web requests
        $middleware->web(append: [
            \App\Http\Middleware\RemoveXPoweredByHeader::class,
            HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException|\Illuminate\Session\TokenMismatchException $e, \Illuminate\Http\Request $request) {
            if ($request->inertia()) {
                return redirect()->guest('/');
            }
        });
    })->create();