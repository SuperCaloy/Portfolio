<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function build()
    {
        $senderName = $this->data['name'] ?? '';
        $senderEmail = $this->data['email'] ?? '';
        $subjectText = $this->data['subject'] ?? 'No Subject Provided';

        return $this->subject('New Portfolio Inquiry: ' . $subjectText)
                    ->replyTo($senderEmail, $senderName)
                    ->view('emails.contact-form');
    }
}