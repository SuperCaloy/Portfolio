<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Run the migrations to create the certificates table
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            // Primary key ID
            $table->id();

            // Name of the certificate or course
            $table->string('title');

            // Issuing organization (e.g., Coursera, AWS, Meta)
            $table->string('issuer');

            // Date the certificate was issued
            $table->date('issue_date');

            // Expiration date (nullable if it does not expire)
            $table->date('expiration_date')->nullable();

            // Official credential ID or serial number
            $table->string('credential_id')->nullable();

            // Online verification link for recruiters to view the badge
            $table->string('credential_url')->nullable();

            // Path to uploaded certificate badge or preview image
            $table->string('image_path')->nullable();

            // Certificate completion status
            $table->enum('status', ['Completed', 'In Progress', 'Expired'])->default('Completed');

            // Standard timestamps
            $table->timestamps();
        });
    }

    // Reverse the migrations by dropping the table
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};