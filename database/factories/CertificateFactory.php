<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CertificateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(4),
            'issuer' => $this->faker->company(),
            'issue_date' => $this->faker->date(),
            'expiration_date' => null,
            'credential_id' => $this->faker->uuid(),
            'credential_url' => 'https://example.com/verify',
            'image_path' => 'certificates/sample.jpg',
            'status' => 'Completed',
        ];
    }
}