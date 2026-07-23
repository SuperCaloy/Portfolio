<?php

namespace Database\Seeders;

use App\Models\PersonalInformation;
use App\Models\Project;
use App\Models\Skill;
use App\Models\Experience;
use App\Models\Certificate;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Your profile info
        PersonalInformation::create([
            'full_name' => 'Ramon Carlos E. Pacilona',
            'professional_title' => '',
            'bio' => 'One line summary shown near your name.',
            'about_me' => 'Longer paragraph about your background and goals.',
            'email' => 'ramoncarlospacilona22@gmail.com',
            'github_url' => 'https://github.com/SuperCaloy',
            'linkedin_url' => 'https://www.linkedin.com/in/ramon-carlos-pacilona-455a82290 ',
            'resume_path' => '',
        ]);

        // 2. Your real skills
        $skills = [
            ['name' => 'PHP', 'category' => 'Backend', 'icon_name' => 'code', 'is_featured' => true, 'sort_order' => 1],
            ['name' => 'Laravel', 'category' => 'Backend', 'icon_name' => 'code', 'is_featured' => true, 'sort_order' => 2],
            ['name' => 'React', 'category' => 'Frontend', 'icon_name' => 'code', 'is_featured' => true, 'sort_order' => 3],
            ['name' => 'MySQL', 'category' => 'Database', 'icon_name' => 'code', 'is_featured' => true, 'sort_order' => 4],
            ['name' => 'Docker', 'category' => 'DevOps', 'icon_name' => 'code', 'is_featured' => true, 'sort_order' => 5],
        ];
        foreach ($skills as $skill) {
            Skill::create($skill);
        }

        // 3. Your real projects
        $projects = [
            [
                'title' => 'Project Name',
                'subtitle' => 'Short one line description',
                'description' => 'Full project description, features, and your role.',
                'tech_stack' => ['Laravel', 'React', 'TailwindCSS'],
                'demo_url' => null,
                'github_url' => 'https://github.com/yourusername/project',
                'image_path' => 'projects/project1.jpg',
                'status' => 'Completed',
                'is_featured' => true,
                'sort_order' => 1,
            ],
        ];
        foreach ($projects as $project) {
            Project::create($project);
        }

        // 4. Your real work or academic experience
        $experiences = [
            [
                'company' => 'Company or School Name',
                'role' => 'Your Role',
                'location' => 'City, Country',
                'start_date' => '2024-01-01',
                'end_date' => null,
                'is_current' => true,
                'description' => 'What you did in this role.',
                'achievements' => ['Achievement one', 'Achievement two'],
            ],
        ];
        foreach ($experiences as $experience) {
            Experience::create($experience);
        }

        // 5. Your real certificates
        $certificates = [
            [
                'title' => 'Certificate Name',
                'issuer' => 'Issuing Organization',
                'issue_date' => '2025-01-01',
                'expiration_date' => null,
                'credential_id' => 'ABC123',
                'credential_url' => 'https://example.com/verify',
                'image_path' => 'certificates/cert1.jpg',
                'status' => 'Completed',
            ],
        ];
        foreach ($certificates as $certificate) {
            Certificate::create($certificate);
        }

        User::create([
            'name' => 'Ramon Carlos E. Pacilona',
            'email' => 'ramoncarlospacilona22@gmail.com',
            'password' => Hash::make(env('ADMIN_SEED_PASSWORD')),
            'email_verified_at' => now(),
        ]);
    }
}