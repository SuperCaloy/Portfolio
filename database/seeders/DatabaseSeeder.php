<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\Experience;
use App\Models\PersonalInformation;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->isProduction()) {
            return;
        }

        // 1. Profile information
        PersonalInformation::firstOrCreate(
            ['email' => 'ramoncarlospacilona22@gmail.com'],
            [
                'full_name' => 'Ramon Pacilona',
                'professional_title' => 'Aspiring Backend Developer & Cybersecurity Specialist',
                'bio' => 'Computer Science student exploring backend systems, application security, and software development.',
                'about_me' => 'I am a Computer Science student focused on backend development, web security, and hands-on application creation. I enjoy taking on complex technical challenges, whether that involves managing database structures, developing core backend logic, or exploring security testing and penetration testing concepts. I actively integrate AI tools into my daily workflow to move faster and solve problems efficiently, while continuously building practical software and expanding my skills across systems and security.',
                'github_url' => 'https://github.com/SuperCaloy',
                'linkedin_url' => 'https://www.linkedin.com/in/ramoncarlospacilona',
                'resume_path' => 'https://res.cloudinary.com/uv8dojhb/image/upload/v1786940225/portfolio/resume/RamonCarlosEPacilona_resume_hwc1n2.pdf',
                'resume_public_id' => 'portfolio/resume/RamonCarlosEPacilona_resume_hwc1n2',
            ]
        );

        // 2. Real skills
        $skills = [
            ['name' => 'PHP', 'category' => 'Backend', 'icon_name' => null, 'is_featured' => true, 'sort_order' => 1],
            ['name' => 'Laravel', 'category' => 'Backend', 'icon_name' => null, 'is_featured' => true, 'sort_order' => 2],
            ['name' => 'React', 'category' => 'Frontend', 'icon_name' => null, 'is_featured' => true, 'sort_order' => 3],
            ['name' => 'MySQL', 'category' => 'Database', 'icon_name' => null, 'is_featured' => true, 'sort_order' => 4],
            ['name' => 'Docker', 'category' => 'DevOps', 'icon_name' => null, 'is_featured' => true, 'sort_order' => 5],
            ['name' => 'Java', 'category' => 'Backend', 'icon_name' => null, 'is_featured' => true, 'sort_order' => 6],
            ['name' => 'Python', 'category' => 'Backend', 'icon_name' => null, 'is_featured' => true, 'sort_order' => 7],
            ['name' => 'CSS', 'category' => 'Frontend', 'icon_name' => null, 'is_featured' => false, 'sort_order' => 12],
            ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'icon_name' => 'Tailwind css', 'is_featured' => false, 'sort_order' => 15],
            ['name' => 'Git', 'category' => 'Tools', 'icon_name' => null, 'is_featured' => false, 'sort_order' => 16],
            ['name' => 'Node.js', 'category' => 'Frontend', 'icon_name' => null, 'is_featured' => false, 'sort_order' => 0],
            ['name' => 'Typescript', 'category' => 'Frontend', 'icon_name' => null, 'is_featured' => false, 'sort_order' => 0],
        ];
        foreach ($skills as $skill) {
            Skill::firstOrCreate(['name' => $skill['name']], $skill);
        }

        // 3. Real projects
        $projects = [
            [
                'title' => 'Hybrid Machine Learning for Anomaly-Based DDoS Mitigation in Software-Defined Network',
                'subtitle' => 'A-DDoS',
                'description' => 'As Lead Programmer for A-DDoS, a cascaded ML based DDoS mitigation system for Software Defined Networks, I trained the hybrid detection models and built the backend pipeline and mitigation logic. I trained the Stage 1 Isolation Forest anomaly detector and Stage 2 Random Forest classifier for SYN, UDP and ICMP floods, and developed the 5 stage Python pipeline with flood prefiltering, entropy analysis, cascaded inference and state machine response integrated with the Ryu controller.',
                'tech_stack' => ['Python', 'Ryu SDN', 'Scikit-learn', 'Mininet'],
                'demo_url' => null,
                'github_url' => 'https://github.com/SuperCaloy',
                'image_path' => null,
                'status' => 'Completed',
                'is_featured' => true,
                'sort_order' => 0,
            ],
            [
                'title' => 'Portfolio',
                'subtitle' => 'Personal portfolio',
                'description' => 'Built my personal portfolio website using Laravel, Inertia.js, and React. Features a custom admin dashboard with complete CRUD functionality to manage projects, experiences, skills, and contact messages in real time.',
                'tech_stack' => ['Laravel', 'Inertia.js', 'React', 'Tailwind CSS'],
                'demo_url' => null,
                'github_url' => 'https://github.com/SuperCaloy/Portfolio',
                'image_path' => null,
                'status' => 'In Progress',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Ecommerce',
                'subtitle' => 'Ecommerce Group Project',
                'description' => 'Served as the backend developer for an academic group e-commerce project. Built the core application logic using Laravel and MySQL, focusing on secure OTP user authentication, database management, and full CRUD endpoints for products, user profiles, and administrative controls.',
                'tech_stack' => ['Laravel', 'MySQL', 'Tailwind CSS'],
                'demo_url' => null,
                'github_url' => 'https://github.com/SuperCaloy',
                'image_path' => null,
                'status' => 'Completed',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'BankingManagementSystem',
                'subtitle' => 'Console Banking & Account Management System',
                'description' => 'A Java and MySQL console-based banking management system supporting secure account creation, transactions, balance inquiries, and transaction logging.',
                'tech_stack' => ['Java', 'MySQL'],
                'demo_url' => null,
                'github_url' => 'https://github.com/SuperCaloy',
                'image_path' => null,
                'status' => 'Completed',
                'is_featured' => false,
                'sort_order' => 3,
            ],
            [
                'title' => 'Studium',
                'subtitle' => 'Reviewer Generation Web App',
                'description' => 'Studium is a web app that turns study notes into a complete study guide. Users upload a PDF, Word, or text file, and the app creates a summary, key terms, topic breakdowns, a concept map, and practice quizzes with explanations. It can generate up to 100 mock quizzes per reviewer, so students can practice until they feel confident. Built with Next.js, React, and Tailwind CSS.',
                'tech_stack' => ['Next.js', 'React', 'Tailwind CSS'],
                'demo_url' => null,
                'github_url' => 'https://github.com/SuperCaloy',
                'image_path' => null,
                'status' => 'In Progress',
                'is_featured' => true,
                'sort_order' => 0,
            ],
            [
                'title' => 'Pity Tracker',
                'subtitle' => 'Gacha Pull Probability Calculator',
                'description' => 'Pity Tracker, a lightweight and fully client side probability calculator for gacha games. It helps players estimate how many pulls are needed to reach 50 percent, 80 percent, and 95 percent confidence across real banners by modeling base rates, soft pity ramping, hard pity guarantees, 50/50 mechanics, and existing pity offset.',
                'tech_stack' => ['React', 'JavaScript', 'Tailwind CSS'],
                'demo_url' => null,
                'github_url' => 'https://github.com/SuperCaloy',
                'image_path' => null,
                'status' => 'In Progress',
                'is_featured' => false,
                'sort_order' => 0,
            ],
        ];
        foreach ($projects as $project) {
            Project::firstOrCreate(['title' => $project['title']], $project);
        }

        // 4. Real experiences
        $experiences = [
            [
                'company' => 'SOC 5 Shopee',
                'role' => 'Outbound Operations Associate (Part-Time)',
                'location' => 'Calamba City, Laguna',
                'start_date' => '2024-06-13',
                'end_date' => '2024-08-13',
                'is_current' => false,
                'description' => 'Handled daily package data for outbound delivery trucks at the SOC 5 hub. Used Microsoft Excel to organize scanned parcel lists, sort them by destination hub, and sent shipment reports before trucks arrived.',
                'achievements' => [
                    'Processed data for 20 to 30+ delivery trucks daily during peak sales.',
                    'Maintained high data accuracy with minimal sorting or reporting errors.',
                    'Sent shipment reports ahead of truck arrivals to speed up unloading at receiving hubs.',
                ],
            ],
            [
                'company' => 'FlyRank AI',
                'role' => 'Backend AI Engineering Intern',
                'location' => 'Chicago, Illinois',
                'start_date' => '2026-08-18',
                'end_date' => null,
                'is_current' => true,
                'description' => 'Contributed to backend AI workflow automation, data pipeline integrations, and API service development.',
                'achievements' => [],
            ],
        ];
        foreach ($experiences as $experience) {
            Experience::firstOrCreate(
                ['company' => $experience['company'], 'role' => $experience['role']],
                $experience
            );
        }

        // 5. Real certificates
        $certificates = [
            [
                'title' => 'Introduction to Cybersecurity',
                'issuer' => 'DICT-ITU DTC Initiative / Cisco Networking Academy',
                'issue_date' => '2025-10-31',
                'expiration_date' => null,
                'credential_id' => null,
                'credential_url' => null,
                'image_path' => 'https://res.cloudinary.com/uv8dojhb/image/upload/v1784903371/portfolio/certificates/netacad_page-0001_xf02eh.jpg',
                'image_public_id' => 'portfolio/certificates/netacad_page-0001_xf02eh',
                'status' => 'Completed',
            ],
            [
                'title' => 'Foundations of Cybersecurity',
                'issuer' => 'Google / Coursera',
                'issue_date' => '2026-05-30',
                'expiration_date' => null,
                'credential_id' => '6DSZXS82HWXF',
                'credential_url' => 'https://www.coursera.org/account/accomplishments/verify/8DSZX882HWXE',
                'image_path' => 'https://res.cloudinary.com/uv8dojhb/image/upload/v1784903506/portfolio/certificates/Coursera_8DSZX882HWXE_page-0001_qhd5bp.jpg',
                'image_public_id' => 'portfolio/certificates/Coursera_8DSZX882HWXE_page-0001_qhd5bp',
                'status' => 'Completed',
            ],
            [
                'title' => 'Play It Safe: Manage Security Risks',
                'issuer' => 'Google / Coursera',
                'issue_date' => '2026-06-22',
                'expiration_date' => null,
                'credential_id' => 'W0WHNTNP4H12',
                'credential_url' => 'https://www.coursera.org/account/accomplishments/verify/W0WHNTNP4H12',
                'image_path' => 'https://res.cloudinary.com/uv8dojhb/image/upload/v1785077565/portfolio/certificates/Coursera_W0WHNTNP4H12_page-0001_etyuiv.jpg',
                'image_public_id' => 'portfolio/certificates/Coursera_W0WHNTNP4H12_page-0001_etyuiv',
                'status' => 'Completed',
            ],
            [
                'title' => 'Connect and Protect: Networks and Network Security',
                'issuer' => 'Google / Coursera',
                'issue_date' => '2026-06-30',
                'expiration_date' => null,
                'credential_id' => 'O23G9RKT5Y07',
                'credential_url' => 'https://www.coursera.org/account/accomplishments/verify/O23G9RKT5Y07',
                'image_path' => 'https://res.cloudinary.com/uv8dojhb/image/upload/v1791373471/portfolio/certificates/1791372625576-c15b161c-bd82-4506-bf9a-3f1c7efccd79_1_dm3ysc.jpg',
                'image_public_id' => 'portfolio/certificates/1791372625576-c15b161c-bd82-4506-bf9a-3f1c7efccd79_1_dm3ysc',
                'status' => 'Completed',
            ],
            [
                'title' => 'Assets, Threats, and Vulnerabilities',
                'issuer' => 'Google / Coursera',
                'issue_date' => '2026-10-05',
                'expiration_date' => null,
                'credential_id' => 'KANIMMSZVZXI',
                'credential_url' => 'https://coursera.org/share/9ca7b6febf1f72ba1307ef124a73e9a6',
                'image_path' => 'https://res.cloudinary.com/uv8dojhb/image/upload/v1791373332/portfolio/certificates/1791372627240-5548d4e2-8244-4803-bf7e-ec7b7cbdd77a_1_tictmi.jpg',
                'image_public_id' => 'portfolio/certificates/1791372627240-5548d4e2-8244-4803-bf7e-ec7b7cbdd77a_1_tictmi',
                'status' => 'Completed',
            ],
            [
                'title' => 'Tools of the Trade: Linux and SQL',
                'issuer' => 'Google / Coursera',
                'issue_date' => '2026-07-13',
                'expiration_date' => null,
                'credential_id' => '56AMAAIW82MS',
                'credential_url' => 'https://www.coursera.org/account/accomplishments/certificate/56AMAAIW82MS',
                'image_path' => 'https://res.cloudinary.com/uv8dojhb/image/upload/v1791373640/portfolio/certificates/1791372624223-085f85fb-bd12-444b-8c24-11697611cf98_1_bpxc5l.jpg',
                'image_public_id' => 'portfolio/certificates/1791372624223-085f85fb-bd12-444b-8c24-11697611cf98_1_bpxc5l',
                'status' => 'Completed',
            ],
        ];
        foreach ($certificates as $certificate) {
            Certificate::firstOrCreate(['title' => $certificate['title']], $certificate);
        }

        $seedPassword = env('ADMIN_SEED_PASSWORD');
        if (!empty($seedPassword)) {
            User::firstOrCreate(
                ['email' => 'ramoncarlospacilona22@gmail.com'],
                [
                    'name' => 'Ramon Pacilona',
                    'password' => Hash::make($seedPassword),
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}