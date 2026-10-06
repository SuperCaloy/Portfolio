<?php

namespace Tests\Feature;

use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Spatie\ResponseCache\Events\ClearedResponseCacheEvent;
use Spatie\ResponseCache\Facades\ResponseCache;
use Tests\TestCase;

class MessageCacheInvalidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_message_mutation_clears_response_cache(): void
    {
        $cleared = false;
        Event::listen(ClearedResponseCacheEvent::class, function () use (&$cleared) {
            $cleared = true;
        });

        // Triggering a message update should clear response cache
        $message = Message::create([
            'sender_name' => 'Alice',
            'sender_email' => 'alice@example.com',
            'message' => 'Hello',
            'is_read' => false,
        ]);

        $message->update(['is_read' => true]);

        $this->assertTrue($cleared, 'Updating a message must clear the response cache so admin stats and unread counts do not serve stale.');
    }
}
