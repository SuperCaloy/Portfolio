<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Experience;
use App\Models\PersonalInformation;
use App\Models\Project;
use App\Models\Skill;
use Carbon\Carbon;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $domain = rtrim(config('app.url'), '/');

        $latestUpdate = collect([
            Project::max('updated_at'),
            Skill::max('updated_at'),
            Experience::max('updated_at'),
            Certificate::max('updated_at'),
            PersonalInformation::max('updated_at'),
        ])->filter()->max();

        $lastmod = $latestUpdate ? Carbon::parse($latestUpdate)->toAtomString() : now()->toAtomString();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        $xml .= '<url>';
        $xml .= '<loc>' . $domain . '/</loc>';
        $xml .= '<lastmod>' . $lastmod . '</lastmod>';
        $xml .= '<changefreq>weekly</changefreq>';
        $xml .= '<priority>1.0</priority>';
        $xml .= '</url>';
        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
