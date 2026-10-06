<?php

namespace Tests\Unit;

use App\Services\CloudinaryService;
use App\Services\MediaService;
use Cloudinary\Cloudinary;
use Illuminate\Support\Facades\Log;
use Mockery;
use Tests\TestCase;

class MediaServiceTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_delete_safely_catches_exception_and_logs_warning(): void
    {
        $cloudinaryService = Mockery::mock(CloudinaryService::class);
        $cloudinaryService->shouldReceive('delete')
            ->with('sample_public_id')
            ->once()
            ->andThrow(new \RuntimeException('Connection timeout to Cloudinary'));

        Log::shouldReceive('warning')
            ->once()
            ->with('Media asset deletion failed', Mockery::subset(['public_id' => 'sample_public_id']));

        $mediaService = new MediaService($cloudinaryService);
        $mediaService->deleteSafely('sample_public_id');

        $this->assertTrue(true, 'Deletion exception was caught safely.');
    }

    public function test_delete_safely_ignores_null_or_empty_public_id(): void
    {
        $cloudinaryService = Mockery::mock(CloudinaryService::class);
        $cloudinaryService->shouldNotReceive('delete');

        $mediaService = new MediaService($cloudinaryService);
        $mediaService->deleteSafely(null);
        $mediaService->deleteSafely('');

        $this->assertTrue(true, 'Null public id safely ignored.');
    }
}
