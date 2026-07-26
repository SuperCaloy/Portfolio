<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('login_attempts', function (Blueprint $table) {
            $table->string('city')->nullable()->after('ip_address');
            $table->string('region')->nullable()->after('city');
            $table->string('country')->nullable()->after('region');
            $table->string('isp')->nullable()->after('country');
        });
    }

    public function down(): void
    {
        Schema::table('login_attempts', function (Blueprint $table) {
            $table->dropColumn(['city', 'region', 'country', 'isp']);
        });
    }
};