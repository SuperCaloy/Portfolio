<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Run the migrations to create the projects table
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            // Primary key ID
            $table->id();

            // Project title
            $table->string('title');

            // Optional tagline or short subtitle
            $table->string('subtitle')->nullable();

            // Full project description
            $table->text('description');

            // Tech stack tags stored as JSON array (e.g., ["Laravel", "React"])
            $table->json('tech_stack');

            // Live demo or application URL
            $table->string('demo_url')->nullable();

            // Source code repository URL
            $table->string('github_url')->nullable();

            // Uploaded thumbnail or preview image path
            $table->string('image_path')->nullable();

            // Status tracking (e.g., Completed, In Progress, Archived)
            $table->enum('status', ['Completed', 'In Progress', 'Archived'])->default('Completed');

            // Highlight status to feature on the homepage
            $table->boolean('is_featured')->default(false);

            // Manual display ordering weight
            $table->integer('sort_order')->default(0);

            // Standard timestamps
            $table->timestamps();
        });
    }

    // Reverse the migrations by dropping the table
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};