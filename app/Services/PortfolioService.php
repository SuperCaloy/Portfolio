<?php

namespace App\Services;

use App\Http\Resources\CertificateResource;
use App\Http\Resources\ExperienceResource;
use App\Http\Resources\PersonalInformationResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\SkillResource;
use App\Models\Certificate;
use App\Models\Experience;
use App\Models\PersonalInformation;
use App\Models\Project;
use App\Models\Skill;

class PortfolioService
{
    public function getPersonalInformation(): ?array
    {
        $info = PersonalInformation::first([
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
            'resume_path',
        ]);
        
        return $info ? (new PersonalInformationResource($info))->resolve() : null;
    }

    public function getSkills(): array
    {
        $skills = Skill::orderBy('sort_order')->get([
            'id',
            'name',
            'category',
            'icon_name',
            'is_featured',
        ]);
        
        return SkillResource::collection($skills)->resolve();
    }

    public function getProjects(): array
    {
        $projects = Project::orderBy('is_featured', 'desc')
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
                'start_date',
                'end_date',
                'is_featured',
            ]);
            
        return ProjectResource::collection($projects)->resolve();
    }

    public function getExperiences(): array
    {
        $experiences = Experience::orderBy('start_date', 'desc')
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
            ]);
            
        return ExperienceResource::collection($experiences)->resolve();
    }

    public function getCertificates(): array
    {
        $certificates = Certificate::orderBy('issue_date', 'desc')
            ->get([
                'public_id',
                'title',
                'issuer',
                'issue_date',
                'expiration_date',
                'credential_id',
                'credential_url',
                'image_path',
            ]);
            
        return CertificateResource::collection($certificates)->resolve();
    }
}