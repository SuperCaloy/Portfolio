<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Run the migrations to create the personal_informations table
    public function up(): void
    {
        Schema::create('personal_informations', function (Blueprint $table) {
            // Primary key ID
            $table->id();

            // Your full name displayed on the portfolio
            $table->string('full_name');

            // Professional title (e.g., Computer Science Student or Aspiring Software Engineer)
            $table->string('professional_title')->nullable();

            // Short bio summary for the hero header section
            $table->text('bio');

            // Full detailed paragraph for the about section
            $table->text('about_me');

            // Contact email address
            $table->string('email');
            // Phone number
            $table->string('phone')->nullable();

            // Link to GitHub profile
            $table->string('github_url')->nullable();
            
            // Link to LinkedIn profile
            $table->string('linkedin_url')->nullable();

            // Saved file path for downloadable PDF resume
            $table->string('resume_path')->nullable();

            // Standard created_at and updated_at timestamps
            $table->timestamps();
        });
    }

    // Reverse the migrations by dropping the table
    public function down(): void
    {
        Schema::dropIfExists('personal_informations');
    }
};