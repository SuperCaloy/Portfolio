<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SkillFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['PHP', 'JavaScript', 'React', 'Laravel', 'Docker', 'MySQL']),
            'category' => $this->faker->randomElement(['Backend', 'Frontend', 'Database', 'DevOps', 'Tools']),
            'icon_name' => 'code',
            'is_featured' => true,
            'sort_order' => $this->faker->numberBetween(0, 10),
        ];
    }
}