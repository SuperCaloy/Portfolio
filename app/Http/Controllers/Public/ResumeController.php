<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\PersonalInformation;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;

class ResumeController extends Controller
{
    // Streams the resume PDF through our own domain, Cloudinary URL never shown
    public function download()
    {
        $profile = PersonalInformation::first();

        if (! $profile || ! $profile->resume_path) {
            abort(404, 'Resume not available.');
        }

        $response = Http::get($profile->resume_path);

        if ($response->failed()) {
            abort(404, 'Resume not available.');
        }

        return new Response($response->body(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="resume.pdf"',
        ]);
    }
}