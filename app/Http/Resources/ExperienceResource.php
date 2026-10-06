<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExperienceResource extends JsonResource
{
    use \App\Http\Resources\Concerns\FormatsDates;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'company' => $this->company,
            'role' => $this->role,
            'location' => $this->location,
            'start_date' => $this->formatDate($this->start_date),
            'end_date' => $this->formatDate($this->end_date),
            'is_current' => $this->is_current,
            'description' => $this->description,
            'achievements' => $this->achievements,
        ];
    }
}
