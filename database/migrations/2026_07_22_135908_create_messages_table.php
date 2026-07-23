<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Run the migrations to create the messages table
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            // Primary key ID
            $table->id();

            // Name of the visitor or recruiter submitting the contact form
            $table->string('sender_name');

            // Email address of the sender for replies
            $table->string('sender_email');

            // Subject line of the contact message
            $table->string('subject')->nullable();

            // Body text of the contact message
            $table->text('message');

            // Flag indicating whether you have viewed the message in the admin panel
            $table->boolean('is_read')->default(false);

            // Optional internal notes for managing leads/recruiters
            $table->text('admin_notes')->nullable();

            // Standard timestamps
            $table->timestamps();
        });
    }

    // Reverse the migrations by dropping the table
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};