<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\PortfolioService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(protected PortfolioService $portfolio)
    {
    }

    public function index()
    {
        return Inertia::render('Home', [
            'personal' => $this->portfolio->getPersonalInformation(),
            'skills' => $this->portfolio->getSkills(),
            'projects' => $this->portfolio->getProjects(),
            'experiences' => $this->portfolio->getExperiences(),
            'certificates' => $this->portfolio->getCertificates(),
        ]);
    }
}