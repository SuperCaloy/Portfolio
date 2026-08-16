<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'title' => $this->title,
            'issuer' => $this->issuer,
            'issue_date' => $this->issue_date,
            'expiration_date' => $this->expiration_date,
            'credential_id' => $this->credential_id,
            'credential_url' => $this->credential_url,
            'image_path' => $this->image_path,
        ];
    }
}
