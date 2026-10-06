<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class MediaService
{
    public function __construct(private CloudinaryService $cloudinary) {}

    // Uploads file to remote storage and returns url and public_id.
    public function upload(UploadedFile $file, string $folder): array
    {
        return $this->cloudinary->upload($file, $folder);
    }

    // Safely attempts to delete the remote asset without throwing on network
    // or CDN failures. Logs a warning and allows local database operations to proceed.
    public function deleteSafely(?string $publicId): void
    {
        if (empty($publicId)) {
            return;
        }

        try {
            $this->cloudinary->delete($publicId);
        } catch (\Throwable $e) {
            Log::warning('Media asset deletion failed', [
                'public_id' => $publicId,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
