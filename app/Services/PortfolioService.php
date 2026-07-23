<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Experience;
use App\Models\PersonalInformation;
use App\Models\Project;
use App\Models\Skill;

class PortfolioService
{
    public function getPersonalInformation()
    {
        return PersonalInformation::first();
    }

    public function getSkills()
    {
        return Skill::orderBy('sort_order')->get();
    }

    public function getProjects()
    {
        return Project::orderBy('is_featured', 'desc')->orderBy('sort_order')->get();
    }

    public function getExperiences()
    {
        return Experience::orderBy('start_date', 'desc')->get();
    }

    public function getCertificates()
    {
        return Certificate::orderBy('issue_date', 'desc')->get();
    }
}