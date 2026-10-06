<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SkillFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Skill ' . $this->faker->unique()->numberBetween(1, 100000),
            'category' => $this->faker->randomElement(['Backend', 'Frontend', 'Database', 'DevOps', 'Tools']),
            'icon_name' => 'code',
            'is_featured' => $this->faker->boolean(70),
            'sort_order' => $this->faker->numberBetween(0, 10),
        ];
    }
}