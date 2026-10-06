<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    use \App\Http\Resources\Concerns\FormatsDates;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'description' => $this->description,
            'tech_stack' => $this->tech_stack,
            'github_url' => $this->github_url,
            'demo_url' => $this->demo_url,
            'image_path' => $this->image_path,
            'status' => $this->status,
            'start_date' => $this->formatDate($this->start_date),
            'end_date' => $this->formatDate($this->end_date),
            'is_featured' => $this->is_featured,
        ];
    }
}
