<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'sender_name' => $this->faker->name(),
            'sender_email' => $this->faker->safeEmail(),
            'subject' => $this->faker->sentence(4),
            'message' => $this->faker->paragraph(),
            'is_read' => false,
            'admin_notes' => null,
        ];
    }
}