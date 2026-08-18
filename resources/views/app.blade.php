<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>Ramon Carlos E. Pacilona | Computer Science Student</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

    <link rel="canonical" href="{{ url()->current() }}">
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)">

    <link rel="preconnect" href="https://res.cloudinary.com">


    {{-- Applies the saved theme before first paint, prevents a flash of the wrong theme on load --}}
    <script>
        (function () {
            // Applies the saved theme before first paint, prevents a flash of the wrong theme on load
            var theme = localStorage.getItem('theme') || 'dark';
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        })();
    </script>
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
                <link rel="modulepreload" href="{{ asset('build/' . $jsFile) }}" />
            @endforeach
            @foreach($preloadImports as $import)
                <link rel="modulepreload" href="{{ asset('build/' . $import) }}" />
            @endforeach
            
            {{-- Scripts --}}
            @foreach($jsFiles as $jsFile)
                <script type="module" src="{{ asset('build/' . $jsFile) }}"></script>
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