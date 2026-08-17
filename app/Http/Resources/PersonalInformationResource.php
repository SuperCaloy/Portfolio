<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonalInformationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'professional_title' => $this->professional_title,
            'bio' => $this->bio,
            'about_me' => $this->about_me,
            'email' => $this->email,
            'phone' => $this->phone,
            'github_url' => $this->github_url,
            'linkedin_url' => $this->linkedin_url,
            'avatar_path' => $this->avatar_path,
            'resume_path' => $this->resume_path,
        ];
    }
}
