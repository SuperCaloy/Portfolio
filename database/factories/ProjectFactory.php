<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'subtitle' => $this->faker->sentence(6),
            'description' => $this->faker->paragraphs(3, true),
            'tech_stack' => ['Laravel', 'React', 'TailwindCSS'],
            'demo_url' => 'https://example.com',
            'github_url' => 'https://github.com',
            'image_path' => 'projects/sample.jpg',
            'status' => 'Completed',
            'is_featured' => $this->faker->boolean(70),
            'sort_order' => $this->faker->numberBetween(0, 10),
        ];
    }
}