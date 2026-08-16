<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

User::firstOrCreate(
    ['email' => 'ramoncarlospacilona22@gmail.com'],
    [
        'name' => 'Ramon Carlos E. Pacilona',
        'password' => Hash::make('August222005.'),
        'email_verified_at' => now(),
    ]
);

echo "Admin user created successfully.\n";
