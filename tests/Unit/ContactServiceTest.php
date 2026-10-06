<?php

namespace Tests\Unit;

use App\Mail\ContactAutoReplyMail;
use App\Mail\ContactFormMail;
use App\Models\Message;
use App\Services\ContactService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_handles_contact_submission_persisting_and_sending_emails(): void
    {
        Mail::fake();

        $service = app(ContactService::class);
        $message = $service->handle([
            'name' => 'Alice',
            'email' => 'alice@example.com',
            'subject' => 'Hello',
            'message' => 'Test message content',
        ]);

        $this->assertInstanceOf(Message::class, $message);
        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'sender_name' => 'Alice',
            'sender_email' => 'alice@example.com',
            'subject' => 'Hello',
            'message' => 'Test message content',
        ]);

        Mail::assertSent(ContactFormMail::class);
        Mail::assertSent(ContactAutoReplyMail::class);
    }
}
