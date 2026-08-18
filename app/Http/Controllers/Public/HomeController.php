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
        $personal = $this->portfolio->getPersonalInformation();
        if (!empty($personal->avatar_path)) {
            \Illuminate\Support\Facades\View::share('avatar_path', $personal->avatar_path);
        }

        return Inertia::render('Home', [
            'personal' => $personal,
            'skills' => $this->portfolio->getSkills(),
            'projects' => $this->portfolio->getProjects(),
            'experiences' => $this->portfolio->getExperiences(),
            'certificates' => $this->portfolio->getCertificates(),
        ]);
    }
}