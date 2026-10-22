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
    <meta property="og:url" content="{{ config('app.url') }}" inertia>
    <meta property="og:image" content="{{ url('/images/og-preview.png') }}" inertia>
    <meta name="twitter:card" content="summary_large_image" inertia>
    <meta name="twitter:title" content="Ramon Pacilona | Backend Developer & Cybersecurity" inertia>
    <meta name="twitter:description" content="Portfolio of Ramon Pacilona: Backend Developer and Cybersecurity Specialist specializing in Laravel, React, and Software-Defined Networking." inertia>
    <meta name="twitter:image" content="{{ url('/images/og-preview.png') }}" inertia>

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

    <link rel="canonical" href="{{ config('app.url') }}">
    <meta name="theme-color" content="#09090b">

    <script type="application/ld+json">
    {!! json_encode([
      chr(64) . 'context' => 'https://schema.org',
      chr(64) . 'type' => 'Person',
      'name' => 'Ramon Pacilona',
      'jobTitle' => 'Backend Developer & Cybersecurity Specialist',
      'url' => config('app.url'),
      'sameAs' => [
        'https://github.com/SuperCaloy',
        'https://www.linkedin.com/in/ramoncarlospacilona',
      ],
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
    </script>

    <link rel="preconnect" href="https://res.cloudinary.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700;800&display=swap&subset=latin" rel="stylesheet">
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
            
            {{-- Inline Critical CSS --}}
            @foreach($cssFiles as $cssFile)
                @if(file_exists(public_path('build/' . $cssFile)))
                    <style>{!! file_get_contents(public_path('build/' . $cssFile)) !!}</style>
                @endif
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
    <div id="initial-loader" style="position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#09090B;transition:opacity 0.4s ease, transform 0.4s ease;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;">
            <div style="font-family:'Kanit',system-ui,sans-serif;font-size:32px;font-weight:900;letter-spacing:0.04em;text-transform:uppercase;background:linear-gradient(180deg,#828A98 0%,#D4E2EC 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;color:transparent;">
                Ramon Pacilona
            </div>
            <div style="width:160px;height:2px;border-radius:999px;background:rgba(255,255,255,0.08);overflow:hidden;position:relative;">
                <div style="position:absolute;inset:0;background:linear-gradient(90deg,#10B981,#34D399,#60A5FA);animation:loaderPulse 1.2s ease-in-out infinite;"></div>
            </div>
            <span style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#10B981;">INITIALIZING SYSTEM</span>
        </div>
        <style>
            @keyframes loaderPulse {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0); }
                100% { transform: translateX(100%); }
            }
        </style>
    </div>
    @inertia
</body>
</html>