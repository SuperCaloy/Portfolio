<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">

    <title inertia>Ramon Pacilona | Backend Developer & Cybersecurity</title>
    <meta name="description" content="Portfolio of Ramon Pacilona: Backend Developer and Cybersecurity Specialist specializing in Laravel, React, and Software-Defined Networking." inertia>
    <meta property="og:type" content="website" inertia>
    <meta property="og:title" content="Ramon Pacilona | Backend Developer & Cybersecurity" inertia>
    <meta property="og:description" content="Portfolio of Ramon Pacilona: Backend Developer and Cybersecurity Specialist specializing in Laravel, React, and Software-Defined Networking." inertia>
@php
    $appUrl = rtrim((string) config('app.url'), '/');
    $currentHost = request()->getHost();
    $primaryDomain = 'https://ramonpacilona.site';

    $canonicalBase = (str_contains($currentHost, 'ramonpacilona.site') || str_contains($appUrl, 'onrender.com'))
        ? $primaryDomain
        : ($appUrl ?: 'https://ramonpacilona.site');

    $path = request()->getPathInfo();
    $canonicalUrl = $path === '/' ? $canonicalBase . '/' : $canonicalBase . $path;
@endphp
    <meta property="og:url" content="{{ $canonicalUrl }}" inertia>
    <meta property="og:image" content="{{ $canonicalBase . '/images/og-preview.png' }}" inertia>
    <meta name="twitter:card" content="summary_large_image" inertia>
    <meta name="twitter:title" content="Ramon Pacilona | Backend Developer & Cybersecurity" inertia>
    <meta name="twitter:description" content="Portfolio of Ramon Pacilona: Backend Developer and Cybersecurity Specialist specializing in Laravel, React, and Software-Defined Networking." inertia>
    <meta name="twitter:image" content="{{ $canonicalBase . '/images/og-preview.png' }}" inertia>

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

    <link rel="canonical" href="{{ $canonicalUrl }}">
    <meta name="theme-color" content="#09090b">

    <script type="application/ld+json">
    {!! json_encode([
      chr(64) . 'context' => 'https://schema.org',
      chr(64) . 'type' => 'Person',
      'name' => 'Ramon Pacilona',
      'jobTitle' => 'Backend Developer & Cybersecurity Specialist',
      'url' => $canonicalBase,
      'image' => $canonicalBase . '/images/og-preview.png',
      'sameAs' => [
        'https://github.com/SuperCaloy',
        'https://www.linkedin.com/in/ramoncarlospacilona',
      ],
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
    </script>

    <link rel="preconnect" href="https://res.cloudinary.com">
        <!-- Scripts -->
        
        @if (!file_exists(public_path('hot')))
            @php
                $manifestPath = public_path('build/manifest.json');
                $manifest = file_exists($manifestPath) ? json_decode(file_get_contents($manifestPath), true) : [];
                $cssFiles = [];
                $jsFiles = [];
                $preloadImports = [];
                
                $entries = ['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"];
                
                foreach ($entries as $entry) {
                    if (isset($manifest[$entry])) {
                        $jsFiles[] = $manifest[$entry]['file'];
                        if (isset($manifest[$entry]['css'])) {
                            foreach ($manifest[$entry]['css'] as $css) {
                                $cssFiles[] = $css;
                            }
                        }
                        if (isset($manifest[$entry]['imports'])) {
                            foreach ($manifest[$entry]['imports'] as $import) {
                                if (isset($manifest[$import]['file'])) {
                                    $preloadImports[] = $manifest[$import]['file'];
                                }
                            }
                        }
                    }
                }
                
                $cssFiles = array_unique($cssFiles);
                $jsFiles = array_unique($jsFiles);
                $preloadImports = array_unique($preloadImports);
            @endphp
            
            {{-- External Cached Stylesheet --}}
            @foreach($cssFiles as $cssFile)
                <link rel="stylesheet" href="{{ (app()->environment('production') || request()->isSecure() || str_starts_with((string) config('app.url'), 'https://')) ? secure_asset('build/' . $cssFile) : asset('build/' . $cssFile) }}" />
            @endforeach
            
            {{-- Module Preloads --}}
            @foreach($jsFiles as $jsFile)
                <link rel="modulepreload" href="{{ (app()->environment('production') || request()->isSecure() || str_starts_with((string) config('app.url'), 'https://')) ? secure_asset('build/' . $jsFile) : asset('build/' . $jsFile) }}" />
            @endforeach
            @foreach($preloadImports as $import)
                <link rel="modulepreload" href="{{ (app()->environment('production') || request()->isSecure() || str_starts_with((string) config('app.url'), 'https://')) ? secure_asset('build/' . $import) : asset('build/' . $import) }}" />
            @endforeach
            
            {{-- Scripts --}}
            @foreach($jsFiles as $jsFile)
                <script type="module" src="{{ (app()->environment('production') || request()->isSecure() || str_starts_with((string) config('app.url'), 'https://')) ? secure_asset('build/' . $jsFile) : asset('build/' . $jsFile) }}"></script>
            @endforeach
        @else
            @viteReactRefresh
            @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @endif
    @inertiaHead
</head>
<body class="antialiased">
    @inertia
</body>
</html>