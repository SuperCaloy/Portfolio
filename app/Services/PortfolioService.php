<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Experience;
use App\Models\PersonalInformation;
use App\Models\Project;
use App\Models\Skill;

class PortfolioService
{
    // Public profile fields only, resume_path excluded, served through ResumeController instead
    public function getPersonalInformation()
    {
        return PersonalInformation::first([
            'id',
            'full_name',
            'professional_title',
            'bio',
            'about_me',
            'email',
            'phone',
            'github_url',
            'linkedin_url',
            'avatar_path',
        ]);
    }

    public function getSkills()
    {
        return Skill::orderBy('sort_order')->get([
            'id',
            'name',
            'category',
            'icon_name',
            'is_featured',
        ]);
    }

    // public_id exposed as id, image_public_id excluded
    public function getProjects()
    {
        return Project::orderBy('is_featured', 'desc')
            ->orderBy('sort_order')
            ->get([
                'public_id',
                'title',
                'subtitle',
                'description',
                'tech_stack',
                'github_url',
                'demo_url',
                'image_path',
                'status',
                'is_featured',
            ])
            ->map(function ($project) {
                $project->id = $project->public_id;
                unset($project->public_id);
                return $project;
            });
    }

    // public_id exposed as id
    public function getExperiences()
    {
        return Experience::orderBy('start_date', 'desc')
            ->get([
                'public_id',
                'company',
                'role',
                'location',
                'start_date',
                'end_date',
                'is_current',
                'description',
                'achievements',
            ])
            ->map(function ($experience) {
                $experience->id = $experience->public_id;
                unset($experience->public_id);
                return $experience;
            });
    }

    // public_id exposed as id, image_public_id excluded
    public function getCertificates()
    {
        return Certificate::orderBy('issue_date', 'desc')
            ->get([
                'public_id',
                'title',
                'issuer',
                'issue_date',
                'expiration_date',
                'credential_id',
                'credential_url',
                'image_path',
            ])
            ->map(function ($certificate) {
                $certificate->id = $certificate->public_id;
                unset($certificate->public_id);
                return $certificate;
            });
    }
}