<?php

namespace Tests\Unit;

use App\Mail\ContactAutoReplyMail;
use App\Mail\ContactFormMail;
use Tests\TestCase;

class ContactMailViewsTest extends TestCase
{
    public function test_contact_form_mail_renders_blade_view_correctly(): void
    {
        $mail = new ContactFormMail([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'subject' => 'Hiring Consultation',
            'message' => 'Hello, I would like to speak with you.',
        ]);

        $rendered = $mail->render();

        $this->assertStringContainsString('New Portfolio Message', $rendered);
        $this->assertStringContainsString('Jane Smith', $rendered);
        $this->assertStringContainsString('jane@example.com', $rendered);
        $this->assertStringContainsString('Hiring Consultation', $rendered);
        $this->assertStringContainsString('Hello, I would like to speak with you.', $rendered);
    }

    public function test_contact_auto_reply_mail_renders_blade_view_correctly(): void
    {
        $mail = new ContactAutoReplyMail([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'message' => 'Hello, I would like to speak with you.',
        ]);

        $rendered = $mail->render();

        $this->assertStringContainsString('Hi Jane Smith,', $rendered);
        $this->assertStringContainsString('Thanks for reaching out through my portfolio', $rendered);
        $this->assertStringContainsString('Hello, I would like to speak with you.', $rendered);
    }
}
