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

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    @if(isset($avatar_path))
    <link rel="preload" as="image" href="{{ url($avatar_path) }}">
    @endif

    {{-- Applies the saved theme before first paint, prevents a flash of the wrong theme on load --}}
    <script>
        (function () {
            // Applies the saved theme before first paint, prevents a flash of the wrong theme on load
            // Only toggle 'dark' if it's explicitly 'dark' or if no preference is set (default to dark)
            var theme = localStorage.getItem('theme') || 'dark';
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        })();
    </script>
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="antialiased">
    <div id="initial-loader" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:9999;">
        <div style="width:32px;height:32px;border-radius:9999px;border:2px solid #d4d4d8;border-top-color:#10b981;animation:spin 0.7s linear infinite;"></div>
    </div>
    <style>
        @keyframes spin { to { transform: rotate(360deg); } }
        #initial-loader { background: #ffffff; }
        html.dark #initial-loader { background: #09090b; }
        html.dark #initial-loader div { border-color: #3f3f46; border-top-color: #10b981; }
    </style>
    @inertia
</body>
</html>