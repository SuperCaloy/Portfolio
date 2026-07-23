<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ExperienceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'company' => $this->faker->company(),
            'role' => $this->faker->jobTitle(),
            'location' => $this->faker->city(),
            'start_date' => $this->faker->date(),
            'end_date' => null,
            'is_current' => true,
            'description' => $this->faker->paragraph(),
            'achievements' => [$this->faker->sentence(), $this->faker->sentence()],
        ];
    }
}