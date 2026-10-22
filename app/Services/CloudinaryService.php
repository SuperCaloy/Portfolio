<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    public function __construct(private Cloudinary $cloudinary) {}

    public function upload(UploadedFile $file, string $folder): array
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);

        $result = $this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            [
                'folder' => $folder,
                'resource_type' => 'auto',
                'filename' => $originalName,
                'use_filename' => true,
                'unique_filename' => true,
            ]
        );

        return [
            'url' => $result['secure_url'],
            'public_id' => $result['public_id'],
        ];
    }

    public function delete(string $publicId, array $options = []): void
    {
        $isPdf = str_contains($publicId, '/resume/') || str_ends_with(strtolower($publicId), '.pdf');
        $resourceType = $options['resource_type'] ?? ($isPdf ? 'raw' : 'image');

        $result = $this->cloudinary->uploadApi()->destroy($publicId, ['resource_type' => $resourceType]);

        if (is_array($result) && isset($result['result']) && $result['result'] === 'not found' && $resourceType === 'image') {
            $this->cloudinary->uploadApi()->destroy($publicId, ['resource_type' => 'raw']);
        }
    }
}