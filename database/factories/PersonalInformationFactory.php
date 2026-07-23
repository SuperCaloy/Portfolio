<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PersonalInformationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'professional_title' => $this->faker->jobTitle(),
            'bio' => $this->faker->sentence(10),
            'about_me' => $this->faker->paragraph(3),
            'email' => $this->faker->safeEmail(),
            'github_url' => 'https://github.com',
            'linkedin_url' => 'https://linkedin.com',
            'resume_path' => 'resumes/sample-resume.pdf',
        ];
    }
}