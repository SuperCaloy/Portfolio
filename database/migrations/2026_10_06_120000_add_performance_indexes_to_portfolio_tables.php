<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->index(['is_featured', 'sort_order']);
            $table->index('status');
        });

        Schema::table('skills', function (Blueprint $table) {
            $table->index(['category', 'sort_order']);
            $table->index('is_featured');
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->index(['is_current', 'start_date']);
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->index(['status', 'issue_date']);
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->index(['is_read', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex(['is_featured', 'sort_order']);
            $table->dropIndex(['status']);
        });

        Schema::table('skills', function (Blueprint $table) {
            $table->dropIndex(['category', 'sort_order']);
            $table->dropIndex(['is_featured']);
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->dropIndex(['is_current', 'start_date']);
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->dropIndex(['status', 'issue_date']);
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex(['is_read', 'created_at']);
        });
    }
};
