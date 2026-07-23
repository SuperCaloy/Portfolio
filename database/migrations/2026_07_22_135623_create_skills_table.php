<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Run the migrations to create the skills table
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            // Primary key ID
            $table->id();

            // Name of the technical skill
            $table->string('name');

            // Category group for the skill
            $table->enum('category', ['Backend', 'Frontend', 'Database', 'DevOps', 'Tools']);

            // Icon identifier or class name for rendering UI icons
            $table->string('icon_name')->nullable();

            // Highlight flag to feature primary skills
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
        Schema::dropIfExists('skills');
    }
};