<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create or update the primary admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Admin User Setup');

        $email = $this->ask('Enter admin email address (for receiving OTPs)');
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Invalid email format.');
            return 1;
        }

        $password = $this->secret('Enter admin password');
        $confirm = $this->secret('Confirm admin password');

        if ($password !== $confirm) {
            $this->error('Passwords do not match.');
            return 1;
        }

        if (strlen($password) < 8) {
            $this->error('Password must be at least 8 characters long.');
            return 1;
        }

        // We only support 1 admin user to keep the auth flow simple
        $user = User::first();

        if ($user) {
            $user->update([
                'email' => $email,
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ]);
            $this->info('Existing admin user updated successfully.');
        } else {
            User::create([
                'name' => 'Admin User',
                'email' => $email,
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ]);
            $this->info('Admin user created successfully.');
        }

        return 0;
    }
}
