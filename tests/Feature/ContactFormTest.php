<?php

namespace Tests\Feature;

use App\Mail\ContactAutoReplyMail;
use App\Mail\ContactFormMail;
use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_bot_filling_honeypot_gets_fake_success_without_saving_or_sending_mail(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/contact', [
            'name' => 'Spam Bot',
            'email' => 'spambot@example.com',
            'subject' => 'Buy our pills',
            'message' => 'Spam message content',
            'website' => 'http://spam-link.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Your message has been sent successfully.',
            ]);

        $this->assertSame(0, Message::count(), 'Bot submission must never be saved to database.');
        Mail::assertNothingSent();
    }

    public function test_legitimate_contact_form_saves_and_sends_both_emails(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/contact', [
            'name' => 'John Doe',
            'email' => 'john@gmail.com',
            'subject' => 'Project Inquiry',
            'message' => 'I would like to discuss a project.',
            'website' => '',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Your message has been sent successfully.',
            ]);

        $this->assertDatabaseHas('messages', [
            'sender_name' => 'John Doe',
            'sender_email' => 'john@gmail.com',
            'subject' => 'Project Inquiry',
        ]);

        Mail::assertSent(ContactFormMail::class);
        Mail::assertSent(ContactAutoReplyMail::class);
    }

    public function test_contact_form_is_throttled_after_three_requests_in_one_minute(): void
    {
        for ($i = 0; $i < 3; $i++) {
            $this->postJson('/api/contact', [
                'name' => 'John Doe',
                'email' => 'john@gmail.com',
                'message' => 'Message ' . $i,
                'website' => '',
            ]);
        }

        $fourthResponse = $this->postJson('/api/contact', [
            'name' => 'John Doe',
            'email' => 'john@gmail.com',
            'message' => 'Fourth attempt',
            'website' => '',
        ]);

        $fourthResponse->assertStatus(429);
    }
}
