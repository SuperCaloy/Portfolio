<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Run the migrations to create the experiences table
    public function up(): void
    {
        Schema::create('experiences', function (Blueprint $table) {
            // Primary key ID
            $table->id();

            // Company or organization name
            $table->string('company');

            // Job title or role
            $table->string('role');

            // Geographic location or work type (e.g., Remote, On-site)
            $table->string('location')->nullable();

            // Start date of employment
            $table->date('start_date');

            // End date of employment (nullable if currently working)
            $table->date('end_date')->nullable();

            // Flag indicating active employment status
            $table->boolean('is_current')->default(false);

            // Detailed job summary or responsibility overview
            $table->text('description');

            // Specific key achievements stored as a JSON array
            $table->json('achievements')->nullable();

            // Standard timestamps
            $table->timestamps();
        });
    }

    // Reverse the migrations by dropping the table
    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};