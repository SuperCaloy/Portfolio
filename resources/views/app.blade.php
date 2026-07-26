<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'Portfolio') }}</title>

    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="antialiased">
    <div id="initial-loader" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#09090b;z-index:9999;">
        <div style="width:32px;height:32px;border-radius:9999px;border:2px solid #3f3f46;border-top-color:#10b981;animation:spin 0.7s linear infinite;"></div>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    @inertia
</body>
</html>