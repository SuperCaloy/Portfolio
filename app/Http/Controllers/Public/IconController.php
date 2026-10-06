<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class IconController extends Controller
{
    /**
     * Proxy simple-icons SVG from node_modules.
     */
    public function simpleIcon(Request $request, string $slug): Response
    {
        if (!preg_match('/^[a-z0-9-]+$/', $slug)) {
            abort(404);
        }

        $path = base_path('node_modules/simple-icons/icons/' . $slug . '.svg');

        if (!file_exists($path)) {
            abort(404);
        }

        $svg = file_get_contents($path);

        if ($request->has('color')) {
            $color = $request->query('color');
            if (is_string($color) && preg_match('/^[a-fA-F0-9]{3,6}$/', $color)) {
                $svg = str_replace('<svg ', '<svg fill="#' . $color . '" ', $svg);
            }
        }

        return response($svg, 200, [
            'Content-Type' => 'image/svg+xml',
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }

    /**
     * Proxy devicon SVG with timeout and caching.
     */
    public function devicon(string $name): Response
    {
        if (!preg_match('/^[a-z0-9-]+$/', $name)) {
            abort(404);
        }

        $cacheKey = "devicon_{$name}";

        $svg = Cache::remember($cacheKey, now()->addYear(), function () use ($name) {
            $url = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{$name}/{$name}-original.svg";
            try {
                $response = Http::timeout(3)->get($url);
                if ($response->successful() && !empty($response->body())) {
                    return $response->body();
                }
            } catch (\Throwable) {
                return null;
            }

            return null;
        });

        if (!$svg) {
            abort(404);
        }

        return response($svg, 200, [
            'Content-Type' => 'image/svg+xml',
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }
}
