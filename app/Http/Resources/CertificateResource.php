<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
    use \App\Http\Resources\Concerns\FormatsDates;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'title' => $this->title,
            'issuer' => $this->issuer,
            'issue_date' => $this->formatDate($this->issue_date),
            'expiration_date' => $this->formatDate($this->expiration_date),
            'credential_id' => $this->credential_id,
            'credential_url' => $this->credential_url,
            'image_path' => $this->image_path,
        ];
    }
}
